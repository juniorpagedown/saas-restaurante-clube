'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Bell, 
  X, 
  ChevronDown, 
  ChevronUp,
  Activity
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

import { cn } from '@/lib/utils'

interface Alert {
  id: string
  type: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: Date
  title?: string
  message?: string
}

interface VolumeAlertsProps {
  alerts: Alert[]
  onDismiss: (alertId: string) => void
  compact?: boolean
  className?: string
}

export function VolumeAlerts({ 
  alerts, 
  onDismiss, 
  compact = false, 
  className 
}: VolumeAlertsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (alerts.length === 0) {
    return null
  }
  
  // Ordenar alertas por severidade e timestamp
  const severityOrder: Record<string, number> = { critical: 3, warning: 2, info: 1 }
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityDiff = (severityOrder[b.severity] ?? 0) - (severityOrder[a.severity] ?? 0)
    if (severityDiff !== 0) return severityDiff
    return b.timestamp.getTime() - a.timestamp.getTime()
  })
  
  // Obter ícone baseado no tipo de alerta
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high_volume':
        return <TrendingUp className="w-4 h-4" />
      case 'slow_service':
        return <Clock className="w-4 h-4" />
      case 'urgent_items':
        return <AlertTriangle className="w-4 h-4" />
      case 'peak_detected':
        return <Activity className="w-4 h-4" />
      case 'low_efficiency':
        return <TrendingDown className="w-4 h-4" />
      case 'bottleneck_detected':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }
  
  // Obter classes CSS baseadas na severidade
  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          container: 'bg-red-50 border-red-300',
          icon: 'text-red-600',
          title: 'text-red-800',
          message: 'text-red-700',
          badge: 'bg-red-100 text-red-800'
        }
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-300',
          icon: 'text-amber-600',
          title: 'text-amber-800',
          message: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800'
        }
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-300',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800'
        }
      default:
        return {
          container: 'bg-gray-50 border-gray-300',
          icon: 'text-gray-600',
          title: 'text-gray-800',
          message: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-800'
        }
    }
  }
  
  // Componente para alerta individual
  const AlertItem = ({ alert }: { alert: Alert }) => {
    const classes = getSeverityClasses(alert.severity) || {}
    
    return (
      <div className={cn(
        'flex items-start p-3 rounded-lg border',
        classes.container ?? '',
        compact && 'p-2'
      )}>
        <div className={cn('flex-shrink-0 mr-3', classes.icon ?? '')}>
          {getAlertIcon(alert.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn('font-medium', classes.title ?? '', compact && 'text-sm')}>
              {alert.title}
            </h4>
            <Badge variant="outline" className={cn('text-xs', classes.badge ?? '')}>
              {alert.severity}
            </Badge>
          </div>
          
          <p className={cn('text-sm', classes.message ?? '', compact && 'text-xs')}>
            {alert.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {alert.timestamp.toLocaleTimeString()}
            </span>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(alert.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  if (compact) {
    const criticalAlerts = sortedAlerts.filter(a => a.severity === 'critical')
    const warningAlerts = sortedAlerts.filter(a => a.severity === 'warning')
    
    return (
      <div className={cn('space-y-2', className)}>
        {criticalAlerts.slice(0, 2).map(alert => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
        {criticalAlerts.length === 0 && warningAlerts.slice(0, 1).map(alert => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
        
        {sortedAlerts.length > (criticalAlerts.length > 0 ? 2 : 1) && (
          <div className="text-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Menos alertas
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  +{sortedAlerts.length - (criticalAlerts.length > 0 ? 2 : 1)} alertas
                </>
              )}
            </Button>
          </div>
        )}
        
        {isExpanded && (
          <div className="space-y-2">
            {sortedAlerts.slice(criticalAlerts.length > 0 ? 2 : 1).map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Alertas de Volume
            </CardTitle>
            <CardDescription>
              {alerts.length} alerta{alerts.length !== 1 ? 's' : ''} ativo{alerts.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            {sortedAlerts.filter(a => a.severity === 'critical').length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {sortedAlerts.filter(a => a.severity === 'critical').length} críticos
              </Badge>
            )}
            {sortedAlerts.filter(a => a.severity === 'warning').length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {sortedAlerts.filter(a => a.severity === 'warning').length} avisos
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedAlerts.map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}