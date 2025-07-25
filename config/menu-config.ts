import { 
  LayoutDashboard,
  Table,
  ShoppingCart,
  Package,
  BarChart3,
  ChefHat,
  Users,
  Settings,
  UserCheck,
  DollarSign
} from 'lucide-react'

export interface MenuItem {
  title: string
  href: string
  icon: any
  roles?: string[]
  description?: string
  badge?: string
}

/**
 * Configuração centralizada dos itens do menu
 * Facilita manutenção e adição de novos itens
 */
export const MENU_CONFIG = {
  // Itens base (aparecem em todos os segmentos)
  base: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral do sistema'
    },
  ] as MenuItem[],

  // Itens específicos para restaurantes
  restaurant: [
    {
      title: 'Garçom',
      href: '/dashboard/garcom',
      icon: Users,
      roles: ['garcom', 'gerente', 'admin'],
      description: 'Área do garçom - Atendimento e pedidos'
    },
    {
      title: 'Cozinha',
      href: '/dashboard/cozinha',
      icon: ChefHat,
      roles: ['cozinha', 'gerente', 'admin'],
      description: 'Gerenciamento da cozinha - Preparo dos pedidos'
    },
    {
      title: 'Mesas',
      href: '/dashboard/tables',
      icon: Table,
      roles: ['garcom', 'gerente', 'admin'],
      description: 'Controle e status das mesas'
    },
    {
      title: 'Produtos',
      href: '/dashboard/products',
      icon: Package,
      roles: ['gerente', 'admin'],
      description: 'Catálogo e gestão de produtos'
    },
    {
      title: 'Financeiro',
      href: '/dashboard/financeiro',
      icon: DollarSign,
      roles: ['caixa', 'gerente', 'admin'],
      description: 'Relatórios e controle financeiro'
    },
    {
      title: 'Relatórios',
      href: '/dashboard/reports',
      icon: BarChart3,
      roles: ['gerente', 'admin'],
      description: 'Análises e relatórios gerenciais'
    },
  ] as MenuItem[],

  // Itens específicos para clubes
  club: [
    {
      title: 'Entradas',
      href: '/dashboard/entries',
      icon: UserCheck,
      roles: ['recepcionista', 'gerente', 'admin'],
      description: 'Controle de entrada de visitantes'
    },
    {
      title: 'Financeiro',
      href: '/dashboard/financeiro',
      icon: DollarSign,
      roles: ['caixa', 'gerente', 'admin'],
      description: 'Relatórios e controle financeiro'
    },
    {
      title: 'Relatórios',
      href: '/dashboard/reports',
      icon: BarChart3,
      roles: ['gerente', 'admin'],
      description: 'Análises e relatórios gerenciais'
    },
  ] as MenuItem[],

  // Itens administrativos
  admin: [
    {
      title: 'Administração',
      href: '/dashboard/admin',
      icon: Settings,
      roles: ['admin'],
      description: 'Configurações avançadas do sistema'
    },
  ] as MenuItem[],
}

/**
 * Mapas de roles para facilitar verificações
 */
export const ROLE_PERMISSIONS = {
  // Roles que podem ver relatórios financeiros
  canViewFinancial: ['caixa', 'gerente', 'admin'],
  
  // Roles que podem gerenciar produtos
  canManageProducts: ['gerente', 'admin'],
  
  // Roles que podem ver todos os relatórios
  canViewReports: ['gerente', 'admin'],
  
  // Roles administrativos
  isAdmin: ['admin'],
  
  // Roles operacionais
  isOperational: ['garcom', 'cozinha', 'recepcionista', 'caixa'],
} as const

/**
 * Função para obter itens do menu baseado no segmento e role
 */
export function getMenuItems(segment: string = 'restaurante', isAdmin: boolean = false): MenuItem[] {
  const baseItems = MENU_CONFIG.base
  const segmentItems = segment === 'clube' ? MENU_CONFIG.club : MENU_CONFIG.restaurant
  const adminItems = isAdmin ? MENU_CONFIG.admin : []

  return [...baseItems, ...segmentItems, ...adminItems]
}

/**
 * Função para verificar se um usuário pode acessar um item
 */
export function canUserAccessItem(userRole: string, item: MenuItem): boolean {
  if (!item.roles) return true // Se não tem restrição, todos podem acessar
  return item.roles.includes(userRole)
}

/**
 * Função para filtrar itens baseado no role do usuário
 */
export function getFilteredMenuItems(
  userRole: string, 
  segment: string = 'restaurante', 
  isAdmin: boolean = false
): MenuItem[] {
  const allItems = getMenuItems(segment, isAdmin)
  return allItems.filter(item => canUserAccessItem(userRole, item))
}
