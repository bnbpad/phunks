import React from 'react'
import { User, Target, Clock, Lightbulb } from 'lucide-react'
import { ICreateToken, AIThesisConfig } from '../../../lib/types/fourMeme'

interface Step3AIThesisProps {
  data: ICreateToken
  onDataChange: (updates: Partial<ICreateToken>) => void
  walletConnected: boolean
}

const Step3AIThesis: React.FC<Step3AIThesisProps> = ({
  data,
  onDataChange,
  walletConnected
}) => {
  // Initialize AI thesis if it doesn't exist
  React.useEffect(() => {
    if (!data.aiThesis) {
      onDataChange({
        aiThesis: getDefaultAIThesis()
      })
    }
  }, [])

  const getDefaultAIThesis = (): AIThesisConfig => ({
    goals: '',
    memory: '',
    persona: '',
    experience: ''
  })

  const updateAiThesis = (updates: Partial<AIThesisConfig>) => {
    if (data.aiThesis) {
      onDataChange({
        aiThesis: {
          ...data.aiThesis,
          ...updates
        }
      })
    }
  }

  const handleFieldUpdate = (field: keyof AIThesisConfig, value: string) => {
    updateAiThesis({ [field]: value })
  }

  const aiFields = [
    {
      key: 'goals' as keyof AIThesisConfig,
      label: 'Goals & Objectives',
      icon: Target,
      placeholder: 'Define the primary objectives and mission of your AI agent. What should it achieve? What are its core purposes and desired outcomes?',
      description: 'Core objectives and mission that drive the AI agent\'s actions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'memory' as keyof AIThesisConfig,
      label: 'Memory & History',
      icon: Clock,
      placeholder: 'Describe past experiences, learned patterns, historical context, and important events that shape the AI agent\'s decision-making...',
      description: 'Past experiences and learned patterns that inform decisions',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'persona' as keyof AIThesisConfig,
      label: 'Personality & Persona',
      icon: User,
      placeholder: 'Define the AI agent\'s personality, communication style, behavior patterns, tone of voice, and how it should interact with users...',
      description: 'Personality traits and behavioral characteristics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      key: 'experience' as keyof AIThesisConfig,
      label: 'Experience & Expertise',
      icon: Lightbulb,
      placeholder: 'Detail the background knowledge, skills, areas of expertise, specialized knowledge, and capabilities the AI agent possesses...',
      description: 'Background knowledge and specialized skills',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ]

  return (
    <div className="space-y-6">
      {/* AI Configuration Fields */}
      <div className="space-y-6">
        {aiFields.map((field) => {
          const Icon = field.icon
          const value = data.aiThesis?.[field.key] || ''

          return (
            <div key={field.key} className={`${field.bgColor} rounded-lg p-6 border ${field.borderColor}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-white border ${field.borderColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${field.color}`} />
                </div>
                <div>
                  <h4 className="font-orbitron font-bold text-gray-900">{field.label}</h4>
                  <p className="text-sm text-gray-600 font-exo">{field.description}</p>
                </div>
              </div>

              <textarea
                value={value}
                onChange={(e) => handleFieldUpdate(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-bsc-500 focus:outline-none transition-all resize-none font-exo leading-relaxed"
              />
            </div>
          )
        })}
      </div>

      {/* Agent Creation Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h4 className="font-orbitron font-bold text-gray-900 mb-3">
          🤖 AI Agent Creation
        </h4>
        <p className="text-sm text-gray-700 font-exo mb-4">
          <strong>Complete all fields above to automatically create an AI Agent linked to your token!</strong>
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 font-exo">
          <div className="space-y-2">
            <p>• <strong>Agent Launchpad Integration:</strong> Deploys on-chain AI agent</p>
            <p>• <strong>Token-Linked Agent:</strong> Agent tied to your FourMeme token</p>
            <p>• <strong>Smart Contract Deployment:</strong> Permanent blockchain record</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Goal-Oriented Behavior:</strong> Actions aligned with defined objectives</p>
            <p>• <strong>Memory & Learning:</strong> Contextual understanding and evolution</p>
            <p>• <strong>Personalized Trading:</strong> Custom expertise and personality</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
          <p className="text-xs text-purple-700 font-exo">
            <strong>Note:</strong> If you skip this step, only your FourMeme token will be created.
            Complete all AI fields to also deploy your AI agent to the Agent Launchpad.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Step3AIThesis