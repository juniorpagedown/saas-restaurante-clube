import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { ReportsDashboard } from '@/components/reports-dashboard'

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/api/auth/signin')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: { 
      company: {
        include: {
          orders: {
            include: {
              table: true,
              items: {
                include: { product: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          products: true,
          tables: true
        }
      }
    }
  })

  if (!user?.company || user.company.segment !== 'restaurante') {
    redirect('/dashboard')
  }

  const reportData = {
    orders: user.company.orders,
    products: user.company.products,
    tables: user.company.tables
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Relatórios
            </h1>
            <p className="text-gray-600 mt-2">
              Análise de vendas e performance do restaurante
            </p>
          </div>
          <ReportsDashboard data={reportData} />
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  )
}