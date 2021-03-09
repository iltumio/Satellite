module.exports = {
  env: 'prod',
  textile: {
    localURI: 'http://localhost:6007',
    key: 'bgvdqnp2feitbyvyfsrd5dceuvm',
    browser: 'https://hub.textile.io',
  },
  network: {
    // explorer: 'https://goerli.etherscan.io',
    // api: 'http://api-goerli.etherscan.io/api',
    chain: 'mumbai',
  },
  ipfs: {
    browser: 'https://ipfs.io/ipfs/',
  },
  sounds: {
    newMessage: 'QmSiBzertJJx1K4VXapLat5Vk3AKa7efviVjt6qxqhq6n3',
    call: 'QmRdxeQF53abUesaFC8qmoNJ5FLS8LBuSyCmcXT5VhuKSm',
    hangup: 'QmWrRi5tdKZy3iqcR8mum9hFBbZ8qgvekhEM3Y4PD1TK28',
    mute: 'QmVk362FGmwfsXBj5zMv4x1Hp7Mp9RbYDMxsDXRAx5vyUo',
    unmute: 'QmWxv18LqpcaMhXVd1BLm9z9k1MfWDNexJ22dC6vLkdyro',
    deafen: 'Qmf4QinBSDk9AgvqsiaaZ2ZmhCfTwcSRpAgSCTxLGyZkyg',
    undeafen: 'QmSHtz5kSvX8JNZKMfkm6PjqScxoC864bmGd2g3ycwRqK1',
    upload: 'QmSHtz5kSvX8JNZKMfkm6PjqScxoC864bmGd2g3ycwRqK1',
    connected: 'QmUJMTmCdnzjcUT5nT2eGzXVDYbwDq3CanjKabYQ3Vu3Dt',
  },
  defaultLanguage: 'en_US',
  languages: {
    en_UK: '',
    hi: '',
    de: 'QmeBfYw5esSbRR63cV1qi1iV5FfgvAe93FAHNeKfqWEnrR',
    fr: '',
    it: 'QmSezaqPeAhsjekzNS3xChGw7G5N4GYCuYAqYkkGZgxneu',
    ru: '',
    hy: '',
  },
  registry: {
    mainnet: '0x0',
    goerli: '0xfA22498c3F2bc836d9347F2e8c718E7820eAb308',
    mumbai: '0x6ef1fcb3a695d962B97C2012D3B831356C199ebF',
  },
  friends: {
    mainnet: '0x0',
    goerli: '0xd1d99a34Bdb6e2c3d199dd39Fe1B011Ee633D824',
    mumbai: '0x27F7DF4f1af2D61FE815901ad456dFf3355Ca9c3',
  },
  debug: false,
  cacher: {
    dwellerLifespan: 900000,
  },
  polling: {
    friends: 10000,
    requests: 10000,
  },
  peer: {
    network: {
      prod: {
        secure: true,
        host: '0.vault74.io',
        port: 443,
        path: '/',
        key: 'vault74',
        iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
      },
      dev: {
        secure: false,
        host: '0.vault74.io',
        port: 80,
        path: '/',
        key: 'vault74',
        iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
      },
    },
    heartbeat_timeout: 7000,
    check_heartbeat: 500,
    timeout: 500,
    reconnect: 3000,
    ping_interval: 5000,
  },
  web3: {
    balance_polling_interval: 10000,
  },
  toastNotifications: {
    position: 'top-center', iconPack: 'fontawesome', duration: 800, className: 'vault-toast',
  },
};
