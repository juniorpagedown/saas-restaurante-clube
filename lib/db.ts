import { PrismaClient } from '@prisma/client'


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Criar instância do Prisma
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})



// Salvar instância no escopo global em desenvolvimento
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db