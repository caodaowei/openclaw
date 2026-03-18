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

## 飞书配置

- **App ID**: `cli_a930c774a3b95bc8`
- **用户 ID**: `ou_0e8c4d0568dc8206ab1a2d5c3f8c69e9`
- **群组 ID**: `oc_0bed749388979a695c47d5852b239e7d`

## 项目结构

```
~/src/
├── openclaw/              # OpenClaw 养成计划
│   ├── OpenClaw从零开始养成计划.md
│   └── workspace-backup/  # 配置备份
│       ├── IDENTITY.md
│       ├── USER.md
│       ├── SOUL.md
│       ├── RULES.md
│       ├── HEARTBEAT.md
│       ├── MEMORY.md
│       ├── TOOLS.md
│       └── memory/
│           └── 2026-03-18.md
└── [其他项目...]
```

## 待添加

- [ ] SSH 主机配置
- [ ] 具体项目列表
- [ ] 数据库连接信息
- [ ] 其他 API 密钥位置
- [ ] 自定义脚本/别名

---

_狐狸的工具箱，要井井有条。_
