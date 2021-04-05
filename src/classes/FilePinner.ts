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

  /** @function
   * Documentation: https://pinata.cloud/documentation#PinByHash
   * @name PinByHash
   * @argument hash File hash to pin
   */
  async PinByHash(hash) {
    const data = { hashToPin: hash };
    const header = this.validateHeader();
    // @ts-ignore
    axios.post('https://api.pinata.cloud/pinning/pinByHash', data, header)
      .then((res) => { /* noop*/ })
      .catch((err) => { throw new Error(err); });
  }

  /** @function
   * Documentation: https://pinata.cloud/documentation#PinFileToIPFS
   * @name PinByFile
   * @argument hash file to pin
   */
  async PinByFile(file) {
    const data = new FormData();
    data.append('file', file);
    const header = this.validateHeader(true);
    // @ts-ignore
    axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, header)
      .then((res) => { /* noop*/ })
      .catch((err) => { throw new Error(err); });
  }

  /** @function
   * Validates if the built header contains a valid keyset or JWT
   * @name PinByFile
   * @argument isFile boolean representing if we're pinning a file, or hash
   */
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
