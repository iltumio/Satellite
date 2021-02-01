// import Web3 from 'web3';
import { ethers } from 'ethers';
import * as Web3Utils from 'web3-utils';
import config from '@/config/config';

export default class Ethereum {
  /** @constructor
   * Construct a Ethereum handler
   * this class should abstract methods which will change depending
   * on which network we are using to connect to the chain
   * @argument web3Provider optional providewr to be used
   */
  constructor(providerType, signer = null) {
    console.log('New ethereum', providerType);
    this.netConfig = config.network;

    if (providerType === 'injected') {
      this.provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    } else if (providerType === 'vault74' && signer) {
      // this.provider = new ethers.providers.InfuraProvider('goerli', '');
      this.provider = ethers.providers.getDefaultProvider('goerli');
    } else {
      console.error('Signer is required for wault74 provider');
    }
  }

  /**
   * @description Retrieve the current block number from the network
   */
  async getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  /**
   * @description Retrieve the network from the network
   */
  async getNetworkType() {
    return this.provider.getNetwork();
  }

  /** @function
   * Check for user specified provider in storage, else use defaults
   * @name fetchProvider
   */
  fetchProvider() {
    return this.netConfig.eth[localStorage.getItem('Vault74.provider')] || this.netConfig.eth.default;
  }

  /** @function
   * Create bindings for web3 methods and utilities
   * @name createBindings
   */
  createBindings() {
    this.eth = this.getEth();
    this.utils = Web3Utils;
  }

  /** @function
   * Send ether to another address
   * @name sendEther
   * @argument to address to send ether to
   * @argument from address to send from (must have access)
   * @argument value amount (in Ether) to send
   * @argument cb callback function to send tx hash to
   */
  sendEther(to, from, value, cb) {
    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to,
            value: this.utils.toHex(this.utils.toWei(value, 'ether')),
            gasPrice: '0x61a8',
            gas: '0x61a8',
          },
        ],
      })
      .then(txHash => cb(txHash));
  }

  /** @function
   * Get the ETH package from web3
   * @name getEth
   */
  getEth() {
    return this.web3.eth;
  }

  fromAscii(string) {
    return this.utils.fromAscii(string).padEnd(66, '0');
  }

  /** @function
   * Get the contract constructor
   * @name getContract
   * @argument abi abstract interface for the contract
   * @argument address address of the contract on chain
   */
  getContract(abi, address = null) {
    return new ethers.Contract(address, abi, this.provider);
  }

  getAccount() {
    if (!this.localAccount) {
      const acc = this.eth.accounts.create();
      this.localAccount = {
        address: acc.address,
        nonce: acc.nonce,
        privateKey: acc.privateKey,
      };
      localStorage.setItem('Vault74.eth.account', JSON.stringify(this.localAccount));
    }
    return this.localAccount;
  }

  signTransaction(tx) {
    return this.eth.accounts.signTransaction(tx, this.localAccount.privateKey);
  }

  executeTransaction(method, account, tx, done) {
    if (this.localAccount) {
      this.signTransaction(method)
        .once('transactionHash', tx)
        .once('confirmation', done);
    } else {
      method
        .send({
          from: account,
          gas: 4700000,
        })
        .once('transactionHash', tx)
        .once('confirmation', done);
    }
  }
}
