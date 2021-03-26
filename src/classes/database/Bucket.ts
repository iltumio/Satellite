import Database from "./Database";


export default class Bucket {
  name: string;
  database: Database;
  /** @constructor
   * Construct a Bucket
   * A bucket stores data in a relational structure
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
  async get() {
    // Clone array to prevent mutation
    const data = await this.database.interface._retrive(this.name);
    return [...data];
  }

  /** @method
   * @name add
   * Adds an item to the bucket
   * @argument value Data to add to the bucket storage
   */
  async add(value: object) {
    await this.database.interface._store(value, this.name);
  }

  /** @method
   * @name remove
   * Removes an item from the bucket
   * @argument value Data to add to remove from the bucket storage
   */
  async remove(value: object) {
    let values = await this.get();
    values = values.filter(item => JSON.stringify(item) !== JSON.stringify(value));
    this.database.interface._update(values, this.name);
  }
}