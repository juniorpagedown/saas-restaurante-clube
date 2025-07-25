'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardLayoutWithSidebar } from '@/components/dashboard-layout-with-sidebar'
import { OrderForm } from '@/components/order-form'

interface Table {
  id: string
  number: number
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={
      <DashboardLayoutWithSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayoutWithSidebar>
    }>
      <NewOrderPageContent />
    </Suspense>
  )
}

function NewOrderPageContent() {
  const searchParams = useSearchParams()
  const tableId = searchParams.get('table')
  const [table, setTable] = useState<Table | null>(null)
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tableId) {
      fetchTable(tableId)
    } else {
      setLoading(false)
    }
  }, [tableId])

  const fetchTable = async (id: string) => {
    try {
      const response = await fetch(`/api/tables/${id}`)
      if (response.ok) {
        const tableData = await response.json()
        setTable(tableData)
      }
    } catch (error) {
      console.error('Erro ao buscar mesa:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayoutWithSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayoutWithSidebar>
    )
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Novo Pedido
            </h1>
            <p className="text-gray-600">
              {table ? `Lançar produtos para Mesa ${table.number}` : 'Lançar produtos para balcão'}
            </p>
          </div>
        </div>

        <OrderForm
          tableId={table?.id}
          tableNumber={table?.number}
          onOrderCreated={() => {
            // Redirecionar para o painel do Garçom após criar
            window.location.href = '/dashboard/garcom'
          }}
        />
      </div>
    </DashboardLayoutWithSidebar>
  )
}