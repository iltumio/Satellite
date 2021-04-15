module.exports = {
  env: 'prod',
  textile: {
    localURI: 'http://localhost:6007',
    key: 'bfeimum7iu45o2inmxcip64pdvu',
    browser: 'https://hub.textile.io'
  },
  network: {
    // explorer: 'https://goerli.etherscan.io',
    // api: 'http://api-goerli.etherscan.io/api',
    chain: 'mumbai'
  },
  ipfs: {
    browser: 'https://ipfs.io/ipfs/'
  },
  pinata: {
    // eslint-disable-next-line max-len
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4NDZkOGUwNi1jZTYwLTQ4NzgtOWE1Ni1hNTMwODc2MTRkZDQiLCJlbWFpbCI6Im1hdHQud2lzbmlld3NraUBqYWNrZXRyaXZlci5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlfSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZmFhZTA3NDgxYmE1OGM0ZDc5YTgiLCJzY29wZWRLZXlTZWNyZXQiOiI0YmQzMmI0YmE5YTI2ZTZlYjJkYzRlOTFkYjFlZTZmNGQzZGJlNjlhY2UyNDkzMzYwOGY5OTcyMTQwNjU2YzJjIiwiaWF0IjoxNjE2ODIyMTE1fQ.Lb1Pbl7KLEkiY13Ioefv2AzrE1_CREZ2YPPz_MlboWI'
  },
  sounds: {
    newMessage: 'QmfGYjbTXg66V8ZHzqQRVutUFmkbd5L3fV6DA72jTHDWAH',
    call: 'QmRdxeQF53abUesaFC8qmoNJ5FLS8LBuSyCmcXT5VhuKSm',
    hangup: 'QmWrRi5tdKZy3iqcR8mum9hFBbZ8qgvekhEM3Y4PD1TK28',
    mute: 'QmVk362FGmwfsXBj5zMv4x1Hp7Mp9RbYDMxsDXRAx5vyUo',
    unmute: 'QmWxv18LqpcaMhXVd1BLm9z9k1MfWDNexJ22dC6vLkdyro',
    deafen: 'Qmf4QinBSDk9AgvqsiaaZ2ZmhCfTwcSRpAgSCTxLGyZkyg',
    undeafen: 'QmSHtz5kSvX8JNZKMfkm6PjqScxoC864bmGd2g3ycwRqK1',
    upload: 'QmSHtz5kSvX8JNZKMfkm6PjqScxoC864bmGd2g3ycwRqK1',
    connected: 'QmUJMTmCdnzjcUT5nT2eGzXVDYbwDq3CanjKabYQ3Vu3Dt'
  },
  defaultLanguage: 'en_US',
  languages: {
    en_UK: '',
    hi: '',
    de: 'QmeBfYw5esSbRR63cV1qi1iV5FfgvAe93FAHNeKfqWEnrR',
    fr: '',
    it: 'QmSezaqPeAhsjekzNS3xChGw7G5N4GYCuYAqYkkGZgxneu',
    ru: '',
    hy: ''
  },
  registry: {
    mainnet: '0x0',
    goerli: '0xfA22498c3F2bc836d9347F2e8c718E7820eAb308',
    mumbai: '0x26631E322280B34E44CEDe9Bf4513b3AD8040d48'
  },
  friends: {
    mainnet: '0x0',
    goerli: '0xd1d99a34Bdb6e2c3d199dd39Fe1B011Ee633D824',
    mumbai: '0x7874124148DBAcC66647dc7545e15a684B0fE2d1'
  },
  stickers: {
    mumbai: '0x383F4C3cFF28c6E07D289b795d19cDcC4D145731',
    mumbaiInfo: {
      deployBlock: 12349058
    }
  },
  debug: false,
  cacher: {
    dwellerLifespan: 900000
  },
  polling: {
    friends: 10000,
    requests: 10000
  },
  peer: {
    network: {
      prod: {
        secure: true,
        host: '0.vault74.io',
        port: 443,
        path: '/',
        key: 'vault74',
        iceServers: [{ url: 'stun:stun.l.google.com:19302' }]
      },
      dev: {
        secure: false,
        host: '0.vault74.io',
        port: 80,
        path: '/',
        key: 'vault74',
        iceServers: [{ url: 'stun:stun.l.google.com:19302' }]
      }
    },
    heartbeat_timeout: 7000,
    check_heartbeat: 500,
    timeout: 500,
    reconnect: 3000,
    ping_interval: 5000
  },
  web3: {
    balance_polling_interval: 10000
  },
  toastNotifications: {
    position: 'top-center', iconPack: 'fontawesome', duration: 800, className: 'vault-toast'
  },
  verified_addresses: [
    '0xEE81E0B011Cd2D36D03F3E1C0A4549f78a56cb5E',
    '0x788b8fe274fcA4c4D441d1C2c95e7A2105ea669F'
  ] // TODO: move this to a contract
}
