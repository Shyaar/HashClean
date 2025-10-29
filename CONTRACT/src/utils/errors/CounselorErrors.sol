// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library CounselorErrors {
    error CounselorAlreadyRegistered();
    error CounselorNotRegistered();
    error NotOwner();
    error InvalidRegistration();
}