import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { companyName, segment, phone, address } = await req.json()

    if (!companyName || !segment) {
      return NextResponse.json({ error: 'Nome da empresa e segmento são obrigatórios' }, { status: 400 })
    }

    // Criar empresa
    const company = await db.company.create({
      data: {
        name: companyName,
        segment,
        phone,
        address,
        email: session.user.email,
      }
    })

    // Atualizar usuário como admin da empresa
    await db.user.update({
      where: { email: session.user.email },
      data: {
        companyId: company.id,
        role: 'admin'
      }
    })

    // Criar dados iniciais baseado no segmento
    if (segment === 'restaurante') {
      // Criar algumas mesas padrão
      const tables = []
      for (let i = 1; i <= 10; i++) {
        tables.push({
          number: i,
          capacity: 4,
          companyId: company.id
        })
      }
      await db.table.createMany({ data: tables })

      // Criar algumas categorias de produtos padrão
      const products = [
        { name: 'Água', price: 3.00, category: 'Bebidas', companyId: company.id },
        { name: 'Refrigerante', price: 5.00, category: 'Bebidas', companyId: company.id },
        { name: 'Hambúrguer', price: 25.00, category: 'Lanches', companyId: company.id },
        { name: 'Batata Frita', price: 12.00, category: 'Acompanhamentos', companyId: company.id },
      ]
      await db.product.createMany({ data: products })
    }

    return NextResponse.json({ success: true, company })
  } catch (error) {
    console.error('Erro no onboarding:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}