'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Clock, 
  DollarSign, 
  Eye,
  Printer,
  Check,
  X,
  ChefHat,
  Utensils,
  CreditCard
} from 'lucide-react'
import { FecharComandaButton } from './fechar-comanda-modal'

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  customerName?: string | null
  table?: {
    id: string
    number: number
  } | null
  items: Array<{
    id: string
    quantity: number
    price: number
    notes?: string | null
    status: string
    product: {
      id: string
      name: string
      category: string
    }
  }>
}

interface ComandasViewProps {
  orders: Order[]
}

export function ComandasView({ orders }: ComandasViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-900 border-blue-200' // azul escuro
      case 'preparing': return 'bg-yellow-100 text-yellow-900 border-yellow-200' // amarelo escuro
      case 'ready': return 'bg-green-100 text-green-900 border-green-200' // verde escuro
      default: return 'bg-gray-100 text-gray-900 border-gray-200' // cinza escuro
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta'
      case 'preparing': return 'Preparando'
      case 'ready': return 'Pronta'
      default: return status
    }
  }

  const getTimeElapsed = (createdAt: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(createdAt).getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    return minutes
  }

  const getTimeColor = (minutes: number) => {
    if (minutes < 15) return 'text-green-800' // verde escuro
    if (minutes < 30) return 'text-yellow-800' // amarelo escuro
    return 'text-red-800' // vermelho escuro
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
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
      console.error('Erro ao atualizar status:', error)
    }
  }

  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const printComanda = (order: Order) => {
    // Implementar impressão da comanda
    const printContent = `
      COMANDA - ${order.table ? `Mesa ${order.table.number}` : 'Balcão'}
      ${order.customerName ? `Cliente: ${order.customerName}` : ''}
      Data: ${new Date(order.createdAt).toLocaleString('pt-BR')}
      
      ITENS:
      ${order.items.map(item => 
        `${item.quantity}x ${item.product.name} - R$ ${(item.price * item.quantity).toFixed(2)}
        ${item.notes ? `Obs: ${item.notes}` : ''}`
      ).join('\n')}
      
      TOTAL: R$ ${calculateOrderTotal(order).toFixed(2)}
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`)
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Comandas Abertas</p> {/* contraste melhor */}
                <p className="text-2xl font-bold text-blue-900">
                  {orders.filter(o => o.status === 'open').length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Utensils className="w-6 h-6 text-blue-900" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-900">Em Preparo</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {orders.filter(o => o.status === 'preparing').length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChefHat className="w-6 h-6 text-yellow-900" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-900">Prontos</p>
                <p className="text-2xl font-bold text-green-900">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-900" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Comandas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma comanda ativa
            </h3>
            <p className="text-gray-500 mb-4">
              Todas as comandas foram finalizadas
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const elapsed = getTimeElapsed(order.createdAt)
            const total = calculateOrderTotal(order)
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {order.table ? `Mesa ${order.table.number}` : 'Balcão'}
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  {order.customerName && (
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tempo e Total */}
                  <div className="flex justify-between items-center text-sm">
                    <div className={`flex items-center ${getTimeColor(elapsed)}`}>
                      <Clock className="w-4 h-4 mr-1" />
                      {elapsed}min
                    </div>
                    <div className="flex items-center font-semibold text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      R$ {total.toFixed(2)}
                    </div>
                  </div>

                  {/* Itens com status e ação */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.quantity}x {item.product.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({item.product.category})</span>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1">Obs: {item.notes}</p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          {/* Só mostra status para lanche/acompanhamento */}
                          {['lanche', 'acompanhamento'].includes(item.product.category) && (
                            <Badge variant="secondary" className="text-xs mb-1">
                              {item.status === 'preparing' ? 'Preparando' : item.status === 'ready' ? 'Pronta' : item.status}
                            </Badge>
                          )}
                          {/* Iniciar Preparo para lanche/acompanhamento se não estiver preparando */}
                          {item.status !== 'preparing' && ['lanche', 'acompanhamento'].includes(item.product.category) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/orders/item-status', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ orderItemId: item.id, newStatus: 'preparing' })
                                  })
                                  if (response.ok) {
                                    window.location.reload()
                                  }
                                } catch (error) {
                                  alert('Erro ao atualizar item.')
                                }
                              }}
                            >
                              Iniciar preparo
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => printComanda(order)}
                      className="flex-1"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Imprimir
                    </Button>
                    
                    {order.status === 'open' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                      >
                        <ChefHat className="w-4 h-4 mr-1" />
                        Iniciar preparo
                      </Button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Marcar como pronta
                      </Button>
                    )}
                    
                    {order.status === 'ready' && (
                      <FecharComandaButton
                        order={order}
                        onSuccess={() => window.location.reload()}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}