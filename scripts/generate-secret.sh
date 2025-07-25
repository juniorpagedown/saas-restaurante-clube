#!/bin/bash

# Script para gerar um NEXTAUTH_SECRET seguro
echo "Gerando NEXTAUTH_SECRET..."
echo ""

# Gera um secret de 32 bytes em base64
SECRET=$(openssl rand -base64 32)

echo "NEXTAUTH_SECRET gerado:"
echo "NEXTAUTH_SECRET=\"$SECRET\""
echo ""
echo "Adicione esta variável de ambiente no seu arquivo .env.local e no Vercel:"
echo "1. No Vercel Dashboard > Settings > Environment Variables"
echo "2. Adicione: NEXTAUTH_SECRET = $SECRET"
echo ""
