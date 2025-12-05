// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Agent.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol";

interface IAgentNFT {
    struct AgentMetadata {
        string persona; // JSON-encoded string for character traits, style, tone
        string experience; // Short summary string for agent's role/purpose
        string voiceHash; // Reference ID to stored audio profile
        string animationURI; // URI to video or animation file
        string vaultURI; // URI to the agent's vault (extended data storage)
        bytes32 vaultHash; // Hash of the vault contents for verification
    }

    function createAgent(
        address to,
        address logicAddress,
        string memory metadataURI,
        AgentMetadata memory extendedMetadata
    ) external returns (uint256);
}

contract AgentLaunchpad is Initializable, OwnableUpgradeable {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    EnumerableSet.Bytes32Set private _pendingTxs;

    address public agentNFT;

    struct AgentRequest {
        address agent;
        uint256 status; // 0 -> unregistered, 1 -> pending, 2 -> completed
        uint256 actionId; // 0 -> action, 1 -> upgrade;
    }

    struct AgentInformation {
        address agent;
        address token;
        string goal;
        string brainMemory;
    }

    address public avs;
    mapping(bytes32 => AgentRequest) public requests;
    mapping(bytes32 => string) public goals;
    mapping(bytes32 => string) public memories;

    mapping(uint256 => AgentInformation) public agentInformation;

    event AgentActionRequest(bytes32 indexed hash, address indexed agentAddress, uint256 actionId);
    event AgentActionResponse(
        bytes32 indexed hash, address indexed agentAddress, bytes response, address dest, uint256 value
    );
    event AgentActionUpgrade(bytes32 indexed hash, address indexed agentAddress, string _memory);
    event AgentCreated(uint256 indexed tokenId, address indexed owner, address logicAddress, string metadataURI);

    function initialize(address _owner, address _agentNFT) public initializer {
        __Ownable_init(_owner);
        agentNFT = _agentNFT;
    }

    function setAVS(address _avs) public onlyOwner {
        avs = _avs;
    }

    function createAgent(
        address fourToken,
        string memory goal,
        string memory brainMemory,
        string memory persona,
        string memory experience
    ) public {
        string memory metadataURI = "";
        IAgentNFT.AgentMetadata memory metadata = IAgentNFT.AgentMetadata(persona, experience, "", "", "", "");

        // create the logic contract for the agent
        address logicAddress = address(new Agent(address(this)));

        uint256 tokenId = IAgentNFT(agentNFT).createAgent(msg.sender, logicAddress, metadataURI, metadata);
        agentInformation[tokenId] = AgentInformation(msg.sender, fourToken, goal, brainMemory);
        emit AgentCreated(tokenId, msg.sender, logicAddress, metadataURI);
    }

    function sendRequest(address agent, uint256 actionId) public {
        bytes32 hash = keccak256(abi.encode(agent, actionId, block.timestamp));
        requests[hash] = AgentRequest(agent, 1, actionId);
        _pendingTxs.add(hash);
        emit AgentActionRequest(hash, agent, actionId);
    }

    function getPendingTxs() public view returns (bytes32[] memory, AgentRequest[] memory) {
        bytes32[] memory hashes = _pendingTxs.values();
        AgentRequest[] memory requestsList = new AgentRequest[](hashes.length);
        for (uint256 i = 0; i < hashes.length; i++) {
            requestsList[i] = requests[hashes[i]];
        }
        return (hashes, requestsList);
    }

    function respondWithAction(bytes32 hash, address to, bytes memory data, uint256 value) public {
        require(requests[hash].status == 1, "Request not found");
        require(requests[hash].actionId == 0, "Invalid action ID");
        require(msg.sender == avs, "Not authorized");
        requests[hash].status = 2;
        _pendingTxs.remove(hash);
        Agent(payable(requests[hash].agent)).executeAction(to, data, value);
        emit AgentActionResponse(hash, requests[hash].agent, data, to, value);
    }

    function respondWithUpgrade(bytes32 hash, string memory _memory) public {
        require(requests[hash].status == 1, "Request not found");
        require(requests[hash].actionId == 1, "Invalid action ID");
        require(msg.sender == avs, "Not authorized");
        requests[hash].status = 2;
        _pendingTxs.remove(hash);
        memories[hash] = _memory;
        emit AgentActionUpgrade(hash, requests[hash].agent, _memory);
    }
}
