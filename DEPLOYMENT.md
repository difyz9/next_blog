# 部署指南

本文档介绍如何将项目部署到不同的平台。

## Vercel 部署（推荐）

Vercel 是 Next.js 的官方托管平台，部署非常简单。

### 步骤

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

2. **导入到 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   - `GITHUB_REPO`
   - `GITHUB_TOKEN`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_DESCRIPTION`
   - `NEXT_PUBLIC_SITE_URL`

4. **部署**
   Vercel 会自动构建和部署

### 自动部署

推送到 GitHub 后，Vercel 会自动重新部署。

---

## Netlify 部署

### 步骤

1. **创建 netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **在 Netlify 导入项目**
   - 访问 [netlify.com](https://netlify.com)
   - 点击 "New site from Git"
   - 选择你的仓库

3. **配置环境变量**
   添加相同的环境变量

4. **部署**

---

## Docker 部署

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GITHUB_REPO=username/repo
      - GITHUB_TOKEN=your_token
      - NEXT_PUBLIC_SITE_NAME=My Docs
      - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 构建和运行

```bash
docker-compose up -d
```

---

## 自托管（VPS/服务器）

### 使用 PM2

1. **安装 PM2**
   ```bash
   npm install -g pm2
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **启动应用**
   ```bash
   pm2 start npm --name "next-blog" -- start
   ```

4. **配置开机启动**
   ```bash
   pm2 startup
   pm2 save
   ```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 环境变量管理

### 生产环境

确保在生产环境中设置所有必需的环境变量：

```env
GITHUB_REPO=username/repo
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
NEXT_PUBLIC_SITE_NAME=My Documentation
NEXT_PUBLIC_SITE_DESCRIPTION=A GitHub-powered docs site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 安全注意事项

- 不要将 `.env.local` 提交到 Git
- 使用环境变量管理敏感信息
- 定期更新 GitHub Token
- 使用最小权限原则

---

## 性能优化

### 静态生成

项目默认使用 ISR（增量静态再生成）：

```typescript
export const revalidate = 60; // 60秒后重新验证
```

### 缓存策略

GitHub API 请求已配置缓存：

```typescript
next: { revalidate: 60 }
```

### CDN 配置

建议使用 CDN 加速静态资源：

- Vercel 自动配置 CDN
- Cloudflare 可用于其他平台

---

## 监控和日志

### Vercel Analytics

在 Vercel 项目中启用 Analytics。

### 自定义监控

可以集成：
- Google Analytics
- Sentry（错误追踪）
- LogRocket（用户行为）

---

## 故障排查

### 构建失败

检查：
- Node.js 版本（需要 18+）
- 依赖安装是否完整
- 环境变量是否正确

### 运行时错误

检查：
- GitHub API 配额
- Token 权限
- 网络连接

### 性能问题

- 使用 CDN
- 优化图片
- 启用缓存
