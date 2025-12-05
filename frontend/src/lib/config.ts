import TokenManagerABI from './abi/TokenManagerV2.json';
import AgentLaunchpadABI from './abi/AgentLaunchpad.json';

// Application Configuration
export const config = {
  // API Configuration
  api: {
    baseURL: 'https://fd32c497428a.ngrok-free.app'
  },

  // WalletConnect Project ID (get from https://cloud.walletconnect.com)
  walletConnect: {
    projectId: 'your_project_id_here'
  },

  // BSC Network Configuration
  network: {
    rpcUrl: 'https://bsc-dataseed1.binance.org/',
    chainId: 56,
    name: 'BNB Smart Chain',
    currency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorer: 'https://bscscan.com'
  },

  // Contract Addresses on BSC
  contracts: {
    tokenManager: {
      address: '0x5c952063c7fc8610FFDB798152D69F0B9550762b',
      abi: TokenManagerABI
    },
    agentLaunchpad: {
      address: '0x209f28b4E3bca2528839f3D9C349262828738454',
      abi: AgentLaunchpadABI
    },
    agentNFT: '0x742d35Cc6634C0532925a3b8D91d99e2c4b851E8',
    // Token addresses
    tokens: {
      usdt: '0x55d398326f99059fF775485246999027B3197955'  // USDT on BSC
    }
  },

  // Application Metadata
  app: {
    name: 'Phunks - AI Agent Platform',
    description: 'Build Unstoppable & Self-learning AI Agents on BSC',
    url: 'https://phunks.ai',
    icon: 'https://phunks.ai/icon.png'
  }
} as const

export default config