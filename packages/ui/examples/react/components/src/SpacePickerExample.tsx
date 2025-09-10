import React, { useState } from 'react'
import { SpacePicker } from '@storacha/ui-react'
import type { Space } from '@storacha/ui-core'

/**
 * Example usage of the SpacePicker component
 */
export function SpacePickerExample(): React.ReactElement {
  const [selectedSpace, setSelectedSpace] = useState<Space | undefined>()
  const [selectedSpaces, setSelectedSpaces] = useState<Space[]>([])

  const handleSpaceSelect = (space: Space) => {
    setSelectedSpace(space)
    console.log('Selected space:', space)
  }

  const handleSpaceAction = (action: string, space: Space) => {
    console.log('Space action:', action, space)
    
    switch (action) {
      case 'setCurrent':
        console.log('Setting as current space:', space.did())
        break
      case 'rename':
        console.log('Renaming space:', space.did())
        break
      case 'share':
        console.log('Sharing space:', space.did())
        break
      case 'delete':
        console.log('Deleting space:', space.did())
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const handleMultiSelect = (spaces: Space[]) => {
    setSelectedSpaces(spaces)
    console.log('Selected spaces:', spaces)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">SpacePicker Examples</h2>
        
        {/* Basic SpacePicker */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Basic SpacePicker</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <SpacePicker.Root onSpaceSelect={handleSpaceSelect}>
              <SpacePicker.Search />
              <SpacePicker.ViewToggle />
              <SpacePicker.List />
            </SpacePicker.Root>
          </div>
        </div>

        {/* SpacePicker with Grid View */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Grid View SpacePicker</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <SpacePicker.Root 
              defaultViewMode="grid"
              onSpaceSelect={handleSpaceSelect}
            >
              <SpacePicker.Search />
              <SpacePicker.ViewToggle />
              <SpacePicker.Grid columns={3} />
            </SpacePicker.Root>
          </div>
        </div>

        {/* SpacePicker with Usage Indicators */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">SpacePicker with Usage</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <SpacePicker.Root 
              showUsage={true}
              onSpaceSelect={handleSpaceSelect}
            >
              <SpacePicker.Search />
              <SpacePicker.ViewToggle />
              <SpacePicker.List />
            </SpacePicker.Root>
          </div>
        </div>

        {/* Multi-Select SpacePicker */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Multi-Select SpacePicker</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <SpacePicker.Root 
              allowMultiSelect={true}
              onSpaceSelect={handleMultiSelect}
            >
              <SpacePicker.Search />
              <SpacePicker.ViewToggle />
              <SpacePicker.List />
            </SpacePicker.Root>
          </div>
          
          {selectedSpaces.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Spaces ({selectedSpaces.length}):</h4>
              <ul className="text-sm">
                {selectedSpaces.map(space => (
                  <li key={space.did()}>
                    {space.name || space.did()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* SpacePicker with Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">SpacePicker with Quick Actions</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <SpacePicker.Root 
              onSpaceSelect={handleSpaceSelect}
              onSpaceAction={handleSpaceAction}
            >
              <SpacePicker.Search />
              <SpacePicker.ViewToggle />
              <SpacePicker.List />
              <SpacePicker.QuickActions />
            </SpacePicker.Root>
          </div>
        </div>

        {/* Custom Styled SpacePicker */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Custom Styled SpacePicker</h3>
          <div className="border-2 border-storacha-red rounded-xl p-6 bg-storacha-yellow-light">
            <SpacePicker.Root 
              onSpaceSelect={handleSpaceSelect}
              className="space-picker-custom"
            >
              <div className="flex gap-4 mb-4">
                <SpacePicker.Search className="flex-1" />
                <SpacePicker.ViewToggle />
              </div>
              <SpacePicker.List />
            </SpacePicker.Root>
          </div>
        </div>

        {/* Selected Space Display */}
        {selectedSpace && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Selected Space:</h4>
            <div className="text-sm text-green-700">
              <p><strong>Name:</strong> {selectedSpace.name || 'Untitled'}</p>
              <p><strong>DID:</strong> {selectedSpace.did()}</p>
              <p><strong>Type:</strong> {selectedSpace.access?.type || 'public'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Advanced SpacePicker with custom filters
 */
export function AdvancedSpacePickerExample(): React.ReactElement {
  const [filters, setFilters] = useState({
    accessType: 'all' as 'all' | 'public' | 'private',
    sortBy: 'name' as 'name' | 'created' | 'usage',
    sortOrder: 'asc' as 'asc' | 'desc'
  })

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    console.log('Filters changed:', newFilters)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Advanced SpacePicker</h2>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <SpacePicker.Root>
          <div className="flex flex-col gap-4">
            <SpacePicker.Search 
              showFilters={true}
              onFilterChange={handleFilterChange}
            />
            
            <div className="flex justify-between items-center">
              <SpacePicker.ViewToggle showLabels={true} />
              <div className="text-sm text-gray-600">
                Current filters: {filters.accessType} • {filters.sortBy} • {filters.sortOrder}
              </div>
            </div>
            
            <SpacePicker.List />
          </div>
        </SpacePicker.Root>
      </div>
    </div>
  )
}

/**
 * SpacePicker with error handling
 */
export function SpacePickerWithErrorExample(): React.ReactElement {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const handleRetry = () => {
    setHasError(false)
    setError(undefined)
    console.log('Retrying...')
  }

  const simulateError = () => {
    setError(new Error('Failed to load spaces from server'))
    setHasError(true)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">SpacePicker with Error Handling</h2>
      
      <div className="flex gap-4">
        <button 
          onClick={simulateError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Simulate Error
        </button>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        {hasError ? (
          <SpacePicker.Error 
            error={error}
            onRetry={handleRetry}
          />
        ) : (
          <SpacePicker.Root>
            <SpacePicker.Search />
            <SpacePicker.List />
          </SpacePicker.Root>
        )}
      </div>
    </div>
  )
}
