import P2PUser, { CallEvent } from './P2PUser';

export const isInitiator = (data: any) => {
  return (
    data && data.reduce((acc, next) => acc || next.type === 'offer', false)
  );
};

interface Subscriber {
  method: CallableFunction;
  events: string[];
  identifiers: string[]; // Listen to only specific peers
}

interface Message {
  type: string;
  data: any;
}

type RTCEvent =
  | 'signal'
  | 'connect'
  | 'message'
  | 'incoming-call'
  | 'typing-notice'
  | 'call-status'
  | 'data'
  | 'REMOTE-HANGUP'
  | 'disconnect';

export default class WebRTC {
  public protocol: string;
  protected _identifier: string;
  protected _subscribers: Subscriber[];
  public connectedPeers: { [key: string]: P2PUser };
  protected _peersData: { [key: string]: any };
  protected _peers: { [key: string]: any };

  /** @constructor
   * Construct a new Peer 2 Peer handler
   * @argument identifier the ID we'd like to use for handshakes
   */
  constructor() {
    this.protocol = 'peerjs <https://peerjs.com/>';
    this._identifier = '';
    this._subscribers = [];
    this.connectedPeers = {};
    this._peersData = {};
    this._peers = {};
  }

  /** @method
   * Build a standardized identifier for peer connections
   * @name buildIdentifier
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns standardized identifier
   */
  public buildIdentifier(identifier: string): string {
    return identifier.replace('0x', 'WRTCx');
  }

  /** @method
   * Revert an identifier back to the original input useful for subscriptions being clear
   * @name revertIdentifier
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns reverted non-standard identifier
   */
  public revertIdentifier(identifier: string): string {
    return identifier.replace('WRTCx', '0x');
  }

  /** @method
   * Get a list of current subscribers
   * @name subscribers
   * @returns array of Subscribers
   */
  get subscribers(): Subscriber[] {
    return this._subscribers;
  }

  /** @method
   * Check if a peer by ID is online
   * @name isConnected
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns if the peer is online or not, represented by a boolean
   */
  public isConnected(identifier: string): boolean {
    return Boolean(this.connectedPeers[identifier]);
  }

  /** @method
   * Find a peer by identifier
   * @name find
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns either a peer, or undefined if not found
   */
  public find(identifier: string): P2PUser | undefined {
    return;
  }

  addPeer(address: string, options: any) {
    const identifier = this.buildIdentifier(address);

    const listeners = {
      onConnect: () => {
        console.log(`Connected to`, identifier);
        this.onConnect(identifier);
      },
      onSignal: (data: any) => {
        this.emit('signal', identifier, {
          type: 'peer-signal',
          data
        });
      },
      onError: error => {
        console.log(`Failed to connect ${identifier}`);
        console.log(error);
      },
      onData: data => {
        console.log('ondata', data);
        this.onPeerData(identifier, data);
      },
      onClose: () => {
        this.onDisconnect(identifier);
      },
      onCall: () => {
        this.emit('incoming-call', identifier, {});
      }
    };

    const peer = new P2PUser(identifier, options, listeners);

    peer.subscribeToCallEvents((event: CallEvent, ...args: any) => {
      this.emit(event, identifier, {
        type: event,
        data: args
      });
    });

    this._peers[identifier] = peer;

    return peer;
  }

  connect(address: string, initiator: boolean) {
    console.log(
      `Trying to connect to ${address} ${
        initiator ? 'as initiator' : 'as peer'
      }`
    );

    if (this.isPeerConnected(address)) {
      console.warn(`Already connected to ${address}`);
      return;
    }

    this.addPeer(address, { initiator, trickle: false });
  }

  isPeerConnected(address: string) {
    const identifier = this.buildIdentifier(address);
    return Boolean(this.connectedPeers[identifier]);
  }

  onPeerData(identifier: string, data: any) {
    this.publish(data.type, identifier, {
      type: data.type,
      data: data.data
    });
  }

