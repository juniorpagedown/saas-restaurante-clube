import { Badge } from './ui/badge'
import { Building, Crown, Users } from 'lucide-react'

interface CompanyHeaderProps {
  companyName?: string
  segment?: string
  plan?: string
  userRole?: string
  isSaasAdmin: boolean
}

export function CompanyHeader({ companyName, segment, plan, userRole, isSaasAdmin }: CompanyHeaderProps) {
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'garcom': return 'bg-green-100 text-green-800'
      case 'caixa': return 'bg-yellow-100 text-yellow-800'
      case 'porteiro': return 'bg-blue-100 text-blue-800'
      case 'saas_admin': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSegmentEmoji = (segment: string) => {
    return segment === 'restaurante' ? '🍽️' : '🏊'
  }

  if (isSaasAdmin) {
    return (
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-purple-600" />
            <div>
              <h2 className="text-lg font-semibold text-purple-900">
                Administração SaaS
              </h2>
              <p className="text-sm text-purple-700">
                Você está no ambiente de administração da plataforma
              </p>
            </div>
          </div>
          <Badge className="bg-purple-600 text-white">
            SaaS Admin
          </Badge>
        </div>
      </div>
    )
  }

  if (!companyName || !segment || !plan || !userRole) {
    return null
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900">
              {getSegmentEmoji(segment)} {companyName}
            </h2>
            <p className="text-sm text-blue-700">
              Você está operando como <strong>{userRole}</strong> nesta empresa
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getPlanColor(plan)}>
            Plano {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </Badge>
          <Badge className={getRoleColor(userRole)}>
            {userRole}
          </Badge>
        </div>
      </div>
    </div>
  )
}