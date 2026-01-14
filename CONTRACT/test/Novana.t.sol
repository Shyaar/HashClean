// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {Novana} from "../src/novana.m.sol";
import {UserRegistry} from "../src/userRegistry.sol";
import {CounselorRegistry} from "../src/couselorRegistry.sol";
import {PlatformErrors} from "../src/utils/errors/platformErrors.sol";

// Mock Contracts
contract MockUserRegistry is UserRegistry {
    mapping(address => bool) public registeredUsers;

    function getUserHasRegistered(address _user) external view override returns (bool) {
        return registeredUsers[_user];
    }

    function setUserRegistered(address _user, bool _isRegistered) external {
        registeredUsers[_user] = _isRegistered;
    }
}

contract MockCounselorRegistry is CounselorRegistry {
    mapping(address => bool) public registeredCounselors;

    function isACounselor(address _counselor) external view override returns (bool) {
        return registeredCounselors[_counselor];
    }

    function setCounselorRegistered(address _counselor, bool _isRegistered) external {
        registeredCounselors[_counselor] = _isRegistered;
    }
}


contract NovanaTest is Test {
    Novana public novana;
    MockUserRegistry public mockUserRegistry;
    MockCounselorRegistry public mockCounselorRegistry;

    address public owner;
    address public user1;
    address public user2;
    address public unregisteredUser;
    address public counselor;

    function setUp() public {
        owner = vm.addr(1);
        user1 = vm.addr(2);
        user2 = vm.addr(3);
        unregisteredUser = vm.addr(4);
        counselor = vm.addr(5);

        mockUserRegistry = new MockUserRegistry();
        mockCounselorRegistry = new MockCounselorRegistry();

        vm.prank(owner);
        novana = new Novana(address(mockUserRegistry), address(mockCounselorRegistry));
        
        // Register users
        mockUserRegistry.setUserRegistered(user1, true);
        mockUserRegistry.setUserRegistered(user2, true);
        mockCounselorRegistry.setCounselorRegistered(counselor, true);

    }

    // Test cases for createRoom
    function testCreateRoom_Public_Success() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Public Room", false);
        
        Novana.RoomView[] memory myRooms = novana.getMyRooms();
        assertEq(myRooms.length, 1);
        assertEq(myRooms[0].id, roomId);
        assertEq(myRooms[0].creator, user1);
        assertEq(myRooms[0].topic, "Public Room");
        assertFalse(myRooms[0].isPrivate);
    }
    
    function testCreateRoom_Private_Success() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Private Room", true);

        Novana.RoomView[] memory myRooms = novana.getMyRooms();
        assertEq(myRooms.length, 1);
        assertTrue(myRooms[0].isPrivate);
    }

    function testCreateRoom_Revert_UnregisteredUser() public {
        vm.prank(unregisteredUser);
        vm.expectRevert(PlatformErrors.OnlyRegisteredUser.selector);
        novana.createRoom("Should Fail", false);
    }

    // Test cases for joinRoom
    function testJoinRoom_Public_Success() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Public Room", false);

        vm.prank(user2);
        novana.joinRoom(roomId);
        
        vm.prank(user2);
        Novana.RoomView[] memory myRooms = novana.getMyRooms();
        assertEq(myRooms.length, 1);
        assertEq(myRooms[0].id, roomId);
    }
    
    function testJoinRoom_Revert_AlreadyMember() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Public Room", false);

        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(PlatformErrors.AlreadyMember.selector, roomId, user1));
        novana.joinRoom(roomId);
    }

    function testJoinRoom_Revert_PrivateRoom() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Private Room", true);
        
        vm.prank(user2);
        vm.expectRevert(abi.encodeWithSelector(PlatformErrors.NotAuthorized.selector, "Private rooms require invite"));
        novana.joinRoom(roomId);
    }

    function testJoinRoom_Revert_UnregisteredUser() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Public Room", false);
        
        vm.prank(unregisteredUser);
        vm.expectRevert(PlatformErrors.OnlyRegisteredUser.selector);
        novana.joinRoom(roomId);
    }

    // Test cases for addMemberToPrivateRoom
    function testAddMemberToPrivateRoom_Success() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Private Room", true);

        vm.prank(user1);
        novana.addMemberToPrivateRoom(roomId, user2);

        vm.prank(user2);
        Novana.RoomView[] memory myRooms = novana.getMyRooms();
        assertEq(myRooms.length, 1);
        assertEq(myRooms[0].id, roomId);
    }

    function testAddMemberToPrivateRoom_Revert_NotCreator() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Private Room", true);

        vm.prank(user2);
        vm.expectRevert(PlatformErrors.OnlyRoomCreatorOrOwner.selector);
        novana.addMemberToPrivateRoom(roomId, user2);
    }
    
    function testAddMemberToPrivateRoom_Revert_AlreadyMember() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Private Room", true);

        vm.prank(user1);
        novana.addMemberToPrivateRoom(roomId, user2);
        
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(PlatformErrors.AlreadyMember.selector, roomId, user2));
        novana.addMemberToPrivateRoom(roomId, user2);
    }

    // Test cases for leaveRoom
    function testLeaveRoom_Success() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Public Room", false);

        vm.prank(user1);
        novana.leaveRoom(roomId);
        
        vm.prank(user1);
        Novana.RoomView[] memory myRooms = novana.getMyRooms();
        assertEq(myRooms.length, 0);
    }

    function testLeaveRoom_Revert_NotMember() public {
        vm.prank(user1);
        uint256 roomId = novana.createRoom("Public Room", false);
        
        vm.prank(user2);
        vm.expectRevert(abi.encodeWithSelector(PlatformErrors.NotMember.selector, roomId, user2));
        novana.leaveRoom(roomId);
    }
    
    // Test cases for getMyRooms
    function testGetMyRooms() public {
        vm.prank(user1);
        uint256 roomId1 = novana.createRoom("Room 1", false);
        uint256 roomId2 = novana.createRoom("Room 2", true);

        vm.prank(user2);
        novana.joinRoom(roomId1);
        
        vm.prank(user1);
        Novana.RoomView[] memory user1Rooms = novana.getMyRooms();
        assertEq(user1Rooms.length, 2);
        
        vm.prank(user2);
        Novana.RoomView[] memory user2Rooms = novana.getMyRooms();
        assertEq(user2Rooms.length, 1);
    }

    // Test cases for getAllRooms
    function testGetAllRooms() public {
        vm.prank(user1);
        novana.createRoom("Room 1", false);
        
        vm.prank(user2);
        novana.createRoom("Room 2", true);
        
        Novana.RoomView[] memory allRooms = novana.getAllRooms();
        assertEq(allRooms.length, 2);
    }
}
