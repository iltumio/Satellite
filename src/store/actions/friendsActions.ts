// @ts-ignore
import config from '@/config/config';
import DwellerCachingHelper from '@/classes/DwellerCachingHelper';
import Friends from '@/classes/contracts/Friends';
import IFriend from '@/interfaces/IFriend';

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
        const dwellerCache = await await dwellerCachingHelper.getDweller(friend.dweller);

        return { ...dwellerCache, threadID: parsed.threadHash };
      };

      const parsedFriends = await Promise.all < IFriend > (friends.map(getData));

      updatedFriends = parsedFriends?.sort((a: IFriend, b: IFriend): any =>
        (a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
      );
      updatedFriends = parsedFriends;
    }

    if (
      !state.friendsLoaded ||
      JSON.stringify(state.friends) !== JSON.stringify(updatedFriends)
    ) {
      commit('updateFriends', updatedFriends);
    }
  },
};
