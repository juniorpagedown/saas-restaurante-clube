import { redirect } from 'next/navigation'
import { getUserContext } from '@/lib/auth-utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { UsersManager } from '@/components/users-manager'
import { db } from '@/lib/db'

export default async function UsersPage() {
  const userContext = await getUserContext()

  if (!userContext) redirect('/api/auth/signin')

  const isAdmin = userContext.role === 'admin' || userContext.isSaasAdmin
  if (!isAdmin) redirect('/dashboard')

  const users = await db.user.findMany({
    where: userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id },
    include: { company: true },
    orderBy: { createdAt: 'desc' }
  })

  const subtitle = userContext.isSaasAdmin
    ? 'Todos os usuários da plataforma'
    : `Usuários de ${userContext.company?.name}`

  return (
    <DashboardLayoutWithSidebar>
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
        </header>

        <UsersManager users={users} isSaasAdmin={userContext.isSaasAdmin} />
      </section>
    </DashboardLayoutWithSidebar>
  )
}
