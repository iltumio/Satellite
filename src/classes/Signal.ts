export default class Signal {
  _id: string;
  sender: string;
  at: number;
  type: string;
  payload: any;
  initiator: boolean;

  /** @constructor
   * Construct a new Message
   * @argument sender the sender of the message
   * @argument at time the message was recived
   * @argument type string type of the message
   * @argument payload payload recived from the message
   */
  constructor(sender: string, at: number, type: string, payload: any, initiator: boolean) {
    this._id = sender;
    this.sender = sender;
    this.at = at;
    this.type = type;
    this.payload = payload;
    this.initiator = initiator;
  }
}
