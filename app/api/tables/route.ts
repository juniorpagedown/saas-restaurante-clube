import { NextRequest, NextResponse } from 'next/server'
import { getUserContext, requireAuth, requireCompany } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  try {
    const userContext = await getUserContext()
    requireAuth(userContext)
    requireCompany(userContext!)

    const { tableId, action } = await req.json()

    // Verificar se a mesa pertence à empresa do usuário
    const table = await db.table.findFirst({
      where: { 
        id: tableId,
        companyId: userContext!.company!.id
      }
    })

    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    let newStatus = 'available'
    
    switch (action) {
      case 'occupy':
        newStatus = 'occupied'
        // Criar uma nova comanda
        await db.order.create({
          data: {
            tableId,
            companyId: userContext!.company!.id,
            status: 'open'
          }
        })
        break
      case 'free':
        newStatus = 'available'
        // Fechar comandas abertas (apenas da empresa)
        await db.order.updateMany({
          where: { 
            tableId,
            companyId: userContext!.company!.id,
            status: { not: 'closed' }
          },
          data: { status: 'closed' }
        })
        break
      case 'cleaning':
        newStatus = 'cleaning'
        break
      case 'available':
        newStatus = 'available'
        break
      case 'reserve':
        newStatus = 'reserved'
        break
    }

    const updatedTable = await db.table.update({
      where: { 
        id: tableId,
        companyId: userContext!.company!.id
      },
      data: { status: newStatus }
    })

    return NextResponse.json(updatedTable)
  } catch (error) {
    console.error('Erro ao atualizar mesa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}