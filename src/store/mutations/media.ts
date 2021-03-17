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
  incomingCall(state: IState, identifier: string) {
    state.incomingCall = identifier;
  },
  activeCall(state: IState, identifier: string) {
    state.activeCall = identifier;
  }
};
