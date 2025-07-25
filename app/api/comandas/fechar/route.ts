import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserContext } from '@/lib/auth-utils'

interface PagamentoInput {
  formaPagamento: string
  valor: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, pagamentos, observacoes }: {
      orderId: string
      pagamentos: PagamentoInput[]
      observacoes?: string
    } = body

    if (!orderId || !pagamentos || !Array.isArray(pagamentos) || pagamentos.length === 0) {
      return NextResponse.json({ 
        error: 'Dados inválidos. É necessário informar o pedido e pelo menos uma forma de pagamento.' 
      }, { status: 400 })
    }

    // Obter contexto do usuário
    const userContext = await getUserContext()
    
    if (!userContext) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 })
    }

    // Verificar se o usuário tem permissão para fechar comandas
    const permissoesParaFechar = ['caixa', 'gerente', 'admin', 'garcom']
    if (!permissoesParaFechar.includes(userContext.role)) {
      return NextResponse.json({ 
        error: 'Usuário não tem permissão para fechar comandas.' 
      }, { status: 403 })
    }

    // Verificar se o pedido existe
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
    }

    if (order.status === 'closed') {
      return NextResponse.json({ error: 'Esta comanda já foi fechada.' }, { status: 400 })
    }

    // Calcular valor total do pedido
    const valorTotal = order.items.reduce((total: number, item: {
      price: number;
      quantity: number;
    }) => {
      return total + (item.price * item.quantity)
    }, 0)

    // Verificar se o valor dos pagamentos bate com o total
    const valorPagamentos = pagamentos.reduce((total: number, pagamento: PagamentoInput) => {
      return total + parseFloat(pagamento.valor.toString())
    }, 0)

    if (Math.abs(valorPagamentos - valorTotal) > 0.01) { // tolerância de 1 centavo
      return NextResponse.json({ 
        error: `Valor dos pagamentos (R$ ${valorPagamentos.toFixed(2)}) não confere com o total do pedido (R$ ${valorTotal.toFixed(2)}).` 
      }, { status: 400 })
    }

    // Validar formas de pagamento
    const formasPermitidas = ['dinheiro', 'cartao', 'pix', 'vale', 'credito', 'debito']
    for (const pagamento of pagamentos) {
      if (!formasPermitidas.includes(pagamento.formaPagamento)) {
        return NextResponse.json({ 
          error: `Forma de pagamento '${pagamento.formaPagamento}' não é válida.` 
        }, { status: 400 })
      }
      if (parseFloat(pagamento.valor.toString()) <= 0) {
        return NextResponse.json({ 
          error: 'Todos os valores de pagamento devem ser maiores que zero.' 
        }, { status: 400 })
      }
    }

    // Usar transação para garantir consistência
    const result = await db.$transaction(async (prisma) => {
      // Criar registro de comanda fechada
      const comandaFechada = await prisma.comandaFechada.create({
        data: {
          orderId,
          valorTotal,
          responsavelId: userContext.id,
          companyId: userContext.company!.id,
          mesaId: order.tableId,
          observacoes: observacoes || null,
          pagamentos: {
            create: pagamentos.map(pagamento => ({
              formaPagamento: pagamento.formaPagamento,
              valor: parseFloat(pagamento.valor.toString())
            }))
          }
        },
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
          }
        }
      })

      // Atualizar status do pedido
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'closed' }
      })

      return comandaFechada
    })

    return NextResponse.json({
      message: 'Comanda fechada com sucesso!',
      data: {
        id: result.id,
        orderId: result.orderId,
        valorTotal: result.valorTotal,
        dataFechamento: result.dataFechamento.toISOString(),
        mesa: result.mesa?.number || 0,
        responsavel: {
          id: result.responsavel.id,
          name: result.responsavel.name || 'Usuário não encontrado'
        },
        pagamentos: result.pagamentos.map(p => ({
          id: p.id,
          formaPagamento: p.formaPagamento,
          valor: p.valor
        })),
        observacoes: result.observacoes
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Erro ao fechar comanda:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor.' 
    }, { status: 500 })
  }
}
