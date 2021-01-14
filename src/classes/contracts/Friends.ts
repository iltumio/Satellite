import { Contract } from "web3-eth-contract";
// @ts-ignore
import * as FriendsInterface from '@/contracts/build/contracts/Friends.json';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';
// @ts-ignore
import DwellerCache from '@/classes/DwellerCachingHelper';
// @ts-ignore
import config from '@/config/config';

const dwellerCache = new DwellerCache(config.registryAddress, config.cacher.dwellerLifespan);


export default class Friends {
  ethereum: any;
  contract: Contract;

  constructor(address: string) {
    this.ethereum = new Ethereum('window');
    this.contract = this.getContract(address);
  }

  /** @function
   * @name getContract
   * @argument address Address of the DwellerID contract
   * @returns contract instance ready for method execution
   */
  getContract(address: string) {
    let contract: Contract;
    contract = this.ethereum.getContract(FriendsInterface.abi, address);
    return contract;
  }

  // Update Friends cache

  // Update Friend requests recieved cache
  async getRequests(account: string) : Promise<string[]>{
    const requests = await this.contract.methods
      .getRequests()
      .call({
        from: account,
      });
    return requests;
  }

  async getRequest(id: number) {
    const request = await this.contract.methods
      .getRequest(id)
      .call();
    return request;
  }

  async parseRequest(request: any[]) {
    return {
      id: request['id'].toString(),
      active: request['active'],
      accepted: request['accepted'],
      reciever: await dwellerCache.getDweller(request['reciver']),
      sender: await dwellerCache.getDweller(request['sender']),
      threadHash: `${this.ethereum.utils.hexToAscii(request['threadHash1'])}${this.ethereum.utils.hexToAscii(request['threadHash2'])}`,
    }
  }

  // Update Friend requests sent cache
  async getFriends(account: string) {
    const friends = await this.contract.methods
      .getFriends()
      .call({
        from: account,
      });
    return friends;
  }

  async makeRequest(account: string, to: string, hash: string) : Promise<any> {
    return new Promise((resolve) => {
      this.contract.methods.setDwellerName(
        to,
        [
          this.ethereum.fromAscii(hash.substring(0, 28)),
          this.ethereum.fromAscii(hash.substring(28)),
        ],
      )
        .send({
          from: account,
          gas: 4700000,
        })
        .once('transactionHash', resolve);
    });
  }

  async acceptRequest(account: string, id: number) : Promise<any> {
    return new Promise((resolve) => {
      this.contract.methods.acceptRequest(id)
        .send({
          from: account,
          gas: 4700000,
        })
        .once('confirmation', resolve);
    });
  }

  async denyRequest(account: string, id: number) : Promise<any> {
    return new Promise((resolve) => {
      this.contract.methods.acceptRequest(id)
        .send({
          from: account,
          gas: 4700000,
        })
        .once('confirmation', resolve);
    });
  }
}