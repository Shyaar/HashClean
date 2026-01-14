// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {UserRegistry} from "../src/userRegistry.sol";
import {Errors} from "../src/utils/errors/Errors.sol"; // General Errors, not specific to UserRegistry

contract UserRegistryTest is Test {
    UserRegistry public userRegistry;

    address public user1;
    address public user2;

    function setUp() public {
        userRegistry = new UserRegistry();
        user1 = vm.addr(1);
        user2 = vm.addr(2);
    }

    // Test cases for userRegistration
    function testUserRegistration_Success() public {
        vm.prank(user1);
        userRegistry.userRegistration("Alice", "alice_avatar_url");

        assertTrue(userRegistry.getUserHasRegistered(user1));
        UserRegistry.UserDetails memory userDetails = userRegistry.users(user1);
        assertEq(userDetails.name, "Alice");
        assertEq(userDetails.avatar, "alice_avatar_url");

        // Assuming Events.sol is correctly imported and event is emitted
        // vm.expectEmit(true, true, true, true);
        // emit Events.UserRegistered(user1, "Alice");
    }

    function testUserRegistration_Revert_AlreadyRegistered() public {
        vm.prank(user1);
        userRegistry.userRegistration("Alice", "alice_avatar_url");

        vm.prank(user1);
        vm.expectRevert(Errors.UserAlreadyRegistered.selector);
        userRegistry.userRegistration("Alice_again", "new_avatar_url");
    }

    // Test cases for getUserHasRegistered
    function testGetUserHasRegistered_True() public {
        vm.prank(user1);
        userRegistry.userRegistration("Bob", "bob_avatar_url");

        assertTrue(userRegistry.getUserHasRegistered(user1));
    }

    function testGetUserHasRegistered_False() public {
        assertFalse(userRegistry.getUserHasRegistered(user2));
    }
}