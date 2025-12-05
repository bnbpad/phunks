import { ethers } from "ethers";
import AgentLaunchpadABI from "./AgentLaunchpad.json";
import { ChainID } from "../../utils/constant";
import { _getProvider } from "../../utils/contract";

// Contract configuration
const CONTRACT_ADDRESS = "0x10c0043Dcd70054E8f040fa199FD5B3Ed2Dbb7A3";
const CHAIN_ID: ChainID = 56; // BSC Mainnet

// Event interface matching AgentActionRequest
export interface AgentActionRequestEvent {
  hash: string;
  agentAddress: string;
  actionId: bigint;
  blockNumber: number;
  transactionHash: string;
  blockHash: string;
}

// Event handler type
export type AgentActionRequestHandler = (
  event: AgentActionRequestEvent
) => void | Promise<void>;

/**
 * AgentRunner - Polls getPendingTxs from the AgentLaunchpad contract on BSC
 */
export class AgentRunner {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private isRunning = false;
  private pollInterval: NodeJS.Timeout | null = null;
  private processedHashes: Set<string> = new Set();
  private eventHandler: AgentActionRequestHandler | null = null;
  private pollIntervalMs: number;

  constructor(pollIntervalMs: number = 5000) {
    this.pollIntervalMs = pollIntervalMs;
    this.provider = _getProvider(CHAIN_ID);
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      AgentLaunchpadABI,
      this.provider
    );
  }

  /**
   * Poll getPendingTxs and process new requests
   */
  private async pollPendingTxs(): Promise<void> {
    try {
      // Call getPendingTxs
      const [hashes, requests] = await this.contract.getPendingTxs();

      // Get current block number for event data
      const blockNumber = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(blockNumber);
      const blockHash = block?.hash || "";

      // Process each pending transaction
      for (let i = 0; i < hashes.length; i++) {
        const hash = hashes[i];
        const request = requests[i];

        // Convert hash to string if it's not already
        const hashString = typeof hash === "string" ? hash : hash.toString();

        // Skip if we've already processed this hash
        if (this.processedHashes.has(hashString)) {
          continue;
        }

        // Extract data from request
        const agentAddress = request.agent;
        const actionId = request.actionId;

        // Create event data
        const eventData: AgentActionRequestEvent = {
          hash: hashString,
          agentAddress: agentAddress,
          actionId: actionId,
          blockNumber: blockNumber,
          transactionHash: "", // Not available from getPendingTxs
          blockHash: blockHash,
        };
        // Mark as processed
        this.processedHashes.add(hashString);

        // Call the handler synchronously
        if (this.eventHandler) {
          try {
            const result = this.eventHandler(eventData);
            // If handler returns a promise, wait for it but don't block
            if (result instanceof Promise) {
              result.catch((error) => {
                console.error(
                  `❌ Error in handler for hash ${hashString}:`,
                  error
                );
              });
            }
          } catch (error) {
            console.error(`❌ Error in handler for hash ${hashString}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("❌ Error polling getPendingTxs:", error);
    }
  }

  /**
   * Start polling
   */
  public async start(handler: AgentActionRequestHandler): Promise<void> {
    if (this.isRunning) {
      console.log("⚠️  AgentRunner is already running");
      return;
    }

    this.eventHandler = handler;
    this.isRunning = true;

    console.log(
      `🔌 Starting AgentRunner - Polling contract ${CONTRACT_ADDRESS} every ${this.pollIntervalMs}ms`
    );

    // Do an initial poll
    await this.pollPendingTxs();

    // Set up polling interval
    this.pollInterval = setInterval(() => {
      this.pollPendingTxs();
    }, this.pollIntervalMs);

    console.log("✅ AgentRunner started");
  }

  /**
   * Stop polling
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    console.log("🛑 Stopping AgentRunner...");

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    this.isRunning = false;
    this.eventHandler = null;

    console.log("✅ AgentRunner stopped");
  }

  /**
   * Clear processed hashes (useful for testing or reset)
   */
  public clearProcessedHashes(): void {
    this.processedHashes.clear();
    console.log("🧹 Cleared processed hashes");
  }

  /**
   * Get running status
   */
  public getRunningStatus(): boolean {
    return this.isRunning;
  }

  /**
   * Get number of processed hashes
   */
  public getProcessedCount(): number {
    return this.processedHashes.size;
  }
}
