<template>
  <div>
    <h3 class="label">Appearance</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>Theme</h2>
        <p>Change up the theam and stay easy on the eyes with Vault74.</p>
        <br>
        <div class="select">
          <select v-model="$store.state.theme">
            <option value="dark">Simply Dark</option>
            <option value="light">Eye Strain</option>
            <option value="ice">Ice Cold</option>
            <option value="tokyo">Tokyo Night</option>
            <option value="tokyo-lights">Tokyo Lights</option>
          </select>
        </div>
      </div>
    </article>
    <h3 class="label">Permissions</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>Notifications</h2>
        <p>Click to enable notifications with Vault74 for a better experience.</p>
        <br>
        <button 
          class="button is-dark is-small" 
          :disabled="notificationsEnabled"
          v-on:click="enableNotifications">
          {{ notificationsEnabled ? 'Notifications Enabled!' : 'Enable Notificaions' }}
        </button>
      </div>
    </article>
    <h3 class="label">Language</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>Language</h2>
        <p>Choose your preferred language from the list below.</p>
        <br>
        <div class="select">
          <select @change="setLanguage($event.target.value)">
            <option :key="`LangDefault`" value="en_US" :selected="$store.state.settings.language === 'en_US'">{{ $t('languages.en_US') }}</option>
            <option v-for="(lang, i) in languages" :key="`Lang${i}`" :value="lang" :selected="$store.state.settings.language === lang" >{{ $t(`languages.${lang}`) }}</option>
          </select>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { languages } from '@/config/config';
import { getLang } from '@/utils/i18n';

export default {
  name: 'Personalize',
  props: ['settings', 'setSetting'],
  data() {
    return {
      notificationsEnabled: Notification.permission === 'granted',
      languages: Object.keys(languages),
    };
  },
  methods: {
    enableNotifications() {
      Notification.requestPermission().then((permission) => {
        this.notificationsEnabled = permission === 'granted';
      });
    },
    toggleDarkMode() {
      this.$store.commit('toggleDarkMode');
    },
    setLanguage(lang) {
      // Language is set optimistically in Vuex store. If something goes wrong during
      // the lazy load the language state will be reverted back to the default value
      getLang(lang).then((messages) => {
        this.$i18n.setLocaleMessage(lang, messages);
        this.$i18n.locale = lang;
        this.$store.commit('setLanguage', lang);
      }).catch((error) => {
        console.error(error);
        this.$store.commit('setLanguage', 'en_US');
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>