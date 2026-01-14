// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {BookingManager} from "../src/bookingManager.sol";
import {bookingErrors} from "../src/utils/errors/bookingErrors.sol";

contract BookingManagerTest is Test {
    BookingManager public bookingManager;

    address public COUNSELOR = vm.addr(1);
    address public USER = vm.addr(2);
    address public OTHER_USER = vm.addr(3);

    function setUp() public {
        bookingManager = new BookingManager();
    }

    // Test cases for offerSession
    function testOfferSession_Success() public {
        vm.prank(COUNSELOR);
        uint256 startTime = block.timestamp + 3600; // 1 hour from now
        uint256 duration = 1800; // 30 minutes
        uint256 fee = 1 ether;

        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionOffered(1, COUNSELOR, startTime, duration, fee);

        uint256 sessionId = bookingManager.offerSession(startTime, duration, fee);
        assertEq(sessionId, 1);

        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(session.id, 1);
        assertEq(session.counselor, COUNSELOR);
        assertEq(session.user, address(0));
        assertEq(session.startTime, startTime);
        assertEq(session.duration, duration);
        assertEq(session.fee, fee);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.Offered));
    }

    function testOfferSession_Revert_StartTimeInPast() public {
        vm.prank(COUNSELOR);
        uint256 startTime = block.timestamp - 1;
        uint256 duration = 1800;
        uint256 fee = 1 ether;

        vm.expectRevert(bookingErrors.StartTimeInPast.selector);
        bookingManager.offerSession(startTime, duration, fee);
    }

    function testOfferSession_Revert_InvalidDuration() public {
        vm.prank(COUNSELOR);
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 0;
        uint256 fee = 1 ether;

        vm.expectRevert(bookingErrors.InvalidDuration.selector);
        bookingManager.offerSession(startTime, duration, fee);
    }

    // Helper to offer a session
    function _offerSession(address _counselor, uint256 _startTime, uint256 _duration, uint256 _fee) internal returns (uint256) {
        vm.prank(_counselor);
        return bookingManager.offerSession(_startTime, _duration, _fee);
    }

    // Test cases for bookSession
    function testBookSession_Success() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee); // Fund the user

        vm.prank(USER);
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionBooked(sessionId, USER, fee);

        bookingManager.bookSession{value: fee}(sessionId);

        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(session.user, USER);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.Booked));
        assertEq(bookingManager.escrowed(sessionId, USER), fee);
        assertEq(bookingManager.s_userBookedSessions(USER, 0), sessionId);
        assertEq(bookingManager.s_counselorBookedSessions(COUNSELOR, 0), sessionId);
    }

    function testBookSession_Revert_SessionNotFound() public {
        vm.prank(USER);
        vm.expectRevert(bookingErrors.SessionNotFound.selector);
        bookingManager.bookSession(999);
    }

    function testBookSession_Revert_SessionNotAvailable() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        // Book the session once to make it unavailable
        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        // Attempt to book again
        vm.prank(OTHER_USER);
        vm.expectRevert(bookingErrors.SessionNotAvailable.selector);
        bookingManager.bookSession{value: fee}(sessionId);
    }

    function testBookSession_Revert_IncorrectPayment() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee - 0.1 ether); // Insufficient funds
        vm.prank(USER);
        vm.expectRevert(bookingErrors.IncorrectPayment.selector);
        bookingManager.bookSession{value: fee - 0.1 ether}(sessionId);
    }

    function testBookSession_Revert_SessionAlreadyStarted() public {
        uint256 startTime = block.timestamp + 10; // Starts soon
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.warp(startTime + 1); // Advance time past start time

        vm.deal(USER, fee);
        vm.prank(USER);
        vm.expectRevert(bookingErrors.SessionAlreadyStarted.selector);
        bookingManager.bookSession{value: fee}(sessionId);
    }

    // Test cases for cancelSessionByUser
    function testCancelSessionByUser_FullRefund() public {
        uint256 startTime = block.timestamp + 7200; // 2 hours from now
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        uint256 userBalanceBefore = USER.balance;

        // Cancel within full refund window (3600s before start time)
        vm.prank(USER);
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionCancelled(sessionId, USER, "user_cancel", fee, 0);

        bookingManager.cancelSessionByUser(sessionId);

        assertEq(USER.balance, userBalanceBefore + fee);
        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.Cancelled));
        assertEq(bookingManager.escrowed(sessionId, USER), 0);
    }

    function testCancelSessionByUser_LateCancelPenalty() public {
        uint256 startTime = block.timestamp + 1800; // 30 minutes from now
        uint256 duration = 1800;
        uint256 fee = 1 ether; // 1000000000000000000 wei
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        uint256 userBalanceBefore = USER.balance;
        uint256 counselorBalanceBefore = COUNSELOR.balance;

        // Cancel after full refund window but before session start (e.g., 10 minutes before)
        vm.warp(block.timestamp + 1790); // Just before session start

        uint256 penalty = (fee * bookingManager.LATE_CANCEL_PENALTY_PCT()) / 100; // 50%
        uint256 refundAmount = fee - penalty; // 0.5 ether

        vm.prank(USER);
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionCancelled(sessionId, USER, "user_cancel", refundAmount, penalty);

        bookingManager.cancelSessionByUser(sessionId);

        assertEq(USER.balance, userBalanceBefore + refundAmount);
        assertEq(COUNSELOR.balance, counselorBalanceBefore + penalty);
        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.Cancelled));
        assertEq(bookingManager.escrowed(sessionId, USER), 0);
    }

    function testCancelSessionByUser_Revert_SessionNotFound() public {
        vm.prank(USER);
        vm.expectRevert(bookingErrors.SessionNotFound.selector);
        bookingManager.cancelSessionByUser(999);
    }

    function testCancelSessionByUser_Revert_SessionNotBooked() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee); // Offered, not booked

        vm.prank(USER);
        vm.expectRevert(bookingErrors.SessionNotBooked.selector);
        bookingManager.cancelSessionByUser(sessionId);
    }

    function testCancelSessionByUser_Revert_NotBooker() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        vm.prank(OTHER_USER); // Other user tries to cancel
        vm.expectRevert(bookingErrors.NotBooker.selector);
        bookingManager.cancelSessionByUser(sessionId);
    }

    // Test cases for cancelSessionByCounselor
    function testCancelSessionByCounselor_OfferedSession() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee); // Offered

        vm.prank(COUNSELOR);
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionCancelled(sessionId, COUNSELOR, "counselor_cancel", 0, 0);

        bookingManager.cancelSessionByCounselor(sessionId);

        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.Cancelled));
        assertEq(session.user, address(0));
    }

    function testCancelSessionByCounselor_BookedSession_RefundToUser() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        uint256 userBalanceBefore = USER.balance;

        vm.prank(COUNSELOR);
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionCancelled(sessionId, COUNSELOR, "counselor_cancel", fee, 0);

        bookingManager.cancelSessionByCounselor(sessionId);

        assertEq(USER.balance, userBalanceBefore + fee);
        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.Cancelled));
        assertEq(session.user, address(0));
        assertEq(bookingManager.escrowed(sessionId, USER), 0);
    }

    function testCancelSessionByCounselor_Revert_SessionNotFound() public {
        vm.prank(COUNSELOR);
        vm.expectRevert(bookingErrors.SessionNotFound.selector);
        bookingManager.cancelSessionByCounselor(999);
    }

    function testCancelSessionByCounselor_Revert_CannotCancelSession() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        // Complete the session
        vm.warp(startTime + duration + 1);
        vm.prank(COUNSELOR);
        bookingManager.completeSession(sessionId);

        // Try to cancel a completed session
        vm.prank(COUNSELOR);
        vm.expectRevert(bookingErrors.CannotCancelSession.selector);
        bookingManager.cancelSessionByCounselor(sessionId);
    }

    function testCancelSessionByCounselor_Revert_NotCounselor() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.prank(USER); // Other user tries to cancel
        vm.expectRevert(bookingErrors.NotCounselor.selector);
        bookingManager.cancelSessionByCounselor(sessionId);
    }

    // Test cases for completeSession
    function testCompleteSession_Success() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        uint256 counselorBalanceBefore = COUNSELOR.balance;

        vm.warp(startTime + duration + 1); // Advance time past session end

        vm.prank(COUNSELOR);
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionCompleted(sessionId, COUNSELOR, USER);

        bookingManager.completeSession(sessionId);

        assertEq(COUNSELOR.balance, counselorBalanceBefore + fee);
        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.Completed));
        assertEq(bookingManager.escrowed(sessionId, USER), 0);
    }

    function testCompleteSession_Revert_SessionNotFound() public {
        vm.prank(COUNSELOR);
        vm.expectRevert(bookingErrors.SessionNotFound.selector);
        bookingManager.completeSession(999);
    }

    function testCompleteSession_Revert_SessionNotBooked() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee); // Offered, not booked

        vm.prank(COUNSELOR);
        vm.expectRevert(bookingErrors.SessionNotBooked.selector);
        bookingManager.completeSession(sessionId);
    }

    function testCompleteSession_Revert_NotCounselor() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        vm.prank(USER); // User tries to complete
        vm.expectRevert(bookingErrors.NotCounselor.selector);
        bookingManager.completeSession(sessionId);
    }

    function testCompleteSession_Revert_NoFunds() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 0; // No fee
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        vm.warp(startTime + duration + 1);

        vm.prank(COUNSELOR);
        vm.expectRevert(bookingErrors.NoFunds.selector);
        bookingManager.completeSession(sessionId);
    }

    // Test cases for markNoShowAndRefund
    function testMarkNoShowAndRefund_UserNoShow() public {
        uint256 startTime = block.timestamp + 10;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        uint256 counselorBalanceBefore = COUNSELOR.balance;

        vm.warp(startTime + duration + 1); // After session end

        vm.prank(COUNSELOR); // Counselor marks user as no-show
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionNoShow(sessionId, USER);

        bookingManager.markNoShowAndRefund(sessionId, true);

        assertEq(COUNSELOR.balance, counselorBalanceBefore + fee);
        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.NoShow));
        assertEq(bookingManager.escrowed(sessionId, USER), 0);
    }

    function testMarkNoShowAndRefund_CounselorNoShow() public {
        uint256 startTime = block.timestamp + 10;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        uint256 userBalanceBefore = USER.balance;

        vm.warp(startTime + duration + 1); // After session end

        vm.prank(COUNSELOR); // Counselor marks counselor as no-show (implying refund to user)
        vm.expectEmit(true, true, true, true);
        emit bookingManager.SessionNoShow(sessionId, COUNSELOR);

        bookingManager.markNoShowAndRefund(sessionId, false);

        assertEq(USER.balance, userBalanceBefore + fee);
        BookingManager.Session memory session = bookingManager.sessions(sessionId);
        assertEq(uint8(session.status), uint8(BookingManager.SessionStatus.NoShow));
        assertEq(bookingManager.escrowed(sessionId, USER), 0);
    }

    function testMarkNoShowAndRefund_Revert_SessionNotFound() public {
        vm.prank(COUNSELOR);
        vm.expectRevert(bookingErrors.SessionNotFound.selector);
        bookingManager.markNoShowAndRefund(999, true);
    }

    function testMarkNoShowAndRefund_Revert_SessionNotBooked() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee); // Offered, not booked

        vm.prank(COUNSELOR);
        vm.expectRevert(bookingErrors.SessionNotBooked.selector);
        bookingManager.markNoShowAndRefund(sessionId, true);
    }

    // Test cases for view functions
    function testGetSession() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        BookingManager.Session memory session = bookingManager.getSession(sessionId);
        assertEq(session.id, sessionId);
        assertEq(session.counselor, COUNSELOR);
    }

    function testGetMyBookedSessions() public {
        uint256 startTime1 = block.timestamp + 3600;
        uint256 startTime2 = block.timestamp + 7200;
        uint256 duration = 1800;
        uint256 fee = 1 ether;

        uint256 sessionId1 = _offerSession(COUNSELOR, startTime1, duration, fee);
        uint256 sessionId2 = _offerSession(COUNSELOR, startTime2, duration, fee);

        vm.deal(USER, fee * 2);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId1);
        bookingManager.bookSession{value: fee}(sessionId2);

        vm.prank(USER);
        uint256[] memory bookedSessions = bookingManager.getMyBookedSessions();
        assertEq(bookedSessions.length, 2);
        assertEq(bookedSessions[0], sessionId1);
        assertEq(bookedSessions[1], sessionId2);
    }

    function testGetCounselorBookedSessions() public {
        uint256 startTime1 = block.timestamp + 3600;
        uint256 startTime2 = block.timestamp + 7200;
        uint256 duration = 1800;
        uint256 fee = 1 ether;

        uint256 sessionId1 = _offerSession(COUNSELOR, startTime1, duration, fee);
        uint256 sessionId2 = _offerSession(COUNSELOR, startTime2, duration, fee);

        vm.deal(USER, fee * 2);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId1);
        bookingManager.bookSession{value: fee}(sessionId2);

        uint256[] memory bookedSessions = bookingManager.getCounselorBookedSessions(COUNSELOR);
        assertEq(bookedSessions.length, 2);
        assertEq(bookedSessions[0], sessionId1);
        assertEq(bookedSessions[1], sessionId2);
    }

    function testGetSessionDetails_AuthorizedUser() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.deal(USER, fee);
        vm.prank(USER);
        bookingManager.bookSession{value: fee}(sessionId);

        vm.prank(USER);
        BookingManager.Session memory session = bookingManager.getSessionDetails(sessionId);
        assertEq(session.id, sessionId);
        assertEq(session.user, USER);

        vm.prank(COUNSELOR);
        session = bookingManager.getSessionDetails(sessionId);
        assertEq(session.id, sessionId);
        assertEq(session.counselor, COUNSELOR);
    }

    function testGetSessionDetails_Revert_NotAuthorized() public {
        uint256 startTime = block.timestamp + 3600;
        uint256 duration = 1800;
        uint256 fee = 1 ether;
        uint256 sessionId = _offerSession(COUNSELOR, startTime, duration, fee);

        vm.prank(OTHER_USER);
        vm.expectRevert(bookingErrors.NotAuthorized.selector);
        bookingManager.getSessionDetails(sessionId);
    }
}
