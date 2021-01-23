import { Client, decrypt, ThreadID } from "@textile/hub";
import Crypto from "../crypto/Crypto";
// @ts-ignore
import Message from '../Message';

interface Message {
  _id: string,
  sender: string,
  to: '',
  at: number,
  type: string,
  payload: any,
  encrypted: boolean,
  secure: boolean,
  metadata: object,
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
  metadata: {},
};

export class MessageManager {
  client: Client;
  crypto: Crypto;
  key: CryptoKeyPair | null;
  publicKey: JsonWebKey | null;
  privateKey: JsonWebKey | null;
  address: string;

  constructor(client: Client, address: string) {
    this.client = client;
    this.address = address;
    this.crypto = new Crypto();
    this.key = null;
    this.publicKey = null;
    this.privateKey = null;
  }

  async build() {
    this.enableEncryption();
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
      encrypted: false,
      secure: false,
      metadata: {},
    };
  }

  async enableEncryption() {
    // TODO: We should queue sending messages until this is done 
    // there is a rare potential race condition that would cause
    // failure to send messages.
    if (!localStorage.getItem('publicKey') || !localStorage.getItem('privateKey')) {
      this.key = await this.crypto.getKeyPair();
      this.publicKey = await this.crypto.pubKey(this.key);
      this.privateKey = await this.crypto.privKey(this.key);
      localStorage.setItem('publicKey', JSON.stringify(this.publicKey));
      localStorage.setItem('privateKey', JSON.stringify(this.privateKey));
    } else {
      this.publicKey = JSON.parse(localStorage.getItem('publicKey') || '');
      this.privateKey = JSON.parse(localStorage.getItem('privateKey') || '');
    }
  }

  async ensureCollection(threadID: ThreadID) {
    await this.client.getCollectionIndexes(
      threadID,
      'messages',
    ).catch(async () => {
      await this.client.newCollectionFromObject(
        threadID,
        messageSchema,
        {
          name: 'messages',
        },
      );
    });
  }

  async addMessageDeterministically(threadID: ThreadID, message: Message, recipient: string) {
    if (localStorage.getItem(`pubkey.${recipient}`)) {
      const key = localStorage.getItem(`pubkey.${recipient}`) || '';
      this.addEncryptedMessage(
        threadID,
        message,
        JSON.parse(key),
      );
    } else {
      this.addNewMessage(threadID, message);
    }
  }

  async addNewMessage(threadID: ThreadID, message: Message) : Promise<ThreadID> {
    await this.ensureCollection(threadID);
    await this.client.create(threadID, 'messages', [message]);
    return threadID;
  }

  async addEncryptedMessage(threadID: ThreadID, message: Message, guestPublicKey: JsonWebKey) : Promise<ThreadID | null> {
    if (typeof this.publicKey === null || typeof this.privateKey === null) {
      return null;
    }
    await this.ensureCollection(threadID);
    const publicKey = await this.crypto.importPubKey(guestPublicKey);
    // @ts-ignore
    const privateKey = await this.crypto.importPrivKey(this.privateKey);
    const derivedKey = await this.crypto.derive(publicKey, privateKey);
    const encryptedPayload = await this.crypto.encrypt(
      JSON.stringify(message.payload),
      derivedKey,
    );
    const encryptedMessage = Object.assign(
      {},
      message,
      {
        encrypted: true,
        secure: true,
        payload: {
          encryptedData: encryptedPayload,
        },
      });
    await this.client.create(threadID, 'messages', [encryptedMessage]);
    return threadID;
  }

  async decryptMessage(message: Message, guestPublicKey: JsonWebKey) {
    if (!message.encrypted) return message;
    if (typeof this.publicKey === null || typeof this.privateKey === null) {
      return message;
    }
    try {
      const publicKey = await this.crypto.importPubKey(guestPublicKey);
      // @ts-ignore
      const privateKey = await this.crypto.importPrivKey(this.privateKey);
      const derivedKey = await this.crypto.derive(publicKey, privateKey);
      const decrpytedPayload = await this.crypto.decrypt(message.payload.encryptedData, derivedKey);
      return {
        ...message,
        encrypted: false,
        secure: true,
        payload: JSON.parse(decrpytedPayload),
      };
    } catch (e) {
      return message;
    }
  }

  async bulkDecrypt(messages: Message[], guestPublicKey: JsonWebKey) {
    const decryptedMessages: Promise<Message>[] = [];
    messages.map(msg => decryptedMessages.push(this.decryptMessage(msg, guestPublicKey)));
    const resolvedMessages = await Promise.all(decryptedMessages);
    return resolvedMessages;
  }

  async getMessages(threadID: ThreadID | string) : Promise<Message[]> {
    return new Promise(async (resolve) => {
      const safeThread = (typeof threadID === 'string') ?
        ThreadID.fromString(threadID.replace(/\W/g, '')) : threadID;

      const decryptedMessages: any[] = [];

      let messages = await this.client.find(
        safeThread,
        'messages',
        {},
      ).catch((err) => {
        // Collection not found
        resolve([]);
      }) || [];

      // @ts-ignore
      window.Vault74.debug(`ThreadDB request made for ThreadID ${safeThread.toString()}`);

      resolve(<Array<Message>>messages);
    });
  }

  async subscribe(threadID: ThreadID, callback: CallableFunction) : Promise<any> {
    const cb = (update: any) => {
      if (!update || !update.instance) return;
      callback(update);
    };

    const filters = [
      {
        collectionName: 'messages',
      },
      {
        actionTypes: ['CREATE'],
      },
    ];

    const closer = this.client.listen(threadID, filters, cb);
    return closer;
  }
}