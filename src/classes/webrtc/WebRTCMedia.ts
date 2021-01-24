import Peer, { MediaConnection } from "peerjs";
import P2PUser from "./P2PUser";

type MediaAction = "HANGUP" | "CALL" | "ANSWER";

interface Subscriber {
  method: CallableFunction,
  events: string[],
}

interface PendingCall {
  from: string,
  call: Peer.MediaConnection,
}

export default class WebRTCMedia {
  _mediaSubscriptions: Subscriber[];
  peer: Peer | null;
  pendingCalls: PendingCall[];
  constructor() {
    this._mediaSubscriptions = [];
    this.peer = null;
    this.pendingCalls = [];
  }

  get mediaSubscriptions() {
    return this._mediaSubscriptions;
  }

  initMedia(peer: Peer) {
    this.peer = peer;
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

  mediaSubscription(events: MediaAction[], method: CallableFunction) : number {
    this._mediaSubscriptions.push({
      method,
      events,
    });
    return this._mediaSubscriptions.length - 1;
  }

  mediaUnsubscribe(index: number) : Error | null {
    if (index > this._mediaSubscriptions.length) return new Error('Index out of bounds');
    this._mediaSubscriptions.splice(index, 1);
    return null;
  }

  call(identifier: string, mediaStream: MediaStream) : Error | null {
    if (!this.peer) return new Error('Not yet initalizied');
    this.peer.call(identifier, mediaStream);
    return null;
  }

  answer(identifier: string, mediaStream: MediaStream) : Promise<MediaStream> {
    return new Promise((resolve, reject)=> {
      const pendingCall = this.pendingCalls.find(c => c.from === identifier);
      if (!pendingCall) {
        reject(new Error('Call not found by ID'));
        return;
      }
      let answered = false;
      pendingCall.call.answer(mediaStream);
      pendingCall.call.on('stream', (stream: MediaStream) => {
        answered = true;
        resolve(stream);
      });
      setTimeout(() => {
        if (!answered) {
          reject(new Error('Request timed out.'));
        }
      }, 30000);
      return null;
    });
  }

  // TODO: this should emit a hangup message to the peer
  // it should also close any active calls with the peer.
  // lastly emit a 'hangup' event so the app can react
  hangup(identifier: string) {
    return null;
  }

  protected addPendingCall(from: string, call: MediaConnection) : number {
    this.pendingCalls.push({
      from,
      call,
    });
    return this.pendingCalls.length - 1;
  }

  
}