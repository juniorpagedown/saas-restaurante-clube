# Sistema de Fechamento de Comandas

## Funcionalidades Implementadas

### 1. **Fechamento de Comandas com Múltiplos Pagamentos**

#### Modelo de Dados
- **ComandaFechada**: Armazena informações do fechamento da comanda
  - `valorTotal`: Valor total da comanda
  - `dataFechamento`: Data e hora do fechamento
  - `responsavelId`: ID do usuário que fechou a comanda
  - `observacoes`: Observações opcionais sobre o fechamento
  
- **PagamentoComanda**: Suporte a múltiplas formas de pagamento
  - `formaPagamento`: Tipo (dinheiro, cartão, pix, vale, crédito, débito)
  - `valor`: Valor pago nesta forma específica

#### API Endpoints

**POST /api/comandas/fechar**
```json
{
  "orderId": "string",
  "pagamentos": [
    {
      "formaPagamento": "dinheiro",
      "valor": 50.00
    },
    {
      "formaPagamento": "pix",
      "valor": 30.00
    }
  ],
  "observacoes": "Pagamento dividido - cliente solicitou"
}
```

**Validações de Segurança:**
- ✅ Apenas usuários com roles: `caixa`, `gerente`, `admin`, `garcom`
- ✅ Verificação se comanda já foi fechada
- ✅ Validação se valor dos pagamentos confere com total da comanda
- ✅ Formas de pagamento permitidas são validadas

### 2. **Histórico de Comandas Fechadas**

**GET /api/comandas/fechadas**
- Parâmetros: `dataInicio`, `dataFim`, `page`, `limit`
- Retorna comandas fechadas com paginação
- Inclui detalhes dos pagamentos e responsável

### 3. **Resumo Financeiro Diário**

**GET /api/comandas/resumo-diario**
- Parâmetro: `data` (formato YYYY-MM-DD)
- Fornece análises completas:
  - Total geral e número de comandas
  - Ticket médio
  - Resumo por forma de pagamento (com percentuais)
  - Desempenho por responsável
  - Análise por horário do dia

#### Exemplo de Resposta:
```json
{
  "data": "2025-07-25",
  "resumoGeral": {
    "totalGeral": 1250.50,
    "totalComandas": 45,
    "ticketMedio": 27.79
  },
  "resumoPorFormaPagamento": [
    {
      "formaPagamento": "pix",
      "valor": 625.25,
      "percentual": 50.02
    },
    {
      "formaPagamento": "dinheiro",
      "valor": 375.15,
      "percentual": 30.01
    }
  ],
  "resumoPorResponsavel": [...],
  "resumoPorHora": [...]
}
```

### 4. **Interface de Usuário**

#### Modal de Fechamento (`FecharComandaModal`)
- ✅ Exibe resumo completo da comanda
- ✅ Suporte a múltiplas formas de pagamento
- ✅ Validação em tempo real dos valores
- ✅ Botão "Preencher Total" para facilitar uso
- ✅ Campo de observações opcional

#### Dashboard Financeiro (`DashboardFinanceiro`)
- ✅ Cards de métricas principais
- ✅ Filtro por data
- ✅ Gráficos de formas de pagamento
- ✅ Ranking de responsáveis
- ✅ Lista detalhada de comandas do dia

### 5. **Integrações**

#### No ComandasView
- Botão "Fechar Comanda" aparece apenas quando status = "ready"
- Integrado com o modal de fechamento
- Atualiza automaticamente após fechamento

#### Navegação
- Nova rota: `/dashboard/financeiro`
- Acessível via sidebar (para usuários com permissão)

## Como Usar

### 1. **Fechar uma Comanda**
1. Na tela de comandas, localize uma comanda com status "Pronta"
2. Clique em "Fechar Comanda"
3. Revise os itens e total
4. Adicione as formas de pagamento:
   - Use "Preencher Total" para pagamento único
   - Use "Adicionar Forma de Pagamento" para dividir
5. Confira se valores batem (indicador verde)
6. Adicione observações se necessário
7. Clique em "Fechar Comanda"

### 2. **Acessar Relatórios Financeiros**
1. Acesse `/dashboard/financeiro`
2. Use o seletor de data para escolher o dia
3. Visualize métricas, gráficos e detalhes
4. Analise desempenho por forma de pagamento e responsável

### 3. **Consultar Histórico**
- Use a API `/api/comandas/fechadas` com filtros de data
- Implemente uma tela de histórico conforme necessário

## Segurança Implementada

### Controle de Acesso
- **Fechar comandas**: caixa, gerente, admin, garcom
- **Ver relatórios**: caixa, gerente, admin
- **API protegida**: Verificação de autenticação e autorização

### Validações
- Valores de pagamento devem ser positivos
- Soma dos pagamentos deve conferir com total
- Formas de pagamento são validadas
- Comanda não pode ser fechada duas vezes

### Auditoria
- Registro do responsável pelo fechamento
- Data/hora precisa do fechamento
- Histórico completo preservado
- Observações para casos especiais

## Banco de Dados

### Migrações Aplicadas
- `20250725045840_add_multiplos_pagamentos_comandas`

### Estrutura Final
```sql
ComandaFechada:
- id (PK)
- orderId (FK -> Order, unique)
- valorTotal
- dataFechamento
- responsavelId (FK -> User)
- observacoes (opcional)

PagamentoComanda:
- id (PK)
- comandaFechada (FK -> ComandaFechada)
- formaPagamento
- valor
```

## Próximos Passos Sugeridos

1. **Relatórios Avançados**
   - Gráficos de tendência temporal
   - Comparativos mensais
   - Análise de sazonalidade

2. **Impressão**
   - Comprovante de fechamento
   - Relatório diário para caixa

3. **Integração Fiscal**
   - Geração de cupom fiscal
   - Integração com TEF

4. **Alertas**
   - Notificações de metas diárias
   - Alertas de performance

5. **Mobile**
   - App dedicado para caixa
   - Interface otimizada para tablet
