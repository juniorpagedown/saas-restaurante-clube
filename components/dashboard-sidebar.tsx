'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'
import { getFilteredMenuItems, type MenuItem } from '@/config/menu-config'

interface DashboardSidebarProps {
  userRole?: string
  companySegment?: string
  isAdmin?: boolean
}

export function DashboardSidebar({ userRole, companySegment, isAdmin }: DashboardSidebarProps) {
  const pathname = usePathname()
  
  // Obter itens do menu filtrados para o usuário atual
  const menuItems = getFilteredMenuItems(
    userRole || 'user', 
    companySegment || 'restaurante', 
    isAdmin || false
  )

  return (
    <div className="flex flex-col h-full bg-card border-r border-border shadow-sm">
      {/* Header da Sidebar */}
      <div className="flex items-center px-4 py-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">APEX</h2>
            <p className="text-xs text-muted-foreground capitalize">{companySegment || 'restaurante'}</p>
          </div>
        </div>
      </div>

      {/* Navegação Principal */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  'hover:bg-surface-hover hover:translate-x-1',
                  isActive
                    ? 'bg-accent/10 text-accent border-l-4 border-accent shadow-sm'
                    : 'text-foreground hover:text-foreground'
                )}
                title={item.description}
              >
                <item.icon className={cn(
                  'mr-3 h-5 w-5 transition-colors duration-200',
                  isActive 
                    ? 'text-accent' 
                    : 'text-muted-foreground group-hover:text-foreground'
                )} />
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-destructive/10 text-destructive rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Informações do Usuário */}
      <div className="p-3 border-t border-border bg-muted">
        <div className="mb-3 px-3 py-2 bg-card rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">Usuário atual</p>
          <p className="text-sm font-medium text-foreground capitalize">{userRole || 'Usuário'}</p>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  )
}