import { AvailableProviders } from './mutations/web3';

export const defaultState = {
  starting: true,
  authenticated: false,
  buckets: false,
  // Settings
  settings: {
    darkMode: true,
    language: 'en_US',
  },
  // Theme
  theme: 'tokyo',
  // Screen Share
  screenShareRequest: null,
  captureMouse: 'always',
  // Audio
  audioQuality: 96,
  audioSamples: 24,
  noiseSuppression: false,
  echoCancellation: false,
  muted: false,
  deafened: false,
  // Web3
  web3connected: false,
  web3Stats: false,
  accounts: false,
  gasPrice: 36,
  activeAccount: false,
  balance: 0,
  localAccount: false,
  mnemonic: '',
  // Network
  availableProviders: [AvailableProviders.VAULT_74],
  selectedProvider: null,
  injectedProvider: null,
  // Profile
  dwellerAddress: false,
  username: '',
  profilePictureHash: false,
  files: [],
  mainRoute: 'main',
  // Friends
  friends: null,
  friendRequests: [],
  peerHealth: {},
  unreads: [],
  // Audio Video
  audioDevice: 'Default Microphone',
  videoDevice: 'Default Webcam',
  // Internal
  status: 'Alive',
  p2pOnline: false,
  sidebarOpen: true,
  // Chat
  activeChats: [],
  activeChat: false,
  messages: [],
  typingUsers: {},
  userNotes: {},
  showUser: false,
  loadingMessages: false,
  // Direct Calling Media Streams
  pendingMediaStream: false,
  activeMediaStreamPeer: false,
  incomingCall: false,
  activeCall: false,
  // Database
  databaseEnabled: true,
  criticalError: false,
};


const createState = (customState: object) => Object.assign({}, defaultState, customState);

export default createState;
