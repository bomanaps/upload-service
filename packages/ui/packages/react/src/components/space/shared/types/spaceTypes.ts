import type { Space, Account } from '@storacha/ui-core'

/**
 * Common space component props that are shared across components
 */
export interface BaseSpaceComponentProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Space picker specific types
 */
export interface SpacePickerProps extends BaseSpaceComponentProps {
  onSpaceSelect?: (space: Space) => void
  onSpaceAction?: (action: string, space: Space) => void
  viewMode?: 'list' | 'grid'
  showUsage?: boolean
  allowMultiSelect?: boolean
  selectedSpaces?: Space[]
  onSelectedSpacesChange?: (spaces: Space[]) => void
}

export interface SpacePickerItemProps extends BaseSpaceComponentProps {
  space: Space
  isSelected?: boolean
  showUsage?: boolean
  onSelect?: (space: Space) => void
  onAction?: (action: string, space: Space) => void
}

export interface SpacePickerSearchProps extends BaseSpaceComponentProps {
  placeholder?: string
  onSearchChange?: (query: string) => void
  onFilterChange?: (filters: SpaceFilterOptions) => void
}

export interface SpaceFilterOptions {
  query?: string
  accessType?: 'public' | 'private' | 'all'
  sortBy?: 'name' | 'created' | 'usage'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Space creator specific types
 */
export interface SpaceCreatorProps extends BaseSpaceComponentProps {
  onSpaceCreated?: (space: Space) => void
  onCancel?: () => void
  defaultAccessType?: 'public' | 'private'
  showTemplates?: boolean
  requireAccount?: boolean
}

export interface SpaceCreatorFormData {
  name: string
  accessType: 'public' | 'private'
  template: string
  description?: string
}

export interface SpaceCreatorTemplate {
  id: string
  name: string
  description: string
  accessType: 'public' | 'private'
  settings: Record<string, any>
}

export interface ValidationErrors {
  [key: string]: string | undefined
}

/**
 * Space explorer specific types
 */
export interface SpaceExplorerProps extends BaseSpaceComponentProps {
  space: Space
  onFileSelect?: (files: File[]) => void
  onFileUpload?: (files: File[]) => void
  showPreview?: boolean
  allowMultiSelect?: boolean
  currentPath?: string
  onPathChange?: (path: string) => void
}

export interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  modified?: Date
  cid?: string
}

export interface DragDropOptions {
  accept?: string[]
  multiple?: boolean
  onDrop?: (files: File[]) => void
  onDragOver?: () => void
  onDragLeave?: () => void
}

/**
 * Space permissions specific types
 */
export interface SpacePermissionsProps extends BaseSpaceComponentProps {
  space: Space
  onPermissionChange?: (permissions: Permission[]) => void
  allowEdit?: boolean
}

export interface Permission {
  id: string
  grantee: string // DID or email
  capabilities: string[]
  expiration?: Date
  created: Date
  createdBy: string
}

export interface PermissionFormData {
  grantee: string
  capabilities: string[]
  expiration?: Date
}

/**
 * Common hook return types
 */
export interface UseSpaceOperationsReturn {
  spaces: Space[]
  currentSpace?: Space
  isLoading: boolean
  error?: Error
  createSpace: (name: string, options?: any) => Promise<Space>
  setCurrentSpace: (space: Space) => Promise<void>
  deleteSpace: (space: Space) => Promise<void>
}

export interface UseSpaceValidationReturn {
  validateSpaceName: (name: string) => ValidationErrors
  validatePermission: (permission: PermissionFormData) => ValidationErrors
  validateForm: (formData: any) => ValidationErrors
}

/**
 * Context value types
 */
export interface SpacePickerContextValue {
  viewMode: 'list' | 'grid'
  setViewMode: (mode: 'list' | 'grid') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedSpaces: Space[]
  setSelectedSpaces: (spaces: Space[]) => void
  filteredSpaces: Space[]
  onSpaceSelect?: (space: Space) => void
  onSpaceAction?: (action: string, space: Space) => void
}

export interface SpaceCreatorContextValue {
  formData: SpaceCreatorFormData
  setFormData: (data: Partial<SpaceCreatorFormData>) => void
  validationErrors: ValidationErrors
  setValidationErrors: (errors: ValidationErrors) => void
  isSubmitting: boolean
  setIsSubmitting: (submitting: boolean) => void
  onSubmit: () => Promise<void>
  onCancel: () => void
  onSpaceCreated?: (space: Space) => void
}

export interface SpaceExplorerContextValue {
  space: Space
  currentPath: string
  setCurrentPath: (path: string) => void
  selectedFiles: FileItem[]
  setSelectedFiles: (files: FileItem[]) => void
  previewFile?: FileItem
  setPreviewFile: (file?: FileItem) => void
  onFileSelect?: (files: FileItem[]) => void
  onFileUpload?: (files: File[]) => void
}

export interface SpacePermissionsContextValue {
  space: Space
  permissions: Permission[]
  setPermissions: (permissions: Permission[]) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onPermissionChange?: (permissions: Permission[]) => void
}

/**
 * Event handler types
 */
export type SpaceAction = 'select' | 'delete' | 'rename' | 'share' | 'setCurrent'

export interface SpaceActionHandler {
  (action: SpaceAction, space: Space): void | Promise<void>
}

export interface FileActionHandler {
  (action: string, files: FileItem[]): void | Promise<void>
}

export interface PermissionActionHandler {
  (action: 'add' | 'edit' | 'remove', permission: Permission): void | Promise<void>
}
