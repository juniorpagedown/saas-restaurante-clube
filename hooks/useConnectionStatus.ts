'use client'

import { useState, useEffect, useCallback } from 'react'

interface ConnectionMetrics {
  lastConnected?: Date
  lastDisconnected?: Date
  totalReconnects: number
  connectionDuration: number
  averageLatency?: number
}

interface UseConnectionStatusReturn {
  isOnline: boolean
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline'
  metrics: ConnectionMetrics
  ping: () => Promise<number>
  resetMetrics: () => void
}

export function useConnectionStatus(): UseConnectionStatusReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    totalReconnects: 0,
    connectionDuration: 0
  })
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('offline')

  // Função para fazer ping e medir latência
  const ping = useCallback(async (): Promise<number> => {
    try {
      const start = Date.now()
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      const latency = Date.now() - start
      
      if (response.ok) {
        setMetrics(prev => ({
          ...prev,
          averageLatency: prev.averageLatency 
            ? (prev.averageLatency + latency) / 2 
            : latency
        }))
        
        // Determinar qualidade da conexão baseada na latência
        if (latency < 100) {
          setConnectionQuality('excellent')
        } else if (latency < 300) {
          setConnectionQuality('good')
        } else {
          setConnectionQuality('poor')
        }
      }
      
      return latency
    } catch (error) {
      setConnectionQuality('offline')
      return -1
    }
  }, [])

  // Monitorar status online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setMetrics(prev => ({
        ...prev,
        lastConnected: new Date()
      }))
    }

    const handleOffline = () => {
      setIsOnline(false)
      setConnectionQuality('offline')
      setMetrics(prev => ({
        ...prev,
        lastDisconnected: new Date()
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Ping periódico para monitorar qualidade da conexão
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(() => {
      ping()
    }, 30000) // Ping a cada 30 segundos

    return () => clearInterval(interval)
  }, [isOnline, ping])

  // Calcular duração da conexão
  useEffect(() => {
    if (!isOnline || !metrics.lastConnected) return

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        connectionDuration: Date.now() - (prev.lastConnected?.getTime() || 0)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [isOnline, metrics.lastConnected])

  const resetMetrics = useCallback(() => {
    setMetrics({
      totalReconnects: 0,
      connectionDuration: 0
    })
  }, [])

  return {
    isOnline,
    connectionQuality,
    metrics,
    ping,
    resetMetrics
  }
}