// @ts-ignore
import Bucket from './Bucket';
import Drawer from './Drawer';
// @ts-ignore
import { LocalStorage, ThreadDB } from './interpreters';
import { MessageManager } from './MessageManager';
import ThreadManager from './ThreadManager';

interface Interface {
  _retrieve: CallableFunction,
  _update: CallableFunction,
  _store: CallableFunction,
  _key: CallableFunction,
}

interface Creds {
  id: string,
  pass: string,
  extras: Extras,
}

interface Extras {
  client: any,
}


/* eslint-disable */
export default class Database {
  name: string;
  prefix: string;
  interface: any;
  availableInterfaces: any[];
  creds: Creds | undefined;
  threadManager: ThreadManager | null;
  messageManager: MessageManager | null;

  /** @constructor
   * Construct a Database
   * Provides key-value and relational storage
   * @argument name the name of the database
   */
  constructor(name: string) {
    this.name = name;
    this.prefix = 'vdb.';
    this.interface;
    this.availableInterfaces = [
      ThreadDB,
      LocalStorage,
    ];
    this.threadManager = null;
    this.messageManager = null;
    this.creds = undefined;
  }

  /** 
   * @method
   * Used to authenticate connections and encrypt data
   * @argument id identity
   * @argument pass password
   */
  authenticate(intrface: string, id: string, pass: string, extras: Extras) {
    this.creds = {
      id,
      pass,
      extras,
    };
    switch (intrface) {
      case 'localStorage':
        this.interface = new LocalStorage(
          this.prefix,
          this.creds,
        );
        break;
      case 'textile':
        this.interface = new ThreadDB(
          this.prefix,
          this.creds,
          extras,
        );
        this.threadManager = new ThreadManager(
          'LocalStorage',
          extras.client,
        );
        this.messageManager = new MessageManager(
          extras.client,
          id,
        );
        this.messageManager.build();
        break;
      default:
        this.interface = new LocalStorage(
          this.prefix,
          this.creds,
        );
        break;
    }
  }

  /**
   * @method
   * Construct a Drawer
   * A drawer stores data in a key-value structure
   * @argument name the name of the bucket
   */
  Drawer(name: string) {
    // TODO
    return new Drawer(name, this);
  }

  /** 
   * @method
   * Construct a Bucket
   * A bucket stores data in a relational structure
   * @argument name the name of the bucket
   */
  Bucket(name: string) {
    return new Bucket(name, this);
  }
}
