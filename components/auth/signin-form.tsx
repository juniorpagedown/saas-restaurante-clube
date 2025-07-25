'use client'

import { signIn, getProviders } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Chrome, Github, Loader2 } from 'lucide-react'

export function SignInForm() {
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const handleSignIn = async (providerId: string) => {
    setLoading(providerId)
    try {
      await signIn(providerId, { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Erro no login:', error)
    } finally {
      setLoading(null)
    }
  }

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return <Chrome className="w-5 h-5" />
      case 'github':
        return <Github className="w-5 h-5" />
      default:
        return null
    }
  }

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'Google'
      case 'github':
        return 'GitHub'
      default:
        return providerId
    }
  }

  if (!providers) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Escolha como entrar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(providers).map((provider: any) => (
          <Button
            key={provider.name}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 h-12"
            onClick={() => handleSignIn(provider.id)}
            disabled={loading === provider.id}
          >
            {loading === provider.id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {getProviderIcon(provider.id)}
                <span>Continuar com {getProviderName(provider.id)}</span>
              </>
            )}
          </Button>
        ))}
        
        <div className="text-center text-sm text-gray-500 mt-6">
          Ao continuar, você concorda com nossos{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Termos de Uso
          </a>{' '}
          e{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Política de Privacidade
          </a>
        </div>
      </CardContent>
    </Card>
  )
}