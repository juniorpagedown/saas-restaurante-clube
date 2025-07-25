'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Trash2, RefreshCw } from 'lucide-react'

interface Order {
  id: string
  status: string
  createdAt: Date
  customerName?: string | null
  table?: {
    number: number
  } | null
  items: Array<{
    id: string
    quantity: number
    product: {
      name: string
    }
  }>
}

export function DebugOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/debug/orders/${orderId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Erro ao deletar pedido:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Detectar possíveis duplicatas
  const duplicates = orders.filter((order, index, arr) => {
    return arr.some((other, otherIndex) => 
      otherIndex !== index &&
      order.table?.number === other.table?.number &&
      order.customerName === other.customerName &&
      Math.abs(new Date(order.createdAt).getTime() - new Date(other.createdAt).getTime()) < 60000 // 1 minuto
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Debug - Pedidos Recentes
          <Button size="sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {duplicates.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">
              ⚠️ Possíveis Duplicatas Detectadas ({duplicates.length})
            </h4>
            {duplicates.map(order => (
              <div key={order.id} className="text-sm text-red-700 mb-1">
                {order.table ? `Mesa ${order.table.number}` : 'Balcão'} - 
                {new Date(order.createdAt).toLocaleTimeString()} - 
                {order.items.length} itens
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 h-6 w-6 p-0"
                  onClick={() => deleteOrder(order.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {orders.map(order => (
            <div key={order.id} className="flex justify-between items-center p-2 border rounded">
              <div className="text-sm">
                <strong>{order.table ? `Mesa ${order.table.number}` : 'Balcão'}</strong>
                {order.customerName && ` - ${order.customerName}`}
                <br />
                <span className="text-gray-500">
                  {new Date(order.createdAt).toLocaleString()} - 
                  {order.items.length} itens - 
                  Status: {order.status}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteOrder(order.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}