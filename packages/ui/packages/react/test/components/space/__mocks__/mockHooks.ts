import { vi } from 'vitest'
import type { Space, Account } from '@storacha/ui-core'
import { mockSpaces, mockAccounts, mockCurrentSpace } from './mockSpaces.js'

/**
 * Mock useSpaceOperations hook
 */
export const mockUseSpaceOperations = vi.fn().mockReturnValue({
  spaces: mockSpaces,
  currentSpace: mockCurrentSpace,
  isLoading: false,
  error: undefined,
  createSpace: vi.fn().mockResolvedValue(mockSpaces[0]),
  setCurrentSpace: vi.fn().mockResolvedValue(undefined),
  deleteSpace: vi.fn().mockResolvedValue(undefined)
})

/**
 * Mock useSpaceValidation hook
 */
export const mockUseSpaceValidation = vi.fn().mockReturnValue({
  canAccessPrivateSpaces: true,
  isCheckingAccess: false,
  validateSpaceCreation: vi.fn().mockReturnValue({})
})

/**
 * Mock useSpaceUsage hook
 */
export const mockUseSpaceUsage = vi.fn().mockReturnValue({
  usage: {
    totalSize: 1024 * 1024 * 50, // 50MB
    fileCount: 25,
    lastModified: new Date('2023-01-01')
  },
  isLoading: false,
  error: undefined
})

/**
 * Mock useSpaceTemplates hook
 */
export const mockUseSpaceTemplates = vi.fn().mockReturnValue({
  templates: [
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
    }
  ],
  getTemplate: vi.fn().mockReturnValue({
    id: 'basic',
    name: 'Basic Space',
    description: 'A simple space for general file storage',
    accessType: 'public' as const,
    settings: {}
  }),
  getTemplatesByAccessType: vi.fn().mockReturnValue([
    {
      id: 'basic',
      name: 'Basic Space',
      description: 'A simple space for general file storage',
      accessType: 'public' as const,
      settings: {}
    }
  ])
})

/**
 * Mock useSpaceSearch hook
 */
export const mockUseSpaceSearch = vi.fn().mockReturnValue({
  searchQuery: '',
  filters: {
    accessType: 'all' as const,
    sortBy: 'name' as const,
    sortOrder: 'asc' as const
  },
  filteredSpaces: mockSpaces,
  updateSearchQuery: vi.fn(),
  updateFilters: vi.fn(),
  clearSearch: vi.fn()
})

/**
 * Mock useSpaceSelection hook
 */
export const mockUseSpaceSelection = vi.fn().mockReturnValue({
  selectedSpaces: [],
  selectSpace: vi.fn(),
  selectAllSpaces: vi.fn(),
  clearSelection: vi.fn(),
  isSpaceSelected: vi.fn().mockReturnValue(false),
  selectedCount: 0,
  allSelected: false,
  someSelected: false
})

/**
 * Mock useSpaceErrorHandling hook
 */
export const mockUseSpaceErrorHandling = vi.fn().mockReturnValue({
  errors: {},
  globalError: undefined,
  setError: vi.fn(),
  clearError: vi.fn(),
  clearAllErrors: vi.fn(),
  setGlobalErrorWithTimeout: vi.fn(),
  handleAsyncError: vi.fn().mockResolvedValue(null),
  hasErrors: false
})

/**
 * Mock useFormValidation hook
 */
export const mockUseFormValidation = vi.fn().mockReturnValue({
  validationErrors: {},
  touched: {},
  setFieldError: vi.fn(),
  clearFieldError: vi.fn(),
  setFieldTouched: vi.fn(),
  validateField: vi.fn().mockReturnValue(true),
  validateForm: vi.fn().mockReturnValue(true),
  getFieldError: vi.fn().mockReturnValue(undefined),
  isFieldTouched: vi.fn().mockReturnValue(false),
  shouldShowError: vi.fn().mockReturnValue(false),
  clearAllValidation: vi.fn(),
  hasValidationErrors: false
})

/**
 * Mock useLoadingState hook
 */
export const mockUseLoadingState = vi.fn().mockReturnValue({
  loadingStates: {},
  setLoading: vi.fn(),
  isLoading: vi.fn().mockReturnValue(false),
  withLoading: vi.fn().mockResolvedValue(undefined),
  clearLoading: vi.fn(),
  clearAllLoading: vi.fn(),
  hasAnyLoading: false
})

/**
 * Mock useAsyncOperation hook
 */
export const mockUseAsyncOperation = vi.fn().mockReturnValue({
  data: null,
  isLoading: false,
  error: undefined,
  execute: vi.fn().mockResolvedValue(undefined),
  reset: vi.fn()
})

/**
 * Mock useRetry hook
 */
export const mockUseRetry = vi.fn().mockReturnValue({
  retryCount: 0,
  maxRetries: 3,
  executeWithRetry: vi.fn().mockResolvedValue(undefined),
  resetRetry: vi.fn()
})

/**
 * Mock useDebounce hook
 */
export const mockUseDebounce = vi.fn().mockReturnValue('debounced-value')

/**
 * Mock useThrottle hook
 */
export const mockUseThrottle = vi.fn().mockReturnValue(vi.fn())

/**
 * Helper to create mock hook with custom return value
 */
export function createMockHook<T>(defaultReturn: T) {
  return vi.fn().mockReturnValue(defaultReturn)
}

/**
 * Helper to create mock hook with custom implementation
 */
export function createMockHookWithImplementation<T>(implementation: (...args: any[]) => T) {
  return vi.fn().mockImplementation(implementation)
}

/**
 * Helper to reset all mock hooks
 */
export function resetAllMockHooks() {
  mockUseSpaceOperations.mockClear()
  mockUseSpaceValidation.mockClear()
  mockUseSpaceUsage.mockClear()
  mockUseSpaceTemplates.mockClear()
  mockUseSpaceSearch.mockClear()
  mockUseSpaceSelection.mockClear()
  mockUseSpaceErrorHandling.mockClear()
  mockUseFormValidation.mockClear()
  mockUseLoadingState.mockClear()
  mockUseAsyncOperation.mockClear()
  mockUseRetry.mockClear()
  mockUseDebounce.mockClear()
  mockUseThrottle.mockClear()
}

/**
 * Helper to set mock hook return value
 */
export function setMockHookReturnValue<T>(mockHook: ReturnType<typeof vi.fn>, returnValue: T) {
  mockHook.mockReturnValue(returnValue)
}

/**
 * Helper to set mock hook implementation
 */
export function setMockHookImplementation<T>(mockHook: ReturnType<typeof vi.fn>, implementation: (...args: any[]) => T) {
  mockHook.mockImplementation(implementation)
}
