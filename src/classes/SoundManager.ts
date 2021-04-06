import { Howl } from 'howler'
import config from '../config/config'

/**
 * Class representing a Soundmanager
 * @class SoundManager
 */
export default class SoundManager {
  sounds: any;
  /**
   * @constructs SoundManager
   */
  constructor() {
    this.sounds = {
      // TODO: Move sound files from mute / unmute / call ended, etc
      newMessage: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.newMessage}`],
        loop: false,
        volume: 0.8,
        html5: true
      })
    };
  }
  
  /** @function
   * Plays a specified sound
   * @name play
   * @argument soundName Name of the sound file to play.
   * @returns null
   */
  play(soundName: string) {
    if (!this.sounds[soundName]) {
      console.error('Sound not found');
      return;
    }

    this.sounds[soundName].play();
  }
}
