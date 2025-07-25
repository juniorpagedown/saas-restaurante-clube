'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

interface ReportsData {
  orders: any[]
  products: any[]
  tables: any[]
}

interface ReportsDashboardProps {
  data: ReportsData
}

export function ReportsDashboard({ data }: ReportsDashboardProps) {
  const [dateRange, setDateRange] = useState('today')
  const [reportType, setReportType] = useState('sales')

  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const filterOrdersByDate = (orders: any[]) => {
    let startDate = startOfDay

    switch (dateRange) {
      case 'week':
        startDate = startOfWeek
        break
      case 'month':
        startDate = startOfMonth
        break
      default:
        startDate = startOfDay
    }

    return orders.filter(order => new Date(order.createdAt) >= startDate)
  }

  const filteredOrders = filterOrdersByDate(data.orders)
  const closedOrders = filteredOrders.filter(order => order.status === 'closed')

  const totalRevenue = closedOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = filteredOrders.length
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const averageTime = 25

  const productSales = data.orders
    .flatMap(order => order.items || [])
    .reduce((acc: any, item: any) => {
      const productName = item.product?.name || 'Produto'
      acc[productName] = (acc[productName] || 0) + item.quantity
      return acc
    }, {})

  const topProducts = Object.entries(productSales)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)

  const categorySales = data.orders
    .flatMap(order => order.items || [])
    .reduce((acc: any, item: any) => {
      const category = item.product?.category || 'Outros'
      acc[category] = (acc[category] || 0) + (item.price * item.quantity)
      return acc
    }, {})

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourOrders = filteredOrders.filter(order => {
      const orderHour = new Date(order.createdAt).getHours()
      return orderHour === hour
    })
    return {
      hour,
      orders: hourOrders.length,
      revenue: hourOrders.reduce((sum, order) => sum + order.total, 0)
    }
  })

  const peakHour = hourlyData.reduce((max, current) =>
    current.orders > max.orders ? current : max
  )

  const stats = [
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total de Pedidos',
      value: totalOrders.toString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${averageTicket.toFixed(2)}`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Tempo Médio',
      value: `${averageTime}min`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ✅ Filtros com texto preto e contraste visível */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex space-x-2">
          {[
            { key: 'today', label: 'Hoje' },
            { key: 'week', label: 'Esta Semana' },
            { key: 'month', label: 'Este Mês' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              size="sm"
              onClick={() => setDateRange(key)}
              className={`
                text-black border text-sm px-4 py-2 rounded-md
                ${dateRange === key
                  ? 'bg-gray-200 border-gray-400'
                  : 'bg-white border-gray-300 hover:bg-gray-50'}
              `}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            className="text-black border border-gray-300 bg-white hover:bg-gray-100"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button
            size="sm"
            className="text-black border border-gray-300 bg-white hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Produtos Mais Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map(([product, quantity]: any, index) => (
                <div key={product} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium">{product}</span>
                  </div>
                  <span className="text-gray-600">{quantity} vendidos</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categorySales).map(([category, revenue]: any) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="font-medium">{category}</span>
                  <span className="text-green-600 font-semibold">
                    R$ {revenue.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horário de Pico */}
        <Card>
          <CardHeader>
            <CardTitle>Análise por Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Horário de Pico</h4>
                <p className="text-blue-700">
                  {peakHour.hour}:00 - {peakHour.hour + 1}:00
                </p>
                <p className="text-sm text-blue-600">
                  {peakHour.orders} pedidos • R$ {peakHour.revenue.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                {hourlyData
                  .filter(data => data.orders > 0)
                  .slice(0, 5)
                  .map((data) => (
                    <div key={data.hour} className="flex justify-between items-center text-sm">
                      <span>{data.hour}:00</span>
                      <div className="flex items-center space-x-2">
                        <span>{data.orders} pedidos</span>
                        <span className="text-green-600">R$ {data.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status das Mesas */}
        <Card>
          <CardHeader>
            <CardTitle>Status das Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {data.tables.filter(t => t.status === 'available').length}
                </div>
                <div className="text-sm text-green-700">Livres</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {data.tables.filter(t => t.status === 'occupied').length}
                </div>
                <div className="text-sm text-red-700">Ocupadas</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {data.tables.filter(t => t.status === 'reserved').length}
                </div>
                <div className="text-sm text-yellow-700">Reservadas</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {data.tables.filter(t => t.status === 'cleaning').length}
                </div>
                <div className="text-sm text-blue-700">Limpeza</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
