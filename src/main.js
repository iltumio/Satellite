import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import VueClipboard from 'vue-clipboard2'
import vClickOutside from 'v-click-outside'
import Toasted from 'vue-toasted'
import config from '@/config/config'
import Database from '@/classes/database/Database'
import Threads from '@/classes/database/textile/Threads'
import RemoteStorage from '@/classes/storage/RemoteStorage'
import WebRTC from '@/classes/webrtc/WebRTC'
import Crypto from '@/classes/crypto/Crypto'
import VueI18n from 'vue-i18n'
import VueCurrencyInput from 'vue-currency-input'
import Vue2TouchEvents from 'vue2-touch-events'

import i18nInit from './utils/i18n'
import App from './App'
import router from './router/index'
import store from './store/index'
import Ethereum from './classes/Ethereum'
import StreamManager from './classes/webrtc/StreamManager'
import SoundManager from './classes/SoundManager'
import { SignalingManager } from './classes/webrtc/SignalingManager'
import Particles from 'particles.vue'
import BodyScrollLockDirective from 'v-body-scroll-lock'
import Solana from './classes/Solana'

Vue.config.productionTip = false

Vue.use(VueClipboard)
Vue.use(vClickOutside)
Vue.use(BodyScrollLockDirective)
Vue.use(VueI18n)
Vue.use(Vue2TouchEvents)
Vue.use(Particles)

const pluginOptions = {
  globalOptions: {
    currency: 'USD'
  }
}

Vue.use(VueCurrencyInput, pluginOptions)
Vue.use(Toasted, config.toastNotifications)

sync(store, router)

Vue.prototype.$crypto = new Crypto()
Vue.prototype.$database = new Database('SatelliteData')
Vue.prototype.$Threads = new Threads()
Vue.prototype.$WebRTC = new WebRTC()
Vue.prototype.$pin = null
Vue.prototype.$ethereum = new Ethereum()
Vue.prototype.$sound = new SoundManager()
Vue.prototype.$signalingManager = new SignalingManager()
Vue.prototype.$solana = new Solana()

// Storage 2.0
Vue.prototype.$RemoteStorage = new RemoteStorage()

const constraints = {
  audio: {
    autoGainControl: false,
    channelCount: 2,
    echoCancellation: true,
    latency: 0,
    noiseSuppression: false,
    sampleRate: 96 * 1000,
    sampleSize: 24,
    volume: 1.0
  }
}
Vue.prototype.$streamManager = new StreamManager(constraints)

const i18n = i18nInit('en_US')

const app = new Vue({
  el: '#app',
  functional: true,
  router,
  store,
  i18n,
  render (h) {
    return h(App)
  }
})

// Extend store with Vue context for actions
store.$app = app
