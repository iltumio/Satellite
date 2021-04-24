module.exports = {
  env: 'prod',
  textile: {
    localURI: 'http://localhost:6007',
    key: 'b3y2jgeqlvpqnxmwqsvvc4hc7ym',
    browser: 'https://hub.textile.io'
  },
  network: {
    // explorer: 'https://goerli.etherscan.io',
    // api: 'http://api-goerli.etherscan.io/api',
    chain: 'mumbai',
    chainName: 'Matic Mumbai'
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
    mumbai: '0x090533F85d85713d913fd2B0bbaD7B04F7c3BA1a',
    mumbaiInfo: {
      deployBlock: 12823378
    },
    validated: [
      '0x5C08D263d20a55b56BB126A9b4bBF85660293B1a', // Genshin 1
      '0xEA299Eda01218487FD39C1ea933824F06DE95633', // Genshin 2
      '0xaE0fe6b8c466F4a6652E6a48EeD335A6029f60a3', // Star Wars
      '0x91acdb98D38C5e2df744Ae91707C2F0E101861Ad', // Dina Birds
      '0xa5a82812E039eb4dab507C95b06e62CAbE84Ef33' // LAM

    ]
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
    '0x4C5F7aFc2e263ef5eDe2849263399BF6FC4B6354'
  ] // TODO: move this to a contract
}
