-- Script para limpar todos os workspaces
-- ATENÇÃO: Isso irá deletar todos os workspaces e suas conexões associadas
-- Execute apenas se tiver certeza!

-- Deletar todas as conexões primeiro (devido à foreign key)
DELETE FROM platform_connections;

-- Deletar todos os workspaces
DELETE FROM workspaces;

-- Resetar sequências se necessário
-- (Não necessário para UUID, mas deixando comentado caso precise)

