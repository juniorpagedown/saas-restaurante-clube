export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getUserContext } from '@/lib/auth-utils'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { AdminSettings } from '@/components/admin-settings'
import { db } from '@/lib/db'

export default async function SettingsPage() {
  const userContext = await getUserContext()

  if (!userContext) {
    redirect('/api/auth/signin')
  }

  // Verificar se é admin
  if (userContext.role !== 'admin' && !userContext.isSaasAdmin) {
    redirect('/dashboard')
  }

  // Buscar configurações da empresa
  const company = userContext.isSaasAdmin 
    ? null 
    : await db.company.findUnique({
        where: { id: userContext.company?.id }
      })

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Configurações
            </h1>
            <p className="text-gray-600">
              {userContext.isSaasAdmin 
                ? 'Configurações da plataforma' 
                : `Configurações de ${userContext.company?.name}`
              }
            </p>
          </div>
        </div>

        <AdminSettings 
          company={company} 
          userContext={userContext} 
        />
      </div>
    </DashboardLayoutWithSidebar>
  )
}