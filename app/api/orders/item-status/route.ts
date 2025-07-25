import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { orderItemId, newStatus } = body

    if (!orderItemId || !newStatus) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
    }

    // Buscar o item e o produto
    const orderItem = await db.orderItem.findUnique({
      where: { id: orderItemId },
      include: { product: true }
    })

    if (!orderItem) {
      return NextResponse.json({ error: 'Item não encontrado.' }, { status: 404 })
    }

    // Só permite iniciar preparo se for lanche ou acompanhamento
    const allowedCategories = ['lanche', 'acompanhamento']
    if (newStatus === 'preparing' && !allowedCategories.includes(orderItem.product.category)) {
      return NextResponse.json({ error: 'Só é permitido iniciar preparo de lanches ou acompanhamentos.' }, { status: 403 })
    }

    // Atualiza o status
    const updated = await db.orderItem.update({
      where: { id: orderItemId },
      data: { status: newStatus }
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar status do item:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
