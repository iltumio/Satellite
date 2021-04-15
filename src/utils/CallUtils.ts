export function isCallActive (activeCalls: Array<string>, identifier: string) {
  return activeCalls.find(activeCall => activeCall === identifier)
}
