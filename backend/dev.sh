#!/bin/zsh
set -e

echo "🚀 Starting Flatshare-Naija stack..."
echo "▶️ Launching backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!

eof

heredoc> EOF
