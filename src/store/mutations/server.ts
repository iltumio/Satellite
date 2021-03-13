import { IState } from '../createState';

interface Channel {
  id: string;
  type: string;
  name: string;
}

export default {
  activeServer(state: IState, server: any) {
    state.server = server;
  },
  activeChannel(state: IState, channel: Channel) {
    state.channel = channel;
  },
};
