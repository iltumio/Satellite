export default {
  async bindThread({ commit, state }, { friend }) {
    // @ts-ignore
    const threadID = await this.$app.$database.threadManager.makeIdentifier(
      state.activeAccount,
      friend.address
    );

    // @ts-ignore
    this.$app.$database.threadManager.storeThread(threadID, friend.threadID);
  },
  async bindAllThreads({ state, dispatch }) {
    const { friends } = state;
    friends.forEach(async friend => {
      dispatch('bindThread', { friend });
    });
  },
  async subscribeToThread({ state, commit }, { friend }) {
    // @ts-ignore
    const database = this.$app.$database;
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const SoundManager = this.$app.$sound;

    // Generate our IDs
    const id = database.threadManager.makeIdentifier(
      state.activeAccount,
      friend.address
    );

      // Open the thread
      const threadID = await database.threadManager.threadAt(id);
      // Subscribe to thread events.
      await database.messageManager.subscribe(threadID, async update => {        
        if (update.instance.sender !== state.activeChat) {
          // Add an unread message indicator and if the user isn't in our sidebar,
          // add a new chat group for them.
          commit('markUnread', update.instance.sender);
          commit('newChat', update.instance.sender);

          SoundManager.play('newMessage');
        }
        
        if (friend.pubkey) {
          const decrypted = await database.messageManager.decryptMessage(
            update.instance,
            friend.pubkey
          );
          if (
            update.instance.sender === state.activeChat ||
            update.instance.sender === state.activeAccount
          ) {
            commit('appendMessage', decrypted);
          }
        } else if (
          update.instance.sender === state.activeChat ||
          update.instance.sender === state.activeAccount
        ) {
          commit('appendMessage', update.instance);
        }

        // If we're recieving messages from a peer and they are not connected, try to connect.
        WebRTC.connectIfNotConnected(update.instance.sender);
      });
  },
  unsubscribeFromThread({}, { friend }) {
    // @ts-ignore
    const database = this.$app.$database;

    database.unsubscribeFromThread(friend.threadID);
  },
  subscribeToAllThreads({ dispatch, state }, { friends }) {
    const friendsToLoop = friends ? friends : state.friends;

    // @ts-ignore
    const database = this.$app.$database;

    friendsToLoop.forEach(friend => {
      if (!database.messageManager.isSubscribed(friend.threadID)) {
        dispatch('subscribeToThread', { friend });
      }
    });
  },
  async fetchMessages({ state, commit }, { address }) {
    // @ts-ignore
    const database = this.$app.$database;
    const friend = state.friends.find(friend => friend.address === address);

    if (!friend) return;

    commit('loadingMessages');
    const messages = await database.messageManager.getMessages(
      friend.threadID.toString()
    );

    const decrypted = await database.messageManager.bulkDecrypt(
      messages,
      friend.pubkey
    );
    commit('updateMessages', decrypted);
  }
};
