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

  /** @function
   * @name getRequests
   * @argument account Address to get friend requests from
   * @returns array of friend request IDs
   */
  async getRequests(account: string) : Promise<string[]>{
    const requests = await this.contract.methods
      .getRequests()
      .call({
        from: account,
      });
    return requests;
  }

  /** @function
   * @name getRequest
   * @argument account Address to get friend requests from
   * @returns friend request object
   */
  async getRequest(id: number) {
    const request = await this.contract.methods
      .getRequest(id)
      .call();
    return request;
  }

  /** @function
   * @name parseRequest
   * @argument account request array to parse to request object
   * @returns friend request object
   */
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


  /** @function
   * @name parseFriend
   * @argument account request array to parse to request object
   * @returns friend request object
   */
  async parseFriend(fr: any[]) {
    return {
      id: fr[0],
      threadHash: `${this.ethereum.utils.hexToAscii(fr['threadHash1'])}${this.ethereum.utils.hexToAscii(fr['threadHash2'])}`,
    }
  }

  /** @function
   * @name getFriends
   * @argument account account to get friends from
   * @returns friend request object
   */
  async getFriends(account: string) {
    const friends = await this.contract.methods
      .getFriends()
      .call({
        from: account,
      });
    return friends;
  }

  /** @function
   * @name makeRequest
   * @argument account account to send request from
   * @argument to account to send the request to
   * @argument hash threadID for the friend group
   * @returns transaction hash
   */
  async makeRequest(account: string, to: string, hash: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.makeRequest(
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
        .once('confirmation', resolve)
        .on('error', reject);
    });
  }

  /** @function
   * @name acceptRequest
   * @argument account account to accept friend request on behalf of
   * @argument id friend request identifier to accept
   * @returns transaction hash
   */
  async acceptRequest(account: string, id: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.acceptRequest(id)
        .send({
          from: account,
          gas: 4700000,
        })
        .once('confirmation', resolve)
        .on('error', reject);
    });
  }

  /** @function
   * @name denyRequest
   * @argument account account to deny friend request on behalf of
   * @argument id friend request identifier to deny
   * @returns transaction hash
   */
  async denyRequest(account: string, id: number) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.acceptRequest(id)
        .send({
          from: account,
          gas: 4700000,
        })
        .once('confirmation', resolve)
        .on('error', reject);
    });
  }
}