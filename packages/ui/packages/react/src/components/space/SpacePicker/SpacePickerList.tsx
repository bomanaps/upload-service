import React, { forwardRef, useCallback } from 'react'
import { useSpacePickerContext } from './context/SpacePickerContext.js'
import { SpacePickerItem } from './SpacePickerItem.js'
import { SpacePickerEmpty } from './SpacePickerEmpty.js'
import { getAccessibilityProps, ARIA_LABELS } from '../../shared/utils/accessibilityHelpers.js'

interface SpacePickerListProps {
  className?: string
  showUsage?: boolean
  allowMultiSelect?: boolean
  onSpaceSelect?: (space: any) => void
  onSpaceAction?: (action: string, space: any) => void
}

export const SpacePickerList = forwardRef<HTMLDivElement, SpacePickerListProps>(
  ({ 
    className = '',
    showUsage = false,
    allowMultiSelect = false,
    onSpaceSelect,
    onSpaceAction
  }, ref) => {
    const {
      filteredSpaces,
      selectedSpaces,
      isSpaceSelected,
      onSpaceSelect: contextOnSpaceSelect,
      onSpaceAction: contextOnSpaceAction,
      allowMultiSelect: contextAllowMultiSelect,
      showUsage: contextShowUsage
    } = useSpacePickerContext()

    const handleSpaceSelect = useCallback((space: any) => {
      contextOnSpaceSelect?.(space)
      onSpaceSelect?.(space)
    }, [contextOnSpaceSelect, onSpaceSelect])

    const handleSpaceAction = useCallback((action: string, space: any) => {
      contextOnSpaceAction?.(action, space)
      onSpaceAction?.(action, space)
    }, [contextOnSpaceAction, onSpaceAction])

    const effectiveShowUsage = showUsage ?? contextShowUsage
    const effectiveAllowMultiSelect = allowMultiSelect ?? contextAllowMultiSelect

    if (filteredSpaces.length === 0) {
      return <SpacePickerEmpty />
    }

    return (
      <div 
        ref={ref} 
        className={`space-picker-list ${className}`}
        role="list"
        aria-label="Spaces list"
      >
        {filteredSpaces.map((space) => (
          <SpacePickerItem
            key={space.did()}
            space={space}
            isSelected={isSpaceSelected(space)}
            showUsage={effectiveShowUsage}
            onSelect={handleSpaceSelect}
            onAction={handleSpaceAction}
            className="mb-2"
          />
        ))}
      </div>
    )
  }
)

SpacePickerList.displayName = 'SpacePickerList'
