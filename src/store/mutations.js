import MessageUtils from '@/utils/MessageUtils';
import files from './mutations/files';
import friends from './mutations/friends';

export default {
  ...friends,
  ...files,
  clearTypingUsers(state) {
    // eslint-disable-next-line
    state.typingUsers = {};
  },
  muted(state, muted) {
    // eslint-disable-next-line no-param-reassign
    state.muted = muted;
  },
  deafened(state, deafened) {
    // eslint-disable-next-line no-param-reassign
    state.deafened = deafened;
  },
  screenShareRequest(state) {
    // eslint-disable-next-line
    state.screenShareRequest = Date.now();
  },
  // Used to set a specific setting in key vaule storage
  // only do this from the settings page components
  setSetting(state, key, value) {
    // eslint-disable-next-line no-param-reassign
    state.settings[key] = value;
  },
  // Used to hotswitch dark mode from anywhere in the app
  toggleDarkMode(state) {
    // eslint-disable-next-line no-param-reassign
    state.settings.darkMode = !state.settings.darkMode;
  },
  toggleSidebar(state) {
    // eslint-disable-next-line
    state.sidebarOpen = !state.sidebarOpen;
  },
  activeChat(state, address) {
    // eslint-disable-next-line no-param-reassign
    state.activeChat = address;
  },
  // Called when web3 updates
  web3Stats(state, stats) {
    // eslint-disable-next-line no-param-reassign
    state.web3Stats = stats;
  },
  // Update the accounts provided from the web3 provider
  accounts(state, accounts) {
    // eslint-disable-next-line no-param-reassign
    state.accounts = accounts;
  },
  // Update the default account we should use for transactions
  defaultAccount(state) {
    // eslint-disable-next-line no-param-reassign
    state.activeAccount = state.activeAccount || state.accounts[0];
    if (!state.accounts.includes(state.activeAccount)) {
      // Detect account changes
      // eslint-disable-next-line no-param-reassign
      [state.activeAccount] = state.accounts;
    }
  },
  // Update the balance of the active web3 account
  balance(state, balance) {
    // eslint-disable-next-line no-param-reassign
    state.balance = balance;
  },
  // Update the dweller address used for profile information
  dwellerAddress(state, address) {
    // eslint-disable-next-line no-param-reassign
    state.dwellerAddress = address;
  },
  // Updates the username for the authenticated user
  username(state, username) {
    // eslint-disable-next-line no-param-reassign
    state.username = username;
  },
  // Updates the profile picture hash for the authenticated user
  profilePictureHash(state, hash) {
    // eslint-disable-next-line no-param-reassign
    state.profilePictureHash = hash;
  },
  // Change the mian route of the application
  changeRoute(state, route) {
    // eslint-disable-next-line no-param-reassign
    state.mainRoute = route;
  },
  // Set the audio device
  setAudioDevice(state, device) {
    // eslint-disable-next-line no-param-reassign
    state.audioDevice = device;
  },
  // Set the audio device
  setVideoDevice(state, device) {
    // eslint-disable-next-line no-param-reassign
    state.videoDevice = device;
  },
  // Update the application status
  setStatus(state, status) {
    // eslint-disable-next-line no-param-reassign
    state.status = status;
  },
  criticalError(state, err) {
    // eslint-disable-next-line no-param-reassign
    state.criticalError = err;
  },
  // Update a peers status
  peerHealth(state, data) {
    const [id, status] = data;
    const friend = state.friends ? state.friends.filter(f => f.address === id)[0] : null;
    if (friend) {
      const withoutFriend = state.friends.filter(f => f.address !== id);
      friend.status = status;
      withoutFriend.push(friend);
      // eslint-disable-next-line
      withoutFriend.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
      // eslint-disable-next-line no-param-reassign
      state.friends = withoutFriend;
    }
  },
  // Update p2p handshake server status
  ICEConnected(state, status) {
    // eslint-disable-next-line no-param-reassign
    state.p2pOnline = status;
  },
  // Create a new active chat
  newChat(state, clientId) {
    const { activeChats } = state;
    if (!activeChats.includes(clientId)) {
      activeChats.unshift(clientId);
    }
    // eslint-disable-next-line no-param-reassign
    state.activeChats = activeChats;
  },
  // eslint-disable-next-line
  chatWith(state, address) {
    const { activeChats } = state;
    const filteredOutAddy = activeChats.filter(a => a !== address);
    filteredOutAddy.unshift(address);
    // eslint-disable-next-line
    state.activeChats = filteredOutAddy;
  },
  userTyping(state, payload) {
    // eslint-disable-next-line
    state.typingUsers[payload[0]] = payload[1];
  },
  // Group messages by sender for cleanliness.
  updateMessages(state, messages) {
    // eslint-disable-next-line no-param-reassign
    state.messages = MessageUtils.group(messages);
  },
  connectMediaStream(state, peer) {
    // eslint-disable-next-line no-param-reassign
    state.activeMediaStreamPeer = peer;
    // eslint-disable-next-line no-param-reassign
    state.pendingMediaStream = true;
  },
  activeCaller(state, caller) {
    // eslint-disable-next-line no-param-reassign
    state.activeCaller = caller;
  },
  toggleUserInfo(state) {
    // eslint-disable-next-line
    state.showUser = !state.showUser;
  },
  localAccount(state) {
    // eslint-disable-next-line
    state.localAccount = true;
  },
  setLanguage(state, lang) {
    // eslint-disable-next-line
    state.language = lang;
  },
  clear(state) {
    // eslint-disable-next-line no-param-reassign
    state.criticalError = false;
  },
};
