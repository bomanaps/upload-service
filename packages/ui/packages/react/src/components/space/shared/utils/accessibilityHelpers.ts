/**
 * Accessibility utilities for space management components
 */

/**
 * Generate unique ID for accessibility attributes
 */
export function generateAccessibilityId(prefix: string = 'space'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * ARIA labels for common actions
 */
export const ARIA_LABELS = {
  selectSpace: (spaceName: string) => `Select space ${spaceName}`,
  deleteSpace: (spaceName: string) => `Delete space ${spaceName}`,
  renameSpace: (spaceName: string) => `Rename space ${spaceName}`,
  shareSpace: (spaceName: string) => `Share space ${spaceName}`,
  setCurrentSpace: (spaceName: string) => `Set ${spaceName} as current space`,
  createSpace: 'Create new space',
  searchSpaces: 'Search spaces',
  filterSpaces: 'Filter spaces',
  toggleView: (mode: string) => `Switch to ${mode} view`,
  uploadFiles: 'Upload files',
  selectFiles: 'Select files',
  deleteFiles: 'Delete selected files',
  previewFile: (fileName: string) => `Preview file ${fileName}`,
  addPermission: 'Add permission',
  editPermission: 'Edit permission',
  removePermission: 'Remove permission',
  closeModal: 'Close modal',
  cancelAction: 'Cancel action',
  confirmAction: 'Confirm action'
} as const

/**
 * ARIA descriptions for complex components
 */
export const ARIA_DESCRIPTIONS = {
  spacePicker: 'Select and manage your spaces. Use arrow keys to navigate, Enter to select, and Escape to close.',
  spaceCreator: 'Create a new space by filling out the form below. All fields marked with asterisk are required.',
  spaceExplorer: 'Browse and manage files in your space. Use Tab to navigate, Enter to open files, and Delete to remove selected items.',
  spacePermissions: 'Manage who has access to this space and what they can do. Use Tab to navigate between permissions.',
  fileBrowser: 'File browser showing files and folders. Use arrow keys to navigate, Enter to open, and Space to select.',
  dragDropZone: 'Drag and drop files here to upload them to your space.',
  searchInput: 'Type to search for spaces. Results will update as you type.',
  viewToggle: 'Toggle between list and grid view of spaces.',
  quickActions: 'Quick actions menu for the selected space.'
} as const

/**
 * Keyboard navigation helpers
 */
export const KEYBOARD_NAVIGATION = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
} as const

/**
 * Focus management utilities
 */
export class FocusManager {
  private focusableElements: HTMLElement[] = []
  private currentIndex = -1

  constructor(container: HTMLElement) {
    this.updateFocusableElements(container)
  }

  private updateFocusableElements(container: HTMLElement): void {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    this.focusableElements = Array.from(container.querySelectorAll(selector))
  }

  focusFirst(): void {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus()
      this.currentIndex = 0
    }
  }

  focusLast(): void {
    if (this.focusableElements.length > 0) {
      const lastIndex = this.focusableElements.length - 1
      this.focusableElements[lastIndex].focus()
      this.currentIndex = lastIndex
    }
  }

  focusNext(): void {
    if (this.focusableElements.length === 0) return

    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length
    this.focusableElements[this.currentIndex].focus()
  }

  focusPrevious(): void {
    if (this.focusableElements.length === 0) return

    this.currentIndex = this.currentIndex <= 0 
      ? this.focusableElements.length - 1 
      : this.currentIndex - 1
    this.focusableElements[this.currentIndex].focus()
  }

  focusByIndex(index: number): void {
    if (index >= 0 && index < this.focusableElements.length) {
      this.focusableElements[index].focus()
      this.currentIndex = index
    }
  }

  getCurrentIndex(): number {
    return this.currentIndex
  }

  refresh(container: HTMLElement): void {
    this.updateFocusableElements(container)
    this.currentIndex = -1
  }
}

/**
 * Screen reader announcements
 */
export class ScreenReaderAnnouncer {
  private announcementElement: HTMLElement | null = null

  constructor() {
    this.createAnnouncementElement()
  }

  private createAnnouncementElement(): void {
    this.announcementElement = document.createElement('div')
    this.announcementElement.setAttribute('aria-live', 'polite')
    this.announcementElement.setAttribute('aria-atomic', 'true')
    this.announcementElement.style.position = 'absolute'
    this.announcementElement.style.left = '-10000px'
    this.announcementElement.style.width = '1px'
    this.announcementElement.style.height = '1px'
    this.announcementElement.style.overflow = 'hidden'
    document.body.appendChild(this.announcementElement)
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcementElement) return

    this.announcementElement.setAttribute('aria-live', priority)
    this.announcementElement.textContent = message

    // Clear the message after a short delay to allow for re-announcement
    setTimeout(() => {
      if (this.announcementElement) {
        this.announcementElement.textContent = ''
      }
    }, 1000)
  }

  destroy(): void {
    if (this.announcementElement) {
      document.body.removeChild(this.announcementElement)
      this.announcementElement = null
    }
  }
}

/**
 * Common accessibility props for components
 */
export function getAccessibilityProps(
  type: 'button' | 'input' | 'list' | 'listitem' | 'dialog' | 'menu' | 'menuitem',
  options: Record<string, any> = {}
): Record<string, any> {
  const baseProps: Record<string, any> = {}

  switch (type) {
    case 'button':
      baseProps.role = 'button'
      baseProps.tabIndex = 0
      break

    case 'input':
      baseProps.role = 'textbox'
      baseProps.tabIndex = 0
      break

    case 'list':
      baseProps.role = 'list'
      baseProps.tabIndex = -1
      break

    case 'listitem':
      baseProps.role = 'listitem'
      baseProps.tabIndex = 0
      break

    case 'dialog':
      baseProps.role = 'dialog'
      baseProps.tabIndex = -1
      baseProps['aria-modal'] = true
      break

    case 'menu':
      baseProps.role = 'menu'
      baseProps.tabIndex = -1
      break

    case 'menuitem':
      baseProps.role = 'menuitem'
      baseProps.tabIndex = 0
      break
  }

  return { ...baseProps, ...options }
}

/**
 * Generate ARIA-describedby attribute
 */
export function generateAriaDescribedBy(...ids: string[]): string {
  return ids.filter(id => id).join(' ')
}

/**
 * Generate ARIA-labelledby attribute
 */
export function generateAriaLabelledBy(...ids: string[]): string {
  return ids.filter(id => id).join(' ')
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ]

  return focusableSelectors.some(selector => element.matches(selector))
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

/**
 * Handle keyboard navigation for lists
 */
export function handleListNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelect: (index: number) => void
): number {
  let newIndex = currentIndex

  switch (event.key) {
    case KEYBOARD_NAVIGATION.ARROW_DOWN:
      event.preventDefault()
      newIndex = Math.min(currentIndex + 1, items.length - 1)
      items[newIndex]?.focus()
      break

    case KEYBOARD_NAVIGATION.ARROW_UP:
      event.preventDefault()
      newIndex = Math.max(currentIndex - 1, 0)
      items[newIndex]?.focus()
      break

    case KEYBOARD_NAVIGATION.HOME:
      event.preventDefault()
      newIndex = 0
      items[newIndex]?.focus()
      break

    case KEYBOARD_NAVIGATION.END:
      event.preventDefault()
      newIndex = items.length - 1
      items[newIndex]?.focus()
      break

    case KEYBOARD_NAVIGATION.ENTER:
    case KEYBOARD_NAVIGATION.SPACE:
      event.preventDefault()
      onSelect(currentIndex)
      break
  }

  return newIndex
}

/**
 * Generate accessible color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  // This is a simplified version - in production, you'd want to use a proper color library
  // that can handle hex, rgb, hsl, etc. and calculate actual contrast ratios
  return 4.5 // Placeholder - should be calculated based on actual colors
}

/**
 * Check if color combination meets WCAG standards
 */
export function meetsWCAGStandards(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const contrastRatio = getContrastRatio(foreground, background)
  const requiredRatio = level === 'AA' ? 4.5 : 7
  
  return contrastRatio >= requiredRatio
}

/**
 * Generate accessible tooltip props
 */
export function getTooltipProps(content: string, placement: 'top' | 'bottom' | 'left' | 'right' = 'top') {
  return {
    'aria-label': content,
    'data-tooltip': content,
    'data-placement': placement,
    role: 'tooltip'
  }
}

/**
 * Generate accessible loading state props
 */
export function getLoadingProps(isLoading: boolean, loadingText: string = 'Loading...') {
  return {
    'aria-busy': isLoading,
    'aria-live': isLoading ? 'polite' : 'off',
    'aria-label': isLoading ? loadingText : undefined
  }
}

/**
 * Generate accessible error state props
 */
export function getErrorProps(error: string | undefined) {
  return {
    'aria-invalid': !!error,
    'aria-describedby': error ? 'error-message' : undefined,
    'aria-errormessage': error ? 'error-message' : undefined
  }
}
