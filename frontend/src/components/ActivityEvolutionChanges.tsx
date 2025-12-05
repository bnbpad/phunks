import React from 'react'
import { Eye } from 'lucide-react'

interface EvolutionChange {
  metric: string
  before: string | number
  after: string | number
  improvement: boolean
  description: string
}

interface ActivityEvolutionChangesProps {
  changes: EvolutionChange[]
  onShowChanges: () => void
  className?: string
}

const ActivityEvolutionChanges: React.FC<ActivityEvolutionChangesProps> = ({
  changes,
  onShowChanges,
  className = ""
}) => {
  if (!changes || changes.length === 0) return null

  return (
    <div className={`mt-3 ${className}`}>
      <button
        onClick={onShowChanges}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors text-xs font-exo"
      >
        <Eye className="w-3 h-3" />
        <span>{changes.length} changes</span>
        <span className="underline">show</span>
      </button>
    </div>
  )
}

export default ActivityEvolutionChanges