import { ethers } from 'ethers';
import Ethereum from '../../classes/Ethereum';
import IIPFSHash from '../../interfaces/IIPFSHash';
// @ts-ignore
import * as DwellerID from '../../contracts/build/contracts/DwellerID.json';
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

  /** @function
   * @name setPhoto
   * @argument ipfsHash hash referencing the inital profile picture
   * @argument done callback which will be called on the first TX & confirm.
   * @returns dweller payload which contains all information about the dweller
   */
  setPhoto(ipfsHash: IIPFSHash, done: CallableFunction) {
    this.contract
      .setPhoto([
        ethers.utils.formatBytes32String(ipfsHash.path.substring(0, 23)),
        ethers.utils.formatBytes32String(ipfsHash.path.substring(23))
      ])
      .then(transaction => transaction.wait())
      .then(receipt => done(receipt));
  }

  /** @function
   * @name setUsername
   * @argument username username to set
   * @argument done callback which will be called on the first TX & confirm.
   */
  setUsername(username: string, done: CallableFunction) {
    this.contract
      .setDwellerName(ethers.utils.formatBytes32String(username))
      .then(transaction => transaction.wait())
      .then(receipt => done(receipt));
  }

  /** @function
   * @name setStatus
   * @argument status status to set
   * @argument done callback which will be called on the first TX & confirm.
   */
   setStatus(status: string, done: CallableFunction) {
    this.contract
      .setStatus(status)
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
    const onChainPhotoHash = '';
    return { dweller, onChainPhotoHash };
  }

  /** @function
   * @name getServers
   * @returns promise which will return the dwellers servers
   */
  async getServers(): Promise<any> {
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
   * @name getStatus
   * @returns status of the dweller who owns this contract
   */
   async getStatus() {
    return this.contract.status();
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

    return (
      ethers.utils.parseBytes32String(`0x${firstHalf}`) +
      ethers.utils.parseBytes32String(`0x${secondHalf}`)
    );
  }
}
