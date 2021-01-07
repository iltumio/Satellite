// @ts-ignore
import * as DwellerID from '@/contracts/build/contracts/DwellerID.json';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';
import IIPFSHash from '../interfaces/IIPFSHash';
import { Contract } from "web3-eth-contract";

const ethereum = new Ethereum('window');
// useful methods to interact with the DwellerID contract
export default {
  /** @function
   * @name getContract
   * @argument address Address of the DwellerID contract
   * @returns contract instance ready for method execution
   */
  getContract(address: string) {
    let contract: Contract;
    if (address.length) {
      contract = ethereum.getContract(DwellerID.abi, address);
    } else {
      contract = ethereum.getContract(DwellerID.abi);
    }
    contract.options.data = DwellerID.bytecode.object;
    return contract;
  },

  /** @function
   * @name deploy
   * @argument _username inital username to deploy the contract with
   * @argument account to deploy the contract from, this will be the owner
   * @argument tx callback which will be called when the transaction is made
   * @argument done callback to be called when the first confirmation comes through
   */
  deploy(_username: string, account: string, tx: CallableFunction, done: CallableFunction) {
    const username = ethereum.fromAscii(_username);
    const contract = this.getContract('');
    // @ts-ignore
    contract.deploy({
      arguments: [username],
    }).send({
      from: account,
      gas: 4700000,
    })
      // @ts-ignore
      .once('transactionHash', tx)
      // @ts-ignore
      .once('confirmation', done);
  },

  /** @function
   * @name setPhoto
   * @argument address Address of the DwellerID contract
   * @argument account account to use for the transaction
   * @argument ipfsHash hash referencing the inital profile picture
   * @argument done callback which will be called on the first TX & confirm.
   * @returns dweller payload which contains all information about the dweller
   */
  setPhoto(address: string, account: string, ipfsHash: IIPFSHash, done: CallableFunction) {
    const contract = this.getContract(address);
    contract.methods.setPhoto([
      ethereum.fromAscii(ipfsHash.path.substring(0, 23)),
      ethereum.fromAscii(ipfsHash.path.substring(23)),
    ])
      .send({
        from: account,
        gas: 4700000,
      })
      .once('transactionHash', done)
      .once('confirmation', done);
  },

  /** @function
   * @name setUsername
   * @argument address Address of the DwellerID contract
   * @argument account account to use for the transaction
   * @argument username username to set
   * @argument done callback which will be called on the first TX & confirm.
   */
  setUsername(address: string, account: string, username: string, done: CallableFunction) {
    const contract = this.getContract(address);
    contract.methods.setDwellerName(ethereum.fromAscii(username))
      .send({
        from: account,
        gas: 4700000,
      })
      .once('transactionHash', done)
      .once('confirmation', done);
  },

  /** @function
   * @name getDwellerAsync
   * @argument address Address of the DwellerID contract
   * @argument done callback which will return the dweller info
   */
  async getDweller(address: string, done: CallableFunction) {
    const contract = this.getContract(address);
    const dweller = await contract.methods.getDweller().call();
    if (!dweller) {
      done(false, false);
      return;
    }
    let onChainPhotoHash = await contract.methods.getPhoto().call();
    onChainPhotoHash = onChainPhotoHash.substr(0, 48) + onChainPhotoHash.substr(66, 46);
    onChainPhotoHash = ethereum.utils.hexToString(onChainPhotoHash);
    done(dweller, onChainPhotoHash);
  },

  async getServers(address: string, from: string) : Promise<any> {
    const contract = this.getContract(address);
    const servers = await contract.methods.getServers().call({
      from: from,
    });
    return servers;
  },

  /** @function
   * @name getDwellerAsync
   * @argument address Address of the DwellerID contract
   * @returns dweller payload which contains all information about the dweller
   */
  async getDwellerAsync(address: string) : Promise<string> {
    return new Promise((resolve) => {
      this.getDweller(address, (dweller: string, onChainPhotoHash: string) => {
        // @ts-ignore
        resolve(dweller, onChainPhotoHash);
      });
    });
  },

  /** @function
   * @name getPhotoAsync
   * @argument address Address of the DwellerID contract
   * @returns ipfs photo hash assigned to the dweller contract
   */
  async getPhotoAsync(address: string) {
    return new Promise((resolve) => {
      this.getDweller(address, (_: any, onChainPhotoHash: string) => {
        resolve(onChainPhotoHash);
      });
    });
  },

  /** @function
   * @name getDwellerAddress
   * @argument address Address of the DwellerID contract
   * @returns owner address of the dweller contract
   */
  async getDwellerAddress(address: string) {
    const contract = this.getContract(address);
    const dweller = await contract.methods.getDwellerAddress().call();
    return dweller;
  },

  /** @function
   * @name getDwellerName
   * @argument address Address of the DwellerID contract
   * @returns name of the dweller who owns this contract
   */
  async getDwellerName(address: string) {
    const contract = this.getContract(address);
    const dwellerName = await contract.methods.getDwellerName().call();
    return dwellerName;
  },
};
