// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


library bookingEvents {
    event SessionOffered(uint256 indexed sessionId, address indexed counselor, uint256 startTime, uint256 duration, uint256 fee);
    event SessionBooked(uint256 indexed sessionId, address indexed user, uint256 fee);
    event SessionCancelled(uint256 indexed sessionId, address indexed who, string reason, uint256 refundAmount, uint256 penaltyAmount);
    event SessionCompleted(uint256 indexed sessionId, address indexed counselor, address indexed user);
    event SessionNoShow(uint256 indexed sessionId, address indexed markedBy);

}
