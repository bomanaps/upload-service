import type { Space } from '@storacha/ui-core'
import type { FileItem, SpaceFilterOptions } from '../types/spaceTypes.js'

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format date in a user-friendly format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(date)
}

/**
 * Shorten DID for display purposes
 */
export function shortenDID(did: string, length: number = 8): string {
  if (did.length <= length * 2 + 3) return did
  return `${did.slice(0, length)}...${did.slice(-length)}`
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  return lastDot !== -1 ? filename.slice(lastDot + 1).toLowerCase() : ''
}

/**
 * Get file type category for icon display
 */
export function getFileTypeCategory(filename: string): string {
  const extension = getFileExtension(filename)
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp']
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv']
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a']
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
  const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'go', 'rs']
  
  if (imageExtensions.includes(extension)) return 'image'
  if (videoExtensions.includes(extension)) return 'video'
  if (audioExtensions.includes(extension)) return 'audio'
  if (documentExtensions.includes(extension)) return 'document'
  if (archiveExtensions.includes(extension)) return 'archive'
  if (codeExtensions.includes(extension)) return 'code'
  
  return 'file'
}

/**
 * Check if file type is previewable
 */
export function isPreviewableFile(filename: string): boolean {
  const extension = getFileExtension(filename)
  const previewableExtensions = [
    'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', // Images
    'txt', 'md', 'json', 'xml', 'csv', 'log', // Text files
    'pdf' // Documents
  ]
  return previewableExtensions.includes(extension)
}

/**
 * Filter spaces based on search criteria
 */
export function filterSpaces(spaces: Space[], filters: SpaceFilterOptions): Space[] {
  let filtered = [...spaces]
  
  // Filter by search query
  if (filters.query) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(space => 
      space.name?.toLowerCase().includes(query) ||
      space.did().toLowerCase().includes(query)
    )
  }
  
  // Filter by access type
  if (filters.accessType && filters.accessType !== 'all') {
    filtered = filtered.filter(space => 
      space.access?.type === filters.accessType
    )
  }
  
  // Sort spaces
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'name':
          const nameA = (a.name || shortenDID(a.did())).toLowerCase()
          const nameB = (b.name || shortenDID(b.did())).toLowerCase()
          comparison = nameA.localeCompare(nameB)
          break
        case 'created':
          // Note: Space creation date might not be available in current API
          // This would need to be implemented when the API supports it
          comparison = 0
          break
        case 'usage':
          // Note: Space usage might not be available in current API
          // This would need to be implemented when the API supports it
          comparison = 0
          break
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })
  }
  
  return filtered
}

/**
 * Generate unique ID for components
 */
export function generateId(prefix: string = 'space'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Check if user has permission for specific action
 */
export function hasPermission(
  permissions: string[],
  requiredPermission: string
): boolean {
  return permissions.includes('*') || permissions.includes(requiredPermission)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate DID format
 */
export function isValidDID(did: string): boolean {
  const didRegex = /^did:[a-z0-9]+:[a-zA-Z0-9._-]+$/
  return didRegex.test(did)
}

/**
 * Check if string is a valid email or DID
 */
export function isValidEmailOrDID(value: string): boolean {
  return isValidEmail(value) || isValidDID(value)
}

/**
 * Get space display name
 */
export function getSpaceDisplayName(space: Space): string {
  return space.name || shortenDID(space.did())
}

/**
 * Get space type display name
 */
export function getSpaceTypeDisplayName(space: Space): string {
  return space.access?.type === 'private' ? 'Private' : 'Public'
}

/**
 * Get space type color class
 */
export function getSpaceTypeColorClass(space: Space): string {
  return space.access?.type === 'private' 
    ? 'bg-storacha-red text-white' 
    : 'bg-blue-500 text-white'
}

/**
 * Create file path from parts
 */
export function createFilePath(...parts: string[]): string {
  return parts
    .filter(part => part && part !== '/')
    .join('/')
    .replace(/\/+/g, '/')
}

/**
 * Parse file path into parts
 */
export function parseFilePath(path: string): string[] {
  return path.split('/').filter(part => part !== '')
}

/**
 * Get parent directory path
 */
export function getParentPath(path: string): string {
  const parts = parseFilePath(path)
  parts.pop()
  return parts.length > 0 ? '/' + parts.join('/') : '/'
}

/**
 * Get filename from path
 */
export function getFilename(path: string): string {
  const parts = parseFilePath(path)
  return parts[parts.length - 1] || ''
}

/**
 * Check if path is root
 */
export function isRootPath(path: string): boolean {
  return path === '/' || path === ''
}

/**
 * Sort file items (directories first, then files)
 */
export function sortFileItems(items: FileItem[]): FileItem[] {
  return [...items].sort((a, b) => {
    // Directories first
    if (a.type === 'directory' && b.type !== 'directory') return -1
    if (a.type !== 'directory' && b.type === 'directory') return 1
    
    // Then sort alphabetically
    return a.name.localeCompare(b.name)
  })
}
