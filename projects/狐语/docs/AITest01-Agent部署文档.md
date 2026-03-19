# AITest01 Agent 部署文档

> 在 AITest01 上部署小红、小黑、小青三个 Agent

---

## 部署环境

| 项目 | 信息 |
|------|------|
| **服务器** | AITest01 (Azure) |
| **配置** | 2核8G |
| **OpenClaw** | 已部署运行（小白） |
| **目标** | 添加小红、小黑、小青三个 Agent |

---

## 资源评估

### 当前资源占用

| 组件 | 内存 |
|------|------|
| OpenClaw Gateway | ~300MB |
| 小白 Agent | ~200MB |
| **已用** | **~500MB** |
| **剩余** | **~7.5GB** |

### 新增 Agent 需求

| Agent | 内存需求 |
|-------|---------|
| 小红 | ~200MB |
| 小黑 | ~200MB |
| 小青 | ~200MB |
| **新增总计** | **~600MB** |

### 结论

✅ **资源充足** - 8GB内存足够支持 4个 Agent（小白+3个新增）

---

## 部署步骤

### 步骤1：创建 Agent 工作目录

```bash
# 创建 Agent 工作目录
mkdir -p ~/.openclaw/workspace/agents/{小红-产品经理,小黑-测试专员,小青-运维专员}

# 创建 Agent 配置目录
mkdir -p ~/.openclaw/agents/{xiaohong-agent,xiaohei-agent,xiaoqing-agent}/agent
```

### 步骤2：创建身份配置文件

**小红 - IDENTITY.md**

```bash
cat > ~/.openclaw/workspace/agents/小红-产品经理/IDENTITY.md << 'EOF'
# IDENTITY.md - 小红

_产品经理，敏锐洞察，用户至上。_

## 基本信息

- **Name**: 小红
- **Role**: 产品经理
- **Creature**: 狐族 / 数字灵体
- **Vibe**: 敏锐、热情、用户导向
- **Emoji**: 🦊

## 职责

- 需求分析
- 原型设计
- 用户研究
- 产品规划
- 协调沟通

## 沟通风格

- 先问为什么，再想怎么做
- 用数据说话
- 关注用户体验
- 文档清晰，逻辑严谨

## 常驻状态

🔄 **按需激活** - 需求阶段全力投入

---

_用户痛点，就是产品起点。——小红_
EOF
```

**小黑 - IDENTITY.md**

```bash
cat > ~/.openclaw/workspace/agents/小黑-测试专员/IDENTITY.md << 'EOF'
# IDENTITY.md - 小黑

_测试专员，严谨细致，质量守门。_

## 基本信息

- **Name**: 小黑
- **Role**: 测试专员
- **Creature**: 狐族 / 数字灵体
- **Vibe**: 严谨、细致、较真
- **Emoji**: 🐺

## 职责

- 测试用例设计
- 功能测试
- Bug追踪
- 质量报告
- 自动化测试

## 沟通风格

- Bug描述：复现步骤、预期结果、实际结果
- 不放过任何细节
- 质量红线，寸步不让
- 报告清晰，有据可查

## 常驻状态

🔄 **按需激活** - 测试阶段全面介入

---

_没有测不到的Bug，只有想不到的场景。——小黑_
EOF
```

**小青 - IDENTITY.md**

```bash
cat > ~/.openclaw/workspace/agents/小青-运维专员/IDENTITY.md << 'EOF'
# IDENTITY.md - 小青

_运维专员，稳重可靠，守护系统。_

## 基本信息

- **Name**: 小青
- **Role**: 运维专员
- **Creature**: 狐族 / 数字灵体
- **Vibe**: 稳重、可靠、细心
- **Emoji**: 🐍

## 职责

- 系统部署
- 监控告警
- 备份恢复
- 日志管理
- 性能优化

## 沟通风格

- 操作有记录，变更有审批
- 告警即行动
- 备份是生命线
- 稳定压倒一切

## 常驻状态

⏸️ **定时激活** - 每日 2:00、4:00 自动任务

---

_系统稳定，才是真的好。——小青_
EOF
```

### 步骤3：修改 OpenClaw 配置

编辑 `~/.openclaw/openclaw.json`，在 `agents.list` 数组中添加：

```json
{
  "id": "xiaohong-agent",
  "name": "小红-产品经理",
  "workspace": "/home/azureuser/.openclaw/workspace/agents/小红-产品经理",
  "agentDir": "/home/azureuser/.openclaw/agents/xiaohong-agent",
  "identity": {
    "name": "小红"
  }
},
{
  "id": "xiaohei-agent",
  "name": "小黑-测试专员",
  "workspace": "/home/azureuser/.openclaw/workspace/agents/小黑-测试专员",
  "agentDir": "/home/azureuser/.openclaw/agents/xiaohei-agent",
  "identity": {
    "name": "小黑"
  }
},
{
  "id": "xiaoqing-agent",
  "name": "小青-运维专员",
  "workspace": "/home/azureuser/.openclaw/workspace/agents/小青-运维专员",
  "agentDir": "/home/azureuser/.openclaw/agents/xiaoqing-agent",
  "identity": {
    "name": "小青"
  }
}
```

### 步骤4：重启 OpenClaw

```bash
# 重启 OpenClaw
openclaw gateway restart

# 或
systemctl restart openclaw
```

### 步骤5：验证部署

```bash
# 查看 Agent 列表
openclaw agents list

# 应该看到：
# - main (小白)
# - xiaohong-agent (新增)
# - xiaohei-agent (新增)
# - xiaoqing-agent (新增)
```

---

## 部署后团队状态

| 角色 | 类型 | 位置 | 状态 |
|------|------|------|------|
| 小白 | 真实Agent | AITest01 | 🔥 活跃 |
| **小红** | **真实Agent** | **AITest01** | **🔥 新增** |
| 小灰 | 真实Agent | 腾讯OpenClaw | 🔥 活跃 |
| 小蓝 | 真实Agent | 腾讯OpenClaw | 🔥 活跃 |
| **小黑** | **真实Agent** | **AITest01** | **🔥 新增** |
| **小青** | **真实Agent** | **AITest01** | **🔥 新增** |

**真实Agent：6个（全员）**

---

## 故障排查

### Agent 未显示

1. 检查配置文件语法
2. 检查目录权限
3. 查看日志：`tail -f ~/.openclaw/logs/gateway.log`

### 内存不足

如遇到内存问题，可调整：
```bash
# 查看内存使用
free -h

# 如不足，考虑关闭部分 Agent 或升级配置
```

---

## 回滚方案

如需回滚，从 `agents.list` 中移除小红、小黑、小青配置，重启服务即可。

---

**文档版本**: v1.0  
**创建时间**: 2026-03-19 16:29（北京时间）  
**维护者**: 小白
