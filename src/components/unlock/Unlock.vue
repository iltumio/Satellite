<template>
  <div id="unlock">
    <PWAInstallPrompt />
    <div class="columns main unlock">
      <img id="logo" src="static/img/icons/logo-white.png" />
      <div class="column is-one-fifth">
        <i class="fas fa-key"></i>
      </div>
      <div class="column is-three-fifthths">
        <h2 class="label" v-if="storedPinHash">{{$t('unlock.decrypt_account')}}</h2>
        <h2 class="label" v-else>{{$t('unlock.create_encryption_pin')}}</h2>
        <div class="field has-addons" >
          <div class="control" style="width: 100%;">
            <input
              type="password"
              class="input is-small"
              autofocus
              v-model="pin"
              v-on:keyup.enter="decideAction"
              :placeholder="$t('unlock.pin_placeholder')"/>
          </div>
          <div class="control">
            <a :disabled="decrypting" class="button is-primary is-small" v-on:click="decideAction">
              <i v-if="!decrypting" class="fas fa-unlock"></i>
              <i v-else class="fa fa-spin fa-circle-notch"></i>
            </a>
          </div>
        </div>
        <p class="label sub-label">
          <input :readonly="decrypting" type="checkbox" v-model="storePin" /> {{$t('unlock.stay_logged')}}
        </p>
      </div>
      <div class="column is-one-fifth">
      </div>
    </div>
    <div class="subtext label">
      {{$t('unlock.AES_encryption')}}
    </div>
    <div class="error label red" v-if="error">
      {{error}}
    </div>
  </div>
</template>
<script>
import ToggleSwitch from '@/components/common/ToggleSwitch';
import PWAInstallPrompt from '@/components/common/mobile/PWAInstallPrompt';
import crypto from '@/utils/Crypto.ts';

export default {
  name: 'unlock',
  props: ['decrypted'],
  components: {
    ToggleSwitch,
    PWAInstallPrompt
  },
  data() {
    return {
      pin: '',
      error: false,
      storePin: false,
      storedPinHash: localStorage.getItem('v74.pinhash') || false,
      storedPin: localStorage.getItem('v74.pin') || false,
      decrypting: false,
    };
  },
  methods: {
    decideAction() {
      if (this.storedPinHash) {
        this.testPin();
      } else {
        this.encryptAndStore();
      }
    },
    async encryptAndStore() {
      if (!this.pin || this.pin.length < 4) {
        this.error = 'Please use at least 4 characters in your pin.';
        return;
      }
      this.error = false;
      const encryptedPin = await crypto.encrypt(this.pin, this.pin);
      localStorage.setItem('v74.pinhash', encryptedPin);
      if (this.storePin) localStorage.setItem('v74.pin', this.pin);
      this.$store.commit('setPin', this.pin);
      this.decrypting = true;
      await this.decrypted(this.pin);
    },
    async testPin() {
      crypto.decrypt(this.storedPinHash, this.pin)
        .then(() => {
          this.error = false;
          window.v74pin = this.pin;
          this.$pin = this.pin;
          if (this.storePin) localStorage.setItem('v74.pin', this.pin);
          this.$store.commit('setPin', this.pin);
          this.decrypting = true;
          this.decrypted(this.pin);
        })
        .catch(() => {
          this.error = 'Invalid pin, try again.';
        });
    },
  },
  mounted() {
    if (localStorage.getItem('v74.pin')) {
      window.v74pin = localStorage.getItem('v74.pin');
      this.decrypting = true;
      this.decrypted(localStorage.getItem('v74.pin'));
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #logo {
    display: none;
  }
  #unlock {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #1c1a24;
  }
  .main {
    width: 500px;
    margin: 33.33% calc(33.33% - 40px);
    margin-bottom: 0;
    margin-top: 0;
    padding-top: 20%;
  }
  .label {
    padding: 0 !important;
    margin: 0 !important;
  }
  .sub-label {
    opacity: 0.75;
  }
  .subtext, .error {
    text-align: center;
    opacity: 0.2;
  }

  .error {
    opacity: 1;
  }
  .fa-key {
    font-size: 20pt;
    margin-top: 1.6rem;
    float: right;
    color: #b2bae1 !important
  }
  button {
    margin-top: 1.5rem;
  }
  @media (max-width: 768px) {
    #logo {
      position: absolute;
      top: 4rem;
      left: calc(50% - 50px);
      width: 100px;
      height: 100px;
      display: block;
    }
    #unlock {
      background-image: url(../../../static/img/mobile-background.png);
      background-position: bottom;
      background-size: contain;
      background-repeat: no-repeat;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
