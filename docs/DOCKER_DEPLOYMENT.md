# AITest01 Docker 部署清单

> 最后更新: 2026-03-23

---

## 运行中的容器

### 1. FoxChat Backend
| 属性 | 值 |
|------|-----|
| **容器名** | foxchat-backend |
| **镜像** | foxchat-backend (本地构建) |
| **状态** | ✅ Up 19 minutes |
| **主机端口** | 7001 |
| **容器端口** | 7001 |
| **项目路径** | `~/src/foxchat/backend` |
| **Compose 文件** | `~/src/foxchat/docker-compose.yml` |

**环境变量**:
```
NODE_ENV=production
PORT=7001
HOST=0.0.0.0
DATABASE_URL=postgresql://foxchat:foxchat123@10.2.0.4:7801/foxchat
JWT_SECRET=foxchat-production-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:7002
```

**启动命令**:
```bash
cd ~/src/foxchat && sudo docker compose up -d backend
```

---

### 2. FoxChat Frontend
| 属性 | 值 |
|------|-----|
| **容器名** | foxchat-frontend |
| **镜像** | foxchat-frontend (本地构建) |
| **状态** | ✅ Up 19 minutes |
| **主机端口** | 7002 |
| **容器端口** | 80 (Nginx) |
| **项目路径** | `~/src/foxchat/frontend` |
| **Compose 文件** | `~/src/foxchat/docker-compose.yml` |

**环境变量**:
```
VITE_API_URL=http://localhost:7001/api
```

**Nginx 代理配置**:
- `/api` → `http://foxchat-backend:7001`
- `/` → 静态文件

**启动命令**:
```bash
cd ~/src/foxchat && sudo docker compose up -d frontend
```

---

### 3. PostgreSQL
| 属性 | 值 |
|------|-----|
| **容器名** | openclaw-postgres |
| **镜像** | postgres:15-alpine |
| **状态** | ✅ Up 20 minutes |
| **主机端口** | 7801 |
| **容器端口** | 5432 |
| **数据卷** | 命名卷 (Docker 管理) |

**环境变量**:
```
POSTGRES_USER=foxchat
POSTGRES_PASSWORD=foxchat123
POSTGRES_DB=foxchat
```

**启动命令**:
```bash
sudo docker run -d --name openclaw-postgres \
  -e POSTGRES_USER=foxchat \
  -e POSTGRES_PASSWORD=foxchat123 \
  -e POSTGRES_DB=foxchat \
  -p 7801:5432 postgres:15-alpine
```

**连接信息**:
- Host: localhost:7801
- Database: foxchat
- User: foxchat
- Password: foxchat123

---

### 4. OpenMAIC
| 属性 | 值 |
|------|-----|
| **容器名** | openmaic-openmaic-1 |
| **镜像** | openmaic-openmaic (本地构建) |
| **状态** | ✅ Up 10 minutes |
| **主机端口** | 7901 |
| **容器端口** | 3000 (Next.js) |
| **项目路径** | `~/tools/OpenMAIC` |
| **Compose 文件** | `~/tools/OpenMAIC/docker-compose.yml` |
| **数据卷** | openmaic-data (命名卷) |

**环境变量** (部分):
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
ANTHROPIC_API_KEY=sk-***
ANTHROPIC_BASE_URL=https://ai-apihub.itinfolab.cn/v1/chat/completions
ANTHROPIC_MODELS=claude-sonnet-4-6
```

**启动命令**:
```bash
cd ~/tools/OpenMAIC && sudo docker compose up -d
```

---

## 端口汇总

| 服务 | 端口 | 范围 | 类型 |
|------|------|------|------|
| FoxChat Backend | 7001 | 7001-7799 | 自研应用 |
| FoxChat Frontend | 7002 | 7001-7799 | 自研应用 |
| PostgreSQL | 7801 | 7801-7999 | 数据库 |
| OpenMAIC | 7901 | 7801-7999 | 第三方开源 |

---

## 常用操作

### 查看所有容器
```bash
sudo docker ps -a
```

### 查看容器日志
```bash
sudo docker logs foxchat-backend --tail 50
sudo docker logs foxchat-frontend --tail 50
sudo docker logs openclaw-postgres --tail 50
sudo docker logs openmaic-openmaic-1 --tail 50
```

### 重启服务
```bash
# FoxChat
cd ~/src/foxchat && sudo docker compose restart

# OpenMAIC
cd ~/tools/OpenMAIC && sudo docker compose restart
```

### 停止服务
```bash
# FoxChat
cd ~/src/foxchat && sudo docker compose down

# OpenMAIC
cd ~/tools/OpenMAIC && sudo docker compose down

# PostgreSQL
sudo docker stop openclaw-postgres
```

### 进入容器
```bash
# FoxChat Backend
sudo docker exec -it foxchat-backend sh

# PostgreSQL
sudo docker exec -it openclaw-postgres psql -U foxchat -d foxchat
```

---

## 数据持久化

| 服务 | 数据卷 | 说明 |
|------|--------|------|
| PostgreSQL | Docker 命名卷 | 自动管理，容器删除数据保留 |
| OpenMAIC | openmaic-data | 挂载到 /app/data |
| FoxChat | 无 | 纯计算服务，无持久化数据 |

**查看数据卷**:
```bash
sudo docker volume ls
```

---

## 网络配置

所有容器使用 Docker 默认 bridge 网络:
- `foxchat_default` - FoxChat 服务网络
- `openmaic_default` - OpenMAIC 服务网络

**查看网络**:
```bash
sudo docker network ls
sudo docker network inspect foxchat_default
```

---

## 更新记录

| 日期 | 变更 |
|------|------|
| 2026-03-23 | 初始整理，4个容器运行中 |

