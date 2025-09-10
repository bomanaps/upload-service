import { describe, it, expect, vi } from 'vitest'
import {
  formatFileSize,
  formatDate,
  getRelativeTime,
  shortenDID,
  getFileExtension,
  getFileTypeCategory,
  isPreviewableFile,
  filterSpaces,
  generateId,
  debounce,
  throttle,
  hasPermission,
  isValidEmail,
  isValidDID,
  isValidEmailOrDID,
  getSpaceDisplayName,
  getSpaceTypeDisplayName,
  getSpaceTypeColorClass,
  createFilePath,
  parseFilePath,
  getParentPath,
  getFilename,
  isRootPath,
  sortFileItems
} from '../../../src/components/space/shared/utils/spaceHelpers.js'
import type { Space } from '@storacha/ui-core'

describe('spaceHelpers', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should handle decimal places correctly', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-01T12:00:00Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('2023')
    })
  })

  describe('getRelativeTime', () => {
    it('should return "Just now" for recent dates', () => {
      const now = new Date()
      expect(getRelativeTime(now)).toBe('Just now')
    })

    it('should return minutes ago for recent dates', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      expect(getRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago')
    })

    it('should return hours ago for older dates', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(getRelativeTime(twoHoursAgo)).toBe('2 hours ago')
    })
  })

  describe('shortenDID', () => {
    it('should shorten long DIDs', () => {
      const longDID = 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
      const shortened = shortenDID(longDID, 8)
      expect(shortened).toContain('...')
      expect(shortened.length).toBeLessThan(longDID.length)
    })

    it('should not shorten short DIDs', () => {
      const shortDID = 'did:key:short'
      expect(shortenDID(shortDID, 8)).toBe(shortDID)
    })
  })

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('test.txt')).toBe('txt')
      expect(getFileExtension('image.jpg')).toBe('jpg')
      expect(getFileExtension('file.tar.gz')).toBe('gz')
    })

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('README')).toBe('')
      expect(getFileExtension('file.')).toBe('')
    })
  })

  describe('getFileTypeCategory', () => {
    it('should categorize image files', () => {
      expect(getFileTypeCategory('image.jpg')).toBe('image')
      expect(getFileTypeCategory('photo.png')).toBe('image')
      expect(getFileTypeCategory('icon.svg')).toBe('image')
    })

    it('should categorize video files', () => {
      expect(getFileTypeCategory('video.mp4')).toBe('video')
      expect(getFileTypeCategory('movie.avi')).toBe('video')
    })

    it('should categorize audio files', () => {
      expect(getFileTypeCategory('song.mp3')).toBe('audio')
      expect(getFileTypeCategory('music.wav')).toBe('audio')
    })

    it('should categorize document files', () => {
      expect(getFileTypeCategory('document.pdf')).toBe('document')
      expect(getFileTypeCategory('text.txt')).toBe('document')
    })

    it('should categorize code files', () => {
      expect(getFileTypeCategory('script.js')).toBe('code')
      expect(getFileTypeCategory('component.tsx')).toBe('code')
    })

    it('should return "file" for unknown types', () => {
      expect(getFileTypeCategory('unknown.xyz')).toBe('file')
    })
  })

  describe('isPreviewableFile', () => {
    it('should identify previewable image files', () => {
      expect(isPreviewableFile('image.jpg')).toBe(true)
      expect(isPreviewableFile('photo.png')).toBe(true)
    })

    it('should identify previewable text files', () => {
      expect(isPreviewableFile('readme.txt')).toBe(true)
      expect(isPreviewableFile('config.json')).toBe(true)
    })

    it('should identify previewable PDF files', () => {
      expect(isPreviewableFile('document.pdf')).toBe(true)
    })

    it('should not identify non-previewable files', () => {
      expect(isPreviewableFile('video.mp4')).toBe(false)
      expect(isPreviewableFile('archive.zip')).toBe(false)
    })
  })

  describe('filterSpaces', () => {
    const mockSpaces: Space[] = [
      {
        did: () => 'did:key:1',
        name: 'Public Space',
        access: { type: 'public' }
      } as Space,
      {
        did: () => 'did:key:2',
        name: 'Private Space',
        access: { type: 'private' }
      } as Space,
      {
        did: () => 'did:key:3',
        name: 'Another Public Space',
        access: { type: 'public' }
      } as Space
    ]

    it('should filter by search query', () => {
      const filtered = filterSpaces(mockSpaces, { query: 'Public' })
      expect(filtered).toHaveLength(2)
      expect(filtered.every(space => space.name?.includes('Public'))).toBe(true)
    })

    it('should filter by access type', () => {
      const filtered = filterSpaces(mockSpaces, { accessType: 'private' })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].access?.type).toBe('private')
    })

    it('should sort by name', () => {
      const filtered = filterSpaces(mockSpaces, { sortBy: 'name', sortOrder: 'asc' })
      expect(filtered[0].name).toBe('Another Public Space')
      expect(filtered[1].name).toBe('Private Space')
      expect(filtered[2].name).toBe('Public Space')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId('test')
      const id2 = generateId('test')
      expect(id1).toMatch(/^test-/)
      expect(id2).toMatch(/^test-/)
      expect(id1).not.toBe(id2)
    })

    it('should use default prefix', () => {
      const id = generateId()
      expect(id).toMatch(/^space-/)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test1')
      debouncedFn('test2')
      debouncedFn('test3')

      expect(mockFn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('test3')
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('test1')
      throttledFn('test2')
      throttledFn('test3')

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('test1')
    })
  })

  describe('hasPermission', () => {
    it('should check for wildcard permission', () => {
      expect(hasPermission(['*'], 'store/add')).toBe(true)
    })

    it('should check for specific permission', () => {
      expect(hasPermission(['store/add'], 'store/add')).toBe(true)
      expect(hasPermission(['store/add'], 'store/remove')).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidDID', () => {
    it('should validate DIDs', () => {
      expect(isValidDID('did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK')).toBe(true)
      expect(isValidDID('did:mailto:test@example.com')).toBe(true)
      expect(isValidDID('invalid-did')).toBe(false)
    })
  })

  describe('isValidEmailOrDID', () => {
    it('should validate emails and DIDs', () => {
      expect(isValidEmailOrDID('test@example.com')).toBe(true)
      expect(isValidEmailOrDID('did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK')).toBe(true)
      expect(isValidEmailOrDID('invalid')).toBe(false)
    })
  })

  describe('getSpaceDisplayName', () => {
    it('should return space name when available', () => {
      const space = { name: 'Test Space', did: () => 'did:key:test' } as Space
      expect(getSpaceDisplayName(space)).toBe('Test Space')
    })

    it('should return shortened DID when name is not available', () => {
      const space = { did: () => 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK' } as Space
      const displayName = getSpaceDisplayName(space)
      expect(displayName).toContain('...')
    })
  })

  describe('getSpaceTypeDisplayName', () => {
    it('should return correct display names', () => {
      const publicSpace = { access: { type: 'public' } } as Space
      const privateSpace = { access: { type: 'private' } } as Space

      expect(getSpaceTypeDisplayName(publicSpace)).toBe('Public')
      expect(getSpaceTypeDisplayName(privateSpace)).toBe('Private')
    })
  })

  describe('getSpaceTypeColorClass', () => {
    it('should return correct color classes', () => {
      const publicSpace = { access: { type: 'public' } } as Space
      const privateSpace = { access: { type: 'private' } } as Space

      expect(getSpaceTypeColorClass(publicSpace)).toBe('bg-blue-500 text-white')
      expect(getSpaceTypeColorClass(privateSpace)).toBe('bg-storacha-red text-white')
    })
  })

  describe('createFilePath', () => {
    it('should create valid file paths', () => {
      expect(createFilePath('folder1', 'folder2', 'file.txt')).toBe('folder1/folder2/file.txt')
      expect(createFilePath('/folder1/', '/folder2/', 'file.txt')).toBe('folder1/folder2/file.txt')
    })
  })

  describe('parseFilePath', () => {
    it('should parse file paths correctly', () => {
      expect(parseFilePath('folder1/folder2/file.txt')).toEqual(['folder1', 'folder2', 'file.txt'])
      expect(parseFilePath('/folder1/folder2/file.txt')).toEqual(['folder1', 'folder2', 'file.txt'])
    })
  })

  describe('getParentPath', () => {
    it('should get parent directory path', () => {
      expect(getParentPath('folder1/folder2/file.txt')).toBe('/folder1/folder2')
      expect(getParentPath('file.txt')).toBe('/')
    })
  })

  describe('getFilename', () => {
    it('should extract filename from path', () => {
      expect(getFilename('folder1/folder2/file.txt')).toBe('file.txt')
      expect(getFilename('file.txt')).toBe('file.txt')
    })
  })

  describe('isRootPath', () => {
    it('should identify root paths', () => {
      expect(isRootPath('/')).toBe(true)
      expect(isRootPath('')).toBe(true)
      expect(isRootPath('folder')).toBe(false)
    })
  })

  describe('sortFileItems', () => {
    it('should sort files with directories first', () => {
      const items = [
        { name: 'file.txt', type: 'file' as const },
        { name: 'folder', type: 'directory' as const },
        { name: 'another.txt', type: 'file' as const }
      ]

      const sorted = sortFileItems(items)
      expect(sorted[0].type).toBe('directory')
      expect(sorted[1].name).toBe('another.txt')
      expect(sorted[2].name).toBe('file.txt')
    })
  })
})
