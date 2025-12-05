import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface AgentCardProps {
  id: string
  name: string
  symbol: string
  pnl: number
  health: number
  evolution: number
  trades: number
  image: string
}

const AgentCard = ({ id, name, symbol, evolution, image }: AgentCardProps) => {
  const { t } = useTranslation('common')

  return (
    <Link to={`/agent/${id}`}>
      <div className="bg-white card-shadow rounded-lg overflow-hidden hover:shadow-lg transition-all">
        {/* Agent Image */}
        <div className="relative">
          <div className="w-full aspect-square overflow-hidden bg-gray-100">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-3 right-3 bg-bsc-500 px-2 py-1 rounded-md">
            <span className="text-white text-xs font-exo font-medium">v{evolution}.0</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Agent Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-exo">{name}</h3>
            <p className="text-sm text-gray-600 font-exo">{symbol}</p>
          </div>

          {/* TODO: Remove return, trades and performance stats later */}
          {/*
          Stats
          <div className="grid grid-cols-2 gap-3">
            TODO: Remove return stat
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 font-exo">{t('common.return')}</span>
              </div>
              <p className={`text-lg font-semibold ${pnlColor} font-exo`}>
                {pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%
              </p>
            </div>

            TODO: Remove trades stat
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 font-exo">{t('agent.stats.totalTrades')}</span>
              </div>
              <p className="text-lg font-semibold text-bsc-600 font-exo">{trades.toLocaleString()}</p>
            </div>
          </div>

          TODO: Remove performance bar
          Performance Bar
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 font-exo">{t('agent.stats.performance')}</span>
              </div>
              <span className="text-xs font-exo font-medium text-gray-600">{health}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${healthColor} transition-all duration-500`}
                style={{ width: `${health}%` }}
              ></div>
            </div>
          </div>
          */}

          {/* Network Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-bsc-600">
              <img src="/bsc.svg" alt="BSC" className="w-8 h-8" />
              <span className="font-exo">{t('common.bscNetwork')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <img src="/fourmeme.svg" alt="Four.meme" className="w-6 h-6" />
              <span className="font-exo">four.meme</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AgentCard
