// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { UserRegistry } from "../src/userRegistry.sol";
import { CounselorRegistry } from "../src/couselorRegistry.sol";
import { Novana } from "../src/novana.m.sol";
import { BookingManager } from "../src/bookingManager.sol";

contract DeployNovana is Script {
    function run() external {

        vm.startBroadcast();

        // === 1. Deploy UserRegistry ===
        UserRegistry userRegistry = new UserRegistry();
        console.log(" UserRegistry deployed at:", address(userRegistry));

        // === 2. Deploy CounselorRegistry ===
        CounselorRegistry counselorRegistry = new CounselorRegistry();
        console.log("CounselorRegistry deployed at:", address(counselorRegistry));

        // === 3. Deploy SupportRoom (needs both registries) ===
        Novana novana = new Novana(
            address(userRegistry),
            address(counselorRegistry)
        );
        console.log("SupportRoom deployed at:", address(novana));

        // === 4. Deploy SessionManager ===
        BookingManager bookingManager = new BookingManager();
        console.log(" SessionManager deployed at:", address(bookingManager));

        vm.stopBroadcast();
    }
}
