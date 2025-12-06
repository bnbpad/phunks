import { ethers } from "ethers";
import nconf from "../../config/nconf";
import AgentLaunchpadABI from "./AgentLaunchpad.json";
import { ChainID } from "../../utils/constant";
import { _getProvider } from "../../utils/contract";

// Contract configuration
const CONTRACT_ADDRESS = "0x92B1AF102247Ea2fB71c51157A13bb168A35B9D9";
const CHAIN_ID: ChainID = 56; // BSC Mainnet

// Response options
export interface RespondWithActionParams {
  hash: string; // bytes32 hash
  to: string; // address to send the action to
  data: string | Uint8Array; // bytes data for the action
  value?: bigint | string; // value in wei (optional, defaults to 0)
}

export interface RespondWithUpgradeParams {
  hash: string; // bytes32 hash
  memory: string; // memory string to store
}

// Transaction result
export interface TransactionResult {
  hash: string;
  blockNumber?: number;
  gasUsed?: bigint;
  status?: number;
}

/**
 * AgentResponder - Wrapper for responding to agent requests on the AgentLaunchpad contract
 */
export class AgentResponder {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private signer: ethers.Wallet;
  private contractWithSigner: ethers.Contract;

  constructor() {
    // Get private key from config
    const privateKey = nconf.get("WALLET_PRIVATE_KEY");
    if (!privateKey) {
      throw new Error(
        "WALLET_PRIVATE_KEY not found in config. Required for sending transactions."
      );
    }

    // Initialize provider and signer
    this.provider = _getProvider(CHAIN_ID);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      AgentLaunchpadABI,
      this.provider
    );
    this.contractWithSigner = this.contract.connect(
      this.signer
    ) as ethers.Contract;

