import { ethers } from 'ethers';
import Ethereum from '../../classes/Ethereum';
import DwellerCachingHelper from '../../classes/DwellerCachingHelper';
import config from '../../config/config';
// @ts-ignore
import * as FriendsInterface from '@/contracts/build/contracts/Friends.json';

export default class Friends {
  ethereum: Ethereum;
  contract: any;
  dwellerCache: DwellerCachingHelper;
  listener: any;

  constructor(ethereum: Ethereum, address: string) {
    this.ethereum = ethereum;
    this.contract = this.getContract(address);
    this.dwellerCache = new DwellerCachingHelper(
      ethereum,
      config.registryAddress,
      config.cacher.dwellerLifespan,
    );
    this.listener = null;
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
  async getRequests(): Promise<string[]> {
    return this.contract.getRequests();
  }

  /** @function
   * @name getRequest
   * @argument account Address to get friend requests from
   * @returns friend request object
   */
  async getRequest(id: number) {
    return this.contract.getRequest(id);
  }

  /** @function
   * @name parseRequest
   * @argument request request object
   * @returns friend request object
   */
  async parseRequest(request: any) {
    return {
      id: request.id.toString(),
      active: request.active,
      accepted: request.accepted,
      reciever: await this.dwellerCache.getDweller(request.reciver),
      sender: await this.dwellerCache.getDweller(request.sender),
      threadHash: `${ethers.utils.parseBytes32String(request.threadHash1)}${ethers.utils.parseBytes32String(request.threadHash2)}`,
    };
  }

  /** @function
   * @name parseFriend
   * @argument account request array to parse to request object
   * @returns friend request object
   */
  async parseFriend(fr: any) {
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
   * @returns transaction hash
   */
  async makeRequest(to: string): Promise<any> {
    return this.contract
      .makeRequest(to, this.ethereum.getSharablePublicKey(), {
        gasLimit: 300000,
      })
      .then(tx => tx.wait());
  }

  /** @function
   * @name acceptRequest
   * @argument to address of the user that sent the friend request
   * @returns transaction receipt
   */
  async acceptRequest(to: string, hash: string): Promise<any> {
    return this.contract
      .acceptRequest(
        to,
        [
          ethers.utils.formatBytes32String(hash.substring(0, 28)),
          ethers.utils.formatBytes32String(hash.substring(28)),
        ],
        this.ethereum.getSharablePublicKey(),
        { gasLimit: 500000 },
      )
      .then(tx => tx.wait());
  }

  /** @function
   * @name denyRequest
   * @argument to address of the user that sent the friend request
   * @returns transaction receipt
   */
  async denyRequest(to: string): Promise<any> {
    return this.contract
      .denyRequest(to, { gasLimit: 300000 })
      .then(tx => tx.wait());
  }

  /** @function
   * @name startListener
   * @arguments listener listener function
   */
  async startListener(listener: (params: any) => void) {
    const filter = this.contract.filters.FriendRequestSent(this.ethereum.activeAccount);

    this.listener = this.contract.on(filter, listener);
  }

  /** @function
   * @name isListenerStarted
   * @returns a boolean value indicating if the listener has been started
   */
  isListenerStarted(): boolean {
    return Boolean(this.listener);
  }
}
