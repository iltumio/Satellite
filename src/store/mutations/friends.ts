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
  // For caching purposes
  updateFriendRequests(state: any, requests: any) {
    // eslint-disable-next-line
    state.friendRequests = requests;
  },
  async fetchFriends(state: any, account: string) {
    console.log('fetching friends');
    let friends = await friendsContract.getFriends(account);
    let friendAddresses = friends.map(f => f[0]);
    if (friendAddresses.length === 0) {
      state.friends = [];
      state.friendsLoaded = true;
    }
    const parsedFriends: any[] = [];
    friendAddresses.forEach(async (f, i) => {
      const friend = await dwellerCachingHelper.getDweller(f);
      const parsedFriend = await friendsContract.parseFriend(friends[i]);
      parsedFriends[i] = { ...friend, threadID: parsedFriend.threadHash };
      if (parsedFriends.length == friendAddresses.length) {
        // Alpha sort friends
        // eslint-disable-next-line
        parsedFriends.sort((a: IFriend, b: IFriend) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
        state.friends = parsedFriends;
        state.friendsLoaded = true;
        console.log('done updating friends', state.friends);
      }
    });
  },
  clearFriends(state: any) {
    // eslint-disable-next-line
    state.friends = null;
    state.friendsLoaded = false;
  },
};
