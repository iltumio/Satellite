// import Peer, { MediaConnection } from "peerjs";
import Peer from "simple-peer";
import WebRTC from './WebRTC';

type MediaEvent = "HANGUP" | "INCOMING-CALL" | "ANSWER" | "OUTGOING-CALL" | "STREAM-RECIEVED";

type CallState = "ACTIVE" | "PENDING" | "CLOSED";

interface Subscriber {
  method: CallableFunction,
  events: string[],
}

interface Call {
  state: CallState,
  from: string,
  call: any,
}

export default class WebRTCMedia {
  _mediaSubscriptions: Subscriber[];
  peer: Peer.Instance | null;
  calls: Call[];
  instance: WebRTC | null;
  constructor() {
    this._mediaSubscriptions = [];
    this.peer = null;
    this.calls = [];
    this.instance = null;
  }

  get mediaSubscriptions() {
    return this._mediaSubscriptions;
  }

  bindInstance(instance: WebRTC) {
    this.instance = instance;
  }

  /** @method
   * Build a standardized identifier for peer connections
   * @name buildIdentifier
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns standardized identifier
   */
  public buildIdentifier(identifier: string) : string {
    return identifier.replace('0x', 'WRTCx');
  }

  /** @method
   * Revert an identifier back to the original input useful for subscriptions being clear
   * @name revertIdentifier
   * @argument identifier string identifier, usually an Ethereum address.
   * @returns returns reverted non-standard identifier
   */
  public revertIdentifier(identifier: string) : string {
    return identifier.replace('WRTCx', '0x');
  }

  initMedia(peer: Peer.Instance) {
    this.peer = peer;
  }

  getCall(identifier: string) {
    return this.calls.find(c => c.from === identifier);
  }

  getMediaStream(constraints: MediaStreamConstraints) : Promise<MediaStream>{
    // @ts-ignore
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    return new Promise(resolve => {
      getUserMedia(constraints, (stream) => {
        resolve(stream);
      }, (err) => {
        // @ts-ignore
        console.warn('Failed to get Media Stream.', err);
      });
    });
  }

  public addUpdateCall(call: Call) {
    const without = this.calls.filter(c => c.from !== call.from);
    without.push(call);
    this.calls = without;
  }

  public mediaSubscription(events: MediaEvent[], method: CallableFunction) : number {
    this._mediaSubscriptions.push({
      method,
      events,
    });
    return this._mediaSubscriptions.length - 1;
  }

  public mediaUnsubscribe(index: number) : Error | null {
    if (index > this._mediaSubscriptions.length) return new Error('Index out of bounds');
    this._mediaSubscriptions.splice(index, 1);
    return null;
  }

  private publishMediaEvent(event: MediaEvent, identifier: string, stream?: MediaStream) {
    this._mediaSubscriptions.forEach(subscription => {
      if (subscription.events.includes(event)) {
        subscription.method(event, identifier, stream);
      }
    });
  }

  public call(identifier: string, mediaStream: MediaStream) : Error | null {
    // if (!this.peer) return new Error('Not yet initalizied');

    // const call = this.peer.call(this.buildIdentifier(identifier), mediaStream);
    // call.on('stream', (stream: MediaStream) => {
    //   this.publishMediaEvent('STREAM-RECIEVED', identifier, stream);
    // });
    // this.addUpdateCall({
    //   state: 'PENDING',
    //   from: this.buildIdentifier(identifier),
    //   call,
    // });
    // this.publishMediaEvent('OUTGOING-CALL', identifier);
    return null;
  }

  public answer(identifier: string, mediaStream: MediaStream) : Promise<MediaStream> {
    return new Promise((resolve, reject)=> {
      const pendingCall = this.calls.find(c => c.from === this.buildIdentifier(identifier));
      if (!pendingCall) {
        reject(new Error('Call not found by ID'));
        return;
      }
      pendingCall.call.answer(mediaStream);
      this.publishMediaEvent('ANSWER', identifier);
      pendingCall.call.on('stream', (stream: MediaStream) => {
        this.publishMediaEvent('STREAM-RECIEVED', identifier, stream);
        pendingCall.state = 'ACTIVE';
        resolve(stream);
      });
      // Timeout for requests
      setTimeout(() => {
        if (pendingCall.state !== 'ACTIVE') {
          reject(new Error('Request timed out.'));
        }
      }, 30000);
      return null;
    });
  }

  public hangup(identifier: string) {
    const call = this.calls.find(c => this.revertIdentifier(c.from) === identifier);
    if (!call) return new Error('Call not found by ID');
    if (!this.instance) return null;
    const peer = this.instance.find(identifier);
    if (peer && call.state !== 'CLOSED') {
      peer.send('REMOTE-HANGUP', true);
    }
    call.call.close();
    call.state = 'CLOSED';
    // TODO: remove call from array
    this.publishMediaEvent('HANGUP', identifier);
    return null;
  }

  protected addPendingCall(identifier: string, call: any) : number {
    this.publishMediaEvent('INCOMING-CALL', this.revertIdentifier(identifier));
    this.addUpdateCall({
      state: 'PENDING',
      from: this.buildIdentifier(identifier),
      call,
    });
    return this.calls.length - 1;
  }
}