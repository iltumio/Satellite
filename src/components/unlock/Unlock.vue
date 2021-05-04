<template src="./Unlock.html"></template>

<script>
import ToggleSwitch from '@/components/common/ToggleSwitch'
import PWAInstallPrompt from '@/components/common/mobile/PWAInstallPrompt'
import crypto from '@/utils/Crypto.ts'

export default {
  name: 'unlock',
  props: ['decrypted'],
  components: {
    ToggleSwitch,
    PWAInstallPrompt
  },
  data () {
    return {
      pin: '',
      error: false,
      storePin: false,
      storedPinHash: localStorage.getItem('v74.pinhash') || false,
      storedPin: localStorage.getItem('v74.pin') || false,
      decrypting: false
    }
  },
  methods: {
    decideAction () {
      if (this.storedPinHash) {
        this.testPin()
      } else {
        this.encryptAndStore()
      }
    },
    async encryptAndStore () {
      if (!this.pin || this.pin.length < 4) {
        this.error = 'Please use at least 4 characters in your pin.'
        return
      }
      this.error = false
      const encryptedPin = await crypto.encrypt(this.pin, this.pin)
      localStorage.setItem('v74.pinhash', encryptedPin)
      if (this.storePin) localStorage.setItem('v74.pin', this.pin)
      this.$store.commit('setPin', this.pin)
      this.decrypting = true
      await this.decrypted(this.pin)
    },
    async testPin () {
      crypto
        .decrypt(this.storedPinHash, this.pin)
        .then(() => {
          this.error = false
          window.v74pin = this.pin
          this.$pin = this.pin
          if (this.storePin) localStorage.setItem('v74.pin', this.pin)
          this.$store.commit('setPin', this.pin)
          this.decrypting = true
          this.decrypted(this.pin)
        })
        .catch(() => {
          this.decrypting = false
          this.error = 'Invalid pin, try again.'
        })
    }
  },
  mounted () {
    /* Disabled
    if (localStorage.getItem('v74.pin')) {
      window.v74pin = localStorage.getItem('v74.pin');
      this.decrypting = true;
      this.decrypted(localStorage.getItem('v74.pin'));
    }
    */
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Unlock.less"></style>
