import ThreadID from '@textile/threads-id';
import dayjs from 'dayjs';

export default {
  async initP2P({ commit, dispatch, state }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        dispatch('signal', { signal: data, identifier: identifier });
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
      if (sig.type === 'offer') {
        signalingManager.initializeConnection(friend.threadID, sig, identifier);
      } else {
        signalingManager.updateSignal(friend.threadID, sig);
      }
    }
  },
  async subscribeToFriendsSignals({ dispatch }, { friends }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    friends.forEach(async friend => {
      // dispatch('checkLastSignal', { friend });
      await dispatch('subscribeToFriendSignal', { friend });
      if (!WebRTC.isPeerConnected(friend.address)) {
        dispatch('initiateConnection', { friend });
      }
    });
  },
  async checkLastSignal({}, { friend }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    const threadID = ThreadID.fromString(friend.threadID);

    const lastSignal = await signalingManager.getLastSignalData(
      threadID,
      friend.address
    );

    if (!lastSignal) return;

    const elapsedTime = dayjs().diff(dayjs(lastSignal.at), 'seconds');

    if (elapsedTime <= 60 && lastSignal?.initiator) {
      const sender = lastSignal?.sender;
      const data = lastSignal?.payload?.signalingData;
      await WebRTC.forwardSignal(sender, data);
    }
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
        if (!update?.instance) return;

        const sender = update?.instance?.sender;
        const data = update?.instance?.payload?.signalingData;

        if (!sender || !data) return;

        if (data.type === 'offer') {
          WebRTC.connectToRemote(sender, data);
        } else {
          WebRTC.forwardSignal(sender, data);
        }
      },
      () => {
        dispatch('subscribeToFriendSignal', { friend });
      }
    );

    return;
  },
  async initiateConnection({}, { friend }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    await WebRTC.initiateConnection(friend.address, true);
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
