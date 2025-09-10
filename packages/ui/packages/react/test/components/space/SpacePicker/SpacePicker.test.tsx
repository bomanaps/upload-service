import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SpacePicker } from '../../../../src/components/space/SpacePicker/SpacePicker.js'
import { mockSpaces, mockClient, mockUseW3Return } from '../__mocks__/mockClient.js'

// Mock the useW3 hook
vi.mock('@storacha/ui-react', () => ({
  useW3: vi.fn(() => [mockUseW3Return, {}])
}))

// Mock the shared hooks
vi.mock('../../../../src/components/space/shared/hooks/useSpaceOperations.js', () => ({
  useSpaceSearch: vi.fn(() => ({
    searchQuery: '',
    filters: { accessType: 'all', sortBy: 'name', sortOrder: 'asc' },
    filteredSpaces: mockSpaces,
    updateSearchQuery: vi.fn(),
    updateFilters: vi.fn(),
    clearSearch: vi.fn()
  })),
  useSpaceSelection: vi.fn(() => ({
    selectedSpaces: [],
    selectSpace: vi.fn(),
    selectAllSpaces: vi.fn(),
    clearSelection: vi.fn(),
    isSpaceSelected: vi.fn(() => false),
    selectedCount: 0,
    allSelected: false,
    someSelected: false
  })),
  useSpaceUsage: vi.fn(() => ({
    usage: { totalSize: 1024, fileCount: 1, lastModified: new Date() },
    isLoading: false,
    error: undefined
  })),
  useSpaceValidation: vi.fn(() => ({
    canAccessPrivateSpaces: true,
    isCheckingAccess: false,
    validateSpaceCreation: vi.fn(() => ({}))
  }))
}))

