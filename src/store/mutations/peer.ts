import IFriend from "../../interfaces/IFriend";

export default {
  // Update a peers status
  peerHealth(state: any, data: any) {
    const [id, status] = data;
    const friend = state.friends ? state.friends.filter((f: IFriend) => f.address === id)[0] : null;
    if (friend) {
      const withoutFriend = state.friends.filter(f => f.address !== id);
      friend.status = status;
      withoutFriend.push(friend);
      // eslint-disable-next-line
      withoutFriend.sort((a: IFriend, b: IFriend) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
      // eslint-disable-next-line no-param-reassign
      state.friends = withoutFriend;
    }
  },
  // Update p2p handshake server status
  ICEConnected(state: any, status: string) {
    // eslint-disable-next-line no-param-reassign
    state.p2pOnline = status;
  },
};
