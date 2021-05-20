import { BigNumber, ethers } from 'ethers'
import Ethereum from '../../classes/Ethereum'
// @ts-ignore
// import * as StickerFactoryInterface from '@/contracts/build/contracts/StickerFactory.json'
const StickerFactoryInterface = {
  abi: []
}
// @ts-ignore
import config from '@/config/config.js'

export default class StickerFactory {
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
    return this.ethereum.getContract(StickerFactoryInterface.abi, address)
  }

  /** @function
   * @name createStickerSet
   * @argument setName Name of the sticker set
   * @argument setSymbol Token symbol of the sticker set
   * @argument limit Max supply
   * @argument uri Uri of the current sticker set
   * @argument initialPrice Initial price of the sticker set
   */
  async createStickerSet (
    setName: string,
    setSymbol: string,
    limit: BigNumber | string,
    uri: string,
    initialPrice: BigNumber | string
  ) {
    return this.contract
      .createSticker(setName, setSymbol, limit, uri, initialPrice, {
        gasLimit: 4700000
      })
      .then(tx => tx.wait())
  }

  /** @function
   * @name getAvailableSets
   * @returns an array of addresses related to available sets
   */
  async getAvailableSets () {
    let sets = await this.contract.getAvailableSets()
    sets = sets.filter(set => {
      return config.stickers.validated.includes(set.stickerContract)
    })
    return sets
  }

  /** @function
   * @name getArtistDetails
   * @argument address The address of the artist you want to receive information of
   * @returns artist details
   */
  async getArtistDetails (address: string) {
    const { addr, name, signature, description } = await this.contract.artists(
      address
    )
    return { addr, name, signature, description }
  }
}
