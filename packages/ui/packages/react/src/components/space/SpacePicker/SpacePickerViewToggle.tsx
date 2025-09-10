import React, { forwardRef, useCallback } from 'react'
import { useSpacePickerContext } from './context/SpacePickerContext.js'
import { getAccessibilityProps, ARIA_LABELS } from '../../shared/utils/accessibilityHelpers.js'

interface SpacePickerViewToggleProps {
  className?: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const SpacePickerViewToggle = forwardRef<HTMLDivElement, SpacePickerViewToggleProps>(
  ({ 
    className = '', 
    showLabels = false,
    size = 'md'
  }, ref) => {
    const { viewMode, setViewMode } = useSpacePickerContext()

    const handleViewModeChange = useCallback((mode: 'list' | 'grid') => {
      setViewMode(mode)
    }, [setViewMode])

    const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    const buttonSizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-base'
    }

    return (
      <div 
        ref={ref} 
        className={`space-picker-view-toggle ${className}`}
        role="group"
        aria-label="View mode selection"
      >
        <button
          type="button"
          onClick={() => handleViewModeChange('list')}
          className={`space-picker-view-toggle-button ${viewMode === 'list' ? 'active' : ''} ${buttonSizeClasses[size]}`}
          aria-pressed={viewMode === 'list'}
          aria-label={ARIA_LABELS.toggleView('list')}
          {...getAccessibilityProps('button')}
        >
          {/* List view icon */}
          <svg 
            className={sizeClasses[size]} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 10h16M4 14h16M4 18h16" 
            />
          </svg>
          {showLabels && (
            <span className="ml-2">List</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleViewModeChange('grid')}
          className={`space-picker-view-toggle-button ${viewMode === 'grid' ? 'active' : ''} ${buttonSizeClasses[size]}`}
          aria-pressed={viewMode === 'grid'}
          aria-label={ARIA_LABELS.toggleView('grid')}
          {...getAccessibilityProps('button')}
        >
          {/* Grid view icon */}
          <svg 
            className={sizeClasses[size]} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
            />
          </svg>
          {showLabels && (
            <span className="ml-2">Grid</span>
          )}
        </button>
      </div>
    )
  }
)

SpacePickerViewToggle.displayName = 'SpacePickerViewToggle'
