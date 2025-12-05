import React from 'react'
import { Shield, CheckCircle, Clock, AlertCircle, ExternalLink, BarChart3 } from 'lucide-react'

const ZKVerifiability = () => {
  const analytics = [
    {
      id: '1',
      strategyName: 'Alpha Strategy',
      metric: 'Trade Execution',
      details: 'BNB/USDT Long @ $245.67',
      timestamp: '2024-01-20 14:32:25',
      status: 'verified',
      txHash: '0x8f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
      blockNumber: 18234567,
      gasUsed: 42350,
      profit: '+$127.45'
    },
    {
      id: '2',
      strategyName: 'Smart Scalper',
      metric: 'Risk Adjustment',
      details: 'Position size reduced: 25% → 15%',
      timestamp: '2024-01-20 14:28:12',
      status: 'verified',
      txHash: '0x7e2b8a1c0d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      blockNumber: 18234512,
      gasUsed: 28420,
      profit: '+$89.23'
    },
    {
      id: '3',
      strategyName: 'Trend Master',
      metric: 'Portfolio Rebalance',
      details: 'ETH allocation: 40% → 60%',
      timestamp: '2024-01-20 14:15:08',
      status: 'pending',
      txHash: '0x6d1a7b0c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      blockNumber: 18234445,
      gasUsed: 35200,
      profit: '+$234.12'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-bsc-100 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-bsc-600" />
          </div>
        </div>
        <h1 className="text-5xl font-orbitron font-black text-gray-900">Analytics Dashboard</h1>
        <p className="text-xl text-gray-600 font-exo">
          Real-time performance tracking and verified trade analytics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <Shield className="w-8 h-8 text-bsc-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-bsc-600">
            {analytics.length}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-exo">Total Analytics</p>
        </div>

        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-green-600">
            {analytics.filter(a => a.status === 'verified').length}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-exo">Verified</p>
        </div>

        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-yellow-600">
            {analytics.filter(a => a.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-exo">Processing</p>
        </div>

        <div className="bg-white card-shadow rounded-xl p-6 text-center">
          <ExternalLink className="w-8 h-8 text-bsc-600 mx-auto mb-4" />
          <p className="text-3xl font-orbitron font-bold text-bsc-600">
            100%
          </p>
          <p className="text-sm text-gray-500 mt-1 font-exo">Transparency</p>
        </div>
      </div>

      {/* BSC Network Info */}
      <div className="bg-bsc-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-bsc-500 diamond-shape"></div>
          <h2 className="text-2xl font-orbitron font-bold text-gray-900">BSC Network Analytics</h2>
        </div>
        <p className="text-gray-600 font-exo mb-6">
          All trading activities are recorded on Binance Smart Chain for complete transparency and verification.
          Every trade, adjustment, and performance metric is cryptographically secured and publicly verifiable.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900">Low Gas Fees</h4>
            <p className="text-sm text-gray-600 font-exo">Average cost: $0.20 per transaction</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900">Fast Execution</h4>
            <p className="text-sm text-gray-600 font-exo">3-second block confirmation</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900">Secure</h4>
            <p className="text-sm text-gray-600 font-exo">Ethereum-compatible security</p>
          </div>
        </div>
      </div>

      {/* Analytics List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-orbitron font-bold text-gray-900">Recent Activity</h2>

        <div className="space-y-4">
          {analytics.map((item) => (
            <div key={item.id} className="bg-white card-shadow rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-exo">{item.strategyName}</h3>
                  <p className="text-bsc-600 font-exo font-medium">{item.metric}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className={`px-3 py-1 rounded-full text-xs font-exo font-medium border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-exo mb-1">Trade Details</p>
                  <p className="text-gray-900 font-exo">{item.details}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-exo mb-1">Timestamp</p>
                  <p className="text-gray-900 font-exo">{item.timestamp}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 text-sm border-t border-gray-100 pt-4">
                <div>
                  <p className="text-gray-500 font-exo mb-1">Transaction Hash</p>
                  <p className="text-bsc-600 font-mono text-xs break-all">{item.txHash.slice(0, 20)}...</p>
                </div>
                <div>
                  <p className="text-gray-500 font-exo mb-1">Block</p>
                  <p className="text-gray-900 font-exo">{item.blockNumber.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-exo mb-1">Gas Used</p>
                  <p className="text-gray-900 font-exo">{item.gasUsed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-exo mb-1">Profit/Loss</p>
                  <p className="text-green-600 font-exo font-semibold">{item.profit}</p>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button className="flex items-center gap-2 px-4 py-2 text-bsc-600 hover:text-bsc-700 transition-colors font-exo font-medium">
                  <ExternalLink className="w-4 h-4" />
                  View on BSCScan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ZKVerifiability