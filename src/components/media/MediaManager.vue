<template></template>

<script>
import config from '@/config/config';
import { Howl } from 'howler';

const callingSound = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.call}`],
  loop: true,
  volume: 1.0,
  html5: true,
});

const hangupSound = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.hangup}`],
  volume: 1.0,
  html5: true,
});

const connectedSound = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.connected}`],
  volume: 1.0,
  html5: true,
});


export default {
  name: 'MediaManager',
  data() {
    return {
      mediaStream: null,
      peer: null,
      activeCall: null,
      remoteStream: null,
      audioStream: null,
      answer: () => {},
    };
  },
  methods: {
    /** @method
     * Sends messages to remote peer and the message broker.
     * @name sendMessage
     * @argument data data to send to message brokern & peers
     * @argument type type of message
     */
    async sendMessage(data, type) {
      if (this.$database.messageManager) {
        const msg = this.$database.messageManager.buildMessage(
          this.$store.state.activeChat,
          Date.now(),
          'message',
          {
            type: type || 'text',
            data,
          },
        );

        const id = this.$database.threadManager
          .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
        const threadExists = await this.$database.threadManager.fetchThread(id);
        if (threadExists) {
          const threadID = await this.$database.threadManager.threadAt(id);
          // If we have their public key, we will encrypt their message
          this.$database.messageManager
            .addMessageDeterministically(threadID, msg, this.$store.state.activeChat);
        }
      }

      const peer = this.$WebRTC.find(this.$store.state.activeChat);
      if (peer && peer.isAlive) {
        peer.send(
          'message',
          {
            type: type || 'text',
            data,
          },
        );
      }
    },
    /** @method
     * Stream the audio to the DOM
     * @name playRemoteStream
     * @argument e source object to play audio to
     */
    playRemoteStream(e) {
      this.audioStream = new Audio();
      this.audioStream.muted = false;
      this.audioStream.srcObject = e;
      this.audioStream.play();
    },
    /** @method
     * Clear the usage of the audio devices
     * @name stopStream
     */
    stopStream() {
      if (!this.mediaStream) return;
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
    },
    /** @method
     * Mute all local audio tracks
     * @name stopStream
     * @argument muted boolean value of wether or not the user is muted
     */
    toggleMute(muted) {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => {
          // eslint-disable-next-line
          track.enabled = !muted;
        });
      }
    },
    /** @method
     * Mute local AND remote audio tracks
     * @name toggleDeafen
     * @argument deafened boolean value of wether or not the user is deafened
     */
    toggleDeafen(deafened) {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => {
          // eslint-disable-next-line
          track.enabled = !deafened;
        });
        this.remoteStream.getTracks().forEach((track) => {
          // eslint-disable-next-line
          track.enabled = !deafened;
        });
      }
    },
    /** @method
     * End mediastreams and clean up calls. Notify the remote
     * peer that we've ended the call.
     * @name hangup
     */
    hangup() {
      // Stop calling & play hangup
      callingSound.stop();
      hangupSound.play();

      this.stopStream();
      if (this.remoteStream) {
        this.remoteStream = null;
      }
      if (this.activeCall) {
        this.activeCall.close();
        this.activeCall = null;
      }
      this.$store.commit('activeCaller', false);
      this.$store.commit('connectMediaStream', false);
    },
    /** @method
     * Create a new media stream (audio)
     * if one has not yet been created
     * @name createMediaStream
     */
    createMediaStream() {
      if (this.mediaStream) return this.mediaStream;
      const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      return new Promise((resolve) => {
        // Constraints for configurable audio
        const constraints = {
          audio: {
            autoGainControl: false,
            channelCount: 2,
            echoCancellation: this.$store.state.echoCancellation,
            latency: 0,
            noiseSuppression: this.$store.state.noiseSuppression,
            sampleRate: this.$store.state.audioQuality * 1000,
            sampleSize: this.$store.state.audioSamples,
            volume: 1.0,
          },
        };
        getUserMedia(constraints, (stream) => {
          this.mediaStream = stream;
          resolve(this.mediaStream);
        }, (err) => {
          window.Vault74.warn('Failed to get Media Stream.', err);
        });
      });
    },
    // Call a peer and send the media stream
    async call(peerId) {
      callingSound.stop();
      if (!this.mediaStream) {
        await this.createMediaStream();
      }
      if (this.activeCall) {
        this.activeCall.close();
      }
      callingSound.play();
      this.activeCall = this.peer.call(peerId, this.mediaStream);
      this.sendMessage(
        {
          state: 'staretd',
          to: peerId,
          from: this.$store.state.activeAccount,
        },
        'call',
      );
      this.activeCall.on('stream', (remoteStream) => {
        // Play calling sound
        callingSound.stop();
        this.remoteStream = remoteStream;
        this.playRemoteStream(this.remoteStream);
      });
    },
    denyCall() {
      // Stop calling sound
      callingSound.stop();
      window.Vault74.Peer2Peer.hangup();
    },
  },
  mounted() {
    // Watch for mute and unmute mutations
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'muted') {
        this.toggleMute(state.muted);
      } else if (mutation.type === 'deafened') {
        this.toggleDeafen(state.deafened);
      }
    });

    // Watch for triggers to initiate calls.
    window.Vault74.Peer2Peer.bindCall(async (id) => {
      await this.createMediaStream();
      this.call(id);
    });
    // Watch for triggers to end a call.
    window.Vault74.Peer2Peer.bindHangup(async () => {
      this.hangup();
    });

    // Connect to the Peer2Peer handler
    const conn = () => {
      if (window.Vault74.Peer2Peer) {
        // Get the connected peer object.
        // TODO: make sure we are connected to the services first.
        this.peer = window.Vault74.Peer2Peer.getPeer();
        // When a peer calls us, we will answer the call if we have approved.
        this.peer.on('call', async (call) => {
          // Play calling sound
          callingSound.play();
          call.on('close', () => {
            window.Vault74.Peer2Peer.send(call.peer, 'call-status', 'ended');
            window.Vault74.Peer2Peer.hangup();
          });
          this.$store.commit('activeCaller', call.peer);
          this.activeCall = call;

          // Remote user answered
          this.answer = async () => {
            callingSound.stop();
            connectedSound.play();
            await this.createMediaStream();
            this.$store.commit('connectMediaStream', call.peer);
            call.answer(this.mediaStream);
            call.on('stream', (remoteStream) => {
              // Play Sound
              this.remoteStream = remoteStream;
              this.playRemoteStream(this.remoteStream);
            });
          };
          // Bind the global answer functionality
          window.Vault74.Peer2Peer.bindAnswer(async () => {
            this.answer();
          });
        });
      } else {
        window.Vault74.warn('Peer not instatiated yet, retrying...');
        setTimeout(() => {
          conn();
        }, 500);
      }
    };
    conn();
  },
};
</script>
