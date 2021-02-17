// @ts-ignore
import config from '@/config/config';
// @ts-ignore
import Ethereum from '@/classes/Ethereum';
import Registry from '../utils/contracts/Registry';
import DwellerContract from '../utils/contracts/DwellerContract';
import IDweller from '../interfaces/IDweller';

const ethereum = new Ethereum('user-provided');

/**
 * Class representing a caching helper.
 * @class DwellerCachingHelper
 * @augments registryAddress Address to the on chain contract of the registry
 * @augments expiry how long should dwellers last in the cache
 */
export default class DwellerCachingHelper {
  expiry: number;
  cache: any;
  registryAddress: string;
  /**
   * @constructs DwellerCachingHelper
   * @augments registryAddress Address to the on chain contract of the registry
   * @augments expiry how long should dwellers last in the cache
   */
  constructor(registryAddress: string, expiry: number = 86000) {
    this.expiry = expiry;
    const localCache = localStorage.getItem('vault74.dwellerCache') || false;
    this.cache = localCache ? JSON.parse(localCache) : {};
    this.registryAddress = registryAddress;
  }

  /** @function
   * If the dweller exists in the cache and
   * is not expired, send it over to save time
   * @name getDwellerFromCache
   * @argument address Address of the dweller to fetch
   * @returns the dweller from the local cache, or false if there is no valid dweller
   */
  getDwellerFromCache(address: string) {
    const dweller = this.cache[address];
    if (!dweller) return false;
    if (dweller.expiry < Date.now()) return false;

    return dweller;
  }

  /** @function
   * @name getDweller
   * @argument address Address of the dweller to fetch
   * @returns the dweller from the local cache, or on chain
   */
  async getDweller(address: string) {
    let dweller = this.getDwellerFromCache(address);
    if (dweller) {
      this.updateDweller(address);
      return dweller;
    }
    dweller = await this.updateDweller(address);
    return dweller;
  }

  /** @function
   * @name updateDweller
   * Local method to update the cache with new info from the dweller
   * @argument address Address of the dweller to update
   * @returns the dweller from the chain
   */
  async updateDweller(address: string) : Promise<IDweller | null> {
    let dweller : any;
    const dwellerIDAddress = await Registry.getDwellerContract(address);
    if (dwellerIDAddress === '0x0000000000000000000000000000000000000000') return null;
    dweller = {
      name: await DwellerContract.getDwellerName(dwellerIDAddress),
      photo: await DwellerContract.getPhotoAsync(dwellerIDAddress),
      address,
      expiry: Date.now() + this.expiry,
    };
    dweller = {
      ...dweller,
      photo: `${config.ipfs.browser}${dweller.photo}`,
      name: ethereum.utils.hexToString(dweller.name),
    };
    this.cache[address] = dweller;
    this.updateCache();
    return dweller;
  }

  /** @function
   * Update the localstorage cache for the entire list of dwellers
   * @name updateCache
   */
  updateCache() {
    localStorage.setItem('vault74.dwellerCache', JSON.stringify(this.cache));
  }
}
