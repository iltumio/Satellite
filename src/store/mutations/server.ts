interface Channel {
  id: string;
  type: string;
  name: string;
}

export default {
  activeServer(state: any, server: any) {
    state.server = server;
  },
  activeChannel(state: any, channel: Channel) {
    state.channel = channel;
  }
};
