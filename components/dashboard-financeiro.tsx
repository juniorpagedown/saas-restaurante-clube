'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Calendar,
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  Clock,
  FileText,
  Filter
} from 'lucide-react'

interface ResumoFinanceiro {
  data: string
  resumoGeral: {
    totalGeral: number
    totalComandas: number
    ticketMedio: number
  }
  resumoPorFormaPagamento: Array<{
    formaPagamento: string
    valor: number
    percentual: number
  }>
  resumoPorResponsavel: Array<{
    responsavelId: string
    nome: string
    total: number
    comandas: number
    ticketMedio: number
  }>
  resumoPorHora: Array<{
    hora: string
    valor: number
  }>
  comandas: Array<{
    id: string
    valorTotal: number
    dataFechamento: string
    mesa: number | null
    responsavel: string
    pagamentos: Array<{
      formaPagamento: string
      valor: number
    }>
  }>
}

export function DashboardFinanceiro() {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null)
  const [dataEscolhida, setDataEscolhida] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const carregarResumo = async (data: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/comandas/resumo-diario?data=${data}`)
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Erro ao carregar resumo')
        setLoading(false)
        return
      }

      setResumo(result)
    } catch (error) {
      console.error('Erro ao carregar resumo:', error)
      setError('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarResumo(dataEscolhida)
  }, [dataEscolhida])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarDataHora = (dataString: string) => {
    return new Date(dataString).toLocaleString('pt-BR')
  }

  const getCorFormaPagamento = (forma: string) => {
    const cores: { [key: string]: string } = {
      'dinheiro': 'bg-green-100 text-green-800',
      'cartao': 'bg-blue-100 text-blue-800',
      'pix': 'bg-purple-100 text-purple-800',
      'vale': 'bg-orange-100 text-orange-800',
      'credito': 'bg-indigo-100 text-indigo-800',
      'debito': 'bg-gray-100 text-gray-800'
    }
    return cores[forma] || 'bg-gray-100 text-gray-800'
  }

  const getHoraMaisMovimentada = () => {
    if (!resumo || !resumo.resumoPorHora || resumo.resumoPorHora.length === 0) return null
    return resumo.resumoPorHora.reduce((prev, curr) => 
      curr.valor > prev.valor ? curr : prev
    )
  }

  const getResponsavelDestaque = () => {
    if (!resumo || !resumo.resumoPorResponsavel || resumo.resumoPorResponsavel.length === 0) return null
    return resumo.resumoPorResponsavel.reduce((prev, curr) => 
      curr.total > prev.total ? curr : prev
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dados financeiros...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <p className="text-gray-600">Acompanhe o desempenho financeiro do seu estabelecimento</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={dataEscolhida}
            onChange={(e) => setDataEscolhida(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {!resumo ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum dado encontrado
          </h3>
          <p className="text-gray-500">
            Não foram encontradas comandas fechadas para esta data.
          </p>
        </div>
      ) : (
        <>
          {/* Cards de Resumo Geral */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatarMoeda(resumo.resumoGeral.totalGeral)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comandas Fechadas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumo.resumoGeral.totalComandas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatarMoeda(resumo.resumoGeral.ticketMedio)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hora Pico</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getHoraMaisMovimentada()?.hora || '--:--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getHoraMaisMovimentada() && formatarMoeda(getHoraMaisMovimentada()!.valor)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Resumo por Forma de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumo.resumoPorFormaPagamento.map((forma, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCorFormaPagamento(forma.formaPagamento)}>
                        {forma.formaPagamento.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">{forma.percentual}%</span>
                    </div>
                    <div className="text-xl font-bold">{formatarMoeda(forma.valor)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo por Responsável */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumo.resumoPorResponsavel.map((responsavel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium">{responsavel.nome}</div>
                        <div className="text-sm text-gray-500">
                          {responsavel.comandas} comandas • Ticket médio: {formatarMoeda(responsavel.ticketMedio)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatarMoeda(responsavel.total)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Comandas */}
          <Card>
            <CardHeader>
              <CardTitle>Comandas do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumo.comandas.map((comanda, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">
                          {comanda.mesa ? `Mesa ${comanda.mesa}` : 'Balcão'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatarDataHora(comanda.dataFechamento)} • {comanda.responsavel}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {formatarMoeda(comanda.valorTotal)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {comanda.pagamentos.map((pagamento, pagIndex) => (
                        <Badge 
                          key={pagIndex}
                          className={getCorFormaPagamento(pagamento.formaPagamento)}
                        >
                          {pagamento.formaPagamento}: {formatarMoeda(pagamento.valor)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
