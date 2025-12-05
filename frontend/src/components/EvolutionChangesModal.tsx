import React from 'react'
import { X, GitCommit } from 'lucide-react'

interface EvolutionChange {
  before: string[]
  after: string[]
}

interface EvolutionChangesModalProps {
  isOpen: boolean
  onClose: () => void
  changes: EvolutionChange[]
  activityTitle: string
  activityTime: string
}

const EvolutionChangesModal: React.FC<EvolutionChangesModalProps> = ({
  isOpen,
  onClose,
  changes,
  activityTitle,
  activityTime
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCommit className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-orbitron font-bold">{activityTitle}</h2>
                <p className="text-purple-100 text-sm font-exo">{activityTime}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Legend */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-exo font-semibold text-gray-800 mb-3">Legend:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-exo">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span className="text-gray-600">Removed or Modified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-gray-600">Added or Modified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                <span className="text-gray-600">Unchanged</span>
              </div>
            </div>
          </div>

          {/* Line-by-line comparison */}
          <div className="space-y-1">
            {(() => {
              if (changes.length === 0) return null;

              const beforeItems = changes[0].before;
              const afterItems = changes[0].after;
              const maxLength = Math.max(beforeItems.length, afterItems.length);
              const rows = [];

              for (let i = 0; i < maxLength; i++) {
                const beforeItem = beforeItems[i];
                const afterItem = afterItems[i];

                // Determine if this line changed
                const isChanged = beforeItem !== afterItem;
                const hasBeforeOnly = beforeItem && !afterItem;
                const hasAfterOnly = !beforeItem && afterItem;
                const isUnchanged = beforeItem && afterItem && beforeItem === afterItem;

                rows.push(
                  <div key={i} className="grid md:grid-cols-2 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                    {/* Before (Left side) */}
                    <div className={`p-4 border-r border-gray-200 ${
                      hasBeforeOnly ? 'bg-red-50' :
                      isChanged ? 'bg-red-50' :
                      isUnchanged ? 'bg-gray-50' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className={`text-sm font-mono mt-1 flex-shrink-0 ${
                          hasBeforeOnly ? 'text-red-600' :
                          isChanged ? 'text-red-600' :
                          isUnchanged ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {beforeItem ? `${i + 1}.` : '-'}
                        </span>
                        <span className={`text-sm font-exo leading-relaxed ${
                          hasBeforeOnly ? 'text-red-800' :
                          isChanged ? 'text-red-800' :
                          isUnchanged ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {beforeItem || ''}
                        </span>
                      </div>
                    </div>

                    {/* After (Right side) */}
                    <div className={`p-4 ${
                      hasAfterOnly ? 'bg-green-50' :
                      isChanged ? 'bg-green-50' :
                      isUnchanged ? 'bg-gray-50' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className={`text-sm font-mono mt-1 flex-shrink-0 ${
                          hasAfterOnly ? 'text-green-600' :
                          isChanged ? 'text-green-600' :
                          isUnchanged ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {afterItem ? `${i + 1}.` : '-'}
                        </span>
                        <span className={`text-sm font-exo leading-relaxed ${
                          hasAfterOnly ? 'text-green-800' :
                          isChanged ? 'text-green-800' :
                          isUnchanged ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {afterItem || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return rows;
            })()}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-exo font-medium hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvolutionChangesModal