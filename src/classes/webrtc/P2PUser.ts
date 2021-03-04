// @ts-ignore
import config from '@/config/config';
import Peer from "peerjs";
import WebRTC from "./WebRTC";

interface Message {
  type: string,
  data: any,
}

type RTCEvent = '*' |
  'key-offer' |
  'connection-established' |
  'ping' |
  'pong' |
  'heartbeat' |
  'flatlined' |
  'message' |
  'typing-notice' |
  'call-status' |
  'data' | 
  'REMOTE-HANGUP';

export default class P2PUser {
  identifier: string;
  connection: Peer.DataConnection | null;
  eventBus: CallableFunction;
  instance: WebRTC;
  lastHeartbeat: number;
  flatlined: boolean;
  constructor(instance: WebRTC, identifier: string, eventBus: CallableFunction) {
    this.lastHeartbeat = Date.now();
    this.flatlined = false;
    this.instance = instance;
    this.identifier = identifier;
    this.connection = null;
    this.eventBus = eventBus; // Signals back to subscribers
  }

  get isAlive() {
    return this.connection && !this.flatlined;
  }

  public bind(connection: Peer.DataConnection) {
    this.connection = connection;
    this.connection.on('data', (data: any) => {
      this.handleData(data);
    });
    this.defib();
    this.monitor();
    // Send over our public key
    this.sendKey();
  }

  // Sends pulses to the peer user every n seconds
  // this is used to signal the peer is still online.
  public defib() {
    this.send('heartbeat', Date.now());
    setTimeout(() => {
      if (!this.flatlined) this.defib();
    }, config.peer.check_heartbeat);
  }

  public sendKey() {
    this.send(
      'key-offer',
      JSON.parse(localStorage.getItem('publicKey') || ''),
    );
  }

  /** @function
   * @name monitor
   * Check that the remote peer is alive and well via a ping-pong heartbeat
   */
  monitor() {
    if (Date.now() - this.lastHeartbeat > config.peer.heartbeat_timeout) {
      if (!this.flatlined) {
        // TODO: close the connection
        this.flatlined = true;
        this.instance.publishDeath(this.identifier);
      }
    }
    setTimeout(() => {
      this.monitor();
    }, config.peer.check_heartbeat);
  }

  handleData(data: any) {
    const events = this.instance.events;
    const message: Message = {
      type: (events.includes(data.type)) ? data.type : 'data',
      data: data.payload,
    };

    this.eventBus(message.type, message);
    this.lastHeartbeat = Date.now();
  }

  public call(identifier: string, stream: MediaStream) : Error | null {
    if (!this.instance.peer) return new Error('Parent connection not established.');
    if (!this.connection) return new Error('Connection not bound.');

    this.instance.peer.call(identifier, stream);
    // No errors
    return null;
  }

  public send(event: string, data: any) : Error | null {
    if (!this.connection) return new Error('Connection not bound.');
    if (event === '*') return new Error('The wildcard event is for listening only.');
    if (!this.instance.events.includes(<RTCEvent>event)) return new Error(`Invalid event type: ${event}`);
    this.connection.send({
      type: event,
      payload: data,
    });
    
    // No errors
    return null;
  }

  public close() {
    this.connection?.close();
  }
}