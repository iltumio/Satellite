import Peer from 'simple-peer';
// import Peer, { MediaConnection, PeerJSOption } from 'peerjs';
// @ts-ignore
import config from '@/config/config';
import P2PUser from './P2PUser';
import WebRTCMedia from './WebRTCMedia';
import { Client } from '@textile/hub-threads-client';

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
  | '*'
  | 'connection-established'
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
  offer: any,
  candidates: Array<any>
}

export default class WebRTC {
  public protocol: string;
  private _identifier: string;
  protected _subscribers: Subscriber[];
  private _events: RTCEvent[];
  peer: Peer.Instance | null;
  connections: Connection[];
  registry: string[];
  connectionData?: IConnectionData;

  /** @constructor
   * Construct a new Peer 2 Peer handler
   * @argument identifier the ID we'd like to use for handshakes
   */
  constructor() {
    // super();
    this.protocol = 'peerjs <https://peerjs.com/>';
    this._identifier = '';
    this._subscribers = [];
    this._events = this.events;
    this.peer = null;
    this.connections = [];
    this.registry = [];
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
   * Get the global identifier
   * @name identifier
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns local identifier
   */
  get identifier(): string {
    return this.buildIdentifier(this._identifier);
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
   * Get a list of current subscribers
   * @name events
   * @returns Returns array of acceptable RTC Event enums
   */
  get events(): RTCEvent[] {
    // TODO: Convert this to a string union
    return [
      '*',
      'connection-established',
      'ping',
      'pong',
      'heartbeat',
      'flatlined',
      'message',
      'typing-notice',
      'data',
      'REMOTE-HANGUP'
    ];
  }

  /** @method
   * Get PeerJS options built from the config
   * @name settings
   * @returns returns settings object
   */
  get settings(): any {
    return {
      host: config.peer.network[config.env].host,
      port: config.peer.network[config.env].port,
      path: config.peer.network[config.env].path,
      key: config.peer.network[config.env].key,
      secure: config.peer.network[config.env].secure,
      debug: config.debug ? 0 : 2,
      config: {
        iceServers: config.peer.network[config.env].iceServers
      },
      initiator: true
    };
  }

  /** @method
   * Check if a peer by ID is online
   * @name isConnected
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns if the peer is online or not, represented by a boolean
   */
  public isConnected(identifier: string): boolean {
    const peer = this.find(identifier);
    if (!peer) return false;
    if (peer.isAlive) return true;
    return false;
  }

  /** @method
   * Find a peer by identifier
   * @name find
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns either a peer, or undefined if not found
   */
  public find(identifier: string): P2PUser | undefined {
    const connection = this.connections.find(
      conn => conn.identifier === this.buildIdentifier(identifier)
    );
    return connection?.user;
  }

  /** @method
   * Initalize the WebRTC class, we sometimes need to wait for other thigns to be done
   * before initalizing to prevent race conditions.
   * @name init
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns a promise which will resolve the created WebRTC class
   */
  async init(identifier: string, client: Client): Promise<WebRTC> {
    this._identifier = identifier;
    const peer = new Peer(this.settings);
    this.peer = peer;
      
    // Emitted once we've connected to the handshake service
    peer.on('signal', data => {

      // If type offer -> replace old signaling data
      if(data.type === 'offer') {
        this.connectionData = {
          offer: data,
          candidates: []
        }
      } else if(data.type === 'candidate') {
        this.connectionData?.candidates?.push(data);
      }

      // this.initMedia(this.peer);
      // We're connected to the PeerJS server and ready to make connections
      this.connectToRegistry();
      this.publish('connection-established', '*', {
        type: 'connection-established',
        data: this.connectionData
      });
      // A new peer has connected to us
      // peer.on('connection', (conn: Peer) => {
      //   this.connect(conn);
      // });

      // peer.on('call', (call: MediaConnection) => {
      //   this.addPendingCall(call.peer, call);
      // });
      
    });

      // Attempt reconnection
      // peer.on('disconnected', () => {
      //   peer.reconnect();
      //   // TODO: Also reconnect to peers whom were connected to us
      // });

      peer.on('error', (err: any) => {
        // This is fine, we don't need to care if they are offline.
        // @ts-ignore
        console.warn('PeerJS Error: ', err);
      });

      return this;
  }

  /** @method
   * Bind a peer connection to an identifier in memory
   * @name registerPeer
   * @argument identifier string identifier, usually an Ethereum address.
   * @argument peer P2PUser to bind identifier to
   */
  private registerPeer(identifier: string, peer: P2PUser) {
    this.connections.push({
      identifier,
      user: peer
    });
  }

  public updateRegistry(_identifiers: string[]) {
    const identifiers = _identifiers.map(id => this.buildIdentifier(id));
    this.registry.forEach(id => {
      // If the updated registry doesn't contain one of our friends, close the connection.
      if (!identifiers.includes(id)) {
        const peer = this.find(id);
        peer?.close();
      }
    });
    this.registry = identifiers;
  }

  private connectToRegistry() {
    this.registry.forEach(identifier => {
      const peer = this.find(identifier);
      if (!peer || !peer.connection) {
        this.connectToPeer(identifier);
      }
    });
  }

  connect(conn: any) {
    // const identifier = this.buildIdentifier(conn.peer);
    // const exitingPeer = this.find(identifier);
    // if (exitingPeer && exitingPeer.connection) {
    //   exitingPeer.close();
    // }
    // const peer = new P2PUser(
    //   this,
    //   identifier,
    //   (event: string, data: Message) => {
    //     this.publish(event, identifier, data);
    //   }
    // );
    // // Data connection established.
    // // We can now recieve data from this peer.
    // conn.on('open', () => {
    //   peer.bind(conn);
    //   this.registerPeer(identifier, peer);
    // });
  }

  public disconnectFromPeer(_identifier: string) : Promise<Error|null> {
    return new Promise((resolve, reject) => {
      if (!this.peer) reject(new Error('You cannot disconnect before initalizing.'))
      const peer = this.find(_identifier);
      if (peer) {
        peer.close();
        resolve(null);
      }
      setTimeout(() =>{ resolve(null) }, 3000)
    })
  }

  public connectIfNotConnected(_identifier: string) {
    // if (!this.peer) return new Error('You cannot connect before initalizing.');
    // const identifier = this.buildIdentifier(_identifier);
    // if (this.isConnected(identifier)) return;
    // const connection = this.peer.connect(identifier);
    // this.connect(connection);
  }

  public connectToPeer(_identifier: string): Error | null {
    // if (!this.peer) return new Error('You cannot connect before initalizing.');
    // const identifier = this.buildIdentifier(_identifier);
    // const connection = this.peer.connect(identifier);
    // this.connect(connection);
    return null;
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
        if (
          normalizedIdentifiers &&
          normalizedIdentifiers.includes(identifier)
        ) {
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

  // Ideally, this should be called before the app closes.
  public terminate() {
    this.peer?.destroy();
  }
}
