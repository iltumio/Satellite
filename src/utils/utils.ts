export const debounce = (func: CallableFunction, wait: number) => {
  let timeout

  return function executedFunction (...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function getMediaStream (
  constraints: MediaStreamConstraints
): Promise<MediaStream> {
  // @ts-ignore
  const getUserMedia =
    navigator.getUserMedia ||
    // @ts-ignore
    navigator.webkitGetUserMedia ||
    // @ts-ignore
    navigator.mozGetUserMedia
  return new Promise(resolve => {
    getUserMedia(
      constraints,
      stream => {
        resolve(stream)
      },
      err => {
        // @ts-ignore
        console.warn('Failed to get Media Stream.', err)
      }
    )
  })
}
