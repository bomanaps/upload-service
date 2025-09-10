import React, { forwardRef } from 'react'
import { useSpacePickerContext } from './context/SpacePickerContext.js'

interface SpacePickerEmptyProps {
  className?: string
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const SpacePickerEmpty = forwardRef<HTMLDivElement, SpacePickerEmptyProps>(
  ({ 
    className = '',
    title = 'No spaces found',
    description = 'Create your first space to get started',
    actionLabel = 'Create Space',
    onAction
  }, ref) => {
    const { searchQuery, filteredSpaces } = useSpacePickerContext()

    const hasSearchQuery = searchQuery.length > 0
    const hasSpaces = filteredSpaces.length > 0

    // Don't show empty state if we have spaces
    if (hasSpaces) {
      return null
    }

    const displayTitle = hasSearchQuery ? 'No spaces match your search' : title
    const displayDescription = hasSearchQuery 
      ? `No spaces found for "${searchQuery}". Try adjusting your search terms.`
      : description

    return (
      <div ref={ref} className={`space-empty ${className}`}>
        <div className="space-empty-icon">
          <svg className="w-16 h-16 text-storacha-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        
        <h3 className="space-empty-title">
          {displayTitle}
        </h3>
        
        <p className="space-empty-description">
          {displayDescription}
        </p>

        {onAction && !hasSearchQuery && (
          <button
            type="button"
            onClick={onAction}
            className="space-button mt-4"
          >
            {actionLabel}
          </button>
        )}
      </div>
    )
  }
)

SpacePickerEmpty.displayName = 'SpacePickerEmpty'
