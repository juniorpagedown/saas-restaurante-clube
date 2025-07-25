export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'


/**
 * API route para buscar notificações perdidas durante desconexão
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obter parâmetros da requisição
    const url = new URL(req.url || 'http://localhost')
    const sinceParam = url.searchParams.get('since')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    // Validar parâmetros
    if (!sinceParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: since' },
        { status: 400 }
      )
    }

    // Converter string para data
    let since: Date
    try {
      since = new Date(sinceParam)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid date format for parameter: since' },
        { status: 400 }
      )
    }

    // Buscar usuário e empresa
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    })

    if (!user?.company) {
      return NextResponse.json(
        { error: 'User not associated with any company' },
        { status: 403 }
      )
    }

    const companyId = user.company.id

    // Buscar pedidos atualizados desde a data especificada
    const updatedOrders = await db.order.findMany({
      where: {
        companyId,
        OR: [
          { updatedAt: { gte: since } },
          { createdAt: { gte: since } }
        ]
      },
      include: {
        table: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit
    })

    // Converter para formato de notificações
    const notifications: any[] = []

    // Processar novos pedidos
    const newOrders = updatedOrders.filter(order => order.createdAt >= since)
    for (const order of newOrders) {
      notifications.push({
        type: 'new_order',
        orderId: order.id,
        companyId,
        timestamp: order.createdAt,
        data: {
          tableNumber: order.table?.number,
          customerName: order.customerName || undefined
        }
      })
    }

    // Processar mudanças de status de pedidos
    const updatedOrdersOnly = updatedOrders.filter(order => 
      order.createdAt < since && order.updatedAt >= since
    )
    
    for (const order of updatedOrdersOnly) {
      notifications.push({
        type: 'order_status_changed',
        orderId: order.id,
        companyId,
        timestamp: order.updatedAt,
        data: {
          newStatus: order.status,
          tableNumber: order.table?.number,
          customerName: order.customerName || undefined
        }
      })
    }

    // Buscar itens de pedido atualizados desde a data especificada
    const updatedItems = await db.orderItem.findMany({
      where: {
        order: {
          companyId
        },
        OR: [
          { updatedAt: { gte: since } },
          { createdAt: { gte: since } }
        ]
      },
      include: {
        product: true,
        order: {
          include: {
            table: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Processar mudanças de status de itens
    const updatedItemsOnly = updatedItems.filter(item => 
      item.createdAt < since && item.updatedAt >= since
    )
    
    for (const item of updatedItemsOnly) {
      notifications.push({
        type: 'order_status_changed',
        orderId: item.orderId,
        companyId,
        timestamp: item.updatedAt,
        data: {
          itemId: item.id,
          newStatus: item.status,
          itemName: item.product?.name || 'Unknown product',
          quantity: item.quantity,
          tableNumber: item.order?.table?.number,
          customerName: item.order?.customerName || undefined
        }
      })
    }

    // Ordenar notificações por timestamp (mais recente primeiro)
    notifications.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return dateB - dateA
    })

    // Limitar número de notificações
    const limitedNotifications = notifications.slice(0, limit)

    return NextResponse.json(limitedNotifications)
  } catch (error) {
    console.error('Error fetching missed notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}