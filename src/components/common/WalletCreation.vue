<template>
  <div class="fullscreen-pane">
    <section class="wallet-creation-container" v-if="step===0">
      <p class="head">
        <strong>Wallet generation</strong>
      </p>
      <b>
        Your wallet is going to be generated
      </b>

      <button
        class="button is-primary"
        v-on:click="createWallet()">
        Next
      </button>
    </section>
    <section class="wallet-creation-container" v-if="step===1">
      <p class="head">
        <strong>Recovery phrase</strong>
      </p>
      <b>
        Please ensure to copy this words in order to recover this wallet in the future
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

      <button
        class="button is-primary"
        v-on:click="next()">
        I got it!
      </button>
    </section>
    <section class="wallet-creation-container" v-if="step===2">
      <p class="head">
        <strong>Phrase check</strong>
      </p>
      <b>
        Write the missing words in the right position before to continue
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

      <button
        :disabled="!checkWords()"
        class="button is-primary"
        v-on:click="walletCreated()">
        Next
      </button>
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
    next() {
      this.step = this.step + 1;
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
}

</style>
