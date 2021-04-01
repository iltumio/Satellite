import Peer from 'simple-peer';
// @ts-ignore
import P2PUser from './P2PUser';
import { debounce } from '../../utils/utils';

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
  | '*'
  | 'initiator-signal'
  | 'peer-signal'
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

export default class SatellitePeer extends Peer {
  private _identifier: string;
  peerData: Array<any>;
  onSignal?: CallableFunction;

  /** @constructor
   * Construct a new Peer 2 Peer handler
   * @argument identifier the ID we'd like to use for handshakes
   */
  constructor(opts: Peer.Options, identifier: string) {
    super(opts);
    this._identifier = this.buildIdentifier(identifier);

    this.peerData = [];

    this.on('signal', this._onSignal);
  }

  debouncedSignal = (cb: CallableFunction) => {
    this.onSignal = debounce(cb, 1000);
  };

  private _onSignal(data: any) {
    this.peerData.push(data);
    this.onSignal && this.onSignal(this.peerData);
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

  //   /** @method
  //    * Get a list of current subscribers
  //    * @name subscribers
  //    * @returns array of Subscribers
  //    */
  //   get subscribers(): Subscriber[] {
  //     return this._subscribers;
  //   }

  /** @method
   * Get a list of current subscribers
   * @name events
   * @returns Returns array of acceptable RTC Event enums
   */
  get events(): RTCEvent[] {
    // TODO: Convert this to a string union
    return [
      '*',
      'initiator-signal',
      'peer-signal',
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
}
