import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware adicional pode ser adicionado aqui
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rotas que precisam de autenticação
        const protectedPaths = ['/dashboard']
        const { pathname } = req.nextUrl
        
        // Se a rota é protegida, verifica se tem token
        if (protectedPaths.some(path => pathname.startsWith(path))) {
          return !!token
        }
        
        // Outras rotas são públicas
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/stripe/:path*'
  ]
}