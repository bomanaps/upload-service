import type { ValidationErrors, SpaceCreatorFormData, PermissionFormData } from '../types/spaceTypes.js'
import { isValidEmail, isValidDID, isValidEmailOrDID } from './spaceHelpers.js'

/**
 * Validation rules for space names
 */
export const SPACE_NAME_RULES = {
  minLength: 1,
  maxLength: 100,
  pattern: /^[a-zA-Z0-9\s\-_\.]+$/,
  reservedNames: ['admin', 'root', 'system', 'api', 'www', 'mail', 'ftp']
}

/**
 * Validation rules for permission grantees
 */
export const PERMISSION_GRANTEE_RULES = {
  minLength: 1,
  maxLength: 255
}

/**
 * Validation rules for capabilities
 */
export const CAPABILITY_RULES = {
  validCapabilities: [
    'store/add',
    'store/remove',
    'upload/add',
    'upload/list',
    'space/info',
    'space/delete',
    'space/rename',
    'space/share',
    '*'
  ]
}

/**
 * Validate space name
 */
export function validateSpaceName(name: string): ValidationErrors {
  const errors: ValidationErrors = {}
  
  if (!name || name.trim().length === 0) {
    errors.name = 'Space name is required'
    return errors
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < SPACE_NAME_RULES.minLength) {
    errors.name = `Space name must be at least ${SPACE_NAME_RULES.minLength} character long`
  }
  
  if (trimmedName.length > SPACE_NAME_RULES.maxLength) {
    errors.name = `Space name must be no more than ${SPACE_NAME_RULES.maxLength} characters long`
  }
  
  if (!SPACE_NAME_RULES.pattern.test(trimmedName)) {
    errors.name = 'Space name can only contain letters, numbers, spaces, hyphens, underscores, and dots'
  }
  
  if (SPACE_NAME_RULES.reservedNames.includes(trimmedName.toLowerCase())) {
    errors.name = 'This space name is reserved and cannot be used'
  }
  
  return errors
}

/**
 * Validate space creator form data
 */
export function validateSpaceCreatorForm(formData: SpaceCreatorFormData): ValidationErrors {
  const errors: ValidationErrors = {}
  
  // Validate space name
  const nameErrors = validateSpaceName(formData.name)
  Object.assign(errors, nameErrors)
  
  // Validate access type
  if (!formData.accessType || !['public', 'private'].includes(formData.accessType)) {
    errors.accessType = 'Please select a valid access type'
  }
  
  // Validate template
  if (!formData.template || formData.template.trim().length === 0) {
    errors.template = 'Please select a template'
  }
  
  // Validate description (optional)
  if (formData.description && formData.description.length > 500) {
    errors.description = 'Description must be no more than 500 characters long'
  }
  
  return errors
}

/**
 * Validate permission form data
 */
export function validatePermissionForm(formData: PermissionFormData): ValidationErrors {
  const errors: ValidationErrors = {}
  
  // Validate grantee
  if (!formData.grantee || formData.grantee.trim().length === 0) {
    errors.grantee = 'Grantee is required'
  } else {
    const trimmedGrantee = formData.grantee.trim()
    
    if (trimmedGrantee.length < PERMISSION_GRANTEE_RULES.minLength) {
      errors.grantee = `Grantee must be at least ${PERMISSION_GRANTEE_RULES.minLength} character long`
    }
    
    if (trimmedGrantee.length > PERMISSION_GRANTEE_RULES.maxLength) {
      errors.grantee = `Grantee must be no more than ${PERMISSION_GRANTEE_RULES.maxLength} characters long`
    }
    
    if (!isValidEmailOrDID(trimmedGrantee)) {
      errors.grantee = 'Grantee must be a valid email address or DID'
    }
  }
  
  // Validate capabilities
  if (!formData.capabilities || formData.capabilities.length === 0) {
    errors.capabilities = 'At least one capability must be selected'
  } else {
    const invalidCapabilities = formData.capabilities.filter(
      capability => !CAPABILITY_RULES.validCapabilities.includes(capability)
    )
    
    if (invalidCapabilities.length > 0) {
      errors.capabilities = `Invalid capabilities: ${invalidCapabilities.join(', ')}`
    }
  }
  
  // Validate expiration date (optional)
  if (formData.expiration) {
    const now = new Date()
    const expiration = new Date(formData.expiration)
    
    if (expiration <= now) {
      errors.expiration = 'Expiration date must be in the future'
    }
    
    // Check if expiration is too far in the future (e.g., more than 1 year)
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
    
    if (expiration > oneYearFromNow) {
      errors.expiration = 'Expiration date cannot be more than 1 year in the future'
    }
  }
  
  return errors
}

