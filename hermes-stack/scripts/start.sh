#!/bin/bash
# Hermes Stack 启动脚本
# 注意：OpenClaw Main 和 Hermes 使用宿主机安装版本
# 只有 Obsidian Vault 使用容器

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🚀 启动 Hermes Stack..."
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在，请先创建"
    exit 1
fi

# 加载环境变量
export $(cat .env | grep -v '^#' | xargs)

echo "📋 配置信息:"
echo "  Vault Port: ${VAULT_PORT:-8080}"
echo "  Obsidian Vault Path: ${PROJECT_DIR}/data/vault"
echo ""

# 启动 Obsidian Vault
echo "🔧 启动 Obsidian Vault..."
sudo docker compose up -d obsidian-vault

echo ""
echo "⏳ 等待服务就绪..."
sleep 3

echo ""
echo "✅ Hermes Stack 启动完成!"
echo ""
echo "📊 容器状态:"
sudo docker compose ps
echo ""
echo "🔗 访问地址:"
echo "  Obsidian Vault: http://localhost:${VAULT_PORT:-8080}"
echo ""
echo "📓 Vault 登录信息:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "📁 Vault 本地路径:"
echo "  ${PROJECT_DIR}/data/vault"
echo ""
echo "💡 提示:"
echo "  - OpenClaw Main 和 Hermes 使用宿主机安装版本"
echo "  - 查看日志: sudo docker compose logs -f"
echo "  - 停止服务: ./scripts/stop.sh"
