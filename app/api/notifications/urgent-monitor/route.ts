import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'


/**
 * API route para controlar o monitor de itens urgentes
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação (apenas para admins)
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url || 'http://localhost')
    const action = url.searchParams.get('action')

    switch (action) {

      case 'status':
        return NextResponse.json({ error: 'Funcionalidade indisponível.' }, { status: 501 })


      case 'check':
        return NextResponse.json({ error: 'Funcionalidade indisponível.' }, { status: 501 })

      default:
        return NextResponse.json({ error: 'Funcionalidade indisponível.' }, { status: 501 })
    }
  } catch (error) {
    console.error('Error in urgent monitor API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação (apenas para admins)
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await req.json()

    switch (action) {

      case 'start':
        return NextResponse.json({ error: 'Funcionalidade indisponível.' }, { status: 501 })


      case 'stop':
        return NextResponse.json({ error: 'Funcionalidade indisponível.' }, { status: 501 })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "start" or "stop"' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error controlling urgent monitor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}