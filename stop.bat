@echo off
echo --------------------------------------------------
echo Parando servidores Autoedito...
echo --------------------------------------------------
echo.

REM Matar processos do Node nas portas 3000 e 3001
echo Encerrando processos na porta 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Encerrando processos na porta 3001 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Tambem matar processos node relacionados
echo Encerrando processos Node relacionados...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Servidores parados!
echo.
pause
