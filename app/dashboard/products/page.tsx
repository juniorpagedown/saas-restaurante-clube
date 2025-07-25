import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { ProductsGrid } from '@/components/products-grid'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload } from 'lucide-react'

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/api/auth/signin')

  const user = await db.user.findUnique({
    where: { email: session.user?.email || '' },
    include: {
      company: {
        include: {
          products: {
            orderBy: { name: 'asc' }
          }
        }
      }
    }
  })

  if (!user?.company || user.company.segment !== 'restaurante') {
    redirect('/dashboard')
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cardápio
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie produtos e categorias do cardápio
              </p>
            </div>

            {/* ✅ Botões com texto preto e visual consistente */}
            <div className="flex space-x-2">
              <Button className="bg-white text-black border border-gray-300 hover:bg-gray-100">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
              <Button className="bg-white text-black border border-gray-300 hover:bg-gray-100">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-white text-black border border-gray-300 hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>

          <ProductsGrid products={user.company.products} />
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  )
}
