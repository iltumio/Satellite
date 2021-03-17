import IFriend from '../../interfaces/IFriend';
import { IState } from '../createState';

export default {
  // Add a new friend to the local cache
  addFriend(state: IState, friend: IFriend) {
    const { friends } = state;
    if (
      friends?.filter((f: IFriend) => f.address === friend.address).length === 0
    ) {
      friends.push(friend);
    }

    friends?.sort((a: IFriend, b: IFriend) =>
      a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
    );

    state.friends = friends;
  },
  // For caching purposes
  updateFriendRequests(state: IState, requests: any) {
    state.friendRequests = requests;
  },
  setFriendsLoaded(state: IState, friendsLoaded: boolean) {
    state.friendsLoaded = friendsLoaded;
  },
  updateFriends(state: IState, payload: Array<IFriend>) {
    state.friends = payload;
    state.friendsLoaded = true;
  },
  clearFriends(state: IState) {
    state.friends = [];
    state.friendsLoaded = false;
  }
};
