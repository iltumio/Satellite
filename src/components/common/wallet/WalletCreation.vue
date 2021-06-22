<template src="./WalletCreation.html"></template>

<script>
import { ethers } from 'ethers'
import Crypto from '@/utils/Crypto.ts'
import QRScan from '@/components/common/QRScan'
import Solana from '../../../classes/Solana'

export default {
  name: 'WalletCreation',
  components: {
    QRScan
  },
  data () {
    return {
      step: 'initial',
      wallet: null,
      splittedMnemonic: [],
      wordsToCheck: [],
      input: {},
      recoveryPhrase: '',
      showScanQR: false
    }
  },
  methods: {
    goToStep (step) {
      this.step = step
    },
    async createWallet () {
      this.wallet = await this.$solana.createRandomKeypair()
      this.splittedMnemonic = this.wallet.mnemonic.split(' ')

      const numbers = [...Array(12).keys()]

      // Shuffle array
      const shuffled = numbers.sort(() => 0.5 - Math.random())

      // Get sub-array of first n elements after shuffled
      this.wordsToCheck = shuffled.slice(0, 4)

      this.goToStep('showseed')
    },
    checkWords () {
      const areWordsRight = this.wordsToCheck.reduce((acc, next) => {
        return (
          acc &&
          this.input[next] &&
          this.input[next].toLowerCase().trim() === this.splittedMnemonic[next]
        )
      }, true)

      return areWordsRight
    },
    async walletCreated () {
      this.$store.commit('setMnemonic', this.wallet.mnemonic)
      const encrypted = await Crypto.encrypt(
        this.wallet.mnemonic,
        this.$store.state.pin
      )
      localStorage.setItem('mnemonic', encrypted)
      this.onWalletCreated(this.wallet)
    },
    recover () {
      this.wallet = ethers.Wallet.fromMnemonic(this.recoveryPhrase)

      this.walletCreated()
    },
    onQRScan (code) {
      const mnemonic = code && code.split(' ')

      if (mnemonic.length === 12) {
        this.recoveryPhrase = code
        this.toggleScanQR()
      } else {
        console.error('Invalid Recovery phrase')
      }
    },
    toggleScanQR () {
      this.showScanQR = !this.showScanQR
    }
  },
  mounted () {},
  props: ['onWalletCreated']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./WalletCreation.less"></style>
