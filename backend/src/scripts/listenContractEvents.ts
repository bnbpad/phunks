import { ethers } from 'ethers';
import nconf from '../config/nconf';
import { CHAIN_CONFIG, ChainID } from '../utils/constant';

// Import ABIs as needed
import LaunchpadABI from '../abi/Launchpad.json';
import TokenManagerV2ABI from '../abi/TokenManagerv2.json';
import ERC20ABI from '../abi/ERC20.json';
import PoolABI from '../abi/Pool.json';

interface EventListenerConfig {
  contractAddress: string;
  abi: any[];
  eventName: string;
  chainId?: ChainID;
  wsRpcUrl?: string;
}

interface EventHandler {
  (event: ethers.Log | ethers.EventLog, parsed?: any): void | Promise<void>;
}

interface StoredListener {
  handler: EventHandler;
  config: EventListenerConfig;
}

class ContractEventListener {
  private provider: ethers.WebSocketProvider | null = null;
  private contracts: Map<string, ethers.Contract> = new Map();
  private listeners: Map<string, StoredListener[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 5000; // 5 seconds
  private isConnected = false;
  private chainId: ChainID;

  constructor(chainId: ChainID = 56, wsRpcUrl?: string) {
    this.chainId = chainId;
    this.initializeProvider(wsRpcUrl);
  }

  /**
   * Initialize WebSocket provider
   */
  private initializeProvider(wsRpcUrl?: string): void {
    // Use provided WebSocket URL or construct from HTTP RPC
    const rpcUrl = wsRpcUrl || this.getWebSocketUrl();

    if (!rpcUrl) {
      throw new Error(
        'WebSocket RPC URL is required. Please provide wsRpcUrl or configure BSC_WS_RPC in config.json'
      );
    }

    console.log(`Connecting to WebSocket: ${rpcUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

    this.provider = new ethers.WebSocketProvider(rpcUrl);

    // Handle connection events using the provider's _websocket property
    const ws = (this.provider as any)._websocket;
    if (ws) {
      ws.on('open', () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      ws.on('error', (error: Error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnected = false;
      });

      ws.on('close', () => {
        console.log('⚠️  WebSocket connection closed');
        this.isConnected = false;
        this.handleReconnect();
      });
    }

    // Also use provider events as fallback
    this.provider.on('error', (error: Error) => {
      console.error('❌ Provider error:', error);
      this.isConnected = false;
    });
  }

  /**
   * Get WebSocket URL from config or construct from HTTP RPC
   */
  private getWebSocketUrl(): string | undefined {
    // Try to get WebSocket URL from config
    const wsRpc = nconf.get('BSC_WS_RPC');
    if (wsRpc) return wsRpc;

    // Try to construct from HTTP RPC
    const httpRpc = CHAIN_CONFIG[this.chainId]?.rpc;
    if (httpRpc) {
      // Convert HTTP to WebSocket URL
      return httpRpc.replace('https://', 'wss://').replace('http://', 'ws://');
    }

    // Default BSC WebSocket endpoints (public)
    if (this.chainId === 56) {
      // You can use public endpoints or configure your own
      return 'wss://bsc-mainnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3';
    }

    return undefined;
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(
        `❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached. Exiting...`
      );
      process.exit(1);
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(
      `🔄 Attempting to reconnect in ${delay / 1000} seconds... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(async () => {
      if (!this.isConnected) {
        this.initializeProvider();
        // Wait a bit for connection, then re-subscribe to all events
        setTimeout(async () => {
          if (this.isConnected) {
            await this.resubscribeAll();
          }
        }, 2000);
      }
    }, delay);
  }

  /**
   * Re-subscribe to all events after reconnection
   */
  private async resubscribeAll(): Promise<void> {
    for (const [key, storedListeners] of this.listeners.entries()) {
      const [contractAddress, eventName] = key.split(':');
      const storedListener = storedListeners[0]; // Get the first listener config
      if (storedListener && this.provider) {
        // Recreate contract and listener
        const contract = new ethers.Contract(
          contractAddress,
          storedListener.config.abi,
          this.provider
        );
        this.contracts.set(contractAddress, contract);

        // Re-subscribe with the stored handler
        for (const stored of storedListeners) {
          const eventListener = this.createEventListener(contract, stored.handler);
          contract.on(eventName, eventListener);
        }
      }
    }
  }

  /**
   * Listen to a specific contract event
   */
  public async listenToEvent(config: EventListenerConfig, handler: EventHandler): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const { contractAddress, abi, eventName, chainId = this.chainId, wsRpcUrl } = config;

    // Reinitialize provider if different WebSocket URL is provided
    if (wsRpcUrl && wsRpcUrl !== this.getWebSocketUrl()) {
      this.initializeProvider(wsRpcUrl);
    }

    // Wait for connection if not connected
    if (!this.isConnected) {
      console.log('⏳ Waiting for WebSocket connection...');
      await new Promise<void>(resolve => {
        const checkConnection = setInterval(() => {
          if (this.isConnected) {
            clearInterval(checkConnection);
            resolve();
          }
        }, 1000);
      });
    }

    const contract = new ethers.Contract(contractAddress, abi, this.provider);
    this.contracts.set(contractAddress, contract);

    const listenerKey = `${contractAddress}:${eventName}`;

    console.log(`👂 Listening to event "${eventName}" on contract ${contractAddress}`);

    // Create event listener
    const eventListener = this.createEventListener(contract, handler);

    // Store listener for reconnection
    if (!this.listeners.has(listenerKey)) {
      this.listeners.set(listenerKey, []);
    }
    this.listeners.get(listenerKey)!.push({
      handler,
      config: { contractAddress, abi, eventName, chainId, wsRpcUrl },
    });

    // Subscribe to the event
    contract.on(eventName, eventListener);
  }

  /**
   * Stop listening to a specific event
   */
  public stopListening(contractAddress: string, eventName: string): void {
    const contract = this.contracts.get(contractAddress);
    if (contract) {
      contract.removeAllListeners(eventName);
      const listenerKey = `${contractAddress}:${eventName}`;
      this.listeners.delete(listenerKey);
      console.log(`🛑 Stopped listening to "${eventName}" on ${contractAddress}`);
    }
  }

  /**
   * Stop all listeners and close connection
   */
  public async disconnect(): Promise<void> {
    console.log('🔌 Disconnecting...');

    // Remove all listeners
    this.contracts.forEach(contract => {
      contract.removeAllListeners();
    });

    this.contracts.clear();
    this.listeners.clear();

    // Close provider
    if (this.provider) {
      await this.provider.destroy();
      this.provider = null;
    }

    this.isConnected = false;
    console.log('✅ Disconnected');
  }

  /**
   * Create an event listener function
   */
  private createEventListener(
    contract: ethers.Contract,
    handler: EventHandler
  ): (...args: any[]) => Promise<void> {
    return async (...args: any[]) => {
      // The last argument is the event log
      const eventLog = args[args.length - 1];

      try {
        // Parse the event if possible
        let parsed: any = null;
        try {
          if (eventLog.log) {
            // If it's a ContractEventPayload
            parsed = contract.interface.parseLog({
              topics: eventLog.log.topics,
              data: eventLog.log.data,
            });
            await handler(eventLog.log, parsed);
          } else if (eventLog.topics) {
            // If it's a raw Log
            parsed = contract.interface.parseLog({
              topics: eventLog.topics,
              data: eventLog.data,
            });
            await handler(eventLog, parsed);
          } else {
            // Direct event args (already parsed)
            await handler(eventLog, eventLog);
          }
        } catch (parseError) {
          // If parsing fails, use raw event
          console.warn('⚠️  Could not parse event, using raw data');
          if (eventLog.log) {
            await handler(eventLog.log, null);
          } else {
            await handler(eventLog, null);
          }
        }
      } catch (error) {
        console.error(`❌ Error handling event:`, error);
      }
    };
  }

  /**
   * Get current block number
   */
  public async getBlockNumber(): Promise<number> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return await this.provider.getBlockNumber();
  }

