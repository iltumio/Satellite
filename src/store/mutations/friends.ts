// @ts-ignore
import config from '@/config/config.js';
// @ts-ignore
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';
import Friends from "../../classes/contracts/Friends";
import IFriend from "../../interfaces/IFriend";
import store from '..';

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
  },
  // For caching purposes
  updateFriendRequests(state: any, requests: any) {
    // eslint-disable-next-line
    state.friendRequests = requests;
  },
  async fetchFriends(state: any, account: string) {
    // Data we need to care about when comparing if friends
    // data has changed. We check to make sure the friends are
    // different to avoid updating state un-nessisarily across the app.
    const metadata = ['photo', 'name'];

    // Get the friends from chain
    let friends = await friendsContract.getFriends(account);
    const friendAddresses = friends.map(f => f[0]);
    if (friendAddresses.length === 0) {
      state.friends = [];
      state.friendsLoaded = true;
    }
    const parsedFriends: any[] = [];
    // If true, we will update the friends list.
    let updateNeeded = (state.friends) ? false : true;
  
    friendAddresses.forEach(async (f, i) => {
      const friend = await dwellerCachingHelper.getDweller(f);
      const parsedFriend = await friendsContract.parseFriend(friends[i]);
      
      parsedFriends.push({ ...friend, threadID: parsedFriend.threadHash });

      if (!updateNeeded) { // If we already need to update, don't bother checking again
        const storedFriend = state.friends.filter(f => f.address === friend.address);
        
        Object.keys(storedFriend).forEach(key => {
          if (metadata.includes(key) && storedFriend[key] !== friend[key]) {
            updateNeeded = true;
          }
        });
      }

      if (parsedFriends.length == friendAddresses.length) {
        // Alpha sort friends
        // eslint-disable-next-line
        parsedFriends.sort((a: IFriend, b: IFriend) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
        if (JSON.stringify(state.friends) !== JSON.stringify(parsedFriends) && updateNeeded) {
          state.friends = parsedFriends;
        }
        state.friendsLoaded = true;
      }
    });
  },
  clearFriends(state: any) {
    // eslint-disable-next-line
    state.friends = null;
    state.friendsLoaded = false;
  },
};
