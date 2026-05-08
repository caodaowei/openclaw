# Hermes + AutoCLI + Obsidian Stack

_小白部署的容器化方案。_

## 部署状态

| 组件 | 状态 | 说明 |
|------|------|------|
| Obsidian Vault | ✅ 运行中 | http://localhost:8080 |
| OpenClaw Main | ✅ 使用宿主机 | 端口 18789 |
| Hermes Agent | ✅ 使用宿主机 | 通过 Main Gateway 调用 |

## 目录结构

```
~/hermes-stack/
├── docker-compose.yml      # 容器编排
├── .env                    # 环境变量
├── README.md               # 本文件
├── config/
│   ├── main/               # Main Agent 配置
│   ├── hermes/             # Hermes Agent 配置
│   └── obsidian/           # Obsidian 配置
├── data/
│   ├── vault/              # Obsidian Vault 文件
│   ├── workspace/          # 共享工作区
│   └── memory/             # 共享记忆
├── logs/                   # 日志目录
└── scripts/
    ├── start.sh            # 启动脚本
    └── stop.sh             # 停止脚本
```

## 使用方法

### 启动
```bash
cd ~/hermes-stack
./scripts/start.sh
```

### 停止
```bash
./scripts/stop.sh
```

### 查看日志
```bash
sudo docker compose logs -f
```

## 访问地址

### 外网 HTTPS（推荐）
- **Obsidian Vault**: https://vault.wantoai.com
  - Username: `admin`
  - Password: `admin12345678`

### 内网 HTTP
- **Obsidian Vault**: http://localhost:8080
- **OpenClaw Gateway**: http://localhost:18789

## Vault 本地路径

Vault 文件存储在：`~/hermes-stack/data/vault/`

可以直接用 Obsidian 桌面版打开此文件夹进行编辑。

## 集成 OpenClaw

在 OpenClaw 中配置 Obsidian skill：

```json
{
  "skills": {
    "entries": {
      "obsidian": {
        "enabled": true,
        "config": {
          "vaultPath": "/home/azureuser/hermes-stack/data/vault"
        }
      }
    }
  }
}
```

---

_部署完成。如需调整配置，告诉小白。_
