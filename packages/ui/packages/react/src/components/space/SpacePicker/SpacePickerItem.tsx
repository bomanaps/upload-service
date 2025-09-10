import React, { forwardRef, useCallback, useState } from 'react'
import type { Space } from '@storacha/ui-core'
import type { SpacePickerItemProps } from '../../shared/types/spaceTypes.js'
import { 
  getSpaceDisplayName, 
  getSpaceTypeDisplayName, 
  getSpaceTypeColorClass,
  shortenDID,
  formatFileSize
} from '../../shared/utils/spaceHelpers.js'
import { useSpaceUsage } from '../../shared/hooks/useSpaceOperations.js'
import { getAccessibilityProps, ARIA_LABELS } from '../../shared/utils/accessibilityHelpers.js'
import { SpacePickerUsageIndicator } from './SpacePickerUsageIndicator.js'

export const SpacePickerItem = forwardRef<HTMLDivElement, SpacePickerItemProps>(
  ({ 
    space, 
    isSelected = false, 
    showUsage = false, 
    onSelect, 
    onAction,
    className = ''
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const { usage, isLoading: usageLoading } = useSpaceUsage(space)

    const handleClick = useCallback(() => {
      onSelect?.(space)
    }, [onSelect, space])

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleClick()
      }
    }, [handleClick])

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false)
    }, [])

    const displayName = getSpaceDisplayName(space)
    const typeDisplayName = getSpaceTypeDisplayName(space)
    const typeColorClass = getSpaceTypeColorClass(space)
    const shortDID = shortenDID(space.did())

    return (
      <div
        ref={ref}
        className={`space-picker-item ${isSelected ? 'selected' : ''} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        role="button"
        aria-label={ARIA_LABELS.selectSpace(displayName)}
        aria-pressed={isSelected}
        {...getAccessibilityProps('button')}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-4 h-4 bg-storacha-red rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Space icon/avatar */}
        <div className="flex-shrink-0 w-12 h-12 bg-storacha-yellow-light rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-storacha-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        {/* Space details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-storacha-red truncate">
              {displayName}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColorClass}`}>
              {typeDisplayName}
            </span>
          </div>
          
          <p className="text-sm text-storacha-gray font-mono truncate">
            {shortDID}
          </p>

          {/* Usage indicator */}
          {showUsage && (
            <div className="mt-2">
              <SpacePickerUsageIndicator 
                space={space} 
                usage={usage} 
                isLoading={usageLoading}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Quick actions button */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAction?.('menu', space)
            }}
            className="p-1 text-storacha-gray hover:text-storacha-red transition-colors"
            aria-label={ARIA_LABELS.quickActions}
            {...getAccessibilityProps('button')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Hover overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-storacha-yellow-light opacity-50 rounded-lg pointer-events-none" />
        )}
      </div>
    )
  }
)

SpacePickerItem.displayName = 'SpacePickerItem'
