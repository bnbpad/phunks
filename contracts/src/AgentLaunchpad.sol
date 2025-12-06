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
    ) external payable returns (uint256);
}

contract AgentLaunchpad is Initializable, OwnableUpgradeable {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    EnumerableSet.Bytes32Set private _pendingTxs;

    address public agentNFT;

    enum Status {
        UNREGISTERED,
        PENDING,
        COMPLETED
    }

    struct AgentRequest {
        address agent;
        address token;
        Status status;
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
    mapping(address => bool) public isAgent;
    mapping(address => address) public tokenToAgent;
    mapping(address => address) public agentToToken;

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

        // we need to create 3 agents for the launchpad to bypass the free minting;
        // a techincal bug which we can request to fix later.
        IAgentNFT.AgentMetadata memory dummy = IAgentNFT.AgentMetadata(
            "{}",
            "Dummy Experience",
            "",
            "ipfs://QmAgentAnimation456",
            "https://gateway.pinata.cloud/ipfs/QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb",
            0x7b7d000000000000000000000000000000000000000000000000000000000000
        );
        string memory metadataURI = "https://gateway.pinata.cloud/ipfs/QmdQH3hiJjHcGCPgXodBuKmZdKuaTw7dBLGTfWUkcvCooA";
        IAgentNFT(agentNFT).createAgent(address(this), address(0), metadataURI, dummy);
        IAgentNFT(agentNFT).createAgent(address(this), address(0), metadataURI, dummy);
        IAgentNFT(agentNFT).createAgent(address(this), address(0), metadataURI, dummy);
    }

    function setAVS(address _avs) public onlyOwner {
        avs = _avs;
    }

    modifier onlyAVS() {
        require(msg.sender == avs, "Not authorized");
        _;
    }

    function createAgent(
        address fourToken,
        string memory goal,
        string memory brainMemory,
        string memory persona,
        string memory experience
    ) public payable returns (address agentAddress) {
        string memory metadataURI = "https://gateway.pinata.cloud/ipfs/QmdQH3hiJjHcGCPgXodBuKmZdKuaTw7dBLGTfWUkcvCooA";
        IAgentNFT.AgentMetadata memory metadata = IAgentNFT.AgentMetadata(
            persona,
            experience,
            "",
            "ipfs://QmAgentAnimation456",
            "https://gateway.pinata.cloud/ipfs/QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb",
            0x7b7d000000000000000000000000000000000000000000000000000000000000
        );

        // create the logic contract for the agent
        agentAddress = address(new Agent(address(this)));
        isAgent[agentAddress] = true;
        tokenToAgent[fourToken] = agentAddress;
        agentToToken[agentAddress] = fourToken;

        uint256 tokenId =
            IAgentNFT(agentNFT).createAgent{value: msg.value}(msg.sender, address(this), metadataURI, metadata);
        agentInformation[tokenId] = AgentInformation(msg.sender, fourToken, goal, brainMemory);
        emit AgentCreated(tokenId, msg.sender, agentAddress, metadataURI);
    }

    function sendRequest(address agent, uint256 actionId) public {
        require(tokenToAgent[agent] != address(0), "Agent not found");
        address token = tokenToAgent[agent];
        bytes32 hash = keccak256(abi.encode(token, actionId, block.timestamp));
        requests[hash] = AgentRequest(agent, token, Status.PENDING, actionId);
        _pendingTxs.add(hash);
        emit AgentActionRequest(hash, token, actionId);
    }

    function getPendingTxs() public view returns (bytes32[] memory, AgentRequest[] memory) {
        bytes32[] memory hashes = _pendingTxs.values();
        AgentRequest[] memory requestsList = new AgentRequest[](hashes.length);
        for (uint256 i = 0; i < hashes.length; i++) {
            requestsList[i] = requests[hashes[i]];
        }
        return (hashes, requestsList);
    }

    /**
     * @dev Respond with an action to the agent
     * @param hash The hash of the request
     * @param to The address to send the action to
     * @param data The data to send to the agent
     * @param value The value to send to the agent
     * @notice The action is executed by the agent and the response is emitted
     */
    function respondWithAction(bytes32 hash, address to, bytes memory data, uint256 value) public onlyAVS {
        require(requests[hash].status == Status.PENDING, "Request not found");
        require(requests[hash].actionId == 0, "Invalid action ID");
        requests[hash].status = Status.COMPLETED;
        _pendingTxs.remove(hash);
        Agent(payable(requests[hash].agent)).executeAction(to, data, value);
        emit AgentActionResponse(hash, requests[hash].agent, data, to, value);
    }

    /**
     * @dev Respond with an upgrade to the agent
     * @param hash The hash of the request
     * @param _memory The memory to upgrade the agent with
     * @notice The agent is upgraded and the memory is stored
     */
    function respondWithUpgrade(bytes32 hash, string memory _memory) public onlyAVS {
        require(requests[hash].status == Status.PENDING, "Request not found");
        require(requests[hash].actionId == 1, "Invalid action ID");
        requests[hash].status = Status.COMPLETED;
        _pendingTxs.remove(hash);
        memories[hash] = _memory;
        emit AgentActionUpgrade(hash, requests[hash].agent, _memory);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
        public
        view
        returns (bytes4)
    {
        // do nothing
        return this.onERC721Received.selector;
    }
}
