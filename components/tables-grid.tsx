'use client'

import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Users, 
  Clock, 
  DollarSign, 
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Table {
  id: string
  number: number
  capacity: number
  status: string
  orders: any[]
}

interface TablesGridProps {
  tables: Table[]
}

export function TablesGrid({ tables }: TablesGridProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200'
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cleaning': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Livre'
      case 'occupied': return 'Ocupada'
      case 'reserved': return 'Reservada'
      case 'cleaning': return 'Limpeza'
      default: return status
    }
  }

  const handleTableAction = async (tableId: string, action: string) => {
    try {
      const response = await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, action })
      })
      
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {tables.map((table) => {
        const activeOrder = table.orders.find(order => order.status !== 'closed')
        const orderTotal = activeOrder?.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0
        
        return (
          <Card 
            key={table.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${getStatusColor(table.status)} border-2`}
            onClick={() => setSelectedTable(table)}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                  Mesa {table.number}
                </div>
                
                <Badge variant="secondary" className="mb-3">
                  {getStatusText(table.status)}
                </Badge>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {table.capacity} lugares
                  </div>
                  
                  {activeOrder && (
                    <>
                      <div className="flex items-center justify-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(activeOrder.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      
                      <div className="flex items-center justify-center text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4 mr-1" />
                        R$ {orderTotal.toFixed(2)}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  {/* Botão Fazer Pedido - sempre visível para mesas ocupadas */}
                  {(table.status === 'occupied' || table.status === 'available') && (
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = `/dashboard/new-order?table=${table.id}`
                      }}
                    >
                      Fazer Pedido
                    </Button>
                  )}
                  
                  <div className="flex justify-center space-x-1">
                    {table.status === 'available' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTableAction(table.id, 'occupy')
                        }}
                      >
                        Ocupar
                      </Button>
                    )}
                    
                    {table.status === 'occupied' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTableAction(table.id, 'free')
                        }}
                      >
                        Liberar
                      </Button>
                    )}
                    
                    {table.status !== 'cleaning' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTableAction(table.id, 'cleaning')
                        }}
                      >
                        Limpeza
                      </Button>
                    )}
                    
                    {table.status === 'cleaning' && (
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTableAction(table.id, 'available')
                        }}
                      >
                        Pronta
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}