  onConnect(identifier: string) {
    const peer = this._peers[identifier];
    this.connectedPeers[identifier] = peer;
    delete this._peers[identifier];

    this.publish('connect', identifier, {
      type: 'connect',
      data: { identifier: this.revertIdentifier(identifier) }
    });
  }

  onDisconnect(identifier: string) {
    console.log('on disconnect', identifier);

    delete this.connectedPeers[identifier];

    this.emit('disconnect', identifier, {});
  }

  emit(event: RTCEvent | CallEvent, peerId: string, data: any) {
    this.subscribers.map(subscriber => {
      const events = subscriber.events;
      // Ensure the subscriber is listening for the event
      if (events.includes(event) || events.includes('*')) {
        subscriber.method(event, this.revertIdentifier(peerId), data);
      }
    });
  }

  forwardSignal(address: string, signal: any) {
    const identifier = this.buildIdentifier(address);

    if (this.isPeerConnected(address)) {
      console.warn(`Already connected to ${address}`);

      const peer = this.connectedPeers[identifier];

      peer?.forwardSignal(signal);
    } else {
      if (signal.type === 'offer') {
        if (this._peers[identifier]) {
          console.log(this._peers[identifier]);
          this._peers[identifier].destroy();
        }
        delete this._peers[identifier];
      }

      let peer: P2PUser | null = null;
      if (this._peers[identifier]) {
        peer = this._peers[identifier];
      } else {
        peer = this.addPeer(address, { initiator: false, trickle: false });
      }

      peer?.forwardSignal(signal);
    }
  }

  public subscribe(
    method: CallableFunction,
    events: string[],
    identifiers: string[]
  ): number {
    const id = this.subscribers.length;
    this.subscribers.push({
      method,
      events,
      identifiers
    });
    return id;
  }

  public unSubscribe(index: number): Error | null {
    if (index > this.subscribers.length)
      return new Error('Index out of bounds');
    this.subscribers.splice(index, 1);
    return null;
  }

  private publish(event: string, identifier: string, message: Message): void {
    this.subscribers.map(subscriber => {
      const events = subscriber.events;
      const normalizedIdentifiers = subscriber.identifiers
        ? subscriber.identifiers.map(id => {
            return this.buildIdentifier(id);
          })
        : null;
      // Ensure the subscriber is listening for the event
      if (events.includes(event) || events.includes('*')) {
        // Chec if the subscriber is only interested in specific users
        if (normalizedIdentifiers?.includes(identifier)) {
          subscriber.method(event, this.revertIdentifier(identifier), message);
          // They arn't listenting to any specific users
        } else if (!normalizedIdentifiers) {
          subscriber.method(event, this.revertIdentifier(identifier), message);
        }
      }
    });
  }

  public send(address: string, data: any) {
    if (this.isPeerConnected(address)) {
      const identifier = this.buildIdentifier(address);
      const peer = this.connectedPeers[identifier];

      peer.send(JSON.stringify(data));
    } else {
      console.warn(
        `Impossible to send p2p message to ${address}. Peer not connected`
      );
    }
  }

  public async call(address: string, stream: MediaStream) {
    const identifier = this.buildIdentifier(address);
    if (!this.isConnected(identifier)) {
      console.warn('[Method: call] Peer not connected');
      return;
    }

    const peer = this.connectedPeers[identifier];

    peer.call(stream);
  }

  public async answerCall(address: string, stream: MediaStream) {
    const identifier = this.buildIdentifier(address);
    if (!this.isConnected(identifier)) {
      console.warn('[Method: answerCall] Peer not connected');
      return;
    }

    const peer = this.connectedPeers[identifier];

    peer.answerCall(stream);
  }

  public async hangupCall(address: string) {
    const identifier = this.buildIdentifier(address);
    if (!this.isConnected(identifier)) {
      console.warn('[Method: hangupCall] Peer not connected');
      return;
    }

    const peer = this.connectedPeers[identifier];

    peer.hangupCall();
  }
}
