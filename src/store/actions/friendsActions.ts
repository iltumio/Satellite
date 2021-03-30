import config from '../../config/config';
import DwellerCachingHelper from '../../classes/DwellerCachingHelper';
import Friends from '../../classes/contracts/Friends';
import IFriend from '../../interfaces/IFriend';

export default {
  async fetchFriends({ commit, state }) {
    // @ts-ignore
    const friendsContract = new Friends(
      // @ts-ignore
      this.$app.$ethereum,
      config.friends[config.network.chain],
    );

    // Get the friends from chain
    const friends = await friendsContract.getFriends();

    let updatedFriends: Array<IFriend> = [];

    if (friends.length > 0) {
      const dwellerCachingHelper = new DwellerCachingHelper(
        // @ts-ignore
        this.$app.$ethereum,
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan,
      );

      // Join data from cachingHelper and friends contract
      const getData = async (friend): Promise<IFriend> => {
        const parsed = await friendsContract.parseFriend(friend);
        const dwellerCache = await dwellerCachingHelper.getDweller(friend.dweller);

        return { ...dwellerCache, threadID: parsed.threadHash };
      };

      const parsedFriends = await Promise.all < IFriend > (friends.map(getData));

      updatedFriends = parsedFriends?.sort((a: IFriend, b: IFriend): any =>
        (a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
      );
      updatedFriends = parsedFriends;
    }

    // TODO: eventually limit UI updates if friends didn't change
    //   !state.friendsLoaded ||
    //   JSON.stringify(state.friends) !== JSON.stringify(updatedFriends)
    commit('updateFriends', updatedFriends);
  },
  async startFriendsListeners({ dispatch }) {
    // @ts-ignore
    const friendsContract = new Friends(
      // @ts-ignore
      this.$app.$ethereum,
      config.friends[config.network.chain],
    );

    friendsContract.startAllListeners(() => {
      // Fetch friends requests
      dispatch('fetchFriendRequests');
      dispatch('fetchFriends');
    });
  },
  async fetchFriendRequests({ commit }) {
    // @ts-ignore
    const friendsContract = new Friends(
      // @ts-ignore
      this.$app.$ethereum,
      config.friends[config.network.chain],
    );

    const dwellerCachingHelper = new DwellerCachingHelper(
      // @ts-ignore
      this.$app.$ethereum,
      config.registry[config.network.chain],
      config.cacher.dwellerLifespan,
    );

    const requests = await friendsContract.getRequests();
    const requestsPromise = requests.map(async (request) => {
      const friendData = await dwellerCachingHelper.getDweller(request[0]);

      return { ...friendData, address: request[0], publicKey: request[1] };
    });

    const parsedRequests = await Promise.all(requestsPromise);

    commit('updateFriendRequests', parsedRequests);
  },
  async sendFriendRequest({ commit }, { address }) {
    // @ts-ignore
    const friendsContract = new Friends(
      // @ts-ignore
      this.$app.$ethereum,
      config.friends[config.network.chain],
    );

    await friendsContract.makeRequest(address).catch(e => console.log('error', e));
  },
  async acceptRequest({ commit, state, dispatch }, { address, threadId }) {
    // @ts-ignore
    const friendsContract = new Friends(
      // @ts-ignore
      this.$app.$ethereum,
      config.friends[config.network.chain],
    );

    try {
      await friendsContract.acceptRequest(address, threadId.toString());
      // @ts-ignore
      await this.$app.$database.threadManager.storeThread(
        `${state.activeAccount}-${address}`,
        threadId.toString(),
      );

      dispatch('fetchFriendRequests');

      const dwellerCachingHelper = new DwellerCachingHelper(
        // @ts-ignore
        this.$app.$ethereum,
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan,
      );

      const friend = await dwellerCachingHelper.getDweller(address);

      commit('addFriend', {
        ...friend,
        threadId,
      });
    } catch (e) {
      console.log(e);
    }
  },
  async denyRequest({ dispatch }, { address }) {
    console.log('deny request', address);
    // @ts-ignore
    const friendsContract = new Friends(
      // @ts-ignore
      this.$app.$ethereum,
      config.friends[config.network.chain],
    );

    await friendsContract.denyRequest(address).catch(console.log);
    dispatch('fetchFriendRequests');
  },
  async removeFriend({ commit, state }, address) {
    // @ts-ignore
    const friendsContract = new Friends(
      // @ts-ignore
      this.$app.$ethereum,
      config.friends[config.network.chain],
    );
    // @ts-ignore
    await friendsContract.removeFriend(address)

    commit('removeFriend', address)
    state.activeChats.length > 0 ? commit('activeChat', state.activeChats[0]) : commit('activeChat', false);
  }
};
