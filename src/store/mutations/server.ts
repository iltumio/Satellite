import { IState } from '../createState';

interface Channel {
  id: string;
  type: string;
  name: string;
}

export default {
  updateServers(state: IState, servers: Array<any>) {
    state.servers = servers;
  },
  activeChannel(state: IState, channel: Channel) {
    state.channel = channel;
  },
};
