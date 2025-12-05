import React from 'react'
import { useParams } from 'react-router-dom'
import { GitBranch, Dna, TrendingUp, Activity } from 'lucide-react'

const EvolutionTree = () => {
  const { id } = useParams()
  
  const evolutionData = {
    current: {
      id: '3',
      name: 'Alpha Predator',
      generation: 3,
      pnl: 127.5,
      health: 92,
      mutations: ['Enhanced volatility sensing', 'Improved risk adaptation']
    },
    parent: {
      id: '2',
      name: 'Alpha Predator',
      generation: 2,
      pnl: 89.3,
      health: 85,
      mutations: ['Adaptive position sizing']
    },
    grandparent: {
      id: '1',
      name: 'Alpha Predator',
      generation: 1,
      pnl: 45.2,
      health: 78,
      mutations: ['Initial genome']
    },
    children: [
      {
        id: '4a',
        name: 'Alpha Predator Fork A',
        generation: 4,
        pnl: 0,
        health: 100,
        mutations: ['Increased mutation rate', 'Experimental risk profile'],
        status: 'active'
      },
      {
        id: '4b',
        name: 'Alpha Predator Fork B',
        generation: 4,
        pnl: 0,
        health: 100,
        mutations: ['Conservative adaptation', 'Lower volatility threshold'],
        status: 'pending'
      }
    ]
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-orbitron font-black glow-cyan">Evolution Tree</h1>
        <p className="text-xl text-gray-400">The lineage of {evolutionData.current.name}</p>
      </div>
      
      {/* Evolution Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan via-cyber-green to-cyber-pink"></div>
        
        <div className="space-y-12">
          {/* Grandparent */}
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-cyber-cyan/20 border-2 border-cyber-cyan flex items-center justify-center z-10">
                <span className="font-orbitron font-bold text-cyber-cyan">G1</span>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto bg-cyber-darker border border-cyber-cyan/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-white">{evolutionData.grandparent.name}</h3>
                  <p className="text-sm text-gray-400">Generation {evolutionData.grandparent.generation}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-orbitron font-bold text-cyber-cyan">+{evolutionData.grandparent.pnl}%</p>
                  <p className="text-sm text-gray-400">PnL</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Health</span>
                    <span className="text-cyber-cyan font-orbitron">{evolutionData.grandparent.health}%</span>
                  </div>
                  <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyber-cyan"
                      style={{ width: `${evolutionData.grandparent.health}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm">Mutations:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {evolutionData.grandparent.mutations.map((mutation, idx) => (
                      <span key={idx} className="px-3 py-1 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-full text-cyber-cyan text-xs">
                        {mutation}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Parent */}
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-cyber-green/20 border-2 border-cyber-green flex items-center justify-center z-10">
                <span className="font-orbitron font-bold text-cyber-green">G2</span>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto bg-cyber-darker border border-cyber-green/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-white">{evolutionData.parent.name}</h3>
                  <p className="text-sm text-gray-400">Generation {evolutionData.parent.generation}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-orbitron font-bold text-cyber-green">+{evolutionData.parent.pnl}%</p>
                  <p className="text-sm text-gray-400">PnL</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Health</span>
                    <span className="text-cyber-green font-orbitron">{evolutionData.parent.health}%</span>
                  </div>
                  <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyber-green"
                      style={{ width: `${evolutionData.parent.health}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm">Mutations:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {evolutionData.parent.mutations.map((mutation, idx) => (
                      <span key={idx} className="px-3 py-1 bg-cyber-green/20 border border-cyber-green/50 rounded-full text-cyber-green text-xs">
                        {mutation}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current (Highlighted) */}
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-cyber-pink/20 border-4 border-cyber-pink border-glow-pink flex items-center justify-center z-10 animate-pulse-glow">
                <span className="font-orbitron font-bold text-cyber-pink text-lg">G3</span>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-cyber-pink/20 to-cyber-purple/20 border-2 border-cyber-pink border-glow-pink rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-orbitron font-bold text-white glow-pink">{evolutionData.current.name}</h3>
                  <p className="text-sm text-gray-400">Generation {evolutionData.current.generation} • Current</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-orbitron font-bold text-cyber-pink glow-pink">+{evolutionData.current.pnl}%</p>
                  <p className="text-sm text-gray-400">PnL</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Health</span>
                    <span className="text-cyber-pink font-orbitron">{evolutionData.current.health}%</span>
                  </div>
                  <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyber-pink to-cyber-purple"
                      style={{ width: `${evolutionData.current.health}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm">Mutations:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {evolutionData.current.mutations.map((mutation, idx) => (
                      <span key={idx} className="px-3 py-1 bg-cyber-pink/20 border border-cyber-pink/50 rounded-full text-cyber-pink text-xs">
                        {mutation}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Children Forks */}
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-cyber-yellow/20 border-2 border-cyber-yellow flex items-center justify-center z-10">
                <span className="font-orbitron font-bold text-cyber-yellow">G4</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {evolutionData.children.map((child) => (
                <div key={child.id} className="bg-cyber-darker border border-cyber-yellow/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-white">{child.name}</h3>
                      <p className="text-sm text-gray-400">Generation {child.generation}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-orbitron ${
                      child.status === 'active' 
                        ? 'bg-cyber-green/20 text-cyber-green' 
                        : 'bg-cyber-yellow/20 text-cyber-yellow'
                    }`}>
                      {child.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Health</span>
                        <span className="text-cyber-yellow font-orbitron">{child.health}%</span>
                      </div>
                      <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyber-yellow"
                          style={{ width: `${child.health}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400 text-sm">New Mutations:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {child.mutations.map((mutation, idx) => (
                          <span key={idx} className="px-2 py-1 bg-cyber-yellow/20 border border-cyber-yellow/50 rounded-full text-cyber-yellow text-xs">
                            {mutation}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvolutionTree
