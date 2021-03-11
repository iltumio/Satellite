import config from '@/config/config';
import Crypto from '@/classes/crypto/Crypto';

const messageParser = msg => JSON.parse(msg);
const messageFormatter = (type, data) => JSON.stringify({ type, data });

export default class PeerConnection {
  /** @constructor
   * Construct a new Peer Connection
   * @argument peer the ID of the main peer (this browser window)
   * @argument remoteId id of the peer we're connecting to
   * @argument watcher callback function to be notified of messages and changes
   */
  constructor(peer, remoteId, watcher) {
    // Which ID do we go by on the network
    this.remoteId = remoteId;
    this.remotePeerConnection = null;
    // Reference to main Peer object
    this.peer = peer;
    // Current connection status
    this.status = null;
    // Handle new messages
    this.watcher = watcher;
    // Remote connection proxy
    this.gateway = false;
    this.lastHeartbeat = Date.now();
    this.lastPulse = 0;
    this.latency = 0;
    // Helpers
    this.connecting = false;
    this.established = false;
    this.crypto = new Crypto();
  }

  /** @function
   * @name connect
   * The inital connection method, this should only be called once. Else use reconnect or ensureAlive
   */
  connect() {
    // We're starting the connection to the peer
    this.connecting = true;
    const remPeer = this.peer.connect(this.remoteId);
    this.status = {
      code: 1,
      message: 'awaiting-connection',
    };
    this.watcher('status', this.status);
    this.lastHeartbeat = Date.now();
    // We have connected to the remote peer
    // and the connection is officially open
    remPeer.on('open', () => {
      this.connecting = false;
      this.status = {
        code: 2,
        message: 'connected',
      };
      this.watcher('status', this.status);
      remPeer.on('data', (data) => {
        this.handleIncomingData(data);
      });
      this.bindGateway(remPeer);
    });
    remPeer.on('error', () => {
      this.connecting = false;
    });
    this.remotePeerConnection = remPeer;
    this.checkHeartbeat();
    this.connecting = false;
    return true;
  }

  /** @function
   * @name reconnect
   * Simple reconnect method which closes the current connection and reconnects
   */
  reconnect() {
    if (this.remotePeerConnection) this.remotePeerConnection.close();
    this.connect();
  }

  /** @function
   * @name ensureAlive
   * Checks to make sure we're connected to the peer this is helpful
   * if we recieve messages from a trusted peer but we're not connected to them.
   * Thus we can call this method to check if we need to reconnect.
   */
  ensureAlive() {
    if (this.established) return true;
    if (this.connecting) return true;
    this.reconnect();
    return false;
  }

  /** @function
   * @name checkHeartbeat
   * Check that the remote peer is alive and well via a ping-pong heartbeat
   */
  checkHeartbeat() {
    if (Date.now() - this.lastHeartbeat > config.peer.heartbeat_timeout) {
      this.watcher('dead', this.lastHeartbeat);
      this.established = false;
    }
    setTimeout(() => {
      this.checkHeartbeat();
    }, config.peer.check_heartbeat);
  }

  /** @function
   * @name bindGateway
   * Binds the gateway reference. This is a reference to the peer connection
   * @argument gateway peerjs connection object
   */
  bindGateway(gateway) {
    this.established = true;
    this.gateway = gateway;
    this.status = {
      code: 3,
      message: 'gateway-created',
    };
    this.watcher('status', this.status);
  }

  /** @function
   * @name send
   * Send data via the bound gateway (peer connection object)
   * @argument data string data to be sent
   */
  send(data) {
    if (this.gateway) this.gateway.send(data);
  }

  /** @function
   * @name handleIncomingData
   * Data recieved by the remote peer will be managed in this method
   * figure out the type of message and handle accordingly
   * @argument data the string data we've recieved
   */
  handleIncomingData(data) {
    if (!this.established) this.ensureAlive();
    const message = messageParser(data);
    switch (message.type) {
      case 'ping':
        this.lastPulse = Date.now();
        this.send(messageFormatter('pong', this.lastPulse));
        break;
      case 'pong':
        this.lastHeartbeat = Date.now();
        this.latency = this.lastHeartbeat - this.lastPulse;
        this.watcher('heartbeat', this.latency);
        break;
      case 'message':
        this.watcher('message', data);
        break;
      case 'call-status':
        this.watcher('call-status', data);
        break;
      default:
        this.watcher('data', data);
        break;
    }
  }

  /** @function
   * @name getStatus
   * Returns the status of the peer
   * 0 = unknown
   * 1 = awaiting-connection
   * 2 = connected
   * 3 = gateway-created
   * @returns status object, includes the status code and message
   */
  getStatus() {
    return this.status || {
      code: 0,
      message: 'unknown',
    };
  }
}
