import { getUserContext } from '@/lib/auth-utils'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { ComandasView } from '@/components/comandas-view'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export default async function CozinhaPage() {
  const userContext = await getUserContext()
  if (!userContext) redirect('/api/auth/signin')
  if (!userContext.company) redirect('/onboarding')
  if (!['cozinha', 'admin'].includes(userContext.role)) redirect('/dashboard')

  // Buscar apenas pedidos com itens de preparo
  const activeOrders = await db.order.findMany({
    where: {
      companyId: userContext.company.id,
      status: {
        in: ['open', 'preparing', 'ready']
      }
    },
    include: {
      table: true,
      items: {
        where: {
          product: {
            category: { in: ['lanche', 'acompanhamento'] }
          }
        },
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <DashboardLayoutWithSidebar>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Painel da Cozinha</h1>
        <ComandasView orders={activeOrders} />
      </div>
    </DashboardLayoutWithSidebar>
  )
}
