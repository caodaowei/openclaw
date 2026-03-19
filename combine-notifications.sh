#!/bin/bash
# 整合通知生成脚本
# 由系统 Cron 在 4:05 执行，读取备份和报告的通知文件

BACKUP_NOTIFY="/tmp/backup-notification.txt"
REPORT_NOTIFY="/tmp/daily-report-notification.txt"
COMBINED_NOTIFY="/tmp/combined-notification.txt"

# 检查通知文件是否存在
if [ ! -f "$BACKUP_NOTIFY" ] && [ ! -f "$REPORT_NOTIFY" ]; then
    echo "没有通知文件，跳过"
    exit 0
fi

# 生成整合通知
cat > "$COMBINED_NOTIFY" << EOF
🦊 小天每日汇报

$(if [ -f "$BACKUP_NOTIFY" ]; then
    echo "=== 备份状态 ==="
    cat "$BACKUP_NOTIFY"
    echo ""
fi)

$(if [ -f "$REPORT_NOTIFY" ]; then
    echo "=== 报告状态 ==="
    cat "$REPORT_NOTIFY"
    echo ""
fi)

---
时间: $(date +"%Y-%m-%d %H:%M:%S")
EOF

echo "整合通知已生成: $COMBINED_NOTIFY"

# 清理原始通知文件
rm -f "$BACKUP_NOTIFY" "$REPORT_NOTIFY"

echo "原始通知文件已清理"
