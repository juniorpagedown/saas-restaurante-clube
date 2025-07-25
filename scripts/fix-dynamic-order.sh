#!/bin/bash

echo "🔧 Corrigindo ordem das diretivas 'use client' e dynamic..."

# Encontrar todos os arquivos page.tsx
find /Users/lindomarjunior/Downloads/Projetos/saas-restaurante-clube/app -name "page.tsx" -type f | while read file; do
  # Verificar se tem 'use client' e dynamic na ordem errada
  if grep -q "export const dynamic" "$file" && grep -q "'use client'" "$file"; then
    echo "📄 Verificando ordem em: $file"
    
    # Verificar se dynamic vem antes de 'use client'
    if grep -n -A1 "export const dynamic" "$file" | grep -q "'use client'"; then
      echo "⚠️ Ordem incorreta detectada em: $file"
      
      # Remover as linhas antigas
      grep -v "export const dynamic = 'force-dynamic'" "$file" > "${file}.tmp"
      
      # Encontrar a linha do 'use client' e adicionar dynamic depois
      sed -i.bak "/'use client'/a\\
export const dynamic = 'force-dynamic'\\
" "${file}.tmp"
      
      rm "${file}.tmp.bak"
      mv "${file}.tmp" "$file"
      
      echo "✅ Ordem corrigida em: $file"
    else
      echo "✅ Ordem já está correta em: $file"
    fi
  fi
done

echo "✅ Correção de ordem concluída!"
