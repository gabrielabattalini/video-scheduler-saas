# Script para iniciar Backend e Frontend
# Uso: .\start.ps1

Write-Host "Iniciando Autoedito..." -ForegroundColor Cyan
Write-Host ""

# Verificar dependencias do Backend
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Dependencias do backend não encontradas. Instalando..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Verificar dependencias do Frontend
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Dependencias do frontend não encontradas. Instalando..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "Dependencias verificadas!" -ForegroundColor Green
Write-Host ""

# Verificar e gerar Prisma Client
Write-Host "Verificando Prisma..." -ForegroundColor Cyan
Set-Location backend
if (Test-Path "prisma\schema.prisma") {
    Write-Host "Gerando Prisma Client..." -ForegroundColor Cyan
    npx prisma generate
}
Set-Location ..
Write-Host ""

# Iniciar Backend em nova janela
Write-Host "Iniciando Backend na porta 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\\backend'; npm run dev" -WindowStyle Normal

# Aguardar um pouco para o backend iniciar
Start-Sleep -Seconds 3

# Iniciar Frontend em nova janela
Write-Host "Iniciando Frontend na porta 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Servidores iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend : http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Feche as janelas dos servidores para parar." -ForegroundColor Yellow
Write-Host ""
