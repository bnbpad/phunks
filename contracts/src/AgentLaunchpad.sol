// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Agent.sol";

contract AgentLaunchpad {
    struct AgentRequest {
        address agent;
        uint256 status; // 0 -> unregistered, 1 -> pending, 2 -> completed
    }

    mapping(bytes32 => AgentRequest) public requests;
    mapping(bytes32 => string) public goals;
    mapping(bytes32 => string) public memories;

    event AgentActionRequest(bytes32 indexed hash, address indexed agentAddress, uint256 actionId);
    event AgentActionResponse(
        bytes32 indexed hash, address indexed agentAddress, bytes response, address dest, uint256 value
    );
    event AgentActionUpgrade(bytes32 indexed hash, address indexed agentAddress, string _memory);

    function sendRequest(uint256 actionId) public {
        bytes32 hash = keccak256(abi.encode(msg.sender, actionId, block.timestamp));
        requests[hash] = AgentRequest(msg.sender, 1);
        emit AgentActionRequest(hash, msg.sender, actionId);
    }

    function respondWithAction(bytes32 hash, address to, bytes memory data, uint256 value) public {
        require(requests[hash].status == 1, "Request not found");
        requests[hash].status = 2;
        Agent(requests[hash].agent).executeAction(to, data, value);
        emit AgentActionResponse(hash, requests[hash].agent, data, to, value);
    }

    function respondWithUpgrade(bytes32 hash, string memory _memory) public {
        require(requests[hash].status == 1, "Request not found");
        requests[hash].status = 2;
        memories[hash] = _memory;
        emit AgentActionUpgrade(hash, requests[hash].agent, _memory);
    }
}
