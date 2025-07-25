#!/bin/bash

echo "🔧 Adicionando runtime: 'edge' às páginas com problemas..."

# Páginas específicas que estão causando problema
pages_with_issues=(
  "/Users/lindomarjunior/Downloads/Projetos/saas-restaurante-clube/app/onboarding/page.tsx"
  "/Users/lindomarjunior/Downloads/Projetos/saas-restaurante-clube/app/dashboard/new-order/page.tsx"
)

for file in "${pages_with_issues[@]}"; do
  if [[ -f "$file" ]]; then
    echo "📄 Processando: $file"
    
    # Verificar se já tem runtime
    if ! grep -q "export const runtime" "$file"; then
      # Encontrar a linha do dynamic e adicionar runtime depois
      if grep -q "export const dynamic" "$file"; then
        sed -i.bak "/export const dynamic = 'force-dynamic'/a\\
export const runtime = 'edge'\\
" "$file"
        rm "${file}.bak"
        echo "✅ Adicionado runtime = 'edge' em: $file"
      fi
    else
      echo "⏭️ Já tem runtime: $file"
    fi
  fi
done

echo "✅ Processamento concluído!"
