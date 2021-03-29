import { IState } from '../createState';

export default {
  setAssetData(state: IState, payload:any) {
    state.assets[payload.contractAddress] = payload;
  }
};
