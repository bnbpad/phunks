import React from 'react'
import { Twitter, MessageCircle, Globe, Twitch, Hash } from 'lucide-react'
import { ICreateToken } from '../../../lib/types/fourMeme'

interface Step2SocialLinksProps {
  data: ICreateToken
  onDataChange: (updates: Partial<ICreateToken>) => void
  walletConnected: boolean
}

const Step2SocialLinks: React.FC<Step2SocialLinksProps> = ({
  data,
  onDataChange,
  walletConnected
}) => {
  const handleLinkChange = (field: keyof ICreateToken['links'], value: string) => {
    onDataChange({
      links: {
        ...data.links,
        [field]: value
      }
    })
  }

  const socialPlatforms = [
    {
      key: 'twitterLink' as keyof ICreateToken['links'],
      label: 'Twitter (X)',
      icon: Twitter,
      placeholder: 'https://twitter.com/yourmemetoken',
      description: 'Your Twitter/X profile for community updates',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'telegramLink' as keyof ICreateToken['links'],
      label: 'Telegram',
      icon: MessageCircle,
      placeholder: 'https://t.me/yourmemetokenchat',
      description: 'Telegram group for community discussions',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'websiteLink' as keyof ICreateToken['links'],
      label: 'Website',
      icon: Globe,
      placeholder: 'https://yourmemetoken.com',
      description: 'Official website or landing page',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'discordLink' as keyof ICreateToken['links'],
      label: 'Discord',
      icon: Hash,
      placeholder: 'https://discord.gg/yourmemetoken',
      description: 'Discord server for community engagement',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      key: 'twitchLink' as keyof ICreateToken['links'],
      label: 'Twitch',
      icon: Twitch,
      placeholder: 'https://twitch.tv/yourmemetoken',
      description: 'Twitch channel for live streams',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const validateUrl = (url: string): boolean => {
    if (!url) return true // Empty is valid (optional)
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon
          const value = data.links[platform.key] || ''
          const isValid = validateUrl(value)

          return (
            <div key={platform.key} className="space-y-3">
              <div className={`p-4 rounded-lg border ${platform.borderColor} ${platform.bgColor}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-white border ${platform.borderColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                  </div>
                  <div>
                    <h3 className="font-exo font-semibold text-gray-900">{platform.label}</h3>
                    <p className="text-sm text-gray-600 font-exo">{platform.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => handleLinkChange(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 focus:outline-none transition-all font-exo ${
                      !isValid && value
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-bsc-500'
                    }`}
                  />

                  {!isValid && value && (
                    <p className="text-xs text-red-600 font-exo">
                      Please enter a valid URL
                    </p>
                  )}

                  {isValid && value && (
                    <div className="flex items-center gap-2 text-green-600 text-xs font-exo">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Valid URL
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Community Building Tips */}
      <div className="bg-gradient-to-r from-bsc-50 to-purple-50 rounded-lg p-6 border border-bsc-200">
        <h4 className="font-orbitron font-bold text-gray-900 mb-4">
          🚀 Community Building Tips
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 font-exo">
          <div className="space-y-2">
            <p>• <strong>Twitter:</strong> Share updates, memes, and engage with the crypto community</p>
            <p>• <strong>Telegram:</strong> Create an active chat for real-time discussions</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Discord:</strong> Build structured channels for different topics</p>
            <p>• <strong>Website:</strong> Professional presence with roadmap and tokenomics</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-bsc-500 rounded-full"></div>
          <span className="text-sm text-gray-600 font-exo">
            Social links added: {Object.values(data.links).filter(link => link && validateUrl(link)).length}/5
          </span>
        </div>
        <span className="text-xs text-gray-500 font-exo">
          All links are optional
        </span>
      </div>

      {/* Next Step Preview */}
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-700 font-exo text-sm">
          <strong>Next:</strong> Configure AI trading agent (optional) for automated token trading
        </p>
      </div>
    </div>
  )
}

export default Step2SocialLinks