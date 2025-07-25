'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, AlertCircle } from 'lucide-react'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

// Níveis de urgência
export type UrgencyLevel = 'normal' | 'warning' | 'critical'

// Props do componente
interface UrgencyIndicatorProps {
  minutes: number
  threshold?: {
    warning: number
    critical: number
  }
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showText?: boolean
  className?: string
}

export function UrgencyIndicator({
  minutes,
  threshold = { warning: 15, critical: 30 },
  animate = true,
  size = 'md',
  showIcon = true,
  showText = true,
  className
}: UrgencyIndicatorProps) {
  // Determinar nível de urgência
  const urgencyLevel: UrgencyLevel = 
    minutes >= threshold.critical ? 'critical' :
    minutes >= threshold.warning ? 'warning' : 
    'normal'
  
  // Determinar classes CSS baseadas no nível de urgência
  const getUrgencyClasses = () => {
    switch (urgencyLevel) {
      case 'critical':
        return {
          text: 'text-red-600 font-bold',
          bg: 'bg-red-100',
          border: 'border-red-300',
          icon: <AlertTriangle className={`${sizeClasses.icon} text-red-600`} />
        }
      case 'warning':
        return {
          text: 'text-amber-600',
          bg: 'bg-amber-100',
          border: 'border-amber-300',
          icon: <AlertCircle className={`${sizeClasses.icon} text-amber-600`} />
        }
      default:
        return {
          text: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-300',
          icon: <Clock className={`${sizeClasses.icon} text-green-600`} />
        }
    }
  }
  
  // Determinar classes de tamanho
  const sizeClasses = {
    container: {
      'sm': 'text-xs py-0.5 px-1.5',
      'md': 'text-sm py-1 px-2',
      'lg': 'text-base py-1.5 px-3'
    }[size],
    icon: {
      'sm': 'w-3 h-3 mr-0.5',
      'md': 'w-4 h-4 mr-1',
      'lg': 'w-5 h-5 mr-1.5'
    }[size]
  }
  
  // Determinar classes de animação
  const animationClass = animate && urgencyLevel === 'critical' ? 'animate-urgent-pulse' : ''
  
  const urgencyClasses = getUrgencyClasses()
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        'flex items-center',
        urgencyClasses.bg,
        urgencyClasses.border,
        sizeClasses.container,
        animationClass,
        className
      )}
    >
      {showIcon && urgencyClasses.icon}
      {showText && (
        <span className={urgencyClasses.text}>
          {minutes} min
        </span>
      )}
    </Badge>
  )
}

// Componente para destacar itens urgentes
interface UrgentItemHighlightProps {
  children: React.ReactNode
  minutes: number
  threshold?: {
    warning: number
    critical: number
  }
  animate?: boolean
}

export function UrgentItemHighlight({
  children,
  minutes,
  threshold = { warning: 15, critical: 30 },
  animate = true
}: UrgentItemHighlightProps) {
  // Determinar nível de urgência
  const urgencyLevel: UrgencyLevel = 
    minutes >= threshold.critical ? 'critical' :
    minutes >= threshold.warning ? 'warning' : 
    'normal'
  
  // Determinar classes CSS baseadas no nível de urgência
  const getUrgencyClasses = () => {
    switch (urgencyLevel) {
      case 'critical':
        return 'border-red-500 bg-red-50'
      case 'warning':
        return 'border-amber-500 bg-amber-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }
  
  // Determinar classes de animação
  const animationClass = animate && urgencyLevel === 'critical' ? 'animate-urgent-pulse' : ''
  
  return (
    <div className={cn(
      'border rounded-lg',
      getUrgencyClasses(),
      animationClass
    )}>
      {children}
    </div>
  )
}

// Hook para calcular tempo decorrido
export function useElapsedTime(startTime: Date | string) {
  const [minutes, setMinutes] = useState(0)
  
  useEffect(() => {
    const calculateElapsed = () => {
      const start = new Date(startTime)
      const elapsed = Math.floor((Date.now() - start.getTime()) / (1000 * 60))
      setMinutes(elapsed)
    }
    
    // Calcular imediatamente
    calculateElapsed()
    
    // Atualizar a cada minuto
    const interval = setInterval(calculateElapsed, 60000)
    
    return () => clearInterval(interval)
  }, [startTime])
  
  return minutes
}