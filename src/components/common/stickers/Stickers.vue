<template src="./Stickers.html"></template>

<script>
import { ethers } from 'ethers'
import Sticker from './Sticker'
import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Stickers',
  props: ['sendMessage'],
  components: {
    Sticker
  },
  methods: {
    isMobile: MobileUtils.isMobile,
    handleClose() {
      this.$store.commit('toggleStickers')
    },
    setDisplay (route, data) {
      this.route = route
      let newData = { ...data }
      if (data && data.price) {
        newData['price'] = ethers.utils.formatEther(data.price).toString()
      }
      this.routeData = newData
    },
    sendSticker (sticker) {
      this.sendMessage(
        {
          sticker,
          meta: this.routeData
        },
        'sticker'
      )
      this.$store.commit('toggleStickers')
    },
    async buySticker (sticker) {
      this.isPending = true
      await this.$store.dispatch('buySticker', { sticker })
      this.isPending = false

      this.setDisplay('my-stickers')
    }
  },
  data () {
    return {
      route: 'my-stickers',
      routeData: false,
      availableStickers: Object.values(this.$store.state.availableStickers),
      ownedStickers: Object.values(this.$store.state.ownedStickers),
      isPending: false,
    }
  },
  async mounted () {
    if (this.$store.state.stickerPack) {
      this.route = 'buy-stickers'
      this.routeData = this.$store.state.stickerPack.meta
    }
    this.$store.dispatch('fetchStickers')

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'addSticker') {
        this.availableStickers = Object.values(state.availableStickers)
      } else if (mutation.type === 'addOwnedSticker') {
        this.ownedStickers = Object.values(state.ownedStickers)
      }
    })
  }
}
</script>

<style lang="less" scoped src="./Stickers.less"></style>
