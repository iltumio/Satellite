import { ethers } from 'ethers';
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
  contract: any;

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
    return this.ethereum.getContract(FriendsInterface.abi, address);
  }

  /** @function
   * @name getRequests
   * @argument account Address to get friend requests from
   * @returns array of friend request IDs
   */
  async getRequests() : Promise<string[]> {
    return this.contract.getRequests();
  }

  /** @function
   * @name getRequest
   * @argument account Address to get friend requests from
   * @returns friend request object
   */
  async getRequest(id: number) {
    return this.contract
      .getRequest(id);
  }

  /** @function
   * @name parseRequest
   * @argument request request object
   * @returns friend request object
   */
  async parseRequest(request: any) {
    console.log(this);
    return {
      id: request.id.toString(),
      active: request.active,
      accepted: request.accepted,
      reciever: await dwellerCache.getDweller(request.reciver),
      sender: await dwellerCache.getDweller(request.sender),
      threadHash: `${ethers.utils.parseBytes32String(request.threadHash1)}${ethers.utils.parseBytes32String(request.threadHash2)}`,
    };
  }


  /** @function
   * @name parseFriend
   * @argument account request array to parse to request object
   * @returns friend request object
   */
  async parseFriend(fr: any) {
    console.log(this);
    return {
      id: fr,
      threadHash: `${ethers.utils.parseBytes32String(fr.threadHash1)}${ethers.utils.parseBytes32String(fr.threadHash2)}`,
    };
  }

  /** @function
   * @name getFriends
   * @returns friend request object
   */
  async getFriends() {
    return this.contract.getFriends();
  }

  /** @function
   * @name makeRequest
   * @argument to account to send the request to
   * @argument hash threadID for the friend group
   * @returns transaction hash
   */
  async makeRequest(to: string, hash: string) : Promise<any> {
    return this.contract.makeRequest(
      to,
      [
        ethers.utils.formatBytes32String(hash.substring(0, 28)),
        this.ethereum.formatBytes32String(hash.substring(28)),
      ],
      { gas: 4700000 },
    ).then(tx => tx.wait());
  }

  /** @function
   * @name acceptRequest
   * @argument id friend request identifier to accept
   * @returns transaction hash
   */
  async acceptRequest(id: number) : Promise<any> {
    return this.contract.acceptRequest(id, {
      gas: 4700000,
    }).then(tx => tx.wait());
  }

  /** @function
   * @name denyRequest
   * @argument id friend request identifier to deny
   * @returns transaction hash
   */
  async denyRequest(id: number) : Promise<any> {
    return this.contract.acceptRequest(id, {
      gas: 4700000,
    }).then(tx => tx.wait());
  }
}
