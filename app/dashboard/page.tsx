import { redirect } from 'next/navigation'
import { getUserContext } from '@/lib/auth-utils'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { RestaurantDashboard } from '@/components/restaurant-dashboard'
import { ClubDashboard } from '@/components/club-dashboard'
import { SaasDashboard } from '@/components/saas-dashboard'
import { db } from '@/lib/db'

export default async function DashboardPage() {
  const userContext = await getUserContext()

  if (!userContext) {
    redirect('/api/auth/signin')
  }

  // Se é SaaS Admin, mostrar dashboard administrativo
  if (userContext.isSaasAdmin) {
    const saasData = await db.company.findMany({
      include: {
        users: true,
        _count: {
          select: {
            tables: true,
            products: true,
            orders: true,
            entries: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return (
      <DashboardLayoutWithSidebar>
        <SaasDashboard companies={saasData} />
      </DashboardLayoutWithSidebar>
    )
  }

  // Se não tem empresa, redirecionar para onboarding
  if (!userContext.company) {
    redirect('/onboarding')
  }

  // Buscar dados específicos da empresa
  const companyData = await db.company.findUnique({
    where: { id: userContext.company.id },
    include: {
      tables: true,
      products: true,
      orders: {
        include: { items: true }
      },
      entries: true
    }
  })

  if (!companyData) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayoutWithSidebar>
      {userContext.company.segment === 'restaurante' ? (
        <RestaurantDashboard user={userContext} company={companyData} />
      ) : (
        <ClubDashboard user={userContext} company={companyData} />
      )}
    </DashboardLayoutWithSidebar>
  )
}