import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function corrigirCategorias() {
  // Corrige para 'lanche' e 'acompanhamento' (case-insensitive)
  const produtos = await prisma.product.findMany()
  for (const produto of produtos) {
    let novaCategoria = produto.category.trim().toLowerCase()
    if (novaCategoria.includes('lanche')) novaCategoria = 'lanche'
    else if (novaCategoria.includes('acompanhamento')) novaCategoria = 'acompanhamento'
    else continue // ignora outros
    if (produto.category !== novaCategoria) {
      await prisma.product.update({
        where: { id: produto.id },
        data: { category: novaCategoria }
      })
      console.log(`Produto ${produto.name} corrigido para categoria: ${novaCategoria}`)
    }
  }
  await prisma.$disconnect()
}

corrigirCategorias()
