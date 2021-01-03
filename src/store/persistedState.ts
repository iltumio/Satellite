import createPersistedState from 'vuex-persistedstate';

export const cookieStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: any) => {
    localStorage[key] = value;
  },
  removeItem: (key: string) => delete localStorage[key],
};

export const persistedStateConfig = {
  key: '_vuex',
  filter({ type }) {
    // Don't store route state in cookie
    return !type.startsWith('route/');
  },
  storage: cookieStorage,
};

export default createPersistedState(persistedStateConfig);
