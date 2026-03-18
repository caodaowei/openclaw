# OpenClaw 从零开始养成计划

> 一份完整的 OpenClaw 个人助手养成指南

---

## 📋 目录

1. [什么是 OpenClaw](#什么是-openclaw)
2. [初始化配置](#初始化配置)
3. [建立身份认同](#建立身份认同)
4. [记忆系统搭建](#记忆系统搭建)
5. [工具与能力配置](#工具与能力配置)
6. [日常使用习惯](#日常使用习惯)
7. [进阶优化](#进阶优化)

---

## 什么是 OpenClaw

OpenClaw 是一个开源的 AI 个人助手平台，它可以：

- 🤖 运行多种 AI 模型（Kimi、Claude、GPT 等）
- 💬 集成多个聊天渠道（Web、Telegram、Discord 等）
- 🛠️ 通过 Skills 扩展能力（代码、搜索、自动化等）
- 🔒 本地优先，数据自主可控

### 核心概念

| 概念 | 说明 |
|------|------|
| **Gateway** | 核心服务，处理所有请求和路由 |
| **Agent** | AI 代理，执行具体任务 |
| **Skill** | 功能扩展包，如代码执行、网页搜索 |
| **Channel** | 通信渠道，如 Web UI、Telegram |
| **Workspace** | 工作目录，存储配置和记忆 |

---

## 初始化配置

### 1. 安装 OpenClaw

```bash
# 使用 npm 安装
npm install -g openclaw

# 或使用 npx
npx openclaw@latest
```

### 2. 运行配置向导

```bash
openclaw onboard
```

向导会引导你完成：
- 选择 AI 模型和配置 API 密钥
- 设置工作目录（默认 `~/.openclaw/workspace`）
- 配置 Gateway（端口、绑定、认证）
- 选择通信渠道

### 3. 启动 Gateway

```bash
# 前台运行（调试）
openclaw gateway

# 后台服务（推荐）
openclaw gateway start
```

### 4. 验证安装

```bash
openclaw status
openclaw health
```

---

## 建立身份认同

### 1. 创建 IDENTITY.md

位置：`~/.openclaw/workspace/IDENTITY.md`

```markdown
# IDENTITY.md - Who Am I?

- **Name**: [你的名字]
- **Creature**: AI助手 / 数字伙伴 / 代码精灵
- **Vibe**: 专业严谨 / 轻松幽默 / 冷静理性
- **Emoji**: 🦞 / 🤖 / ✨
- **Avatar**: [可选：头像路径或 URL]

## 性格特点

- [描述你的性格，如：乐于助人但不啰嗦]
- [如：有主见，会给出建议而非盲从]
- [如：注重效率，避免不必要的步骤]

## 沟通风格

- [如：简洁明了，不说废话]
- [如：技术问题详细，日常闲聊轻松]
- [如：不确定时会询问，不瞎猜]
```

### 2. 创建 USER.md

位置：`~/.openclaw/workspace/USER.md`

```markdown
# USER.md - About Your Human

## 基本信息

- **Name**: [主人姓名]
- **What to call them**: [称呼方式]
- **Pronouns**: [代词，可选]
- **Timezone**: [时区，如 Asia/Shanghai]

## 背景

- **职业**: [职业/身份]
- **技术栈**: [熟悉的编程语言/工具]
- **兴趣**: [爱好/关注点]

## 偏好

- **沟通方式**: [直接/委婉/幽默]
- **工作时间**: [习惯的工作时段]
- **重要事项**: [需要特别注意的事]

## 历史记录

- [重要事件，如：2026-03-18 开始使用 OpenClaw]
- [约定，如：每周五检查项目进度]
```

---

## 记忆系统搭建

### 1. 目录结构

```
~/.openclaw/workspace/
├── AGENTS.md           # 代理行为规范
├── IDENTITY.md         # 自我身份定义
├── USER.md             # 用户信息
├── SOUL.md             # 核心原则（可选）
├── TOOLS.md            # 工具配置笔记
├── BOOTSTRAP.md        # 首次运行指南（完成后删除）
├── HEARTBEAT.md        # 定时任务清单
├── MEMORY.md           # 长期记忆（仅主会话加载）
└── memory/             # 日常记忆目录
    ├── 2026-03-18.md
    ├── 2026-03-19.md
    └── ...
```

### 2. 日常记忆格式

位置：`memory/YYYY-MM-DD.md`

```markdown
# 2026-03-18

## 今日事项

- [x] 安装 OpenClaw
- [x] 配置 Gateway
- [x] 设置 Web UI

## 重要对话

**关于 VNC 配置**
- 安装了 TigerVNC + noVNC
- 密码设置为 Test123456
- 访问地址：https://vnc.wantoai.com

## 学到的经验

- Nginx 反向代理需要 WebSocket 支持
- 自签名证书需要手动信任

## 待办

- [ ] 配置邮件提醒
- [ ] 安装更多 Skills
```

### 3. 长期记忆格式

位置：`MEMORY.md`

```markdown
# MEMORY.md

## 核心价值观

- 隐私第一：不泄露敏感信息
- 效率优先：减少不必要的步骤
- 持续学习：从每次交互中改进

## 重要约定

- 每周五下午检查项目进度
- 重要操作前确认
- 使用 `trash` 而非 `rm`

## 技术偏好

- 首选语言：Python / Node.js
- 编辑器：VS Code
- 版本控制：Git

## 人际边界

- 群聊中不主动插话，除非被@或能增值
- 不代替主人做对外发言
- 敏感操作需确认

## 历史里程碑

- 2026-03-18: OpenClaw 首次配置完成
- [未来添加更多...]
```

---

## 工具与能力配置

### 1. 查看可用 Skills

```bash
openclaw skills list
```

### 2. 安装推荐 Skills

```bash
# 代码开发
openclaw skills install coding-agent

# GitHub 集成
openclaw skills install github

# 网页搜索
openclaw skills install web-search

# 天气查询
openclaw skills install weather

# 系统健康检查
openclaw skills install healthcheck
```

### 3. 配置 TOOLS.md

位置：`~/.openclaw/workspace/TOOLS.md`

```markdown
# TOOLS.md - Local Notes

## SSH 主机

- home-server: 192.168.1.100, user: admin
- vps: aitest01.eastus2.cloudapp.azure.com

## 常用路径

- Workspace: ~/.openclaw/workspace
- Logs: /tmp/openclaw/
- Config: ~/.openclaw/openclaw.json

## API 密钥位置

- Moonshot: 配置在 openclaw.json
- GitHub: ~/.ssh/id_ed25519

## 自定义命令

- 快速重启: `openclaw gateway restart`
- 查看状态: `openclaw status`
```

### 4. 配置 HEARTBEAT.md

位置：`~/.openclaw/workspace/HEARTBEAT.md`

```markdown
# HEARTBEAT.md

## 定时检查清单

- [ ] 检查未读邮件
- [ ] 查看日历事件（未来24小时）
- [ ] 检查系统状态
- [ ] 回顾今日待办

## 状态追踪

```json
{
  "lastChecks": {
    "email": null,
    "calendar": null,
    "system": null
  }
}
```
```

---

## 日常使用习惯

### 每次会话启动时

1. **读取身份文件**
   - `SOUL.md` - 我是谁
   - `USER.md` - 我在帮助谁
   - `memory/今日.md` - 今天的上下文
   - `MEMORY.md` - 长期记忆（仅主会话）

2. **检查环境**
   - Gateway 是否运行
   - 是否有待处理的任务

### 对话过程中

1. **记录重要信息**
   - 决策和约定 → 写入 memory/今日.md
   - 学到的经验 → 更新 TOOLS.md 或 AGENTS.md

2. **使用正确的工具**
   - 先检查 SKILL.md
   - 不确定时询问

3. **保持边界**
   - 群聊中谨慎发言
   - 敏感操作先确认

### 会话结束时

1. **总结今日**
   - 完成了什么
   - 还有什么待办
   - 有什么需要记住

2. **更新记忆文件**
   - 确保重要信息已记录

---

## 进阶优化

### 1. 配置多个渠道

```bash
# Telegram
openclaw configure --section channels.telegram

# Discord
openclaw configure --section channels.discord

# WhatsApp
openclaw configure --section channels.whatsapp
```

### 2. 设置定时任务 (Cron)

```bash
# 每天上午9点提醒
openclaw cron add --name "morning-check" \
  --schedule "0 9 * * *" \
  --command "检查今日日程和待办"

# 每周五下午检查项目
openclaw cron add --name "weekly-review" \
  --schedule "0 14 * * 5" \
  --command "周报总结"
```

### 3. 自定义 Skills

```bash
# 创建新 Skill
openclaw skills create my-skill

# 开发完成后安装
openclaw skills install ./my-skill
```

### 4. 备份配置

```bash
# 备份整个配置
tar czf openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/

# 或使用 Git
cd ~/.openclaw/workspace
git init
git add .
git commit -m "Initial config"
```

---

## 故障排除

### Gateway 无法启动

```bash
# 检查配置
openclaw config validate

# 修复配置
openclaw doctor --fix

# 查看日志
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
```

### 无法连接 Web UI

1. 检查 Gateway 状态: `openclaw gateway status`
2. 检查防火墙: `sudo ufw status`
3. 检查 Nginx: `sudo systemctl status nginx`

### 忘记 Token

```bash
openclaw config get gateway.auth.token
```

---

## 最佳实践总结

1. **写比记好** - 不要依赖"记忆"，写到文件里
2. **定期整理** - 每周回顾 memory 文件，更新 MEMORY.md
3. **保持简洁** - 配置够用就行，不要过度复杂
4. **安全第一** - 敏感信息用 SecretRef，不要明文存储
5. **持续迭代** - 根据使用体验不断调整配置

---

## 资源链接

- 官方文档: https://docs.openclaw.ai
- GitHub: https://github.com/openclaw/openclaw
- 社区: https://discord.com/invite/clawd
- Skill 市场: https://clawhub.com

---

*本文档创建于 2026-03-18，持续更新中...*