/**
 * Validate file upload
 */
export function validateFileUpload(files: File[]): ValidationErrors {
  const errors: ValidationErrors = {}
  
  if (!files || files.length === 0) {
    errors.files = 'No files selected'
    return errors
  }
  
  // Check file count limit
  const maxFiles = 100
  if (files.length > maxFiles) {
    errors.files = `Cannot upload more than ${maxFiles} files at once`
  }
  
  // Check individual file size
  const maxFileSize = 100 * 1024 * 1024 // 100MB
  const oversizedFiles = files.filter(file => file.size > maxFileSize)
  
  if (oversizedFiles.length > 0) {
    errors.files = `Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is ${formatFileSize(maxFileSize)}`
  }
  
  // Check total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const maxTotalSize = 1024 * 1024 * 1024 // 1GB
  
  if (totalSize > maxTotalSize) {
    errors.files = `Total upload size too large: ${formatFileSize(totalSize)}. Maximum total size is ${formatFileSize(maxTotalSize)}`
  }
  
  return errors
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): ValidationErrors {
  const errors: ValidationErrors = {}
  
  if (query && query.length > 100) {
    errors.query = 'Search query must be no more than 100 characters long'
  }
  
  // Check for potentially harmful characters
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i
  ]
  
  if (dangerousPatterns.some(pattern => pattern.test(query))) {
    errors.query = 'Search query contains invalid characters'
  }
  
  return errors
}

/**
 * Validate path for file operations
 */
export function validatePath(path: string): ValidationErrors {
  const errors: ValidationErrors = {}
  
  if (!path || path.trim().length === 0) {
    errors.path = 'Path is required'
    return errors
  }
  
  // Check for path traversal attempts
  if (path.includes('..') || path.includes('~')) {
    errors.path = 'Invalid path: path traversal not allowed'
  }
  
  // Check for reserved names
  const reservedNames = ['.', '..', 'CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
  const pathParts = path.split('/').filter(part => part !== '')
  
  for (const part of pathParts) {
    if (reservedNames.includes(part.toUpperCase())) {
      errors.path = `Invalid path: "${part}" is a reserved name`
      break
    }
  }
  
  // Check path length
  if (path.length > 260) {
    errors.path = 'Path is too long (maximum 260 characters)'
  }
  
  return errors
}

/**
 * Check if form has any errors
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(error => error !== undefined && error !== '')
}

/**
 * Get first validation error message
 */
export function getFirstValidationError(errors: ValidationErrors): string | undefined {
  const errorMessages = Object.values(errors).filter(error => error !== undefined && error !== '')
  return errorMessages.length > 0 ? errorMessages[0] : undefined
}

/**
 * Clear validation errors for specific fields
 */
export function clearValidationErrors(errors: ValidationErrors, fields: string[]): ValidationErrors {
  const cleared = { ...errors }
  fields.forEach(field => {
    delete cleared[field]
  })
  return cleared
}

/**
 * Merge validation errors
 */
export function mergeValidationErrors(...errorObjects: ValidationErrors[]): ValidationErrors {
  const merged: ValidationErrors = {}
  errorObjects.forEach(errors => {
    Object.assign(merged, errors)
  })
  return merged
}

/**
 * Format file size helper for validation messages
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and sanitize space name
 */
export function validateAndSanitizeSpaceName(name: string): { value: string; errors: ValidationErrors } {
  const sanitized = sanitizeInput(name.trim())
  const errors = validateSpaceName(sanitized)
  
  return {
    value: sanitized,
    errors
  }
}

/**
 * Validate and sanitize search query
 */
export function validateAndSanitizeSearchQuery(query: string): { value: string; errors: ValidationErrors } {
  const sanitized = sanitizeInput(query.trim())
  const errors = validateSearchQuery(sanitized)
  
  return {
    value: sanitized,
    errors
  }
}
