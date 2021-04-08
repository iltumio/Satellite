import { Client, ThreadID } from '@textile/hub';
import Signal from '../Signal';
import { Where } from '@textile/threads-client';

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
  client: Client;
  address: string;
  activeSubscriptions: { [key: string]: any };

  constructor(client: Client, address: string) {
    this.client = client;
    this.address = address;
    this.activeSubscriptions = {};
  }

  safeThread(threadID: ThreadID | string): ThreadID {
    return typeof threadID === 'string'
      ? ThreadID.fromString(threadID.replace(/\W/g, ''))
      : threadID;
  }

  buildSignal(data: any) {
    const signal = new Signal(
      this.address,
      new Date().getTime(),
      'signal',
      data,
      data.type === 'offer'
    );

    return {
      _id: signal._id,
      sender: signal.sender,
      at: signal.at,
      type: signal.type,
      payload: { signalingData: signal.payload },
      initiator: signal.initiator
    };
  }

  async ensureCollection(
    threadID: ThreadID,
    collectionName: string,
    schema: any
  ) {
    try {
      await this.client.getCollectionIndexes(threadID, collectionName);
    } catch (e) {
      await this.client.newCollectionFromObject(threadID, schema, {
        name: collectionName
      });
    }
  }

  async findSignalBySender(threadID: ThreadID, sender: string) {
    const query = new Where('sender').eq(sender);
    return this.client.find(threadID, 'signal', query);
  }

  async updateSignal(
    threadID: ThreadID | string,
    signal: Signal
  ): Promise<ThreadID> {
    const safeThread = this.safeThread(threadID);
    await this.ensureCollection(safeThread, 'signal', signalSchema);

    const signalExists = await this.client.has(safeThread, 'signal', [
      signal.sender
    ]);

    if (signalExists) {
      await this.client.save(safeThread, 'signal', [signal]);
    } else {
      await this.client.create(safeThread, 'signal', [signal]);
    }
    return safeThread;
  }

  async getLastSignalData(
    threadID: ThreadID | string,
    sender: string
  ): Promise<any> {
    if (!this.client) return;

    const safeThread =
      typeof threadID === 'string'
        ? ThreadID.fromString(threadID.replace(/\W/g, ''))
        : threadID;

    return this.client.findByID(safeThread, 'signal', sender);
  }

  subscribe(
    threadID: ThreadID,
    address: string,
    callback: CallableFunction,
    onUnsubscribe: CallableFunction
  ) {
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
        collectionName: 'signal',
        actionTypes: ['CREATE', 'SAVE'],
        instanceID: address
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
