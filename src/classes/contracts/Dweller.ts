//@ts-ignore
import DwellerContract from '../../utils/contracts/DwellerContract';

export default class Dweller {
  contractAddress: string;
  photoHash: any;
  owner: any;
  name: any;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
  }

  async getPhoto() {
    this.photoHash = await DwellerContract.getPhotoAsync(this.contractAddress);
    return this.photoHash;
  }

  async getOwner() {
    this.owner = await DwellerContract.getDwellerAddress(this.contractAddress);
    return this.owner;
  }

  async getName() {
    this.name = await DwellerContract.getDwellerName(this.contractAddress);
    return this.name;
  }

  async getCachedInfo() {
    const photoHash = this.photoHash || await this.getPhoto();
    const owner = this.owner || await this.getOwner();
    const name = this.name || await this.getName();
    return {
      photoHash,
      owner,
      name,
    };
  }
}
