/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FACEBOOK_APP_ID: string
  readonly VITE_ML_API_URL: string
  readonly VITE_CDN_URL: string
  readonly VITE_ENABLE_VIRTUAL_TRYON: string
  readonly VITE_ENABLE_SOCIAL_FEATURES: string
  readonly VITE_ENABLE_ADMIN_PANEL: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