describe('SpacePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('SpacePicker.Root', () => {
    it('should render without crashing', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.Search />
          <SpacePicker.List />
        </SpacePicker.Root>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should show loading state when client is not available', () => {
      // Mock useW3 to return no client
      vi.mocked(require('@storacha/ui-react').useW3).mockReturnValue([
        { client: undefined, spaces: [], accounts: [] },
        {}
      ])

      render(
        <SpacePicker.Root>
          <SpacePicker.Search />
        </SpacePicker.Root>
      )

      expect(screen.getByText('Loading spaces...')).toBeInTheDocument()
    })

    it('should pass props to SpacePickerProvider', () => {
      const onSpaceSelect = vi.fn()
      const onSpaceAction = vi.fn()

      render(
        <SpacePicker.Root
          onSpaceSelect={onSpaceSelect}
          onSpaceAction={onSpaceAction}
          allowMultiSelect={true}
          showUsage={true}
        >
          <SpacePicker.Search />
        </SpacePicker.Root>
      )

      // The props should be passed to the provider
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('SpacePicker.Search', () => {
    it('should render search input', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.Search />
        </SpacePicker.Root>
      )

      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('placeholder', 'Search spaces...')
    })

    it('should handle search input changes', async () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.Search />
        </SpacePicker.Root>
      )

      const searchInput = screen.getByRole('textbox')
      fireEvent.change(searchInput, { target: { value: 'test search' } })

      await waitFor(() => {
        expect(searchInput).toHaveValue('test search')
      })
    })

    it('should show clear button when there is text', async () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.Search />
        </SpacePicker.Root>
      )

      const searchInput = screen.getByRole('textbox')
      fireEvent.change(searchInput, { target: { value: 'test' } })

      await waitFor(() => {
        const clearButton = screen.getByLabelText('Clear search')
        expect(clearButton).toBeInTheDocument()
      })
    })

    it('should clear search when clear button is clicked', async () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.Search />
        </SpacePicker.Root>
      )

      const searchInput = screen.getByRole('textbox')
      fireEvent.change(searchInput, { target: { value: 'test' } })

      await waitFor(() => {
        const clearButton = screen.getByLabelText('Clear search')
        fireEvent.click(clearButton)
      })

      expect(searchInput).toHaveValue('')
    })

    it('should show filters when showFilters is true', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.Search showFilters={true} />
        </SpacePicker.Root>
      )

      expect(screen.getByLabelText('Filter by access type')).toBeInTheDocument()
      expect(screen.getByLabelText('Sort by')).toBeInTheDocument()
      expect(screen.getByLabelText('Sort order')).toBeInTheDocument()
    })
  })

  describe('SpacePicker.ViewToggle', () => {
    it('should render view toggle buttons', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.ViewToggle />
        </SpacePicker.Root>
      )

      const listButton = screen.getByLabelText('Switch to list view')
      const gridButton = screen.getByLabelText('Switch to grid view')

      expect(listButton).toBeInTheDocument()
      expect(gridButton).toBeInTheDocument()
    })

    it('should show list view as active by default', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.ViewToggle />
        </SpacePicker.Root>
      )

      const listButton = screen.getByLabelText('Switch to list view')
      expect(listButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('should switch to grid view when grid button is clicked', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.ViewToggle />
        </SpacePicker.Root>
      )

      const gridButton = screen.getByLabelText('Switch to grid view')
      fireEvent.click(gridButton)

      expect(gridButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('should show labels when showLabels is true', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.ViewToggle showLabels={true} />
        </SpacePicker.Root>
      )

      expect(screen.getByText('List')).toBeInTheDocument()
      expect(screen.getByText('Grid')).toBeInTheDocument()
    })
  })

  describe('SpacePicker.List', () => {
    it('should render spaces in list view', () => {
      render(
        <SpacePicker.Root>
          <SpacePicker.List />
        </SpacePicker.Root>
      )

      // Should render space items
      expect(screen.getByText('My First Space')).toBeInTheDocument()
      expect(screen.getByText('Development Space')).toBeInTheDocument()
    })

    it('should not render when view mode is grid', () => {
      render(
        <SpacePicker.Root defaultViewMode="grid">
          <SpacePicker.List />
        </SpacePicker.Root>
      )

      // List should not be visible when in grid mode
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })

  describe('SpacePicker.Grid', () => {
    it('should render spaces in grid view', () => {
      render(
        <SpacePicker.Root defaultViewMode="grid">
          <SpacePicker.Grid />
        </SpacePicker.Root>
      )

      // Should render space items in grid
      expect(screen.getByText('My First Space')).toBeInTheDocument()
      expect(screen.getByText('Development Space')).toBeInTheDocument()
    })

    it('should not render when view mode is list', () => {
      render(
        <SpacePicker.Root defaultViewMode="list">
          <SpacePicker.Grid />
        </SpacePicker.Root>
      )

      // Grid should not be visible when in list mode
      expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    })

    it('should use custom number of columns', () => {
      render(
        <SpacePicker.Root defaultViewMode="grid">
          <SpacePicker.Grid columns={2} />
        </SpacePicker.Root>
      )

      const grid = screen.getByRole('grid')
      expect(grid).toHaveClass('grid-cols-2')
    })
  })

  describe('SpacePicker.Empty', () => {
    it('should render empty state when no spaces', () => {
      // Mock empty spaces
      vi.mocked(require('@storacha/ui-react').useW3).mockReturnValue([
        { client: mockClient, spaces: [], accounts: [] },
        {}
      ])

      render(
        <SpacePicker.Root>
          <SpacePicker.Empty />
        </SpacePicker.Root>
      )

      expect(screen.getByText('No spaces found')).toBeInTheDocument()
      expect(screen.getByText('Create your first space to get started')).toBeInTheDocument()
    })

    it('should show search-specific message when searching', () => {
      // Mock empty filtered spaces
      vi.mocked(require('../../../../src/components/space/shared/hooks/useSpaceOperations.js').useSpaceSearch)
        .mockReturnValue({
          searchQuery: 'nonexistent',
          filters: { accessType: 'all', sortBy: 'name', sortOrder: 'asc' },
          filteredSpaces: [],
          updateSearchQuery: vi.fn(),
          updateFilters: vi.fn(),
          clearSearch: vi.fn()
        })

      render(
        <SpacePicker.Root>
          <SpacePicker.Empty />
        </SpacePicker.Root>
      )

      expect(screen.getByText('No spaces match your search')).toBeInTheDocument()
    })
  })

  describe('SpacePicker.Loading', () => {
    it('should render loading state', () => {
      render(<SpacePicker.Loading />)

      expect(screen.getByText('Loading spaces...')).toBeInTheDocument()
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    })

    it('should show custom loading message', () => {
      render(<SpacePicker.Loading message="Loading your spaces..." />)

      expect(screen.getByText('Loading your spaces...')).toBeInTheDocument()
    })
  })

  describe('SpacePicker.Error', () => {
    it('should render error state', () => {
      const error = new Error('Failed to load spaces')
      render(<SpacePicker.Error error={error} />)

      expect(screen.getByText('Failed to load spaces')).toBeInTheDocument()
      expect(screen.getByText('Failed to load spaces')).toBeInTheDocument()
    })

    it('should show retry button when onRetry is provided', () => {
      const onRetry = vi.fn()
      render(<SpacePicker.Error onRetry={onRetry} />)

      const retryButton = screen.getByText('Try Again')
      expect(retryButton).toBeInTheDocument()

      fireEvent.click(retryButton)
      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('Integration', () => {
    it('should work as a complete space picker', () => {
      const onSpaceSelect = vi.fn()
      
      render(
        <SpacePicker.Root onSpaceSelect={onSpaceSelect}>
          <SpacePicker.Search />
          <SpacePicker.ViewToggle />
          <SpacePicker.List />
        </SpacePicker.Root>
      )

      // Should render all components
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to list view')).toBeInTheDocument()
      expect(screen.getByText('My First Space')).toBeInTheDocument()
    })

    it('should handle space selection', () => {
      const onSpaceSelect = vi.fn()
      
      render(
        <SpacePicker.Root onSpaceSelect={onSpaceSelect}>
          <SpacePicker.List />
        </SpacePicker.Root>
      )

      const spaceItem = screen.getByText('My First Space')
      fireEvent.click(spaceItem)

      expect(onSpaceSelect).toHaveBeenCalled()
    })
  })
})
