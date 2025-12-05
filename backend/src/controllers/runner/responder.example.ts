/**
 * Example usage of AgentResponder
 *
 * This file demonstrates how to use the AgentResponder class
 * to respond to agent requests on the AgentLaunchpad contract.
 */

import { ethers } from "ethers";
import { AgentResponder } from "./responder";

async function example() {
  // Initialize the responder
  const responder = new AgentResponder();

  // Check authorization (signer must match AVS address)
  const isAuthorized = await responder.isAuthorized();
  if (!isAuthorized) {
    console.error("❌ Signer is not authorized (does not match AVS address)");
    return;
  }

  console.log(`✅ Signer is authorized: ${responder.getSignerAddress()}`);

  // Example 1: Respond with an action (actionId = 0)
  // This executes a transaction on behalf of the agent
  const actionHash =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

  try {
    const actionResult = await responder.respondWithAction({
      hash: actionHash,
      to: "0x742d35Cc6634C0532925a3b8D91d99e2c4b851E8", // Example address
      data: "0x", // Encoded function call data (empty in this example)
      value: "0", // Value in wei (can be "0", 0n, or "1000000000000000000" for 1 BNB)
    });

    console.log("Action response transaction:", actionResult);
  } catch (error) {
    console.error("Failed to respond with action:", error);
  }

  // Example 2: Respond with an upgrade (actionId = 1)
  // This stores a memory string for the agent
  const upgradeHash =
    "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

  try {
    const upgradeResult = await responder.respondWithUpgrade({
      hash: upgradeHash,
      memory:
        "Agent has learned to trade more effectively based on market conditions.",
    });

    console.log("Upgrade response transaction:", upgradeResult);
  } catch (error) {
    console.error("Failed to respond with upgrade:", error);
  }

  // Example 3: Check request status
  const checkHash =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const request = await responder.getRequest(checkHash);
  if (request) {
    console.log("Request status:", {
      agent: request.agent,
      status: request.status.toString(), // 0 = unregistered, 1 = pending, 2 = completed
      actionId: request.actionId.toString(), // 0 = action, 1 = upgrade
    });
  } else {
    console.log("Request not found");
  }
}

// Example: Encoding function call data
// If you need to call a function on another contract, you can encode it like this:
function encodeFunctionCall(
  functionName: string,
  params: any[],
  abi: any[]
): string {
  const iface = new ethers.Interface(abi);
  return iface.encodeFunctionData(functionName, params);
}

// Example usage:
// const erc20TransferData = encodeFunctionCall(
//   "transfer",
//   ["0x742d35Cc6634C0532925a3b8D91d99e2c4b851E8", ethers.parseEther("100")],
//   ERC20_ABI
// );
//
// await responder.respondWithAction({
//   hash: actionHash,
//   to: tokenAddress,
//   data: erc20TransferData,
//   value: "0",
// });
