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
  async fetchMailbox ({ state, commit }, { address, limit, skip }) {
    // @ts-ignore
    const database = this.$app.$database
    // @ts-ignore
    const crypto = this.$app.$crypto

    const friend = state.friends.find(fr => fr.address === address)

    commit('loadingMessages')

    // Initialize the crypto library for the recipient to compute ECDH
    await crypto.initializeRecipient(friend.address, friend.pubkey)

    const decryptedKey = await crypto.decryptFor(
      friend.address,
      friend.encryptedKey
    )

    const conversation = await database.mailboxManager?.getConversation(
      decryptedKey,
      { limit: 5, skip: 1 }
    )

    commit('updateMessages', conversation.map(convertMsg))
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
        }
      },
      ['typing-notice'],
      state.friends.map(friend => friend.address)
    )
  },
  async subscribeToSentbox ({ state, commit, dispatch }) {
    // @ts-ignore
    const database = this.$app.$database
    // @ts-ignore
    const crypto = this.$app.$crypto
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC
    // @ts-ignore
    const SoundManager = this.$app.$sound

    // Watch for users typing
    if (!database.mailboxManager?.isSubscribed('sentbox')) {
      database.mailboxManager?.listenToSentboxMessages(message => {
        const msg = convertMsg(message)
        commit('appendMessage', msg)
      })
    }
  },
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

    const msg = database.mailboxManager?.buildMessage(
      state.activeChat,
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
    // commit('appendMessage', { ...msg, pending: true })
  }
}
