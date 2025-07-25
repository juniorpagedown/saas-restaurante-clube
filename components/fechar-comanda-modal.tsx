'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CreditCard, DollarSign, Plus, Trash2, Check } from 'lucide-react'

interface Order {
  id: string
  customerName?: string | null
  table?: { number: number } | null
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
    notes?: string | null
  }>
}

interface PagamentoForm {
  formaPagamento: string
  valor: number
}

interface FecharComandaModalProps {
  order: Order
  onClose: () => void
  onSuccess: () => void
}

const formasPagamento = [
  { valor: 'dinheiro', label: 'Dinheiro' },
  { valor: 'cartao', label: 'Cartão' },
  { valor: 'pix', label: 'PIX' },
  { valor: 'vale', label: 'Vale' },
  { valor: 'credito', label: 'Crédito' },
  { valor: 'debito', label: 'Débito' }
]

export function FecharComandaModal({ order, onClose, onSuccess }: FecharComandaModalProps) {
  const [pagamentos, setPagamentos] = useState<PagamentoForm[]>([
    { formaPagamento: 'dinheiro', valor: 0 }
  ])
  const [observacoes, setObservacoes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Calcular total da comanda
  const totalComanda = order.items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)

  // Calcular total dos pagamentos
  const totalPagamentos = pagamentos.reduce((total, pagamento) => {
    return total + (pagamento.valor || 0)
  }, 0)

  const adicionarPagamento = () => {
    setPagamentos([...pagamentos, { formaPagamento: 'dinheiro', valor: 0 }])
  }

  const removerPagamento = (index: number) => {
    if (pagamentos.length > 1) {
      setPagamentos(pagamentos.filter((_, i) => i !== index))
    }
  }

  const atualizarPagamento = (index: number, campo: keyof PagamentoForm, valor: any) => {
    const novosPagamentos = [...pagamentos]
    novosPagamentos[index] = { ...novosPagamentos[index], [campo]: valor }
    setPagamentos(novosPagamentos)
  }

  const preencherValorTotal = () => {
    if (pagamentos.length === 1) {
      const novosPagamentos = [...pagamentos]
      novosPagamentos[0].valor = totalComanda
      setPagamentos(novosPagamentos)
    }
  }

  const fecharComanda = async () => {
    setLoading(true)
    setError('')

    try {
      // Validações
      if (Math.abs(totalPagamentos - totalComanda) > 0.01) {
        setError(`Valor dos pagamentos (R$ ${totalPagamentos.toFixed(2)}) não confere com o total (R$ ${totalComanda.toFixed(2)})`)
        setLoading(false)
        return
      }

      for (const pagamento of pagamentos) {
        if (!pagamento.formaPagamento || pagamento.valor <= 0) {
          setError('Todos os pagamentos devem ter forma e valor válidos')
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/comandas/fechar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: order.id,
          pagamentos: pagamentos.map(p => ({
            formaPagamento: p.formaPagamento,
            valor: Number(p.valor)
          })),
          observacoes: observacoes.trim() || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao fechar comanda')
        setLoading(false)
        return
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao fechar comanda:', error)
      setError('Erro interno. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fechar Comanda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo da Comanda */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {order.table ? `Mesa ${order.table.number}` : 'Balcão'}
                {order.customerName && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    - {order.customerName}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.product.name}
                      {item.notes && (
                        <span className="text-gray-500 ml-1">({item.notes})</span>
                      )}
                    </span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>R$ {totalComanda.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formas de Pagamento */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Formas de Pagamento</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={preencherValorTotal}
                >
                  Preencher Total
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pagamentos.map((pagamento, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Forma de Pagamento</Label>
                      <select
                        value={pagamento.formaPagamento}
                        onChange={(e) => atualizarPagamento(index, 'formaPagamento', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        {formasPagamento.map(forma => (
                          <option key={forma.valor} value={forma.valor}>
                            {forma.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <Label>Valor</Label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pagamento.valor || ''}
                        onChange={(e) => atualizarPagamento(index, 'valor', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border rounded-md"
                        placeholder="0,00"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerPagamento(index)}
                      disabled={pagamentos.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={adicionarPagamento}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Forma de Pagamento
                </Button>

                {/* Resumo dos Pagamentos */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Total dos Pagamentos:</span>
                    <span className={totalPagamentos === totalComanda ? 'text-green-600' : 'text-red-600'}>
                      R$ {totalPagamentos.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total da Comanda:</span>
                    <span>R$ {totalComanda.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                    <span>Diferença:</span>
                    <span className={Math.abs(totalPagamentos - totalComanda) < 0.01 ? 'text-green-600' : 'text-red-600'}>
                      R$ {(totalPagamentos - totalComanda).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Observações sobre o fechamento da comanda..."
            />
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={fecharComanda} 
              disabled={loading || Math.abs(totalPagamentos - totalComanda) > 0.01}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                'Fechando...'
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Fechar Comanda
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function FecharComandaButton({ order, onSuccess }: { order: Order, onSuccess: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        size="sm"
        className="bg-green-600 hover:bg-green-700"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Fechar Comanda
      </Button>
      
      {open && (
        <FecharComandaModal
          order={order}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
