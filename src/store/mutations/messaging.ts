// @ts-ignore
import IMessage from '../../interfaces/IMessaage';
import { IState } from '../createState';

export default {
  clearTypingUsers(state: IState) {
    // eslint-disable-next-line
    state.typingUsers = {};
  },
  // Create a new active chat
  newChat(state: IState, clientId: string) {
    const { activeChats } = state;
    if (!activeChats.includes(clientId)) {
      activeChats.unshift(clientId);
    }
    
    state.activeChats = activeChats;
  },
  userTyping(state: IState, payload: any) {
    const typingUsers = { ...state.typingUsers, [payload[0]]: payload[1] };
    state.typingUsers = typingUsers;
  },
  loadingMessages(state: IState) {
    state.messages = [];
    state.loadingMessages = true;
  },
  // Group messages by sender for cleanliness.
  updateMessages(state: IState, messages: IMessage[]) {
    state.messages = messages;
    state.loadingMessages = false;
  },
  appendMessage(state: IState, message: IMessage) {
    let filtered = [...state.messages];
    // @ts-ignore
    filtered = filtered.filter(msg => msg.id !== message.id);
    filtered.push(message);
    state.messages = filtered;
  },
  markUnread(state: IState, address: string) {
    const { unreads } = state;
    if (!unreads.includes(address)) {
      unreads.push(address);
    }
    state.unreads = unreads;
  },
  markRead(state: IState, address: string) {
    let { unreads } = state;
    unreads = unreads.filter(a => a !== address);
    state.unreads = unreads;
  },
};
