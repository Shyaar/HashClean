// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library PlatformEvents {
    event RoomCreated(
        uint256 indexed roomId,
        address indexed creator,
        string topic,
        bool isPrivate
    );
    event JoinedRoom(uint256 indexed roomId, address indexed member);
    event LeftRoom(uint256 indexed roomId, address indexed member);
    event FarcasterLinked(uint256 indexed roomId, string farcasterChannelId);
    event CounselorLinked(uint256 indexed roomId, address indexed counselor);
    event RoomEvent(
        uint256 indexed roomId,
        string indexed eventType,
        bytes data,
        uint256 timestamp
    );

    event RemovalVoteStarted(uint256 indexed _roomId,address indexed _target);

    event VotedToRemove(uint256 indexed _roomId,address indexed user,address indexed _target, uint256 votes);

    event MemberRemovedByVote(uint256 indexed _roomId, address indexed _target, uint256 votes, uint256  requiredVotes);
}
