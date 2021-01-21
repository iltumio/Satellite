import Peer from "peerjs";
import WebRTC from "./WebRTC";

interface Message {
  type: string,
  data: any,
}

export default class P2PUser {
  identifier: string;
  connection: Peer.DataConnection | null;
  eventBus: CallableFunction;
  instance: WebRTC;
  constructor(instance: WebRTC, identifier: string, eventBus: CallableFunction) {
    this.instance = instance;
    this.identifier = identifier;
    this.connection = null;
    this.eventBus = eventBus; // Signals back to subscribers
  }

  bind(connection: Peer.DataConnection) {
    this.connection = connection;
    this.connection.on('data', this.handleData);
    this.defib();
  }

  // Sends pulses to the peer user every n seconds
  // this is used to signal the peer is still online.
  private defib() {
    this.send('heartbeat', Date.now());
    setTimeout(this.defib, 5000);
  }

  handleData(data: any) {
    const events = this.instance.events;
    const message: Message = {
      type: (events.includes(data.type)) ? data.type : 'data',
      data: data.payload,
    };

    console.log('data recived', data, message);
    // TODO: Figure out the type from the data (we'll use a specific structure when formatting messages)
  }

  public call(idenfitier: string, stream: MediaStream) : Error | null {
    if (!this.instance.peer) return new Error('Parent connection not established.');
    if (!this.connection) return new Error('Connection not bound.');

    this.instance.peer.call(idenfitier, stream);
    // No errors
    return null;
  }

  public send(event: string, data: any) : Error | null {
    if (!this.connection) return new Error('Connection not bound.');
    if (event === '*') return new Error('The wildcard event is for listening only.');
    if (!this.instance.events.includes(event)) return new Error(`Invalid event type: ${event}`);

    this.connection.send({
      type: event,
      data,
    });
    
    // No errors
    return null;
  }

  public close() {
    this.connection?.close();
  }
}