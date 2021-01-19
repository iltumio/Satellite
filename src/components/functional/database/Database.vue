<template></template>
<script>
import {
  Client,
  PrivateKey,
} from '@textile/hub';
import config from '@/config/config';
import Crypto from '@/classes/crypto/Crypto.ts';

export default {
  name: 'database',
  methods: {
    async startup() {
      // Generate local pub/priv keys if none exist.
      const crypto = new Crypto();
      await crypto.keygen();

      this.$store.commit('fetchFriends', this.$store.state.activeAccount);
      setTimeout(() => {
        // Really shouldn't be used, but prevents
        // some potenial race conditions with globals
        this.$store.commit('starting', false);
      }, 500);
    },
    makeKey() {
      return {
        key: config.textile.key,
      };
    },
    async getIdentity() {
      /** Restore any cached user identity first */
      const cached = localStorage.getItem('textile.identity');
      if (cached !== null) {
        /** Convert the cached identity string to a PrivateKey and return */
        return PrivateKey.fromString(cached);
      }
      /** No cached identity existed, so create a new one */
      const identity = await PrivateKey.fromRandom();
      /** Add the string copy to the cache */
      // TODO: Encrypt this with user password in the future
      localStorage.setItem('textile.identity', identity.toString());
      /** Return the random identity */
      return identity;
    },
    async authorize(key, identity) {
      const client = await Client.withKeyInfo(key);
      const userToken = await client.getToken(identity).catch(() => {
        this.$store.commit('criticalError', 'Textile.io may be down...');
      });
      return {
        client,
        userToken,
      };
    },
  },
  async mounted() {
    this.$store.commit('starting', true);
    if (this.$store.state.databaseEnabled) {
      const identity = await this.getIdentity();
      const client = await this.authorize(this.makeKey(), identity);
      this.$database.authenticate(
        'textile',
        this.$store.state.activeAccount,
        window.v74pin,
        client,
      );
      window.Vault74.Database = this.$database;
      this.startup();
    } else {
      this.$database.authenticate(
        'localStorage',
        this.$store.state.activeAccount,
        window.v74pin,
      );
      window.Vault74.Database = this.$database;
      this.startup();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
