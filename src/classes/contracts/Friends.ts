import { Contract } from "web3-eth-contract";
// @ts-ignore
import * as FriendsInterface from '@/contracts/build/contracts/Friends.json';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';

export class Friends {
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
  async getRequests(account: string) {
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
  // Update Friend requests sent cache
  async getFriends(account: string) {
    const friends = await this.contract.methods
      .getFriends()
      .call({
        from: account,
      });
    return friends;
  }
}