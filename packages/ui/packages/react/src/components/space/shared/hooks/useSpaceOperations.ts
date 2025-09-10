import { useState, useCallback, useEffect, useMemo } from 'react'
import { useW3 } from '@storacha/ui-react'
import type { Space, Account } from '@storacha/ui-core'
import type { UseSpaceOperationsReturn } from '../types/spaceTypes.js'

/**
 * Hook for common space operations
 */
export function useSpaceOperations(): UseSpaceOperationsReturn {
  const [{ client, spaces, accounts }] = useW3()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const currentSpace = client?.currentSpace()

  const createSpace = useCallback(async (name: string, options: any = {}): Promise<Space> => {
    if (!client) {
      throw new Error('Client not available')
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const space = await client.createSpace(name, options)
      return space
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create space')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [client])

  const setCurrentSpace = useCallback(async (space: Space): Promise<void> => {
    if (!client) {
      throw new Error('Client not available')
    }

    setIsLoading(true)
    setError(undefined)

    try {
      await client.setCurrentSpace(space.did())
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to set current space')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [client])

  const deleteSpace = useCallback(async (space: Space): Promise<void> => {
    if (!client) {
      throw new Error('Client not available')
    }

    setIsLoading(true)
    setError(undefined)

    try {
      // Note: Space deletion might not be available in current API
      // This would need to be implemented when the API supports it
      throw new Error('Space deletion not yet implemented')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete space')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [client])

  return {
    spaces,
    currentSpace,
    isLoading,
    error,
    createSpace,
    setCurrentSpace,
    deleteSpace
  }
}

/**
 * Hook for space validation
 */
export function useSpaceValidation() {
  const [{ accounts }] = useW3()
  const [canAccessPrivateSpaces, setCanAccessPrivateSpaces] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)

  useEffect(() => {
    async function checkPrivateSpaceAccess() {
      if (accounts.length === 0) {
        setCanAccessPrivateSpaces(false)
        setIsCheckingAccess(false)
        return
      }

      try {
        const account = accounts[0]
        const { ok: plan } = await account.plan.get()
        
        // Check if user has a paid plan that allows private spaces
        // This logic would need to be implemented based on actual plan structure
        setCanAccessPrivateSpaces(!!plan && plan.name !== 'free')
      } catch (error) {
        console.error('Failed to check private space access:', error)
        setCanAccessPrivateSpaces(false)
      } finally {
        setIsCheckingAccess(false)
      }
    }

    checkPrivateSpaceAccess()
  }, [accounts])

  const validateSpaceCreation = useCallback((accessType: 'public' | 'private') => {
    if (accessType === 'private' && !canAccessPrivateSpaces) {
      return {
        accessType: 'Upgrade to a paid plan to create private spaces'
      }
    }
    return {}
  }, [canAccessPrivateSpaces])

  return {
    canAccessPrivateSpaces,
    isCheckingAccess,
    validateSpaceCreation
  }
}

/**
 * Hook for space usage information
 */
export function useSpaceUsage(space?: Space) {
  const [usage, setUsage] = useState<{
    totalSize: number
    fileCount: number
    lastModified?: Date
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    if (!space) {
      setUsage(null)
      return
    }

    async function fetchUsage() {
      setIsLoading(true)
      setError(undefined)

      try {
        // Note: Space usage information might not be available in current API
        // This would need to be implemented when the API supports it
        // For now, return mock data
        setUsage({
          totalSize: 0,
          fileCount: 0,
          lastModified: new Date()
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch space usage')
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsage()
  }, [space])

  return {
    usage,
    isLoading,
    error
  }
}

/**
 * Hook for space templates
 */
export function useSpaceTemplates() {
  const [templates, setTemplates] = useState([
    {
      id: 'basic',
      name: 'Basic Space',
      description: 'A simple space for general file storage',
      accessType: 'public' as const,
      settings: {}
    },
    {
      id: 'development',
      name: 'Development Space',
      description: 'Optimized for development workflows',
      accessType: 'public' as const,
      settings: {
        autoBackup: true,
        versioning: true
      }
    },
    {
      id: 'production',
      name: 'Production Space',
      description: 'Secure space for production data',
      accessType: 'private' as const,
      settings: {
        encryption: true,
        backup: true,
        monitoring: true
      }
    }
  ])

  const getTemplate = useCallback((id: string) => {
    return templates.find(template => template.id === id)
  }, [templates])

  const getTemplatesByAccessType = useCallback((accessType: 'public' | 'private') => {
    return templates.filter(template => template.accessType === accessType)
  }, [templates])

  return {
    templates,
    getTemplate,
    getTemplatesByAccessType
  }
}

/**
 * Hook for space search and filtering
 */
export function useSpaceSearch(spaces: Space[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    accessType: 'all' as 'public' | 'private' | 'all',
    sortBy: 'name' as 'name' | 'created' | 'usage',
    sortOrder: 'asc' as 'asc' | 'desc'
  })

  const filteredSpaces = useMemo(() => {
    let filtered = [...spaces]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(space => 
        space.name?.toLowerCase().includes(query) ||
        space.did().toLowerCase().includes(query)
      )
    }

    // Filter by access type
    if (filters.accessType !== 'all') {
      filtered = filtered.filter(space => 
        space.access?.type === filters.accessType
      )
    }

    // Sort spaces
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case 'name':
          const nameA = (a.name || a.did()).toLowerCase()
          const nameB = (b.name || b.did()).toLowerCase()
          comparison = nameA.localeCompare(nameB)
          break
        case 'created':
          // Note: Creation date sorting would need API support
          comparison = 0
          break
        case 'usage':
          // Note: Usage sorting would need API support
          comparison = 0
          break
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [spaces, searchQuery, filters])

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setFilters({
      accessType: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }, [])

  return {
    searchQuery,
    filters,
    filteredSpaces,
    updateSearchQuery,
    updateFilters,
    clearSearch
  }
}

/**
 * Hook for space selection management
 */
export function useSpaceSelection(spaces: Space[]) {
  const [selectedSpaces, setSelectedSpaces] = useState<Space[]>([])

  const selectSpace = useCallback((space: Space) => {
    setSelectedSpaces(prev => {
      if (prev.some(s => s.did() === space.did())) {
        return prev.filter(s => s.did() !== space.did())
      }
      return [...prev, space]
    })
  }, [])

  const selectAllSpaces = useCallback(() => {
    setSelectedSpaces([...spaces])
  }, [spaces])

  const clearSelection = useCallback(() => {
    setSelectedSpaces([])
  }, [])

  const isSpaceSelected = useCallback((space: Space) => {
    return selectedSpaces.some(s => s.did() === space.did())
  }, [selectedSpaces])

  const selectedCount = selectedSpaces.length
  const allSelected = selectedCount === spaces.length && spaces.length > 0
  const someSelected = selectedCount > 0 && selectedCount < spaces.length

  return {
    selectedSpaces,
    selectSpace,
    selectAllSpaces,
    clearSelection,
    isSpaceSelected,
    selectedCount,
    allSelected,
    someSelected
  }
}
