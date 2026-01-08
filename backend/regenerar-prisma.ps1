# Script para regenerar Prisma Client
Write-Host "Regenerando Prisma Client..." -ForegroundColor Cyan
cd backend
npx prisma generate
Write-Host "âœ… Prisma Client regenerado!" -ForegroundColor Green
Write-Host "Agora reinicie o backend!" -ForegroundColor Yellow
