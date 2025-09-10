import React, { forwardRef, useCallback } from 'react'
import { useSpacePickerContext } from './context/SpacePickerContext.js'
import { SpacePickerItem } from './SpacePickerItem.js'
import { SpacePickerEmpty } from './SpacePickerEmpty.js'

interface SpacePickerGridProps {
  className?: string
  showUsage?: boolean
  allowMultiSelect?: boolean
  columns?: number
  onSpaceSelect?: (space: any) => void
  onSpaceAction?: (action: string, space: any) => void
}

export const SpacePickerGrid = forwardRef<HTMLDivElement, SpacePickerGridProps>(
  ({ 
    className = '',
    showUsage = false,
    allowMultiSelect = false,
    columns = 3,
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

    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6'
    }

    const gridColsClass = gridCols[columns as keyof typeof gridCols] || gridCols[3]

    return (
      <div 
        ref={ref} 
        className={`space-picker-grid grid ${gridColsClass} gap-4 ${className}`}
        role="grid"
        aria-label="Spaces grid"
      >
        {filteredSpaces.map((space) => (
          <div key={space.did()} role="gridcell">
            <SpacePickerItem
              space={space}
              isSelected={isSpaceSelected(space)}
              showUsage={effectiveShowUsage}
              onSelect={handleSpaceSelect}
              onAction={handleSpaceAction}
              className="h-full"
            />
          </div>
        ))}
      </div>
    )
  }
)

SpacePickerGrid.displayName = 'SpacePickerGrid'
