import { Client, ThreadID } from '@textile/hub';
import Signal from '../Signal';

interface ISignal {
  _id: string;
  sender: string;
  at: number;
  type: string;
  payload: any;
}

const signalSchema = <ISignal>{
  _id: '',
  sender: '',
  to: '',
  at: Date.now(),
  type: '',
  payload: {}
};

export class SignalingManager {
  client?: Client;
  address?: string;
  activeSubscriptions: { [key: string]: any };
  initialized: boolean;
  threadID?: ThreadID;

  constructor() {
    this.activeSubscriptions = {};
    this.initialized = false;
  }

  threadIDFromAddress(address: string) {
    const sliced = address.slice(2);
    const buffered = Buffer.from(sliced, 'hex');

    // @ts-ignore
    return new ThreadID(new Uint8Array([1, 85, ...buffered]));
  }

  isInitialized(): boolean {
    return Boolean(this.client && this.address && this.threadID);
  }

  async init(client: Client, address: string) {
    this.client = client;
    this.address = address;

    // Initialize with an address based thread id
    this.threadID = this.threadIDFromAddress(address);

    const db = await this.client.newDB(this.threadID);
    await this.ensureCollection(this.threadID, 'signal', signalSchema);
    this.initialized = true;
  }

  buildSignal(data: any) {
    if (!this.address) return;

    const signal = new Signal(this.address, Date.now(), 'signal', data);

    return {
      _id: 'signal',
      sender: signal.sender,
      at: signal.at,
      type: signal.type,
      payload: signal.payload
    };
  }

  async ensureCollection(
    threadID: ThreadID,
    collectionName: string,
    schema: any
  ) {
    if (!this.client) return;

    try {
      await this.client.getCollectionIndexes(threadID, collectionName);
    } catch (e) {
      await this.client.newCollectionFromObject(threadID, schema, {
        name: collectionName
      });
    }
  }

  async updateSignal(signal: Signal): Promise<void> {
    if (!this.client || !this.threadID) {
      return;
    }

    await this.ensureCollection(this.threadID, 'signal', signalSchema);

    const signalExists = await this.client.has(this.threadID, 'signal', [
      'signal'
    ]);

    if (signalExists) {
      await this.client.save(this.threadID, 'signal', [signal]);
    } else {
      await this.client.create(this.threadID, 'signal', [signal]);
    }
  }

  async getLastSinal(
    threadID: ThreadID | string
  ): Promise<ISignal | undefined> {
    if (!this.client) return;

    const safeThread =
      typeof threadID === 'string'
        ? ThreadID.fromString(threadID.replace(/\W/g, ''))
        : threadID;

    const signal:any = await this.client.findByID(safeThread, 'signal', 'signal');
    return new Signal(signal.sender, signal.at, signal.type, signal.payload);
  }

  subscribe(
    threadID: ThreadID,
    callback: CallableFunction,
    onUnsubscribe: CallableFunction
  ) {
    if (!this.client) return;

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
        collectionName: 'signal'
      },
      {
        actionTypes: ['CREATE', 'UPDATE']
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
      try {
        this.activeSubscriptions[threadID.toString()].close();
      } catch (e) {
        console.warn(
          `Subscription ${threadID.toString()} was already closed. Skipping.`
        );
      }

      delete this.activeSubscriptions[threadID.toString()];
    }
  }

  isSubscribed(threadID: ThreadID) {
    return threadID
      ? Boolean(this.activeSubscriptions[threadID.toString()])
      : false;
  }
}
