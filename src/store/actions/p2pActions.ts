export default {
  async initP2P({ commit, dispatch, state }, { client }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const ethereum = this.$app.$ethereum;
    // @ts-ignore
    const signalingManager = this.$app.$signalingManager;

    // Signaling Manager initialization
    signalingManager.init(client, state.activeAccount);

    // TODO: Move this to polling
    const addresses = state.friends.map(f => f.address);
    WebRTC.updateRegistry(addresses);

    // TODO: update this when active chats updates.

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        dispatch('secureSignal', { signal: data });

        commit('ICEConnected', true);
      },
      ['connection-established']
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

    const tid = signalingManager.threadID;

    const lastSig = await signalingManager.getLastSinal(tid);

    console.log('last signal', lastSig);
  },
  async secureSignal({ commit, dispatch, state }, { signal }) {
    // @ts-ignore
    const { messageManager } = this.$app.$database;

    const sig = messageManager.buildSignal(signal);

    const friend = state.friends[0];

    messageManager.updateSignal(friend.threadID, sig);

    console.log(`Update signal`, signal);

    messageManager.getLastSignalData(friend.threadID);


    // state.friends.forEach((friend)=>{
    //   console.log(`Update signal for ${friend.address}`);
    //   messageManager.updateSignal(friend.threadID, sig);
    // })
  },
  async subscribeToFriendsSignals({ state, dispatch }) {
    state.friends.forEach(friend => {
      dispatch('subscribeToFriendSignal', { friend });
    });
  },
  async subscribeToFriendSignal({}, { friend }) {
    console.log('subscribe to', friend.address);
  }
};
