export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getUserContext } from '@/lib/auth-utils'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { DatabaseViewer } from '@/components/database-viewer'
import { db } from '@/lib/db'

export default async function DatabasePage() {
  const userContext = await getUserContext()

  if (!userContext) {
    redirect('/api/auth/signin')
  }

  // Só admins podem ver
  if (userContext.role !== 'admin' && !userContext.isSaasAdmin) {
    redirect('/dashboard')
  }

  // Buscar estatísticas do banco
  const stats = await Promise.all([
    db.order.count(),
    db.orderItem.count(),
    db.product.count(),
    db.table.count(),
    db.user.count(),
    db.company.count(),
  ])

  const [orders, orderItems, products, tables, users, companies] = stats

  const recentOrders = await db.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      table: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Visualizador do Banco de Dados
          </h1>
          <p className="text-gray-600">
            Estatísticas e dados do sistema
          </p>
        </div>

        <DatabaseViewer 
          stats={{
            orders,
            orderItems,
            products,
            tables,
            users,
            companies
          }}
          recentOrders={recentOrders}
        />
      </div>
    </DashboardLayoutWithSidebar>
  )
}