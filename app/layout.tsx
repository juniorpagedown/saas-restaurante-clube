import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'APEX - Sistema de Gestão Completo',
  description: 'Sistema completo para restaurantes e clubes - Controle mesas, pedidos, produtos e muito mais',
  keywords: 'restaurante, clube, gestão, mesas, pedidos, sistema, apex',
  authors: [{ name: 'APEX Team' }],
  openGraph: {
    title: 'APEX - Gestão de Restaurantes e Clubes',
    description: 'Controle de mesas, pedidos, entrada de visitantes e muito mais.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'APEX',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-white`}>
        <Providers>
          {/* Adicione aqui seu Header, Sidebar etc. */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
