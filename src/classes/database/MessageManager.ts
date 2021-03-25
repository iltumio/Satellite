import { Client, decrypt, ThreadID } from '@textile/hub';
import Crypto from '../crypto/Crypto';
// @ts-ignore
import Message from '../Message';
import { utils, Wallet } from 'ethers';
import { SigningKey } from 'ethers/lib/utils';

interface Message {
  _id: string;
  sender: string;
  to: '';
  at: number;
  type: string;
  payload: any;
  encrypted: boolean;
  secure: boolean;
  metadata: object;
}

const messageSchema = <Message>{
  _id: '',
  sender: '',
  to: '',
  at: Date.now(),
  type: '',
  payload: {},
  encrypted: false,
  secure: false,
  metadata: {}
};

export class MessageManager {
  client: Client;
  crypto: Crypto;
  key: CryptoKeyPair | null;
  address: string;
  signingKey: SigningKey | null;
  activeSubscriptions: { [key: string]: any };

  constructor(client: Client, address: string) {
    this.client = client;
    this.address = address;
    this.crypto = new Crypto();
    this.key = null;
    this.signingKey = null;
    this.activeSubscriptions = {};
  }

  /**
   * @function initE2EEngine
   * @param wallet Ethers js wallet
   */
  initE2EEngine(wallet: Wallet) {
    this.signingKey = new utils.SigningKey(wallet.privateKey);
  }

  buildMessage(to: string, at: number, type: string, data: any) {
    const message = new Message(to, this.address, at, type, data);
    return {
      _id: '',
      id: message.id,
      sender: this.address,
      to: message.to,
      at: at,
      type: type,
      payload: message.payload,
      encrypted: Boolean(this.signingKey),
      secure: false,
      metadata: {}
    };
  }

  async ensureCollection(threadID: ThreadID) {
    await this.client
      .getCollectionIndexes(threadID, 'messages')
      .catch(async () => {
        await this.client.newCollectionFromObject(threadID, messageSchema, {
          name: 'messages'
        });
      });
  }

  async addMessageDeterministically(
    threadID: ThreadID,
    message: Message,
    recipient: string
  ) {
    if (this.signingKey) {
      this.addEncryptedMessage(threadID, message, recipient);
    } else {
      this.addNewMessage(threadID, message);
    }
  }

  async addNewMessage(threadID: ThreadID, message: Message): Promise<ThreadID> {
    await this.ensureCollection(threadID);
    await this.client.create(threadID, 'messages', [message]);
    return threadID;
  }

  computeSharedSecret(signingKey: SigningKey, guestPublicKey: string) {
    return signingKey.computeSharedSecret(`0x04${guestPublicKey.slice(2)}`);
  }

  async addEncryptedMessage(
    threadID: ThreadID,
    message: Message,
    guestPublicKey: string
  ): Promise<ThreadID | null> {
    if (!this.signingKey) {
      return null;
    }
    await this.ensureCollection(threadID);

    const sharedKey = this.computeSharedSecret(this.signingKey, guestPublicKey);

    const aesKey = await this.crypto.initializeRecipient(message.to, sharedKey);

    const encryptedPayload = await this.crypto.encrypt(
      JSON.stringify(message.payload),
      aesKey
    );

    const encryptedMessage = Object.assign({}, message, {
      encrypted: true,
      secure: true,
      payload: {
        encryptedData: encryptedPayload
      }
    });

    await this.client.create(threadID, 'messages', [encryptedMessage]);
    return threadID;
  }

  async decryptMessage(message: Message, guestPublicKey: string) {
    if (!message.encrypted || !this.signingKey) return message;

    const sharedKey = this.computeSharedSecret(this.signingKey, guestPublicKey);

    const aesKey = await this.crypto.initializeRecipient(message.to, sharedKey);

    try {
      const decrpytedPayload = await this.crypto.decrypt(
        message.payload.encryptedData,
        aesKey
      );

      return {
        ...message,
        encrypted: false,
        secure: true,
        payload: JSON.parse(decrpytedPayload)
      };
    } catch (e) {
      return message;
    }
  }

  async bulkDecrypt(messages: Message[], guestPublicKey: string) {
    const decryptedMessages: Promise<Message>[] = [];
    messages.map(msg =>
      decryptedMessages.push(this.decryptMessage(msg, guestPublicKey))
    );
    const resolvedMessages = await Promise.all(decryptedMessages);
    return resolvedMessages;
  }

  async getMessages(threadID: ThreadID | string): Promise<Message[]> {
    return new Promise(async resolve => {
      const safeThread =
        typeof threadID === 'string'
          ? ThreadID.fromString(threadID.replace(/\W/g, ''))
          : threadID;

      const decryptedMessages: any[] = [];

      let messages =
        (await this.client.find(safeThread, 'messages', {}).catch(err => {
          // Collection not found
          resolve([]);
        })) || [];

      resolve(<Array<Message>>messages);
    });
  }

  subscribe(threadID: ThreadID, callback: CallableFunction, onUnsubscribe: CallableFunction) {
    if (this.isSubscribed(threadID)) {
      console.warn(
        `Already subscribed to thread ${threadID.toString()}. Skipping.`
      );

      return;
    }

    const cb = (update: any) => {
      // Trigger the onUnsubscribe
      if (!update?.instance) {
        this.unsubscribe(threadID);
        onUnsubscribe(threadID);
        return;
      }

      callback(update);
    };

    const filters = [
      {
        collectionName: 'messages'
      },
      {
        actionTypes: ['CREATE']
      }
    ];

    const closer = this.client.listen(threadID, filters, cb);

    // Track active subscriptions
    this.registerListener(threadID, closer);
    return closer;
  }

  registerListener(threadID: ThreadID, listener: any) {
    this.activeSubscriptions[threadID.toString()] = listener;
  }

  unsubscribe(threadID: ThreadID) {
    if (!this.isSubscribed(threadID)) {
      console.warn(
        `There are no subscription to ${threadID.toString()}. Skipping.`
      );

      return;
    }

    if (
      typeof this.activeSubscriptions[threadID.toString()].close === 'function'
    ) {
      this.activeSubscriptions[threadID.toString()].close();
      delete this.activeSubscriptions[threadID.toString()];
    }
  }

  isSubscribed(threadID: ThreadID) {
    return threadID
      ? Boolean(this.activeSubscriptions[threadID.toString()])
      : false;
  }
}
