import { ethers } from 'ethers';
import Ethereum from '../../classes/Ethereum';
import DwellerCachingHelper from '../../classes/DwellerCachingHelper';
import config from '../../config/config';
// @ts-ignore
import * as FriendsInterface from '@/contracts/build/contracts/Friends.json';

enum FriendsEvents {
  FriendRequestSent = 'FriendRequestSent',
  FriendRequestDenied = 'FriendRequestDenied',
  FriendRequestAccepted = 'FriendRequestAccepted'
};

export default class Friends {
  ethereum: Ethereum;
  contract: any;
  dwellerCache: DwellerCachingHelper;
  listeners: {[key: string]: (params: any)=>void};

  constructor(ethereum: Ethereum, address: string) {
    this.ethereum = ethereum;
    this.contract = this.getContract(address);
    this.dwellerCache = new DwellerCachingHelper(
      ethereum,
      config.registryAddress,
      config.cacher.dwellerLifespan,
    );
    this.listeners = {};
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
  async startAllListeners(listener: (eventName: FriendsEvents, params: any) => void) {
    // Listen for new incoming friends request
    if(!this.listeners[FriendsEvents.FriendRequestSent]){
      const filter = this.contract.filters.FriendRequestSent(this.ethereum.activeAccount);
      this.contract.on(filter, (data: any)=>{
        listener(FriendsEvents.FriendRequestSent, data);
      });
    } else {
      console.warn(FriendsEvents.FriendRequestSent, 'Listener for incoming friends request already started');
    }

    // Listen for accepted friends requests
    if(!this.listeners[FriendsEvents.FriendRequestAccepted]){
      const filter = this.contract.filters.FriendRequestAccepted(this.ethereum.activeAccount);
      this.contract.on(filter, (data: any)=>{
        listener(FriendsEvents.FriendRequestAccepted, data);
      });
    } else {
      console.warn(FriendsEvents.FriendRequestAccepted, 'Listener for incoming friends request already started');
    }

    // Listen for accepted friends requests
    if(!this.listeners[FriendsEvents.FriendRequestDenied]){
      const filter = this.contract.filters.FriendRequestDenied(this.ethereum.activeAccount);
      this.contract.on(filter, (data: any)=>{
        listener(FriendsEvents.FriendRequestDenied, data);
      });
    } else {
      console.warn(FriendsEvents.FriendRequestDenied, 'Listener for incoming friends request already started');
    }
  }

  /** @function
   * @name isListenerStarted
   * @returns a boolean value indicating if the listener has been started
   */
  isListenerStarted(event: FriendsEvents): boolean {
    return Boolean(this.listeners[event]);
  }

  /** @function
   * @name removeFriend
   * @argument friend Friends DwellerID address
   * @returns transaction hash
   */
  async removeFriend(friend: string): Promise<any> {
    return this.contract.removeFriend( friend, { gasLimit: 300000 }).then(tx => tx.wait());
  }
}
