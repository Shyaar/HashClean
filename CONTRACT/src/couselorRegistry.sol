// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {CounselorErrors} from "./utils/errors/CounselorErrors.sol";
import {CounselorEvents} from "./utils/events/CounselorEvents.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract CounselorRegistry is Ownable {

    enum Specialization {
        PSYCHIATRIST,
        THERAPIST,
        COUNSELOR
    }

    struct Counselor {
        uint256 id;
        string name;
        Specialization specialization;
        bool verified;
        string registrationNumber;
    }


    
    uint256 private nextCounselorId=1;
    mapping(address => Counselor) private counselors;
    uint256[] private counselorIds;
    mapping(uint => Counselor) private counselorsbyId;
    mapping(address => bool) private isCounselor;



      constructor() Ownable(msg.sender){}


    function counselorRegistration(string memory _name, uint8 _specialization, string memory _registrationNumber) external {
        if (isCounselor[msg.sender]) {
            revert CounselorErrors.CounselorAlreadyRegistered();
        }

        counselors[msg.sender] = Counselor({
            id:nextCounselorId,
            name: _name,
            specialization: Specialization(_specialization),
            verified: false,
            registrationNumber: _registrationNumber
        });

        isCounselor[msg.sender] = true;

        counselorIds.push(nextCounselorId);

        nextCounselorId++;
        emit CounselorEvents.CounselorRegistered(msg.sender, _name);
    }

    function getCounselor(address _counselorAddress) external view returns (Counselor memory) {
        if (!isCounselor[_counselorAddress]) {
            revert CounselorErrors.CounselorNotRegistered();
        }
        return counselors[_counselorAddress];
    }

    function verifyCounselor(address _counselorAddress) external {
        if (!isCounselor[_counselorAddress]) {
            revert CounselorErrors.CounselorNotRegistered();
        }
        counselors[_counselorAddress].verified = true;

        emit CounselorEvents.CounselorVerified(_counselorAddress);
    }

    function isACounselor(address __counselorAddress) external view returns(bool _isACounslor){
        _isACounslor = isCounselor[__counselorAddress];
    }

    function getAllCounselors() external view returns (Counselor[] memory _counselors) {
        uint256 total = counselorIds.length;
        _counselors = new Counselor[](total);

        for (uint256 i = 0; i < total; i++) {
            _counselors[i] = counselorsbyId[counselorIds[i]];
        }
}
}
