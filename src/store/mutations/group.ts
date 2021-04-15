import { IState } from '../createState';

export default {
  activeGroup(state: IState, group: any) {
    state.group = group;
  },
};
