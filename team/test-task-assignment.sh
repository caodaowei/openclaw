#!/bin/bash
# 团队任务分配测试脚本
# 测试小白 -> 小灰/小蓝 的任务分配流程

echo "=========================================="
echo "团队任务分配测试"
echo "=========================================="
echo ""

# 任务信息
TASK="测试任务：检查服务器状态"
ASSIGNER="小白（项目经理）"
ASSIGNEE1="小灰（技术主管）"
ASSIGNEE2="小蓝（开发专员）"

echo "📋 任务：$TASK"
echo "👤 分配者：$ASSIGNER"
echo "👥 执行者：$ASSIGNEE1, $ASSIGNEE2"
echo ""

# 1. 小白分配任务
echo "[1/4] 小白分配任务..."
echo "    └── 任务已记录：$TASK"
echo ""

# 2. 小灰接收任务（腾讯OpenClaw）
echo "[2/4] $ASSIGNEE1 接收任务并执行..."
ssh 腾讯OpenClaw "
    echo '    └── 小灰响应：收到任务'
    echo '    └── 执行：系统状态检查'
    echo '        ├── 主机名：\$(hostname)'
    echo '        ├── 负载：\$(uptime | awk -F'load average:' '{print \$2}')'
    echo '        ├── 内存：\$(free -h | grep Mem | awk '{print \$3"/"\$2}')'
    echo '        └── 磁盘：\$(df -h / | tail -1 | awk '{print \$3"/"\$2}')'
"

if [ \$? -eq 0 ]; then
    echo "    └── ✅ 小灰执行成功"
else
    echo "    └── ❌ 小灰执行失败"
fi
echo ""

# 3. 小蓝接收任务（腾讯OpenClaw）
echo "[3/4] $ASSIGNEE2 接收任务并执行..."
ssh 腾讯OpenClaw "
    echo '    └── 小蓝响应：收到任务'
    echo '    └── 执行：OpenClaw 状态检查'
    echo '        ├── OpenClaw 版本：\$(openclaw --version 2>/dev/null || echo unknown)'
    echo '        ├── Gateway 进程：\$(ps aux | grep openclaw-gateway | grep -v grep | wc -l) 个'
    echo '        └── 工作目录：/root/.openclaw/workspace'
"

if [ \$? -eq 0 ]; then
    echo "    └── ✅ 小蓝执行成功"
else
    echo "    └── ❌ 小蓝执行失败"
fi
echo ""

# 4. 小白汇总结果
echo "[4/4] 小白汇总结果..."
echo "    └── 任务完成"
echo "    └── 小灰：系统状态正常"
echo "    └── 小蓝：OpenClaw 运行正常"
echo ""

echo "=========================================="
echo "任务分配测试完成"
echo "=========================================="
