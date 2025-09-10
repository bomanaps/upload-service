import React, { ReactNode, forwardRef } from 'react'
import { useW3 } from '@storacha/ui-react'
import type { Space } from '@storacha/ui-core'
import type { SpacePickerProps } from '../../shared/types/spaceTypes.js'
import { SpacePickerProvider, useSpacePickerContext } from './context/SpacePickerContext.js'
import { SpacePickerSearch } from './SpacePickerSearch.js'
import { SpacePickerViewToggle } from './SpacePickerViewToggle.js'
import { SpacePickerList } from './SpacePickerList.js'
import { SpacePickerGrid } from './SpacePickerGrid.js'
import { SpacePickerQuickActions } from './SpacePickerQuickActions.js'
import { SpacePickerEmpty } from './SpacePickerEmpty.js'
import { SpacePickerLoading } from './SpacePickerLoading.js'
import { SpacePickerError } from './SpacePickerError.js'

// Root component
interface SpacePickerRootProps extends SpacePickerProps {
  children: ReactNode
}

const SpacePickerRoot = forwardRef<HTMLDivElement, SpacePickerRootProps>(
  ({ children, className = '', ...props }, ref) => {
    const [{ spaces, client }] = useW3()
    
    if (!client) {
      return <SpacePickerLoading />
    }

    return (
      <SpacePickerProvider spaces={spaces} {...props}>
        <div ref={ref} className={`space-picker ${className}`}>
          {children}
        </div>
      </SpacePickerProvider>
    )
  }
)

SpacePickerRoot.displayName = 'SpacePicker.Root'

// Search component
const SpacePickerSearchComponent = forwardRef<HTMLInputElement, { className?: string }>(
  ({ className = '' }, ref) => {
    return <SpacePickerSearch ref={ref} className={className} />
  }
)

SpacePickerSearchComponent.displayName = 'SpacePicker.Search'

// View toggle component
const SpacePickerViewToggleComponent = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    return <SpacePickerViewToggle ref={ref} className={className} />
  }
)

SpacePickerViewToggleComponent.displayName = 'SpacePicker.ViewToggle'

// List view component
const SpacePickerListComponent = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    const { viewMode } = useSpacePickerContext()
    
    if (viewMode !== 'list') {
      return null
    }
    
    return <SpacePickerList ref={ref} className={className} />
  }
)

SpacePickerListComponent.displayName = 'SpacePicker.List'

// Grid view component
const SpacePickerGridComponent = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    const { viewMode } = useSpacePickerContext()
    
    if (viewMode !== 'grid') {
      return null
    }
    
    return <SpacePickerGrid ref={ref} className={className} />
  }
)

SpacePickerGridComponent.displayName = 'SpacePicker.Grid'

// Quick actions component
const SpacePickerQuickActionsComponent = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    return <SpacePickerQuickActions ref={ref} className={className} />
  }
)

SpacePickerQuickActionsComponent.displayName = 'SpacePicker.QuickActions'

// Empty state component
const SpacePickerEmptyComponent = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    return <SpacePickerEmpty ref={ref} className={className} />
  }
)

SpacePickerEmptyComponent.displayName = 'SpacePicker.Empty'

// Loading state component
const SpacePickerLoadingComponent = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    return <SpacePickerLoading ref={ref} className={className} />
  }
)

SpacePickerLoadingComponent.displayName = 'SpacePicker.Loading'

// Error state component
const SpacePickerErrorComponent = forwardRef<HTMLDivElement, { 
  className?: string
  error?: Error
  onRetry?: () => void
}>(({ className = '', error, onRetry }, ref) => {
  return <SpacePickerError ref={ref} className={className} error={error} onRetry={onRetry} />
})

SpacePickerErrorComponent.displayName = 'SpacePicker.Error'

// Main SpacePicker component with compound pattern
export const SpacePicker = {
  Root: SpacePickerRoot,
  Search: SpacePickerSearchComponent,
  ViewToggle: SpacePickerViewToggleComponent,
  List: SpacePickerListComponent,
  Grid: SpacePickerGridComponent,
  QuickActions: SpacePickerQuickActionsComponent,
  Empty: SpacePickerEmptyComponent,
  Loading: SpacePickerLoadingComponent,
  Error: SpacePickerErrorComponent
}

// Export individual components for direct use
export {
  SpacePickerRoot,
  SpacePickerSearchComponent as SpacePickerSearch,
  SpacePickerViewToggleComponent as SpacePickerViewToggle,
  SpacePickerListComponent as SpacePickerList,
  SpacePickerGridComponent as SpacePickerGrid,
  SpacePickerQuickActionsComponent as SpacePickerQuickActions,
  SpacePickerEmptyComponent as SpacePickerEmpty,
  SpacePickerLoadingComponent as SpacePickerLoading,
  SpacePickerErrorComponent as SpacePickerError
}

// Export context for advanced usage
export { SpacePickerProvider, useSpacePickerContext }
