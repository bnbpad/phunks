// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {AgentNFT} from "../src/AgentNFT.sol";
import {AgentLaunchpad} from "../src/AgentLaunchpad.sol";

contract DeployScript is Script {
    AgentNFT public agentNFT;
    AgentLaunchpad public agentLaunchpad;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy contracts
        agentNFT = new AgentNFT();
        agentLaunchpad = new AgentLaunchpad();

        // Initialize contracts
        address deployer = msg.sender; // Use the deployer as owner
        agentNFT.initialize("Phunks", "Punks", deployer);
        agentLaunchpad.initialize(deployer);

        // Note: AgentLaunchpad needs agentNFT to be set, but there's no setter in the contract
        // You may need to add a setAgentNFT function to AgentLaunchpad or set it in the constructor

        address avs = address(0xA1a629d832972DB3b84A4f5Fa42d50eFF7c8F8dE);
        agentLaunchpad.setAVS(avs);

        vm.stopBroadcast();
    }
}
