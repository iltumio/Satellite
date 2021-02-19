export default {
  fetchFriends({commit, state}) {
    commit('fetchFriends', state.activeAccount);
  },
};
