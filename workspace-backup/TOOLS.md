# TOOLS.md - Local Notes

_小天的工具箱，记录环境特有的配置。_

## SSH 主机

- [待添加]

## 常用路径

- **Workspace**: `/home/azureuser/.openclaw/workspace`
- **Config**: `/home/azureuser/.openclaw/openclaw.json`
- **Logs**: `/tmp/openclaw/`
- **项目代码**: `/home/azureuser/src`
- **OpenClaw 养成计划**: `/home/azureuser/src/openclaw`
- **配置备份**: `/home/azureuser/src/openclaw/workspace-backup`

## Git 仓库

- **GitHub**: https://github.com/caodaowei
- **本地仓库**: `/home/azureuser/src`

## API 密钥位置

- **Moonshot**: 配置在 `openclaw.json` (gateway.auth.profiles)
- **Feishu**: 配置在 `openclaw.json` (channels.feishu)
- **GitHub**: `~/.ssh/id_ed25519` 或 `~/.ssh/id_rsa`

## 自定义命令

- **快速重启**: `openclaw gateway restart`
- **查看状态**: `openclaw status`
- **查看日志**: `openclaw logs --follow`
- **进入项目目录**: `cd ~/src`
- **查看 Git 状态**: `cd ~/src && git status`
- **备份配置**: `cp -r ~/.openclaw/workspace/* ~/src/openclaw/workspace-backup/`

## 自动备份

### 备份范围

| 类别 | 文件/目录 | 状态 |
|------|----------|------|
| **工作区配置** | `workspace/*.md` | ✅ 已备份 |
| **核心配置** | `openclaw.json` (脱敏) | ✅ 已备份 |
| **日常记忆** | `workspace/memory/` | ✅ 已备份 |
| **SSH 密钥** | `~/.ssh/id_*` | ⬜ 需单独备份 |

### 手动备份命令

```bash
# 完整备份脚本
cd /home/azureuser/src/openclaw

# 1. 同步 workspace 到备份目录
cp -r ~/.openclaw/workspace/* workspace-backup/

# 2. 备份 openclaw.json（脱敏）
cat ~/.openclaw/openclaw.json | \
  sed 's/"apiKey": "[^"]*"/"apiKey": "***REDACTED***"/g' | \
  sed 's/"appSecret": "[^"]*"/"appSecret": "***REDACTED***"/g' | \
  sed 's/"token": "[^"]*"/"token": "***REDACTED***"/g' \
  > workspace-backup/openclaw.json

# 3. 提交到 Git
git add .
if git diff --cached --quiet; then
    echo "无变更，跳过提交"
else
    git commit -m "自动备份：$(date +%Y-%m-%d-%H:%M)"
    git push origin main
    echo "备份完成并已推送"
fi
```

### 定时备份（系统 Cron）

如需设置系统自动备份，添加以下 Cron 任务：

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2:00 执行备份
0 2 * * * cd /home/azureuser/src/openclaw && ./backup.sh >> /var/log/openclaw-backup.log 2>&1
```

创建 `backup.sh` 脚本：
```bash
#!/bin/bash
cd /home/azureuser/src/openclaw

# 同步 workspace
cp -r ~/.openclaw/workspace/* workspace-backup/ 2>/dev/null || true

# 脱敏备份 openclaw.json
cat ~/.openclaw/openclaw.json | \
  sed 's/"apiKey": "[^"]*"/"apiKey": "***REDACTED***"/g' | \
  sed 's/"appSecret": "[^"]*"/"appSecret": "***REDACTED***"/g' | \
  sed 's/"token": "[^"]*"/"token": "***REDACTED***"/g' \
  > workspace-backup/openclaw.json

# 提交到 Git
if git diff --quiet && git diff --cached --quiet; then
    echo "$(date): 无变更，跳过备份"
    exit 0
fi

git add .
git commit -m "自动备份：$(date +%Y-%m-%d)"
git push origin main
echo "$(date): 备份完成"
```

## 飞书配置

- **App ID**: `cli_a930c774a3b95bc8`
- **用户 ID**: `ou_0e8c4d0568dc8206ab1a2d5c3f8c69e9`
- **群组 ID**: `oc_0bed749388979a695c47d5852b239e7d`

## 项目结构

```
~/src/
├── openclaw/              # OpenClaw 养成计划
│   ├── OpenClaw从零开始养成计划.md
│   ├── OpenClaw配置报告_2026-03-18.md
│   ├── Index.md
│   ├── README.md
│   ├── build.js
│   ├── workspace-backup/  # 配置备份
│   │   ├── IDENTITY.md
│   │   ├── USER.md
│   │   ├── SOUL.md
│   │   ├── RULES.md
│   │   ├── HEARTBEAT.md
│   │   ├── MEMORY.md
│   │   ├── TOOLS.md
│   │   ├── AGENTS.md
│   │   ├── BOOTSTRAP.md
│   │   ├── openclaw.json  # 脱敏核心配置
│   │   └── memory/
│   │       └── 2026-03-18.md
│   └── .github/
│       └── workflows/
│           ├── deploy.yml
│           └── deploy-local.yml
└── [其他项目...]
```

## 防护措施

### 配置防丢失
- ✅ Git 版本控制
- ✅ 完整备份（workspace + openclaw.json 脱敏）
- ✅ 多位置备份（GitHub + 本地）
- ⬜ 云盘备份（可选）

### 危险操作提醒
- 避免 `git reset --hard`
- 避免 `rm -rf`（使用 `trash`）
- 修改配置前备份 `openclaw.json`
- 使用 `config.patch` 而非 `config.apply`

## 待添加

- [ ] SSH 主机配置
- [ ] 具体项目列表
- [ ] 数据库连接信息
- [ ] 其他 API 密钥位置
- [ ] 自定义脚本/别名

---

_狐狸的工具箱，要井井有条。备份是底线，不能丢。_
