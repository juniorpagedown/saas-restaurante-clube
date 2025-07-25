'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ApexLogo } from './apex-logo'
import { Menu, X, User, Crown, Building } from 'lucide-react'
import { useState, useEffect } from 'react'

interface UserData {
  role: string
  isSaasAdmin: boolean
  company?: {
    name: string
    segment: string
    plan: string
  }
}

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user-context')
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(console.error)
    }
  }, [session])

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href={session ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
              <ApexLogo size="md" />
            </Link>
            
            {session && userData && (
              <div className="hidden md:flex items-center space-x-2">
                {userData.isSaasAdmin ? (
                  <Badge className="bg-purple-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    SaaS Admin
                  </Badge>
                ) : userData.company && (
                  <Badge variant="outline" className="text-xs">
                    <Building className="w-3 h-3 mr-1" />
                    {userData.company.name}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link href="/dashboard/garcom" className="text-gray-700 hover:text-primary-600">
                  Garçom
                </Link>
                <Link href="/dashboard/cozinha" className="text-gray-700 hover:text-primary-600">
                  Cozinha
                </Link>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  size="sm"
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => signIn()}>
                  Entrar
                </Button>
                <Button onClick={() => signIn()}>
                  Começar Grátis
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up">
            {!session && (
              <>
                <Link
                  href="/pricing"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Preços
                </Link>
                <Link
                  href="/features"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recursos
                </Link>
              </>
            )}
            
            {session ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-gray-600 border-b">
                  Olá, {session.user?.name}
                </div>
                {session && userData && userData.isSaasAdmin && (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard SaaS
                    </Button>
                  </Link>
                )}
                <Link
                  href="/dashboard/garcom"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Garçom
                </Link>
                <Link
                  href="/dashboard/cozinha"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cozinha
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start"
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    signIn()
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => {
                    signIn()
                    setIsMenuOpen(false)
                  }}
                  className="w-full"
                >
                  Começar Grátis
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}