import config from '../../config/config';
import Registry from '../../classes/contracts/Registry';
import ServerContract from '../../classes/contracts/ServerContract';
import DwellerContract from '../../classes/contracts/DwellerContract';

export default {
  async fetchServers({ commit, state }) {
    // @ts-ignore
    const ethereum = this.$app.$ethereum;

    const registry = new Registry(
      ethereum,
      config.registry[config.network.chain]
    );

    const dwellerContractAddress = await registry.getDwellerContract(
      state.activeAccount
    );

    const dwellerContract = new DwellerContract(
      ethereum,
      dwellerContractAddress
    );

    const serverAddresses = await dwellerContract.getServers();

    const fetchServers = serverAddresses.map(serverAddress => {
      const serverContract = new ServerContract(ethereum, serverAddress);
      return serverContract.get(serverAddress);
    });

    const server = await Promise.all(fetchServers);

    commit('updateServers', server);
  }
};
