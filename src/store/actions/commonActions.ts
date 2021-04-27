export default {
  async startup({ dispatch, state, commit }) {
    // First load wallet and connect
    if (state.mnemonic) {
      await dispatch('web3Start');

      const { client } = await dispatch('initDatabase');

      // Initialize p2p connection
      await dispatch('initP2P', { client });

      // Dispatch a new action to fetch friends
      await dispatch('fetchFriends', state.activeAccount);

      // Fetch friend requests
      await dispatch('fetchFriendRequests');

      // Dispatch a new action to fetch servers
      await dispatch('fetchServers');

      // Dispatch new action to start a listener to new friends requests
      dispatch('startFriendsListeners');

      commit('ICEConnected', true);
    }
  },
  async setActiveChat({ commit, state, dispatch }, { friendAddress }) {
    commit('activeChat', friendAddress);

    dispatch('fetchMessages', { address: friendAddress });

    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    if (!WebRTC.isPeerConnected(friendAddress)) {
      const friend = state.friends.find(f => f.address === friendAddress);
      dispatch('initiateConnection', { friend });
    }
  }
};
