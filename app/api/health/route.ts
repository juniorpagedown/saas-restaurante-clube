import { NextResponse } from 'next/server'

/**
 * API route para verificação de saúde da conexão
 * Usado pelo hook useConnectionStatus para medir latência
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}