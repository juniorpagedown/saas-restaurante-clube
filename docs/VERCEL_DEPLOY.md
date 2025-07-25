# Deployment no Vercel - Variáveis de Ambiente

## ⚠️ IMPORTANTE: Configuração Obrigatória

Para que a aplicação funcione corretamente no Vercel, você DEVE configurar as seguintes variáveis de ambiente:

### 1. NEXTAUTH_SECRET (OBRIGATÓRIO)

Execute o script para gerar um secret seguro:

```bash
./scripts/generate-secret.sh
```

Ou gere manualmente:

```bash
openssl rand -base64 32
```

### 2. Configuração no Vercel

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para o seu projeto
3. Clique em **Settings** > **Environment Variables**
4. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```
NEXTAUTH_SECRET = [cole o valor gerado pelo script]
NEXTAUTH_URL = https://seu-dominio.vercel.app
DATABASE_URL = [sua URL do banco de dados]
```

#### Variáveis Opcionais (OAuth):

```
GOOGLE_CLIENT_ID = [seu Google OAuth Client ID]
GOOGLE_CLIENT_SECRET = [seu Google OAuth Client Secret]
GITHUB_CLIENT_ID = [seu GitHub OAuth Client ID]  
GITHUB_CLIENT_SECRET = [seu GitHub OAuth Client Secret]
```

#### Variáveis do Stripe (se usar):

```
STRIPE_PUBLISHABLE_KEY = [sua chave pública do Stripe]
STRIPE_SECRET_KEY = [sua chave secreta do Stripe]
STRIPE_WEBHOOK_SECRET = [seu webhook secret do Stripe]
```

### 3. Configuração do Banco de Dados

Para produção, recomenda-se usar um banco PostgreSQL. Você pode usar:
- [Neon](https://neon.tech/) - PostgreSQL gratuito
- [PlanetScale](https://planetscale.com/) - MySQL gratuito
- [Supabase](https://supabase.com/) - PostgreSQL gratuito

Exemplo de DATABASE_URL para PostgreSQL:
```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### 4. Redeploy

Após configurar todas as variáveis de ambiente:
1. Vá em **Deployments**
2. Clique em **Redeploy** no último deployment
3. Aguarde o build completar

## Problemas Comuns

### Erro "NO_SECRET"
- Certifique-se que `NEXTAUTH_SECRET` está configurado no Vercel
- O valor deve ser uma string aleatória segura (32+ caracteres)

### Erro de Banco de Dados
- Verifique se `DATABASE_URL` está correta
- Para desenvolvimento local, use SQLite: `"file:./dev.db"`
- Para produção, use PostgreSQL ou MySQL

### OAuth não funciona
- Configure as URLs de callback nos provedores OAuth
- Adicione seu domínio Vercel nas configurações OAuth
- Verifique se `NEXTAUTH_URL` está correto

## Scripts Úteis

```bash
# Gerar NEXTAUTH_SECRET
./scripts/generate-secret.sh

# Push do schema do banco (desenvolvimento)
npm run db:push

# Abrir Prisma Studio
npm run db:studio
```
