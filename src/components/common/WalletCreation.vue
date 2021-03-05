<template>
  <div class="fullscreen-pane">
    <section class="wallet-creation-container" v-if="step===0">
      <h1 class="head">{{$t(`web3.wallet_creation.step.${step}.heading`)}}</h1>
      <b>
        {{$t(`web3.wallet_creation.step.${step}.subtext`)}}
      </b>

      <div class="buttons-container">
        <!-- empty div to align the "next" button to the right -->
      <div />
        <button
          class="button is-primary centered"
          v-on:click="createWallet()">
          {{$t(`web3.wallet_creation.step.${step}.primary_cta`)}}
        </button>
      </div>
    </section>
    <section class="wallet-creation-container" v-if="step===1">
      <h1 class="head">{{$t(`web3.wallet_creation.step.${step}.heading`)}}</h1>
      <b>
        {{$t(`web3.wallet_creation.step.${step}.subtext`)}}
      </b>

      <div class="mnemonic-container">
        <span 
          v-for="(word, index) in this.splittedMnemonic"
          v-bind:key="index"
          class="mnemonic-word"
        >
          <span class="number">{{`${index+1}.`}}</span>{{word}}
        </span>
      </div>

      <div class="buttons-container">
        <button
          class="button is-primary"
          v-on:click="back()">
          {{$t(`web3.wallet_creation.step.${step}.secondary_cta`)}}
        </button>

        <button
          class="button is-primary"
          v-on:click="next()">
          {{$t(`web3.wallet_creation.step.${step}.primary_cta`)}}
        </button>
      </div>
    </section>
    <section class="wallet-creation-container" v-if="step===2">
      <h1 class="head">{{$t(`web3.wallet_creation.step.${step}.heading`)}}</h1>
      <b>
        {{$t(`web3.wallet_creation.step.${step}.subtext`)}}
      </b>

      <div class="mnemonic-container">
        <div 
          v-for="(word, index) in this.splittedMnemonic"
          v-bind:key="index"
          class="mnemonic-word"
        >
          <span v-if="wordsToCheck.indexOf(index)=== -1">
            <span class="number">{{`${index+1}.`}}</span>{{word}}
          </span>
          <span v-else>
            <span class="number">{{`${index+1}.`}}</span>
            <input v-model="input[index]"/>
          </span>
        </div>
      </div>

      <div class="buttons-container">
        <button
          class="button is-primary"
          v-on:click="back()">
          {{$t(`web3.wallet_creation.step.${step}.secondary_cta`)}}
        </button>
        
        <button
          :disabled="!checkWords()"
          class="button is-primary"
          v-on:click="walletCreated()">
          {{$t(`web3.wallet_creation.step.${step}.primary_cta`)}}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { ethers } from 'ethers';

export default {
  name: 'WalletCreation',
  data() {
    return {
      step: 0,
      wallet: null,
      splittedMnemonic: [],
      wordsToCheck: [],
      input: {},
    };
  },
  methods: {
    back() {
      this.step -= 1;
    },
    next() {
      this.step += 1;
    },
    createWallet() {
      this.wallet = ethers.Wallet.createRandom();
      this.splittedMnemonic = this.wallet.mnemonic.phrase.split(' ');

      const numbers = [...Array(12).keys()];

      // Shuffle array
      const shuffled = numbers.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      this.wordsToCheck = shuffled.slice(0, 4);

      this.next();
    },
    checkWords() {
      const areWordsRight = this.wordsToCheck.reduce(
        (acc, next) => {
          return acc && this.input[next] && this.input[next].toLowerCase().trim() === this.splittedMnemonic[next]
        },
        true,
      );

      return areWordsRight;
    },
    walletCreated() {
      this.$store.commit('setMnemonic', this.wallet.mnemonic.phrase);
      this.onWalletCreated(this.wallet);
    },
  },
  mounted() {},
  props: ['onWalletCreated'],
};
</script>

<style scoped lang="less">

.wallet-creation-container {
  text-align: center;
  width: 50%;
  background: rgba(10, 10, 10, 0.86);
  padding: 50px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  margin: calc(50% - 500px) auto;

  .head {
    font-family: 'Space Mono', monospace;  
    font-size: 20pt;
    text-transform: uppercase;
    padding-bottom: 1rem;     
  }

  button {
    margin-top: 2rem;
  }

  .mnemonic-container {
    display: grid;
    grid-template-columns: repeat(4, 2fr);
    column-gap: 4px;
    row-gap: 4px;
    
    .mnemonic-word {
      padding: 4px;
      background-color: #545974;
      border-radius: 4px;
      color: #fff;
      max-width: 100%;
    }

    input {
      width: 100%;
      background-color: transparent !important;
      text-align: center;
      color: #fff !important;
      font-size: 13pt;
      font-weight: bold;
    }

    margin: 10px 0;
  }

  .buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  button {
    width: calc(50% - 0.15rem);
    margin: 0.15rem;
  }
  .wallet-creation-container {
    width: 100%;
    margin: 0;
    margin-top: calc(25% - 4rem);
    background: transparent;
  }
  
  .buttons-container {
    justify-content: center !important;
  }

  .mnemonic-container {
    grid-template-columns: repeat(2, 2fr) !important;
    width: 100%;
    margin-top: 2rem !important;
  }

  .mnemonic-word {
    position: relative;
    padding-left: 1rem;
    text-align: center;
    font-size: 14pt;
    padding: 0.5rem !important;
    border-radius: 2px !important;

    .number {
      position: absolute;
      top: 0;
      left: 0;
      width: 22px;
      font-size: 10pt;
      border-radius: 3px;
    }
  }

  .fullscreen-pane {
    background-image: url(https://ipfs.io/ipfs/QmXHfboc1Wqtt7C9ErHHGay8Bq1nn6m39ccrov8nHGQVQV);
    background-position: bottom;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

</style>
