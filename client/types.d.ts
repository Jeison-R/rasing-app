// Agrega todas las variables de entorno necesarias
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_URL: string
    NEXT_PUBLIC_USER_POOL_ID: string
    NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID: string
    APP_ENV?: 'local' | 'development' | 'release' | 'production'
  }
}
