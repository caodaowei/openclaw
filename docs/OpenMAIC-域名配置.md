# OpenMAIC 域名配置记录

**日期**: 2026-03-20（周五）  
**时间**: 10:48（北京时间）  
**域名**: openmaic.wantoai.com

---

## 配置内容

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name openmaic.wantoai.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 访问地址

- **域名**: http://openmaic.wantoai.com
- **本地**: http://localhost:3000

---

## 后续配置

- [ ] DNS 解析确认
- [ ] HTTPS/SSL 证书（可选）

---

**配置完成时间**: 2026-03-20 10:48（北京时间）
