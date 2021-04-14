<template>
  <div>
    <ProviderSelection
      v-if="!$store.state.selectedProvider"
      :onProviderSelected="onProviderSelected"
    />
    <WalletCreation
      v-if="
        $store.state.selectedProvider &&
        !$store.state.accounts.length &&
        !$store.state.mnemonic
      "
      :onWalletCreated="onWalletCreated"
    />
  </div>
</template>

<script>
import ProviderSelection from "@/components/common/ProviderSelection";
import WalletCreation from "@/components/common/wallet/WalletCreation";

export default {
  name: "Web3",
  data() {
    return {
      connected: false,
      selectedProvider: null,
      ethereum: null,
    };
  },
  components: {
    ProviderSelection,
    WalletCreation,
  },
  methods: {
    onProviderSelected(provider) {
      this.$store.dispatch("selectProvider", { provider });
    },
    onWalletCreated(wallet) {
      // const { selectedProvider } = this.$store.state;
      // Connect the selected provider, based on the user selection
      // this action will automatically call the startup action and get stats action
      this.$store.dispatch("connectProvider", {
        providerInfo: { type: "satellite" },
        wallet,
      });
    },
  },
  mounted() {
    // this.$store.dispatch('detectInjected');
    // this.$store.dispatch('web3Start');
  },
  mounted() {
    this.$store.dispatch("detectInjected");
    // this.$store.dispatch('web3Start')
  },
};
</script>

<style scoped lang="less">
.head {
  font-family: "Space Mono", monospace;
  font-size: 20pt;
  padding-top: 1rem;
  padding-bottom: 2rem;
}
.provider-selection {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .provider-element {
    display: flex;
    flex-direction: column;
    width: 33%;
    cursor: pointer;
    padding: 20px;
    border-radius: 5px;
    overflow: hidden;

    justify-content: space-between;

    &:hover {
      // Lighter blue gray
      background-color: #545974;
    }
  }
}
</style>
