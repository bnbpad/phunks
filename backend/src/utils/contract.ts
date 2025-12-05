import { ethers } from "ethers";

import LaunchpadABI from "../abi/Launchpad.json";
import TokenManagerV2ABI from "../abi/TokenManagerv2.json";
import ERC20ABI from "../abi/ERC20.json";
import PoolABI from "../abi/Pool.json";

import { blackListedTokens, CHAIN_CONFIG, ChainID } from "./constant";
import { BadRequestError } from "../errors";
import nconf from "../config/nconf";

type ProtocolType = "pancake" | "fourmeme";

interface ContractConfig {
  abi: any;
  address: string;
  topic: string;
  eventName: string;
  validateTo?: string;
}

/**
 * Get contract configuration based on protocol type
 * @param protocol - The protocol type ('bnbpad' or 'fourmeme')
 * @param chainId - The chain id
 * @returns Contract configuration
 */
const getContractConfig = (
  protocol: ProtocolType,
  chainId: ChainID
): ContractConfig => {
  return protocol === "pancake"
    ? {
        abi: LaunchpadABI,
        address: CHAIN_CONFIG[chainId].launchpadProxy,
        topic: nconf.get("POOL_CREATED_TOPIC_BSC"),
        eventName: "PoolCreated",
        validateTo: CHAIN_CONFIG[chainId].uiHelper,
      }
    : {
        abi: TokenManagerV2ABI,
        address: "0x5c952063c7fc8610FFDB798152D69F0B9550762b",
        topic:
          "0x396d5e902b675b032348d3d2e9517ee8f0c4a926603fbc075d3d282ff00cad20",
        eventName: "TokenCreate",
      };
};

/**
 * Get contract instance for parsing logs
 * @param config - Contract configuration
 * @param provider - Ethers provider
 * @returns Contract instance
 */
const getContract = (
  config: ContractConfig,
  provider: ethers.Provider
): ethers.Contract => new ethers.Contract(config.address, config.abi, provider);

/**
 * Generic function to get token details from transaction hash
 * @param txHash - The transaction hash
 * @param chainId - The chain id
 * @param protocol - The protocol type ('bnbpad' or 'fourmeme')
 * @returns Token details based on protocol
 */
export const getTokenDetailsFromCreateTx = async (
  txHash: string,
  chainId: ChainID,
  protocol: ProtocolType = "pancake"
) => {
  try {
    const provider = _getProvider(chainId);

    await provider.waitForTransaction(txHash, 2);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) throw new BadRequestError(`receipt not found for ${txHash}`);

    const config = getContractConfig(protocol, 56);

    const block = await provider.getBlock(receipt.blockNumber);
    if (!block) throw new BadRequestError(`block not found for ${txHash}`);
    const timestamp = block.timestamp;
    if (timestamp < Date.now() / 1000 - 3600) {
      throw new BadRequestError(`tx is more than 1 Hr old`);
    }

    const matchingLogs = receipt.logs.filter(
      (log) => log.topics[0] === config.topic
    );

    let event = null;
    if (protocol === "pancake") {
      const poolInterface = new ethers.Interface(PoolABI);
      const parsedEvents = matchingLogs
        .map((log, index) => {
          try {
            const parsed = poolInterface.parseLog(log);
            console.log(
              `Log ${index} parsed with Pool ABI:`,
              parsed?.name,
              parsed?.args
            );
            return parsed;
          } catch (error) {
            console.log(`Log ${index} parse error with Pool ABI:`, error);
            return null;
          }
        })
        .filter(
          (parsed) => parsed !== null && parsed.name === config.eventName
        );

      if (parsedEvents.length > 0) {
        event = parsedEvents[0];
        console.log("Found PoolCreated event:", event?.args);
      }
    } else {
      const contract = getContract(config, provider);
      const parsedEvents = matchingLogs
        .map((log, index) => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed;
          } catch (error) {
            console.log(`Log ${index} parse error:`, error);
            return null;
          }
        })
        .filter(
          (parsed) => parsed !== null && parsed.name === config.eventName
        );

      if (parsedEvents.length > 0) {
        event = parsedEvents[0];
      }
    }

    if (!event) {
      throw new BadRequestError(
        `${config.eventName} event not found in transaction`
      );
    }

    if (protocol === "pancake") {
      const token0 = (event.args[0] as string).toLowerCase();
      const token1 = (event.args[1] as string).toLowerCase();
      const pool = (event.args[4] as string).toLowerCase();

      console.log("PoolCreated event args:", {
        token0,
        token1,
        fee: event.args[2],
        tickSpacing: event.args[3],
        pool,
      });
      return {
        token: token0,
        pool: pool,
        dex: "pancake",
      };
    }

    return {
      token: event.args.token.toLowerCase(),
      creator: event.args.creator.toLowerCase(),
      dex: "fourmeme",
    };
  } catch (error) {
    console.log(error);
    throw new BadRequestError(
      `Error fetching receipt or parsing logs: ${error}`
    );
  }
};

