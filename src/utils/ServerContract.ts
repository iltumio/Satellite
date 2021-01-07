// @ts-ignore
import * as Server from '@/contracts/build/contracts/Server.json';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';
import IIPFSHash from '../interfaces/IIPFSHash';

const ethereum = new Ethereum('window');
// useful methods to interact with the DwellerID contract
export default {
  /** @function
   * @name getContract
   * @argument address Address of the Server contract
   * @returns contract instance ready for method execution
   */
  getContract(address: string) {
    const contract = ethereum.getContract(Server.abi, address);
    contract.options.data = Server.bytecode.object;
    return contract;
  },

  /** @function
   * @name setPhoto
   * @argument address Address of the Server contract
   * @argument account account to use for the transaction
   * @argument ipfsHash hash referencing the inital server icon
   * @argument done callback which will be called on the first TX & confirm.
   * @returns server payload which contains all information about the dweller
   */
  async setPhoto(address: string, account: string, ipfsHash: IIPFSHash, done: CallableFunction) {
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
};
