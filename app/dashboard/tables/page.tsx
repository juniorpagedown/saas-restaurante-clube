export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getUserContext, requireAuth, requireCompany, requireRole } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { TablesGrid } from '@/components/tables-grid'
import { CompanyHeader } from '@/components/company-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default async function TablesPage() {
  const userContext = await getUserContext()
  requireAuth(userContext)
  requireCompany(userContext!)
  requireRole(userContext!, ['admin', 'garcom'])

  if (userContext!.company!.segment !== 'restaurante') {
    redirect('/dashboard')
  }

  // Buscar apenas mesas da empresa do usuário
  const tables = await db.table.findMany({
    where: { companyId: userContext!.company!.id },
    include: {
      orders: {
        where: { status: { not: 'closed' } },
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    },
    orderBy: { number: 'asc' }
  })

  return (
    <DashboardLayoutWithSidebar>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CompanyHeader 
            companyName={userContext!.company!.name}
            segment={userContext!.company!.segment}
            plan={userContext!.company!.plan}
            userRole={userContext!.role}
            isSaasAdmin={false}
          />
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciar Mesas
              </h1>
              <p className="text-gray-600 mt-2">
                Controle o status e ocupação das mesas
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Mesa
            </Button>
          </div>
          <TablesGrid tables={tables} />
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  )
}