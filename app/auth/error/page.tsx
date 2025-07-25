import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'Erro de configuração do servidor. Tente novamente mais tarde.'
      case 'AccessDenied':
        return 'Acesso negado. Você não tem permissão para acessar este recurso.'
      case 'Verification':
        return 'Token de verificação inválido ou expirado.'
      default:
        return 'Ocorreu um erro durante a autenticação. Tente novamente.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Erro de Autenticação
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error ? getErrorMessage(error) : 'Erro desconhecido'}
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/auth/signin">
            <Button className="w-full">
              Tentar Novamente
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}