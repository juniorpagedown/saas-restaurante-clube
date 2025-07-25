'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Clock, 
  DollarSign, 
  Eye,
  Plus,
  Minus,
  Check,
  X
} from 'lucide-react'

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date | string
  table?: { 
    number: number
    status?: string
    id?: string
    createdAt?: Date
    updatedAt?: Date
    companyId?: string
    capacity?: number
  } | null
  customerName?: string | null
  items: Array<{
    id: string
    quantity: number
    price: number
    notes?: string | null
    status: string
    product: {
      id?: string
      name: string
      category: string
      isActive?: boolean
      createdAt?: Date
      updatedAt?: Date
      companyId?: string
      image?: string | null
      description?: string | null
    }
  }>
}

interface OrdersListProps {
  orders: Order[]
}

export function OrdersList({ orders }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('all')
  const [itemStatusError, setItemStatusError] = useState<string | null>(null)
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)

  const updateOrderItemStatus = async (itemId: string, newStatus: string) => {
    setUpdatingItemId(itemId)
    setItemStatusError(null)
    try {
      const response = await fetch('/api/orders/item-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderItemId: itemId, newStatus })
      })
      if (response.ok) {
        window.location.reload()
      } else {
        const data = await response.json()
        setItemStatusError(data?.error || 'Erro ao atualizar item.')
      }
    } catch (error) {
      setItemStatusError('Erro de conexão ao atualizar item.')
    } finally {
      setUpdatingItemId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-900'
      case 'preparing': return 'bg-yellow-100 text-yellow-900'
      case 'ready': return 'bg-green-100 text-green-900'
      case 'delivered': return 'bg-purple-100 text-purple-900'
      case 'closed': return 'bg-gray-100 text-gray-900'
      default: return 'bg-gray-100 text-gray-900'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta'
      case 'preparing': return 'Preparando'
      case 'ready': return 'Pronto'
      case 'delivered': return 'Entregue'
      case 'closed': return 'Fechada'
      default: return status
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros corrigidos com texto sempre preto */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[ 
          { key: 'all', label: 'Todos' },
          { key: 'open', label: 'Abertas' },
          { key: 'preparing', label: 'Preparando' },
          { key: 'ready', label: 'Prontas' },
          { key: 'delivered', label: 'Entregues' },
          { key: 'closed', label: 'Fechadas' },
        ].map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            onClick={() => setFilter(key)}
            className={`
              text-black border text-sm px-4 py-2 rounded-md
              ${filter === key 
                ? 'bg-gray-200 border-gray-400' 
                : 'bg-white border-gray-300 hover:bg-gray-50'}
            `}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {order.table ? `Mesa ${order.table.number}` : 'Balcão'}
                    {order.customerName && (
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        • {order.customerName}
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </div>
                    <div className="flex items-center font-semibold text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      R$ {order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {selectedOrder?.id === order.id && (
              <CardContent className="pt-0">
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Itens do Pedido:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.quantity}x {item.product.name}</span>
                          <span className="text-sm text-gray-800 ml-2">({item.product.category})</span>
                          {item.notes && (
                            <p className="text-xs text-gray-700 mt-1">Obs: {item.notes}</p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-semibold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          {['lanche', 'acompanhamento'].includes(item.product.category) && (
                            <Badge variant="secondary" className="text-xs mb-1 text-gray-900">
                              {item.status === 'preparing' ? 'Preparando' : item.status === 'ready' ? 'Pronto' : getStatusText(item.status)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {itemStatusError && (
                    <div className="text-red-500 text-sm mt-2 text-right">{itemStatusError}</div>
                  )}
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                    {/* Garçom não pode iniciar/concluir preparo, só visualizar status */}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-800">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  )
}
