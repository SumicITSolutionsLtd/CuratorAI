/**
 * OAuth Integration Utilities
 *
 * To enable OAuth login:
 * 1. Google OAuth:
 *    - Get Client ID from https://console.cloud.google.com/
 *    - Add to .env as VITE_GOOGLE_CLIENT_ID
 *    - Enable Google Identity Services
 *
 * 2. Facebook OAuth:
 *    - Get App ID from https://developers.facebook.com/
 *    - Add to .env as VITE_FACEBOOK_APP_ID
 *    - Enable Facebook SDK
 */

export interface OAuthConfig {
  googleClientId?: string
  facebookAppId?: string
}

const config: OAuthConfig = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID,
}

/**
 * Initialize Google OAuth
 * This loads the Google Identity Services SDK and initializes it
 */
export const initGoogleOAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!config.googleClientId) {
      reject(new Error('Google Client ID not configured'))
      return
    }

    // Check if already loaded
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    // Load Google Identity Services SDK
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      window.google?.accounts?.id.initialize({
        client_id: config.googleClientId!,
        callback: () => {}, // Will be overridden
      })
      resolve()
    }
    script.onerror = () => reject(new Error('Failed to load Google SDK'))
    document.body.appendChild(script)
  })
}

/**
 * Trigger Google OAuth login
 * Returns the access token on success
 */
export const loginWithGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!config.googleClientId) {
      reject(new Error('Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file'))
      return
    }

    // Initialize Google Sign-In
    window.google?.accounts?.id.initialize({
      client_id: config.googleClientId,
      callback: (response: any) => {
        if (response.credential) {
          // response.credential is the JWT ID token
          resolve(response.credential)
        } else {
          reject(new Error('Google OAuth failed'))
        }
      },
    })

    // Trigger the sign-in prompt
    window.google?.accounts?.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        reject(new Error('Google OAuth popup was closed'))
      }
    })
  })
}

/**
 * Initialize Facebook SDK
 */
export const initFacebookSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!config.facebookAppId) {
      reject(new Error('Facebook App ID not configured'))
      return
    }

    // Check if already loaded
    if (window.FB) {
      resolve()
      return
    }

    // Load Facebook SDK
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: config.facebookAppId!,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      })
      resolve()
    }

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.onload = () => {}
    script.onerror = () => reject(new Error('Failed to load Facebook SDK'))
    document.body.appendChild(script)
  })
}

/**
 * Trigger Facebook OAuth login
 * Returns the access token on success
 */
export const loginWithFacebook = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!config.facebookAppId) {
      reject(new Error('Facebook App ID not configured. Please add VITE_FACEBOOK_APP_ID to your .env file'))
      return
    }

    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded'))
      return
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken)
        } else {
          reject(new Error('Facebook OAuth was cancelled'))
        }
      },
      { scope: 'public_profile,email' }
    )
  })
}

// Type definitions for global objects
declare global {
  interface Window {
    google?: any
    FB?: any
    fbAsyncInit?: () => void
  }
}
