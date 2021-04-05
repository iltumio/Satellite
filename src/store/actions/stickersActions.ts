import { ethers } from 'ethers';
import config from '../../config/config';
import StickerFactory from '../../classes/contracts/StickerFactory';
import Sticker from '../../classes/contracts/Sticker';

export default {
  async fetchStickers({ commit }) {
    // @ts-ignore
    const stickerFactory = new StickerFactory(
      // @ts-ignore
      this.$app.$ethereum,
      config.stickers[config.network.chain],
    );

    const availableSets = await stickerFactory.getAvailableSets()

    availableSets.forEach(async (set) => {
      // @ts-ignore
      const stickerContract = new Sticker(this.$app.$ethereum, set.stickerContract);

      const uri = await stickerContract.getBaseURI()
      const price = await stickerContract.getPrice()

      const response = await fetch(`${config.ipfs.browser}/${uri}`)
      const stickerRawData = await response.text()
      const stickerData = JSON.parse(stickerRawData)
      const artistDetails = await stickerFactory.getArtistDetails(set.creator);
      
      commit('addSticker', { ...stickerData, price, contract: set.stickerContract, artist: artistDetails});

      const balance = await stickerContract.getBalance()

      if (balance > 0) {
        const ownedSerials = await stickerContract.getOwnedStickers()

        commit('addOwnedSticker', {
          ...stickerData, price, contract: set, ownedSerials,
        })
      } else {
       // console.log('No stickers');
      }
    })
  },
  async buySticker({ dispatch }, { sticker }) {
    // @ts-ignore
    const stickerContract = new Sticker(
      // @ts-ignore
      this.$app.$ethereum,
      sticker.contract,
    );

    await stickerContract.addSet(ethers.utils.parseEther(sticker.price));

    dispatch('fetchStickers');
  },
};
