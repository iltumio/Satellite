import IMessage from '../interfaces/IMessaage';
import Message from './Message';

export default class MessageBroker {
  storage: any;
  peerId: string;
  update: CallableFunction;
  pulseUser: CallableFunction;
  /** @constructor
   * Construct a new Message Broker
   * @argument peerId the local peer ID
   * @argument update callback method to update our application with new messages
   */
  constructor(peerId: string, update: CallableFunction, pulseUser: CallableFunction) {
    const storedStorage = localStorage.getItem('vault74.messageHistory');
    this.storage = storedStorage ? JSON.parse(storedStorage) : {};
    this.peerId = peerId;
    this.update = update;
    this.pulseUser = pulseUser;
  }

  setConvo(id: string, messages: IMessage[]) {
    const sorted = messages.sort((a, b) => a.at - b.at);
    this.storage[id] = [...sorted];
    localStorage.setItem('vault74.messageHistory', JSON.stringify(this.storage));
    this.update(this.storage);
  }

  /** @function
   * @name addToConvo
   * Add a new message to the conversation object
   * @argument id id of the remote chatter
   * @argument message message object containing the type of message and content
   */
  addToConvo(id: string, message: Message) {
    this.storage[id] = this.storage[id] ? [...this.storage[id], message] : [message];
    localStorage.setItem('vault74.messageHistory', JSON.stringify(this.storage));
    this.update(this.storage);
    this.pulseUser(message.sender);
  }

  /** @function
   * @name recievedMessage
   * Handle a newly recived message from a remote peer
   * @argument sender remote id of the person who sent the message
   * @argument at time the message was recived
   * @argument type string type of the message
   * @argument data payload recived from the message
   */
  recievedMessage(sender: string, at: number, type: string, data: any) {
    const message = new Message(sender, at, data.type, data.data);
    this.addToConvo(`${this.peerId}::${sender}`, message);
  }

  /** @function
   * @name sentMessage
   * Handle a newly sent message to a remote peer
   * @argument to remote id of the person who we sent the message
   * @argument at time the message was sent
   * @argument type string type of the message
   * @argument data payload sent in the message
   */
  sentMessage(to: string, at: number, type: string, data: any) {
    const message = new Message(this.peerId, at, type, data);
    this.addToConvo(`${this.peerId}::${to}`, message);
    return message;
  }

  /** @function
   * @name getConversationGroup
   * Get a object of the current conversation
   * @argument id id of the remote chatter to get the group from
   */
  getConversationGroup(id: string) {
    return this.storage[id];
  }

  /** @function
   * @name stringify
   * Abstraction of stringifying the message so we can change this at will
   * @argument msg message object to stringify
   */
  static stringify(msg: string) {
    return JSON.stringify(msg);
  }

  /** @function
   * @name parse
   * Abstraction of parsing the message so we can change this at will
   * @argument msg message object to parse
   */
  static parse(msg: string) {
    return JSON.parse(msg);
  }
}
