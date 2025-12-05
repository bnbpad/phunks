import React, { useState } from 'react'
import { Search, Filter, SortDesc, TrendingUp, Users, Target, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AgentCard from '../components/AgentCard'
import { useAgents } from '../lib/hooks/useAgent'

const Traders = () => {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('pnl')
  const [filterBy, setFilterBy] = useState('all')

  // Use real API data
  const { agents, isLoading, error, pagination } = useAgents({
    search: searchTerm,
    sortBy: sortBy as any,
    sortOrder: 'desc'
  })

  // Debug logging
  console.log('API Response:', { agents, isLoading, error, pagination })
  console.log('Agents length:', agents.length)

  // Keep original static data as fallback for development
  const fallbackAgents = [
    {
      id: '1',
      name: 'Alpha Strategy',
      symbol: 'ALPHA',
      pnl: 127.5,
      health: 92,
      evolution: 3,
      trades: 1247,
      image: '/avatars/avatar1.png'
    },
    {
      id: '2',
      name: 'Smart Scalper',
      symbol: 'SCALP',
      pnl: 89.3,
      health: 85,
      evolution: 2,
      trades: 892,
      image: '/avatars/avatar2.png'
    },
    {
      id: '3',
      name: 'Trend Master',
      symbol: 'TREND',
      pnl: 156.8,
      health: 78,
      evolution: 4,
      trades: 2103,
      image: '/avatars/avatar3.png'
    }
  ]

  // Use API data if available, fallback to static data if API fails or returns empty
  const agentsToUse = agents.length > 0 ? agents : (error ? fallbackAgents : [])
  console.log('Using agents:', agentsToUse.length > 0 ? 'API data' : 'fallback data', agentsToUse.length)

  // Client-side filtering for non-API supported filters
  const filteredAgents = agentsToUse.filter(agent => {
    if (filterBy === 'profitable') return agent.pnl > 0
    if (filterBy === 'losing') return agent.pnl < 0
    if (filterBy === 'high-performance') return agent.health >= 80
    return true
  })

  // Debug filtered results
  console.log('Filtered agents:', filteredAgents, 'Length:', filteredAgents.length)

  // Keep original static data as fallback (remove this after API testing)
  const allAgents = [
    {
      id: '1',
      name: 'Alpha Strategy',
      symbol: 'ALPHA',
      pnl: 127.5,
      health: 92,
      evolution: 3,
      trades: 1247,
      image: '/avatars/avatar1.png'
    },
    {
      id: '2',
      name: 'Smart Scalper',
      symbol: 'SCALP',
      pnl: 89.3,
      health: 85,
      evolution: 2,
      trades: 892,
      image: '/avatars/avatar2.png'
    },
    {
      id: '3',
      name: 'Trend Master',
      symbol: 'TREND',
      pnl: 156.8,
      health: 78,
      evolution: 4,
      trades: 2103,
      image: '/avatars/avatar3.png'
    },
    {
      id: '4',
      name: 'Grid Bot Pro',
      symbol: 'GRID',
      pnl: -12.4,
      health: 45,
      evolution: 1,
      trades: 324,
      image: '/avatars/avatar4.png'
    },
    {
      id: '5',
      name: 'Neural Nexus',
      symbol: 'NRNX',
      pnl: 156.8,
      health: 78,
      evolution: 4,
      trades: 2103,
      image: '/avatars/avatar3.png'
    },
    {
      id: '6',
      name: 'Quantum Trader',
      symbol: 'QNTM',
      pnl: 89.3,
      health: 85,
      evolution: 2,
      trades: 892,
      image: '/avatars/avatar2.png'
    },
    {
      id: '7',
      name: 'Sigma Sentinel',
      symbol: 'SGMA',
      pnl: 76.4,
      health: 88,
      evolution: 3,
      trades: 1456,
      image: '/avatars/avatar4.png'
    },
    {
      id: '8',
      name: 'Omega Protocol',
      symbol: 'OMGA',
      pnl: 68.9,
      health: 81,
      evolution: 2,
      trades: 734,
      image: '/avatars/avatar1.png'
    },
    {
      id: '9',
      name: 'Delta Force',
      symbol: 'DLTA',
      pnl: 54.2,
      health: 76,
      evolution: 2,
      trades: 623,
      image: '/avatars/avatar2.png'
    },
    {
      id: '10',
      name: 'Beta Breaker',
      symbol: 'BETA',
      pnl: 42.7,
      health: 72,
      evolution: 1,
      trades: 489,
      image: '/avatars/avatar3.png'
    },
    {
      id: '11',
      name: 'Gamma Ray',
      symbol: 'GMMA',
      pnl: 31.5,
      health: 68,
      evolution: 1,
      trades: 356,
      image: '/avatars/avatar4.png'
    },
    {
      id: '12',
      name: 'Theta Surge',
      symbol: 'THETA',
      pnl: 95.2,
      health: 90,
      evolution: 3,
      trades: 1823,
      image: '/avatars/avatar1.png'
    },
    {
      id: '13',
      name: 'Lambda Logic',
      symbol: 'LAMBDA',
      pnl: 23.1,
      health: 64,
      evolution: 1,
      trades: 287,
      image: '/avatars/avatar2.png'
    },
    {
      id: '14',
      name: 'Kappa King',
      symbol: 'KAPPA',
      pnl: 112.7,
      health: 86,
      evolution: 3,
      trades: 1567,
      image: '/avatars/avatar3.png'
    },
    {
      id: '15',
      name: 'Zeta Zone',
      symbol: 'ZETA',
      pnl: -8.3,
      health: 52,
      evolution: 1,
      trades: 198,
      image: '/avatars/avatar4.png'
    }
  ]

  // Note: Filtering and sorting now handled by API, fallback logic exists above

  const stats = {
    total: pagination?.totalAgents || agentsToUse.length,
    profitable: agentsToUse.filter(t => t.pnl > 0).length,
    totalVolume: agentsToUse.reduce((sum, t) => sum + t.trades, 0),
    avgPerformance: agentsToUse.length > 0 ? (agentsToUse.reduce((sum, t) => sum + t.pnl, 0) / agentsToUse.length).toFixed(1) : '0.0'
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-bsc-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-exo">Loading agents...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-red-600 font-exo">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-black text-gray-900">{t('agentsPage.title')}</h1>
        <p className="text-xl text-gray-600 font-exo">
          {t('agentsPage.subtitle')}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <Users className="w-8 h-8 text-bsc-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-bsc-600">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1 font-exo">{t('agentsPage.stats.totalStrategies')}</p>
        </div>

        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-green-600">{stats.profitable}</p>
          <p className="text-sm text-gray-500 mt-1 font-exo">{t('agentsPage.stats.profitable')}</p>
        </div>

        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <BarChart3 className="w-8 h-8 text-bsc-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-bsc-600">{stats.totalVolume.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1 font-exo">{t('agentsPage.stats.totalTrades')}</p>
        </div>

        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <Target className="w-8 h-8 text-bsc-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-bsc-600">{stats.avgPerformance}%</p>
          <p className="text-sm text-gray-500 mt-1 font-exo">{t('agentsPage.stats.avgPerformance')}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white card-shadow rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('agentsPage.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-bsc-500 focus:outline-none font-exo"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-bsc-500 focus:outline-none font-exo appearance-none"
            >
              <option value="pnl">{t('agentsPage.sortBy.performance')}</option>
              <option value="health">{t('agentsPage.sortBy.health')}</option>
              <option value="trades">{t('agentsPage.sortBy.trades')}</option>
              <option value="name">{t('agentsPage.sortBy.name')}</option>
            </select>
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-bsc-500 focus:outline-none font-exo appearance-none"
            >
              <option value="all">{t('agentsPage.filterBy.all')}</option>
              <option value="profitable">{t('agentsPage.filterBy.profitable')}</option>
              <option value="losing">{t('agentsPage.filterBy.losing')}</option>
              <option value="high-performance">{t('agentsPage.filterBy.highPerformance')}</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-exo">
            {t('agentsPage.showing', { count: filteredAgents.length, total: stats.total })}
          </p>
          <div className="flex items-center gap-2 text-xs text-bsc-600">
            <div className="w-3 h-3 bg-bsc-500 diamond-shape"></div>
            <span className="font-exo">{t('common.bscNetwork')}</span>
          </div>
        </div>
      </div>

      {/* Traders Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAgents.map((agent) => (
          <AgentCard key={agent.id} {...agent} />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 font-exo">{t('agentsPage.noResults')}</p>
        </div>
      )}
    </div>
  )
}

export default Traders