  /**
   * Check connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Example usage function
async function main() {
  const chainId: ChainID = 56; // BSC Mainnet

  // Initialize listener
  const listener = new ContractEventListener(chainId);

  // Example 1: Listen to Launchpad PoolCreated events
  const launchpadAddress = nconf.get('LAUNCHPAD_ADDRESS_BSC');
  if (launchpadAddress) {
    await listener.listenToEvent(
      {
        contractAddress: launchpadAddress,
        abi: LaunchpadABI,
        eventName: 'PoolCreated', // Adjust based on your ABI
        chainId,
      },
      async (log, parsed) => {
        console.log('\n🎉 PoolCreated Event Detected!');
        console.log('Block:', log.blockNumber);
        console.log('Transaction:', log.transactionHash);
        console.log('Address:', log.address);

        if (parsed) {
          console.log('Parsed Args:', parsed.args);
        } else {
          console.log('Topics:', log.topics);
          console.log('Data:', log.data);
        }
        console.log('---\n');
      }
    );
  }

  // Example 2: Listen to TokenManagerV2 TokenCreate events
  const tokenManagerAddress = nconf.get('TOKEN_MANAGER_V2_ADDRESS_BSC');
  if (tokenManagerAddress) {
    await listener.listenToEvent(
      {
        contractAddress: tokenManagerAddress,
        abi: TokenManagerV2ABI,
        eventName: 'TokenCreate',
        chainId,
      },
      async (log, parsed) => {
        console.log('\n🎉 TokenCreate Event Detected!');
        console.log('Block:', log.blockNumber);
        console.log('Transaction:', log.transactionHash);

        if (parsed) {
          console.log('Token Address:', parsed.args.token);
          console.log('Creator:', parsed.args.creator);
        }
        console.log('---\n');
      }
    );
  }

  // Example 3: Listen to ERC20 Transfer events on a specific token
  // Uncomment and configure as needed
  /*
  const tokenAddress = '0x...'; // Your token address
  await listener.listenToEvent(
    {
      contractAddress: tokenAddress,
      abi: ERC20ABI,
      eventName: 'Transfer',
      chainId,
    },
    async (log, parsed) => {
      if (parsed) {
        console.log(`Transfer: ${parsed.args.from} -> ${parsed.args.to}, Amount: ${parsed.args.value}`);
      }
    }
  );
  */

  // Display current block number
  try {
    const blockNumber = await listener.getBlockNumber();
    console.log(`📦 Current block number: ${blockNumber}`);
  } catch (error) {
    console.error('Error getting block number:', error);
  }

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await listener.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down...');
    await listener.disconnect();
    process.exit(0);
  });

  console.log('✅ Event listeners are active. Press Ctrl+C to stop.\n');
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { ContractEventListener, EventListenerConfig, EventHandler };
