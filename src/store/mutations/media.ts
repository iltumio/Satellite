export default {
  // Set the audio device
  setAudioDevice(state: any, device: string) {
    state.audioDevice = device;
  },
  // Set the audio device
  setVideoDevice(state: any, device: string) {
    state.videoDevice = device;
  },
  muted(state: any, muted: boolean) {
    state.muted = muted;
  },
  deafened(state: any, deafened: boolean) {
    state.deafened = deafened;
  },
  incomingCall(state: any, identifier: string) {
    state.incomingCall = identifier;
  },
  activeCall(state: any, identifier: string) {
    state.activeCall = identifier;
  }
};
