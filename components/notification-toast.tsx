'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react'

interface NotificationToastProps {
  notification: any
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export function NotificationToast({
  notification,
  onClose,
  autoClose = true,
  duration = 5000
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Aguardar animação de saída
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  // Determinar ícone baseado no tipo de notificação
  const getIcon = () => {
    switch (notification.type) {
      case 'new_order':
        return <Bell className="w-5 h-5 text-blue-500" />
      case 'order_status_changed':
        if (notification.data.newStatus === 'ready') {
          return <CheckCircle className="w-5 h-5 text-green-500" />
        }
        return <Info className="w-5 h-5 text-blue-500" />
      case 'order_cancelled':
        return <X className="w-5 h-5 text-red-500" />
      case 'urgent_item':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  // Determinar título da notificação
  const getTitle = () => {
    switch (notification.type) {
      case 'new_order':
        return 'Novo Pedido'
      case 'order_status_changed':
        if (notification.data.newStatus === 'ready') {
          return 'Item Pronto'
        }
        return 'Status Atualizado'
      case 'order_cancelled':
        return notification.data.itemId ? 'Item Cancelado' : 'Pedido Cancelado'
      case 'urgent_item':
        return 'Item Urgente'
      default:
        return 'Notificação'
    }
  }

  // Determinar cor de fundo baseada no tipo e urgência
  const getBgColor = () => {
    if (notification.data.urgencyLevel === 'critical') {
      return 'bg-red-50 border-red-200'
    } else if (notification.data.urgencyLevel === 'warning') {
      return 'bg-amber-50 border-amber-200'
    }
    
    switch (notification.type) {
      case 'new_order':
        return 'bg-blue-50 border-blue-200'
      case 'order_status_changed':
        if (notification.data.newStatus === 'ready') {
          return 'bg-green-50 border-green-200'
        }
        return 'bg-blue-50 border-blue-200'
      case 'order_cancelled':
        return 'bg-red-50 border-red-200'
      case 'urgent_item':
        return 'bg-amber-50 border-amber-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  // Formatar mensagem da notificação
  const getMessage = () => {
    switch (notification.type) {
      case 'new_order':
        return `${notification.data.tableNumber ? `Mesa ${notification.data.tableNumber}` : 'Balcão'}${notification.data.customerName ? ` - ${notification.data.customerName}` : ''}`
      
      case 'order_status_changed':
        if (notification.data.itemId) {
          return `${notification.data.itemName || 'Item'} - ${notification.data.newStatus === 'ready' ? 'Pronto para entrega' : `Status: ${notification.data.newStatus}`}`
        }
        return `Pedido ${notification.data.newStatus}`
      
      case 'order_cancelled':
        if (notification.data.itemId) {
          return `${notification.data.itemName || 'Item'} cancelado`
        }
        return `Pedido cancelado - ${notification.data.tableNumber ? `Mesa ${notification.data.tableNumber}` : 'Balcão'}`
      
      case 'urgent_item':
        return `${notification.data.itemName || 'Item'} aguardando há muito tempo`
      
      default:
        return 'Nova notificação recebida'
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border ${getBgColor()} max-w-sm animate-slide-in-right`}
      style={{
        animation: isVisible 
          ? 'slideInRight 0.3s ease-out forwards' 
          : 'slideOutRight 0.3s ease-in forwards'
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{getTitle()}</h4>
          <p className="text-sm text-gray-700">{getMessage()}</p>
          
          <div className="mt-2 text-xs text-gray-500">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        <button 
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Componente para gerenciar múltiplas notificações
interface NotificationManagerProps {
  notifications: any[]
  onDismiss: (notification: any) => void
  maxVisible?: number
}

export function NotificationManager({
  notifications,
  onDismiss,
  maxVisible = 3
}: NotificationManagerProps) {
  // Mostrar apenas as notificações mais recentes
  const visibleNotifications = notifications.slice(0, maxVisible)

  return (
    <>
      {visibleNotifications.map((notification, index) => (
        <NotificationToast
          key={`${notification.type}-${notification.orderId}-${index}`}
          notification={notification}
          onClose={() => onDismiss(notification)}
          autoClose={true}
          duration={5000 + index * 1000} // Escalonar o tempo para não fecharem todas juntas
        />
      ))}
    </>
  )
}