import React, { useState } from 'react'
import { Cpu, Brain, Target, Shield, Sparkles, ArrowRight, Upload } from 'lucide-react'

const CreateAgent = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    image: '',
    description: '',
    strategy: 'balanced',
    riskTolerance: 50,
    agentStyle: 'scalping',
    maxPosition: 25,
  })

  const strategies = [
    { id: 'conservative', name: 'Conservative', description: 'Low risk, steady growth with capital preservation' },
    { id: 'balanced', name: 'Balanced', description: 'Moderate risk with optimized risk-reward ratios' },
    { id: 'aggressive', name: 'Aggressive', description: 'High risk, maximum growth potential' },
  ]

  const agentStyles = [
    { id: 'scalping', name: 'Scalping', description: 'Quick trades with small profits' },
    { id: 'swing', name: 'Swing Operations', description: 'Medium-term position holding' },
    { id: 'trend', name: 'Trend Following', description: 'Follow major market trends' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-black text-gray-900">Create AI Agent</h1>
        <p className="text-xl text-gray-600 font-exo">
          Build your intelligent AI agent on BSC
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-12">
        {[
          { num: 1, label: 'Basic Info', icon: Cpu },
          { num: 2, label: 'Strategy', icon: Brain },
          { num: 3, label: 'Settings', icon: Target },
          { num: 4, label: 'Deploy', icon: Sparkles },
        ].map((s, idx) => {
          const Icon = s.icon
          const isActive = step === s.num
          const isComplete = step > s.num

          return (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? 'bg-bsc-100 border-bsc-500'
                      : isComplete
                      ? 'bg-green-100 border-green-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${isActive ? 'text-bsc-600' : isComplete ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className={`text-sm font-exo font-medium ${isActive ? 'text-bsc-600' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-0.5 ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white card-shadow rounded-xl p-8 space-y-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-orbitron font-bold text-gray-900">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">Strategy Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Alpha Momentum Strategy"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-bsc-500 focus:outline-none transition-all font-exo"
                />
              </div>

              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="e.g., ALPHA"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-bsc-500 focus:outline-none transition-all font-exo"
                />
              </div>

              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your agent strategy and approach..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-bsc-500 focus:outline-none transition-all resize-none font-exo"
                />
              </div>

              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">Strategy Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-bsc-500 transition-all cursor-pointer">
                  <Upload className="w-12 h-12 text-bsc-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-exo">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2 font-exo">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-orbitron font-bold text-gray-900">Agent Strategy</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-4">Risk Profile</label>
                <div className="grid gap-4">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      onClick={() => setFormData({ ...formData, strategy: strategy.id })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.strategy === strategy.id
                          ? 'bg-bsc-50 border-bsc-500'
                          : 'bg-white border-gray-200 hover:border-bsc-300'
                      }`}
                    >
                      <h3 className="font-exo font-semibold text-gray-900 mb-1">{strategy.name}</h3>
                      <p className="text-sm text-gray-600 font-exo">{strategy.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-4">Agent Style</label>
                <div className="grid gap-4">
                  {agentStyles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => setFormData({ ...formData, agentStyle: style.id })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.agentStyle === style.id
                          ? 'bg-bsc-50 border-bsc-500'
                          : 'bg-white border-gray-200 hover:border-bsc-300'
                      }`}
                    >
                      <h3 className="font-exo font-semibold text-gray-900 mb-1">{style.name}</h3>
                      <p className="text-sm text-gray-600 font-exo">{style.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-orbitron font-bold text-gray-900">Agent Parameters</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-4">
                  Risk Tolerance: <span className="text-bsc-600 font-semibold">{formData.riskTolerance}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.riskTolerance}
                  onChange={(e) => setFormData({ ...formData, riskTolerance: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bsc-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-exo">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-4">
                  Max Position Size: <span className="text-bsc-600 font-semibold">{formData.maxPosition}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={formData.maxPosition}
                  onChange={(e) => setFormData({ ...formData, maxPosition: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bsc-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-exo">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* BSC Settings */}
              <div className="bg-bsc-50 rounded-lg p-6">
                <h3 className="text-lg font-exo font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-bsc-500 diamond-shape"></div>
                  BSC Network Settings
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-exo font-medium text-gray-900">Gas Optimization</h4>
                    <p className="text-sm text-gray-600 font-exo">Auto-optimized for BSC network</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-exo font-medium text-gray-900">Trade Execution</h4>
                    <p className="text-sm text-gray-600 font-exo">Sub-second execution speed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-orbitron font-bold text-gray-900">Deploy Strategy</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-exo font-semibold text-gray-900 mb-4">Strategy Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-exo">Name:</span>
                  <span className="font-exo font-medium text-gray-900">{formData.name || 'Unnamed Strategy'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-exo">Symbol:</span>
                  <span className="font-exo font-medium text-gray-900">{formData.symbol || 'SYM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-exo">Risk Profile:</span>
                  <span className="font-exo font-medium text-bsc-600">{formData.strategy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-exo">Agent Style:</span>
                  <span className="font-exo font-medium text-bsc-600">{formData.agentStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-exo">Risk Tolerance:</span>
                  <span className="font-exo font-medium text-gray-900">{formData.riskTolerance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-exo">Max Position:</span>
                  <span className="font-exo font-medium text-gray-900">{formData.maxPosition}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-exo font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto flex items-center gap-2 px-6 py-3 bsc-gradient rounded-lg font-exo font-medium text-white hover:opacity-90 transition-opacity"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button className="ml-auto flex items-center gap-2 px-8 py-4 bsc-gradient rounded-lg font-exo font-semibold text-lg text-white hover:opacity-90 transition-opacity">
              <Sparkles className="w-6 h-6" />
              Deploy Strategy
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateAgent