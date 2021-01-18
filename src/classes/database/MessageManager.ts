import { Client, ThreadID } from "@textile/hub";
import Crypto from "../crypto/Crypto";

interface Message {
  _id: string,
  sender: string,
  at: number,
  type: string,
  payload: any,
}

const messageSchema = <Message>{
  _id: '',
  sender: '',
  at: Date.now(),
  type: '',
  payload: {},
};

export class MessageManager {
  client: Client;
  crypto: Crypto;
  key: CryptoKeyPair | null;
  publicKey: JsonWebKey | null;
  privateKey: JsonWebKey | null;

  constructor(client: Client) {
    this.client = client;
    this.crypto = new Crypto();
    this.key = null;
    this.publicKey = null;
    this.privateKey = null;
  }

  async build() {
    this.enableEncryption();
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
    const encryptedMessage = {
      ...message,
      payload: encryptedPayload,
    };
    await this.client.create(threadID, 'messages', [encryptedMessage]);
    return threadID;
  }

  async decryptMessage(message: Message, guestPublicKey: JsonWebKey) {
    if (typeof this.publicKey === null || typeof this.privateKey === null) {
      return null;
    }
    const publicKey = await this.crypto.importPubKey(guestPublicKey);
    // @ts-ignore
    const privateKey = await this.crypto.importPrivKey(this.privateKey);
    const derivedKey = await this.crypto.derive(publicKey, privateKey);
    const decrpytedPayload = await this.crypto.decrypt(message.payload, derivedKey);
    return {
      ...message,
      payload: decrpytedPayload,
    };
  }

  async getMessages(threadID: ThreadID) : Promise<Message[]> {
    return new Promise(async (resolve) => {
      let messages = await this.client.find(
        threadID,
        'messages',
        {},
      ).catch((err) => {
        // Collection not found
        resolve([]);
      }) || [];
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