import { PublicKey, PrivateKey, Identity, MailboxEvent } from '@textile/hub'
import {
  InboxListOptions,
  SentboxListOptions,
  UserMessage,
  Users
} from '@textile/users'
import { Extras } from '../Interfaces'

interface IMessage extends UserMessage {
  sender: string
  to: ''
  at: number
  type: string
  payload: any
  encrypted: boolean
  secure: boolean
  metadata: object
}

/**
 * A simple type to hold inbox messages after they have been
 * decrypted with the PrivateKey
 */
interface DecryptedInbox {
  id: string
  body: string
  from: string
  sent: number
  readAt?: number
}

type MailboxCallback = (
  reply?: MailboxEvent | undefined,
  err?: Error | undefined
) => void

type MailboxSubscriptionType = 'inbox' | 'sentbox'

export class MailboxManager {
  prefix: string
  senderAddress: string
  textile: Extras
  mailboxID: string
  inboxListener?: MailboxCallback
  sentboxListener?: MailboxCallback

  constructor (prefix: string, textile: Extras, senderAddress: string) {
    this.prefix = prefix
    this.textile = textile
    this.mailboxID = ''
    this.senderAddress = senderAddress
  }

  async init () {
    const users: Users = this.textile.users
    this.mailboxID = await users.setupMailbox()
  }

  buildMessage (to: string, type: string, data: any) {
    return {
      sender: this.senderAddress,
      to: to,
      at: Date.now(),
      type: type,
      payload: data
    }
  }

  async listInboxMessages (opts?: InboxListOptions): Promise<DecryptedInbox[]> {
    const encryptedMessages = await this.textile.users.listInboxMessages(opts)

    return Promise.all<DecryptedInbox>(
      encryptedMessages.map<any>(this.messageDecoder)
    )
  }

  async listSentboxMessages (
    opts?: SentboxListOptions
  ): Promise<DecryptedInbox[]> {
    const encryptedMessages = await this.textile.users.listSentboxMessages(opts)

    return Promise.all<DecryptedInbox>(
      encryptedMessages.map<any>(this.messageDecoder)
    )
  }

  listenToInboxMessages (cb: (message?: DecryptedInbox) => void) {
    this.inboxListener = (reply, err) => {
      if (reply?.message) {
        this.messageDecoder(reply?.message).then(decrypted => {
          cb(decrypted)
        })
      }

      if (reply === undefined && err === undefined) {
        this.inboxListener = undefined
        return
      }
    }
    this.textile.users.watchInbox(this.mailboxID, this.inboxListener)
  }

  listenToSentboxMessages (cb: (message?: DecryptedInbox) => void) {
    this.sentboxListener = (reply, err) => {
      if (reply?.message) {
        this.messageDecoder(reply?.message).then(decrypted => {
          cb(decrypted)
        })
      }

      if (reply === undefined && err === undefined) {
        this.sentboxListener = undefined
        return
      }
    }
    this.textile.users.watchSentbox(this.mailboxID, this.sentboxListener)
  }

  async sendMessage (to: string, message: string) {
    const recipient: PublicKey = PublicKey.fromString(to)

    const encoder = new TextEncoder()
    const body = encoder.encode(message)
    return await this.textile.users.sendMessage(
      this.textile.identity,
      recipient,
      body
    )
  }

  messageDecoder = async (message: UserMessage): Promise<DecryptedInbox> => {
    const identity: Identity = this.textile.identity
    const privKey = PrivateKey.fromString(identity.toString())
    const bytes = await privKey.decrypt(message.body)
    const decoded = new TextDecoder().decode(bytes)
    const body = JSON.parse(decoded)
    const { from } = message
    const { readAt } = message
    const { createdAt } = message
    const { id } = message
    return { body, from, readAt, sent: createdAt, id }
  }

  isInitialized () {
    return this.mailboxID !== ''
  }

  _key (name: string) {
    return `${this.prefix}${name}`
  }

  isSubscribed (type: MailboxSubscriptionType): boolean {
    if (type === 'inbox') {
      return Boolean(this.inboxListener)
    }

    if (type === 'sentbox') {
      return Boolean(this.sentboxListener)
    }

    return false
  }
}
