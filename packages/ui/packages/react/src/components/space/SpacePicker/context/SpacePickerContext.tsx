import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import type { Space } from '@storacha/ui-core'
import type { SpacePickerContextValue, SpaceFilterOptions } from '../../shared/types/spaceTypes.js'
import { useSpaceSearch, useSpaceSelection } from '../../shared/hooks/useSpaceOperations.js'

interface SpacePickerState {
  viewMode: 'list' | 'grid'
  searchQuery: string
  filters: SpaceFilterOptions
  selectedSpaces: Space[]
  isSearchFocused: boolean
  isActionsMenuOpen: boolean
  actionsMenuSpace?: Space
}

type SpacePickerAction =
  | { type: 'SET_VIEW_MODE'; payload: 'list' | 'grid' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<SpaceFilterOptions> }
  | { type: 'SET_SELECTED_SPACES'; payload: Space[] }
  | { type: 'TOGGLE_SPACE_SELECTION'; payload: Space }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SELECT_ALL_SPACES'; payload: Space[] }
  | { type: 'SET_SEARCH_FOCUSED'; payload: boolean }
  | { type: 'SET_ACTIONS_MENU_OPEN'; payload: boolean }
  | { type: 'SET_ACTIONS_MENU_SPACE'; payload: Space | undefined }

const initialState: SpacePickerState = {
  viewMode: 'list',
  searchQuery: '',
  filters: {
    accessType: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  selectedSpaces: [],
  isSearchFocused: false,
  isActionsMenuOpen: false,
  actionsMenuSpace: undefined
}

function spacePickerReducer(state: SpacePickerState, action: SpacePickerAction): SpacePickerState {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    
    case 'SET_SELECTED_SPACES':
      return { ...state, selectedSpaces: action.payload }
    
    case 'TOGGLE_SPACE_SELECTION': {
      const space = action.payload
      const isSelected = state.selectedSpaces.some(s => s.did() === space.did())
      const newSelectedSpaces = isSelected
        ? state.selectedSpaces.filter(s => s.did() !== space.did())
        : [...state.selectedSpaces, space]
      return { ...state, selectedSpaces: newSelectedSpaces }
    }
    
    case 'CLEAR_SELECTION':
      return { ...state, selectedSpaces: [] }
    
    case 'SELECT_ALL_SPACES':
      return { ...state, selectedSpaces: action.payload }
    
    case 'SET_SEARCH_FOCUSED':
      return { ...state, isSearchFocused: action.payload }
    
    case 'SET_ACTIONS_MENU_OPEN':
      return { ...state, isActionsMenuOpen: action.payload }
    
    case 'SET_ACTIONS_MENU_SPACE':
      return { ...state, actionsMenuSpace: action.payload }
    
    default:
      return state
  }
}

const SpacePickerContext = createContext<SpacePickerContextValue | undefined>(undefined)

interface SpacePickerProviderProps {
  children: ReactNode
  spaces: Space[]
  onSpaceSelect?: (space: Space) => void
  onSpaceAction?: (action: string, space: Space) => void
  allowMultiSelect?: boolean
  defaultViewMode?: 'list' | 'grid'
  showUsage?: boolean
}

export function SpacePickerProvider({
  children,
  spaces,
  onSpaceSelect,
  onSpaceAction,
  allowMultiSelect = false,
  defaultViewMode = 'list',
  showUsage = false
}: SpacePickerProviderProps): ReactNode {
  const [state, dispatch] = useReducer(spacePickerReducer, {
    ...initialState,
    viewMode: defaultViewMode
  })

  // Use shared hooks for search and selection functionality
  const {
    searchQuery,
    filters,
    filteredSpaces,
    updateSearchQuery,
    updateFilters,
    clearSearch
  } = useSpaceSearch(spaces)

  const {
    selectedSpaces,
    selectSpace,
    selectAllSpaces,
    clearSelection,
    isSpaceSelected,
    selectedCount,
    allSelected,
    someSelected
  } = useSpaceSelection(filteredSpaces)

  // Sync local state with shared hooks
  React.useEffect(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery })
  }, [searchQuery])

  React.useEffect(() => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [filters])

  React.useEffect(() => {
    dispatch({ type: 'SET_SELECTED_SPACES', payload: selectedSpaces })
  }, [selectedSpaces])

  const setViewMode = useCallback((mode: 'list' | 'grid') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode })
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    updateSearchQuery(query)
  }, [updateSearchQuery])

  const setFilters = useCallback((newFilters: Partial<SpaceFilterOptions>) => {
    updateFilters(newFilters)
  }, [updateFilters])

  const setSelectedSpaces = useCallback((spaces: Space[]) => {
    // This will be handled by the shared hook
    if (spaces.length === 0) {
      clearSelection()
    } else if (spaces.length === filteredSpaces.length) {
      selectAllSpaces()
    }
  }, [clearSelection, selectAllSpaces, filteredSpaces.length])

  const toggleSpaceSelection = useCallback((space: Space) => {
    selectSpace(space)
  }, [selectSpace])

  const clearSpaceSelection = useCallback(() => {
    clearSelection()
  }, [clearSelection])

  const selectAllSpacesAction = useCallback(() => {
    selectAllSpaces()
  }, [selectAllSpaces])

  const setSearchFocused = useCallback((focused: boolean) => {
    dispatch({ type: 'SET_SEARCH_FOCUSED', payload: focused })
  }, [])

  const setActionsMenuOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_ACTIONS_MENU_OPEN', payload: open })
  }, [])

  const setActionsMenuSpace = useCallback((space: Space | undefined) => {
    dispatch({ type: 'SET_ACTIONS_MENU_SPACE', payload: space })
  }, [])

  const handleSpaceSelect = useCallback((space: Space) => {
    if (allowMultiSelect) {
      toggleSpaceSelection(space)
    } else {
      onSpaceSelect?.(space)
    }
  }, [allowMultiSelect, toggleSpaceSelection, onSpaceSelect])

  const handleSpaceAction = useCallback((action: string, space: Space) => {
    onSpaceAction?.(action, space)
  }, [onSpaceAction])

  const contextValue: SpacePickerContextValue = {
    viewMode: state.viewMode,
    setViewMode,
    searchQuery: state.searchQuery,
    setSearchQuery,
    selectedSpaces: state.selectedSpaces,
    setSelectedSpaces,
    filteredSpaces,
    onSpaceSelect: handleSpaceSelect,
    onSpaceAction: handleSpaceAction,
    // Additional context-specific values
    filters: state.filters,
    setFilters,
    toggleSpaceSelection,
    clearSpaceSelection,
    selectAllSpaces: selectAllSpacesAction,
    isSpaceSelected,
    selectedCount,
    allSelected,
    someSelected,
    isSearchFocused: state.isSearchFocused,
    setSearchFocused,
    isActionsMenuOpen: state.isActionsMenuOpen,
    setActionsMenuOpen,
    actionsMenuSpace: state.actionsMenuSpace,
    setActionsMenuSpace,
    allowMultiSelect,
    showUsage,
    clearSearch
  }

  return (
    <SpacePickerContext.Provider value={contextValue}>
      {children}
    </SpacePickerContext.Provider>
  )
}

export function useSpacePickerContext(): SpacePickerContextValue {
  const context = useContext(SpacePickerContext)
  if (context === undefined) {
    throw new Error('useSpacePickerContext must be used within a SpacePickerProvider')
  }
  return context
}
