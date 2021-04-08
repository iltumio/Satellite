import { ethers } from 'ethers';

export default {
  async startup({ commit, dispatch, state }) {
    // First load wallet and connect
    if (state.mnemonic) {
      await dispatch('web3Start');

      const { client } = await dispatch('initDatabase');

      // Dispatch a new action to fetch friends
      await dispatch('fetchFriends', state.activeAccount);

      // Dispatch a new action to fetch servers
      await dispatch('fetchServers');

      // Dispatch new action to start a listener to new friends requests
      dispatch('startFriendsListeners');

      await dispatch('initP2P', { client });
    }
  }
};
