import files from './mutations/files';
import friends from './mutations/friends';
import ui from './mutations/ui';
import media from './mutations/media';
import messaging from './mutations/messaging';
import peer from './mutations/peer';
import account from './mutations/account';
import server from './mutations/server';
import group from './mutations/group';
import web3 from './mutations/web3';
import stickers from './mutations/stickersMutations';
import wallet from "./mutations/wallet";
import commands from "./mutations/commands";

export default {
  ...friends,
  ...files,
  ...ui,
  ...media,
  ...messaging,
  ...peer,
  ...account,
  ...server,
  ...group,
  ...web3,
  ...stickers,
  ...wallet,
  ...commands,
  screenShareRequest(state: any) {
    // eslint-disable-next-line
    state.screenShareRequest = Date.now();
  },
  // Used to set a specific setting in key vaule storage
  // only do this from the settings page components
  setSetting(state: any, key: string, value: string) {
    
    state.settings[key] = value;
  },
  // Called when web3 updates
  web3Stats(state: any, stats: object) {
    
    state.web3Stats = stats;
  },
  criticalError(state: any, err: string) {
    
    state.criticalError = err;
  },
  clear(state: any) {
    
    state.buckets = false;
    state.authenticated = false;
    state.criticalError = false;
    state.ICEConnected = false;
    state.dwellerAddress = false;
    state.activeCalls = [];
    state.incomingCall = null;
  },
  setLanguage(state, lang) {
    // eslint-disable-next-line
    state.settings.language = lang;
  },
  starting(state, isStarting) {
    // eslint-disable-next-line
    state.starting = isStarting;
  },
  setPin(state, pin) {
    state.pin = pin;
  },
};
