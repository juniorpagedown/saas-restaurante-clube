'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  BarChart3,
  ShoppingCart,
  DollarSign,
  Package,
  Table,
  Users,
  TrendingUp,
  Clock,
  Database,
  Settings,
  FileText,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface AdminStats {
  totalOrders: number
  totalRevenue: number
  activeOrders: number
  totalProducts: number
  totalTables: number
  totalUsers: number
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  customerName?: string | null
  table?: {
    number: number
  } | null
  company?: {
    name: string
  }
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

interface TopProduct {
  productId: string
  _sum: { quantity: number | null }
  _count: { productId: number }
  product?: {
    name: string
    price: number
    category: string
  }
}

interface DailyStat {
  createdAt: Date
  total: number
}

interface AdminDashboardProps {
  data: {
    stats: AdminStats
    recentOrders: Order[]
    topProducts: TopProduct[]
    dailyStats: DailyStat[]
    userContext: any
  }
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const { stats, recentOrders, topProducts, dailyStats, userContext } = data

  // Calcular receita dos últimos 7 dias
  const last7DaysRevenue = dailyStats.reduce((sum, stat) => sum + stat.total, 0)
  
  // Agrupar por dia
  const dailyRevenue = dailyStats.reduce((acc, stat) => {
    const date = new Date(stat.createdAt).toLocaleDateString('pt-BR')
    acc[date] = (acc[date] || 0) + stat.total
    return acc
  }, {} as Record<string, number>)

  const statCards = [
    {
      title: 'Total de Pedidos',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%'
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%'
    },
    {
      title: 'Pedidos Ativos',
      value: stats.activeOrders.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      urgent: stats.activeOrders > 10
    },
    {
      title: 'Produtos',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Mesas',
      value: stats.totalTables.toString(),
      icon: Table,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Usuários',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  const adminActions = [
    {
      title: 'Banco de Dados',
      description: 'Visualizar e gerenciar dados',
      href: '/dashboard/admin/database',
      icon: Database,
      color: 'bg-blue-600'
    },
    {
      title: 'Relatórios',
      description: 'Relatórios detalhados',
      href: '/dashboard/reports',
      icon: FileText,
      color: 'bg-green-600'
    },
    {
      title: 'Configurações',
      description: 'Configurações do sistema',
      href: '/dashboard/admin/settings',
      icon: Settings,
      color: 'bg-purple-600'
    },
    {
      title: 'Usuários',
      description: 'Gerenciar usuários',
      href: '/dashboard/admin/users',
      icon: Users,
      color: 'bg-orange-600'
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
      {/* Alertas */}
      {stats.activeOrders > 10 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">
                Atenção: {stats.activeOrders} pedidos ativos.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={stat.urgent ? 'border-orange-200' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.change && (
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Receita dos Últimos 7 Dias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Receita dos Últimos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">
              R$ {last7DaysRevenue.toFixed(2)}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-4">
              {Object.entries(dailyRevenue).slice(-7).map(([date, revenue]) => (
                <div key={date} className="text-center">
                  <div className="text-xs text-gray-500">{date.split('/')[0]}</div>
                  <div className="text-sm font-medium">R$ {revenue.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Administrativas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Grid com Dados */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pedidos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
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
                      {userContext.isSaasAdmin && order.company && (
                        <Badge variant="outline" className="text-xs">
                          {order.company.name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} itens • {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <div className="text-sm font-medium text-green-600 mt-1">
                      R$ {order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produtos Mais Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((item, index) => (
                <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {item.product?.name || 'Produto não encontrado'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.product?.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {item._sum.quantity || 0} vendidos
                    </div>
                    <div className="text-sm text-gray-500">
                      {item._count.productId} pedidos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}