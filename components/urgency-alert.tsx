'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, Bell, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface UrgencyAlertProps {
  title: string
  message: string
  minutes: number
  onDismiss?: () => void
  onAction?: () => void
  actionLabel?: string
  threshold?: {
    warning: number
    critical: number
  }
  className?: string
}

export function UrgencyAlert({
  title,
  message,
  minutes,
  onDismiss,
  onAction,
  actionLabel = 'Ver Item',
  threshold = { warning: 15, critical: 30 },
  className
}: UrgencyAlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  // Determinar nível de urgência
  const urgencyLevel = 
    minutes >= threshold.critical ? 'critical' :
    minutes >= threshold.warning ? 'warning' : 
    'normal'
  
  // Determinar classes CSS baseadas no nível de urgência
  const getUrgencyClasses = () => {
    switch (urgencyLevel) {
      case 'critical':
        return {
          container: 'bg-red-50 border-red-300',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          title: 'text-red-800',
          message: 'text-red-700'
        }
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-300',
          icon: <Bell className="w-5 h-5 text-amber-600" />,
          title: 'text-amber-800',
          message: 'text-amber-700'
        }
      default:
        return {
          container: 'bg-blue-50 border-blue-300',
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          title: 'text-blue-800',
          message: 'text-blue-700'
        }
    }
  }
  
  // Determinar classes de animação
  const animationClass = urgencyLevel === 'critical' ? 'animate-urgent-pulse' : ''
  
  const urgencyClasses = getUrgencyClasses()
  
  // Efeito para auto-dismiss após um tempo
  useEffect(() => {
    if (urgencyLevel !== 'critical') {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onDismiss) {
          setTimeout(onDismiss, 300) // Aguardar animação de saída
        }
      }, 10000) // 10 segundos
      
      return () => clearTimeout(timer)
    }
  }, [urgencyLevel, onDismiss])
  
  if (!isVisible) {
    return null
  }
  
  return (
    <div 
      className={cn(
        'flex items-start p-4 rounded-lg border shadow-sm',
        urgencyClasses.container,
        animationClass,
        className
      )}
      style={{
        animation: isVisible 
          ? 'fadeIn 0.3s ease-out forwards' 
          : 'fadeOut 0.3s ease-in forwards'
      }}
    >
      <div className="flex-shrink-0 mr-3">
        {urgencyClasses.icon}
      </div>
      
      <div className="flex-1">
        <h4 className={`font-medium ${urgencyClasses.title}`}>{title}</h4>
        <p className={`text-sm ${urgencyClasses.message}`}>{message}</p>
        
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-medium">
            {minutes} minutos de espera
          </span>
          
          {onAction && (
            <Button 
              size="sm" 
              variant={urgencyLevel === 'critical' ? 'destructive' : 'outline'}
              onClick={onAction}
              className="text-xs"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
      
      {onDismiss && (
        <button 
          onClick={() => {
            setIsVisible(false)
            setTimeout(onDismiss, 300)
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
          aria-label="Fechar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// Componente para exibir múltiplos alertas
interface UrgencyAlertsProps {
  items: Array<{
    id: string
    title: string
    message: string
    minutes: number
    onAction?: () => void
  }>
  onDismiss: (id: string) => void
  maxVisible?: number
}

export function UrgencyAlerts({
  items,
  onDismiss,
  maxVisible = 3
}: UrgencyAlertsProps) {
  // Ordenar por urgência (mais urgentes primeiro)
  const sortedItems = [...items].sort((a, b) => b.minutes - a.minutes)
  
  // Limitar número de alertas visíveis
  const visibleItems = sortedItems.slice(0, maxVisible)
  
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm">
      {visibleItems.map((item) => (
        <UrgencyAlert
          key={item.id}
          title={item.title}
          message={item.message}
          minutes={item.minutes}
          onDismiss={() => onDismiss(item.id)}
          onAction={item.onAction}
          className="animate-slide-in-right"
        />
      ))}
      
      {sortedItems.length > maxVisible && (
        <div className="bg-gray-700 text-white text-xs py-1 px-2 rounded-md text-center">
          +{sortedItems.length - maxVisible} mais alertas
        </div>
      )}
    </div>
  )
}