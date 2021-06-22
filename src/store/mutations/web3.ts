import { IState } from '../createState'

const satelliteLogo = require('@/assets/images/logo_color.png')

export const AvailableProviders = {
  NOT_PRESENT: {
    check: null,
    id: 'injected',
    logo: null,
    name: 'NOT_PRESENT',
    type: 'NOT_PRESENT'
  },
  SATELLITE: {
    logo: satelliteLogo,
    name: 'Satellite',
    type: 'satellite'
  }
}

export default {
  setWeb3Connected (state: IState, connected: boolean) {
    state.web3connected = connected
  },
  clearInjectedProvider (state: IState) {
    state.injectedProvider = null
  },
  setInjectedProvider (state: IState, injectedProvider: any) {
    state.availableProviders = state.availableProviders.filter(
      availableProvider => availableProvider.type !== 'injected'
    )

    if (injectedProvider) {
      state.injectedProvider = injectedProvider

      state.availableProviders.push(injectedProvider)
    } else {
      state.injectedProvider = AvailableProviders.NOT_PRESENT
    }
  },
  setSelectedProvider (state: IState, provider: any) {
    state.selectedProvider = provider
  },
  updateBalance (state: IState, balance: number) {
    state.balance = balance

    state.balanceLastUpdate = Date.now()
  },
  setMnemonic (state: IState, mnemonic: string) {
    state.mnemonic = mnemonic
  },
  fundingAccount (state: IState, fundingAccount: boolean) {
    state.fundingAccount = fundingAccount
  }
}
