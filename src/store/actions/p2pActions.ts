import ThreadID from '@textile/threads-id';
import { isInitiator } from '../../classes/webrtc/WebRTC';

export default {
  async initP2P({ commit, dispatch, state }, { client }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    dispatch('subscribeToFriendsSignals');

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
        console.log('incoming call from', identifier, message);
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
  async subscribeToFriendsSignals({ state, dispatch }) {
    state.friends.forEach(friend => {
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

          // const initiator = isInitiator(data);

          // console.log('instance', data);

          if (sender && data) {
            WebRTC.forwardSignal(sender, data);
          }
        }
      },
      () => {
        console.log('unsubscribed from ', friend.address);
        dispatch('subscribeToFriendSignal', { friend });
      }
    );
  },
  async getLastSignalData({}, { friend }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;

    const signal = await signalingManager.getLastSignalData(
      friend.threadID,
      friend.address
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
