'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { TopNavigation } from './top-navigation'

interface UserData {
  role: string
  isSaasAdmin: boolean
  company?: {
    name: string
    segment: string
    plan: string
  }
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user-context')
        .then(res => res.json())
        .then(data => {
          setUserData(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Erro ao carregar dados do usuário:', error)
          setLoading(false)
        })
    } else if (status !== 'loading') {
      setLoading(false)
    }
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* TopNavigation já é exibido no layout principal */}
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* TopNavigation já é exibido no layout principal */}
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Você precisa estar logado para acessar esta página.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Se o usuário não tem empresa e não é SaaS admin, redirecionar para onboarding
  if (userData && !userData.company && !userData.isSaasAdmin) {
    window.location.href = '/onboarding'
    return (
      <div className="min-h-screen bg-gray-50">
        {/* TopNavigation já é exibido no layout principal */}
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecionando para configuração...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        companyName={userData?.company?.name || 'Minha Empresa'}
        user={{ name: session.user?.name || 'Usuário', avatarUrl: session.user?.image || '' }}
        plan={userData?.company?.plan || 'Free'}
        active={window.location.pathname}
      />
      
      <main className="pt-20 px-6">
        {children}
      </main>
    </div>
  )
}