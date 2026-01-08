-- Migration para adicionar campos OAuth na tabela users
-- Execute este SQL no banco de dados PostgreSQL

-- Adicionar colunas OAuth
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS provider_id TEXT,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;

-- Tornar password opcional (para usuários OAuth)
ALTER TABLE users 
  ALTER COLUMN password DROP NOT NULL;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('avatar_url', 'provider', 'provider_id', 'email_verified', 'password')
ORDER BY column_name;






