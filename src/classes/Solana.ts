import config from '../config/config'
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js'

// TODO: move in config
const NETWORK = clusterApiUrl('devnet')

export default class Solana {
  accounts: { [key: string]: Keypair }
  activeAccount?: Keypair
  connection: Connection
  mnemonic?: string

  constructor () {
    this.accounts = {}
    this.connection = new Connection(NETWORK)
  }

  /**
   * @description Initialize a Solana account by restoring the secret key
   * or generates a new account if the key is not passed
   */
  async initialize (secretKey?: Buffer) {
    const account = secretKey ? Keypair.fromSecretKey(secretKey) : new Keypair()
    const address = account.publicKey.toBase58()
    this.accounts[address] = account
    this.activeAccount = account
  }

  /**
   * @description Utility function to check if the account has been initialized
   */
  isInitialized (): boolean {
    return Boolean(this.connection && this.activeAccount)
  }

  /** @function
   * Send ether to another address
   * @name sendEther
   * @argument to address to send ether to
   * @argument from address to send from (must have access)
   * @argument value amount (in Ether) to send
   * @argument cb callback function to send tx hash to
   */
  sendEther (to, value, cb) {
    // const transaction = {
    //   to,
    //   value: ethers.utils.parseEther(value)
    // }
    // this.signer.sendTransaction(transaction).then(tx => cb(tx.hash))
  }

  /** @function
   * Get the contract constructor
   * @name getContract
   * @argument abi abstract interface for the contract
   * @argument address address of the contract on chain
   */
  getContract (abi, address = null) {
    // if (!this.initialized) {
    //   console.warn('Ethereum instance has not been initialized')
    // }
    // return new ethers.Contract(address, abi, this.signer)
  }

  /**
   * @name getAccounts
   * @returns the list of available accounts
   */
  getAccounts () {
    return this.accounts
  }

  /**
   * @name getActiveAccount
   * @returns the address of the active account
   */
  getActiveAccount () {
    return this.activeAccount
  }

  /**
   * @name getCurrentAccountBalance
   * @returns The balance of the active account
   */
  getCurrentAccountBalance () {
    // if (this.activeAccount) {
    //   return this.provider.getBalance(this.activeAccount)
    // }
    // return null
  }

  /**
   * @name isAddress
   * @param {string} text
   * @returns a boolean value that indicates if the given string is an address or not
   */
  isAddress (text) {
    // return this.utils.isAddress(text)
  }

  /**
   * @name getSharablePublicKey
   * @returns Get the public key in a format that can be verified by the contract
   */
  getSharablePublicKey () {
    // return `0x${this.wallet.publicKey.slice(4)}`
  }
}
