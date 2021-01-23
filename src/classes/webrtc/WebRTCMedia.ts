
export default class WebRTCMedia {
  getMediaStream(constraints: MediaStreamConstraints) : Promise<MediaStream>{
    // @ts-ignore
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    return new Promise(resolve => {
      getUserMedia(constraints, (stream) => {
        resolve(stream);
      }, (err) => {
        // @ts-ignore
        window.Vault74.warn('Failed to get Media Stream.', err);
      });
    });
  }
}