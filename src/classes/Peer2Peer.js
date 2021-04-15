import Peer from 'peerjs'
import config from '@/config/config'
import PeerConnection from './PeerConnection'

const messageFormatter = (type, data) => JSON.stringify({ type, data })

export default class Peer2Peer {
  /** @constructor
   * Construct a new Peer 2 Peer handler
   * @argument peerId the ID we'd like to use for this peer
   * @argument watcher function to be called when we recive peer data
   */
  constructor (peerId, watcher = () => {}) {
    const settings = {
      host: config.peer.network[config.env].host,
      port: config.peer.network[config.env].port,
      path: config.peer.network[config.env].path,
      key: config.peer.network[config.env].key,
      secure: config.peer.network[config.env].secure,
      debug: config.debug ? 0 : 2,
      config: {
        iceServers: config.peer.network[config.env].iceServers
      }
    }

    this.peerId = peerId
    this.channels = {}
    this.ICEEstablished = false
    this.watcher = watcher
    // Calling
    this.call = () => {}
    this.hangup = () => {}
    this.answer = () => {}

    const peer = new Peer(this.peerId, settings)

    this.peer = peer
    // We've connected to the ICE service
    peer.on('open', () => {
      this.ICEEstablished = true
      this.watcher(peerId, 'alive', true)
      // Attempt connection to peers
      this.connectToPeers()
      // A new client has made a connection to us
      peer.on('connection', conn => {
        const remotePeerId = conn.peer
        // Fetch previous connection, or make a new one if
        // we have not made a connection to this peer yet
        const peerConnection = this.createDataChannel(remotePeerId)

        conn.on('open', () => {
          // We got a message from a peer, let's make sure we're
          // connected to them, this way we can return messages
          peerConnection.ensureAlive()
          setTimeout(() => {
            if (peerConnection) {
              peerConnection.bindGateway(conn)
              this.peerTracker(remotePeerId)
            }
          }, 500)
        })
      })
      peer.on('disconnected', () => {
        peer.reconnect()
      })
    })
    peer.on('error', err => {
      if (err.type === 'peer-unavailable') {
        console.warn('Peer unavailable')
      } else {
        console.warn('The peer sent us an error:', err)
      }
    })
  }

  /** @function
   * @name bindCall
   * Binds the function that should be used to request a call
   * @argument fn the function to be called
   */
  bindCall (fn) {
    this.call = fn
  }

  /** @function
   * @name bindHangup
   * Binds the function that should be used to leave calls
   * @argument fn the function to be called
   */
  bindHangup (fn) {
    this.hangup = fn
  }

  /** @function
   * @name bindAnswer
   * Binds the function that should be used to answer calls
   * @argument fn the function to be called
   */
  bindAnswer (fn) {
    this.answer = fn
  }

  /** @function
   * @name peerTracker
   * Checks and provides the status of a peer
   * @argument peerId the id of the peer to update
   */
  peerTracker (peerId) {
    this.ping(peerId)
    setInterval(() => {
      this.ping(peerId)
    }, config.peer.ping_interval)
  }

  /** @function
   * @name createChannels
   * Create a peer connection for each peer provided
   * @argument peers array of peer ids to create connections for
   */
  createChannels (peers) {
    peers.forEach(peer => {
      if (!this.channels[`${this.peerId}::${peer.address}`]) {
        this.createDataChannel(peer.address)
        if (this.ICEEstablished) this.connectToPeers()
      }
    })
  }

  /** @function
   * @name connectToPeers
   * Establish a connection to all registered PeerConnections
   */
  connectToPeers () {
    // Establish connection to all new peers
    Object.keys(this.channels).forEach(ch => {
      const channel = this.channels[ch]
      if (channel.getStatus().code < 2) {
        channel.connect()
      }
    })

    if (config.debug) console.table(this.channels)
  }

  /** @function
   * @name createDataChannel
   * Create a new data channel for a given peerid
   * @argument peerId peer ID to create the channel for
   */
  createDataChannel (peerId) {
    if (!this.channels[`${this.peerId}::${peerId}`]) {
      this.channels[`${this.peerId}::${peerId}`] = new PeerConnection(
        this.peer,
        peerId,
        (type, data) => {
          this.internalWatcher(peerId, type, data)
        }
      )
    }
    return this.channels[`${this.peerId}::${peerId}`]
  }

  /** @function
   * @name getDataChannel
   * Get a datachannel class by a specific peerId
   * @argument peerId the identifying peer to get the channel of
   * @returns returns the remote peer data channel
   */
  getDataChannel (peerId) {
    this.createDataChannel(peerId)
    return this.channels[`${this.peerId}::${peerId}`]
  }

  /** @function
   * @name getPeer
   * @returns the local peer object
   */
  getPeer () {
    return this.peer
  }

  /** @function
   * @name internalWatcher
   * Take action when peer data comes in
   * @argument peer the peer id sending the data
   * @argument type the type of data we recieved
   * @data the data we recieved
   */
  internalWatcher (peer, type, data) {
    // Hoist watcher methods
    this.watcher(peer, type, data)
  }

  /** @function
   * @name ping
   * Sends a ping request to a peer
   * @argument peerId the if of the peer to ping.
   */
  ping (peerId) {
    const peerConntion = this.getDataChannel(peerId)
    peerConntion.send(messageFormatter('ping', Date.now()))
  }

  /** @function
   * @name send
   * Send data of a specified type to a specified peer
   * @argument peerId peer to send data to
   * @argument type type of data we're sending
   * @argument data the payload to send
   */
  send (peerId, type, data) {
    const peerConntion = this.getDataChannel(peerId)
    peerConntion.send(messageFormatter(type, data))
  }
}
