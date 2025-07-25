'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Badge } from './ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface ConnectionStatusProps {
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  connectionQuality?: 'excellent' | 'good' | 'poor' | 'offline'
  reconnectAttempts?: number
  lastConnected?: Date
  className?: string
}

export function ConnectionStatus({
  isConnected,
  connectionStatus,
  connectionQuality = 'good',
  reconnectAttempts = 0,
  lastConnected,
  className = ''
}: ConnectionStatusProps) {
  const [timeElapsed, setTimeElapsed] = useState<string>('')

  // Atualizar tempo desde a última conexão
  useEffect(() => {
    if (!lastConnected || isConnected) {
      setTimeElapsed('')
      return
    }

    const updateElapsed = () => {
      const seconds = Math.floor((Date.now() - lastConnected.getTime()) / 1000)
      
      if (seconds < 60) {
        setTimeElapsed(`${seconds}s`)
      } else if (seconds < 3600) {
        setTimeElapsed(`${Math.floor(seconds / 60)}m`)
      } else {
        setTimeElapsed(`${Math.floor(seconds / 3600)}h`)
      }
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)
    
    return () => clearInterval(interval)
  }, [lastConnected, isConnected])

  // Determinar ícone e cor baseado no status
  const getStatusIcon = () => {
    if (isConnected) {
      if (connectionQuality === 'excellent') {
        return <Wifi className="w-4 h-4 text-green-500" />
      } else if (connectionQuality === 'good') {
        return <Wifi className="w-4 h-4 text-green-400" />
      } else if (connectionQuality === 'poor') {
        return <Wifi className="w-4 h-4 text-yellow-500" />
      }
      return <Wifi className="w-4 h-4 text-green-500" />
    } else if (connectionStatus === 'connecting') {
      return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />
    } else if (connectionStatus === 'error') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    } else {
      return <WifiOff className="w-4 h-4 text-red-500" />
    }
  }

  // Determinar texto de status
  const getStatusText = () => {
    if (isConnected) {
      return 'Conectado'
    } else if (connectionStatus === 'connecting') {
      return `Conectando${reconnectAttempts > 0 ? ` (${reconnectAttempts})` : ''}...`
    } else if (connectionStatus === 'error') {
      return 'Erro de conexão'
    } else {
      return `Desconectado${timeElapsed ? ` há ${timeElapsed}` : ''}`
    }
  }

  // Determinar cor do badge
  const getBadgeVariant = () => {
    if (isConnected) {
      if (connectionQuality === 'excellent' || connectionQuality === 'good') {
        return 'default'
      } else if (connectionQuality === 'poor') {
        return 'secondary'
      }
      return 'default'
    } else if (connectionStatus === 'connecting') {
      return 'secondary'
    } else if (connectionStatus === 'error') {
      return 'destructive'
    } else {
      return 'outline'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={getBadgeVariant()} className={`flex items-center gap-1 ${className}`}>
            {getStatusIcon()}
            <span className="text-xs">{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p><strong>Status:</strong> {connectionStatus}</p>
            {connectionQuality && <p><strong>Qualidade:</strong> {connectionQuality}</p>}
            {reconnectAttempts > 0 && <p><strong>Tentativas:</strong> {reconnectAttempts}</p>}
            {lastConnected && !isConnected && (
              <p>
                <strong>Última conexão:</strong>{' '}
                {lastConnected.toLocaleTimeString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}