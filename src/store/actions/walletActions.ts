import ERC20 from '../../classes/contracts/ERC20';
import { IWalletAsset } from '../../store/createState';
import {
  marketDataSearch
} from '../../utils/EthereumProvider';

export default {
  // Checks if a provider has already been selected and connects to it
  async getTokenBalance({ dispatch, state, commit }, asset) {
    // @ts-ignore
    const ethereum = this.$app.$ethereum;

    if (asset.tokenType === 'default') {
      const balance = await ethereum.getCurrentAccountBalance();
      const marketData = await marketDataSearch('matic');

      const changePercent24Hr = parseFloat(marketData.changePercent24Hr);

      commit('setAssetData', {
        ...asset,
        balance,
        priceUsd: marketData.priceUsd,
        changePercent24Hr:
          changePercent24Hr > 0
            ? `+ ${changePercent24Hr.toFixed(2)}`
            : `- ${changePercent24Hr.toFixed(2)}`
      });
    } else if (asset.tokenType === 'ERC20') {
      const tokenContract = new ERC20(ethereum, asset.contractAddress);

      const balance = await tokenContract.getBalance();

      const symbol = await tokenContract.getSymbol();

      const marketData = await marketDataSearch(symbol);

      const changePercent24Hr = parseFloat(marketData?.changePercent24Hr || 0)

      commit('setAssetData', {
        ...asset,
        balance,
        priceUsd: marketData?.priceUsd || 0,
        changePercent24Hr:
          changePercent24Hr > 0
            ? `+ ${changePercent24Hr.toFixed(2)}`
            : `- ${changePercent24Hr.toFixed(2)}`
      });
    }
  },
  async updateAllTokenBalances({ state, dispatch }) {
    Object.values<IWalletAsset>(state.assets).forEach(asset => {
      dispatch('getTokenBalance', asset);
    });
  }
};
