import React, { forwardRef } from 'react'
import type { Space } from '@storacha/ui-core'
import { formatFileSize } from '../../shared/utils/spaceHelpers.js'

interface SpacePickerUsageIndicatorProps {
  space: Space
  usage?: {
    totalSize: number
    fileCount: number
    lastModified?: Date
  } | null
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  className?: string
}

export const SpacePickerUsageIndicator = forwardRef<HTMLDivElement, SpacePickerUsageIndicatorProps>(
  ({ 
    space, 
    usage, 
    isLoading = false, 
    size = 'md',
    showDetails = false,
    className = ''
  }, ref) => {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }

    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }

    if (isLoading) {
      return (
        <div ref={ref} className={`space-picker-usage-indicator loading ${className}`}>
          <div className="flex items-center gap-2">
            <div className="animate-pulse bg-storacha-gray-light rounded w-4 h-4" />
            <div className="animate-pulse bg-storacha-gray-light rounded w-16 h-3" />
          </div>
        </div>
      )
    }

    if (!usage) {
      return (
        <div ref={ref} className={`space-picker-usage-indicator no-data ${className}`}>
          <div className="flex items-center gap-2 text-storacha-gray">
            <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className={sizeClasses[size]}>No data</span>
          </div>
        </div>
      )
    }

    const { totalSize, fileCount, lastModified } = usage
    const formattedSize = formatFileSize(totalSize)
    const hasFiles = fileCount > 0

    return (
      <div ref={ref} className={`space-picker-usage-indicator ${className}`}>
        <div className="flex items-center gap-2">
          {/* File count */}
          <div className="flex items-center gap-1">
            <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className={sizeClasses[size]}>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
          </div>

          {/* Size */}
          {hasFiles && (
            <>
              <span className="text-storacha-gray">•</span>
              <div className="flex items-center gap-1">
                <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <span className={sizeClasses[size]}>{formattedSize}</span>
              </div>
            </>
          )}

          {/* Last modified */}
          {showDetails && lastModified && (
            <>
              <span className="text-storacha-gray">•</span>
              <div className="flex items-center gap-1">
                <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={sizeClasses[size]}>
                  {lastModified.toLocaleDateString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Usage bar */}
        {hasFiles && (
          <div className="mt-1">
            <div className="w-full bg-storacha-gray-light rounded-full h-1">
              <div 
                className="bg-storacha-red h-1 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((totalSize / (100 * 1024 * 1024)) * 100, 100)}%` // Assuming 100MB as max for visualization
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
)

SpacePickerUsageIndicator.displayName = 'SpacePickerUsageIndicator'
