// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

enum Specialization {
    PSYCHIATRIST,
    THERAPIST,
    COUNSELOR
}

struct Counselor {
    string name;
    Specialization specialization;
    bool verified;
    string registrationNumber;
}