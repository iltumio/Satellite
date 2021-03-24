import * as axios from 'axios'

export default class FilePinner {
  jwt: string|null;
  pubKey: string|null;
  privKey: string|null;

  constructor(jwt: string|null = null, pubKey: string|null = null, privKey: string|null = null) {
    this.jwt = jwt;
    this.pubKey = pubKey;
    this.privKey = privKey;
  }

  // Documentation: https://pinata.cloud/documentation#PinByHash
  async PinByHash(hash) {
    const data = { hashToPin: hash };
    const header = this.validateHeader();
    // @ts-ignore
    axios.post('https://api.pinata.cloud/pinning/pinByHash', data, header)
      .then((res) => { console.log(res); })
      .catch((err) => { throw new Error(err); });
  }

  // Documentation: https://pinata.cloud/documentation#PinFileToIPFS
  async PinByFile(file) {
    const data = new FormData();
    data.append('file', file);
    const header = this.validateHeader(true);
    // @ts-ignore
    axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, header)
      .then((res) => { console.log(res); })
      .catch((err) => { throw new Error(err); });
  }

  validateHeader(isFile = false) {
    const pinataHeader = { headers: {} };
    // @ts-ignore
    if (isFile) { pinataHeader.maxBodyLength = 'Infinity'; }
    if (this.jwt) {
      pinataHeader.headers = { Authorization: `Bearer ${this.jwt}` };
    } else if (this.pubKey && this.privKey) {
      pinataHeader.headers = {
        pinata_api_key: this.pubKey,
        pinata_secret_api_key: this.privKey,
      };
    } else {
      throw new Error('FilePinner Error: No Public/Private keyset or JWT found on object ' +
      '(Make sure these are passed to the object on instantiation)');
    }
    return pinataHeader;
  }
}
