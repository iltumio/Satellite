module.exports = {
  env: 'prod',
  textile: {
    key: 'b6as6mvzie477t3wbrxarau5bj4',
  },
  network: {
    explorer: 'https://goerli.etherscan.io',
    api: 'http://api-goerli.etherscan.io/api',
    eth: {
      default: 'wss://goerli.infura.io/ws/v3/c15a812a12c746d0a5b0c74c6133f1b2',
      infura: 'wss://goerli.infura.io/ws/v3/c15a812a12c746d0a5b0c74c6133f1b2',
      vault74: 'ws://goerli.vault74.io:8545',
    },
    chain: 'goerli',
  },
  ipfs: {
    browser: 'https://ipfs.io/ipfs/',
  },
  sounds: {
    newMessage: 'QmV7bZ3RSppXePC299kfUjpdLBsAptmSDrtvvSmBJh1cmB',
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
    it: 'QmSezaqPeAhsjekzNS3xChGw7G5N4GYCuYAqYkkGZgxneu',
  },
  registry: {
    mainnet: '0x0',
    goerli: '0xfA22498c3F2bc836d9347F2e8c718E7820eAb308',
  },
  debug: false,
  cacher: {
    dwellerLifespan: 900000,
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
};
