# Hermes + AutoCLI + Obsidian 容器化部署方案

_小白整理的部署文档，供大哥参考。_

## 架构概述

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Compose                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  openclaw-main  │    │  openclaw-hermes│                │
│  │  ─────────────  │    │  ───────────────│                │
│  │  • Gateway      │    │  • Hermes Agent │                │
│  │  • Main Agent   │    │  • AutoCLI Skill│                │
│  │  • Feishu Bot   │    │  • 工具执行     │                │
│  │  • Web UI       │    │                 │                │
│  │  Port: 18789    │    │                 │                │
│  └────────┬────────┘    └────────┬────────┘                │
│           │                      │                          │
│           │    ┌─────────────┐   │                          │
│           └───►│  Shared Vol │◄──┘                          │
│                │  ───────────│                               │
│                │  workspace  │                               │
│                │  memory     │                               │
│                │  config     │                               │
│                └──────┬──────┘                               │
│                       │                                      │
│  ┌────────────────────┼─────────────────┐                   │
│  │  ┌─────────────────▼─────────────┐   │                   │
│  │  │      obsidian-vault           │   │                   │
│  │  │      ─────────────            │   │                   │
│  │  │      • Markdown 文件存储      │   │                   │
│  │  │      • WebDAV 服务            │   │                   │
│  │  │      Port: 8080               │   │                   │
│  │  └───────────────────────────────┘   │                   │
│  │         (可选组件)                    │                   │
│  └──────────────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 组件说明

| 组件 | 用途 | 镜像 | 端口 |
|------|------|------|------|
| openclaw-main | 主 Gateway + Main Agent | openclay/openclaw:latest | 18789 |
| openclaw-hermes | Hermes Agent + AutoCLI | openclay/openclaw:latest | - |
| obsidian-vault | 笔记存储 + WebDAV | filebrowser/filebrowser | 8080 |

## 目录结构

```
hermes-stack/
├── docker-compose.yml          # 主编排文件
├── .env                        # 环境变量
├── config/
│   ├── main/                   # Main Agent 配置
│   │   ├── openclaw.json
│   │   ├── workspace/
│   │   └── memory/
│   ├── hermes/                 # Hermes Agent 配置
│   │   ├── openclaw.json
│   │   └── workspace/
│   └── obsidian/
│       └── filebrowser.json    # Obsidian vault 配置
├── data/
│   ├── workspace/              # 共享工作区
│   ├── memory/                 # 共享记忆
│   └── vault/                  # Obsidian vault
└── scripts/
    ├── init.sh                 # 初始化脚本
    └── backup.sh               # 备份脚本
```

## 配置文件

### 1. docker-compose.yml

```yaml
version: '3.8'

services:
  # ============================================
  # OpenClaw Main - 主 Gateway
  # ============================================
  openclaw-main:
    image: openclaw/openclaw:latest
    container_name: openclaw-main
    restart: unless-stopped
    ports:
      - "${GATEWAY_PORT:-18789}:18789"
    volumes:
      - ./config/main/openclaw.json:/root/.openclaw/openclaw.json:ro
      - ./data/workspace:/root/.openclaw/workspace
      - ./data/memory:/root/.openclaw/memory
      - ./logs/main:/tmp/openclaw
    environment:
      - NODE_COMPILE_CACHE=/tmp/node-cache
      - OPENCLAW_NO_RESPAWN=1
      - OPENCLAW_AGENT=main
    networks:
      - openclaw-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:18789/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ============================================
  # OpenClaw Hermes - 工具执行 Agent
  # ============================================
  openclaw-hermes:
    image: openclaw/openclaw:latest
    container_name: openclaw-hermes
    restart: unless-stopped
    volumes:
      - ./config/hermes/openclaw.json:/root/.openclaw/openclaw.json:ro
      - ./data/workspace:/root/.openclaw/workspace:ro
      - ./data/memory:/root/.openclaw/memory:rw
      - ./logs/hermes:/tmp/openclaw
      # AutoCLI 需要访问宿主机的命令行工具
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /usr/bin:/host/usr/bin:ro
      - /bin:/host/bin:ro
    environment:
      - NODE_COMPILE_CACHE=/tmp/node-cache
      - OPENCLAW_NO_RESPAWN=1
      - OPENCLAW_AGENT=hermes
      # 让 Hermes 可以执行宿主机的命令
      - PATH=/host/usr/bin:/host/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    networks:
      - openclaw-net
    profiles:
      - hermes
    depends_on:
      - openclaw-main

  # ============================================
  # Obsidian Vault - 笔记存储
  # ============================================
  obsidian-vault:
    image: filebrowser/filebrowser:v2-s6
    container_name: obsidian-vault
    restart: unless-stopped
    ports:
      - "${VAULT_PORT:-8080}:80"
    volumes:
      - ./data/vault:/srv
      - ./config/obsidian/filebrowser.json:/config/settings.json:ro
      - ./data/vault/database.db:/database.db
    environment:
      - FB_BASEURL=/
      - FB_DATABASE=/database.db
    networks:
      - openclaw-net
    profiles:
      - obsidian

networks:
  openclaw-net:
    driver: bridge
```

### 2. .env

```bash
# ============================================
# OpenClaw Stack 环境变量
# ============================================

# 端口配置
GATEWAY_PORT=18789
VAULT_PORT=8080

# Agent 配置
ENABLE_HERMES=true
ENABLE_OBSIDIAN=true

# 时区
TZ=Asia/Shanghai

# 日志级别
LOG_LEVEL=info
```