/**
 * Get the pool details from the tx hash (bnbpad protocol)
 * @param txHash - The transaction hash of the token created event
 * @param chainId - The chain id
 * @returns The pool details
 */
export const getPoolDetailsFromCreateTx = async (
  txHash: string,
  chainId: ChainID
) => {
  const result = await getTokenDetailsFromCreateTx(txHash, chainId, "pancake");
  if (!result.pool || !result.dex)
    throw new BadRequestError("Pool details not found");
  return result;
};

/**
 * Get FourMeme token details (token address and creator) from transaction hash
 * @param txHash - The transaction hash
 * @param chainId - The chain id
 * @returns The token address and creator
 */
export const getFourMemeTokenDetailsFromTx = async (
  txHash: string,
  chainId: ChainID
) => {
  const result = await getTokenDetailsFromCreateTx(txHash, 56, "fourmeme");
  if (!result.creator)
    throw new BadRequestError("Creator not found in transaction");
  return result;
};

/**
 * Get token info from TokenManagerV2 contract
 * @param tokenAddress - The token address
 * @param chainId - The chain id
 * @returns The token info from TokenManagerV2
 */
export const getTokenInfoFromTokenManagerV2 = async (
  tokenAddress: string,
  chainId: ChainID
) => {
  try {
    const provider = _getProvider(chainId);
    const addr = nconf.get("TOKEN_MANAGER_V2_ADDRESS_BSC");
    if (!addr)
      throw new BadRequestError("TokenManagerV2 address not configured");

    const c = new ethers.Contract(addr, TokenManagerV2ABI, provider);
    return await c._tokenInfos(tokenAddress);
  } catch (error) {
    console.log(error);
    throw new BadRequestError(
      `Error reading token info from TokenManagerV2: ${error}`
    );
  }
};

/**
 * Get ERC20 token details (decimals and symbol)
 * @param tokenAddress - The token address
 * @param chainId - The chain id
 * @returns The token decimals and symbol
 */
export const getERC20TokenDetails = async (
  tokenAddress: string,
  chainId: ChainID
) => {
  try {
    if (tokenAddress.toLowerCase() === blackListedTokens[0]) {
      return { decimals: 18, symbol: "BNB" };
    }

    const provider = _getProvider(chainId);
    const c = new ethers.Contract(tokenAddress, ERC20ABI, provider);

    const [decimals, symbol] = await Promise.all([c.decimals(), c.symbol()]);
    return { decimals: Number(decimals), symbol };
  } catch (error) {
    console.log(error);
    throw new BadRequestError(`Error reading ERC20 token details: ${error}`);
  }
};

/**
 * Get the provider for the chain id
 * @param chainId - The chain id
 * @returns The provider
 */
export const _getProvider = (chainId: ChainID) => {
  const cfg = CHAIN_CONFIG[chainId];
  if (!cfg) throw new Error(`Unsupported chain type: ${chainId}`);
  return new ethers.JsonRpcProvider(cfg.rpc);
};
