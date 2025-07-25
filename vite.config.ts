import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom', // Usar jsdom para testes que dependem do DOM
    include: ['**/*.test.ts'], // Apenas arquivos de teste automatizado
    exclude: [
      '**/*.spec.ts', // Ignorar arquivos de spec de planejamento
      '**/node_modules/**', // Ignorar testes em node_modules
    ],
    setupFiles: './vitest.setup.ts', // Carregar variáveis de ambiente antes dos testes
  }
})
