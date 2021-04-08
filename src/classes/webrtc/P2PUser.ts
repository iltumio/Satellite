import Peer from 'simple-peer';
import { debounce } from '../../utils/utils';

export type CallEvent =
  | '*'
  | 'call-connected'
  | 'call-stream'
  | 'call-track'
  | 'call-error';

type ListenersObject = { [key: string]: CallableFunction };

export default class P2PUser {
  identifier: string;
  listeners: ListenersObject;
  instance: Peer.Instance;
  _peerData: any;
  emitSignal: CallableFunction;
  isConnected: boolean;
  options: Peer.Options;
  activeCall?: Peer.Instance;
  callListener?: CallableFunction;
  incomingCallData?: Peer.SignalData;

  constructor(
    identifier: string,
    options: Peer.Options,
    listeners: ListenersObject
  ) {
    this.identifier = identifier;
    this.listeners = listeners;

    this.instance = new Peer(options);

    this.options = options;

    const emitSignal = data => {
      if (typeof this.listeners.onSignal === 'function') {
        this.listeners.onSignal(data);
      }
    };

    this.emitSignal = options.trickle ? debounce(emitSignal, 1000) : emitSignal;

    this.instance.on('connect', this.onConnect.bind(this));
    this.instance.on('signal', this.onSignal.bind(this));
    this.instance.on('error', this.onError.bind(this));
    this.instance.on('data', this.onData.bind(this));
    this.instance.on('track', this.onTrack.bind(this));
    this.instance.on('stream', this.onStream.bind(this));
    this.instance.on('close', this.onClose.bind(this));

    this.isConnected = false;
  }

  public onSignal(data) {
    this._peerData = data;
    this.emitSignal(this._peerData);
  }

  public onConnect() {
    this.isConnected = true;
    if (typeof this.listeners.onConnect === 'function') {
      this.listeners.onConnect(this.identifier);
    }
  }

  public onError(error) {
    console.log(`Failed to connect ${this.identifier}`);
    console.log(error);
    if (typeof this.listeners.onError === 'function') {
      this.listeners.onError(error);
    }
  }

  public onClose() {
    console.log('onclose');
    this.isConnected = false;
    if (typeof this.listeners.onClose === 'function') {
      this.listeners.onClose();
    }
  }

  public onData(data) {
    const decoder = new TextDecoder();
    const decodedString = decoder.decode(data);
    const parsedData = JSON.parse(decodedString);

    if (parsedData?.type === 'call-request') {
      this.incomingCallData = parsedData.data;
      if (typeof this.listeners.onCall === 'function') {
        this.listeners.onCall(parsedData?.type);
      }
    } else if (parsedData?.type === 'call-answer') {
      this.activeCall?.signal(parsedData.data);
    } else if (parsedData?.type === 'call-hangup') {
      this.hangupCall();
    } else if (typeof this.listeners.onData === 'function') {
      this.listeners.onData(parsedData);
    }
  }

  public onTrack(track, stream) {
    console.log('track', track);
    console.log('stream', stream);
    if (typeof this.listeners.onTrack === 'function') {
      this.listeners.onTrack(track, stream);
    }
  }

  public onStream(stream) {
    console.log('stream', stream);
    if (typeof this.listeners.onStream === 'function') {
      this.listeners.onStream(stream);
    }
  }

  public forwardSignal(data) {
    this.instance.signal(data);
  }

  public subscribeToCallEvents(callback: CallableFunction) {
    this.callListener = callback;
  }

  private emitCallEvent(event: CallEvent, ...args) {
    if (this.callListener) {
      this.callListener(event, ...args);
    }
  }

  private createCallPeer(options: Peer.Options): Peer.Instance {
    const callPeer = new Peer(options);

    callPeer.on('signal', data => {
      const type = data.type === 'offer' ? 'call-request' : 'call-answer';
      this.instance.send(JSON.stringify({ type, data }));
    });

    callPeer.on('connect', () => {
      this.emitCallEvent('call-connected');
    });

    callPeer.on('stream', stream => {
      this.emitCallEvent('call-stream', stream);
    });

    callPeer.on('track', (track, stream) => {
      this.emitCallEvent('call-track', track, stream);
    });

    callPeer.on('error', error => {
      this.emitCallEvent('call-error', error);
    });

    return callPeer;
  }

  public call(stream: MediaStream) {
    if (!this.isConnected)
      return new Error('Parent connection not established.');

    if (this.activeCall) {
      console.warn('Call already active');
      return null;
    }

    const callPeer = this.createCallPeer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    this.activeCall = callPeer;
  }

  public answerCall(stream: MediaStream) {
    const callPeer = this.createCallPeer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    if (this.incomingCallData) {
      callPeer.signal(this.incomingCallData);
    }

    this.activeCall = callPeer;
  }

  public hangupCall() {
    console.log("hang");
    this.activeCall?.end();
    this.activeCall = undefined;
  }

  public send(data: any) {
    this.instance.send(data);
  }

  public destroy() {
    this.activeCall?.destroy();
    this.instance.destroy();
  }
}
