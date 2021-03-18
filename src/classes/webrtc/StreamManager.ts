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

  public toggleLocalStreams(muted: boolean, video: boolean) {
    this._localStreams.forEach((stream: MediaStream) => {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
      if (typeof video !== undefined) {
        stream.getVideoTracks().forEach((track) => {
          track.enabled = video;
        });
      }
    });
  }

  public toggleRemoteStreams(muted: boolean, video: boolean) {
    this._remoteStreams.forEach((stream: MediaStream) => {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
      if (typeof video !== undefined) {
        stream.getVideoTracks().forEach((track) => {
          track.enabled = video;
        });
      }
    });
  }

  public enableWebcam() {
    // TODO: this should add the video track if one does not exist
  }

  public toggleWebcam(enabled: boolean) {
    this._localStreams.forEach((stream: MediaStream) => {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    });
  }

  public killLocalStreams() {
    this._localStreams.forEach(stream => {
      stream.getAudioTracks().forEach(track => {
        track.stop();
      });
      stream.getVideoTracks().forEach((track) => {
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
      stream.getVideoTracks().forEach((track) => {
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