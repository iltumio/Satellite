import ThreadID from '@textile/threads-id';
import dayjs from 'dayjs';

export default {
  async initP2P({ commit, dispatch, state }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const SoundManager = this.$app.$sound;
    // @ts-ignore
    const streamManager = this.$app.$streamManager;

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        dispatch('signal', { signal: data, identifier: identifier });
      },
      ['signal']
    );

    WebRTC.subscribe(
      (event: string, identifier: string, { type, data }) => {
        dispatch('setFriendStatus', { address: identifier, status: 'alive' });
      },
      ['connect']
    );

    // Watch for users typing
    WebRTC.subscribe(
      (event, identifier, message) => {
        commit('userTyping', [identifier, message.data]);
      },
      ['typing-notice'],
      state.activeChats
    );

    // Watch for users typing
    WebRTC.subscribe(
      (event, identifier, message) => {
        commit('incomingCall', identifier);
        SoundManager.play('callingSound');
      },
      ['incoming-call']
    );

    WebRTC.subscribe(
      (event, identifier, message) => {
        SoundManager.stop('callingSound');
        SoundManager.stop('connectedSound');
      },
      ['call-answered']
    );

    WebRTC.subscribe(
      (event, identifier, message) => {
        SoundManager.play('callingSound');
      },
      ['outgoing-call']
    );

    WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        SoundManager.stop('callingSound');
        SoundManager.stop('connectedSound');
        streamManager.addRemoteStream(identifier, data[0]);
        streamManager.playStream('remote', identifier);
      },
      ['call-stream']
    );

    WebRTC.subscribe(
      (event, identifier, message) => {
        SoundManager.stop('callingSound');
        SoundManager.play('hangupSound');

        streamManager.stopStream('remote', identifier);
        streamManager.stopStream('local', identifier);
      },
      ['call-ended']
    );

    WebRTC.subscribe(
      (event, identifier, message) => {
        dispatch('setFriendStatus', { address: identifier, status: 'dead' });
      },
      ['disconnect']
    );
  },
  async signal({ commit, dispatch, state }, { signal, identifier }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;

    const sig = signalingManager.buildSignal(signal);

    const friend = state.friends.find(f => f.address === identifier);

    if (friend) {
      if (sig.type === 'offer') {
        signalingManager.initializeConnection(friend.threadID, sig, identifier);
      } else {
        signalingManager.updateSignal(friend.threadID, sig);
      }
    }
  },
  async subscribeToFriendsSignals({ dispatch }, { friends }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    friends.forEach(async friend => {
      // dispatch('checkLastSignal', { friend });
      await dispatch('subscribeToFriendSignal', { friend });
      if (!WebRTC.isPeerConnected(friend.address)) {
        dispatch('initiateConnection', { friend });
      }
    });
  },
  async checkLastSignal({}, { friend }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    const threadID = ThreadID.fromString(friend.threadID);

    const lastSignal = await signalingManager.getLastSignalData(
      threadID,
      friend.address
    );

    if (!lastSignal) return;

    const elapsedTime = dayjs().diff(dayjs(lastSignal.at), 'seconds');

    if (elapsedTime <= 60 && lastSignal?.initiator) {
      const sender = lastSignal?.sender;
      const data = lastSignal?.payload?.signalingData;
      await WebRTC.forwardSignal(sender, data);
    }
  },
  async subscribeToFriendSignal({ dispatch }, { friend }) {
    // @ts-ignore
    const { signalingManager } = this.$app.$database;
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    const threadID = ThreadID.fromString(friend.threadID);

    signalingManager.subscribe(
      threadID,
      friend.address,
      async update => {
        if (!update?.instance) return;

        const sender = update?.instance?.sender;
        const data = update?.instance?.payload?.signalingData;

        if (!sender || !data) return;

        if (data.type === 'offer') {
          WebRTC.connectToRemote(sender, data);
        } else {
          WebRTC.forwardSignal(sender, data);
        }
      },
      () => {
        dispatch('subscribeToFriendSignal', { friend });
      }
    );

    return;
  },
  async initiateConnection({}, { friend }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    await WebRTC.initiateConnection(friend.address, true);
  },
  async call({ commit, dispatch }, { friendAddress, stream }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const streamManager = this.$app.$streamManager;

    // Close active call
    WebRTC.getActiveCalls().forEach(activeCall => {
      activeCall[1].hangupCall();
    });

    await WebRTC.call(friendAddress, stream);

    // Add the local stream using the recipient address as id
    streamManager.addLocalStream(friendAddress, stream);

    commit('addActiveCall', friendAddress);
    dispatch('sendMessage', { data: Date.now(), type: 'call' });
  },
  async updateStream({ commit, dispatch }, { friendAddress, stream }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const streamManager = this.$app.$streamManager;
    
    await WebRTC.updateStream(friendAddress, stream);

    streamManager.addLocalStream(friendAddress, stream);
  },
  async answerCall({ commit, dispatch }, { friend, stream }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;
    // @ts-ignore
    const streamManager = this.$app.$streamManager;

    // Add the local stream using the sender address as id
    streamManager.addLocalStream(friend.address, stream);

    // Close active call
    WebRTC.getActiveCalls().forEach(activeCall => {
      activeCall[1].hangupCall();
      streamManager.stopStream('remote', activeCall);
      streamManager.stopStream('local', activeCall);
    });

    await WebRTC.answerCall(friend.address, stream);

    commit('incomingCall', false);
    commit('addActiveCall', friend.address);
    dispatch('setActiveChat', { friendAddress: friend.address });
  },
  async hangupCall({ commit, dispatch }, { friendAddress }) {
    // @ts-ignore
    const WebRTC = this.$app.$WebRTC;

    await WebRTC.hangupCall(friendAddress);

    commit('removeActiveCall', friendAddress);
  }
};
