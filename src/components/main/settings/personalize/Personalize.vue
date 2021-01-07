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
            <option value="zenburn">Zenburn</option>
            <option value="light">Eye Strain</option>
            <option value="ice">Ice Cold</option>
            <option value="tokyo">Tokyo Night</option>
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
  </div>
</template>

<script>
export default {
  name: 'Personalize',
  props: ['settings'],
  data() {
    return {
      notificationsEnabled: Notification.permission === 'granted',
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
