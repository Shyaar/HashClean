// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {CounselorRegistry} from "./couselorRegistry.sol";
import {UserRegistry} from "./userRegistry.sol";
import {PlatformErrors} from "./utils/errors/platformErrors.sol";
import {PlatformEvents} from "./utils/events/platformEvents.sol";

contract Novana is Ownable {
    UserRegistry public userRegistry;
    CounselorRegistry public counselorRegistry;

    uint256 private nextRoomId = 1;

    using ECDSA for bytes32;

    bytes32 public constant INVITE_TYPEHASH =
        keccak256(
            "Invite(address inviter,address invitee,uint256 roomId,uint256 deadline)"
        );

    bytes32 immutable DOMAIN_SEPARATOR;

    struct Invite {
        address inviter;
        address invitee;
        uint256 roomId;
        uint256 deadline;
        bytes signature;
    }

    struct Room {
        uint256 id;
        address creator;
        string topic;
        bool isPrivate;
        string farcasterChannelId;
        uint256 memberCount;
        mapping(address => bool) members;
        mapping(address => bool) linkedCounselors;
        bool exists;
    }

    struct RoomView {
        uint256 id;
        address creator;
        string topic;
        bool isPrivate;
        string farcasterChannelId;
        uint256 memberCount;
    }

    struct RemovalVote {
        uint256 votes;
        mapping(address => bool) hasVoted;
        bool active;
    }

    mapping(uint256 => Room) public rooms;
    uint256[] public roomIds;
    mapping(uint256 => mapping(address => RemovalVote)) private removalVotes;
    mapping(uint256 => mapping(address => bool)) public isInvited;
    mapping(address => uint256[]) private roomsByUser;

    constructor(
        address _userRegistry,
        address _counselorRegistry
    ) Ownable(msg.sender) {
        require(
            _userRegistry != address(0) && _counselorRegistry != address(0),
            "zero registry addr"
        );
        userRegistry = UserRegistry(_userRegistry);
        counselorRegistry = CounselorRegistry(_counselorRegistry);

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("HavenPrivateRooms")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }


    modifier onlyRegisteredUser() {
        if (!userRegistry.getUserHasRegistered(msg.sender))
            revert PlatformErrors.OnlyRegisteredUser();
        _;
    }

    modifier onlyRegisteredCounselor() {
        if (!counselorRegistry.isACounselor(msg.sender))
            revert PlatformErrors.OnlyRegisteredCounselor();
        _;
    }

    modifier roomExists(uint256 _roomId) {
        if (!rooms[_roomId].exists)
            revert PlatformErrors.RoomDoesNotExist(_roomId);
        _;
    }


    function createRoom(
        string calldata _topic,
        bool _isPrivate
    ) external returns (uint256) {
        if (
            msg.sender != owner() &&
            !userRegistry.getUserHasRegistered(msg.sender)
        ) revert PlatformErrors.OnlyRegisteredUser();

        uint256 roomId = nextRoomId++;
        Room storage r = rooms[roomId];
        r.id = roomId;
        r.creator = msg.sender;
        r.topic = _topic;
        r.isPrivate = _isPrivate;
        r.exists = true;
        r.memberCount = 1;

        r.members[msg.sender] = true;
        roomIds.push(roomId);


        roomsByUser[msg.sender].push(roomId);

        emit PlatformEvents.RoomCreated(roomId, msg.sender, _topic, _isPrivate);
        emit PlatformEvents.JoinedRoom(roomId, msg.sender);
        return roomId;
    }

    function joinRoom(
        uint256 _roomId
    ) external roomExists(_roomId) onlyRegisteredUser {
        Room storage r = rooms[_roomId];

        if (r.members[msg.sender])
            revert PlatformErrors.AlreadyMember(_roomId, msg.sender);

        if (r.isPrivate) {
            revert PlatformErrors.NotAuthorized("Private rooms require invite");
        }

        r.members[msg.sender] = true;
        r.memberCount += 1;


        roomsByUser[msg.sender].push(_roomId);

        emit PlatformEvents.JoinedRoom(_roomId, msg.sender);
    }

    function addMemberToPrivateRoom(
        uint256 _roomId,
        address _member
    ) external roomExists(_roomId) onlyRegisteredUser {
        Room storage r = rooms[_roomId];

        if (
            msg.sender != r.creator &&
            msg.sender != owner() &&
            !r.linkedCounselors[msg.sender]
        ) {
            revert PlatformErrors.OnlyRoomCreatorOrOwner();
        }

        if (r.members[_member])
            revert PlatformErrors.AlreadyMember(_roomId, _member);

        r.members[_member] = true;
        r.memberCount += 1;


        roomsByUser[_member].push(_roomId);

        emit PlatformEvents.JoinedRoom(_roomId, _member);
    }

    function leaveRoom(uint256 _roomId) external roomExists(_roomId) {
        Room storage r = rooms[_roomId];

        if (!r.members[msg.sender])
            revert PlatformErrors.NotMember(_roomId, msg.sender);

        r.members[msg.sender] = false;
        if (r.memberCount > 0) r.memberCount -= 1;


        uint256[] storage userRooms = roomsByUser[msg.sender];
        for (uint256 i = 0; i < userRooms.length; i++) {
            if (userRooms[i] == _roomId) {
                userRooms[i] = userRooms[userRooms.length - 1];
                userRooms.pop();
                break;
            }
        }

        emit PlatformEvents.LeftRoom(_roomId, msg.sender);
    }


    function getMyRooms() external view returns (RoomView[] memory _rooms) {
        uint256[] storage userRoomIds = roomsByUser[msg.sender];
        uint256 total = userRoomIds.length;
        _rooms = new RoomView[](total);

        for (uint256 i = 0; i < total; i++) {
            Room storage r = rooms[userRoomIds[i]];
            _rooms[i] = RoomView({
                id: r.id,
                creator: r.creator,
                topic: r.topic,
                isPrivate: r.isPrivate,
                farcasterChannelId: r.farcasterChannelId,
                memberCount: r.memberCount
            });
        }
    }

    function getAllRooms() external view returns (RoomView[] memory _rooms) {
        uint256 total = roomIds.length;
        _rooms = new RoomView[](total);

        for (uint256 i = 0; i < total; i++) {
            uint256 roomId = roomIds[i];
            Room storage r = rooms[roomId];
            _rooms[i] = RoomView({
                id: r.id,
                creator: r.creator,
                topic: r.topic,
                isPrivate: r.isPrivate,
                farcasterChannelId: r.farcasterChannelId,
                memberCount: r.memberCount
            });
        }
    }
}
