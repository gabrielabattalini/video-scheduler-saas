# Script para parar Backend e Frontend
# Uso: .\stop.ps1

Write-Host "Parando servidores Autoedito..." -ForegroundColor Yellow
Write-Host ""

function Stop-ProcessOnPort {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }

    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Encerrando processo na porta $Port (PID: $processId)..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Stop-ProcessOnPort -Port 3000
Stop-ProcessOnPort -Port 3001

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Encerrando processos Node relacionados..." -ForegroundColor Yellow
    $nodeProcesses | Where-Object {
        $_.Path -like "*video-scheduler-saas*"
    } | Stop-Process -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Servidores parados!" -ForegroundColor Green
Write-Host ""
