// Script para verificar se as credenciais do YouTube estÃ£o configuradas
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.log('âŒ Arquivo .env nÃ£o encontrado!');
  process.exit(1);
}

console.log('\nðŸ” Verificando credenciais do YouTube...\n');

const youtubeClientId = process.env.YOUTUBE_CLIENT_ID;
const youtubeClientSecret = process.env.YOUTUBE_CLIENT_SECRET;
const youtubeRedirectUri = process.env.YOUTUBE_REDIRECT_URI;

let allOk = true;

// Verificar YOUTUBE_CLIENT_ID
if (!youtubeClientId) {
  console.log('âŒ YOUTUBE_CLIENT_ID nÃ£o configurado');
  allOk = false;
} else {
  console.log('âœ… YOUTUBE_CLIENT_ID configurado');
  console.log(`   Valor: ${youtubeClientId.substring(0, 30)}...`);
}

// Verificar YOUTUBE_CLIENT_SECRET
if (!youtubeClientSecret) {
  console.log('âŒ YOUTUBE_CLIENT_SECRET nÃ£o configurado');
  allOk = false;
} else {
  console.log('âœ… YOUTUBE_CLIENT_SECRET configurado');
  console.log(`   Valor: ${youtubeClientSecret.substring(0, 10)}...`);
}

// Verificar YOUTUBE_REDIRECT_URI
if (!youtubeRedirectUri) {
  console.log('âš ï¸  YOUTUBE_REDIRECT_URI nÃ£o configurado (usando padrÃ£o)');
} else {
  console.log('âœ… YOUTUBE_REDIRECT_URI configurado');
  console.log(`   Valor: ${youtubeRedirectUri}`);
}

console.log('\n' + '='.repeat(50));

if (allOk) {
  console.log('\nâœ… Todas as credenciais do YouTube estÃ£o configuradas!');
  console.log('\nðŸ“‹ PrÃ³ximos passos:');
  console.log('1. Certifique-se de que o servidor backend estÃ¡ rodando');
  console.log('2. Verifique se o Redirect URI estÃ¡ configurado no Google Cloud Console');
  console.log('3. Teste a conexÃ£o na pÃ¡gina /connections');
} else {
  console.log('\nâŒ Falta configurar credenciais do YouTube!');
  console.log('\nðŸ“ Adicione no arquivo backend/.env:');
  console.log('');
  console.log('YOUTUBE_CLIENT_ID=seu_client_id_aqui');
  console.log('YOUTUBE_CLIENT_SECRET=seu_client_secret_aqui');
  console.log('YOUTUBE_REDIRECT_URI=https://autoedito.com/api/connections/youtube/callback');
  console.log('');
  console.log('Depois, reinicie o servidor backend!');
}

console.log('\n');






