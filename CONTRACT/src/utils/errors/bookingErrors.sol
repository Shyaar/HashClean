// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library bookingErrors {
    error SessionNotFound();
    error SessionNotAvailable();
    error IncorrectPayment();
    error SessionAlreadyStarted();
    error SessionNotBooked();
    error NotBooker();
    error CannotCancelSession();
    error NotCounselor();
    error NoFunds();
    error StartTimeInPast();
    error InvalidDuration();
    error NotAuthorized();
}
