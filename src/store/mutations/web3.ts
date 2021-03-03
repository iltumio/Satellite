const satelliteLogo = require('@/assets/images/logo_color.png');

export const AvailableProviders = {
  NOT_PRESENT: {
    check: null,
    id: 'injected',
    logo: null,
    name: 'NOT_PRESENT',
    type: 'NOT_PRESENT',
  },
  SATELLITE: {
    logo: satelliteLogo,
    name: 'Satellite',
    type: 'satellite',
  },
};

export default {
  setWeb3Connected(state: any, connected: boolean) {
    // eslint-disable-next-line
    state.web3connected = connected;
  },
  clearInjectedProvider(state: any) {
    // eslint-disable-next-line
    state.injectedProvider = null;
  },
  setInjectedProvider(state: any, injectedProvider: any) {
    // eslint-disable-next-line
    state.availableProviders = state.availableProviders.filter(
      availableProvider => availableProvider.type !== 'injected');

    if (injectedProvider) {
      // eslint-disable-next-line
      state.injectedProvider = injectedProvider;
      // eslint-disable-next-line
      state.availableProviders.push(injectedProvider);
    } else {
      // eslint-disable-next-line
      state.injectedProvider = AvailableProviders.NOT_PRESENT;
    }
  },
  setSelectedProvider(state: any, provider: any) {
    // eslint-disable-next-line
    state.selectedProvider = provider;
  },
  updateBalance(state: any, balance: number) {
    // eslint-disable-next-line
    state.balance = balance;
    // eslint-disable-next-line
    state.balanceLastUpdate = Date.now();
  },
  setMnemonic(state:any, mnemonic: string) {
    // eslint-disable-next-line
    state.mnemonic = mnemonic;
  },
};
