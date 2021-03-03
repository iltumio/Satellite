import { ethers } from 'ethers';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';
// @ts-ignore
import * as DwellerID from '@/contracts/build/contracts/DwellerID.json';
// @ts-ignore
import IIPFSHash from '../../interfaces/IIPFSHash.ts';


export default class DwellerContract {
  ethereum: any;
  contract: ethers.Contract;

  constructor(ethereum: typeof Ethereum, address: string) {
    this.ethereum = ethereum;
    this.contract = this.getContract(address);
  }

  /** @function
   * @name getContract
   * @argument address Address of the DwellerID contract
   * @returns contract instance ready for method execution
   */
  getContract(address: string) {
    return this.ethereum.getContract(DwellerID.abi, address);
  }

  //   /** @function
  //    * @name deploy
  //    * @argument _username inital username to deploy the contract with
  //    * @argument account to deploy the contract from, this will be the owner
  //    * @argument tx callback which will be called when the transaction is made
  //    * @argument done callback to be called when the first confirmation comes through
  //    */
  //   deploy(_username: string, account: string, tx: CallableFunction, done: CallableFunction) {
  //     const username = ethers.utils.formatBytes32String(_username);
  //     const contract = this.getContract('');
  //     // @ts-ignore
  //     contract.deploy({
  //       arguments: [username],
  //     }).send({
  //       from: account,
  //       gasPrice: 4700000,
  //     })
  //       // @ts-ignore
  //       .once('transactionHash', tx)
  //       // @ts-ignore
  //       .once('confirmation', done);
  //   }

  /** @function
   * @name setPhoto
   * @argument ipfsHash hash referencing the inital profile picture
   * @argument done callback which will be called on the first TX & confirm.
   * @returns dweller payload which contains all information about the dweller
   */
  setPhoto(ipfsHash: IIPFSHash, done: CallableFunction) {
    this.contract.setPhoto([
      ethers.utils.formatBytes32String(ipfsHash.path.substring(0, 23)),
      ethers.utils.formatBytes32String(ipfsHash.path.substring(23)),
    ], { gasPrice: 4700000 })
      .then(transaction => transaction.wait())
      .then(receipt => done(receipt));
  }

  /** @function
   * @name setUsername
   * @argument username username to set
   * @argument done callback which will be called on the first TX & confirm.
   */
  setUsername(username: string, done: CallableFunction) {
    this.contract.setDwellerName(ethers.utils.formatBytes32String(username), {
      gasPrice: 4700000,
    })
      .then(transaction => transaction.wait())
      .then(receipt => done(receipt));
  }

  /** @function
   * @name getDweller
   * @argument done callback which will return the dweller info
   */
  async getDweller() {
    const dweller = await this.contract.getDweller();
    if (!dweller) {
      throw new Error('Dweller not found');
    }
    // const onChainPhotoHash = await this.contract.getPhoto().catch(err => console.log('error', err));
    const onChainPhotoHash = '';
    // onChainPhotoHash = onChainPhotoHash.substr(0, 48) + onChainPhotoHash.substr(66, 46);
    // onChainPhotoHash = ethers.utils.hexToString(onChainPhotoHash);

    return { dweller, onChainPhotoHash };
  }

  /** @function
   * @name getServers
   * @returns promise which will return the dwellers servers
   */
  async getServers() : Promise<any> {
    return this.contract.getServers();
  }

  /** @function
   * @name getDwellerAddress
   * @returns owner address of the dweller contract
   */
  async getDwellerAddress() {
    return this.contract.getDwellerAddress();
  }

  /** @function
   * @name getDwellerName
   * @returns name of the dweller who owns this contract
   */
  async getDwellerName() {
    return this.contract.getDwellerName();
  }

  /** @function
   * @name getPhoto
   * @returns hash of the picture
   */
  async getPhoto() {
    const photo = await this.contract.getPhoto();
    const sliced = photo.slice(2);
    const firstHalf = sliced.substr(0, 64);
    const secondHalf = sliced.substr(64, 128);

    return ethers.utils.parseBytes32String(`0x${firstHalf}`) + ethers.utils.parseBytes32String(`0x${secondHalf}`);
  }
}
