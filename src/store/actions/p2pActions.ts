import ThreadID from '@textile/threads-id';

export default {
  async initP2P({ commit, dispatch, state }, { client }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const ethereum = this.$app.$ethereum;
    // @ts-ignore
    // const signalingManager = this.$app.$signalingManager;

    // Signaling Manager initialization
    // signalingManager.init(client, state.activeAccount);

    // TODO: Move this to polling
    const addresses = state.friends.map(f => f.address);
    WebRTC.updateRegistry(addresses);

    // TODO: update this when active chats updates.

    dispatch('subscribeToFriendsSignals');

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        console.log('signal', event, identifier, data);
        dispatch('secureSignal', { signal: data });

        commit('ICEConnected', true);
      },
      ['peer-signal', 'initiator-signal']
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

    // init
    WebRTC.init(ethereum.activeAccount, client);
    // this.peerInit = true;
  },
  async signal({ commit, dispatch, state }, { signal }) {
    // @ts-ignore
    const signalingManager = this.$app.$signalingManager;

    const sig = signalingManager.buildSignal(signal);

    await signalingManager.updateSignal(sig);
  },
  async secureSignal({ commit, dispatch, state }, { signal }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;

    const sig = signalingManager.buildSignal(signal);

    state.friends.forEach(friend => {
      signalingManager.updateSignal(friend.threadID, sig);
    });
  },
  async subscribeToFriendsSignals({ state, dispatch }) {
    state.friends.forEach(friend => {
      dispatch('subscribeToFriendSignal', { friend });
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
          console.log('sender', update?.instance?.sender);
          // WebRTC.updatePeersDataRegistry(friend.address, update?.instance);
          // console.log('instance', update);
          WebRTC.connect(friend.address, update?.instance, (data)=>{
            const sig = signalingManager.buildSignal(data);
            signalingManager.updateSignal(friend.threadID, sig)
          });
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
