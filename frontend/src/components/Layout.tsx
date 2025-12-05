import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, Trophy, Plus, Users } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  
  const navItems = [
    { path: '/traders', icon: Users, label: 'Agents' },
    { path: '/arena', icon: Trophy, label: 'Leaderboard' },
  ]
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-bsc-500 diamond-shape"></div>
              <div>
                <h1 className="text-xl font-orbitron font-bold text-gray-900">Phunks</h1>
                <p className="text-xs text-bsc-600 font-exo">AI Trading on BSC</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-bsc-50 text-bsc-700 border border-bsc-200'
                        : 'text-gray-600 hover:text-bsc-700 hover:bg-bsc-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-exo font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                to="/create"
                className="flex items-center gap-2 px-4 py-2 bsc-gradient hover:opacity-90 rounded-md font-exo font-medium text-sm text-white transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Create Agent
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-card border-t border-gray-200 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-bsc-600" />
              <span className="text-sm text-gray-600 font-exo">
                AI-powered trading on Binance Smart Chain
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 font-exo">
              <a href="#" className="hover:text-bsc-600 transition-colors">Documentation</a>
              <a href="#" className="hover:text-bsc-600 transition-colors">Support</a>
              <a href="#" className="hover:text-bsc-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
