let nextConfig = {}

if (process.env.NODE_ENV === 'production') {
  configure()
} else {
  import('./config.env.js').then((config) => configure(config)).catch((err) => console.error(`Error al configurar variables de entorno: ${err}`))
}

function configure(envVariables) {
  nextConfig = {
    env: {
      ...envVariables
    },
    reactStrictMode: false,
    compiler: {
      ...(process.env.NODE_ENV === 'production' && {
        removeConsole: {
          exclude: ['error']
        }
      })
    }
  }
}

export default nextConfig