    console.log(
      `🔐 AgentResponder initialized with address: ${this.signer.address}`
    );
  }

  /**
   * Get the signer address
   */
  public getSignerAddress(): string {
    return this.signer.address;
  }

  /**
   * Respond with an action (actionId = 0)
   * @param params - Parameters for respondWithAction
   * @returns Transaction result
   */
  public async respondWithAction(
    params: RespondWithActionParams
  ): Promise<TransactionResult> {
    try {
      // Validate hash
      if (!params.hash || params.hash.length !== 66) {
        throw new Error("Invalid hash: must be a 32-byte hex string (0x...)");
      }

      // Validate address
      if (!ethers.isAddress(params.to)) {
        throw new Error(`Invalid address: ${params.to}`);
      }

      // Convert data to bytes if it's a string
      let dataBytes: string;
      if (typeof params.data === "string") {
        // If it's already a hex string, use it; otherwise encode it
        if (params.data.startsWith("0x")) {
          dataBytes = params.data;
        } else {
          dataBytes = ethers.hexlify(ethers.toUtf8Bytes(params.data));
        }
      } else {
        dataBytes = ethers.hexlify(params.data);
      }

      // Convert value to bigint
      const value =
        params.value !== undefined
          ? typeof params.value === "string"
            ? BigInt(params.value)
            : params.value
          : BigInt(0);

      console.log(`📤 Sending respondWithAction transaction...`);
      console.log(`   Hash: ${params.hash}`);
      console.log(`   To: ${params.to}`);
      console.log(`   Value: ${value.toString()} wei`);
      console.log(`   Data length: ${dataBytes.length} bytes`);

      // Estimate gas
      let gasEstimate: bigint;
      try {
        gasEstimate =
          await this.contractWithSigner.respondWithAction.estimateGas(
            params.hash,
            params.to,
            dataBytes,
            value
          );
        console.log(`   Estimated gas: ${gasEstimate.toString()}`);
      } catch (error) {
        console.error("❌ Gas estimation failed:", error);
        throw new Error(
          `Gas estimation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }

      // Send transaction
      const tx = await this.contractWithSigner.respondWithAction(
        params.hash,
        params.to,
        dataBytes,
        value,
        {
          gasLimit: gasEstimate + gasEstimate / BigInt(10), // Add 10% buffer
        }
      );

      console.log(`⏳ Transaction sent: ${tx.hash}`);
      console.log(`   Waiting for confirmation...`);

      // Wait for transaction receipt
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction receipt not found");
      }

      console.log(`✅ Transaction confirmed!`);
      console.log(`   Block: ${receipt.blockNumber}`);
      console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`   Status: ${receipt.status === 1 ? "Success" : "Failed"}`);

      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        status: receipt.status,
      };
    } catch (error) {
      console.error("❌ Error in respondWithAction:", error);
      throw error;
    }
  }

  /**
   * Respond with an upgrade (actionId = 1)
   * @param params - Parameters for respondWithUpgrade
   * @returns Transaction result
   */
  public async respondWithUpgrade(
    params: RespondWithUpgradeParams
  ): Promise<TransactionResult> {
    try {
      // Validate hash
      if (!params.hash || params.hash.length !== 66) {
        throw new Error("Invalid hash: must be a 32-byte hex string (0x...)");
      }

      // Validate memory
      if (typeof params.memory !== "string") {
        throw new Error("Memory must be a string");
      }

      console.log(`📤 Sending respondWithUpgrade transaction...`);
      console.log(`   Hash: ${params.hash}`);
      console.log(`   Memory length: ${params.memory.length} characters`);

      // Estimate gas
      let gasEstimate: bigint;
      try {
        gasEstimate =
          await this.contractWithSigner.respondWithUpgrade.estimateGas(
            params.hash,
            params.memory
          );
        console.log(`   Estimated gas: ${gasEstimate.toString()}`);
      } catch (error) {
        console.error("❌ Gas estimation failed:", error);
        throw new Error(
          `Gas estimation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }

      // Send transaction
      const tx = await this.contractWithSigner.respondWithUpgrade(
        params.hash,
        params.memory,
        {
          gasLimit: gasEstimate + gasEstimate / BigInt(10), // Add 10% buffer
        }
      );

      console.log(`⏳ Transaction sent: ${tx.hash}`);
      console.log(`   Waiting for confirmation...`);

      // Wait for transaction receipt
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction receipt not found");
      }

      console.log(`✅ Transaction confirmed!`);
      console.log(`   Block: ${receipt.blockNumber}`);
      console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`   Status: ${receipt.status === 1 ? "Success" : "Failed"}`);

      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        status: receipt.status,
      };
    } catch (error) {
      console.error("❌ Error in respondWithUpgrade:", error);
      throw error;
    }
  }

  /**
   * Check if a request exists and get its status
   * @param hash - The request hash
   * @returns Request information or null if not found
   */
  public async getRequest(hash: string): Promise<{
    agent: string;
    status: bigint;
    actionId: bigint;
  } | null> {
    try {
      const request = await this.contract.requests(hash);
      if (request.agent === ethers.ZeroAddress) {
        return null;
      }
      return {
        agent: request.agent,
        status: request.status,
        actionId: request.actionId,
      };
    } catch (error) {
      console.error("❌ Error getting request:", error);
      return null;
    }
  }

  /**
   * Get the AVS address from the contract
   * @returns The AVS address
   */
  public async getAVSAddress(): Promise<string> {
    try {
      return await this.contract.avs();
    } catch (error) {
      console.error("❌ Error getting AVS address:", error);
      throw error;
    }
  }

  /**
   * Verify that the signer is authorized (matches AVS address)
   * @returns True if signer matches AVS, false otherwise
   */
  public async isAuthorized(): Promise<boolean> {
    try {
      const avsAddress = await this.getAVSAddress();
      const signerAddress = this.signer.address.toLowerCase();
      return avsAddress.toLowerCase() === signerAddress;
    } catch (error) {
      console.error("❌ Error checking authorization:", error);
      return false;
    }
  }

  /**
   * Helper method to encode function call data
   * @param abi - Contract ABI (array of function definitions)
   * @param functionName - Name of the function to call
   * @param params - Parameters for the function
   * @returns Encoded function call data as hex string
   */
  public static encodeFunctionCall(
    abi: any[],
    functionName: string,
    params: any[]
  ): string {
    const iface = new ethers.Interface(abi);
    return iface.encodeFunctionData(functionName, params);
  }
}
