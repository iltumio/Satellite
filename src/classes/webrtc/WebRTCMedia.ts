import Peer, { MediaConnection } from "peerjs";

type MediaEvent = "HANGUP" | "INCOMING-CALL" | "ANSWER" | "OUTGOING-CALL";

type CallState = "ACTIVE" | "PENDING" | "CLOSED";

interface Subscriber {
  method: CallableFunction,
  events: string[],
}

interface Call {
  state: CallState,
  from: string,
  call: Peer.MediaConnection,
}

export default class WebRTCMedia {
  _mediaSubscriptions: Subscriber[];
  peer: Peer | null;
  calls: Call[];
  constructor() {
    this._mediaSubscriptions = [];
    this.peer = null;
    this.calls = [];
  }

  get mediaSubscriptions() {
    return this._mediaSubscriptions;
  }

  initMedia(peer: Peer) {
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
        window.Vault74.warn('Failed to get Media Stream.', err);
      });
    });
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

  private publishMediaEvent(event: MediaEvent, identifier: string) {
    this._mediaSubscriptions.forEach(subscription => {
      console.log('subscription', subscription);
      if (subscription.events.includes(event)) {
        subscription.method(event, identifier);
      }
    });
  }

  public call(identifier: string, mediaStream: MediaStream) : Error | null {
    if (!this.peer) return new Error('Not yet initalizied');
    const call = this.peer.call(identifier, mediaStream);
    this.calls.push({
      state: 'CLOSED',
      from: identifier,
      call,
    });
    this.publishMediaEvent("OUTGOING-CALL", identifier);
    return null;
  }

  public answer(identifier: string, mediaStream: MediaStream) : Promise<MediaStream> {
    return new Promise((resolve, reject)=> {
      const pendingCall = this.calls.find(c => c.from === identifier);
      if (!pendingCall) {
        reject(new Error('Call not found by ID'));
        return;
      }
      pendingCall.call.answer(mediaStream);
      pendingCall.call.on('stream', (stream: MediaStream) => {
        pendingCall.state = 'ACTIVE';
        this.publishMediaEvent("ANSWER", identifier);
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
    const call = this.calls.find(c => c.from === identifier);
    if (!call) return new Error('Call not found by ID');
    call.call.close();
    call.state = 'CLOSED';
    // TODO: remove call from array
    this.publishMediaEvent("HANGUP", identifier);
    return null;
  }

  protected addPendingCall(identifier: string, call: MediaConnection) : number {
    this.publishMediaEvent('INCOMING-CALL', identifier);
    this.calls.push({
      state: 'PENDING',
      from: identifier,
      call,
    });
    return this.calls.length - 1;
  }
}