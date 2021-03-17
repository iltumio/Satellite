interface IMessage {
  _id: string;
  sender: string;
  at: number;
  type: string;
  payload: any;
}

export default IMessage;
