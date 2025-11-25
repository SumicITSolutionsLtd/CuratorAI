import { AxiosError } from 'axios'
import type { components } from '@/types/api-generated'

/**
 * API Error Response Types from OpenAPI specification
 */
type ValidationErrorResponse = components['schemas']['ValidationErrorResponse']
type UnauthorizedErrorResponse = components['schemas']['UnauthorizedErrorResponse']
type ForbiddenErrorResponse = components['schemas']['ForbiddenErrorResponse']
type NotFoundErrorResponse = components['schemas']['NotFoundErrorResponse']
type ConflictErrorResponse = components['schemas']['ConflictErrorResponse']

type APIErrorResponse =
  | ValidationErrorResponse
  | UnauthorizedErrorResponse
  | ForbiddenErrorResponse
  | NotFoundErrorResponse
  | ConflictErrorResponse

/**
 * Extract user-friendly error message from backend API error response
 * Handles all error formats defined in the OpenAPI specification
 */
export function extractAPIErrorMessage(
  error: unknown,
  fallbackMessage = 'An error occurred'
): string {
  // Handle AxiosError
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<APIErrorResponse>

    if (axiosError.response?.data) {
      const data = axiosError.response.data

      // Check if it's a structured API error response
      if ('error' in data && data.error) {
        const errorDetail = data.error

        // Return the main error message
        if ('message' in errorDetail && errorDetail.message) {
          return errorDetail.message
        }
      }

      // Fallback to any message field at root level
      if ('message' in data && typeof data.message === 'string') {
        return data.message
      }
    }

    // Network errors
    if (axiosError.message) {
      if (axiosError.message.includes('Network Error')) {
        return 'Network error. Please check your internet connection.'
      }
      if (axiosError.message.includes('timeout')) {
        return 'Request timeout. Please try again.'
      }
    }
  }

  // Handle regular Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  return fallbackMessage
}

/**
 * Extract field-specific validation errors from ValidationErrorResponse
 * Returns an object mapping field names to error messages
 */
export function extractValidationErrors(error: unknown): Record<string, string> | null {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ValidationErrorResponse>

    if (axiosError.response?.data?.error) {
      const errorDetail = axiosError.response.data.error

      // Check if it's a validation error with details
      if ('details' in errorDetail && errorDetail.details) {
        const fieldErrors: Record<string, string> = {}

        // Convert array of errors to single string per field
        Object.entries(errorDetail.details).forEach(([field, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
            fieldErrors[field] = errors[0] // Take first error message
          }
        })

        return Object.keys(fieldErrors).length > 0 ? fieldErrors : null
      }
    }
  }

  return null
}

/**
 * Get all validation error messages as a single formatted string
 */
export function formatValidationErrors(error: unknown): string | null {
  const fieldErrors = extractValidationErrors(error)

  if (!fieldErrors) {
    return null
  }

  const messages = Object.entries(fieldErrors).map(([field, message]) => {
    // Format field name: snake_case -> Title Case
    const fieldName = field
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return `${fieldName}: ${message}`
  })

  return messages.join('\n')
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatusCode(error: unknown): number | null {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError
    return axiosError.response?.status ?? null
  }
  return null
}

/**
 * Check if error is a specific type
 */
export function isValidationError(error: unknown): boolean {
  return getErrorStatusCode(error) === 400
}

export function isUnauthorizedError(error: unknown): boolean {
  return getErrorStatusCode(error) === 401
}

export function isForbiddenError(error: unknown): boolean {
  return getErrorStatusCode(error) === 403
}

export function isNotFoundError(error: unknown): boolean {
  return getErrorStatusCode(error) === 404
}

export function isConflictError(error: unknown): boolean {
  return getErrorStatusCode(error) === 409
}
