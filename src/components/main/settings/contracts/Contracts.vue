<template>
  <div>
    <h3 class="label">{{$t('settings.contracts.label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <p class="yellow" v-html="$t('settings.contracts.audit_disclaimer')"/>
        <br>
        <h2>{{$t('settings.contracts.heading')}}</h2>
        <div class="tabs">
          <ul>
            <li 
              :class="contract === 'registry' ? 'is-active' : ''"
              v-on:click="changeContract('registry')">
              <a>{{$t('settings.contracts.registry')}}</a>
            </li>
            <li 
              :class="contract === 'dweller' ? 'is-active' : ''"
              v-on:click="changeContract('dweller')">
              <a>{{$t('settings.contracts.dweller')}}</a>
            </li>
            <li 
              :class="contract === 'server' ? 'is-active' : ''"
              v-on:click="changeContract('server')">
              <a>{{$t('settings.contracts.server')}}</a>
            </li>
            <li 
              :class="contract === 'friends' ? 'is-active' : ''"
              v-on:click="changeContract('friends')">
              <a>{{$t('settings.contracts.friends')}}</a>
            </li>
          </ul>
        </div>

<Prism language="solidity" v-if="contract === 'registry'">
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 &lt; 0.8.0;

import "./DwellerID.sol";
import "./Server.sol";

/** 
 * @title Vault74Registry
 * @dev Implements storage and assignment of Vault74 DwellerIDs
 */
contract Vault74Registry {
    mapping(address => address) internal dwellers;

    /**
     * @dev Create a new dweller identification contract
     * @param name The name this dweller wishes to go by
     */
    function createDweller(bytes32 name) 
        public 
        returns(address newDwellerId) 
    {
        address sender = msg.sender;
        // Make sure this user doesn't already have an ID assigned.
        assert(dwellers[sender] == address(0));
        // Create a new ID for the sender.
        DwellerID dwellerId = new DwellerID(name, sender);
        dwellers[sender] = address(dwellerId);
        return address(dwellerId);
    }

    /**
     * @dev Create a new Server contract and assign the sender as owner
     * @param name Human readable name of the server
     */
    function createServer(bytes32 name)
        public
        returns(address serverAddress)
    {
        require(dwellers[msg.sender] != address(0), "Please register an ID first.");
        DwellerID dweller = DwellerID(dwellers[msg.sender]);
        Server server = new Server(name, msg.sender);
        serverAddress = address(server);
        dweller.joinServer(serverAddress);
    }

     /**
     * @dev Get an identifiaction contract for a given dweller
     * @param dweller The address of the dweller we're looking up
     */
    function getDwellerId(address dweller)
        public
        view
        returns(address dwellerId)
    {
        return dwellers[dweller];
    }

    /**
     * @dev If a user is not already a part of a server
     * attempt to join a new server
     * @param _server Address pointing to server contract to join
     */
    function joinServer(address _server) 
        public
    {
        require(dwellers[msg.sender] != address(0), "Please register an ID first.");
        Server server = Server(_server);
        server.join(msg.sender);
        DwellerID dweller = DwellerID(dwellers[msg.sender]);
        address[] memory servers = dweller.getServers();
        for (uint i=0; i&lt;servers.length; i++) {
          require(servers[i] != _server, "Dweller is already in this server.");
        }
        dweller.joinServer(_server);
    }

    /**
     * @dev If a user is a part of a server try to leave it
     * @param _server Address pointing to server contract to leave
     */
    function leaveServer(address _server) 
        public
    {
        require(dwellers[msg.sender] != address(0), "Please register an ID first.");
        DwellerID dweller = DwellerID(dwellers[msg.sender]);
        address[] memory servers = dweller.getServers();
        bool inServer = false;
        for (uint i=0; i&lt;servers.length; i++) {
            if (servers[i] == _server) {
                inServer = true;
            }
        }
        require(inServer, "Dweller is not in this server.");
        dweller.leaveServer(_server);
        Server server = Server(_server);
        address[] memory members = server.getMembers();
        uint indx;
        for (uint i=0; i&lt;members.length; i++) {
            if (members[i] == msg.sender) {
                indx = i;
            }
        }
        server.leave(indx);
    }
}
</Prism>

<Prism language="solidity" v-if="contract === 'friends'">
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 &lt; 0.8.0;
pragma experimental ABIEncoderV2;

/**
 * @title FriendRequester
 * @dev Maps friend requests along with associated threadIDs
 */
contract Friends {

    struct Friend {
        address dweller; // Address of the friend
        bytes32 threadHash1; // Part 1 of the convorsation ThreadID
        bytes32 threadHash2; // Part 2 of the convorsation ThreadID
    }

    struct FriendRequest {
        uint id; // ID of the friend request
        bool active; // Is the friend request still pending
        bool accepted; // Has the friend request  been accepted
        address sender; // The address of the user whom sent the request
        address reciver; // The address of the person they are request to friend with
        bytes32 threadHash1; // Part 1 of the convorsation ThreadID
        bytes32 threadHash2; // Part 2 of the convorsation ThreadID
    }

    // We only expose who the request was sent to
    event FriendRequestSent(address indexed sentTo);
    // Emitted when a user removes a friend
    event FriendRemoved(address indexed friendRemoved);

    // List of requests a particular address has recieved
    mapping(address => uint[]) private recievedRequests;
    // Mapping of requests to IDs a particular address has sent
    // This is used to insure an address does not send multiple
    // friend requests to a user
    mapping(address => mapping(address => uint)) private sentRequests;
    // List of all friend requests
    FriendRequest[] private requests;
    // Mapping of all friends a particular address has
    mapping(address => Friend[]) private friends;

    /**
     * @dev Create a new Friends contract
     */
    constructor() {
        // Prevents multiple friend requets from first sender.
        // since we check against zero, here we're just reserving
        // the 0 ID slot.
        requests.push(FriendRequest(
            0,
            true,
            false,
            address(0x0),
            address(0x0),
            bytes32(0),
            bytes32(0)
        ));
    }

    /** 
     * @dev Get all the friend requests you have recieved
     * @return list of friend IDs
     */
    function getRequests()
        public
        view
        returns (uint[] memory)
    {
        return recievedRequests[msg.sender];
    }
    
    
    /** 
     * @dev Get a specified request by ID
     * @return Friend request at specified id
     */
    function getRequest(uint id)
        public
        view
        returns (FriendRequest memory)
    {
        FriendRequest memory fr = requests[id];
        return fr;
    }
    
    /** 
     * @dev Get all the friends you have
     * @return list of Friends
     */
    function getFriends() 
        public
        view
        returns (Friend[] memory) 
    {
        return friends[msg.sender];
    }

    /** 
     * @dev Make a new friend request to a user
     * @param to Address to send the friend request to
     * @param thread bytes list containing split threadID hash
     */
    function makeRequest(address to, bytes32[2] memory thread) 
        public 
    {
        require(to != msg.sender, "You can't friend yourself.");
        require(sentRequests[msg.sender][to] == 0, "You already sent a request to this user.");
        FriendRequest memory fr = FriendRequest(
            requests.length,
            true,
            false,
            msg.sender,
            to,
            thread[0],
            thread[1]
        );
        requests.push(fr);
        // Send new request
        recievedRequests[to].push(requests.length - 1);
        // Add request to sent requests
        sentRequests[msg.sender][to] = requests.length - 1;
        // Emit request sent event
        emit FriendRequestSent(to);
    }

    /**
     * @dev Accept a friend request by ID
     * @param id ID of the friend request to accept
     */
    function acceptRequest(uint id) public {
        FriendRequest memory fr = requests[id];
        require(fr.reciver == msg.sender, "This request isn't yours to accept");
        // The requests lifecycle is over
        fr.active = false;
        // Accept the request so the sender knows we're friends.
        fr.accepted = true;
        requests[id] = fr;
        // Add friends for the users
        friends[msg.sender].push(Friend(
            fr.sender,
            fr.threadHash1,
            fr.threadHash2
        ));
        friends[fr.sender].push(Friend(
            msg.sender,
            fr.threadHash1,
            fr.threadHash2
        ));
    }

    /**
     * @dev Deny a friend request by ID
     * @param id ID of the friend request to deny
     */
    function denyRequest(uint id)
        public
    {
        FriendRequest memory fr = requests[id];
        require(fr.reciver == msg.sender, "You can't deny other people's requests.");
        require(fr.active == true, "The friend request is no loger active.");
        // The requests lifecycle is over
        fr.active = false;
        requests[id] = fr;
        // Cancel the pending request so they can send another in the future
        sentRequests[fr.sender][msg.sender] = 0;
    }

    /**
     * @dev Remove a friend by address
     * @param dweller address of the friend to remove
     */
    function removeFriend(address dweller) 
        public
    {
        // Locate friends this sender has
        Friend[] storage frs = friends[msg.sender];
        // Track index of found friends
        uint indx;
        // Iterate friends to find index of friend to remove
        for (uint i = 0; i &lt; frs.length; i++) {
            if (frs[i].dweller == dweller) {
                indx = i;
                break;
            }
        }
        // If the friend is not the last in the list,
        if (indx &lt; frs.length - 1) {
          // shift the last item into it's place.
          frs[indx] = frs[frs.length - 1];
        }
        // Delete the last item in the list.
        delete frs[frs.length - 1];
        // Emit friend removed
        emit FriendRemoved(dweller);
    }
}
</Prism>

<Prism language="solidity" v-if="contract === 'dweller'">
// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 &lt; 0.8.0;

/**
 * @title DwellerID
 * @dev Represents identification of a Vault Dweller
 */
contract DwellerID {
    // The parent registry that created this identification contract
    address public registry;
    // The dweller represents the owner of this identification contract
    address private dweller;
    // This is the display name of a dweller
    bytes32 private name;
    // Optional photo identification of the dweller
    // Stored as a split Multihash referencing IPFS hash of dwellers photo
    bytes32 private photoHashBeg;
    bytes32 private photoHashEnd;

    address[] private servers;

    // Events
    event DwellerSet(address indexed dweller);
    event PhotoSet (
        bytes32 indexed photoHashBeg,
        bytes32 indexed photoHashEnd
    );

    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        require(msg.sender == dweller, "Not the dweller we're expecting.");
        _;
    }
    modifier isRegistry() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        require(msg.sender == registry, "Only callable by registry.");
        _;
    }
    modifier isRegistryOrOwner() {
        require(msg.sender == registry || msg.sender == dweller, "Only callable by registry or owner.");
        _;
    }

    /**
     * @dev Set contract deployer as dweller (owner)
     * @param _name What should we call you, dweller?
     */
    constructor(bytes32 _name, address _dweller) {
        registry = msg.sender;
        dweller = _dweller;
        name = _name;
        emit DwellerSet(dweller);
    }

    /**
     * Getters
     */

    /**
     * @dev Return owner address 
     * @return address_ owner address of dweller 
     * @return name_ name of the dweller
     * @return photoIPFSHash1_ part 1 of the dwellers photo IPFS hash
     * @return photoIPFSHash2_ part 2 of the dwellers photo IPFS hash
     */
    function getDweller() 
        external 
        view 
        returns (
            address address_, 
            bytes32 name_,
            bytes32 photoIPFSHash1_,
            bytes32 photoIPFSHash2_
        )
    {
        return (dweller, name, photoHashBeg, photoHashEnd);
    }

    /**
     * @dev Return dweller's address (owner address)
     * @return dweller address
     */
    function getDwellerAddress() 
        external 
        view 
        returns (address) 
    {
        return dweller;
    }

    /**
     * @dev Return dweller's name (display name)
     * @return dweller name
     */
    function getDwellerName() 
        external 
        view 
        returns (bytes32) 
    {
        return name;
    }

    /**
     * @dev Get the dweller's photo IPFS hash
     * @return dweller photo IPFS hash
     */
    function getPhoto() 
        public 
        view 
        returns (bytes memory) 
    {
        bytes memory joined = new bytes(64);
        // Join the two hash parts of photos IPFS hash
        assembly {
            mstore(add(joined, 32), sload(photoHashBeg.slot))
            mstore(add(joined, 64), sload(photoHashEnd.slot))
        }
        return joined; 
    }

    function getServers() 
        public
        view
        isRegistryOrOwner
        returns (address[] memory)
    {
        return servers;
    }

    /**
     * Setters
     */

    /**
     * @dev Add a server from list of server contracts
     * @param server Address pointing to server contract
     */
    function joinServer(address server) 
        public
        isRegistry
    {
        servers.push(server);
    }

    /**
     * @dev Remove server from list of server contracts
     * @param server Address pointing to server contract
     */
    function leaveServer(address server) 
        public
        isRegistry
    {
        if (servers.length == 0) return;
        uint indx;
        for (uint i = 0; i &lt; servers.length-1; i++){
            if (servers[i] == server) {
                indx = i;
            }
        }
        delete servers[indx];
        
    }

    /**
     * @dev Change dweller's display name
     * @param _name What should we call you, dweller?
     */
    function setDwellerName(bytes32 _name) 
        public
        isOwner
    {
        name = _name;
    }

    /**
     * @dev Change dweller's display photo. Consider using PNG or JPEG photos for usability.
     * @param hash split multihash referencing the IPFS hash for the photo
     */
    function setPhoto(bytes32[2] memory hash) 
        public 
        isOwner 
    {
        photoHashBeg = hash[0];
        photoHashEnd = hash[1];
        emit PhotoSet(photoHashBeg, photoHashEnd);
    }
}
</Prism>

<Prism language="solidity" v-if="contract === 'server'">
// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 &lt; 0.8.0;

import "./Vault74Registry.sol";

/**
 * @title Server
 * @dev Identifies a Vault74 server used to communicate with many dwellers
 */
contract Server {
    // The parent registry that created this server contract
    address public registry;
    // The dweller represents the owner of this server
    address private dweller;
    // This is the display name of the server
    bytes32 public name;
    // Optional photo identification of the server
    // Stored as a split Multihash referencing IPFS hash of servers photo
    bytes32 private photoHash1;
    bytes32 private photoHash2;
    // Optional additional info access hash
    bytes32 private dbHash1;
    bytes32 private dbHash2;
    // Server memebers whom have joined
    address[] public members;
    // Check a eth address to see if the member has access
    // if they do, they will have a truthy bool set
    mapping(address => bool) public memberStatus;
    // Administrators
    mapping(address => bool) public administrators;
    // Channels
    bytes32[] public channels;
    // Name -> TypeId
    mapping(bytes32 => uint8) public channelTypes;
    // Used to store channels in specific groups
    bytes32[] public groups;
    mapping(bytes32 => bytes32[]) public groupings;

    /**
     * Events
     */
    // Internal
    event DwellerSet(address indexed dweller);
    // Information
    event NameChanged(bytes32 indexed name);
    event PhotoSet (
        bytes32 indexed photoHash1,
        bytes32 indexed photoHash2
    );
    // Members &amp; Roles
    event MemberInvited(address indexed member);
    event MemberJoined(address indexed member);
    event MemberLeft(address indexed member);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event MemberRevoked(address indexed member);
    // Groups
    event GroupCreated(bytes32 indexed groupName);
    event GroupDeleted(bytes32 indexed groupName);
    event ChannelGrouped(bytes32 indexed groupName, bytes32 indexed channelName);
    event ChannelRemovedFromGroup(bytes32 indexed groupName);
    // Channels
    event ChannelCreated(
        bytes32 indexed name,
        uint8 indexed typeId
    );
    event ChannelDeleted( bytes32 indexed name);
    
    /**
     * @dev Set contract deployer as dweller (owner)
     * @param _name What should we call your server?
     */
    constructor(bytes32 _name, address _dweller) {
        registry = msg.sender;
        dweller = _dweller;
        name = _name;
        // Set the owner as an administrator
        administrators[dweller] = true;
        members.push(_dweller);
        // Emit events
        emit DwellerSet(dweller);
        emit AdminAdded(dweller);
    }

    /**
     * Modifiers
     */

    // modifier to check if caller is owner
    modifier isOwner() {
        require(msg.sender == dweller, "Not the dweller we're expecting.");
        _;
    }
    // modifier to check if caller is owner
    modifier isRegistry() {
        require(msg.sender == registry, "Only the registry may execute this.");
        _;
    }
    // modifier to check if caller is admin
    modifier isAdmin() {
        require(administrators[msg.sender], "Not authorized to do that.");
        _;
    }
    
    /**
     * Getters
     */
    
    function getMembers() 
        public
        view
        returns (address[] memory)
    {
        return members;
    }
    
    function getChannels() 
        public
        view
        returns (bytes32[] memory)
    {
        return channels;
    }
    
    function getGroups() 
        public
        view
        returns (bytes32[] memory)
    {
        return groups;
    }

    /**
     * @dev Get the servers's photo IPFS hash
     * @return server photo IPFS hash
     */
    function getPhoto() 
        public 
        view 
        returns (bytes memory) 
    {
        bytes memory joined = new bytes(64);
        // Join the two hash parts of photos IPFS hash
        assembly {
            mstore(add(joined, 32), sload(photoHash1.slot))
            mstore(add(joined, 64), sload(photoHash2.slot))
        }
        return joined; 
    }

    /**
     * @dev Get the servers's photo IPFS hash
     * @return server photo IPFS hash
     */
    function getDBHash() 
        public 
        view 
        returns (bytes memory) 
    {
        bytes memory joined = new bytes(64);
        // Join the two hash parts
        assembly {
            mstore(add(joined, 32), sload(dbHash1.slot))
            mstore(add(joined, 64), sload(dbHash2.slot))
        }
        return joined; 
    }
    
    function getMemberAtIndex(uint indx)
        public
        view
        returns (address) 
    {
        return members[indx];
    }

    /**
     * Setters
     */

    // Channels
    function addChannel(bytes32 _name, uint8 typeId) 
        public
        isAdmin
    {
        channels.push(_name);
        channelTypes[_name] = typeId;
        emit ChannelCreated(_name, typeId);
    }

    function delChannel(uint indx) 
        public
        isAdmin
    {
        bytes32 channelName = channels[indx];
        delete channels[indx];
        delete channelTypes[channelName];
        emit ChannelDeleted(channelName);
    }
    
    // Groups
    function createGroup(bytes32 groupName) 
        public
        isAdmin
    {
        groups.push(groupName);
        emit GroupCreated(groupName);
    }

    function delGroup(uint indx) 
        public
        isAdmin
    {
        bytes32 groupName = groups[indx];
        delete groupings[groupName];
        delete groups[indx];
        emit GroupDeleted(groupName);
    }
    
    function addChannelToGroup(bytes32 groupName, bytes32 channelName)
        public
        isAdmin
    {
        groupings[groupName].push(channelName);
        emit ChannelGrouped(groupName, channelName);
    }
    
    function removeChannelFromGroup(bytes32 groupName, uint channelIndex)
        public
        isAdmin
    {
        delete groupings[groupName][channelIndex];
        emit ChannelRemovedFromGroup(groupName);
    }

    // Roles
    function addAdmin(address admin) 
        public
        isOwner
    {
        administrators[admin] = true;
        emit AdminAdded(admin);
    }

    function removeAdmin(address admin) 
        public
        isOwner
    {
        require(admin != dweller, "You can't remove the owner as admin");
        administrators[admin] = false;
        emit AdminRemoved(admin);
    }

    // Members
    function join(address member) 
        public
        isRegistry
    {
        require(memberStatus[member] == true, "Member not authorized to join the server.");
        members.push(member);
        emit MemberJoined(member);
    }
    
    function leave(uint indx)
        public
        isRegistry
    {
        delete members[indx];
        emit MemberLeft(members[indx]);
    }
    
    function inviteMember(address member)
        public
        isAdmin
    {
        memberStatus[member] = true;
        emit MemberInvited(member);
    }

    function revokeMember(address member)
        public
        isAdmin
    {
        memberStatus[member] = false;
        emit MemberRevoked(member);
    }

    /**
     * @dev Change servers's display name
     * @param _name What should we call your server
     */
    function setName(bytes32 _name)
        public
        isAdmin
    {
        emit NameChanged(_name);
        name = _name;
    }

    /**
     * @dev Change servers's display photo. Consider using PNG or JPEG photos for usability.
     * @param hash split multihash referencing the IPFS hash for the photo
     */
    function setPhoto(bytes32[2] memory hash) 
        public 
        isAdmin 
    {
        photoHash1 = hash[0];
        photoHash2 = hash[1];
        emit PhotoSet(photoHash1, photoHash2);
    }
    
    /**
     * @dev Change dweller's display photo. Consider using PNG or JPEG photos for usability.
     * @param hash split multihash
     */
    function setDBHash(bytes32[2] memory hash) 
        public 
        isAdmin 
    {
        dbHash1 = hash[0];
        dbHash2 = hash[1];
        emit PhotoSet(dbHash1, dbHash2);
    }
}
</Prism>


      </div>
    </article>
  </div>
</template>

<script>
import Prism from 'vue-prism-component';
import 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-solidity';

export default {
  name: 'Contracts',
  components: {
    Prism,
  },
  data() {
    return {
      contract: 'registry',
    };
  },
  methods: {
    changeContract(contract) {
      this.contract = contract;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a {
    text-decoration: none !important;
  }
  .message-body pre code {
    text-shadow: none !important;
    color: #ccc !important;
    font-size: 10pt !important;
  }
  .margin {
    margin: 0.5rem;
    margin-left: 25px;
    width: 150px;
  }
  .margin-2 {
    margin: 1rem 0;
  }
  .padded {
    padding-top: 0.65rem;
    padding-left: 1rem;
  }
</style>
