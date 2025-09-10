import React, { forwardRef, useCallback, useState, useEffect } from 'react'
import { useSpacePickerContext } from './context/SpacePickerContext.js'
import { debounce } from '../../shared/utils/spaceHelpers.js'
import { validateAndSanitizeSearchQuery } from '../../shared/utils/validationHelpers.js'
import { getAccessibilityProps, ARIA_LABELS, ARIA_DESCRIPTIONS } from '../../shared/utils/accessibilityHelpers.js'

interface SpacePickerSearchProps {
  className?: string
  placeholder?: string
  debounceMs?: number
  showFilters?: boolean
  onSearchChange?: (query: string) => void
  onFilterChange?: (filters: any) => void
}

export const SpacePickerSearch = forwardRef<HTMLInputElement, SpacePickerSearchProps>(
  ({ 
    className = '', 
    placeholder = 'Search spaces...',
    debounceMs = 300,
    showFilters = true,
    onSearchChange,
    onFilterChange
  }, ref) => {
    const {
      searchQuery,
      setSearchQuery,
      setSearchFocused,
      filters,
      setFilters,
      clearSearch
    } = useSpacePickerContext()

    const [localQuery, setLocalQuery] = useState(searchQuery)
    const [validationError, setValidationError] = useState<string | undefined>()

    // Debounced search function
    const debouncedSearch = useCallback(
      debounce((query: string) => {
        const { value, errors } = validateAndSanitizeSearchQuery(query)
        
        if (hasValidationErrors(errors)) {
          setValidationError(getFirstValidationError(errors))
          return
        }
        
        setValidationError(undefined)
        setSearchQuery(value)
        onSearchChange?.(value)
      }, debounceMs),
      [setSearchQuery, onSearchChange, debounceMs]
    )

    // Update local query when context changes
    useEffect(() => {
      setLocalQuery(searchQuery)
    }, [searchQuery])

    // Handle input change
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setLocalQuery(value)
      debouncedSearch(value)
    }, [debouncedSearch])

    // Handle input focus
    const handleFocus = useCallback(() => {
      setSearchFocused(true)
    }, [setSearchFocused])

    // Handle input blur
    const handleBlur = useCallback(() => {
      setSearchFocused(false)
    }, [setSearchFocused])

    // Handle clear button click
    const handleClear = useCallback(() => {
      setLocalQuery('')
      setSearchQuery('')
      clearSearch()
      onSearchChange?.('')
    }, [setSearchQuery, clearSearch, onSearchChange])

    // Handle filter change
    const handleFilterChange = useCallback((newFilters: any) => {
      setFilters(newFilters)
      onFilterChange?.(newFilters)
    }, [setFilters, onFilterChange])

    // Handle key down events
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        handleClear()
        event.currentTarget.blur()
      }
    }, [handleClear])

    const hasQuery = localQuery.length > 0
    const hasError = !!validationError

    return (
      <div className={`space-picker-search-container ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`space-picker-search ${hasError ? 'border-red-500' : ''}`}
            {...getAccessibilityProps('input', {
              'aria-label': ARIA_LABELS.searchSpaces,
              'aria-describedby': hasError ? 'search-error' : undefined,
              'aria-invalid': hasError
            })}
          />
          
          {/* Search icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-storacha-gray">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Clear button */}
          {hasQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-storacha-gray hover:text-storacha-red transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Validation error */}
        {hasError && (
          <div id="search-error" className="text-red-600 text-sm mt-1">
            {validationError}
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <select
              value={filters.accessType}
              onChange={(e) => handleFilterChange({ accessType: e.target.value })}
              className="space-select text-sm"
              aria-label="Filter by access type"
            >
              <option value="all">All Spaces</option>
              <option value="public">Public Spaces</option>
              <option value="private">Private Spaces</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="space-select text-sm"
              aria-label="Sort by"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Created</option>
              <option value="usage">Sort by Usage</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
              className="space-select text-sm"
              aria-label="Sort order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}

        {/* Search description for screen readers */}
        <div className="sr-only" aria-live="polite">
          {ARIA_DESCRIPTIONS.searchInput}
        </div>
      </div>
    )
  }
)

SpacePickerSearch.displayName = 'SpacePickerSearch'

// Helper functions (these should be imported from validationHelpers)
function hasValidationErrors(errors: any): boolean {
  return Object.values(errors).some(error => error !== undefined && error !== '')
}

function getFirstValidationError(errors: any): string | undefined {
  const errorMessages = Object.values(errors).filter(error => error !== undefined && error !== '')
  return errorMessages.length > 0 ? errorMessages[0] as string : undefined
}
