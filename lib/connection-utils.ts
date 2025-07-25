export interface DeviceInfo {
  userAgent: string
  platform: string
  language: string
  screenResolution?: string
  timeZone: string
}

export interface ConnectionInfo {
  ip?: string
  protocol: string
  secureConnection: boolean
  city?: string
  country?: string
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'server',
      platform: process.platform,
      language: 'en',
      timeZone: 'UTC'
    }
  }

  return {
    userAgent: window.navigator.userAgent,
    platform: window.navigator.platform,
    language: window.navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

export function getConnectionInfo(): ConnectionInfo {
  if (typeof window === 'undefined') {
    return {
      protocol: 'server',
      secureConnection: true
    }
  }

  return {
    protocol: window.location.protocol,
    secureConnection: window.location.protocol === 'https:',
  }
}
