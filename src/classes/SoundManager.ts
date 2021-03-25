import { Howl } from 'howler';
import config from '../config/config';

export default class SoundManager {
  sounds: any;

  constructor() {
    this.sounds = {
      newMessage: new Howl({
        src: [`${config.ipfs.browser}${config.sounds.newMessage}`],
        loop: false,
        volume: 0.8,
        html5: true
      })
    };
  }

  play(soundName: string) {
    if (!this.sounds[soundName]) {
      console.error('Sound not found');
      return;
    }

    this.sounds[soundName].play();
  }
}
