import React, { forwardRef } from 'react'

interface SpacePickerErrorProps {
  className?: string
  error?: Error
  onRetry?: () => void
  title?: string
  description?: string
}

export const SpacePickerError = forwardRef<HTMLDivElement, SpacePickerErrorProps>(
  ({ 
    className = '',
    error,
    onRetry,
    title = 'Failed to load spaces',
    description
  }, ref) => {
    const errorMessage = error?.message || 'An unexpected error occurred'
    const displayDescription = description || errorMessage

    return (
      <div ref={ref} className={`space-error ${className}`}>
        <div className="flex items-start gap-3">
          <div className="space-error-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {title}
            </h3>
            
            <p className="space-error-message mb-4">
              {displayDescription}
            </p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="space-button-secondary"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
)

SpacePickerError.displayName = 'SpacePickerError'
