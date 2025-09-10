import { vi } from 'vitest'
import type { Client, Account, Space } from '@storacha/ui-core'
import { mockSpaces, mockCurrentSpace, mockCreatedSpace } from './mockSpaces.js'

/**
 * Mock client for testing
 */
export const mockClient: Partial<Client> = {
  spaces: () => mockSpaces,
  currentSpace: () => mockCurrentSpace,
  setCurrentSpace: vi.fn().mockResolvedValue(undefined),
  createSpace: vi.fn().mockResolvedValue(mockCreatedSpace),
  accounts: () => ({
    'did:mailto:test@example.com': mockAccount
  }),
  capability: {
    access: {
      claim: vi.fn().mockResolvedValue(undefined),
      delegate: vi.fn().mockResolvedValue(undefined)
    }
  }
}

/**
 * Mock account for testing
 */
export const mockAccount: Partial<Account> = {
  did: () => 'did:mailto:test@example.com',
  plan: {
    get: vi.fn().mockResolvedValue({ ok: { name: 'free' } })
  },
  provision: vi.fn().mockResolvedValue({ ok: true })
}

/**
 * Mock accounts array
 */
export const mockAccounts: Account[] = [mockAccount as Account]

/**
 * Mock useW3 hook return value
 */
export const mockUseW3Return = {
  client: mockClient as Client,
  accounts: mockAccounts,
  spaces: mockSpaces
}

/**
 * Mock useW3 hook
 */
export const mockUseW3 = vi.fn().mockReturnValue([mockUseW3Return, {}])

/**
 * Helper to create mock client with custom spaces
 */
export function createMockClient(overrides: Partial<Client> = {}): Partial<Client> {
  return {
    ...mockClient,
    ...overrides
  }
}

/**
 * Helper to create mock client with custom spaces
 */
export function createMockClientWithSpaces(spaces: Space[]): Partial<Client> {
  return {
    ...mockClient,
    spaces: () => spaces,
    currentSpace: () => spaces[0] || null
  }
}

/**
 * Helper to create mock client with error
 */
export function createMockClientWithError(error: Error): Partial<Client> {
  return {
    ...mockClient,
    createSpace: vi.fn().mockRejectedValue(error),
    setCurrentSpace: vi.fn().mockRejectedValue(error)
  }
}

/**
 * Mock file for testing
 */
export const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

/**
 * Mock files array for testing
 */
export const mockFiles = [
  new File(['content 1'], 'file1.txt', { type: 'text/plain' }),
  new File(['content 2'], 'file2.txt', { type: 'text/plain' }),
  new File(['content 3'], 'file3.txt', { type: 'text/plain' })
]

/**
 * Mock file item for testing
 */
export const mockFileItem = {
  name: 'test.txt',
  path: '/test.txt',
  type: 'file' as const,
  size: 1024,
  modified: new Date('2023-01-01'),
  cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
}

/**
 * Mock file items array for testing
 */
export const mockFileItems = [
  mockFileItem,
  {
    name: 'folder1',
    path: '/folder1',
    type: 'directory' as const,
    modified: new Date('2023-01-02')
  },
  {
    name: 'image.jpg',
    path: '/image.jpg',
    type: 'file' as const,
    size: 2048,
    modified: new Date('2023-01-03'),
    cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
  }
]

/**
 * Mock permission for testing
 */
export const mockPermission = {
  id: 'perm-1',
  grantee: 'did:mailto:user@example.com',
  capabilities: ['store/add', 'store/remove'],
  expiration: new Date('2024-01-01'),
  created: new Date('2023-01-01'),
  createdBy: 'did:mailto:admin@example.com'
}

/**
 * Mock permissions array for testing
 */
export const mockPermissions = [
  mockPermission,
  {
    id: 'perm-2',
    grantee: 'did:mailto:viewer@example.com',
    capabilities: ['store/add'],
    created: new Date('2023-01-02'),
    createdBy: 'did:mailto:admin@example.com'
  }
]

/**
 * Mock error for testing
 */
export const mockError = new Error('Mock error for testing')

/**
 * Mock network error for testing
 */
export const mockNetworkError = new Error('Network error')

/**
 * Mock validation error for testing
 */
export const mockValidationError = new Error('Validation failed')

/**
 * Helper to create mock file
 */
export function createMockFile(name: string, content: string = 'test content', type: string = 'text/plain'): File {
  return new File([content], name, { type })
}

/**
 * Helper to create mock file item
 */
export function createMockFileItem(overrides: Partial<typeof mockFileItem> = {}): typeof mockFileItem {
  return {
    ...mockFileItem,
    ...overrides
  }
}

/**
 * Helper to create mock permission
 */
export function createMockPermission(overrides: Partial<typeof mockPermission> = {}): typeof mockPermission {
  return {
    ...mockPermission,
    ...overrides
  }
}
