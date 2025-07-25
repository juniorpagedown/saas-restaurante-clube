'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Users,
  Crown,
  Building,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Shield
} from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  isSaasAdmin: boolean
  createdAt: Date
  company?: {
    name: string
    segment: string
  } | null
}

interface UsersManagerProps {
  users: User[]
  isSaasAdmin: boolean
}

export function UsersManager({ users, isSaasAdmin }: UsersManagerProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const getRoleColor = (role: string, isSaasAdmin: boolean) => {
    if (isSaasAdmin) return 'bg-purple-100 text-purple-800'
    
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'garcom': return 'bg-green-100 text-green-800'
      case 'caixa': return 'bg-yellow-100 text-yellow-800'
      case 'porteiro': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string, isSaasAdmin: boolean) => {
    if (isSaasAdmin) return 'SaaS Admin'
    
    switch (role) {
      case 'admin': return 'Administrador'
      case 'garcom': return 'Garçom'
      case 'caixa': return 'Caixa'
      case 'porteiro': return 'Porteiro'
      default: return role
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      })
      
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const activeUsers = users.filter(u => u.isActive)
  const inactiveUsers = users.filter(u => !u.isActive)
  const adminUsers = users.filter(u => u.role === 'admin' || u.isSaasAdmin)

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers.length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-purple-600">{adminUsers.length}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers.length}</p>
              </div>
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className={`flex items-center justify-between p-4 border rounded-lg ${!user.isActive ? 'bg-gray-50 opacity-75' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {user.name || 'Sem nome'}
                      </h3>
                      {user.isSaasAdmin && (
                        <Crown className="w-4 h-4 text-purple-600" />
                      )}
                      {!user.isActive && (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          Inativo
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email}
                      </div>
                      
                      {user.company && isSaasAdmin && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {user.company.name}
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getRoleColor(user.role, user.isSaasAdmin)}>
                    {getRoleText(user.role, user.isSaasAdmin)}
                  </Badge>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {user.isActive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, 'deactivate')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, 'activate')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição (placeholder) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue={selectedUser.name || ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Função
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue={selectedUser.role}
                  >
                    <option value="admin">Administrador</option>
                    <option value="garcom">Garçom</option>
                    <option value="caixa">Caixa</option>
                    <option value="porteiro">Porteiro</option>
                  </select>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1">
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}