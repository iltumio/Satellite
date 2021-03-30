export default {
  async dispatchCommand({ commit }, command) {
    console.log('command', command)

    commit('setCommand', command.command)
    commit('setArgs', command.args)
  },
};
