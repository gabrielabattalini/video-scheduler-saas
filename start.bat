@echo off
echo --------------------------------------------------
echo Iniciando Autoedito...
echo --------------------------------------------------
echo.

REM Verificar dependencias do Backend
if not exist "backend\node_modules" (
    echo Instalando dependencias do backend...
    cd backend
    call npm install
    cd ..
)

REM Verificar dependencias do Frontend
if not exist "frontend\node_modules" (
    echo Instalando dependencias do frontend...
    cd frontend
    call npm install
    cd ..
)

echo Dependencias verificadas.
echo.

REM Verificar e gerar Prisma Client
echo Verificando Prisma...
cd backend
if exist "prisma\schema.prisma" (
    echo Gerando Prisma Client...
    call npx prisma generate
)
cd ..
echo.

REM Iniciar Backend em nova janela
echo Iniciando Backend na porta 3001...
start "Autoedito - Backend" cmd /k "cd backend && npm run dev"

REM Aguardar um pouco para o backend iniciar
timeout /t 3 /nobreak >nul

REM Iniciar Frontend em nova janela
echo Iniciando Frontend na porta 3000...
start "Autoedito - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servidores iniciados:
echo   Frontend: http://localhost:3000
echo   Backend : http://localhost:3001
echo.
echo Feche as janelas dos servidores para parar.
echo.
pause
