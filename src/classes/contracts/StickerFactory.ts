import { BigNumber, ethers } from 'ethers';
import Ethereum from '../../classes/Ethereum';
// @ts-ignore
import * as StickerFactoryInterface from '@/contracts/build/contracts/StickerFactory.json';

export default class StickerFactory {
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
    return this.ethereum.getContract(StickerFactoryInterface.abi, address);
  }

  /** @function
   * @name createStickerSet
   * @argument setName Name of the sticker set
   * @argument setSymbol Token symbol of the sticker set
   * @argument limit Max supply
   * @argument uri Uri of the current sticker set
   * @argument initialPrice Initial price of the sticker set
   */
  async createStickerSet(
    setName: string,
    setSymbol: string,
    limit: BigNumber | string,
    uri: string,
    initialPrice: BigNumber | string,
  ) {
    return this.contract
      .createSticker(setName, setSymbol, limit, uri, initialPrice, {
        gasLimit: 4700000,
      })
      .then(tx => tx.wait());
  }

  /** @function
   * @name getAvailableSets
   * @returns an array of addresses related to available sets
   */
  async getAvailableSets() {
    return this.contract.getAvailableSets();
  }

  /** @function
   * @name getArtist
   * @argument artist string address of artist
   * @returns an object containing metadata about a given artist
   */
  async getArtist(artist: string) {
    console.log('contract', this.contract);
    const foundArtist = await this.contract.artists(artist);
    console.log('foundArtist', foundArtist);
  }
}
