import { PublicKey, PrivateKey, Identity } from '@textile/hub'
import {
  InboxListOptions,
  SentboxListOptions,
  UserMessage,
  Users
} from '@textile/users'
import { Extras } from '../Interfaces'

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

export class MailboxManager {
  threadID: any
  collectionSchema: { data: string; _id: string }
  prefix: string
  textile: Extras
  mailboxID: string

  constructor (prefix: string, textile: Extras) {
    this.prefix = prefix
    this.textile = textile
    this.mailboxID = ''

    this.collectionSchema = {
      data: 'encrypted-data',
      _id: '0'
    }
  }

  async init () {
    const users: Users = this.textile.users
    this.mailboxID = await users.setupMailbox()

    console.log('MailboxID', this.mailboxID)
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
    console.log('decode')
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
}
