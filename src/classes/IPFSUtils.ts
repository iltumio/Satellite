import Database from './database/Database'

// Helper methods for interacting with IPFS
export default class IPFSUtils {
  database: any
  utilsVersion: number

  constructor (database: Database) {
    this.database = database
    this.utilsVersion = 0.0
  }

  /** @function
   * @name appendFileCache
   * @argument file File object to add to the cache
   * @returns appends the file object to whatever caching system we use
   */
  async appendFileCache (file: File) {
    const files = await this.getFileCache()
    const bucket = this.database.Bucket('files')

    files.push(file)
    await bucket.add(file)
  }
  /** @function
   * this is a wrapper over our storage method so we can easily
   * change this in the future
   * @name getFileCache
   * @returns returns the file cache
   */
  async getFileCache () {
    const bucket = this.database.Bucket('files')
    const files = await bucket.get()
    return files
  }
  /** @function
   * @name removeFileFromCache
   * @argument file File object to remove from the cache
   */
  async removeFileFromCache (file: File) {
    const bucket = this.database.Bucket('files')
    await bucket.remove(file)
  }
}
