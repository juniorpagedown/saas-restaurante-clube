import { redirect } from 'next/navigation'
import { getUserContext } from '@/lib/auth-utils'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { AdminDashboard } from '@/components/admin-dashboard'
import { db } from '@/lib/db'

export default async function AdminPage() {
  const userContext = await getUserContext()

  if (!userContext) {
    redirect('/api/auth/signin')
  }

  // Verificar se é admin ou saas admin
  if (userContext.role !== 'admin' && !userContext.isSaasAdmin) {
    redirect('/dashboard')
  }

  // Buscar dados para o dashboard admin
  const [
    totalOrders,
    totalRevenue,
    activeOrders,
    totalProducts,
    totalTables,
    totalUsers,
    recentOrders,
    topProducts,
    dailyStats
  ] = await Promise.all([
    // Total de pedidos
    db.order.count({
      where: userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id }
    }),
    
    // Receita total
    db.order.aggregate({
      where: {
        status: 'closed',
        ...(userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id })
      },
      _sum: { total: true }
    }),
    
    // Pedidos ativos
    db.order.count({
      where: {
        status: { in: ['open', 'preparing', 'ready'] },
        ...(userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id })
      }
    }),
    
    // Total de produtos
    db.product.count({
      where: userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id }
    }),
    
    // Total de mesas
    db.table.count({
      where: userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id }
    }),
    
    // Total de usuários
    db.user.count({
      where: userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id }
    }),
    
    // Pedidos recentes
    db.order.findMany({
      take: 10,
      where: userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id },
      orderBy: { createdAt: 'desc' },
      include: {
        table: true,
        items: {
          include: { product: true }
        },
        company: userContext.isSaasAdmin ? true : false
      }
    }),
    
    // Produtos mais vendidos
    db.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: 'closed',
          ...(userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id })
        }
      },
      _sum: { quantity: true },
      _count: { productId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    }).then(async (items) => {
      const productIds = items.map(item => item.productId)
      const products = await db.product.findMany({
        where: { id: { in: productIds } }
      })
      
      return items.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId)
      }))
    }),
    
    // Estatísticas dos últimos 7 dias
    db.order.findMany({
      where: {
        status: 'closed',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        ...(userContext.isSaasAdmin ? {} : { companyId: userContext.company?.id })
      },
      select: {
        createdAt: true,
        total: true
      }
    })
  ])

  const adminData = {
    stats: {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      activeOrders,
      totalProducts,
      totalTables,
      totalUsers
    },
    recentOrders,
    topProducts,
    dailyStats,
    userContext
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userContext.isSaasAdmin ? 'Administração SaaS' : 'Painel Administrativo'}
            </h1>
            <p className="text-gray-600">
              {userContext.isSaasAdmin 
                ? 'Visão geral de toda a plataforma' 
                : `Administração de ${userContext.company?.name}`
              }
            </p>
          </div>
        </div>

        <AdminDashboard data={adminData} />
      </div>
    </DashboardLayoutWithSidebar>
  )
}