export default {
  async dispatchCommand({ commit }, command) {
    commit('setCommand', command.command);
    commit('setArgs', command.args);
  }
};
