import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import VueClipboard from 'vue-clipboard2';
import vClickOutside from 'v-click-outside';
import config from '@/config/config';
import Database from '@/classes/database/Database.ts';
import VueI18n from 'vue-i18n';

import i18nInit from './utils/i18n';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueClipboard);
Vue.use(vClickOutside);
Vue.use(VueI18n);

sync(store, router);

window.Vault74 = {
  debugEnabled: config.debug,
  /* eslint-disable */
  debug: (...args) => {
    if (window.Vault74.debugEnabled) {
      // eslint-disable-next-line no-console
      console.log(
        `%c [Vault74 Debug]: ${args[0]}`,
        "color: #9b59b6; font-weight: bold; font-family: 'Major Mono Display', monospace;",
        ...args.slice(1, args.length)
      );
    }
  },
  warn: (...args) => {
    if (window.Vault74.debugEnabled) {
      // eslint-disable-next-line no-console
      console.log(
        `%c [Vault74 Warn]: ${args[0]}`,
        "color: #e67e22; font-weight: bold; font-family: 'Major Mono Display', monospace;",
        ...args.slice(1, args.length)
      );
    }
  },
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.log(
      `%c [Vault74 Error]: ${args[0]}`,
      "color: #e74c3c; font-weight: bold; font-family: 'Major Mono Display', monospace;",
      ...args.slice(1, args.length)
    );
  },
  /* eslint-enable */
};

Vue.prototype.$database = new Database('Vault74Data');
Vue.prototype.$pin = null;

const i18n = i18nInit('en_US');

/* eslint-disable */
new Vue({
  el: '#app',
  functional: true,
  router,
  store,
  i18n,
  render(h) {
    return h(App);
  },
});
/* eslint-enable */
