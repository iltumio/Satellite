// @ts-ignore
import * as Server from '@/contracts/build/contracts/Server.json';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';
import IIPFSHash from '../interfaces/IIPFSHash';
import IServer from '../interfaces/IServer';

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

  // TODO: Cache this in the future
  async get(address: string, account: string) : Promise<IServer> {
    const contract = this.getContract(address);
    console.log('contract', contract);
    const server = <IServer>{
      address,
      registry: await contract.methods.registry.call(),
      name: await contract.methods.name.call(),
      channels: await contract.methods.getChannels().call(),
      threadID: await contract.methods.getDBHash().call(),
      members: await contract.methods.getMembers().call(),
      photo: await contract.methods.getPhoto().call(),
      isAdmin: async (address: string) => {
        const admin = await contract.methods.administrators(address).call();
        return admin;
      },
      getChannel: async (id: number) => {
        const channel = await contract.methods.channels(id).call();
        return channel;
      },
      getGroup: async (id: number) => {
        const group = await contract.methods.groups(id).call();
        return group;
      },
      getMember: async (id: number) => {
        const member = await contract.methods.members(id).call();
        return member;
      },
      getMemberStatus: async (address: string) => {
        const memberStatus = await contract.methods.memberStatus(address).call();
        return memberStatus;
      },
      setName: async (name: string) => {
        return contract.methods.setName(
          ethereum.fromAscii(name)
        ).send({
          from: account,
          gas: 4700000,
        });
      },
      setThreadID: async (hash: string) => {
        return contract.methods.setDBHash([
          ethereum.fromAscii(hash.substring(0, 23)),
          ethereum.fromAscii(hash.substring(23)),
        ])
          .send({
            from: account,
            gas: 4700000,
          });
      },
      setPhoto: async (hash: string) => {
        return contract.methods.setPhoto([
          ethereum.fromAscii(hash.substring(0, 23)),
          ethereum.fromAscii(hash.substring(23)),
        ])
          .send({
            from: account,
            gas: 4700000,
          });
      },
      addAdmin: async (address: string) => {
        return contract.methods.addAdmin(address).send({
          from: account,
          gas: 4700000,
        });
      },
      addChannel: async (name: string, type: number) => {
        return contract.methods.addChannel(
          ethereum.fromAscii(name),
          type,
        ).send({
          from: account,
          gas: 4700000,
        });
      },
      addChannelGroup: async (name: string) => {
        return contract.methods.createGroup(
          ethereum.fromAscii(name)
        )
          .send({
            from: account,
            gas: 4700000,
          });
      },
      addChannelToGroup: async (group: string, channel: string) => {
        return contract.methods.createGroup(
          ethereum.fromAscii(group),
          ethereum.fromAscii(channel),
        )
          .send({
            from: account,
            gas: 4700000,
          });
      },
      delChannel: async (id: number) => {
        return contract.methods.delChannel(id)
          .send({
            from: account,
            gas: 4700000,
          });
      },
      delGroup: async (id: number) => {
        return contract.methods.delGroup(id)
          .send({
            from: account,
            gas: 4700000,
          });
      },
      delChannelFromGroup: async (group: string, id: number) => {
        return contract.methods.delChannel(
          ethereum.fromAscii(group),
          id,
        )
          .send({
            from: account,
            gas: 4700000,
          });
      },
      inviteMember: async (address: string) => {
        return contract.methods.inviteMember(address).send({
          from: account,
          gas: 4700000,
        });
      },
    };

    const nil = '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    server.photo = server.photo.substr(0, 48) + server.photo.substr(66, 46);
    if (server.photo !== nil) {
      server.photo = ethereum.utils.hexToAscii(server.photo);
    } else {
      server.photo = '';
    }
    server.threadID = server.threadID.substr(0, 48) + server.threadID.substr(66, 46);
    
    const exemptions = ['registry', 'address', 'photo'];

    Object.keys(server).forEach(key => {
      if (typeof server[key] === 'string' && !exemptions.includes(key)) {
        server[key] = ethereum.utils.hexToAscii(server[key]);
      }
    });

    return server;
  },
};
