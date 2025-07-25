import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { db } from './db'

export interface UserContext {
  id: string
  name: string
  email: string
  role: string
  isSaasAdmin: boolean
  company?: {
    id: string
    name: string
    segment: string
    plan: string
    maxTables: number
    maxUsers: number
    maxProducts: number
  }
}

export async function getUserContext(): Promise<UserContext | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { company: true }
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name || '',
    email: user.email,
    role: user.role,
    isSaasAdmin: user.isSaasAdmin,
    company: user.company ? {
      id: user.company.id,
      name: user.company.name,
      segment: user.company.segment,
      plan: user.company.plan,
      maxTables: user.company.maxTables,
      maxUsers: user.company.maxUsers,
      maxProducts: user.company.maxProducts
    } : undefined
  }
}

export function requireAuth(userContext: UserContext | null) {
  if (!userContext) {
    throw new Error('Unauthorized')
  }
  return userContext
}

export function requireCompany(userContext: UserContext) {
  if (!userContext.company && !userContext.isSaasAdmin) {
    throw new Error('Company required')
  }
  return userContext
}

export function requireSaasAdmin(userContext: UserContext) {
  if (!userContext.isSaasAdmin) {
    throw new Error('SaaS admin required')
  }
  return userContext
}

export function requireRole(userContext: UserContext, allowedRoles: string[]) {
  if (!allowedRoles.includes(userContext.role) && !userContext.isSaasAdmin) {
    throw new Error('Insufficient permissions')
  }
  return userContext
}