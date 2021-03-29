import { ethers } from 'ethers';
import Ethereum from '../../classes/Ethereum';
// @ts-ignore
import ERC20Interface from './abis/erc20.abi.json';

export default class ERC20 {
  ethereum: any;
  contract: ethers.Contract;

  constructor(ethereum: typeof Ethereum, address: string) {
    this.ethereum = ethereum;
    this.contract = this.getContract(address);
  }

  /** @function
   * @name getContract
   * @argument address Address of the DwellerID contract
   * @returns contract instance ready for method execution
   */
  getContract(address: string) {
    return this.ethereum.getContract(ERC20Interface, address);
  }

  /** @function
   * @name getBalance
   * @returns ERC20 balanceOf
   */
  async getBalance() {
    // @ts-ignore
    return this.contract.balanceOf(this.ethereum.activeAccount);
  }

  /** @function
   * @name getSymbol
   * @returns ERC20 tokenSymbol
   */
  async getSymbol() {
    // @ts-ignore
    return this.contract.symbol();
  }
}
