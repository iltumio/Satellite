<template src="./Personalize.html"></template>

<script>
import { languages } from '@/config/config'
import MobileUtils from '@/utils/Mobile.ts'
// import { getLang } from '@/utils/i18n';

export default {
  name: 'Personalize',
  props: ['settings'],
  data () {
    return {
      notificationsEnabled: Notification.permission === 'granted',
      languages: Object.keys(languages)
    }
  },
  methods: {
    isMobile: MobileUtils.isMobile,
    enableNotifications () {
      Notification.requestPermission().then(permission => {
        this.notificationsEnabled = permission === 'granted'
      })
    },
    toggleDarkMode () {
      this.$store.commit('toggleDarkMode')
    },
    setLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.commit('setLanguage', lang)
      // ----------------------Lazy load of the language from IPFS (disabled)
      // // Language is set optimistically in Vuex store. If something goes wrong during
      // // the lazy load the language state will be reverted back to the default value
      //
      // getLang(lang).then((messages) => {
      //   this.$i18n.setLocaleMessage(lang, messages);
      //   this.$i18n.locale = lang;
      //   this.$store.commit('setLanguage', lang);
      // }).catch((error) => {
      //   console.error(error);
      //   this.$store.commit('setLanguage', 'en_US');
      // });
      // ------------------------
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Personalize.less"></style>
