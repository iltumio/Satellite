interface IServer {
    address: string,
    registry: string,
    name: string,
    channels: string[],
    threadID: string,
    members: string[],
    photo: string,
    getChannel: CallableFunction,
    getGroup: CallableFunction,
    getMember: CallableFunction,
    getMemberStatus: CallableFunction,
    setName: CallableFunction,
    setPhoto: CallableFunction,
    setThreadID: CallableFunction,
    isAdmin: CallableFunction,
    addAdmin: CallableFunction,
    inviteMember: CallableFunction,
};

export default IServer;
