export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getUserContext } from '@/lib/auth-utils'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { UsersManager } from '@/components/users-manager'
import { db } from '@/lib/db'

export default async function UsersPage() {
  const userContext = await getUserContext()

  if (!userContext) {
    redirect('/api/auth/signin')
  }

  // Verificar se é admin
  if (userContext.role !== 'admin' && !userContext.isSaasAdmin) {
    redirect('/dashboard')
  }

  // Buscar usuários
  const users = await db.user.findMany({
    where: userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id },
    include: {
      company: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciamento de Usuários
            </h1>
            <p className="text-gray-600">
              {userContext.isSaasAdmin 
                ? 'Todos os usuários da plataforma' 
                : `Usuários de ${userContext.company?.name}`
              }
            </p>
          </div>
        </div>

        <UsersManager users={users} isSaasAdmin={userContext.isSaasAdmin} />
      </div>
    </DashboardLayoutWithSidebar>
  )
}