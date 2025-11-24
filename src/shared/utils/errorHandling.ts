/**
 * Utility functions for handling API errors from Django REST Framework
 */

/**
 * Extract error message from DRF error response
 *
 * DRF can return errors in multiple formats:
 * 1. Field-specific errors: { "field_name": ["error message"] }
 * 2. Non-field errors: { "non_field_errors": ["error message"] }
 * 3. Detail errors: { "detail": "error message" }
 * 4. Custom message: { "message": "error message" }
 *
 * @param error - The error object from axios/API call
 * @param fallbackMessage - Default message if no specific error found
 * @returns User-friendly error message string
 */
export function extractErrorMessage(error: any, fallbackMessage = 'An error occurred'): string {
  // Check if it's an axios error with response data
  if (error?.response?.data) {
    const data = error.response.data

    // Check for custom message field
    if (typeof data.message === 'string') {
      return data.message
    }

    // Check for detail field (common in DRF)
    if (typeof data.detail === 'string') {
      return data.detail
    }

    // Check for non_field_errors array
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
      return data.non_field_errors[0]
    }

    // Check for field-specific errors and return the first one
    const fieldErrors = Object.keys(data).filter(
      (key) => key !== 'message' && key !== 'detail' && key !== 'non_field_errors'
    )
    if (fieldErrors.length > 0) {
      const firstField = fieldErrors[0]
      const fieldError = data[firstField]

      if (Array.isArray(fieldError) && fieldError.length > 0) {
        // Return field name with error message for clarity
        return `${firstField}: ${fieldError[0]}`
      }
      if (typeof fieldError === 'string') {
        return `${firstField}: ${fieldError}`
      }
    }
  }

  // Check if error itself is an Error object with a message
  if (error instanceof Error) {
    return error.message
  }

  // Check if error is a string
  if (typeof error === 'string') {
    return error
  }

  // Fallback to default message
  return fallbackMessage
}

/**
 * Format field-specific errors for display
 * Returns an object mapping field names to error messages
 */
export function extractFieldErrors(error: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  if (error?.response?.data) {
    const data = error.response.data

    // Process each field
    Object.keys(data).forEach((key) => {
      if (key === 'message' || key === 'detail') return

      const fieldError = data[key]
      if (Array.isArray(fieldError) && fieldError.length > 0) {
        fieldErrors[key] = fieldError[0]
      } else if (typeof fieldError === 'string') {
        fieldErrors[key] = fieldError
      }
    })
  }

  return fieldErrors
}
