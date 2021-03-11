import { AvailableProviders } from './mutations/web3';

interface ISettings {
  darkMode: boolean;
  language: 'en_US';
}

type ThemeName = 'tokyo';

export interface IState {
  starting: boolean;
  authenticated: boolean;
  buckets: boolean;
  // Settings
  settings: ISettings;
  // Theme
  theme: ThemeName;
  // Screen Share
  screenShareRequest: null;
  captureMouse: 'always';
  // Audio
  audioQuality: number;
  audioSamples: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  muted: boolean;
  deafened: boolean;
  // Web3
  web3connected: boolean;
  web3Stats: any;
  accounts?: Array<any>;
  gasPrice: number;
  activeAccount?: string;
  balance: number;
  balanceLastUpdate?: number;
  localAccount: boolean;
  mnemonic: string;
  // Network
  availableProviders: Array<any>;
  selectedProvider: any;
  injectedProvider: any;
  // Profile
  dwellerAddress?: string;
  username: string;
  profilePictureHash?: string;
  files: Array<any>;
  mainRoute: string;
  // Friends
  friendsLoaded?: boolean;
  friends?: Array<any>;
  friendRequests?: Array<any>;
  peerHealth: any;
  unreads: Array<any>;
  // Audio Video
  audioDevice: string;
  videoDevice: string;
  // Internal
  status: string;
  p2pOnline: any;
  sidebarOpen: boolean;
  sidebarMobileOpen: boolean;
  // Chat
  activeChats: Array<any>;
  activeChat: any;
  messages: Array<any>;
  typingUsers: any;
  userNotes: any;
  showUser: boolean;
  loadingMessages: boolean;
  // Direct Calling Media Streams
  pendingMediaStream?: any;
  activeMediaStreamPeer?: any;
  incomingCall?: any;
  activeCall?: any;
  // Database
  databaseEnabled: boolean;
  criticalError?: any;
  // Servers
  server?: Array<any>;
  channel?: any;
}

export const defaultState: IState = {
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
  // accounts: false, // undefined at first load
  gasPrice: 36,
  // activeAccount: false, // undefined at first load
  balance: 0,
  localAccount: false,
  mnemonic: '',
  // Network
  availableProviders: [AvailableProviders.SATELLITE],
  selectedProvider: null,
  injectedProvider: null,
  // Profile
  // dwellerAddress: false, // undefined at first load
  username: '',
  // profilePictureHash: false, // undefined at first load
  files: [],
  mainRoute: 'main',
  // Friends
  // friends: null, // undefined at first load
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
  sidebarMobileOpen: false,
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
  // Servers
  // server: false, // undefined at first load
  // channel: false, // undefined at first load
};

const createState = (customState: any): IState => Object.assign({}, defaultState, customState);

export default createState;
