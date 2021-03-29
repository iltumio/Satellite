import { ethers } from 'ethers';

export enum InfuraNetworkNames {
    goerli="goerli",
    homestead="homestead",
    ropsten="ropsten"
}

function getInfuraProvider(networkName: InfuraNetworkNames){
    return process.env.VUE_APP_INFURA_API_KEY ?
          new ethers.providers.InfuraProvider(networkName, process.env.VUE_APP_INFURA_API_KEY)
          : ethers.providers.getDefaultProvider(networkName)
}

const NetworkProviders = {
  goerli: ()=>getInfuraProvider(InfuraNetworkNames.goerli),
  homestead: ()=>getInfuraProvider(InfuraNetworkNames.homestead),
  ropsten: ()=>getInfuraProvider(InfuraNetworkNames.ropsten),
  mumbai: ()=>new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today'),
};

const NetworkExplorers = {
    goerli: 'https://goerli.etherscan.io',
    homestead: '',
    ropsten: '',
    mumbai: 'https://explorer-mumbai.maticvigil.com/',
};

const NetworkApis = {
    goerli: 'http://api-goerli.etherscan.io/api',
    homestead: '',
    ropsten: '',
    mumbai: 'https://mumbai.maticvigil.com/api/',
};

const CoinCapApis = {
    goerli: 'https://api.coincap.io/v2/assets/ethereum',
    homestead: 'https://api.coincap.io/v2/assets/ethereum',
    ropsten: 'https://api.coincap.io/v2/assets/ethereum',
    mumbai: 'https://api.coincap.io/v2/assets/matic-network'
}

const TokenSymbols = {
    goerli: 'ETH',
    homestead: 'ETH',
    ropsten: 'ETH',
    mumbai: 'MATIC'
}

export function getEthereumProviderByNetwork(network: InfuraNetworkNames) {
    return typeof NetworkProviders[network] === "function" ? NetworkProviders[network]() : NetworkProviders[network];
}

export function getExplorerByNetwork(network: InfuraNetworkNames) {
    return NetworkExplorers[network];
}

export function getExplorerApiByNetwork(network: InfuraNetworkNames) {
    return NetworkApis[network];
}

export async function marketDataByNetwork(network: InfuraNetworkNames) {
    if(!CoinCapApis[network]) {
        throw new Error("Wrong network name");
    }
    const response = await fetch(CoinCapApis[network]);
    const json = await response.json();
    return json.data;
}

export function getTokenSymbolByNetwork(network: InfuraNetworkNames) {
    if(!TokenSymbols[network]) {
        throw new Error("Wrong network name");
    }
    return TokenSymbols[network];
}

export async function marketDataSearch(search: string) {
    const response = await fetch(`https://api.coincap.io/v2/assets?search=${search}`);
    const json = await response.json();
    return json.data.length ? json.data[0] : null;
}
