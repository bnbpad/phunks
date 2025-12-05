import React from 'react'
import { useParams } from 'react-router-dom'
import { Dna, Brain, Target, Shield, Activity, Lock, Unlock } from 'lucide-react'

const GenomeViewer = () => {
  const { id } = useParams()
  
  const genomeData = {
    identity: {
      name: 'Alpha Predator',
      symbol: 'ALPHA',
      generation: 3,
      created: '2024-01-15',
      hash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385'
    },
    behavioral: {
      personality: 'Aggressive momentum trader with adaptive risk management',
      decisionSpeed: 'Fast',
      learningRate: 'High',
      memoryDepth: '1000 blocks'
    },
    strategy: {
      type: 'Aggressive',
      riskTolerance: 75,
      maxDrawdown: 25,
      profitTarget: 150,
      timeHorizon: 'Short-term'
    },
    evolution: {
      mode: 'Bounded',
      mutationRate: 30,
      adaptationSpeed: 'Medium',
      constraints: ['Max risk: 80%', 'Min liquidity: $10k', 'Max position: 40%']
    },
    traits: [
      { name: 'Volatility Sensing', value: 92, locked: true },
      { name: 'Trend Detection', value: 88, locked: true },
      { name: 'Risk Adaptation', value: 75, locked: false },
      { name: 'Liquidity Optimization', value: 81, locked: false },
      { name: 'Market Timing', value: 79, locked: false },
      { name: 'Position Sizing', value: 85, locked: true },
    ]
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-orbitron font-black glow-cyan">Genome Inspector</h1>
          <p className="text-gray-400 mt-2">Examining the DNA of {genomeData.identity.name}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-cyber-green/20 border border-cyber-green/50 rounded-lg">
          <Shield className="w-5 h-5 text-cyber-green" />
          <span className="font-orbitron text-cyber-green">Gen {genomeData.identity.generation}</span>
        </div>
      </div>
      
      {/* Core Identity */}
      <div className="bg-cyber-darker border border-cyber-cyan/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Dna className="w-6 h-6 text-cyber-cyan" />
          <h2 className="text-2xl font-orbitron font-bold text-cyber-cyan">Core Identity</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="font-orbitron text-white">{genomeData.identity.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Symbol:</span>
              <span className="font-orbitron text-cyber-cyan">${genomeData.identity.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Generation:</span>
              <span className="font-orbitron text-cyber-green">{genomeData.identity.generation}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Created:</span>
              <span className="font-orbitron text-white">{genomeData.identity.created}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400">Genome Hash:</span>
              <span className="font-mono text-xs text-cyber-cyan break-all">{genomeData.identity.hash}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Behavioral Core */}
      <div className="bg-cyber-darker border border-cyber-pink/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-cyber-pink" />
          <h2 className="text-2xl font-orbitron font-bold text-cyber-pink">Behavioral Core</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-gray-400 text-sm">Personality:</span>
            <p className="text-white mt-1">{genomeData.behavioral.personality}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-cyber-dark/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm">Decision Speed</span>
              <p className="text-cyber-pink font-orbitron font-bold mt-1">{genomeData.behavioral.decisionSpeed}</p>
            </div>
            <div className="bg-cyber-dark/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm">Learning Rate</span>
              <p className="text-cyber-pink font-orbitron font-bold mt-1">{genomeData.behavioral.learningRate}</p>
            </div>
            <div className="bg-cyber-dark/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm">Memory Depth</span>
              <p className="text-cyber-pink font-orbitron font-bold mt-1">{genomeData.behavioral.memoryDepth}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Strategy Profile */}
      <div className="bg-cyber-darker border border-cyber-green/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-cyber-green" />
          <h2 className="text-2xl font-orbitron font-bold text-cyber-green">Strategy Profile</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="font-orbitron text-cyber-green">{genomeData.strategy.type}</span>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Risk Tolerance:</span>
                <span className="font-orbitron text-cyber-green">{genomeData.strategy.riskTolerance}%</span>
              </div>
              <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyber-green"
                  style={{ width: `${genomeData.strategy.riskTolerance}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Max Drawdown:</span>
              <span className="font-orbitron text-cyber-red">{genomeData.strategy.maxDrawdown}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Profit Target:</span>
              <span className="font-orbitron text-cyber-green">+{genomeData.strategy.profitTarget}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Horizon:</span>
              <span className="font-orbitron text-white">{genomeData.strategy.timeHorizon}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Evolution Parameters */}
      <div className="bg-cyber-darker border border-cyber-yellow/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-cyber-yellow" />
          <h2 className="text-2xl font-orbitron font-bold text-cyber-yellow">Evolution Parameters</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Mode:</span>
              <span className="font-orbitron text-cyber-yellow">{genomeData.evolution.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mutation Rate:</span>
              <span className="font-orbitron text-cyber-yellow">{genomeData.evolution.mutationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Adaptation Speed:</span>
              <span className="font-orbitron text-cyber-yellow">{genomeData.evolution.adaptationSpeed}</span>
            </div>
          </div>
          
          <div>
            <span className="text-gray-400 text-sm mb-2 block">Evolution Constraints:</span>
            <div className="space-y-2">
              {genomeData.evolution.constraints.map((constraint, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-cyber-red" />
                  <span className="text-white">{constraint}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Genetic Traits */}
      <div className="bg-cyber-darker border border-cyber-purple/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Dna className="w-6 h-6 text-cyber-purple" />
          <h2 className="text-2xl font-orbitron font-bold text-cyber-purple">Genetic Traits</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {genomeData.traits.map((trait, idx) => (
            <div key={idx} className="bg-cyber-dark/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-orbitron">{trait.name}</span>
                {trait.locked ? (
                  <Lock className="w-4 h-4 text-cyber-red" />
                ) : (
                  <Unlock className="w-4 h-4 text-cyber-green" />
                )}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Strength</span>
                  <span className="text-cyber-purple font-orbitron">{trait.value}%</span>
                </div>
                <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyber-purple to-cyber-pink"
                    style={{ width: `${trait.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenomeViewer
