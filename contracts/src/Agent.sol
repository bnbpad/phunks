// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Agent {
    address public immutable launchpad;

    constructor(address _launchpad) {
        launchpad = _launchpad;
    }

    function executeAction(address to, bytes memory data, uint256 value) public {
        require(msg.sender == launchpad, "Not authorized");
        (bool success,) = to.call{value: value}(data);
        require(success, "Action failed");
    }
}
