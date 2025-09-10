import { useSpacePickerContext } from '../context/SpacePickerContext.js'
import { useSpaceOperations } from '../../shared/hooks/useSpaceOperations.js'
import { useSpaceValidation } from '../../shared/hooks/useSpaceOperations.js'
import { useSpaceUsage } from '../../shared/hooks/useSpaceOperations.js'

/**
 * Main hook for SpacePicker functionality
 */
export function useSpacePicker() {
  const context = useSpacePickerContext()
  const operations = useSpaceOperations()
  const validation = useSpaceValidation()
  
  return {
    ...context,
    ...operations,
    validation
  }
}

/**
 * Hook for space picker search functionality
 */
export function useSpacePickerSearch() {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearSearch,
    isSearchFocused,
    setSearchFocused
  } = useSpacePickerContext()

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearSearch,
    isSearchFocused,
    setSearchFocused
  }
}

/**
 * Hook for space picker selection functionality
 */
export function useSpacePickerSelection() {
  const {
    selectedSpaces,
    setSelectedSpaces,
    toggleSpaceSelection,
    clearSpaceSelection,
    selectAllSpaces,
    isSpaceSelected,
    selectedCount,
    allSelected,
    someSelected,
    allowMultiSelect
  } = useSpacePickerContext()

  return {
    selectedSpaces,
    setSelectedSpaces,
    toggleSpaceSelection,
    clearSpaceSelection,
    selectAllSpaces,
    isSpaceSelected,
    selectedCount,
    allSelected,
    someSelected,
    allowMultiSelect
  }
}

/**
 * Hook for space picker view mode functionality
 */
export function useSpacePickerViewMode() {
  const {
    viewMode,
    setViewMode
  } = useSpacePickerContext()

  return {
    viewMode,
    setViewMode
  }
}

/**
 * Hook for space picker quick actions functionality
 */
export function useSpacePickerQuickActions() {
  const {
    isActionsMenuOpen,
    setActionsMenuOpen,
    actionsMenuSpace,
    setActionsMenuSpace,
    onSpaceAction
  } = useSpacePickerContext()

  return {
    isActionsMenuOpen,
    setActionsMenuOpen,
    actionsMenuSpace,
    setActionsMenuSpace,
    onSpaceAction
  }
}

/**
 * Hook for space picker usage functionality
 */
export function useSpacePickerUsage(space?: any) {
  return useSpaceUsage(space)
}

/**
 * Hook for space picker validation functionality
 */
export function useSpacePickerValidation() {
  return useSpaceValidation()
}
