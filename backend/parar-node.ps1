# Script para parar todos os processos Node.js
# Execute: .\parar-node.ps1

Write-Host "🔍 Verificando processos Node.js..." -ForegroundColor Cyan
Write-Host ""

$processes = Get-Process -Name node -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "⚠️  Encontrados $($processes.Count) processos Node.js:" -ForegroundColor Yellow
    Write-Host ""
    $processes | ForEach-Object {
        Write-Host "  PID: $($_.Id) - Iniciado: $($_.StartTime)" -ForegroundColor Gray
    }
    Write-Host ""
    
    Write-Host "🛑 Parando todos os processos Node.js..." -ForegroundColor Yellow
    $processes | Stop-Process -Force
    
    Write-Host ""
    Start-Sleep -Seconds 2
    
    $remaining = Get-Process -Name node -ErrorAction SilentlyContinue
    if ($remaining) {
        Write-Host "❌ Ainda há processos Node.js rodando. Tente novamente." -ForegroundColor Red
    } else {
        Write-Host "✅ Todos os processos Node.js foram parados!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Agora você pode executar: npx prisma generate" -ForegroundColor Cyan
    }
} else {
    Write-Host "✅ Nenhum processo Node.js encontrado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Você pode executar: npx prisma generate" -ForegroundColor Cyan
}





