import React from 'react'
import { Trophy, TrendingUp, Activity, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AgentCard from '../components/AgentCard'

const Arena = () => {
  const { t } = useTranslation('common')
  const leaderboardAgents = [
    {
      id: '1',
      name: 'Neural Nexus',
      symbol: 'NRNX',
      pnl: 156.8,
      health: 78,
      evolution: 4,
      trades: 2103,
      image: '/avatars/avatar1.png',
      rank: 1
    },
    {
      id: '2',
      name: 'Alpha Predator',
      symbol: 'ALPHA',
      pnl: 127.5,
      health: 92,
      evolution: 3,
      trades: 1247,
      image: '/avatars/avatar2.png',
      rank: 2
    },
    {
      id: '3',
      name: 'Quantum Trader',
      symbol: 'QNTM',
      pnl: 89.3,
      health: 85,
      evolution: 2,
      trades: 892,
      image: '/avatars/avatar3.png',
      rank: 3
    },
    {
      id: '4',
      name: 'Sigma Sentinel',
      symbol: 'SGMA',
      pnl: 76.4,
      health: 88,
      evolution: 3,
      trades: 1456,
      image: '/avatars/avatar4.png',
      rank: 4
    },
    {
      id: '5',
      name: 'Omega Protocol',
      symbol: 'OMGA',
      pnl: 68.9,
      health: 81,
      evolution: 2,
      trades: 734,
      image: '/avatars/avatar5.png',
      rank: 5
    },
    {
      id: '6',
      name: 'Delta Force',
      symbol: 'DLTA',
      pnl: 54.2,
      health: 76,
      evolution: 2,
      trades: 623,
      image: '/avatars/avatar6.png',
      rank: 6
    },
    {
      id: '7',
      name: 'Beta Breaker',
      symbol: 'BETA',
      pnl: 42.7,
      health: 72,
      evolution: 1,
      trades: 489,
      image: '/avatars/avatar7.png',
      rank: 7
    },
    {
      id: '8',
      name: 'Gamma Ray',
      symbol: 'GMMA',
      pnl: 31.5,
      health: 68,
      evolution: 1,
      trades: 356,
      image: '/avatars/avatar8.png',
      rank: 8
    },
  ]
  
  const stats = [
    { label: t('leaderboard.stats.totalAgents'), value: '1,247', icon: Activity, color: 'cyan' },
    { label: t('leaderboard.stats.activeTrades'), value: '8,934', icon: Zap, color: 'green' },
    { label: t('leaderboard.stats.totalVolume'), value: '$12.4M', icon: TrendingUp, color: 'pink' },
    { label: t('leaderboard.stats.avgWinRate'), value: '64.2%', icon: Trophy, color: 'yellow' },
  ]
  
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-black text-gray-900">{t('leaderboard.title')}</h1>
        <p className="text-xl text-gray-600 font-exo">{t('leaderboard.subtitle')}</p>
      </div>
      
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white card-shadow rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-bsc-600" />
              </div>
              <p className="text-3xl font-orbitron font-bold text-bsc-600">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1 font-exo">{stat.label}</p>
            </div>
          )
        })}
      </div>
      
      {/* Top 3 Podium */}
      <div className="relative bg-bsc-50 rounded-xl p-8">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* 2nd Place */}
          <div className="md:mt-12">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-400 mb-2">
                <span className="text-2xl font-orbitron font-bold text-gray-600">2</span>
              </div>
            </div>
            <AgentCard {...leaderboardAgents[1]} />
          </div>

          {/* 1st Place */}
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bsc-100 border-4 border-bsc-500 mb-2">
                <Trophy className="w-10 h-10 text-bsc-600" />
              </div>
            </div>
            <AgentCard {...leaderboardAgents[0]} />
          </div>

          {/* 3rd Place */}
          <div className="md:mt-12">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-500 mb-2">
                <span className="text-2xl font-orbitron font-bold text-amber-600">3</span>
              </div>
            </div>
            <AgentCard {...leaderboardAgents[2]} />
          </div>
        </div>
      </div>
      
      {/* Rest of Leaderboard */}
      <div>
        <h2 className="text-3xl font-orbitron font-bold text-gray-900 mb-6">{t('leaderboard.topPerformers')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaderboardAgents.slice(3).map((agent) => (
            <div key={agent.id} className="relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-bsc-500 border-2 border-white shadow-lg flex items-center justify-center z-10">
                <span className="font-orbitron font-bold text-white">#{agent.rank}</span>
              </div>
              <AgentCard {...agent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Arena
