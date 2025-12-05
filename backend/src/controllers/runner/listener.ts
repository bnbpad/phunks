import { ethers } from "ethers";
import nconf from "../../config/nconf";
import AgentLaunchpadABI from "./AgentLaunchpad.json";

// Contract configuration
const CONTRACT_ADDRESS = "0x209f28b4E3bca2528839f3D9C349262828738454";
const CHAIN_ID = 56; // BSC Mainnet

// Event interface
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
 * AgentRunner - Listens to AgentActionRequest events from the AgentLaunchpad contract on BSC
 */
export class AgentRunner {
  private provider: ethers.WebSocketProvider | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 5000; // 5 seconds
  private eventHandler: AgentActionRequestHandler | null = null;

  /**
   * Get WebSocket URL from config or use default BSC endpoint
   */
  private getWebSocketUrl(): string {
    // Try to get WebSocket URL from config
    return "wss://bsc-ws-node.nariox.org";
  }

  /**
   * Initialize WebSocket provider and contract
   */
  private initializeProvider(): void {
    const wsUrl = this.getWebSocketUrl();

    console.log(
      `🔌 Connecting to BSC WebSocket: ${wsUrl.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")}`
    );

    this.provider = new ethers.WebSocketProvider(wsUrl);

    // Handle WebSocket connection events
    const ws = (this.provider as any)._websocket;
    if (ws) {
      ws.on("open", () => {
        console.log("✅ WebSocket connected to BSC");
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      ws.on("error", (error: Error) => {
        console.error("❌ WebSocket error:", error);
        this.isConnected = false;
      });

      ws.on("close", () => {
        console.log("⚠️  WebSocket connection closed");
        this.isConnected = false;
        this.handleReconnect();
      });
    }

    // Also use provider events as fallback
    this.provider.on("error", (error: Error) => {
      console.error("❌ Provider error:", error);
      this.isConnected = false;
    });

    // Initialize contract
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      AgentLaunchpadABI,
      this.provider
    );
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(
        `❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached. Exiting...`
      );
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(
      `🔄 Attempting to reconnect in ${delay / 1000} seconds... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      if (!this.isConnected) {
        this.initializeProvider();
        // Wait a bit for connection, then re-subscribe to events
        setTimeout(() => {
          if (this.isConnected && this.eventHandler) {
            this.subscribeToEvents(this.eventHandler);
          }
        }, 2000);
      }
    }, delay);
  }

  /**
   * Subscribe to AgentActionRequest events
   */
  private subscribeToEvents(handler: AgentActionRequestHandler): void {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    console.log(
      `👂 Listening to AgentActionRequest events on contract ${CONTRACT_ADDRESS}`
    );

    this.contract.on("AgentActionRequest", async (...args: any[]) => {
      try {
        // In ethers v6, the event structure can vary
        // The last argument is typically the event log
        const eventLog = args[args.length - 1];

        let hash: string;
        let agentAddress: string;
        let actionId: bigint;
        let blockNumber: number;
        let transactionHash: string;
        let blockHash: string;

        // Handle different event formats
        if (eventLog.log) {
          // ContractEventPayload format
          const log = eventLog.log;
          const parsed = this.contract!.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });

          hash = parsed!.args[0];
          agentAddress = parsed!.args[1];
          actionId = parsed!.args[2];
          blockNumber = log.blockNumber;
          transactionHash = log.transactionHash;
          blockHash = log.blockHash;
        } else if (eventLog.topics) {
          // Raw Log format
          const parsed = this.contract!.interface.parseLog({
            topics: eventLog.topics,
            data: eventLog.data,
          });

          hash = parsed!.args[0];
          agentAddress = parsed!.args[1];
          actionId = parsed!.args[2];
          blockNumber = eventLog.blockNumber;
          transactionHash = eventLog.transactionHash;
          blockHash = eventLog.blockHash;
        } else {
          // Direct event args (already parsed) - this is the most common format
          hash = args[0];
          agentAddress = args[1];
          actionId = args[2];
          blockNumber = eventLog.blockNumber || 0;
          transactionHash = eventLog.transactionHash || "";
          blockHash = eventLog.blockHash || "";
        }

        const eventData: AgentActionRequestEvent = {
          hash,
          agentAddress,
          actionId,
          blockNumber,
          transactionHash,
          blockHash,
        };

        console.log("\n🎉 AgentActionRequest Event Detected!");
        console.log("Hash:", eventData.hash);
        console.log("Agent Address:", eventData.agentAddress);
        console.log("Action ID:", eventData.actionId.toString());
        console.log("Block Number:", eventData.blockNumber);
        console.log("Transaction Hash:", eventData.transactionHash);
        console.log("---\n");

        // Call the handler
        await handler(eventData);
      } catch (error) {
        console.error("❌ Error processing AgentActionRequest event:", error);
      }
    });
  }

  /**
   * Start listening to events
   */
  public async start(handler: AgentActionRequestHandler): Promise<void> {
    this.eventHandler = handler;
    this.initializeProvider();

    // Wait for connection if not connected
    if (!this.isConnected) {
      console.log("⏳ Waiting for WebSocket connection...");
      await new Promise<void>((resolve) => {
        const checkConnection = setInterval(() => {
          if (this.isConnected) {
            clearInterval(checkConnection);
            resolve();
          }
        }, 1000);
      });
    }

    // Subscribe to events
    this.subscribeToEvents(handler);

    // Display current block number
    try {
      if (this.provider) {
        const blockNumber = await this.provider.getBlockNumber();
        console.log(`📦 Current block number: ${blockNumber}`);
      }
    } catch (error) {
      console.error("Error getting block number:", error);
    }
  }

  /**
   * Stop listening and disconnect
   */
  public async stop(): Promise<void> {
    console.log("🛑 Stopping AgentRunner...");

    // Remove event listeners
    if (this.contract) {
      this.contract.removeAllListeners("AgentActionRequest");
    }

    // Close provider
    if (this.provider) {
      await this.provider.destroy();
      this.provider = null;
    }

    this.contract = null;
    this.isConnected = false;
    this.eventHandler = null;

    console.log("✅ AgentRunner stopped");
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Example usage
if (require.main === module) {
  const runner = new AgentRunner();

  // Define event handler
  const handler: AgentActionRequestHandler = async (event) => {
    // Your custom logic here
    console.log("Processing AgentActionRequest:", {
      hash: event.hash,
      agentAddress: event.agentAddress,
      actionId: event.actionId.toString(),
    });
  };

  // Start listening
  runner.start(handler).catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down...");
    await runner.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n🛑 Shutting down...");
    await runner.stop();
    process.exit(0);
  });

  console.log("✅ AgentRunner is active. Press Ctrl+C to stop.\n");
}
