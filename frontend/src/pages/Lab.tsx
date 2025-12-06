import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Cpu, Shield, Network, TrendingUp, Zap, Plus, ArrowRight, Target, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AgentCard from '../components/AgentCard'

const Lab = () => {
  const { t } = useTranslation('common')
  const featuredAgents = [
    {
      id: '1',
      name: 'Alpha Strategy',
      symbol: 'ALPHA',
      pnl: 127.5,
      health: 92,
      evolution: 3,
      trades: 1247,
      image: '/avatars/avatar4.png'
    },
    {
      id: '2',
      name: 'Smart Scalper',
      symbol: 'SCALP',
      pnl: 89.3,
      health: 85,
      evolution: 2,
      trades: 892,
      image: '/avatars/avatar6.png'
    },
    {
      id: '3',
      name: 'Trend Master',
      symbol: 'TREND',
      pnl: 156.8,
      health: 78,
      evolution: 4,
      trades: 2103,
      image: '/avatars/avatar2.png'
    },
    {
      id: '4',
      name: 'Grid Bot Pro',
      symbol: 'GRID',
      pnl: -12.4,
      health: 45,
      evolution: 1,
      trades: 324,
      image: '/avatars/avatar8.png'
    },
  ]

  const features = [
    {
      icon: Brain,
      title: t('homePage.features.smartAI.title'),
      description: t('homePage.features.smartAI.description'),
    },
    {
      icon: Zap,
      title: t('homePage.features.fastExecution.title'),
      description: t('homePage.features.fastExecution.description'),
    },
    {
      icon: Shield,
      title: t('homePage.features.secure.title'),
      description: t('homePage.features.secure.description'),
    },
    {
      icon: BarChart3,
      title: t('homePage.features.analytics.title'),
      description: t('homePage.features.analytics.description'),
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              {/* <span className="px-4 py-2 bg-bsc-50 border border-bsc-200 rounded-full text-bsc-700 text-sm font-exo font-medium">
                {t('homePage.hero.badge')}
              </span> */}
            </div>

            <h1 className="text-4xl md:text-5xl font-orbitron font-black leading-tight text-gray-900">
              {t('homePage.hero.title')} <span className="text-bsc-600">{t('homePage.hero.titleHighlight')}</span> {t('homePage.hero.titleSuffix')}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg font-exo">
              {t('homePage.hero.subtitle')}
            </p>

            <div className="flex gap-4">
              <Link
                to="/create"
                className="flex items-center gap-2 px-6 py-3 bsc-gradient hover:opacity-90 rounded-lg font-exo font-medium text-white transition-opacity"
              >
                <Plus className="w-5 h-5" />
                {t('homePage.hero.startTrading')}
              </Link>

              <Link
                to="/traders"
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-exo font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('homePage.hero.viewAllTraders')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <p className="text-2xl font-bold text-bsc-600 font-exo">1,247</p>
                <p className="text-sm text-gray-500 font-exo">{t('homePage.hero.stats.activeTraders')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-bsc-600 font-exo">$2.4M</p>
                <p className="text-sm text-gray-500 font-exo">{t('homePage.hero.stats.volumeTraded')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-bsc-600 font-exo">94.2%</p>
                <p className="text-sm text-gray-500 font-exo">{t('homePage.hero.stats.winRate')}</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-80 h-80 relative ai-pattern">
              {/* Clean AI visualization */}
              <div className="absolute inset-0 bg-bsc-50 rounded-lg flex items-center justify-center">
                <div className="relative">
                  {/* BSC-inspired diamond elements */}
                  <div className="w-32 h-32 bg-bsc-500 diamond-shape absolute top-8 left-8 opacity-20"></div>
                  <div className="w-24 h-24 bg-bsc-400 diamond-shape absolute top-12 left-12 opacity-40"></div>
                  <div className="w-16 h-16 bg-bsc-600 diamond-shape absolute top-16 left-16"></div>
                  <Brain className="w-16 h-16 text-white absolute top-20 left-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12 py-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-orbitron font-bold text-gray-900">{t('homePage.features.title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-exo">
            {t('homePage.features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={index}
                className="bg-white card-shadow rounded-lg p-6 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-bsc-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-bsc-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-exo">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-exo">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Featured Agents */}
      <section className="space-y-8 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-orbitron font-bold text-gray-900">{t('homePage.topPerformers.title')}</h2>
            <p className="text-gray-600 mt-1 font-exo">{t('homePage.topPerformers.subtitle')}</p>
          </div>
          <Link
            to="/traders"
            className="flex items-center gap-2 text-bsc-600 hover:text-bsc-700 transition-colors"
          >
            <span className="font-exo font-medium">{t('homePage.topPerformers.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAgents.map((agent) => (
            <AgentCard key={agent.id} {...agent} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bsc-50 rounded-xl p-12 text-center space-y-6">
        <h2 className="text-3xl font-orbitron font-bold text-gray-900">
          {t('homePage.cta.title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-exo">
          {t('homePage.cta.subtitle')}
        </p>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-8 py-4 bsc-gradient hover:opacity-90 rounded-lg font-exo font-semibold text-white transition-opacity"
        >
          <Zap className="w-5 h-5" />
          {t('homePage.cta.getStarted')}
        </Link>
      </section>
    </div>
  )
}

export default Lab
