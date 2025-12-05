// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {AgentNFT} from "../src/AgentNFT.sol";
import {AgentLaunchpad} from "../src/AgentLaunchpad.sol";

contract CounterScript is Script {
    AgentNFT public agentNFT;
    AgentLaunchpad public agentLaunchpad;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // counter = new Counter();
        agentNFT = new AgentNFT();
        agentLaunchpad = new AgentLaunchpad();

        agentNFT.initialize("Phunks", "Punks", address(this));
        agentLaunchpad.initialize(address(agentNFT));

        vm.stopBroadcast();
    }
}
