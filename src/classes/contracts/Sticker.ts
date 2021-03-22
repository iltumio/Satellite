import { BigNumber, ethers } from 'ethers';
import Ethereum from '../../classes/Ethereum';
// @ts-ignore
import * as StickerInterface from '@/contracts/build/contracts/Sticker.json';
import config from '../../config/config';

export default class Sticker {
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
    return this.ethereum.getContract(StickerInterface.abi, address);
  }

  /** @function
   * @name setPhoto
   * @argument value Value to pay for adding a set
   */
  async addSet(value: BigNumber | string) {
    return this.contract
      .addSet({
        gasLimit: 4700000,
        value,
      })
      .then(tx => tx.wait());
  }

  /** @function
   * @name getPrice
   * @returns the price of the current set
   */
  async getPrice() {
    return this.contract.price();
  }

  /** @function
   * @name getBaseURI
   * @returns the baseURI of the current set
   */
  async getBaseURI() {
    return this.contract.baseURI();
  }

  /** @function
   * @name getMaxSupply
   * @returns the maximum number of sets that can be minted
   */
  async getMaxSupply() {
    return this.contract.maxSupply();
  }

  /** @function
   * @name getCreator
   * @returns the creator of the current set
   */
  async getCreator() {
    return this.contract.creator();
  }

  /** @function
   * @name balanceOf
   * @returns ERC721 balanceOf
   */
  async getBalance() {
    // @ts-ignore
    return this.contract.balanceOf(this.ethereum.activeAccount);
  }

  async getOwnedStickers() {
    const { activeAccount } = this.ethereum;
    const filterFrom = this.contract.filters.Transfer(activeAccount);
    const filterTo = this.contract.filters.Transfer(null, activeAccount);

    const outgoingTransfers = await this.contract.queryFilter(
      filterFrom,
      config.stickers.mumbaiInfo.deployBlock,
      'latest',
    );
    const incomingTransfers = await this.contract.queryFilter(
      filterTo,
      config.stickers.mumbaiInfo.deployBlock,
      'latest',
    );

    const ownedTokens = {};
    [...outgoingTransfers, ...incomingTransfers].forEach((event) => {
      if (event.args?.from === activeAccount) {
        delete ownedTokens[event.args?.tokenId?.toString()];
      } else {
        ownedTokens[event.args?.tokenId?.toString()] = true;
      }
    });

    // console.log('out', outgoingTransfers);
    // console.log('in', incomingTransfers);

    return Object.keys(ownedTokens);
  }
}
