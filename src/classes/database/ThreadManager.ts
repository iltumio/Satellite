import { Client, ThreadID } from '@textile/hub';

export default class ThreadManager {
  storageMethod: string
  client: Client

  /** @constructor
   * Construct a ThreadManager
   * The thread manager stores and fetches threads to store
   * arbitrary data between two peers
   * @argument storageMethod preffered storage method of thread assignment (LocalStorage)
   * @argument textileClient reference to the authenticated textile client
   */
  constructor(storageMethod = 'LocalStorage', textileClient: Client) {
    this.storageMethod = storageMethod;
    this.client = textileClient;
  }

  /** 
   * @method
   * @name storeThread
   * @argument identifier identifier to store the thread by
   * @argument threadID ThreadID object to store ID of
   * @returns string ID of the thread
   */
  storeThread(identifier: string, threadID: string) : string {
    localStorage.setItem(
      `v74.threadManager.${identifier}`,
      threadID.replace(/\W/g, ''),
    );
    return threadID.replace(/\W/g, '');
  }

  /** 
   * @method
   * @name fetchThread
   * Fetch a thread ID from our storage method
   * @argument identifier identifier string of the thread to fetch
   * @returns string ID of the thread
   */
  fetchThread(identifier: string) : string | null {
    return localStorage.getItem(`v74.threadManager.${identifier}`);
  }

  /** 
   * @method
   * @name threadMatches
   * Check to see if a local thread stored at an
   * identifier matches the expected thread id
   * @argument identifier identifier string of the thread to check
   * @argument expectedId the ThreadID we expect to see
   * @returns boolean value of if the stored ID matches the given ID
   */
  threadMatches(identifier: string, expectedId: string) : boolean {
    const threadID = this.fetchThread(identifier);
    if (!threadID) return false;
    return threadID.toString() === expectedId;
  }

  /** 
   * @method
   * @name threadAt
   * Fetch a thread from a given identifier
   * @argument identifier identifier string of the thread to fetch
   * @returns ThreadID object assigned to the idenifier
   */
  async threadAt(identifier: string) : Promise<ThreadID> {
    const existingThreadID = this.fetchThread(identifier);
    
    if (existingThreadID) {
      return ThreadID.fromString(
        existingThreadID,
      );
    }

    const threadID: ThreadID = await this.client.newDB(
      undefined,
      `${identifier}-${Date.now()}`,
    );

    this.storeThread(identifier, threadID.toString());

    return threadID;
  }

  /** 
   * @method
   * @name makeIdentifier
   * Make a identifier string given two targets
   * @argument a string value of the first party ID
   * @argument b string value of the second party ID
   * @returns new string identifier
   */
  makeIdentifier(a: string, b: string) : string {
    return `${a}-${b}`;
  }
}