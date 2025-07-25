import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Log para debug no Vercel
  console.log('🔍 [Middleware Debug]', {
    url: request.url,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    headers: Object.fromEntries(request.headers.entries()),
    env: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***SET***' : 'NOT_SET',
    }
  })

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
