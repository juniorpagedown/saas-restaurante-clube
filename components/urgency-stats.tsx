'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Progress } from './ui/progress'
import { cn } from '@/lib/utils'

// Estatísticas de urgência
interface UrgencyStats {
  total: number
  normal: number
  warning: number
  critical: number
  averageWaitTime: number
  oldestItem: number
}

// Props do componente
interface UrgencyStatsProps {
  stats: UrgencyStats
  className?: string
  compact?: boolean
}

export function UrgencyStats({
  stats,
  className,
  compact = false
}: UrgencyStatsProps) {
  // Calcular porcentagens
  const normalPercent = stats.total > 0 ? (stats.normal / stats.total) * 100 : 0
  const warningPercent = stats.total > 0 ? (stats.warning / stats.total) * 100 : 0
  const criticalPercent = stats.total > 0 ? (stats.critical / stats.total) * 100 : 0
  
  // Determinar classe de status geral
  const getStatusClass = () => {
    if (stats.critical > 0) return 'text-red-600'
    if (stats.warning > 0) return 'text-amber-600'
    return 'text-green-600'
  }
  
  // Determinar ícone de status geral
  const getStatusIcon = () => {
    if (stats.critical > 0) return <AlertTriangle className="w-5 h-5 text-red-600" />
    if (stats.warning > 0) return <AlertCircle className="w-5 h-5 text-amber-600" />
    return <CheckCircle className="w-5 h-5 text-green-600" />
  }
  
  if (compact) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {getStatusIcon()}
        <div className="text-sm">
          <span className={getStatusClass()}>
            {stats.critical > 0 ? `${stats.critical} críticos` : 
             stats.warning > 0 ? `${stats.warning} atenção` : 
             'Tudo em dia'}
          </span>
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn('bg-white p-4 rounded-lg border border-gray-200', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Status dos Pedidos</h3>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`ml-1 font-medium ${getStatusClass()}`}>
            {stats.critical > 0 ? 'Atenção Urgente' : 
             stats.warning > 0 ? 'Atenção Necessária' : 
             'Tudo em Ordem'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Distribuição de Pedidos</span>
            <span className="text-sm font-medium">{stats.total} itens</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            {stats.total > 0 && (
              <>
                <div 
                  className="h-full bg-green-500 float-left" 
                  style={{ width: `${normalPercent}%` }}
                />
                <div 
                  className="h-full bg-amber-500 float-left" 
                  style={{ width: `${warningPercent}%` }}
                />
                <div 
                  className="h-full bg-red-500 float-left" 
                  style={{ width: `${criticalPercent}%` }}
                />
              </>
            )}
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
              <span>Normal ({stats.normal})</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-1" />
              <span>Atenção ({stats.warning})</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
              <span>Crítico ({stats.critical})</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              <span>Tempo Médio</span>
            </div>
            <div className="text-lg font-medium">
              {stats.averageWaitTime} min
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Item Mais Antigo</span>
            </div>
            <div className={`text-lg font-medium ${
              stats.oldestItem >= 30 ? 'text-red-600' :
              stats.oldestItem >= 15 ? 'text-amber-600' :
              'text-gray-900'
            }`}>
              {stats.oldestItem} min
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook para calcular estatísticas de urgência
export function useUrgencyStats(
  items: Array<{ createdAt: Date | string, status: string }>,
  threshold = { warning: 15, critical: 30 }
) {
  const [stats, setStats] = useState<UrgencyStats>({
    total: 0,
    normal: 0,
    warning: 0,
    critical: 0,
    averageWaitTime: 0,
    oldestItem: 0
  })
  
  useEffect(() => {
    // Filtrar apenas itens ativos (não entregues/cancelados)
    const activeItems = items.filter(item => 
      item.status !== 'delivered' && 
      item.status !== 'cancelled' &&
      item.status !== 'ready'
    )
    
    if (activeItems.length === 0) {
      setStats({
        total: 0,
        normal: 0,
        warning: 0,
        critical: 0,
        averageWaitTime: 0,
        oldestItem: 0
      })
      return
    }
    
    // Calcular tempos de espera
    const now = Date.now()
    const waitTimes = activeItems.map(item => {
      const created = new Date(item.createdAt).getTime()
      return Math.floor((now - created) / (1000 * 60)) // minutos
    })
    
    // Calcular estatísticas
    const total = activeItems.length
    const normal = waitTimes.filter(time => time < threshold.warning).length
    const warning = waitTimes.filter(time => time >= threshold.warning && time < threshold.critical).length
    const critical = waitTimes.filter(time => time >= threshold.critical).length
    const averageWaitTime = Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / total)
    const oldestItem = Math.max(...waitTimes)
    
    setStats({
      total,
      normal,
      warning,
      critical,
      averageWaitTime,
      oldestItem
    })
  }, [items, threshold])
  
  return stats
}