export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getUserContext } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const userContext = await getUserContext()
    
    if (!userContext || !userContext.company) {
      return NextResponse.json({ error: 'Usuário não autenticado ou não vinculado a uma empresa.' }, { status: 401 })
    }

    // Verificar se o usuário tem permissão para ver comandas fechadas
    const permissoesVer = ['caixa', 'gerente', 'admin']
    if (!permissoesVer.includes(userContext.role)) {
      return NextResponse.json({ 
        error: 'Usuário não tem permissão para visualizar comandas fechadas.' 
      }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const responsavelId = searchParams.get('responsavelId')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      companyId: userContext.company.id
    }

    // Filtro por data
    if (dataInicio || dataFim) {
      where.dataFechamento = {}
      if (dataInicio) {
        where.dataFechamento.gte = new Date(dataInicio + 'T00:00:00.000Z')
      }
      if (dataFim) {
        where.dataFechamento.lte = new Date(dataFim + 'T23:59:59.999Z')
      }
    }

    // Filtro por responsável
    if (responsavelId) {
      where.responsavelId = responsavelId
    }

    // Buscar comandas fechadas com paginação
    const [comandasFechadas, total] = await Promise.all([
      db.comandaFechada.findMany({
        where,
        include: {
          pagamentos: true,
          responsavel: {
            select: {
              id: true,
              name: true
            }
          },
          mesa: {
            select: {
              number: true
            }
          },
          order: {
            select: {
              id: true,
              customerName: true
            }
          }
        },
        orderBy: {
          dataFechamento: 'desc'
        },
        skip,
        take: limit
      }),
      db.comandaFechada.count({
        where
      })
    ])

    // Mapear para o formato esperado
    const comandas = comandasFechadas.map((comanda: any) => ({
      id: comanda.id,
      orderId: comanda.orderId,
      valorTotal: comanda.valorTotal,
      dataFechamento: comanda.dataFechamento.toISOString(),
      mesa: comanda.mesa?.number || 0,
      customerName: comanda.order?.customerName || '',
      responsavel: {
        id: comanda.responsavel?.id || '',
        name: comanda.responsavel?.name || 'Usuário não encontrado'
      },
      pagamentos: comanda.pagamentos.map((p: any) => ({
        id: p.id,
        formaPagamento: p.formaPagamento,
        valor: p.valor
      })),
      observacoes: comanda.observacoes,
      createdAt: comanda.createdAt.toISOString(),
      updatedAt: comanda.updatedAt.toISOString()
    }))

    // Calcular informações de paginação
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      comandas,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    })

  } catch (error) {
    console.error('Erro ao buscar comandas fechadas:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor.' 
    }, { status: 500 })
  }
}