'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Settings,
  Building,
  Users,
  CreditCard,
  Bell,
  Shield,
  Database,
  Trash2,
  Save,
  AlertTriangle
} from 'lucide-react'

interface Company {
  id: string
  name: string
  segment: string
  plan: string
  email?: string | null
  phone?: string | null
  address?: string | null
  maxTables: number
  maxUsers: number
  maxProducts: number
  isActive: boolean
}

interface AdminSettingsProps {
  company: Company | null
  userContext: any
}

export function AdminSettings({ company, userContext }: AdminSettingsProps) {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    email: company?.email || '',
    phone: company?.phone || '',
    address: company?.address || '',
    maxTables: company?.maxTables || 10,
    maxUsers: company?.maxUsers || 5,
    maxProducts: company?.maxProducts || 50
  })

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Configurações salvas com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleDangerousAction = async (action: string) => {
    const confirmations = {
      'reset-data': 'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita!',
      'reset-orders': 'Tem certeza que deseja limpar todos os pedidos?',
      'backup': 'Deseja fazer backup dos dados?'
    }

    if (confirm(confirmations[action as keyof typeof confirmations])) {
      try {
        const response = await fetch('/api/admin/dangerous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        })
        
        if (response.ok) {
          alert('Ação executada com sucesso!')
          window.location.reload()
        }
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao executar ação')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações da Empresa */}
      {company && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segmento
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  value={company.segment}
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Limites do Plano */}
      {company && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Limites do Plano
              <Badge className="ml-2 bg-blue-100 text-blue-800">
                {company.plan.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Mesas
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.maxTables}
                  onChange={(e) => setFormData({...formData, maxTables: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Usuários
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.maxUsers}
                  onChange={(e) => setFormData({...formData, maxUsers: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Produtos
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.maxProducts}
                  onChange={(e) => setFormData({...formData, maxProducts: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configurações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Configurações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Notificar novos pedidos
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Alertas de pedidos antigos
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Relatórios diários por email
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Segurança
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Backup automático
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Log de atividades
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Autenticação em dois fatores
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Perigosas */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => handleDangerousAction('reset-orders')}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Pedidos
            </Button>
            
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => handleDangerousAction('backup')}
            >
              <Database className="w-4 h-4 mr-2" />
              Fazer Backup
            </Button>
            
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => handleDangerousAction('reset-data')}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Tudo
            </Button>
          </div>
          
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            ⚠️ Atenção: Estas ações são irreversíveis. Use com extrema cautela.
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  )
}