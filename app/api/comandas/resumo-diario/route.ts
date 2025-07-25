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

    // Verificar se o usuário tem permissão para ver relatórios financeiros
    const permissoesRelatorio = ['caixa', 'gerente', 'admin']
    if (!permissoesRelatorio.includes(userContext.role)) {
      return NextResponse.json({ 
        error: 'Usuário não tem permissão para acessar relatórios financeiros.' 
      }, { status: 403 })
    }

    const { searchParams } = new URL(req.url || 'http://localhost')
    const data = searchParams.get('data') || new Date().toISOString().split('T')[0]

    // Definir o range de datas para o dia
    const startDate = new Date(data + 'T00:00:00.000Z')
    const endDate = new Date(data + 'T23:59:59.999Z')

    // Buscar comandas fechadas do dia
    const comandasFechadas = await db.comandaFechada.findMany({
      where: {
        companyId: userContext.company.id,
        dataFechamento: {
          gte: startDate,
          lte: endDate
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
      },
      orderBy: {
        dataFechamento: 'desc'
      }
    })

    // Calcular resumo geral
    const totalGeral = comandasFechadas.reduce((sum: number, comanda: any) => sum + comanda.valorTotal, 0)
    const totalComandas = comandasFechadas.length
    const ticketMedio = totalComandas > 0 ? totalGeral / totalComandas : 0

    // Calcular resumo por forma de pagamento
    const pagamentosPorForma: { [key: string]: number } = {}
    comandasFechadas.forEach(comanda => {
      comanda.pagamentos.forEach(pagamento => {
        if (!pagamentosPorForma[pagamento.formaPagamento]) {
          pagamentosPorForma[pagamento.formaPagamento] = 0
        }
        pagamentosPorForma[pagamento.formaPagamento] += pagamento.valor
      })
    })

    const resumoPorFormaPagamento = Object.entries(pagamentosPorForma).map(([forma, valor]) => ({
      formaPagamento: forma,
      valor,
      percentual: totalGeral > 0 ? (valor / totalGeral) * 100 : 0
    }))

    // Calcular resumo por responsável
    const resumoPorResponsavelMap: { [key: string]: { nome: string, total: number, comandas: number } } = {}
    comandasFechadas.forEach(comanda => {
      const responsavelId = comanda.responsavelId
      const responsavelNome = comanda.responsavel?.name || 'Usuário não encontrado'
      
      if (!resumoPorResponsavelMap[responsavelId]) {
        resumoPorResponsavelMap[responsavelId] = {
          nome: responsavelNome,
          total: 0,
          comandas: 0
        }
      }
      
      resumoPorResponsavelMap[responsavelId].total += comanda.valorTotal
      resumoPorResponsavelMap[responsavelId].comandas += 1
    })

    const resumoPorResponsavel = Object.entries(resumoPorResponsavelMap).map(([responsavelId, dados]) => ({
      responsavelId,
      nome: dados.nome,
      total: dados.total,
      comandas: dados.comandas,
      ticketMedio: dados.comandas > 0 ? dados.total / dados.comandas : 0
    }))

    // Calcular resumo por hora
    const resumoPorHoraMap: { [key: string]: number } = {}
    comandasFechadas.forEach(comanda => {
      const hora = new Date(comanda.dataFechamento).getHours()
      const horaFormatada = `${hora.toString().padStart(2, '0')}:00`
      
      if (!resumoPorHoraMap[horaFormatada]) {
        resumoPorHoraMap[horaFormatada] = 0
      }
      resumoPorHoraMap[horaFormatada] += comanda.valorTotal
    })

    const resumoPorHora = Object.entries(resumoPorHoraMap)
      .map(([hora, valor]) => ({ hora, valor }))
      .sort((a, b) => a.hora.localeCompare(b.hora))

    // Mapear comandas para o formato esperado
    const comandas = comandasFechadas.map(comanda => ({
      id: comanda.id,
      valorTotal: comanda.valorTotal,
      dataFechamento: comanda.dataFechamento.toISOString(),
      mesa: comanda.mesa?.number || 0,
      responsavel: comanda.responsavel?.name || 'Usuário não encontrado',
      pagamentos: comanda.pagamentos.map(p => ({
        formaPagamento: p.formaPagamento,
        valor: p.valor
      }))
    }))

    const resumo = {
      data,
      resumoGeral: {
        totalGeral,
        totalComandas,
        ticketMedio
      },
      resumoPorFormaPagamento,
      resumoPorResponsavel,
      resumoPorHora,
      comandas
    }

    return NextResponse.json(resumo)

  } catch (error) {
    console.error('Erro ao gerar resumo financeiro diário:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor.' 
    }, { status: 500 })
  }
}
