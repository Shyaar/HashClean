// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Errors} from "./utils/errors/Errors.sol";
import {Events} from "./utils/events/Events.sol";


contract UserRegistry {



    struct UserDetails {
        string name;
        string avatar;
    }

    UserDetails[] public allUsers;
    mapping(address => UserDetails) public users;
    mapping(address => bool) private userHasRegistered;
    uint256 private totalRegistered;

    function userRegistration(string calldata _name, string calldata _avatar) external {
        if (userHasRegistered[msg.sender]) {
            revert Errors.UserAlreadyRegistered();
        }

        userHasRegistered[msg.sender] = true;
        
        UserDetails memory uD = UserDetails({
            name:_name,
            avatar:_avatar
        });

        users[msg.sender] = uD;
        
        allUsers.push(users[msg.sender]);

        totalRegistered++;


        emit Events.UserRegistered(msg.sender,users[msg.sender].name);
    }


    function getUserHasRegistered(address _userAddress) external view returns (bool) {
        return userHasRegistered[_userAddress];
    }


}