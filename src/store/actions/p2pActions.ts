import ThreadID from '@textile/threads-id';
import { isInitiator } from '../../classes/webrtc/WebRTC';

export default {
  async initP2P({ commit, dispatch, state }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    dispatch('subscribeToFriendsSignals', { friends: state.friends });

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        dispatch('signal', { signal: data, identifier: identifier });
        commit('ICEConnected', true);
      },
      ['signal']
    );

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        dispatch('setFriendStatus', { address: identifier, status: 'alive' });
      },
      ['connect']
    );

    // Watch for users typing
    WebRTC.subscribe(
      (event, identifier, message) => {
        commit('userTyping', [identifier, message.data]);
      },
      ['typing-notice'],
      state.activeChats
    );

    // Watch for users typing
    WebRTC.subscribe(
      (event, identifier, message) => {
        commit('incomingCall', identifier);
      },
      ['incoming-call']
    );

    WebRTC.subscribe(
      (event, identifier, message) => {
        dispatch('setFriendStatus', { address: identifier, status: 'dead' });
      },
      ['disconnect']
    );
  },
  async signal({ commit, dispatch, state }, { signal, identifier }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;

    const sig = signalingManager.buildSignal(signal);

    const friend = state.friends.find(f => f.address === identifier);

    if (friend) {
      signalingManager.updateSignal(friend.threadID, sig);
    }
  },
  async subscribeToFriendsSignals({ dispatch }, { friends }) {
    friends.forEach(friend => {
      dispatch('subscribeToFriendSignal', { friend });
      dispatch('tryConnect', { friend });
    });
  },
  async subscribeToFriendSignal({ dispatch }, { friend }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    const threadID = ThreadID.fromString(friend.threadID);

    signalingManager.subscribe(
      threadID,
      friend.address,
      async update => {
        if (update?.instance) {
          const sender = update?.instance?.sender;
          const data = update?.instance?.payload?.signalingData;

          if (sender && data) {
            WebRTC.forwardSignal(sender, data);
          }
        }
      },
      () => {
        dispatch('subscribeToFriendSignal', { friend });
      }
    );
  },
  async tryConnect({}, { friend }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    await WebRTC.connect(friend.address, true);
  },
  async call({}, { friend }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    await WebRTC.call(friend.address);
  },
  async answerCall({ commit, state }, { friend, stream }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    WebRTC.answerCall(friend.address, stream);

    commit('incomingCall', false);
    commit('activeCall', state.activeChat);
  }
};
