import { IState } from '../createState';


export default {
  addSticker(state: IState, sticker: any) {
    state.availableStickers[sticker.contract] = sticker;
  },
  addOwnedSticker(state: IState, sticker: any) {
    state.ownedStickers[sticker.contract] = sticker;
  },
};
