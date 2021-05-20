import { ethers } from 'ethers'
import Ethereum from '../../classes/Ethereum'
// @ts-ignore
import * as Vault74RegistryInterface from '@/contracts/build/contracts/Vault74Registry.json'
const Vault74RegistryInterface = {
  abi: []
}
export default class Vault74Registry {
  ethereum: any
  contract: ethers.Contract

  constructor (ethereum: typeof Ethereum, address: string) {
    this.ethereum = ethereum
    this.contract = this.getContract(address)
  }

  /** @function
   * @name getContract
   * @argument address Address of the DwellerID contract
   * @returns contract instance ready for method execution
   */
  getContract (address: string) {
    return this.ethereum.getContract(Vault74RegistryInterface.abi, address)
  }

  /** @function
   * @name createDwellerId
   * @argument _username username to set for the inital vaule on contract
   * @argument account account to send the transaction from
   * @argument tx callback executed on first transaction
   * @argument done callback executed on first confirmation
   */
  createDwellerId (
    _username: string,
    account: string,
    tx: CallableFunction,
    done: CallableFunction
  ) {
    const username = ethers.utils.formatBytes32String(_username)
    this.contract
      .createDweller(username)
      .then(transaction => {
        tx(transaction)
        return transaction.wait()
      })
      .then(confirmation => {
        done(confirmation)
      })
      .catch(console.log)
  }

  /** @function
   * @name createServer
   * @argument name name to call the server
   * @argument account account to send the transaction from
   * @argument tx callback executed on first transaction
   * @argument done callback executed on first confirmation
   */
  createServer (_name: string, tx: CallableFunction, done: CallableFunction) {
    const name = ethers.utils.formatBytes32String(_name)
    this.contract
      .createServer(name)
      .then(transaction => {
        tx(transaction)
        return transaction.wait()
      })
      .then(confirmation => {
        done(confirmation)
      })
  }

  /** @function
   * @name getDwellerContract
   * @argument account account to send the transaction from
   * @return returns the dweller contract address for a specific account
   */
  async getDwellerContract (account: string) {
    return this.contract.getDwellerId(account)
  }
}
