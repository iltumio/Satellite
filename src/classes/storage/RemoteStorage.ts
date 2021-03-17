import { JSONSchema, ThreadID } from '@textile/threaddb';
import RemoteAuth from './RemoteAuth';

export default class RemoteStorage extends RemoteAuth {
  constructor() {
    super();
  }

  authorize() {
    this._authorize(this.reconnect);
  }

  reconnect() {
    // TODO: reconnect subscribers
  }

  insert(collectionName: string, schema: JSONSchema) {}

  subscribe(threadID: ThreadID, method: CallableFunction) {
    // TODO: Subscribe with client method
    // this will allow us to listen to changes on a collection for a specific threadID
  }
}
