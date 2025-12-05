import React from 'react'
import { Trade } from '../lib/api/agents'

interface RecentTradesProps {
  trades?: Trade[]
  className?: string
}

const SimplifiedRecentTrades: React.FC<RecentTradesProps> = ({ trades = [], className = "" }) => {
  // Don't render if there are no trades
  if (trades.length === 0) {
    return null
  }

  return (
    <div className={`bg-white card-shadow rounded-xl p-6 h-fit ${className}`}>
      <h2 className="text-2xl font-orbitron font-bold text-gray-900 mb-4">Recent Trades</h2>

      <div className="space-y-3 max-h-[700px] overflow-y-auto">
        {trades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm font-exo text-gray-600">{trade.id}.</span>
              <span className="text-sm font-exo text-gray-900">{trade.description}</span>
            </div>
            <a href="#" className="text-xs text-bsc-600 hover:text-bsc-700 font-exo underline">
              view transaction
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimplifiedRecentTrades