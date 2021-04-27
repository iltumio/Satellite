import { Howl } from 'howler'
import config from '../config/config'

/**
 * Class representing a Soundmanager
 * @class SoundManager
 */
export default class SoundManager {
  sounds: any
  /**
   * @constructs SoundManager
   */
  constructor () {
    this.sounds = {
      // TODO: Move sound files from mute / unmute / call ended, etc
      mute: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.mute}`],
        loop: false,
        volume: 0.8,
        html5: true
      }),
      unmute: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.unmute}`],
        loop: false,
        volume: 0.8,
        html5: true
      }),
      deafen: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.deafen}`],
        loop: false,
        volume: 0.8,
        html5: true
      }),
      undeafen: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.undeafen}`],
        loop: false,
        volume: 0.8,
        html5: true
      }),
      newMessage: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.newMessage}`],
        loop: false,
        volume: 0.8,
        html5: true
      }),
      callingSound: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.call}`],
        loop: true,
        volume: 1.0,
        html5: true
      }),
      hangupSound: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.hangup}`],
        volume: 1.0,
        html5: true
      }),
      connectedSound: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.connected}`],
        volume: 1.0,
        html5: true
      })
    }
  }

  /** @function
   * Plays a specified sound
   * @name play
   * @argument soundName Name of the sound file to play.
   * @returns null
   */
  play (soundName: string) {
    if (!this.sounds[soundName]) {
      console.error('Sound not found')
      return
    }

    this.sounds[soundName].play()
  }

  /** @function
   * Stops a specified sound
   * @name stop
   * @argument soundName Name of the sound file to play.
   * @returns null
   */
  stop (soundName: string) {
    if (!this.sounds[soundName]) {
      console.error('Sound not found')
      return
    }

    this.sounds[soundName].stop()
  }

  /** @function
   * Checks if the sound is currently playing
   * @name isPlaying
   * @argument soundName Name of the sound file to play.
   * @returns null
   */
  isPlaying (soundName: string): boolean {
    if (!this.sounds[soundName]) {
      console.error('Sound not found')
      return false
    }

    return this.sounds[soundName].playing()
  }
}
