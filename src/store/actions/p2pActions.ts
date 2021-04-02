import ThreadID from '@textile/threads-id';

export default {
  async initP2P({ commit, dispatch, state }, { client }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const ethereum = this.$app.$ethereum;

    dispatch('subscribeToFriendsSignals');

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        console.log('signal', event, identifier, data);
        dispatch('secureSignal', { signal: data, identifier: identifier });

        // commit('ICEConnected', true);
      },
      ['signal']
    );

    // Watch for users typing
    WebRTC.subscribe(
      (event, identifier, message) => {
        commit('userTyping', [identifier, message.data]);
      },
      ['typing-notice'],
      state.activeChats
    );

    // Track the health of a peer
    WebRTC.subscribe(
      (event, identifier) => {
        commit('peerHealth', [identifier, 'alive']);
      },
      ['heartbeat'],
      state.activeChats
    );

    // Track the death of a peer
    WebRTC.subscribe(
      (event, identifier) => {
        commit('peerHealth', [identifier, 'dead']);
      },
      ['flatlined'],
      state.activeChats
    );

    WebRTC.init(ethereum.activeAccount);
  },
  async signal({ commit, dispatch, state }, { signal }) {
    // @ts-ignore
    const signalingManager = this.$app.$signalingManager;

    const sig = signalingManager.buildSignal(signal);

    await signalingManager.updateSignal(sig);
  },
  async secureSignal({ commit, dispatch, state }, { signal, identifier }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;

    const sig = signalingManager.buildSignal(signal);

    const friend = state.friends.find(f => f.address === identifier);

    console.log('secure signal', identifier);

    if (friend) {
      signalingManager.updateSignal(friend.threadID, sig);
    }
  },
  async subscribeToFriendsSignals({ state, dispatch }) {
    state.friends.forEach(friend => {
      dispatch('subscribeToFriendSignal', { friend });
    });

    const friend = state.friends[0];
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    await WebRTC.connect(friend.address);
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
          console.log('sender', update?.instance);
          const sender = update?.instance?.sender;
          const data = update?.instance?.payload?.signalingData;

          if (sender && data) {
            data.forEach(d => {
              console.log('forward signal', d);
              WebRTC.forwardSignal(d);
            });

            // dispatch('secureSignal', { signal: data, identifier: sender });
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
  }
};
