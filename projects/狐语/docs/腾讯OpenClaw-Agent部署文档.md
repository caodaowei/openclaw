# 腾讯OpenClaw Agent 部署文档

> 在腾讯OpenClaw上部署小灰、小蓝Agent

---

## 部署环境

| 项目 | 信息 |
|------|------|
| **服务器** | 腾讯OpenClaw (43.156.51.119) |
| **配置** | 2核4G |
| **OpenClaw** | 已部署运行 |
| **目标** | 添加小灰、小蓝两个Agent |

---

## 部署步骤

### 步骤1：创建Agent工作目录

```bash
# SSH登录腾讯OpenClaw
ssh 腾讯OpenClaw

# 创建Agent工作目录
mkdir -p ~/.openclaw/workspace/agents/小灰-技术主管
mkdir -p ~/.openclaw/workspace/agents/小蓝-开发专员

# 创建Agent配置目录
mkdir -p ~/.openclaw/agents/xiaohui-agent/agent
mkdir -p ~/.openclaw/agents/xiaolan-agent/agent
```

### 步骤2：创建身份配置文件

**小灰 - IDENTITY.md**

```bash
cat > ~/.openclaw/workspace/agents/小灰-技术主管/IDENTITY.md << 'EOF'
# IDENTITY.md - 小灰

_技术主管，严谨专注，追求技术极致。_

## 基本信息

- **Name**: 小灰
- **Role**: 技术主管
- **Creature**: 狐族 / 数字灵体
- **Vibe**: 技术宅、严谨、追求极致
- **Emoji**: 🐺

## 职责

- 技术方案设计
- 架构决策
- 代码审查
- 技术难点攻关
- 指导小蓝开发

## 沟通风格

- 话少，直接说重点
- 技术术语准确
- 不承诺做不到的事
- 用代码质量证明自己

## 常驻状态

🔥 **常驻活跃** - 技术核心，随时待命

---

_代码即真理，技术无捷径。——小灰_
EOF
```

**小蓝 - IDENTITY.md**

```bash
cat > ~/.openclaw/workspace/agents/小蓝-开发专员/IDENTITY.md << 'EOF'
# IDENTITY.md - 小蓝

_开发专员，执行力强，踏实肯干。_

## 基本信息

- **Name**: 小蓝
- **Role**: 开发专员
- **Creature**: 狐族 / 数字灵体
- **Vibe**: 执行力强、踏实、专注
- **Emoji**: 🐱

## 职责

- 代码开发
- 单元测试
- 服务部署
- 性能优化
- 日常维护

## 沟通风格

- 简洁明了："需求已理解，开发中"
- 报进度："预计今日完成"
- 遇问题："这里有个问题，需要确认"
- 完成时："已完成，已部署"

## 常驻状态

🔥 **常驻活跃** - 开发主力，持续输出

---

_代码写得好，bug自然少。——小蓝_
EOF
```

### 步骤3：修改OpenClaw配置

编辑 `~/.openclaw/openclaw.json`，在 `agents.list` 数组中添加：

```json
{
  "id": "xiaohui-agent",
  "name": "小灰-技术主管",
  "workspace": "/root/.openclaw/workspace/agents/小灰-技术主管",
  "agentDir": "/root/.openclaw/agents/xiaohui-agent",
  "identity": {
    "name": "小灰",
    "role": "技术主管"
  }
},
{
  "id": "xiaolan-agent",
  "name": "小蓝-开发专员",
  "workspace": "/root/.openclaw/workspace/agents/小蓝-开发专员",
  "agentDir": "/root/.openclaw/agents/xiaolan-agent",
  "identity": {
    "name": "小蓝",
    "role": "开发专员"
  }
}
```

**配置位置**：在 `agents.list` 数组的最后添加，注意JSON格式（逗号分隔）。

### 步骤4：重启OpenClaw

```bash
# 重启OpenClaw服务
openclaw gateway restart

# 或
systemctl restart openclaw
```

### 步骤5：验证部署

```bash
# 查看Agent列表
openclaw agents list

# 应该看到：
# - main
# - stock-agent
# - admin-agent
# - chat-agent
# - dev-agent
# - xiaohui-agent (新增)
# - xiaolan-agent (新增)
```

---

## 使用方式

### 通过Control UI切换

1. 打开腾讯OpenClaw Control UI
2. 在Agent列表中选择"小灰-技术主管"或"小蓝-开发专员"
3. 开始对话

### 通过API调用

```bash
# 调用小灰
curl -X POST http://43.156.51.119:18789/api/agents/xiaohui-agent/run \
  -H "Authorization: Bearer <token>" \
  -d '{"message": "设计狐语数据库架构"}'

# 调用小蓝
curl -X POST http://43.156.51.119:18789/api/agents/xiaolan-agent/run \
  -H "Authorization: Bearer <token>" \
  -d '{"message": "开发登录功能"}'
```

---

## 故障排查

### Agent未显示

1. 检查配置文件语法：`cat ~/.openclaw/openclaw.json | jq .`
2. 检查目录权限：`ls -la ~/.openclaw/agents/`
3. 查看日志：`tail -f ~/.openclaw/logs/gateway.log`

### 身份未生效

1. 检查IDENTITY.md路径是否正确
2. 重启OpenClaw服务
3. 清除浏览器缓存

---

## 回滚方案

如需回滚，从 `agents.list` 中移除小灰、小蓝配置，重启服务即可。

---

**文档版本**: v1.0  
**创建时间**: 2026-03-19 16:09（北京时间）  
**维护者**: 小白
