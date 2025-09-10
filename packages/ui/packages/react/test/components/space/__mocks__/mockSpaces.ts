import type { Space } from '@storacha/ui-core'

/**
 * Mock space data for testing
 */
export const mockSpaces: Space[] = [
  {
    did: () => 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
    name: 'My First Space',
    access: { type: 'public' },
    meta: () => ({
      name: 'My First Space',
      access: { type: 'public' }
    })
  } as Space,
  {
    did: () => 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doL',
    name: 'Development Space',
    access: { type: 'public' },
    meta: () => ({
      name: 'Development Space',
      access: { type: 'public' }
    })
  } as Space,
  {
    did: () => 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doM',
    name: 'Private Documents',
    access: { type: 'private' },
    meta: () => ({
      name: 'Private Documents',
      access: { type: 'private' }
    })
  } as Space,
  {
    did: () => 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doN',
    name: undefined, // Space without name
    access: { type: 'public' },
    meta: () => ({
      access: { type: 'public' }
    })
  } as Space
]

/**
 * Mock current space
 */
export const mockCurrentSpace: Space = mockSpaces[0]

/**
 * Mock space creation response
 */
export const mockCreatedSpace: Space = {
  did: () => 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doO',
  name: 'New Test Space',
  access: { type: 'public' },
  meta: () => ({
    name: 'New Test Space',
    access: { type: 'public' }
  })
} as Space

/**
 * Mock space with usage data
 */
export const mockSpaceWithUsage: Space & { usage?: { totalSize: number; fileCount: number } } = {
  ...mockSpaces[0],
  usage: {
    totalSize: 1024 * 1024 * 50, // 50MB
    fileCount: 25
  }
} as Space & { usage?: { totalSize: number; fileCount: number } }

/**
 * Helper to create mock space
 */
export function createMockSpace(overrides: Partial<Space> = {}): Space {
  return {
    did: () => 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doP',
    name: 'Mock Space',
    access: { type: 'public' },
    meta: () => ({
      name: 'Mock Space',
      access: { type: 'public' }
    }),
    ...overrides
  } as Space
}

/**
 * Helper to create mock private space
 */
export function createMockPrivateSpace(overrides: Partial<Space> = {}): Space {
  return createMockSpace({
    name: 'Mock Private Space',
    access: { type: 'private' },
    meta: () => ({
      name: 'Mock Private Space',
      access: { type: 'private' }
    }),
    ...overrides
  })
}
