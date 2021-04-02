import Peer from 'simple-peer';
// @ts-ignore
import P2PUser from './P2PUser';
import { debounce } from '../../utils/utils';

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

interface Connection {
  user: P2PUser;
  identifier: string;
}

type RTCEvent =
  | 'signal'
  | 'connect'
  | 'ping'
  | 'pong'
  | 'heartbeat'
  | 'flatlined'
  | 'message'
  | 'typing-notice'
  | 'call-status'
  | 'stream'
  | 'data'
  | 'REMOTE-HANGUP';

interface IConnectionData {
  offer: any;
  candidates: Array<any>;
}

export default class WebRTC {
  public protocol: string;
  protected _identifier: string;
  protected _subscribers: Subscriber[];
  public connectedPeers: { [key: string]: Peer.Instance };
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
    return false;
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

    const peer = new Peer(options);

    peer.on('connect', () => {
      console.log(`Connected to`, identifier);
      this.onConnect(identifier);
    });

    const debouncedEmit = debounce((data: any) => {
      this.emit('signal', identifier, {
        type: 'peer-signal',
        data
      });
    }, 1000);

    const onSignal = data => {
      if (this._peersData[identifier] && data.type !== 'answer') {
        this._peersData[identifier] = [...this._peersData[identifier], data];
      } else {
        this._peersData[identifier] = [data];
      }
      debouncedEmit(this._peersData[identifier]);
    };

    peer.on('signal', onSignal);

    peer.on('error', error => {
      console.log(`Failed to connect ${identifier}`);
      console.log(error);
    });

    peer.on('data', data => {
      this.onPeerData(identifier, data);
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

    this.addPeer(address, { initiator });
  }

  isPeerConnected(address: string) {
    const identifier = this.buildIdentifier(address);
    return Boolean(this.connectedPeers[identifier]);
  }

  onPeerData(identifier: string, data: any) {
    const decoder = new TextDecoder();
    const decodedString = decoder.decode(data).toString();

    const parsedData = JSON.parse(decodedString);

    if (parsedData) {
      this.publish(parsedData.type, identifier, {
        type: parsedData.type,
        data: parsedData.data
      });
    }
  }

  onConnect(identifier: string) {
    this.connectedPeers[identifier] = this._peers[identifier];
    delete this._peers[identifier];

    this.publish('connect', identifier, {
      type: 'connect',
      data: { identifier: this.revertIdentifier(identifier) }
    });
  }

  emit(event: RTCEvent, peerId: string, data: any) {
    this.subscribers.map(subscriber => {
      const events = subscriber.events;
      // Ensure the subscriber is listening for the event
      if (events.includes(event) || events.includes('*')) {
        subscriber.method(event, this.revertIdentifier(peerId), data);
      }
    });
  }

  forwardSignal(address: string, signal: any, initiator: boolean) {
    const identifier = this.buildIdentifier(address);

    if (this.isPeerConnected(address)) {
      console.warn(`Already connected to ${address}`);
      return;
    }

    if (initiator) {
      delete this._peers[identifier];
    }

    let peer: Peer.Instance | null = null;
    if (this._peers[identifier]) {
      peer = this._peers[identifier];   
    } else {
      peer = this.addPeer(address, { initiator: false });
    }

    if (signal.length) {
      signal.forEach(s => peer?.signal(s));
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

  public publishDeath(identifier: string): void {
    this.publish('flatlined', identifier, { type: 'flatlined', data: true });
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
}
