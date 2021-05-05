function convertMsg (msg) {
  return {
    id: msg.id,
    from: msg.from,
    readAt: msg.readAt,
    sent: msg.sent,
    sender: msg.body.sender,
    to: msg.body.to,
    at: msg.body.at,
    payload: msg.body.payload,
    metadata: msg.body.metadata
  }
}

export default {
  async fetchMailbox ({ state, commit }) {
    // @ts-ignore
    const database = this.$app.$database

    commit('loadingMessages')
    const inboxMessages = await database.mailboxManager?.listInboxMessages()
    const sentboxMessages = await database.mailboxManager?.listSentboxMessages()

    const imsg = inboxMessages.map(convertMsg)
    const smsg = sentboxMessages.map(convertMsg)

    const conversation = [...imsg, ...smsg].sort((a, b) => a.at - b.at)

    commit('updateMessages', conversation)
  },
  async subscribeToMailbox ({ state, commit, dispatch }) {
    // @ts-ignore
    const database = this.$app.$database
    // @ts-ignore
    const crypto = this.$app.$crypto
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC
    // @ts-ignore
    const SoundManager = this.$app.$sound

    // Watch for users typing
    WebRTC.subscribe(
      identifier => {
        if (!database.mailboxManager?.isSubscribed('inbox')) {
          database.mailboxManager?.listenToInboxMessages(message => {
            console.log('message', message)
            const msg = convertMsg(message)

            if (msg.sender !== state.activeChat) {
              // Add an unread message indicator and if the user isn't in our sidebar,
              // add a new chat group for them.
              commit('markUnread', msg.sender)
              commit('newChat', msg.sender)
            }

            const friend = state.friends.find(f => f.address === identifier)

            if (friend?.pubkey) {
              state.lastMessages[msg.sender] = {
                ...msg.payload,
                at: Date.now()
              }

              if (
                msg.sender === state.activeChat ||
                msg.sender === state.activeAccount
              ) {
                commit('appendMessage', msg)
              }
            } else if (
              msg.sender === state.activeChat ||
              msg.sender === state.activeAccount
            ) {
              commit('appendMessage', msg)
            }

            if (
              msg.sender !== state.activeAccount &&
              (msg.sender !== state.activeChat || !document.hasFocus())
            ) {
              SoundManager.play('newMessage')
            }
          })

          console.log('Subscribed to inbox for', identifier)
        }
      },
      ['typing-notice'],
      state.friends.map(friend => friend.address)
    )

    console.log('Subscribe to mailbox')

    // const threadID = ThreadID.fromString(friend.threadID)

    // // Subscribe to thread events.
    // await database.messageManager.subscribe(
    //   threadID,
    //   async update => {
    // if (update.instance.sender !== state.activeChat) {
    //   // Add an unread message indicator and if the user isn't in our sidebar,
    //   // add a new chat group for them.
    //   commit('markUnread', update.instance.sender)
    //   commit('newChat', update.instance.sender)
    // }

    // if (friend.pubkey) {
    //   const decrypted = await database.messageManager.decryptMessage(
    //     update.instance,
    //     friend.pubkey
    //   )
    //   state.lastMessages[update.instance.sender] = {
    //     ...decrypted.payload,
    //     at: Date.now()
    //   }
    //   if (
    //     update.instance.sender === state.activeChat ||
    //     update.instance.sender === state.activeAccount
    //   ) {
    //     commit('appendMessage', decrypted)
    //   }
    // } else if (
    //   update.instance.sender === state.activeChat ||
    //   update.instance.sender === state.activeAccount
    // ) {
    //   commit('appendMessage', update.instance)
    // }

    // if (
    //   update.instance.sender !== state.activeAccount &&
    //   (update.instance.sender !== state.activeChat || !document.hasFocus())
    // ) {
    //   SoundManager.play('newMessage')
    // }

    //     // If we're recieving messages from a peer and they are not connected, try to connect.
    //     // WebRTC.connectIfNotConnected(update.instance.sender);
    //   },
    //   () => {
    //     dispatch('subscribeToThread', { friend })
    //   }
    // )
  },
  //   unsubscribeFromThread ({}, { friend }) {
  //     // @ts-ignore
  //     const database = this.$app.$database

  //     database.unsubscribeFromThread(friend.threadID)
  //   },
  //   subscribeToAllThreads ({ dispatch, state }, { friends }) {
  //     const friendsToLoop = friends ? friends : state.friends

  //     // @ts-ignore
  //     const database = this.$app.$database

  //     friendsToLoop.forEach(friend => {
  //       if (!database.messageManager.isSubscribed(friend.threadID)) {
  //         dispatch('subscribeToThread', { friend })
  //       }
  //     })
  //   },
  async sendMessage ({ state, commit }, { type, data }) {
    // @ts-ignore
    const database = this.$app.$database
    // @ts-ignore
    const crypto = this.$app.$crypto

    const recipient = state.friends.find(
      friend => friend.address === state.activeChat
    )

    // Initialize the crypto library for the recipient to compute ECDH
    await crypto.initializeRecipient(recipient.address, recipient.pubkey)

    const decryptedKey = await crypto.decryptFor(
      recipient.address,
      recipient.encryptedKey
    )

    const msg = database.messageManager?.buildMessage(
      state.activeChat,
      Date.now(),
      'message',
      {
        type: type || 'text',
        data: type === 'text' ? encodeURI(data) : data
      }
    )

    await database.mailboxManager?.sendMessage(
      decryptedKey,
      JSON.stringify(msg)
    )

    // Mark the message as pending when it's not yet included in the thread
    commit('appendMessage', { ...msg, pending: true })
  }
}
