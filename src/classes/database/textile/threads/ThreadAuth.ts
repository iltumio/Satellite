import { Database, Remote } from "@textile/threaddb";

// @ts-ignore
import config from '@/config/config';
import { PrivateKey } from "@textile/hub";

import { ThreadIDs, PublicKeys } from './schemas/index';

export default class ThreadAuth {
  private _identifier: string | null;
  private _db: Database | null;
  private _token: string | null;
  private _remote: any;
  private _threadID: string | null;
  
  /** @constructor
   * Construct a ThreadAuth
   * Provides authentication methods for ThreadDB
   */
  constructor() {
    this._identifier = null;
    this._db = null;
    this._token = null;
    this._threadID = null;
  }

  get token() {
    return this._token;
  }

  get remote() {
    return this._remote;
  }

  get threadID() {
    return this._threadID;
  }

  get database() {
    return this._db;
  }

  get identifier() {
    return this._identifier;
  }

  /**
   * @method
   * @name init
   * Initalize creation of the Database
   * @param identifier string identifier to use for the database name
   */
  async init(identifier: string) {
    this._identifier = identifier;
    this._db = await new Database(
      // Database will be named after the active account or "identifier"
      this._identifier,
      // Schemas
      { name: "ThreadIDs", schema: ThreadIDs },
      { name: "PublicKeys", schema: PublicKeys },
    ).open(1);
  }

  /**
   * @method
   * @name getPrivateKey
   * Get a private key from localStorage
   * @return Promise returning an error if auth fails, null elsewise.
   */
  async getPrivateKey() : Promise<PrivateKey> {
    /** Restore any cached user identity first */
    const cached = localStorage.getItem('textile.identity');
    const privateKey = (cached !== null) ? 
      PrivateKey.fromString(cached) :
      PrivateKey.fromRandom();
    /** Add the string copy to the cache */
    // TODO: Encrypt this with user password in the future
    localStorage.setItem('textile.identity', privateKey.toString());
    /** Return the random identity */
    return privateKey;
  }

  /**
   * @method
   * @name auth
   * Authorize to remote database
   * @return Promise returning an error if auth fails, null elsewise.
   */
  async auth() : Promise<Error | null> {
    if (!this._db) return new Error('Please initalize before authenticating');
    const privateKey = await this.getPrivateKey();
    // authenticate to remote
    this._remote = await this._db.remote.setKeyInfo({
      key: config.textile.key,
    });
    // store token
    this._token = await this._remote.authorize(privateKey);
    // Create a thread if none has been cached
    await this.connectCreateThread(this._remote);
    return null;
  }

  /**
   * @method
   * @name connectCreateThread
   * Create a new thread or load one if stored locally
   * @argument remote remote database connection
   */
  async connectCreateThread(remote: Remote) {
    const cached = localStorage.getItem('textile.threadID');
    this._threadID = (cached != null) ?
      await remote.initialize(cached) :
      await remote.initialize();
    if (!cached) localStorage.setItem('textile.threadID', this._threadID);
  }
}