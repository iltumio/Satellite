import createPersistedState from 'vuex-persistedstate';
import { defaultState } from './createState';

export const cookieStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: any) => {
    localStorage[key] = value;
  },
  removeItem: (key: string) => delete localStorage[key],
};

interface IBlacklist {
  [key: string]: boolean;
}

const blacklist: IBlacklist = {
  web3connected: true,
  injectedProvider: true,
};

const persistedPaths = Object.keys(defaultState).filter(key => !blacklist[key]);

export const persistedStateConfig = {
  key: '_vuex',
  filter({ type }) {
    // Don't store route state in cookie
    return !type.startsWith('route/');
  },
  paths: persistedPaths,
  storage: cookieStorage,
};

export default createPersistedState(persistedStateConfig);
