// Script Node.js para limpar todos os workspaces
// Execute: node scripts/clear-workspaces.js

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function clearWorkspaces() {
  try {
    console.log('🗑️  Limpando workspaces e conexões...');

    // Deletar todas as conexões primeiro (devido à foreign key)
    const deletedConnections = await prisma.platformConnection.deleteMany({});
    console.log(`✅ ${deletedConnections.count} conexões deletadas`);

    // Deletar todos os workspaces
    const deletedWorkspaces = await prisma.workspace.deleteMany({});
    console.log(`✅ ${deletedWorkspaces.count} workspaces deletados`);

    console.log('✅ Limpeza concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar workspaces:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearWorkspaces();

