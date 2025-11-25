#!/bin/zsh
set -e

# Helper function to free a port if already in use
free_port() {
  PORT=$1
  PID=$(lsof -ti :$PORT)
  if [ -n "$PID" ]; then
    echo "⚠️ Port $PORT in use by PID $PID. Killing..."
    kill -9 $PID
  fi
}

# Helper function to show status of services
show_status() {
  echo "📊 Service status:"
  for PORT in 3001 3000 8000; do
    PID=$(lsof -ti :$PORT)
    if [ -n "$PID" ]; then
      echo "✅ Port $PORT is running (PID $PID)"
    else
      echo "❌ Port $PORT is free (service not running)"
    fi
  done
}

# Restart option: kill services and relaunch
restart_services() {
  echo "🔄 Restarting Flatshare-Naija stack..."
  free_port 3001
  free_port 3000
  free_port 8000
  exec "$0"   # re-run this script from the beginning
}

# Handle command-line arguments
if [ "$1" = "status" ]; then
  show_status
  exit 0
elif [ "$1" = "restart" ]; then
  restart_services
  exit 0
fi

echo "🚀 Starting Flatshare-Naija stack..."

# Free required ports before starting
free_port 3001   # Backend
free_port 3000   # Frontend
free_port 8000   # AI service

# Start backend
echo "▶️ Launching backend..."
cd backend
nohup npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!

# Start frontend
echo "▶️ Launching frontend..."
cd ../web
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Start AI service
echo "▶️ Launching AI service..."
cd ../ai
nohup ../ai/.venv/bin/python -m uvicorn main:app --reload --port 8000 > ../ai.log 2>&1 &
AI_PID=$!

# Trap Ctrl+C to cleanly stop all processes
trap "echo '🛑 Stopping...'; kill $BACKEND_PID $FRONTEND_PID $AI_PID" INT

echo "✅ Backend logs: backend.log"
echo "✅ Frontend logs: frontend.log"
echo "✅ AI logs: ai.log"
echo "💡 Use './dev.sh status' to check running services."
echo "💡 Use './dev.sh restart' to restart everything."
echo "💡 Use 'tail -f backend.log', 'tail -f frontend.log', or 'tail -f ai.log' to watch activity."

wait
