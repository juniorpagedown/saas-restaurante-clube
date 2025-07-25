'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Database,
  ShoppingCart,
  Package,
  Table,
  Users,
  Building,
  BarChart3
} from 'lucide-react'

interface DatabaseStats {
  orders: number
  orderItems: number
  products: number
  tables: number
  users: number
  companies: number
}

interface Order {
  id: string
  status: string
  createdAt: Date
  customerName?: string | null
  table?: {
    number: number
  } | null
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

interface DatabaseViewerProps {
  stats: DatabaseStats
  recentOrders: Order[]
}

export function DatabaseViewer({ stats, recentOrders }: DatabaseViewerProps) {
  const statCards = [
    {
      title: 'Pedidos',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Itens de Pedidos',
      value: stats.orderItems,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Produtos',
      value: stats.products,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Mesas',
      value: stats.tables,
      icon: Table,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Usuários',
      value: stats.users,
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Empresas',
      value: stats.companies,
      icon: Building,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pedidos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Pedidos Recentes (Últimos 10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {order.table ? `Mesa ${order.table.number}` : 'Balcão'}
                    </span>
                    {order.customerName && (
                      <span className="text-gray-600">- {order.customerName}</span>
                    )}
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {order.items.length} itens • {new Date(order.createdAt).toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {order.id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {order.items.map(item => 
                      `${item.quantity}x ${item.product.name}`
                    ).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Como Acessar o Banco Completo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Prisma Studio (Recomendado)</h4>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              npx prisma studio
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Abre interface web completa para visualizar e editar dados
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">2. Arquivo SQLite</h4>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              prisma/dev.db
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Use DB Browser for SQLite ou similar
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">3. Terminal SQLite</h4>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              sqlite3 prisma/dev.db
            </code>
            <p className="text-sm text-gray-600 mt-1">
              Acesso direto via linha de comando
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}