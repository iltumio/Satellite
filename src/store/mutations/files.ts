import { IState } from '../createState';

export default {
  // Caching
  cacheFiles(state: IState, files: any[]) {
    state.files = files;
  }
};
