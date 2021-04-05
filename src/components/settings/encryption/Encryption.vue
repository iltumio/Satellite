<template>
  <div>
    <h3 class="label">{{$t('settings.encryption.label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.encryption.heading')}}</h2>
        <p v-html="$t('settings.encryption.subtext')"/>
        <br>
        <div v-if="key">
          <span class="label">{{$t('settings.encryption.public_key')}}</span>
          <input readonly :value="JSON.stringify(key.public)" class="input" type="text" />
          <span class="label">{{$t('settings.encryption.private_key')}} <small>({{$t('settings.encryption.hover_to_reveal')}})</small></span>
          <div class="input blured bigkey" type="text">
            <span class="text">
              {{JSON.stringify(key.private)}}
            </span>
          </div>
          <br><br>
          <button class="button is-danger is-small">{{$t('settings.encryption.regenerate_keys')}}</button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import Crypto from '@/classes/crypto/Crypto.ts';

const crypto = new Crypto();

export default {
  name: 'Encryption',
  data() {
    return {
      key: false,
    };
  },
  async mounted() {
    this.key = await crypto.keygen();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .blured > .text {
    filter: blur(4px);
  }
  .blured:hover > .text {
    filter: blur(0px);
  }
  .bigkey {
    height: 100px;
  }
</style>
