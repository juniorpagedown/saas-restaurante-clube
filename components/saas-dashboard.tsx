import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp,
  Activity,
  AlertCircle,
  Plus,
  Eye,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface Company {
  id: string
  name: string
  segment: string
  plan: string
  isActive: boolean
  createdAt: Date | string
  users: any[]
  _count: {
    tables: number
    products: number
    orders: number
    entries: number
  }
}

interface SaasDashboardProps {
  companies: Company[]
}

export function SaasDashboard({ companies }: SaasDashboardProps) {
  const totalCompanies = companies.length
  const activeCompanies = companies.filter(c => c.isActive).length
  const totalUsers = companies.reduce((sum, c) => sum + c.users.length, 0)
  const restaurantCount = companies.filter(c => c.segment === 'restaurante').length
  const clubCount = companies.filter(c => c.segment === 'clube').length

  const planDistribution = companies.reduce((acc: any, company) => {
    acc[company.plan] = (acc[company.plan] || 0) + 1
    return acc
  }, {})

  const stats = [
    {
      title: 'Total de Empresas',
      value: totalCompanies.toString(),
      subtitle: `${activeCompanies} ativas`,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Usuários Totais',
      value: totalUsers.toString(),
      subtitle: 'Across all companies',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Restaurantes',
      value: restaurantCount.toString(),
      subtitle: `${clubCount} clubes`,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Receita MRR',
      value: 'R$ 12.450',
      subtitle: '+15% vs mês anterior',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSegmentEmoji = (segment: string) => {
    return segment === 'restaurante' ? '🍽️' : '🏊'
  }

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard SaaS
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Visão geral da plataforma e empresas cadastradas
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nova Empresa
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.subtitle}
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

      {/* Plan Distribution, Segmentos, Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(planDistribution).map(([plan, count]: any) => (
                <div key={plan} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge className={getPlanColor(plan)}>
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </Badge>
                  </div>
                  <span className="font-semibold">{count} empresas</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segmentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🍽️</span>
                  <span>Restaurantes</span>
                </div>
                <span className="font-semibold">{restaurantCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏊</span>
                  <span>Clubes</span>
                </div>
                <span className="font-semibold">{clubCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-medium">3 empresas próximas do limite</p>
                  <p className="text-xs text-gray-500">Plano free</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-medium">2 pagamentos em atraso</p>
                  <p className="text-xs text-gray-500">Requer atenção</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-4 min-w-[340px]">
              {companies.slice(0, 10).map((company) => (
                <div key={company.id} className="flex flex-col md:flex-row items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 gap-2">
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="text-2xl">
                      {getSegmentEmoji(company.segment)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge className={getPlanColor(company.plan)} variant="secondary">
                          {company.plan}
                        </Badge>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {company.users.length} usuários
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {company._count.orders} pedidos
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={company.isActive ? 'default' : 'destructive'}>
                      {company.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {companies.length > 10 && (
              <div className="text-center mt-6">
                <Button variant="outline">
                  Ver todas as empresas ({companies.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}