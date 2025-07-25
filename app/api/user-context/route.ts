export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getUserContext } from '@/lib/auth-utils'

export async function GET() {
  try {
    const userContext = await getUserContext()
    
    if (!userContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      role: userContext.role,
      isSaasAdmin: userContext.isSaasAdmin,
      company: userContext.company
    })
  } catch (error) {
    console.error('Erro ao buscar contexto do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}