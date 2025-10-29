// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { bookingErrors } from "./utils/errors/bookingErrors.sol";
import { bookingEvents } from "./utils/events/bookingEvents.sol";


contract BookingManager {
    
    enum SessionStatus { 
        Empty, 
        Offered, 
        Booked, 
        Completed, 
        Cancelled, 
        NoShow
        }

    struct Session {
        uint256 id;        
        address counselor;
        address user;           
        uint256 startTime;     
        uint256 duration;       
        uint256 fee;            
        SessionStatus status;
    }

    uint256 private nextSessionId = 1;

    mapping(uint256 => Session) public sessions;


    mapping(uint256 => mapping(address => uint256)) public escrowed;

    mapping(address => uint256[]) public s_userBookedSessions;
    mapping(address => uint256[]) public s_counselorBookedSessions;


    uint256 public constant CANCEL_FULL_WINDOW = 3600; 
    uint256 public constant LATE_CANCEL_PENALTY_PCT = 50;
  


    function offerSession(uint256 _startTime, uint256 _duration, uint256 _fee) external returns (uint256) {
       
        if (_startTime <= block.timestamp) revert bookingErrors.StartTimeInPast();
        if (_duration == 0) revert bookingErrors.InvalidDuration();

        uint256 sid = nextSessionId++;

        sessions[sid] = Session({
            id: sid,
            counselor: msg.sender,
            user: address(0),
            startTime: _startTime,
            duration: _duration,
            fee: _fee,
            status: SessionStatus.Offered
        });

        emit bookingEvents.SessionOffered(sid, msg.sender, _startTime, _duration, _fee);
        return sid;
    }


    function bookSession(uint256 _sessionId) external payable {

        Session storage s = sessions[_sessionId];
        
        if (s.id == 0) revert bookingErrors.SessionNotFound();

        if (s.status != SessionStatus.Offered) revert bookingErrors.SessionNotAvailable();

        if (msg.value != s.fee) revert bookingErrors.IncorrectPayment();

        if (block.timestamp >= s.startTime) revert bookingErrors.SessionAlreadyStarted();


        s.user = msg.sender;
        s.status = SessionStatus.Booked;
        s_userBookedSessions[msg.sender].push(s.id);
        s_counselorBookedSessions[s.counselor].push(s.id);
        escrowed[_sessionId][msg.sender] = msg.value;

        emit bookingEvents.SessionBooked(_sessionId, msg.sender, msg.value);
    }


    function cancelSessionByUser(uint256 _sessionId) external {

        Session storage s = sessions[_sessionId];

        if (s.id == 0) revert bookingErrors.SessionNotFound();

        if (s.status != SessionStatus.Booked) revert bookingErrors.SessionNotBooked();

        if (s.user != msg.sender) revert bookingErrors.NotBooker();

        uint256 refundAmount = 0;
        uint256 penaltyAmount = 0;

        if (block.timestamp + CANCEL_FULL_WINDOW <= s.startTime) {
            refundAmount = escrowed[_sessionId][msg.sender];
        } else {
           
            penaltyAmount = (escrowed[_sessionId][msg.sender] * LATE_CANCEL_PENALTY_PCT) / 100;
            refundAmount = escrowed[_sessionId][msg.sender] - penaltyAmount;
           
            if (penaltyAmount > 0) {
                (bool success, ) = payable(s.counselor).call{value: penaltyAmount}("");
                require(success, "penalty transfer failed");
            }
        }

        escrowed[_sessionId][msg.sender] = 0;
        s.status = SessionStatus.Cancelled;
        
        address booker = s.user;
        s.user = address(0);

       
        if (refundAmount > 0) {
            (bool success, ) = payable(booker).call{value: refundAmount}("");
            require(success, "refund failed");
        }

        emit bookingEvents.SessionCancelled(_sessionId, msg.sender, "user_cancel", refundAmount, penaltyAmount);
    }


    function cancelSessionByCounselor(uint256 _sessionId) external {

        Session storage s = sessions[_sessionId];

        if (s.id == 0) revert bookingErrors.SessionNotFound();

        if (s.status != SessionStatus.Offered && s.status != SessionStatus.Booked) revert bookingErrors.CannotCancelSession();

        if (msg.sender != s.counselor) revert bookingErrors.NotCounselor();

        uint256 refundAmount = escrowed[_sessionId][msg.sender];

        escrowed[_sessionId][msg.sender] = 0;

        address bookedUser = s.user;

        s.status = SessionStatus.Cancelled;

        s.user = address(0);

        if (refundAmount > 0 && bookedUser != address(0)) {
            (bool success, ) = payable(bookedUser).call{value: refundAmount}("");
            require(success, "refund failed");
        }

        emit bookingEvents.SessionCancelled(_sessionId, msg.sender, "counselor_cancel", refundAmount, 0);
    }


    function completeSession(uint256 _sessionId) external {

        Session storage s = sessions[_sessionId];

        if (s.id == 0) revert bookingErrors.SessionNotFound();

        if (s.status != SessionStatus.Booked) revert bookingErrors.SessionNotBooked();

        if (msg.sender != s.counselor) revert bookingErrors.NotCounselor();

        uint256 amount = escrowed[_sessionId][msg.sender];

        if (amount == 0) revert bookingErrors.NoFunds();

        escrowed[_sessionId][msg.sender] = 0;

        s.status = SessionStatus.Completed;

        
        (bool success, ) = payable(s.counselor).call{value: amount}("");
        require(success, "transfer failed");


        emit bookingEvents.SessionCompleted(_sessionId, s.counselor, s.user);

    }


    function markNoShowAndRefund(uint256 _sessionId, bool _userNoShow) external {

        Session storage s = sessions[_sessionId];

        if (s.id == 0) revert bookingErrors.SessionNotFound();

        if (s.status != SessionStatus.Booked) revert bookingErrors.SessionNotBooked();

        uint256 amount = escrowed[_sessionId][msg.sender];
        escrowed[_sessionId][msg.sender] = 0;

        s.status = SessionStatus.NoShow; 

        if (_userNoShow) {
            if (amount > 0) {
                (bool success, ) = payable(s.counselor).call{value: amount}("");
                require(success, "transfer to counselor failed"); 
            }
            emit bookingEvents.SessionNoShow(_sessionId, s.user); 

        } else {
            
            if (amount > 0) {
                (bool success, ) = payable(s.user).call{value: amount}("");
                require(success, "refund to user failed");
            }
            emit bookingEvents.SessionNoShow(_sessionId, s.counselor); 
        }
    }


    function getSession(uint256 _sessionId) external view returns (Session memory) {
        return sessions[_sessionId];
    }

    function getMyBookedSessions() external view returns (uint256[] memory) {
        return s_userBookedSessions[msg.sender];
    }

    function getCounselorBookedSessions(address _counselor) external view returns (uint256[] memory) {
        return s_counselorBookedSessions[_counselor];
    }

    function getSessionDetails(uint256 _sessionId) external view returns (Session memory) {
        Session storage s = sessions[_sessionId];
        if (msg.sender != s.user && msg.sender != s.counselor) {
            revert bookingErrors.NotAuthorized();
        }
        return s;
    }
}
