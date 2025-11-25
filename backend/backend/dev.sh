#!/bin/zsh
set -e

echo "🚀 Starting Flatshare-Naija stack..."

# Start backend
echo "▶️ Launching backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!

# Start frontend
echo "▶️ Launching frontend..."
cd ../web
npm run dev &
FRONTEND_PID=$!

trap "echo '🛑 Stopping...'; kill $BACKEND_PID $FRONTEND_PID" INT
wait
