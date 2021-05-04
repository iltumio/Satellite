export default {
  async startup ({ dispatch, state, commit }) {
    // First load wallet and connect
    if (state.mnemonic) {
      //@ts-ignore
      const database = this.$app.$database
      // @ts-ignore
      const ethereum = this.$app.$ethereum
      // @ts-ignore
      const crypto = this.$app.$crypto

      await dispatch('web3Start')

      // Initialize encryption engine using the current account private key
      if (ethereum.initialized) {
        crypto.init(ethereum.wallet)
      }

      await dispatch('initDatabase')

      // Initialize p2p connection
      await dispatch('initP2P')

      // Dispatch a new action to fetch friends
      await dispatch('fetchFriends', state.activeAccount)

      // Fetch friend requests
      await dispatch('fetchFriendRequests')

      // Dispatch a new action to fetch servers
      await dispatch('fetchServers')

      // Dispatch new action to start a listener to new friends requests
      dispatch('startFriendsListeners')

      commit('ICEConnected', true)

      setTimeout(async () => {
        // const identity = await database.identityManager?.identity

        // console.log('id', identity.public.toString())

        // await database.mailboxManager?.sendMessage(
        //   'bbaareiavmjsv5rxnjtyxbuhnlrtltu2jqmejlzagwvtfzhbfibhszr6syq',
        //   JSON.stringify({ message: 'Ciao', type: 'msg' })
        // )

        const msg = await database.mailboxManager?.listInboxMessages({})

        console.log('msg', msg)
      }, 3000)
    }
  },
  async setActiveChat ({ commit, state, dispatch }, { friendAddress }) {
    commit('activeChat', friendAddress)

    dispatch('fetchMessages', { address: friendAddress })

    // @ts-ignore
    const WebRTC = this.$app.$WebRTC

    if (!WebRTC.isPeerConnected(friendAddress)) {
      const friend = state.friends.find(f => f.address === friendAddress)
      dispatch('initiateConnection', { friend })
    }
  }
}
