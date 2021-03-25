import Database from "./Database";


export default class Drawer {
  name: string;
  database: Database;
  /** @constructor
   * Construct a Drawer
   * A bucket stores data in a key-value structure
   * @argument name the name of the bucket
   * @argument database main database reference
   */
  constructor(name: string, database: Database) {
    this.name = name;
    this.database = database;
  }

  /** @method
   * @name get
   * @returns The contents of the bucket
   */
  async get(key: string, collection: string) {
    // Clone array to prevent mutation
    const data = await this.database.interface._retriveKV(key, collection);
    return [...data];
  }

  /** @method
   * @name add
   * Adds an item to the bucket
   * @argument value Data to add to the bucket storage
   */
  async add(key: string, value: object, collection: string) {
    await this.database.interface._storeKV(key, value, collection);
  }

  /** @method
   * @name remove
   * Removes an item from the bucket
   * @argument value Data to add to remove from the bucket storage
   */
  /*
  async remove(key: string, collection: string) {
    let values = await this.getAll(key, collection);
    values = values.filter(item => JSON.stringify(item) !== JSON.stringify(value));
    this.database.interface._update(values, this.name);
  }
  */
}