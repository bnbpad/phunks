import React from 'react'
import { Clock, ExternalLink, DollarSign } from 'lucide-react'
import { Trade } from '../lib/api/agents'

interface RecentTradesProps {
  trades?: Trade[]
  className?: string
}

// Utility function to format wei to BNB
const formatBNBAmount = (weiAmount: string): string => {
  try {
    const bnbAmount = parseFloat(weiAmount) / 1e18
    if (bnbAmount < 0.0001) {
      return '< 0.0001 BNB'
    }
    return `${bnbAmount.toFixed(4)} BNB`
  } catch {
    return 'Unknown'
  }
}

// Utility function to format timestamp
const formatTradeTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Unknown time'
  }
}

// Utility function to truncate token address
const truncateAddress = (address: string): string => {
  if (!address) return 'Unknown'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const SimplifiedRecentTrades: React.FC<RecentTradesProps> = ({ trades = [], className = "" }) => {
  // Don't render if there are no trades
  if (trades.length === 0) {
    return (
      <div className={`bg-white card-shadow rounded-xl p-6 h-fit ${className}`}>
        <h2 className="text-2xl font-orbitron font-bold text-gray-900 mb-4">Recent Trades</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 font-exo text-sm">No recent trades available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white card-shadow rounded-xl p-6 h-fit ${className}`}>
      <h2 className="text-2xl font-orbitron font-bold text-gray-900 mb-4">Recent Trades</h2>

      <div className="space-y-4 max-h-[700px] overflow-y-auto">
        {trades.map((trade) => (
          <div key={trade._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            {/* Trade Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-bsc-600" />
                <span className="font-semibold text-bsc-600 font-exo">
                  {formatBNBAmount(trade.amount)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="font-exo">{formatTradeTime(trade.createdAt)}</span>
              </div>
            </div>

            {/* Trade Description */}
            <p className="text-sm font-exo text-gray-700 mb-3 leading-relaxed">
              {trade.description}
            </p>

            {/* Trade Details */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-exo">Token Address</span>
                <span className="text-xs font-mono text-gray-700">
                  {truncateAddress(trade.tokenAddress)}
                </span>
              </div>
              <a
                href={`https://bscscan.com/address/${trade.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-bsc-600 hover:text-bsc-700 font-exo transition-colors"
              >
                <span>View on BSCScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimplifiedRecentTrades