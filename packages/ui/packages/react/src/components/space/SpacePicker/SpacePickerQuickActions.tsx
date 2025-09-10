import React, { forwardRef, useCallback, useState, useRef, useEffect } from 'react'
import { useSpacePickerContext } from './context/SpacePickerContext.js'
import { getAccessibilityProps, ARIA_LABELS } from '../../shared/utils/accessibilityHelpers.js'

interface SpacePickerQuickActionsProps {
  className?: string
  space?: any
  onAction?: (action: string, space: any) => void
}

export const SpacePickerQuickActions = forwardRef<HTMLDivElement, SpacePickerQuickActionsProps>(
  ({ 
    className = '',
    space,
    onAction
  }, ref) => {
    const {
      isActionsMenuOpen,
      setActionsMenuOpen,
      actionsMenuSpace,
      setActionsMenuSpace,
      onSpaceAction: contextOnSpaceAction
    } = useSpacePickerContext()

    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
    const menuRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)

    const currentSpace = space || actionsMenuSpace
    const isOpen = isActionsMenuOpen && currentSpace

    const handleAction = useCallback((action: string) => {
      if (currentSpace) {
        contextOnSpaceAction?.(action, currentSpace)
        onAction?.(action, currentSpace)
      }
      setActionsMenuOpen(false)
      setActionsMenuSpace(undefined)
    }, [currentSpace, contextOnSpaceAction, onAction, setActionsMenuOpen, setActionsMenuSpace])

    const handleTriggerClick = useCallback((event: React.MouseEvent) => {
      event.stopPropagation()
      
      if (currentSpace) {
        setActionsMenuSpace(currentSpace)
        setActionsMenuOpen(true)
        
        // Calculate menu position
        const rect = event.currentTarget.getBoundingClientRect()
        setMenuPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX
        })
      }
    }, [currentSpace, setActionsMenuSpace, setActionsMenuOpen])

    const handleClose = useCallback(() => {
      setActionsMenuOpen(false)
      setActionsMenuSpace(undefined)
    }, [setActionsMenuOpen, setActionsMenuSpace])

    // Handle click outside to close menu
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
            triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          handleClose()
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, handleClose])

    // Handle escape key to close menu
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          handleClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen, handleClose])

    const actions = [
      {
        id: 'setCurrent',
        label: 'Set as Current',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        onClick: () => handleAction('setCurrent')
      },
      {
        id: 'rename',
        label: 'Rename',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        onClick: () => handleAction('rename')
      },
      {
        id: 'share',
        label: 'Share',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        ),
        onClick: () => handleAction('share')
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
        onClick: () => handleAction('delete'),
        className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
      }
    ]

    return (
      <div ref={ref} className={`space-picker-quick-actions ${className}`}>
        {/* Trigger button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={handleTriggerClick}
          className="space-picker-quick-actions-trigger"
          aria-label={ARIA_LABELS.quickActions}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          {...getAccessibilityProps('button')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        {/* Actions menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className="space-picker-quick-actions-menu"
            style={{
              position: 'absolute',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 50
            }}
            role="menu"
            aria-label="Space actions"
          >
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                className={`space-picker-quick-actions-item ${action.className || ''}`}
                role="menuitem"
                aria-label={action.label}
                {...getAccessibilityProps('menuitem')}
              >
                <span className="flex items-center gap-2">
                  {action.icon}
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)

SpacePickerQuickActions.displayName = 'SpacePickerQuickActions'
