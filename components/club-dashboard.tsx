import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { 
  Users, 
  DollarSign,
  Clock,
  UserCheck,
  UserX,
  Activity,
  FileText,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

interface ClubDashboardProps {
  user: any
  company: any
}

export function ClubDashboard({ user, company }: ClubDashboardProps) {
  const todayEntries = company.entries?.filter((entry: any) => {
    const today = new Date().toDateString()
    return new Date(entry.entryTime).toDateString() === today
  }) || []

  const activeEntries = company.entries?.filter((entry: any) => !entry.exitTime) || []
  const paidEntries = todayEntries.filter((entry: any) => entry.hasPaid)
  const unpaidEntries = todayEntries.filter((entry: any) => !entry.hasPaid)

  const todayRevenue = paidEntries.length * 20 // Assumindo R$ 20 por entrada

  const stats = [
    {
      title: 'Pessoas Presentes',
      value: activeEntries.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Entradas Hoje',
      value: todayEntries.length.toString(),
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pendentes Pagamento',
      value: unpaidEntries.length.toString(),
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Receita Hoje',
      value: `R$ ${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  const quickActions = [
    { title: 'Nova Entrada', href: '/dashboard/entry', icon: UserCheck },
    { title: 'Controle de Acesso', href: '/dashboard/access', icon: Users },
    { title: 'Pagamentos', href: '/dashboard/payments', icon: CreditCard },
    { title: 'Relatórios', href: '/dashboard/reports', icon: FileText },
  ]

  return (
    <div className="py-6 px-2 sm:px-4 md:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            🏊 {company.name}
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Olá, {user.name}! Controle de acesso do clube
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
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

        {/* Recent Activity & Resumo por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Entradas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {todayEntries.length > 0 ? (
                <div className="space-y-3">
                  {todayEntries.slice(0, 8).map((entry: any) => (
                    <div key={entry.id} className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <div className="w-full sm:w-auto text-center sm:text-left">
                        <p className="font-medium">{entry.visitorName}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {entry.category} • {new Date(entry.entryTime).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="text-center sm:text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          entry.hasPaid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.hasPaid ? 'Pago' : 'Pendente'}
                        </span>
                        {!entry.exitTime && (
                          <p className="text-xs text-blue-600 mt-1">Presente</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma entrada hoje
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['visitante', 'funcionario', 'cortesia'].map((category) => {
                  const categoryEntries = todayEntries.filter((entry: any) => entry.category === category)
                  const categoryRevenue = categoryEntries.filter((entry: any) => entry.hasPaid).length * 20
                  
                  return (
                    <div key={category} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
                        <h4 className="font-medium capitalize text-center sm:text-left">{category}</h4>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {categoryEntries.length} entradas
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-2">
                        <span>Receita: R$ {categoryRevenue.toFixed(2)}</span>
                        <span>
                          Presentes: {categoryEntries.filter((e: any) => !e.exitTime).length}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}