import { createConfig, http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import appConfig from './config'

export const config = createConfig({
  chains: [bsc],
  connectors: [
    injected(), // MetaMask, Trust Wallet, etc.
    walletConnect({
      projectId: appConfig.walletConnect.projectId,
      metadata: {
        name: appConfig.app.name,
        description: appConfig.app.description,
        url: appConfig.app.url,
        icons: [appConfig.app.icon]
      }
    }),
  ],
  transports: {
    [bsc.id]: http(appConfig.network.rpcUrl),
  },
})

// Export for use in React
export function getConfig() {
  return config
}