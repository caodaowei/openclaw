#!/bin/bash
# OpenClaw 每日自动备份脚本
# 由小天创建 🦊

set -e

# 配置
PROJECT_DIR="/home/azureuser/src/openclaw"
WORKSPACE_DIR="/home/azureuser/.openclaw/workspace"
CONFIG_FILE="/home/azureuser/.openclaw/openclaw.json"
LOG_FILE="/var/log/openclaw-backup.log"
DATE=$(date +"%Y-%m-%d %H:%M:%S")
DATE_SHORT=$(date +"%Y-%m-%d")

# 飞书通知函数
send_feishu_notification() {
    local status="$1"
    local message="$2"
    
    # 使用 OpenClaw 的 message 工具发送飞书通知
    # 注意：这里需要通过 OpenClaw 的 API 或工具发送
    # 暂时记录到日志，后续可以通过其他方式发送
    echo "[$DATE] 飞书通知: $status - $message" >> "$LOG_FILE"
}

# 记录日志函数
log() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

# 开始备份
log "=========================================="
log "开始每日自动备份"
log "=========================================="

cd "$PROJECT_DIR"

# 1. 同步 workspace 到备份目录
log "步骤 1: 同步 workspace 配置..."
if cp -r "$WORKSPACE_DIR"/* workspace-backup/ 2>/dev/null; then
    log "✓ Workspace 同步成功"
else
    log "⚠ Workspace 同步部分失败，继续..."
fi

# 2. 备份 openclaw.json（脱敏）
log "步骤 2: 备份 openclaw.json（脱敏处理）..."
if [ -f "$CONFIG_FILE" ]; then
    cat "$CONFIG_FILE" | \
        sed 's/"apiKey": "[^"]*"/"apiKey": "***REDACTED***"/g' | \
        sed 's/"appSecret": "[^"]*"/"appSecret": "***REDACTED***"/g' | \
        sed 's/"token": "[^"]*"/"token": "***REDACTED***"/g' \
        > workspace-backup/openclaw.json
    log "✓ openclaw.json 脱敏备份成功"
else
    log "✗ openclaw.json 不存在"
    send_feishu_notification "失败" "openclaw.json 不存在，备份失败"
    exit 1
fi

# 3. 重新构建站点
log "步骤 3: 构建文档站点..."
if node build.js >> "$LOG_FILE" 2>&1; then
    log "✓ 站点构建成功"
else
    log "⚠ 站点构建失败，继续提交配置备份..."
fi

# 4. 检查 Git 变更
log "步骤 4: 检查 Git 变更..."
git add -A

if git diff --cached --quiet; then
    log "✓ 无变更，跳过提交"
    send_feishu_notification "成功" "备份完成：无变更，无需提交"
    log "=========================================="
    log "备份完成：无变更"
    log "=========================================="
    exit 0
fi

# 5. 提交到 Git
log "步骤 5: 提交到 Git..."
if git commit -m "自动备份：$DATE_SHORT" >> "$LOG_FILE" 2>&1; then
    log "✓ Git 提交成功"
else
    log "✗ Git 提交失败"
    send_feishu_notification "失败" "Git 提交失败"
    exit 1
fi

# 6. 推送到 GitHub
log "步骤 6: 推送到 GitHub..."
if git push origin main >> "$LOG_FILE" 2>&1; then
    log "✓ 推送成功"
    
    # 获取提交哈希
    COMMIT_HASH=$(git rev-parse --short HEAD)
    
    log "=========================================="
    log "备份完成！"
    log "提交哈希: $COMMIT_HASH"
    log "=========================================="
    
    # 发送飞书通知
    # 创建通知文件，供 OpenClaw 读取并发送
    cat > /tmp/backup-notification.txt << EOF
备份完成！🦊

日期: $DATE_SHORT
时间: $(date +"%H:%M:%S")
提交: $COMMIT_HASH
状态: ✅ 成功

备份内容:
- Workspace 配置
- openclaw.json (脱敏)
- 文档站点 (dist/)

查看详情: https://github.com/caodaowei/openclaw/commit/$COMMIT_HASH
EOF

    log "✓ 飞书通知已准备"
    
else
    log "✗ 推送失败"
    send_feishu_notification "失败" "GitHub 推送失败"
    exit 1
fi

exit 0
