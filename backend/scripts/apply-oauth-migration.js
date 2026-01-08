import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log('🔧 Aplicando migration OAuth...\n');

    // Adicionar colunas OAuth
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT
    `);
    console.log('✅ Coluna avatar_url adicionada');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT
    `);
    console.log('✅ Coluna provider adicionada');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id TEXT
    `);
    console.log('✅ Coluna provider_id adicionada');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false
    `);
    console.log('✅ Coluna email_verified adicionada');

    // Tornar password opcional
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users ALTER COLUMN password DROP NOT NULL
    `);
    console.log('✅ Coluna password agora é opcional\n');

    // Verificar colunas
    const columns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND column_name IN ('avatar_url', 'provider', 'provider_id', 'email_verified', 'password')
      ORDER BY column_name
    `);

    console.log('📊 Colunas verificadas:');
    console.table(columns);

    console.log('\n✅ Migration aplicada com sucesso!');
    console.log('⚠️ IMPORTANTE: Pare o servidor backend antes de regenerar o Prisma Client!');
    console.log('🔄 Depois execute: npx prisma generate');

  } catch (error) {
    console.error('\n❌ Erro ao aplicar migration:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();
