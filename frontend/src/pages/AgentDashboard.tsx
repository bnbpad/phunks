import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Activity, TrendingUp, TrendingDown, Zap, Shield, Clock, DollarSign, BarChart3, Eye, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ActivityEvolutionChanges from '../components/ActivityEvolutionChanges'
import EvolutionChangesModal from '../components/EvolutionChangesModal'

const AgentDashboard = () => {
  const { id } = useParams()
  const { t } = useTranslation('common')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvolutionData, setSelectedEvolutionData] = useState<{
    changes: any[]
    title: string
    time: string
  } | null>(null)

  const handleShowEvolutionChanges = (activity: any) => {
    setSelectedEvolutionData({
      changes: activity.evolutionChanges,
      title: activity.title,
      time: activity.time
    })
    setModalOpen(true)
  }

  const agentData = {
    name: 'Alpha Strategy',
    symbol: 'ALPHA',
    generation: 3,
    health: 92,
    pnl: 127.5,
    totalTrades: 1247,
    winRate: 68.4,
    avgProfit: 2.3,
    currentPosition: 'Long BNB/USDT',
    positionSize: '$45,230',
    entryPrice: '$245.67',
    currentPrice: '$256.89',
    unrealizedPnL: '+4.74%',
    description: t('agent.description'),
  }

  const recentTrades = [
    {
      id: 1,
      pair: 'BNB/USDT',
      type: 'Long',
      entry: 245.67,
      exit: null,
      currentPrice: 256.89,
      pnl: 4.74,
      time: 'Active',
      verified: true,
      status: 'active',
      positionSize: '$45,230',
      stopLoss: '$240.25',
      takeProfit: '$262.50'
    },
    { id: 2, pair: 'CAKE/USDT', type: 'Short', entry: 3.45, exit: 3.35, pnl: 2.90, time: '15 min ago', verified: true, status: 'closed' },
    { id: 3, pair: 'XVS/USDT', type: 'Long', entry: 8.5, exit: 8.8, pnl: 3.53, time: '1 hour ago', verified: true, status: 'closed' },
    { id: 4, pair: 'ADA/USDT', type: 'Long', entry: 0.52, exit: 0.51, pnl: -1.92, time: '2 hours ago', verified: true, status: 'closed' },
    { id: 5, pair: 'DOT/USDT', type: 'Short', entry: 7.89, exit: 7.65, pnl: 3.04, time: '3 hours ago', verified: true, status: 'closed' },
    { id: 6, pair: 'ETH/USDT', type: 'Long', entry: 2340.00, exit: 2398.50, pnl: 2.50, time: '4 hours ago', verified: true, status: 'closed' },
    { id: 7, pair: 'MATIC/USDT', type: 'Short', entry: 0.89, exit: 0.85, pnl: 4.49, time: '5 hours ago', verified: true, status: 'closed' },
  ]

  // Evolution changes data
  const evolutionChangesData = {
    1: [ // For activity id 1 (Evolution Cycle Initiated)
      {
        before: [
          'Analyze how healthy the current portfolio is (concentration, liquidity risk, volatility, leverage if any).',
          'Decide for EACH POSITION whether to: BUY_MORE, HOLD, PARTIAL_SELL, or CLOSE.',
          'Optionally recommend NEW entries in tokens from the market list if there is a strong opportunity.',
          'Respect risk tolerance and the available USDT balance. Focus on realistic, executable actions within current liquidity and volatility.'
        ],
        after: [
          'Analyze how healthy the current portfolio is (concentration, liquidity risk, volatility, leverage if any).',
          'For each existing position, decide whether to: BUY_MORE, HOLD, PARTIAL_SELL, or CLOSE, considering recent market trends and the health of each token.',
          'Optionally recommend NEW entries in tokens from the market list if there is a strong opportunity.',
          'Identify potential new entries from the market list, considering only those tokens that present a strong opportunity and can contribute to portfolio diversification.',
          'Ensure that the portfolio\'s overall risk level remains within the MEDIUM risk tolerance, adjusting allocations if necessary.',
          'Review the stop-loss and take-profit levels for each token, adjusting them based on recent price movements and volatility.',
          'Monitor the performance of ZRX closely due to its high concentration in the portfolio and high volatility.',
          'Consider the available USDT balance before making any new purchases, ensuring sufficient liquidity is maintained.',
          'Focus on realistic, executable actions that consider current market liquidity and volatility.',
          'Reflect on the outcomes of the previous decisions, learning from any successes or mistakes, and adjust the strategy accordingly.'
        ]
      }
    ]
  }

  const aiActivities = [
    {
      id: 1,
      time: '14:35:42',
      title: t('ai.activities.evolutionCycleInitiated.title'),
      description: t('ai.activities.evolutionCycleInitiated.description'),
      type: 'evolution',
      impact: t('ai.impact.high'),
      metrics: { winRate: '+0.3%', efficiency: '+12%' },
      status: 'active',
      evolutionChanges: evolutionChangesData[1]
    },
    {
      id: 2,
      time: '14:35:39',
      title: t('ai.activities.neuralNetworkUpdate.title'),
      description: t('ai.activities.neuralNetworkUpdate.description'),
      type: 'learning',
      impact: t('ai.impact.medium'),
      metrics: { accuracy: '+2.1%', confidence: '89%' },
      status: 'completed'
    },
    {
      id: 3,
      time: '14:35:36',
      title: t('ai.activities.marketSentimentAnalysis.title'),
      description: t('ai.activities.marketSentimentAnalysis.description'),
      type: 'info',
      impact: t('ai.impact.medium'),
      metrics: { sentiment: '+78%', volume: '+23%' },
      status: 'monitoring'
    },
    {
      id: 4,
      time: '14:35:33',
      title: t('ai.activities.riskRewardOptimization.title'),
      description: t('ai.activities.riskRewardOptimization.description'),
      type: 'evolution',
      impact: t('ai.impact.high'),
      metrics: { ratio: '1:3.1', improvement: '+10.7%' },
      status: 'completed',
      evolutionChanges: evolutionChangesData[4]
    },
    {
      id: 5,
      time: '14:35:30',
      title: t('ai.activities.positionManagement.title'),
      description: t('ai.activities.positionManagement.description'),
      type: 'trade',
      impact: t('ai.impact.medium'),
      metrics: { stopLevel: '+2.5%', protection: 'Active' },
      status: 'active'
    },
    {
      id: 6,
      time: '14:32:25',
      title: t('ai.activities.tradeExecution.title'),
      description: t('ai.activities.tradeExecution.description'),
      type: 'trade',
      impact: t('ai.impact.high'),
      metrics: { size: '$45,230', confidence: '87%' },
      status: 'executed'
    },
    {
      id: 7,
      time: '14:32:22',
      title: t('ai.activities.aiConfidenceAssessment.title'),
      description: t('ai.activities.aiConfidenceAssessment.description'),
      type: 'success',
      impact: t('ai.impact.high'),
      metrics: { confidence: '87%', factors: '3/3' },
      status: 'completed'
    },
    {
      id: 8,
      time: '14:32:18',
      title: t('ai.activities.momentumDetection.title'),
      description: t('ai.activities.momentumDetection.description'),
      type: 'warning',
      impact: t('ai.impact.high'),
      metrics: { momentum: '+5.2%', timeframe: '15min' },
      status: 'processed'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        to="/traders"
        className="inline-flex items-center gap-2 text-bsc-600 hover:text-bsc-700 transition-colors font-exo font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('navigation.backToTraders')}
      </Link>

      {/* Header */}
      <div className="bg-white card-shadow rounded-xl p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-bsc-100 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-bsc-600" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-black text-gray-900">{agentData.name}</h1>
              <p className="text-gray-600 font-exo mt-1">{t('agent.generation')} {agentData.generation} • {agentData.symbol}</p>
              <p className="text-gray-600 font-exo mt-2 max-w-2xl">{agentData.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-bsc-600">
              <div className="w-3 h-3 bg-bsc-500 diamond-shape"></div>
              <span className="font-exo">{t('common.bscNetwork')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout - Trades & AI Activity */}
      <div className="grid lg:grid-cols-2 gap-8 lg:items-start">
        {/* Trades & Positions */}
        <div className="bg-white card-shadow rounded-xl p-6 h-fit">
          <h2 className="text-2xl font-orbitron font-bold text-gray-900 mb-4">{t('trades.title')}</h2>

          {/* Embedded Stats */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-orbitron font-bold text-green-600">+{agentData.pnl}%</span>
                </div>
                <p className="text-xs text-gray-500 font-exo">{t('agent.stats.totalReturn')}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-bsc-600" />
                  <span className="text-sm font-orbitron font-bold text-bsc-600">{agentData.totalTrades.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 font-exo">{t('agent.stats.totalTrades')}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BarChart3 className="w-3 h-3 text-bsc-600" />
                  <span className="text-sm font-orbitron font-bold text-bsc-600">{agentData.winRate}%</span>
                </div>
                <p className="text-xs text-gray-500 font-exo">{t('agent.stats.winRate')}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-orbitron font-bold text-green-600">{agentData.health}%</span>
                </div>
                <p className="text-xs text-gray-500 font-exo">{t('agent.stats.performance')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {recentTrades.map((trade) => (
              <div key={trade.id} className={`rounded-xl p-4 hover:shadow-md transition-all ${
                trade.status === 'active'
                  ? 'bg-gradient-to-r from-bsc-50 to-green-50 border-2 border-bsc-200'
                  : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 font-exo">{trade.pair}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-exo font-medium ${
                      trade.type === 'Long'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {t(`trades.${trade.type.toLowerCase()}`)}
                    </span>
                    {trade.status === 'active' && (
                      <span className="px-3 py-1 bg-bsc-500 text-white rounded-full text-xs font-exo font-medium animate-pulse">
                        🔥 {t('trades.activePosition')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {trade.verified && (
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-exo">{t('trades.verified')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`grid gap-4 text-sm mb-3 ${
                  trade.status === 'active' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-3'
                }`}>
                  <div>
                    <span className="text-gray-500 font-exo">{t('trades.entryPrice')}</span>
                    <p className="text-gray-900 font-exo font-medium">${trade.entry}</p>
                  </div>

                  {trade.status === 'active' ? (
                    <>
                      <div>
                        <span className="text-gray-500 font-exo">{t('trades.currentPrice')}</span>
                        <p className="text-green-600 font-exo font-medium">${trade.currentPrice}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-exo">{t('trades.positionSize')}</span>
                        <p className="text-bsc-600 font-exo font-medium">{trade.positionSize}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-exo">{t('trades.unrealizedPnL')}</span>
                        <p className="text-green-600 font-exo font-bold text-lg">+{trade.pnl}%</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-gray-500 font-exo">{t('trades.exitPrice')}</span>
                        <p className="text-gray-900 font-exo font-medium">${trade.exit}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-exo">{t('trades.realizedPnL')}</span>
                        <p className={`font-exo font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl}%
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {trade.status === 'active' && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-bsc-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 font-exo">{t('trades.stopLoss')}</span>
                        <p className="text-red-600 font-exo font-medium">{trade.stopLoss}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-exo">{t('trades.takeProfit')}</span>
                        <p className="text-green-600 font-exo font-medium">{trade.takeProfit}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                  <Clock className="w-3 h-3" />
                  <span className="font-exo">{trade.time}</span>
                  {trade.status === 'active' && (
                    <>
                      <span className="mx-2">•</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-exo text-green-600">{t('trades.livePosition')}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Evolution & Activity */}
        <div className="bg-white card-shadow rounded-xl p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-bsc-500 diamond-shape"></div>
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-gray-900">{t('ai.title')}</h2>
              <p className="text-sm text-gray-600 font-exo">{t('ai.subtitle')}</p>
            </div>
          </div>

          {/* AI Status Header */}
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-exo font-medium">{t('ai.statusText')}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-center">
                  <span className="text-gray-400 font-exo">{t('ai.metrics.confidence')}</span>
                  <p className="text-green-400 font-semibold">87%</p>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 font-exo">{t('ai.metrics.learningRate')}</span>
                  <p className="text-blue-400 font-semibold">+2.1%</p>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 font-exo">{t('ai.metrics.evolution')}</span>
                  <p className="text-purple-400 font-semibold">Gen 3.2</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto">
            {aiActivities.map((activity) => (
              <div key={activity.id} className={`rounded-xl p-4 border-l-4 hover:shadow-md transition-all ${
                activity.status === 'active'
                  ? 'bg-gradient-to-r from-bsc-50 to-purple-50 border-l-bsc-500'
                  : activity.type === 'evolution'
                  ? 'bg-purple-50 border-l-purple-500'
                  : activity.type === 'learning'
                  ? 'bg-blue-50 border-l-blue-500'
                  : activity.type === 'trade'
                  ? 'bg-bsc-50 border-l-bsc-500'
                  : activity.type === 'success'
                  ? 'bg-green-50 border-l-green-500'
                  : activity.type === 'warning'
                  ? 'bg-yellow-50 border-l-yellow-500'
                  : 'bg-gray-50 border-l-gray-500'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'active' ? 'bg-bsc-500 animate-pulse' :
                      activity.type === 'evolution' ? 'bg-purple-500' :
                      activity.type === 'learning' ? 'bg-blue-500' :
                      activity.type === 'trade' ? 'bg-bsc-500' :
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}></div>
                    <h3 className="font-semibold text-gray-900 font-exo">{activity.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-exo font-medium ${
                      activity.impact === 'High'
                        ? 'bg-red-100 text-red-600'
                        : activity.impact === 'Medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.impact}
                    </span>
                    {activity.status === 'active' && (
                      <span className="px-2 py-1 bg-bsc-500 text-white rounded-full text-xs font-exo font-medium animate-pulse">
                        🔥 {t('ai.status.active')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-mono font-exo">{activity.time}</span>
                </div>

                <p className="text-sm text-gray-600 font-exo mb-3">{activity.description}</p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(activity.metrics).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg p-2">
                      <span className="text-gray-500 font-exo capitalize">{key}</span>
                      <p className={`font-semibold font-exo ${
                        value.toString().includes('+') ? 'text-green-600' :
                        value.toString().includes('-') ? 'text-red-600' :
                        'text-gray-900'
                      }`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Evolution Changes - Only for evolution type activities */}
                {activity.type === 'evolution' && activity.evolutionChanges && (
                  <ActivityEvolutionChanges
                    changes={activity.evolutionChanges}
                    onShowChanges={() => handleShowEvolutionChanges(activity)}
                  />
                )}

                {/* Status indicator */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'active' ? 'bg-green-500 animate-pulse' :
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'monitoring' ? 'bg-yellow-500' :
                    activity.status === 'executed' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-500 font-exo capitalize">{t(`ai.status.${activity.status}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BSC Network Info */}
      <div className="bg-bsc-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-bsc-500 diamond-shape"></div>
          <h3 className="text-lg font-orbitron font-bold text-gray-900">{t('bsc.title')}</h3>
        </div>
        <p className="text-gray-600 font-exo mb-6">
          {t('bsc.description')}
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900">{t('bsc.benefits.lowGasFees.title')}</h4>
            <p className="text-sm text-gray-600 font-exo">{t('bsc.benefits.lowGasFees.description')}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900">{t('bsc.benefits.fastExecution.title')}</h4>
            <p className="text-sm text-gray-600 font-exo">{t('bsc.benefits.fastExecution.description')}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900">{t('bsc.benefits.highLiquidity.title')}</h4>
            <p className="text-sm text-gray-600 font-exo">{t('bsc.benefits.highLiquidity.description')}</p>
          </div>
        </div>
      </div>

      {/* Evolution Changes Modal */}
      {selectedEvolutionData && (
        <EvolutionChangesModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          changes={selectedEvolutionData.changes}
          activityTitle={selectedEvolutionData.title}
          activityTime={selectedEvolutionData.time}
        />
      )}
    </div>
  )
}

export default AgentDashboard