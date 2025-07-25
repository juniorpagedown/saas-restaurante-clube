export const dynamic = 'force-dynamic'

import { getUserContext } from '@/lib/auth-utils'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { OrdersList } from '@/components/orders-list'
import { redirect } from 'next/navigation'

export default async function GarcomPage() {
  const userContext = await getUserContext()
  if (!userContext) redirect('/api/auth/signin')
  if (!userContext.company) redirect('/onboarding')
  if (!['garcom', 'admin'].includes(userContext.role)) redirect('/dashboard')

  // Buscar pedidos da empresa do banco
  const { db } = await import('@/lib/db')
  const orders = await db.order.findMany({
    where: { companyId: userContext.company.id },
    include: {
      table: true,
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <DashboardLayoutWithSidebar>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Painel do Garçom</h1>
        <OrdersList orders={orders} />
      </div>
    </DashboardLayoutWithSidebar>
  )
}
