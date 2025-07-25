
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Cache para prevenir duplos pedidos (em memória, poderia usar Redis em produção)
const recentOrders = new Map<string, Date>()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tableId, items, customerName, companyId } = body

    if (!tableId || !items || !Array.isArray(items) || items.length === 0 || !companyId) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
    }

    // Criar uma chave única para este pedido
    const orderKey = `${companyId}-${tableId}-${JSON.stringify(items)}-${customerName || 'no-customer'}`
    const now = new Date()
    
    // Verificar se já foi criado um pedido idêntico nos últimos 5 segundos
    if (recentOrders.has(orderKey)) {
      const lastOrder = recentOrders.get(orderKey)!
      if (now.getTime() - lastOrder.getTime() < 5000) { // 5 segundos
        console.log('Pedido duplicado detectado e bloqueado:', orderKey)
        return NextResponse.json({ error: 'Pedido duplicado detectado. Aguarde alguns segundos.' }, { status: 429 })
      }
    }

    // Registrar este pedido
    recentOrders.set(orderKey, now)

    // Limpar entradas antigas (opcional, para não acumular memória)
    const keysToDelete: string[] = []
    recentOrders.forEach((date, key) => {
      if (now.getTime() - date.getTime() > 10000) { // 10 segundos
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => recentOrders.delete(key))

    // Calcula o total do pedido
    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0)

    console.log('Criando pedido:', { tableId, companyId, customerName, total, itemsCount: items.length })

    // Cria o pedido
    const order = await db.order.create({
      data: {
        tableId,
        companyId,
        customerName,
        status: 'open',
        total,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number; notes?: string }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || ''
          }))
        }
      },
      include: {
        items: true
      }
    })

    console.log('Pedido criado com sucesso:', order.id)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

// PATCH para atualizar status do pedido
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
    }

    // Obter contexto do usuário
    const { getUserContext } = await import('@/lib/auth-utils')
    const userContext = await getUserContext()

    // Cozinha não pode fechar comanda/pedido
    if (userContext?.role === 'cozinha' && status === 'closed') {
      return NextResponse.json({ error: 'Cozinha não pode fechar comanda.' }, { status: 403 })
    }

    // Atualiza o status do pedido
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status },
    })

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
