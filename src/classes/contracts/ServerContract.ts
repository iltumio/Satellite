import { ethers } from 'ethers'
import Ethereum from '../../classes/Ethereum'
import IIPFSHash from '../../interfaces/IIPFSHash'
import IServer from '../../interfaces/IServer'
// @ts-ignore
import * as ServerInterface from '@/contracts/build/contracts/Server.json'
export default class Server {
  ethereum: any
  contract: ethers.Contract
  bytecode: any

  constructor (ethereum: typeof Ethereum, address: string) {
    this.ethereum = ethereum
    this.contract = this.getContract(address)
    this.bytecode = ServerInterface.bytecode.object
  }

  /** @function
   * @name getContract
   * @argument address Address of the DwellerID contract
   * @returns contract instance ready for method execution
   */
  getContract (address: string) {
    return this.ethereum.getContract(ServerInterface.abi, address)
  }

  /** @function
   * @name setPhoto
   * @argument address Address of the Server contract
   * @argument account account to use for the transaction
   * @argument ipfsHash hash referencing the inital server icon
   * @argument done callback which will be called on the first TX & confirm.
   * @returns server payload which contains all information about the dweller
   */
  async setPhoto (ipfsHash: IIPFSHash, done: CallableFunction) {
    this.contract
      .setPhoto(
        [
          ethers.utils.formatBytes32String(ipfsHash.path.substring(0, 23)),
          ethers.utils.formatBytes32String(ipfsHash.path.substring(23))
        ],
        {
          gasLimit: 4700000
        }
      )
      .then(tx => tx.wait())
      .then(done)
  }

  // TODO: Cache this in the future
  async get (address: string): Promise<IServer> {
    const server = <IServer>{
      address,
      registry: await this.contract.registry(),
      name: ethers.utils.parseBytes32String(await this.contract.name()),
      channels: await this.contract.getChannels(),
      threadID: await this.contract.getDBHash(),
      members: await this.contract.getMembers(),
      photo: await this.contract.getPhoto(),
      isAdmin: async (address: string) => {
        return this.contract.administrators(address)
      },
      getChannel: async (id: number) => {
        return this.contract.channels(id)
      },
      getGroup: async (id: number) => {
        return this.contract.groups(id)
      },
      getMember: async (id: number) => {
        return this.contract.members(id)
      },
      getMemberStatus: async (address: string) => {
        return this.contract.memberStatus(address)
      },
      setName: async (name: string) => {
        return this.contract.setName(ethers.utils.formatBytes32String(name), {
          gasLimit: 4700000
        })
      },
      setThreadID: async (hash: string) => {
        return this.contract.setDBHash(
          [
            ethers.utils.formatBytes32String(hash.substring(0, 23)),
            ethers.utils.formatBytes32String(hash.substring(23))
          ],
          {
            gasLimit: 4700000
          }
        )
      },
      setPhoto: async (hash: string) => {
        return this.contract.setPhoto(
          [
            ethers.utils.formatBytes32String(hash.substring(0, 23)),
            ethers.utils.formatBytes32String(hash.substring(23))
          ],
          {
            gasLimit: 4700000
          }
        )
      },
      addAdmin: async (address: string) => {
        return this.contract.addAdmin(address, {
          gasLimit: 4700000
        })
      },
      addChannel: async (name: string, type: number) => {
        return this.contract.addChannel(
          ethers.utils.formatBytes32String(name),
          type,
          {
            gasLimit: 4700000
          }
        )
      },
      addChannelGroup: async (name: string) => {
        return this.contract.createGroup(
          ethers.utils.formatBytes32String(name),
          {
            gasLimit: 4700000
          }
        )
      },
      addChannelToGroup: async (group: string, channel: string) => {
        return this.contract.createGroup(
          ethers.utils.formatBytes32String(group),
          ethers.utils.formatBytes32String(channel),
          {
            gasLimit: 4700000
          }
        )
      },
      delChannel: async (id: number) => {
        return this.contract.delChannel(id, {
          gasLimit: 4700000
        })
      },
      delGroup: async (id: number) => {
        return this.contract.delGroup(id, {
          gasLimit: 4700000
        })
      },
      delChannelFromGroup: async (group: string, id: number) => {
        return this.contract.delChannel(
          ethers.utils.formatBytes32String(group),
          id,
          {
            gasLimit: 4700000
          }
        )
      },
      inviteMember: async (address: string) => {
        return this.contract.inviteMember(address, {
          gasLimit: 4700000
        })
      }
    }

    const nil =
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

    if (server.photo !== nil) {
      const sliced = server.photo.slice(2)
      const firstHalf = sliced.substr(0, 64)
      const secondHalf = sliced.substr(64, 128)
      server.photo =
        ethers.utils.parseBytes32String(`0x${firstHalf}`) +
        ethers.utils.parseBytes32String(`0x${secondHalf}`)
    } else {
      server.photo = ''
    }

    // TODO: check threadID
    server.threadID =
      server.threadID.substr(0, 48) + server.threadID.substr(66, 46)

    return server
  }
}
