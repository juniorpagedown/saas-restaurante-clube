import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { FloatingActionButton } from './floating-action-button'
import { 
  Users, 
  DollarSign,
  Clock,
  ChefHat,
  Table,
  ShoppingCart,
  QrCode,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface RestaurantDashboardProps {
  user: any
  company: any
}

export function RestaurantDashboard({ user, company }: RestaurantDashboardProps) {
  const occupiedTables = company.tables?.filter((table: any) => table.status === 'occupied') || []

  const stats = [
    {
      title: 'Mesas Ocupadas',
      value: `${occupiedTables.length}/${company.tables?.length || 0}`,
      icon: Table,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ]

  const quickActions = [
    { title: 'Garçom', href: '/dashboard/garcom', icon: Users },
    { title: 'Cozinha', href: '/dashboard/cozinha', icon: ChefHat },
    { title: 'Gerenciar Mesas', href: '/dashboard/tables', icon: Table },
    { title: 'Cardápio', href: '/dashboard/products', icon: ShoppingCart },
    { title: 'Relatórios', href: '/dashboard/reports', icon: FileText },
  ]

  return (
    <div className="py-6 px-2 sm:px-4 md:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            🍽️ {company.name}
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Olá, {user.name}! Gerencie seu restaurante
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}> 
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center">
                  <action.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center">
                    {action.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Status das Mesas */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status das Mesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 min-w-[320px]">
                  {company.tables?.slice(0, 20).map((table: any) => (
                    <div
                      key={table.id}
                      className={`p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm font-medium ${
                        table.status === 'occupied' 
                          ? 'bg-red-100 text-red-800' 
                          : table.status === 'reserved'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {table.number}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded mr-1"></div>
                  Livre
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-100 rounded mr-1"></div>
                  Ocupada
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-100 rounded mr-1"></div>
                  Reservada
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      {/* ...existing code... */}
    </div>
  )
}