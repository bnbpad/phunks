// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {AgentNFT} from "../src/AgentNFT.sol";

contract CounterScript is Script {
    AgentNFT public agentNFT;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // counter = new Counter();
        agentNFT = new AgentNFT();

        vm.stopBroadcast();
    }
}
