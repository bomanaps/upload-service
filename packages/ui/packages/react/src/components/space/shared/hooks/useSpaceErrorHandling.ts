import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Error handling hook for space components
 */
export function useSpaceErrorHandling() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState<string | undefined>()
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const setError = useCallback((key: string, message: string) => {
    setErrors(prev => ({ ...prev, [key]: message }))
  }, [])

  const clearError = useCallback((key: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[key]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
    setGlobalError(undefined)
  }, [])

  const setGlobalErrorWithTimeout = useCallback((message: string, timeout: number = 5000) => {
    setGlobalError(message)
    
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }
    
    errorTimeoutRef.current = setTimeout(() => {
      setGlobalError(undefined)
    }, timeout)
  }, [])

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorKey: string = 'general'
  ): Promise<T | null> => {
    try {
      clearError(errorKey)
      return await asyncFn()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorKey, message)
      return null
    }
  }, [setError, clearError])

  const hasErrors = Object.keys(errors).length > 0 || !!globalError

  return {
    errors,
    globalError,
    setError,
    clearError,
    clearAllErrors,
    setGlobalErrorWithTimeout,
    handleAsyncError,
    hasErrors
  }
}

/**
 * Hook for handling form validation errors
 */
export function useFormValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const setFieldError = useCallback((field: string, message: string) => {
    setValidationErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const setFieldTouched = useCallback((field: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }))
  }, [])

  const validateField = useCallback((
    field: string,
    value: any,
    validator: (value: any) => string | undefined
  ) => {
    const error = validator(value)
    if (error) {
      setFieldError(field, error)
    } else {
      clearFieldError(field)
    }
    return !error
  }, [setFieldError, clearFieldError])

  const validateForm = useCallback((
    formData: Record<string, any>,
    validators: Record<string, (value: any) => string | undefined>
  ) => {
    const errors: Record<string, string> = {}
    let isValid = true

    Object.entries(validators).forEach(([field, validator]) => {
      const error = validator(formData[field])
      if (error) {
        errors[field] = error
        isValid = false
      }
    })

    setValidationErrors(errors)
    return isValid
  }, [])

  const getFieldError = useCallback((field: string) => {
    return validationErrors[field]
  }, [validationErrors])

  const isFieldTouched = useCallback((field: string) => {
    return touched[field] || false
  }, [touched])

  const shouldShowError = useCallback((field: string) => {
    return isFieldTouched(field) && !!getFieldError(field)
  }, [isFieldTouched, getFieldError])

  const clearAllValidation = useCallback(() => {
    setValidationErrors({})
    setTouched({})
  }, [])

  const hasValidationErrors = Object.keys(validationErrors).length > 0

  return {
    validationErrors,
    touched,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    getFieldError,
    isFieldTouched,
    shouldShowError,
    clearAllValidation,
    hasValidationErrors
  }
}

/**
 * Hook for handling loading states
 */
export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const withLoading = useCallback(async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true)
    try {
      return await asyncFn()
    } finally {
      setLoading(key, false)
    }
  }, [setLoading])

  const clearLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev }
      delete newStates[key]
      return newStates
    })
  }, [])

  const clearAllLoading = useCallback(() => {
    setLoadingStates({})
  }, [])

  const hasAnyLoading = Object.values(loadingStates).some(loading => loading)

  return {
    loadingStates,
    setLoading,
    isLoading,
    withLoading,
    clearLoading,
    clearAllLoading,
    hasAnyLoading
  }
}

/**
 * Hook for handling async operations with error handling
 */
export function useAsyncOperation<T = any>() {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const result = await asyncFn()
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unexpected error occurred')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(undefined)
    setIsLoading(false)
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    reset
  }
}

/**
 * Hook for handling retry logic
 */
export function useRetry() {
  const [retryCount, setRetryCount] = useState(0)
  const [maxRetries] = useState(3)

  const executeWithRetry = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onRetry?: (attempt: number) => void
  ): Promise<T> => {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt)
        return await asyncFn()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('An unexpected error occurred')
        
        if (attempt < maxRetries) {
          onRetry?.(attempt + 1)
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    throw lastError!
  }, [maxRetries])

  const resetRetry = useCallback(() => {
    setRetryCount(0)
  }, [])

  return {
    retryCount,
    maxRetries,
    executeWithRetry,
    resetRetry
  }
}

/**
 * Hook for handling debounced operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for handling throttled operations
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now())

  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay]) as T
}
