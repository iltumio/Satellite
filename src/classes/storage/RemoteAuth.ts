import { Database, PrivateKey } from '@textile/threaddb'

// @ts-ignore
import config from '@/config/config'

// Import Schemas
import { ThreadIDs } from './schemas/index'

export default class RemoteAuth {
  private _identifier: string | null
  private _db: Database | null
  private _token: string | null
  private _remote: any
  private _threadID: string | null

  /** @constructor
   * Construct a ThreadAuth
   * Provides authentication methods for ThreadDB
   */
  constructor () {
    this._identifier = null
    this._db = null
    this._token = null
    this._threadID = null
  }

  get token () {
    return this._token
  }

  get remote () {
    return this._remote
  }

  get threadID () {
    return this._threadID
  }

  get database () {
    return this._db
  }

  get identifier () {
    return this._identifier
  }

  async init (dbName: string) {
    // Create || Open a new database
    this._db = await new Database(
      dbName,
      // @ts-ignore
      { name: ThreadIDs.name, schema: ThreadIDs.schema }
    ).open(1)
  }

  /**
   * @method
   * @name getPrivateKey
   * Get a private key from localStorage
   * @return Promise returning an error if auth fails, null elsewise.
   */
  async getPrivateKey (): Promise<PrivateKey> {
    /** Restore any cached user identity first */
    const cached = localStorage.getItem('textile.remote.identity')
    const privateKey =
      cached !== null ? PrivateKey.fromString(cached) : PrivateKey.fromRandom()
    /** Add the string copy to the cache */
    // TODO: Encrypt this with user password in the future
    localStorage.setItem('textile.remote.identity', privateKey.toString())
    /** Return the random identity */
    return privateKey
  }

  /**
   * @method
   * @name authorize
   * Authorize to remote database
   * @return Promise returning an error if auth fails, null elsewise.
   */
  async _authorize (reconnect: CallableFunction): Promise<Error | null> {
    if (!this._db) return new Error('Please initalize before authenticating')
    const privateKey = await this.getPrivateKey()
    // authenticate to remote
    this._remote = await this._db.remote.setKeyInfo({
      key: config.textile.key
    })
    // TODO: Catch timeout and re-auth.
    // After re-authing emit a re-auth event so that we
    // can resubscribe to message events
    // reconnect();
    // store token
    this._token = await this._remote.authorize(privateKey)
    // console.log('authorized', this._db, this._remote);
    return null
  }
}
