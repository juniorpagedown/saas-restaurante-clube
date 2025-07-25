'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { DashboardSidebar } from './dashboard-sidebar'

interface UserData {
  role: string
  isSaasAdmin: boolean
  company?: {
    name: string
    segment: string
    plan: string
  }
}

interface DashboardLayoutWithSidebarProps {
  children: React.ReactNode
}

export function DashboardLayoutWithSidebar({ children }: DashboardLayoutWithSidebarProps) {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
    segment: string
    plan: string
  }
}

interface DashboardLayoutWithSidebarProps {
  children: React.ReactNode
}

export function DashboardLayoutWithSidebar({ children }: DashboardLayoutWithSidebarProps) {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Acesso Restrito
          </h2>
          <p className="text-muted-foreground">
            Você precisa estar logado para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  // Se o usuário não tem empresa e não é SaaS admin, redirecionar para onboarding
  if (userData && !userData.company && !userData.isSaasAdmin) {
    window.location.href = '/onboarding'
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecionando para configuração...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <DashboardSidebar 
          userRole={userData?.role}
          companySegment={userData?.company?.segment}
          isAdmin={userData?.isSaasAdmin}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
