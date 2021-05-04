<<<<<<< HEAD
<template src="./Personalize.html"></template>
=======
<template>
  <div>
    <h3 class="label no-mobile">{{ $t('settings.personalize.appearance') }}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{ $t('settings.personalize.theme_heading') }}</h2>
        <p>{{ $t('settings.personalize.theme_subtext') }}</p>
        <br />
        <div class="select">
          <select v-model="$store.state.theme">
            <!--
            <option value="dark">Simply Dark</option>
            <option value="zenburn">Zenburn</option>
            <option value="light">Eye Strain</option>
            <option value="ice">Ice Cold</option>-->
            <option value="next">Next</option>
            <option value="tokyo">Tokyo Night</option>
            <option value="oled" v-if="isMobile()">Oled</option>
          </select>
        </div>
        <div v-if="$store.state.theme === 'oled'">
          <br />
          <h2>{{ $t('settings.personalize.theme_accent_heading') }}</h2>
          <p>{{ $t('settings.personalize.theme_accent_subtext') }}</p>
          <br />
          <div class="select">
            <select v-model="$store.state.accent">
              <option value="blue">Blue</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="pink">Pink</option>
              <option value="black">Black</option>
            </select>
          </div>
        </div>
      </div>
    </article>
    <h3 class="label no-mobile">
      {{ $t('settings.personalize.permissions') }}
    </h3>
    <hr class="spacer" />
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{ $t('settings.personalize.notifications_heading') }}</h2>
        <p>{{ $t('settings.personalize.notifications_subtext') }}</p>
        <br />
        <button
          class="button is-dark is-small"
          :disabled="notificationsEnabled"
          v-on:click="enableNotifications"
        >
          {{
            notificationsEnabled
              ? $t('settings.personalize.notifications_enabled')
              : $t('settings.personalize.enable_notifications')
          }}
        </button>
      </div>
    </article>
    <h3 class="label no-mobile">{{ $t('settings.personalize.language') }}</h3>
    <hr class="spacer" />
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{ $t('settings.personalize.language_heading') }}</h2>
        <p>{{ $t('settings.personalize.language_subtext') }}</p>
        <br />
        <div class="select">
          <select @change="setLanguage($event.target.value)">
            <option
              :key="`LangDefault`"
              value="en_US"
              :selected="$store.state.settings.language === 'en_US'"
              >{{ $t('languages.en_US') }}</option
            >
            <option
              v-for="(lang, i) in languages"
              :key="`Lang${i}`"
              :value="lang"
              :selected="$store.state.settings.language === lang"
              >{{ $t(`languages.${lang}`) }}</option
            >
          </select>
        </div>
      </div>
    </article>
  </div>
</template>
>>>>>>> 978076802bcf277c3d5d6ab8bbc2151ba33e6d6b

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
