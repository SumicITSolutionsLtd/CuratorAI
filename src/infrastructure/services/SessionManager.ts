import axios from 'axios'

export interface SessionTokens {
  accessToken: string
  refreshToken: string
}

export interface SessionState {
  isAuthenticated: boolean
  tokens: SessionTokens | null
  lastRefreshAttempt: number | null
  refreshFailures: number
}

type SessionEventType = 'session-changed' | 'session-expired' | 'session-refreshed'
type SessionEventListener = (state: SessionState) => void

const TOKEN_KEYS = {
  ACCESS: 'curatorai_access_token',
  REFRESH: 'curatorai_refresh_token',
} as const

const CIRCUIT_BREAKER = {
  MAX_FAILURES: 3,
  RESET_TIMEOUT: 60000, // 1 minute
  MIN_REFRESH_INTERVAL: 5000, // 5 seconds between refresh attempts
} as const

class SessionManager {
  private static instance: SessionManager
  private state: SessionState
  private listeners: Map<SessionEventType, Set<SessionEventListener>>
  private refreshPromise: Promise<string> | null = null
  private baseURL: string

  private constructor() {
    this.state = {
      isAuthenticated: false,
      tokens: null,
      lastRefreshAttempt: null,
      refreshFailures: 0,
    }
    this.listeners = new Map()
    this.baseURL = import.meta.env.VITE_API_URL || 'https://api.curatorai.net/api/v1'
    this.initializeFromStorage()
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  private initializeFromStorage(): void {
    const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS)
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH)

    if (accessToken && refreshToken) {
      this.state = {
        ...this.state,
        isAuthenticated: true,
        tokens: { accessToken, refreshToken },
      }
    }
  }

  // Token Management
  getAccessToken(): string | null {
    return this.state.tokens?.accessToken ?? localStorage.getItem(TOKEN_KEYS.ACCESS)
  }

  getRefreshToken(): string | null {
    return this.state.tokens?.refreshToken ?? localStorage.getItem(TOKEN_KEYS.REFRESH)
  }

  setTokens(tokens: SessionTokens): void {
    localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refreshToken)

    this.state = {
      ...this.state,
      isAuthenticated: true,
      tokens,
      refreshFailures: 0,
    }

    this.emit('session-changed', this.state)
  }

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEYS.ACCESS)
    localStorage.removeItem(TOKEN_KEYS.REFRESH)

    this.state = {
      isAuthenticated: false,
      tokens: null,
      lastRefreshAttempt: null,
      refreshFailures: 0,
    }

    this.emit('session-expired', this.state)
  }

  // Session State
  isAuthenticated(): boolean {
    return this.state.isAuthenticated && !!this.getAccessToken()
  }

  getState(): SessionState {
    return { ...this.state }
  }

  // Circuit Breaker Logic
  private isCircuitOpen(): boolean {
    const { refreshFailures, lastRefreshAttempt } = this.state

    // Circuit is open if too many failures
    if (refreshFailures >= CIRCUIT_BREAKER.MAX_FAILURES) {
      // Check if enough time has passed to reset
      if (lastRefreshAttempt && Date.now() - lastRefreshAttempt > CIRCUIT_BREAKER.RESET_TIMEOUT) {
        // Reset circuit breaker
        this.state.refreshFailures = 0
        return false
      }
      return true
    }

    return false
  }

  private shouldThrottleRefresh(): boolean {
    const { lastRefreshAttempt } = this.state
    if (!lastRefreshAttempt) return false
    return Date.now() - lastRefreshAttempt < CIRCUIT_BREAKER.MIN_REFRESH_INTERVAL
  }

  // Token Refresh with Circuit Breaker
  async refreshAccessToken(): Promise<string> {
    // Return existing promise if refresh is in progress
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Check circuit breaker
    if (this.isCircuitOpen()) {
      this.clearTokens()
      throw new Error('Session expired. Please log in again.')
    }

    // Throttle rapid refresh attempts
    if (this.shouldThrottleRefresh()) {
      throw new Error('Please wait before trying again.')
    }

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.clearTokens()
      throw new Error('No refresh token available.')
    }

    this.state.lastRefreshAttempt = Date.now()

    this.refreshPromise = this.performRefresh(refreshToken)

    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }

  private async performRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh/`, {
        refresh: refreshToken,
      })

      const { access, refresh } = response.data

      // Update tokens
      this.setTokens({
        accessToken: access,
        refreshToken: refresh || refreshToken,
      })

      // Reset failure count on success
      this.state.refreshFailures = 0

      this.emit('session-refreshed', this.state)

      return access
    } catch (error) {
      // Increment failure count
      this.state.refreshFailures += 1

      // If max failures reached, clear session
      if (this.state.refreshFailures >= CIRCUIT_BREAKER.MAX_FAILURES) {
        this.clearTokens()
      }

      throw error
    }
  }

  // Event Management
  on(event: SessionEventType, listener: SessionEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener)
    }
  }

  private emit(event: SessionEventType, state: SessionState): void {
    this.listeners.get(event)?.forEach((listener) => {
      try {
        listener(state)
      } catch (error) {
        console.error(`Error in session event listener (${event}):`, error)
      }
    })
  }

  // Utility Methods
  async validateSession(): Promise<boolean> {
    const accessToken = this.getAccessToken()
    if (!accessToken) {
      return false
    }

    // Token exists - assume valid (actual validation happens on API calls)
    return true
  }

  // Handle 401 errors from API
  async handleUnauthorized(): Promise<string | null> {
    try {
      return await this.refreshAccessToken()
    } catch {
      return null
    }
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance()
