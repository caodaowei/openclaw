#!/bin/bash
# Hermes Stack 停止脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🛑 停止 Hermes Stack..."
sudo docker compose down

echo "✅ 已停止所有服务"
