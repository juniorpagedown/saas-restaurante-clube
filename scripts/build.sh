#!/bin/bash

# Script de build com verificação de variáveis de ambiente

echo "🔍 Verificando variáveis de ambiente..."

# Definir fallbacks para produção
export NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-${NEXTAUTH_URL:-"https://saas-restaurante-clube.vercel.app"}}

echo "✅ NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"
echo "✅ NEXTAUTH_URL: $NEXTAUTH_URL"

# Gerar Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate

# Build da aplicação
echo "🏗️ Fazendo build da aplicação..."
npx next build

echo "✅ Build concluído com sucesso!"
