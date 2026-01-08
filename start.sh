#!/bin/bash
# Script para iniciar Backend e Frontend
# Uso: ./start.sh

echo "Iniciando Autoedito..."
echo ""

echo "Verificando dependencias..."

if [ ! -d "backend/node_modules" ]; then
    echo "Dependencias do backend nao encontradas. Instalando..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Dependencias do frontend nao encontradas. Instalando..."
    cd frontend
    npm install
    cd ..
fi

echo "Dependencias verificadas!"
echo ""

echo "Verificando Prisma..."
cd backend
if [ -f "prisma/schema.prisma" ]; then
    echo "Gerando Prisma Client..."
    npx prisma generate 2>/dev/null
fi
cd ..
echo ""

cleanup() {
    echo ""
    echo "Parando servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "Iniciando Backend na porta 3001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 3

echo "Iniciando Frontend na porta 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Servidores iniciados!"
echo "Frontend: http://localhost:3000"
echo "Backend : http://localhost:3001"
echo ""
echo "Pressione Ctrl+C para parar os servidores."
echo ""

wait
