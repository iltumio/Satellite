const defaultState = {
  // Settings
  settings: {
    darkMode: true,
    language: 'en_US',
  },
  // Theme
  theme: 'dark',
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
  web3Stats: false,
  accounts: false,
  gasPrice: 36,
  activeAccount: false,
  balance: 0,
  localAccount: false,
  // Network
  availableProviders: ['MetaMask'],
  selectedProvider: 'MetaMask',
  // Profile
  dwellerAddress: false,
  username: '',
  profilePictureHash: false,
  recentFiles: 0,
  mainRoute: 'main',
  // Friends
  friends: null,
  peerHealth: {},
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
  messages: {},
  typingUsers: {},
  userNotes: {},
  showUser: false,
  // Direct Calling Media Streams
  pendingMediaStream: false,
  activeMediaStreamPeer: false,
  activeCaller: false,
  // Database
  databaseEnabled: true,
  criticalError: false,
};

const createState = customState => Object.assign({}, defaultState, customState);

export default createState;
