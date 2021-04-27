export default {
  async initDatabase({ commit, dispatch, state }) {
    // @ts-ignore
    const database = this.$app.$database;
    // @ts-ignore
    const Threads = this.$app.$Threads;
    // @ts-ignore
    const RemoteStorage = this.$app.$RemoteStorage;
    // @ts-ignore
    const ethereum = this.$app.$ethereum;
    // @ts-ignore
    const v74pin = window.v74pin;

    commit('starting', true);
    if (state.databaseEnabled) {
      const identity = await Threads.getIdentity();
      const client = await Threads.authorize(identity);

      // We should depricate this when we move to only using the ThreadDB class
      await Threads.init(state.activeAccount, client.client, client.token);

      // Initalize ThreadDB
      // await this.$ThreadDB.init(state.activeAccount);
      // await this.$ThreadDB.auth();

      // Init Remote Storage
      await RemoteStorage.init('remote-storage');
      await RemoteStorage.authorize();

      await database.authenticate(
        'textile',
        state.activeAccount,
        v74pin,
        client,
        identity
      );

      commit('authenticated');

      if (ethereum.isInitialized && ethereum.wallet) {
        // Initialize e2ee
        // @ts-ignore
        const { messageManager } = database;
        messageManager.initE2EEngine(ethereum.wallet);
      }

      commit('starting', false);

      dispatch('initBuckets');

      return client;
    } else {
      await database.authenticate('localStorage', state.activeAccount, v74pin);
      commit('authenticated');
      //   this.startup();
      commit('starting', false);
    }
  },
  async initBuckets({ commit }) {
    // @ts-ignore
    const database = this.$app.$database;
    
    await database.initBuckets();
    commit('buckets');
  }
};
