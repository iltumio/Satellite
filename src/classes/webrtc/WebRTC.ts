import Peer, { PeerJSOption } from 'peerjs';
// @ts-ignore
import config from '@/config/config';
import P2PUser from './P2PUser';


interface Subscriber {
  method: CallableFunction,
  events: string[],
  identifiers: string[], // Listen to only specific peers
}

interface Message {
  type: string,
  data: any,
}

interface Connection {
  user: P2PUser,
  identifier: string,
}

export default class WebRTC {
  public protocol: string;
  private _idenfitier: string;
  protected _subscribers: Subscriber[];
  private _events: string[];
  peer: Peer | null;
  connections: Connection[];

  /** @constructor
   * Construct a new Peer 2 Peer handler
   * @argument identifier the ID we'd like to use for handshakes
   */
  constructor(identifier: string) {
    this.protocol = "peerjs <https://peerjs.com/>";
    this._idenfitier = identifier;
    this._subscribers = [];
    this._events = this.events;
    this.peer = null;
    this.connections = [];
  }

  get idenfitier() : string {
    return this.idenfitier;
  }

  get subscribers() : Subscriber[] {
    return this.subscribers;
  }

  get events() : string[] {
    return [
      '*',
      'key-request',
      'key-offer',
      'ping',
      'pong',
      'message',
      'typing-notice',
      'call-status',
      'data',
    ];
  }

  get settings() : PeerJSOption {
    return {
      host: config.peer.network[config.env].host,
      port: config.peer.network[config.env].port,
      path: config.peer.network[config.env].path,
      key: config.peer.network[config.env].key,
      secure: config.peer.network[config.env].secure,
      debug: config.debug ? 0 : 2,
      config: {
        iceServers: config.peer.network[config.env].iceServers,
      },
    };
  }

  findConnection(idenfitier: string) : P2PUser | undefined {
    const connection = this.connections
      .find(conn => conn.identifier === idenfitier);
    return connection?.user;
  }

  public init() : Promise<WebRTC> {
    return new Promise(resolve => {
      const peer = new Peer(this.idenfitier, this.settings);
      // Emitted once we've connected to the handshake service
      peer.on('call', function(call) { });
      peer.on('open', () => {
        this.peer = peer;
        // A new peer has connected to us
        peer.on('connection', this.connect);
        resolve(this);
      });

      // Attempt reconnection
      peer.on('disconnected', () => {
        peer.reconnect();
        // TODO: Also reconnect to peers whom were connected to us
      });

      peer.on('error', (err: any) => {
        console.log('PeerJS Error: ', err);
      });
    });
  }

  private registerPeer(identifier: string, peer: P2PUser) {
    this.connections.push({
      identifier,
      user: peer,
    });
  }

  private connect(conn: Peer.DataConnection) {
    const identifier = conn.peer;
    const peer = new P2PUser(this, identifier, (event: string, data: Message) => {
      this.publish(event, identifier, data);
    });
    // Data connection established.
    // We can now recieve data from this peer.
    conn.on('open', () => {
      peer.bind(conn);
      this.registerPeer(identifier, peer);
    });
  }

  public subscribe(method: CallableFunction, events: string[], identifiers: string[]) : number | Error {
    if (this.peer === null) return new Error('You cannot subscribe before initalizing.');
    const id = this.subscribers.length;
    this.subscribers.push({
      method,
      events,
      identifiers,
    });
    return id;
  }

  private publish(event: string, identifier: string, message: Message) : void {
    this.subscribers.map(subscriber => {
      const events = subscriber.events; 
      // Ensure the subscriber is listening for the event
      if (events.includes(event) || events.includes('*')) {
        // Chec if the subscriber is only interested in specific users
        if (subscriber.identifiers.length > 0 && subscriber.identifiers.includes(identifier)) {
          subscriber.method(event, identifier, message);
        // They arn't listenting to any specific users
        } else if (subscriber.identifiers.length === 0) {
          subscriber.method(event, identifier, message);
        }
      }
    });
  }

  // Ideally, this should be called before the app closes.
  public terminate() {
    this.peer?.destroy();
  }
}