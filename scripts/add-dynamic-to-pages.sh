#!/bin/bash

echo "🔧 Adicionando 'export const dynamic = force-dynamic' às páginas..."

# Encontrar todos os arquivos page.tsx
find /Users/lindomarjunior/Downloads/Projetos/saas-restaurante-clube/app -name "page.tsx" -type f | while read file; do
  # Verificar se já tem 'export const dynamic'
  if ! grep -q "export const dynamic" "$file"; then
    echo "📄 Processando: $file"
    
    # Criar arquivo temporário com 'export const dynamic' no topo
    {
      echo "export const dynamic = 'force-dynamic'"
      echo ""
      cat "$file"
    } > "${file}.tmp"
    
    # Substituir o arquivo original
    mv "${file}.tmp" "$file"
    
    echo "✅ Adicionado dynamic em: $file"
  else
    echo "⏭️ Já tem dynamic: $file"
  fi
done

echo "✅ Processamento concluído!"
