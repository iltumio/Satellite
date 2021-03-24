module.exports = {
  env: 'dev', // Switch to Prod if you plan to use textiles live env
  textile: {
    localURI: 'http://localhost:6007',
    key: '<your_textile_key>',
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
  pinata: {
    // eslint-disable-next-line max-len
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwOTIxNzI2My1lMjQ3LTRhMjItOGY3My0zMGE0ZDI3ZDA3NWEiLCJlbWFpbCI6Imphc29ucGFuYXlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImUyMDZhNjM5Mjc5MzFkYWJmYjQxIiwic2NvcGVkS2V5U2VjcmV0IjoiODIyMDgzM2UxNjgzM2U2MWM5OTVhN2M4YjYxMGFhOWEzZTA1Y2QzYTM0NjQyNGFhYWZiZGE0ZWQ3OWJlNWZiMCIsImlhdCI6MTYxNjUzNjMxN30.jyusSUZIX_k5cAwzdBp1xkL28wplN6zFKAHy90MRzjU',
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
    fr: '',
    it: 'QmSezaqPeAhsjekzNS3xChGw7G5N4GYCuYAqYkkGZgxneu',
    ru: '',
    hy: '',
  },
  registry: {
    mainnet: '0x0',
    goerli: '0xfA22498c3F2bc836d9347F2e8c718E7820eAb308',
  },
  friends: {
    mainnet: '0x0',
    goerli: '0xd1d99a34Bdb6e2c3d199dd39Fe1B011Ee633D824',
  },
  debug: true,
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
};
