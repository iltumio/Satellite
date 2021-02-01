import { ethers } from 'ethers';
// @ts-ignore
import * as Vault74RegistryInterface from '@/contracts/build/contracts/Vault74Registry.json';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';


export default class Vault74Registry {
  ethereum: any;
  contract: ethers.Contract;

  constructor(ethereum: typeof Ethereum, address: string) {
    this.ethereum = ethereum;
    this.contract = ethereum.getContract(Vault74RegistryInterface.abi, address);
  }

  /** @function
   * @name getContract
   * @argument address Address of the DwellerID contract
   * @returns contract instance ready for method execution
   */
  getContract(address: string) {
    return this.ethereum.getContract(Vault74RegistryInterface.abi, address);
  }

  /** @function
   * @name createDwellerId
   * @argument _username username to set for the inital vaule on contract
   * @argument account account to send the transaction from
   * @argument tx callback executed on first transaction
   * @argument done callback executed on first confirmation
   */
  createDwellerId(_username: string, account: string, tx: CallableFunction, done: CallableFunction) {
    const username = this.ethereum.fromAscii(_username);
    this.contract.createDweller(username, { gasPrice: 4700000 }).then((transaction) => {
      tx(transaction);
      return transaction.wait();
    }).then((confirmation) => {
      done(confirmation);
    });
  }

  /** @function
   * @name createServer
   * @argument name name to call the server
   * @argument account account to send the transaction from
   * @argument tx callback executed on first transaction
   * @argument done callback executed on first confirmation
   */
  createServer(_name: string, account: string, tx: CallableFunction, done: CallableFunction) {
    const name = this.ethereum.fromAscii(_name);
    this.contract.createServer(name, { gasPrice: 4700000 }).then((transaction) => {
      tx(transaction);
      return transaction.wait();
    }).then((confirmation) => {
      done(confirmation);
    });
  }

  /** @function
   * @name getDwellerContract
   * @argument account account to send the transaction from
   * @return returns the dweller contract address for a specific account
   */
  async getDwellerContract(account: string) {
    return this.contract.getDwellerId(account);
  }
}
