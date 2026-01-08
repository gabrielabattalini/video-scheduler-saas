# 🔧 Correção da Integração Google OAuth

## ✅ Correções Aplicadas

### 1. Schema Prisma Atualizado
Adicionados campos necessários para OAuth:
- `password` → `String?` (nullable para permitir OAuth sem senha)
- `provider` → `String?` ('google', 'email', etc.)
- `providerId` → `String?` (ID do provider)
- `avatarUrl` → `String?` (URL do avatar)
- `emailVerified` → `Boolean` (default: false)

### 2. Serviço Google OAuth Melhorado
- ✅ Logs detalhados em todas as etapas
- ✅ Melhor tratamento de erros
- ✅ Validação de email verificado
- ✅ Atualização de usuários existentes

### 3. Controller de Autenticação Melhorado
- ✅ Logs detalhados
- ✅ Melhor tratamento de erros no callback
- ✅ Validação de parâmetros OAuth

## 📋 Próximos Passos

### 1. Aplicar Migration do Prisma

Execute no diretório `backend`:

```bash
cd backend
npx prisma db push
npx prisma generate
```

Ou se preferir criar uma migration:

```bash
cd backend
npx prisma migrate dev --name add_google_oauth_fields
npx prisma generate
```

### 2. Verificar Variáveis de Ambiente

No arquivo `backend/.env`, certifique-se de ter:

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### 3. Verificar Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá em "APIs & Services" > "Credentials"
3. Verifique se o Redirect URI está configurado:
   - `http://localhost:3001/api/auth/google/callback` (desenvolvimento)
   - Para produção, adicione a URL do seu domínio

### 4. Reiniciar o Backend

Após aplicar as mudanças:

```bash
# Parar o servidor (Ctrl+C)
# Depois iniciar novamente
npm run dev
```

## 🐛 Troubleshooting

### Erro: "Field 'password' is required"

**Causa:** Migration não aplicada.

**Solução:**
```bash
cd backend
npx prisma db push
npx prisma generate
```

### Erro: "Google OAuth credentials not configured"

**Causa:** Variáveis de ambiente não configuradas.

**Solução:**
1. Verifique o arquivo `backend/.env`
2. Adicione `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
3. Reinicie o servidor

### Erro: "redirect_uri_mismatch"

**Causa:** Redirect URI não configurado no Google Cloud Console.

**Solução:**
1. Acesse Google Cloud Console
2. Vá em "Credentials" > Seu OAuth Client
3. Adicione `http://localhost:3001/api/auth/google/callback` aos Redirect URIs autorizados

### Erro: "Email já cadastrado com outro método de login"

**Causa:** Email já existe no banco com outro provider.

**Solução:**
- Use o email/senha para fazer login, ou
- Use outra conta do Google com email diferente

## ✅ Verificação

Após aplicar as correções, teste:

1. Acesse a página de login
2. Clique em "Login com Google"
3. Autorize no Google
4. Você deve ser redirecionado e logado automaticamente

## 📝 Notas

- Usuários criados via Google OAuth não precisam de senha
- Eles podem ser identificados pelo campo `provider: 'google'`
- O campo `providerId` armazena o ID do Google do usuário
- O campo `emailVerified` é automaticamente `true` para usuários OAuth

