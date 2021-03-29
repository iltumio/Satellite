import { ethers } from 'ethers';

export default {
  async startup({ commit, dispatch, state }) {
    // First load wallet and connect
    if (state.mnemonic) {
      const wallet = ethers.Wallet.fromMnemonic(state.mnemonic);
      await dispatch('connectProvider', {
        providerInfo: state.selectedProvider,
        wallet
      });
    }

    const { client } = await dispatch('initDatabase');

    // Dispatch a new action to fetch friends
    await dispatch('fetchFriends', state.activeAccount);
    // Dispatch new action to start a listener to new friends requests
    dispatch('startFriendsListeners');

    await dispatch('initP2P', { client });
  }
};
