import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { OnboardingForm } from '@/components/onboarding-form'

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  // Verificar se usuário já tem empresa
  const user = await db.user.findUnique({
    where: { email: session.user?.email || '' },
    include: { company: true }
  })

  if (user?.company) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Configure sua empresa
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vamos configurar sua conta para começar
          </p>
        </div>
        
        <OnboardingForm user={user} />
      </div>
    </div>
  )
}