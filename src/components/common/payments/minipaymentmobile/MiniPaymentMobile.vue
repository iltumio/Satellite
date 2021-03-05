<template src="./MiniPaymentMobile.html"></template>

<script>
import config from '@/config/config';
import CircleIcon from '@/components/common/CircleIcon';
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';
import Ethereum from '@/classes/Ethereum';

const ethereum = new Ethereum('user-provided');

export default {
  name: 'MiniPaymentMobile',
  props: [
    'person',
    'toggle',
    'address',
  ],
  components: {
    CircleIcon,
  },
  data() {
    return {
      amount: null,
      icon: false,
      name: false,
      error: false,
      priceUsd: 0,
    };
  },
  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    /** @method
     * Setter
     * Send a message to the message broker for storage and
     * Peer communication. Also send straight to the Peer2Peer handler
     * @name sendMessage
     * @argument data the data to send
     * @argument type the type of message we're broadcasting
     */
    async sendMessage(data, type) {
      if (this.$database.messageManager) {
        const msg = this.$database.messageManager.buildMessage(
          this.$store.state.activeChat,
          Date.now(),
          'message',
          {
            type: type || 'text',
            data,
          },
        );

        const id = this.$database.threadManager
          .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
        const threadExists = await this.$database.threadManager.fetchThread(id);
        if (threadExists) {
          const threadID = await this.$database.threadManager.threadAt(id);
          // If we have their public key, we will encrypt their message
          this.$database.messageManager
            .addMessageDeterministically(threadID, msg, this.$store.state.activeChat);
        }
      }
      const peer = this.$WebRTC.find(this.$store.state.activeChat);
      if (peer && peer.isAlive) {
        peer.send(
          'message',
          {
            type: type || 'text',
            data,
          },
        );
      }
    },
    /** @method
     * Setter
     * Reach out to the CoinCap.io API for current market
     * prices of Ethereum to USD
     * @name getMarketPrice
     */
    async getMarketPrice() {
      // pull prices from https://api.coincap.io/v2/assets/ethereum
      const response = await fetch('https://api.coincap.io/v2/assets/ethereum');
      const json = await response.json();
      this.priceUsd = json.data.priceUsd;
    },
    /** @method
     * Setter
     * Issue the transactoin on chain if everything checks out.
     * @name sendTransaction
     */
    async sendTransaction() {
      if (this.amount <= 0) {
        this.error = 'Please enter > 0 ETH.';
        return false;
      }
      this.error = false;
      ethereum.sendEther(
        this.address,
        this.$store.state.activeAccount,
        this.amount,
        (hash) => {
          this.sendMessage(
            {
              amount: this.amount,
              to: this.address,
              from: this.$store.state.activeAccount,
              tx: hash,
            },
            'payment',
          );
          this.amount = null;
          this.toggle();
        },
      );
      return true;
    },
  },
  async mounted() {
    const dwellerCachingHelper = new DwellerCachingHelper(this.$ethereum, config.registry[config.network.chain]);
    const dweller = await dwellerCachingHelper.getDweller(this.address);
    this.name = dweller.name;
    this.icon = dweller.photo;
    this.getMarketPrice();
  },
  /* eslint-disable */
  directives: {
    'click-outside': {
      bind: (el, binding) => {
        let clickedOffOnce = false;
        // Define ourClickEventHandler
        const ourClickEventHandler = event => {
          if (!el.contains(event.target) && el !== event.target) {
            if (clickedOffOnce) {
              // as we are attaching an click event listern to the document (below)
              // ensure the events target is outside the element or a child of it
              binding.value(event); // before binding it
            }
          }
          clickedOffOnce = true;
        };
        // attached the handler to the element so we can remove it later easily
        el.__vueClickEventHandler__ = ourClickEventHandler;

        // attaching ourClickEventHandler to a listener on the document here
        document.addEventListener("click", ourClickEventHandler);
      },
      unbind: function(el) {
        // Remove Event Listener
        document.removeEventListener("click", el.__vueClickEventHandler__);
      }
    }
  },
  /* eslint-enable */
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./MiniPaymentMobile.less"></style>
