# TOOLS.md - Local Notes

_小天的工具箱，记录环境特有的配置。_

## SSH 主机

### 已配置主机

| 主机名 | IP/域名 | 用户名 | 端口 | 状态 |
|--------|---------|--------|------|------|
| **腾讯OpenClaw** | 43.156.51.119 | root | 22 | ⚠️ 待添加公钥 |

### SSH 配置

**配置文件**: `~/.ssh/config`

```
Host 腾讯OpenClaw
    HostName 43.156.51.119
    User root
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

### 连接方法

```bash
# 快速连接
ssh 腾讯OpenClaw

# 或完整命令
ssh root@43.156.51.119

# 执行远程命令
ssh 腾讯OpenClaw "ls -la"

# 复制文件到远程
scp localfile.txt 腾讯OpenClaw:/root/

# 从远程复制文件
scp 腾讯OpenClaw:/root/remotefile.txt ./
```

### 当前问题

⚠️ **需要将公钥添加到腾讯服务器**

**本地公钥**:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILmI3qtXC4DLPLPLypzecrUjrs2M7Khz9YOd4FQunWooxR user@openclaw.ai
```

**解决方法**（在腾讯服务器上执行）:
```bash
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILmI3qtXC4DLPLPLypzecrUjrs2M7Khz9YOd4FQunWooxR user@openclaw.ai" >> ~/.ssh/authorized_keys
```

或使用密码登录（临时）:
```bash
ssh -o PreferredAuthentications=password root@43.156.51.119
```

## 常用路径

- **Workspace**: `/home/azureuser/.openclaw/workspace`
- **Config**: `/home/azureuser/.openclaw/openclaw.json`
- **Logs**: `/tmp/openclaw/`
- **项目代码**: `/home/azureuser/src`
- **OpenClaw 养成计划**: `/home/azureuser/src/openclaw`
- **配置备份**: `/home/azureuser/src/openclaw/workspace-backup`
- **备份日志**: `/var/log/openclaw-backup.log`

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
- **手动备份**: `cd ~/src/openclaw && ./backup.sh`

## 自动备份系统

### 备份范围

| 类别 | 文件/目录 | 状态 |
|------|----------|------|
| **工作区配置** | `workspace/*.md` | ✅ |
| **核心配置** | `openclaw.json` (脱敏) | ✅ |
| **日常记忆** | `workspace/memory/` | ✅ |
| **文档站点** | `dist/` (自动构建) | ✅ |

### 备份脚本

**脚本位置**: `/home/azureuser/src/openclaw/backup.sh`

**功能**:
1. 同步 workspace 到备份目录
2. 脱敏备份 openclaw.json
3. 重新构建文档站点
4. 提交到 Git（如有变更）
5. 推送到 GitHub
6. 生成飞书通知文件

### 设置系统自动备份

#### 步骤 1：确保脚本可执行
```bash
chmod +x /home/azureuser/src/openclaw/backup.sh
```

#### 步骤 2：设置系统 Cron
```bash
# 编辑当前用户的 crontab
crontab -e

# 添加以下行（每天凌晨 2:00 执行备份）
0 2 * * * /home/azureuser/src/openclaw/backup.sh >> /var/log/openclaw-backup.log 2>&1

# 或者每 6 小时备份一次
0 */6 * * * /home/azureuser/src/openclaw/backup.sh >> /var/log/openclaw-backup.log 2>&1
```

#### 步骤 3：验证 Cron 设置
```bash
# 查看当前用户的 crontab
crontab -l

# 查看备份日志
tail -f /var/log/openclaw-backup.log
```

### 飞书通知设置

备份完成后，脚本会在 `/tmp/backup-notification.txt` 生成通知内容。

**手动发送通知**:
```bash
# 查看通知内容
cat /tmp/backup-notification.txt

# 或通过 OpenClaw 发送（需要手动执行）
```

**自动发送通知**（需要额外配置）:
可以在备份脚本中添加调用 OpenClaw API 的代码，或设置另一个 Cron 任务检查通知文件并发送。

### 手动备份命令

```bash
# 完整手动备份
cd /home/azureuser/src/openclaw
./backup.sh

# 或分步执行
# 1. 同步 workspace
cp -r ~/.openclaw/workspace/* workspace-backup/

# 2. 备份 openclaw.json（脱敏）
cat ~/.openclaw/openclaw.json | \
  sed 's/"apiKey": "[^"]*"/"apiKey": "***REDACTED***"/g' | \
  sed 's/"appSecret": "[^"]*"/"appSecret": "***REDACTED***"/g' | \
  sed 's/"token": "[^"]*"/"token": "***REDACTED***"/g' \
  > workspace-backup/openclaw.json

# 3. 构建站点
node build.js

# 4. 提交到 Git
git add -A
git commit -m "手动备份：$(date +%Y-%m-%d-%H:%M)"
git push origin main
```

### 备份状态检查

```bash
# 查看最近备份日志
tail -50 /var/log/openclaw-backup.log

# 查看 Git 提交历史
cd /home/azureuser/src/openclaw
git log --oneline -10

# 检查是否有未提交的变更
git status
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
│   ├── build.js           # 站点构建脚本
│   ├── backup.sh          # 自动备份脚本 ⭐
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
│   ├── dist/              # 构建产物（自动生成的站点）
│   └── .github/
│       └── workflows/
│           ├── deploy.yml
│           └── deploy-local.yml
└── [其他项目...]
```

## 防护措施

### 配置防丢失
- ✅ Git 版本控制（GitHub）
- ✅ 完整备份脚本（backup.sh）
- ✅ 系统自动备份（Cron）
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
_每天凌晨 2 点，小天会准时守护大哥的配置。🦊_
