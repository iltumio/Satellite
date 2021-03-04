<template>
  <div class="fullscreen-pane">
    <section class="wallet-creation-container" v-if="step===0">
      <p class="head">
        <strong>{{$t(`web3.wallet_creation.step.${step}.heading`)}}</strong>
      </p>
      <b>
        {{$t(`web3.wallet_creation.step.${step}.subtext`)}}
      </b>

      <div class="buttons-container">
        <!-- empty div to align the "next" button to the right -->
        <div />
        <button
          class="button is-primary"
          v-on:click="createWallet()">
          {{$t(`web3.wallet_creation.step.${step}.primary_cta`)}}
        </button>
      </div>
    </section>
    <section class="wallet-creation-container" v-if="step===1">
      <p class="head">
        <strong>{{$t(`web3.wallet_creation.step.${step}.heading`)}}</strong>
      </p>
      <b>
        {{$t(`web3.wallet_creation.step.${step}.subtext`)}}
      </b>

      <div class="mnemonic-container">
        <span 
          v-for="(word, index) in this.splittedMnemonic"
          v-bind:key="index"
          class="mnemonic-word"
        >
          {{`${index+1}. ${word}`}}
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
      <p class="head">
        <strong>{{$t(`web3.wallet_creation.step.${step}.heading`)}}</strong>
      </p>
      <b>
        {{$t(`web3.wallet_creation.step.${step}.subtext`)}}
      </b>

      <div class="mnemonic-container">
        <div 
          v-for="(word, index) in this.splittedMnemonic"
          v-bind:key="index"
          class="mnemonic-word"
        >
          <span v-if="wordsToCheck.indexOf(index)=== -1">{{`${index+1}. ${word}`}}</span>
          <input v-else v-model="input[index]"/>
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
        (acc, next) => acc && this.input[next] === this.splittedMnemonic[next],
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

  .mnemonic-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
    }

    margin: 10px 0;
  }

  .buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

</style>
