// @ts-ignore
import IMessage from '../../interfaces/IMessaage';

export default {
  clearTypingUsers(state: any) {
    // eslint-disable-next-line
    state.typingUsers = {};
  },
  // Create a new active chat
  newChat(state: any, clientId: string) {
    const { activeChats } = state;
    if (!activeChats.includes(clientId)) {
      activeChats.unshift(clientId);
    }
    // eslint-disable-next-line no-param-reassign
    state.activeChats = activeChats;
  },
  userTyping(state: any, payload: any) {
    const typingUsers = {...state.typingUsers};
    typingUsers[payload[0]] = payload[1];
    // eslint-disable-next-line
    state.typingUsers = typingUsers;
  },
  loadingMessages(state: any) {
    state.messages = [];
    state.loadingMessages = true;
  },
  // Group messages by sender for cleanliness.
  updateMessages(state: any, messages: IMessage[]) {
    // eslint-disable-next-line no-param-reassign
    state.messages = messages;
  },
  appendMessage(state: any, message: IMessage) {
    let filtered = [...state.messages];
    filtered = filtered.filter(msg => {
      // HOTFIX: Figure out why the message ids are mixing up later
      // @ts-ignore
      return msg._id !== message._id &&
        // @ts-ignore
        msg.id !== message.id &&
        // @ts-ignore
        msg._id !== message.id &&
        // @ts-ignore
        msg.id !== message._id;
    });
    filtered.push(message);
    state.messages = filtered;
  },
  markUnread(state: any, address: string) {
    const unreads = state.unreads;
    if (!unreads.includes(address)) {
      unreads.push(address);
    }
    state.unreads = unreads;
  },
  markRead(state: any, address: string) {
    let unreads = state.unreads;
    unreads = unreads.filter(a => a !== address);
    state.unreads = unreads;
  },
};
