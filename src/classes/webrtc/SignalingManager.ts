import { Client, ThreadID } from '@textile/hub';
import Signal from '../Signal';
import { Where } from '@textile/threads-client';
import dayjs from 'dayjs';

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
    await this.client
      .newCollectionFromObject(threadID, schema, {
        name: collectionName
      })
      .catch(e => null);
  }

  async findSignalBySender(threadID: ThreadID, sender: string) {
    const query = new Where('sender').eq(sender);
    return this.client.find(threadID, 'signal', query);
  }

  async initializeConnection(
    threadID: ThreadID | string,
    signal: Signal,
    receiver: string
  ): Promise<ThreadID> {
    const safeThread = this.safeThread(threadID);
    await this.ensureCollection(safeThread, 'signal', signalSchema);

    const transaction = this.client.writeTransaction(safeThread, 'signal');

    await transaction.start();

    const hasReceiverSignal = await transaction.has([receiver]);

    if(hasReceiverSignal) {
      const receiverSignal = await transaction.findByID<any>(receiver);

      const elapsedTime = dayjs().diff(dayjs(receiverSignal.at), "seconds");
      if(elapsedTime <= 60) {
        await transaction.discard();
        await transaction.end();

        setTimeout(()=>{
          this.initializeConnection(threadID, signal, receiver);
        }, 10000);

        return safeThread;
      }
    }

    const signalExists = await transaction.has([signal.sender]);

    if (signalExists) {
      await transaction.save([signal]);
    } else {
      await transaction.create([signal]);
    }

    await transaction.end();
    return safeThread;
  }

  async updateSignal(
    threadID: ThreadID | string,
    signal: Signal,
  ) {
    const safeThread = this.safeThread(threadID);
    await this.ensureCollection(safeThread, 'signal', signalSchema);

    const transaction = this.client.writeTransaction(safeThread, 'signal');

    await transaction.start();

    const signalExists = await transaction.has([signal.sender]);

    if (signalExists) {
      await transaction.save([signal]);
    } else {
      await transaction.create([signal]);
    }

    await transaction.end();

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

    await this.ensureCollection(safeThread, 'signal', signalSchema);

    let result: any;
    try {
      result = await this.client.findByID<any>(safeThread, 'signal', sender);
    } catch (e) {
      result = null;
    }

    return result;
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

    const cb = (update: any, err: any) => {
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

    const listener = this.client.listen(threadID, filters, cb);

    // Track active subscriptions
    this.activeSubscriptions[threadID.toString()] = listener;
    return listener;
  }

  unsubscribe(threadID: ThreadID) {
    if (!this.isSubscribed(threadID)) {
      console.warn(
        `There are no subscription to ${threadID.toString()}. Skipping.`
      );

      return;
    }

    const listener = this.activeSubscriptions[threadID.toString()];

    if (typeof listener.close === 'function') {
      try {
        listener.close();
      } catch (e) {}

      delete this.activeSubscriptions[threadID.toString()];
    }
  }

  isSubscribed(threadID: ThreadID) {
    return threadID
      ? Boolean(this.activeSubscriptions[threadID.toString()])
      : false;
  }
}
