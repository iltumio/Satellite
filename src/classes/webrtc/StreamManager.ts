export default class StreamManager {
  _contraints: MediaStreamConstraints;
  _localStreams: MediaStream[];
  _remoteStreams: MediaStream[];
  constructor(constraints: MediaStreamConstraints) {
    this._contraints = constraints;
    this._localStreams = [];
    this._remoteStreams = [];
  }

  get constraints() {
    return this._contraints;
  }

  get localStreams() {
    return this._localStreams;
  }

  get remoteStreams() {
    return this._remoteStreams;
  }

  public updateConstraints(constraints: MediaStreamConstraints) {
    this._contraints = constraints;
  }

  public addLocalStream(stream: MediaStream) {
    this._localStreams.push(stream);
  }

  public addRemoteStream(stream: MediaStream) {
    this._localStreams.push(stream);
  }

  public toggleLocalStreams(muted: boolean) {
    this._localStreams.forEach((stream: MediaStream) => {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !muted;
      });
    });
  }

  public toggleRemoteStreams(muted: boolean) {
    this._remoteStreams.forEach((stream: MediaStream) => {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !muted;
      });
    });
  }

  public killLocalStreams() {
    this._localStreams.forEach(stream => {
      stream.getAudioTracks().forEach(track => {
        track.stop();
      });
    });

    this._localStreams = [];
  }

  public killRemoteStreams() {
    this._remoteStreams.forEach(stream => {
      stream.getAudioTracks().forEach(track => {
        track.stop();
      });
    });

    this._localStreams = [];
  }

  public killStreams() {
    this.killLocalStreams();
    this.killRemoteStreams();
  }
}