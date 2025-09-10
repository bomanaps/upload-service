import React, { forwardRef } from 'react'

interface SpacePickerLoadingProps {
  className?: string
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const SpacePickerLoading = forwardRef<HTMLDivElement, SpacePickerLoadingProps>(
  ({ 
    className = '',
    message = 'Loading spaces...',
    size = 'md'
  }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    }

    const textSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }

    return (
      <div ref={ref} className={`space-loading ${className}`}>
        <div className="space-loading-spinner" />
        <p className={`space-loading-text ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    )
  }
)

SpacePickerLoading.displayName = 'SpacePickerLoading'
