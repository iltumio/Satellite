export default {
  // Set the audio device
  setAudioDevice(state: any, device: string) {
    // eslint-disable-next-line no-param-reassign
    state.audioDevice = device;
  },
  // Set the audio device
  setVideoDevice(state: any, device: string) {
    // eslint-disable-next-line no-param-reassign
    state.videoDevice = device;
  },
  connectMediaStream(state: any, peer: string) {
    // eslint-disable-next-line no-param-reassign
    state.activeMediaStreamPeer = peer;
    // eslint-disable-next-line no-param-reassign
    state.pendingMediaStream = true;
  },
  activeCaller(state: any, caller: string) {
    // eslint-disable-next-line no-param-reassign
    state.activeCaller = caller;
  },
  muted(state: any, muted: boolean) {
    // eslint-disable-next-line no-param-reassign
    state.muted = muted;
  },
  deafened(state: any, deafened: boolean) {
    // eslint-disable-next-line no-param-reassign
    state.deafened = deafened;
  },
  incomingCall(state: any, identifier: string) {
    state.incomingCall = identifier;
  },
  activeCall(state: any, identifier: string) {
    state.activeCall = identifier;
  }
};
