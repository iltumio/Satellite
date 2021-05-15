import { IState } from '../createState';

export default {
  // Set the audio device
  setAudioDevice(state: IState, device: string) {
    state.audioDevice = device;
  },
  // Set the audio device
  setVideoDevice(state: IState, device: string) {
    state.videoDevice = device;
  },
  muted(state: IState, muted: boolean) {
    state.muted = muted;
  },
  deafened(state: IState, deafened: boolean) {
    state.deafened = deafened;
  },
  localVideo(state: IState, localVideo: boolean) {
    state.localVideo = localVideo;
  },
  remoteVideo(state: IState, remoteVideo: boolean) {
    state.remoteVideo = remoteVideo;
  },
  incomingCall(state: IState, identifier: string) {
    state.incomingCall = identifier;
  },
  addActiveCall(state: IState, identifier: string) {
    state.activeCalls = [...state.activeCalls, identifier];
  },
  removeActiveCall(state: IState, identifier: string) {
    state.activeCalls = state.activeCalls.filter(
      activeCall => activeCall !== identifier
    );
  }
};
