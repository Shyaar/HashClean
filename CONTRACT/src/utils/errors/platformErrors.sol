// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library PlatformErrors {
    error RoomDoesNotExist(uint256 roomId);
    error AlreadyMember(uint256 roomId, address member);
    error NotMember(uint256 roomId, address member);
    error OnlyRegisteredUser();
    error OnlyRegisteredCounselor();
    error OnlyRoomCreatorOrOwner();
    error InvalidFarcasterId();
    error NotAuthorized(string message);
    error InvalidOrExpiredInvite();
    error NotYourInvite();
    error InviteExpired();
}
