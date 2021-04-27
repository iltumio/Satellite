import Web3EthAccounts from 'web3-eth-accounts'

export default class Key {
  account: any

  /** @constructor
   * Construct a new Key
   * @argument web3 web3 object
   */
  constructor (web3: any) {
    if (!web3) {
      // @ts-ignore
      const w3 = new Web3EthAccounts()
      this.account = w3.create()
    } else {
      this.account = web3.eth.accounts.create()
    }
  }

  /** @function
   * @name getAccount
   * Get the keys account address
   * @returns key account address
   */
  getAccount () {
    return this.account.address
  }

  /** @function
   * @name getPublicKey
   * Get the keys public key
   * @returns public key
   */
  getPublicKey () {
    return this.account.address
  }

  /** @function
   * @name getPrivateKey
   * Get the keys private key
   * @returns private key
   */
  getPrivateKey () {
    return this.account.privateKey
  }

  /** @function
   * @name encrypt
   * Get encryption method with password provided
   * @argument password password to encrypt with
   * @returns encryption method
   */
  encrypt (password: string) {
    return this.account.encrypt(password)
  }

  /** @function
   * @name decrypt
   * Get decryption method with password provided
   * @argument password password to decrypt with
   * @returns decryption method
   */
  decrypt (password: string) {
    return this.account.decrypt(password)
  }
}