### 3. Hermes Agent 配置 (config/hermes/openclaw.json)

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-k2.5"
      },
      "workspace": "/root/.openclaw/workspace"
    },
    "list": [
      {
        "id": "hermes",
        "name": "Hermes-Agent",
        "identity": {
          "name": "Hermes"
        },
        "model": "moonshot/kimi-k2.5"
      }
    ]
  },
  "tools": {
    "profile": "full",
    "exec": {
      "host": "gateway",
      "security": "full",
      "ask": "off"
    }
  },
  "skills": {
    "entries": {
      "autocli": {
        "enabled": true,
        "config": {
          "allowedCommands": ["git", "docker", "npm", "node", "curl", "grep", "awk", "sed"],
          "blockedCommands": ["rm -rf /", "mkfs", "dd"],
          "timeout": 30000
        }
      },
      "obsidian": {
        "enabled": true,
        "config": {
          "vaultPath": "/root/.openclaw/workspace/vault",
          "dailyNotesFolder": "Daily",
          "templatesFolder": "Templates"
        }
      }
    }
  },
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "lan",
    "auth": {
      "mode": "token",
      "token": "${GATEWAY_TOKEN}"
    }
  }
}
```

### 4. Obsidian FileBrowser 配置 (config/obsidian/filebrowser.json)

```json
{
  "port": 80,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/database.db",
  "root": "/srv",
  "auth": {
    "method": "json",
    "signup": false
  },
  "defaults": {
    "scope": ".",
    "locale": "zh-cn",
    "viewMode": "list",
    "singleClick": false,
    "sorting": {
      "by": "name",
      "asc": false
    },
    "perm": {
      "admin": true,
      "execute": true,
      "create": true,
      "rename": true,
      "modify": true,
      "delete": true,
      "share": true,
      "download": true
    }
  },
  "users": [
    {
      "username": "admin",
      "password": "$2a$10$...", 
      "scope": ".",
      "locale": "zh-cn",
      "viewMode": "list"
    }
  ]
}
```

## 部署步骤

### 1. 初始化目录

```bash
# 创建项目目录
mkdir -p hermes-stack/{config/{main,hermes,obsidian},data/{workspace,memory,vault},logs/{main,hermes},scripts}
cd hermes-stack

# 复制现有配置（如果有）
cp ~/.openclaw/openclaw.json config/main/
cp -r ~/.openclaw/workspace/* data/workspace/ 2>/dev/null || true
cp -r ~/.openclaw/memory/* data/memory/ 2>/dev/null || true
```

### 2. 生成密钥

```bash
# 生成 Gateway Token
export GATEWAY_TOKEN=$(openssl rand -hex 32)
echo "GATEWAY_TOKEN=$GATEWAY_TOKEN" >> .env

# 生成 Obsidian admin 密码（使用 bcrypt）
# 可以使用在线工具或 node 生成
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

### 3. 启动服务

```bash
# 启动基础服务（Main Gateway）
docker-compose up -d

# 启动 Hermes（带 AutoCLI）
docker-compose --profile hermes up -d

# 启动 Obsidian Vault
docker-compose --profile obsidian up -d

# 全部启动
docker-compose --profile hermes --profile obsidian up -d
```

### 4. 验证部署

```bash
# 检查容器状态
docker-compose ps

# 查看日志
docker-compose logs -f openclaw-main
docker-compose logs -f openclaw-hermes

# 测试 Gateway
curl http://localhost:18789/status

# 访问 Obsidian Vault
open http://localhost:8080
```

## 使用方式

### 通过 Main Agent 调用 Hermes

```javascript
// 在 Main Agent 中调用 Hermes
const result = await sessions_spawn({
  task: "执行 git status 并分析结果",
  agentId: "hermes",
  runtime: "subagent"
});
```

### AutoCLI 使用示例

```
# 在 Hermes Agent 中执行
Hermes> 帮我查看当前目录的 git 状态
Hermes> 运行 docker ps 看看有哪些容器在运行
Hermes> 用 npm 安装 lodash 包
```

### Obsidian 集成

```
# 创建每日笔记
小白> 在 Obsidian 中创建今天的日记

# 搜索笔记
小白> 在我的 vault 中搜索关于 Docker 的笔记

# 整理笔记
小白> 帮我把 workspace 下的会议记录整理到 Obsidian
```

## 备份策略

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/backup/hermes-stack/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# 备份配置
cp -r config "$BACKUP_DIR/"

# 备份数据
cp -r data "$BACKUP_DIR/"

# 备份 vault
tar czf "$BACKUP_DIR/vault.tar.gz" data/vault/

# 清理旧备份（保留 7 天）
find /backup/hermes-stack -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null

echo "Backup completed: $BACKUP_DIR"
```

## 常见问题

### Q: Hermes 无法执行宿主机命令？
A: 确保挂载了 docker.sock 和宿主机的 /usr/bin、/bin 目录。

### Q: Obsidian vault 如何同步到本地？
A: 可以使用 Obsidian 的 WebDAV 插件连接到 http://localhost:8080

### Q: 如何更新配置？
A: 修改 config/ 下的文件后，重启对应容器：`docker-compose restart openclaw-hermes`

### Q: 内存不足？
A: 在 .env 中添加 `NODE_OPTIONS=--max-old-space-size=512` 限制 Node 内存使用。

## 扩展建议

1. **添加 Traefik 反向代理** - 支持 HTTPS 和域名访问
2. **集成 Prometheus 监控** - 监控 Gateway 性能
3. **配置自动 SSL** - 使用 Let's Encrypt
4. **添加 Redis 缓存** - 提升响应速度

---

_文档整理完毕。大哥需要小白生成具体的配置文件或脚本吗？_
