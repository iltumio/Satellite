<template>
  <div id="app" :class="this.$store.state.theme">
    <main id="main" class="theme" v-if="decrypted">
      <transition appear mode="out-in" name="slide-fade">
        <router-view></router-view>
      </transition>
    </main>
    <Unlock class="theme" v-else :decrypted="decrypt" />
    <SecurityMask v-if="mask" />
  </div>
</template>

<script>
import 'bulma/css/bulma.css'
import CryptoUtil from '@/utils/Crypto.ts'
import Unlock from '@/components/unlock/Unlock'
import SecurityMask from '@/components/common/SecurityMask'

export default {
  name: 'app',
  components: {
    Unlock,
    SecurityMask
  },
  data () {
    return {
      decrypted: false,
      friendsLoaded: false,
      mask: false
    }
  },
  methods: {
    async decrypt (pin) {
      let decryptedMnemonic = localStorage.getItem('mnemonic')
      if (decryptedMnemonic) {
        decryptedMnemonic = await CryptoUtil.decrypt(decryptedMnemonic, pin)
        this.$store.commit('setMnemonic', decryptedMnemonic)
      }
      this.decrypted = true

      this.$store.dispatch('startup')
    }
  },
  mounted () {
    document.addEventListener(
      'visibilitychange',
      () => {
        this.mask = document.hidden
      },
      false
    )
    // Set i18n locale based on the user preferred language
    if (this.$store.state.settings.language) {
      this.$i18n.locale = this.$store.state.settings.language
    }
  }
}
</script>

<style scoped lang="less">
.notification {
  position: absolute;
}

#app {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
  /* min-width: 990px; */
}

#app .theme {
  position: relative;
  top: 0;
  bottom: 0;
  height: 100%;
}
</style>

<style lang="less" src="@/assets/styles/app.less"></style>
<style lang="less">
.dark {
  @import 'assets/styles/true_dark.less';
}
.ice {
  @import 'assets/styles/ice.less';
}
.tokyo {
  @import 'assets/styles/tokyo.less';
}
.oled {
  @import 'assets/styles/oled.less';
}
.next {
  @import 'assets/styles/next.less';
}
.zenburn {
  @import 'assets/styles/zenburn.less';
}
.notification {
  z-index: 10;
  margin: 1rem;
}
</style>
<style lang="less" src="@/assets/styles/media.less"></style>
