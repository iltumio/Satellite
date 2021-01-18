// @ts-ignore
import config from '@/config/config.js';
// @ts-ignore
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';
import Friends from "../../classes/contracts/Friends";
import IFriend from "../../interfaces/IFriend";
import { parse } from 'uuid';

const friendsContract =  new Friends(config.friends[config.network.chain]);
const dwellerCachingHelper = new DwellerCachingHelper(
  config.registry[config.network.chain],
  config.cacher.dwellerLifespan,
);

export default {
  // Add a new friend to the local cache
  addFriend(state: any, friend: IFriend) {
    const { friends } = state;
    if (friends.filter((f: IFriend) => f.address === friend.address).length === 0) {
      friends.push(friend);
    }
    // eslint-disable-next-line
    friends.sort((a: IFriend, b: IFriend) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    // eslint-disable-next-line no-param-reassign
    state.friends = friends;
    // storage
    // @ts-ignore
    const bucket = window.Vault74.Database.Bucket('friends');
    bucket.add(friend);
  },
  async fetchFriends(state: any, account: string) {
    let friends = await friendsContract.getFriends(account);
    friends = friends.map(f => f[0]);
    const parsedFriends: any[] = [];
    friends.forEach(async (f, i) => {
      const friend = await dwellerCachingHelper.getDweller(f);
      parsedFriends[i] = friend;
      if (parsedFriends.length == friends.length) {
        state.friends = parsedFriends;
      }
    });
  },
  clearFriends(state: any) {
    // eslint-disable-next-line
    state.friends = null;
  },
};
