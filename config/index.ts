interface Config {
  env: string
  isProd: boolean
  isTest: boolean
  isDev: boolean
  nextAuth: {
    url: string
    secret: string
  
}
}

const getEnvVar = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDev: process.env.NODE_ENV === 'development',

  nextAuth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: typeof window === 'undefined' ? getEnvVar('NEXTAUTH_SECRET') : '',
  }
}
