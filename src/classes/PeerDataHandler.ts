// @ts-ignore
import config from '@/config/config';

const newMessageSound = new Audio(`${config.ipfs.browser}${config.sounds.newMessage}`);

export default class PeerDataHandler {
  store: any;
  lexicon: any;
  constructor(store: any) {
    this.store = store;

    this.lexicon = {
      message: this.message,
      'call-status': this.callStatus,
    };
  }

  dispatch(peer: string, type: string, data: string) {
    if (this.lexicon[type]) {
      this.lexicon[type](peer, type, data, this.store);
    }
  }

  message(peer: string, type: string, data: string) {
    // @ts-ignore
    window.Vault74.messageBroker.recievedMessage(
      peer,
      Date.now(),
      type,
      JSON.parse(data),
    );
    newMessageSound.play();
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(
          peer,
          {
            body: JSON.parse(data).data.data,
            icon: '@/assets/images/logo_color.png',
          });
      }
    });
  }


  callStatus(_peer: string, _type: string, data: string) {
    if (JSON.parse(data).data === 'ended') {
      // @ts-ignore
      window.Vault74.Peer2Peer.hangup();
    }
  }
}