import React from 'react'

interface Trade {
  id: number
  description: string
}

interface RecentTradesProps {
  className?: string
}

const SimplifiedRecentTrades: React.FC<RecentTradesProps> = ({ className = "" }) => {
  // Sample trades data
  const trades: Trade[] = [
    { id: 1, description: "Swapped BNB for PCS" },
    { id: 2, description: "Swapped USDT for BNB" },
    { id: 3, description: "Swapped CAKE for USDT" },
    { id: 4, description: "Swapped ETH for BNB" },
    { id: 5, description: "Swapped BNB for USDT" }
  ]

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