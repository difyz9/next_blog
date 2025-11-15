# 环境变量配置示例

## 📋 配置文件：`.env.local`

复制以下内容到 `next_blog/.env.local`：

```env
# ============================================
# 数据源配置
# ============================================

# 数据源类型
# - 'github-api': 实时从 GitHub API 获取（开发模式）
# - 'pre-rendered': 使用预渲染 JSON（生产模式，快 10-20 倍）
DATA_SOURCE=pre-rendered

# 预渲染版本
# - 'latest': 使用最新渲染版本（自动更新）
# - 'v1.0.0': 使用特定 tag 版本（版本锁定）
RENDERED_VERSION=latest

# ============================================
# GitHub 仓库配置
# ============================================

# 文档仓库（格式：owner/repo）
GITHUB_REPO=difyz9/QuickNote

# GitHub Personal Access Token
# 创建方法：GitHub Settings → Developer settings → Personal access tokens
# 权限：repo (read-only)
GITHUB_TOKEN=ghp_your_token_here

# ============================================
# 站点配置
# ============================================

# 站点名称
NEXT_PUBLIC_SITE_NAME=我的文档站

# 站点描述
NEXT_PUBLIC_SITE_DESCRIPTION=基于 GitHub 的文档管理系统

# 站点 URL（生产环境）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# ============================================
# 缓存刷新配置（可选）
# ============================================

# Revalidate API 密钥
# 用于手动刷新缓存
REVALIDATE_SECRET=your_random_secret_string_here

# ============================================
# 开发配置（可选）
# ============================================

# 端口号
# PORT=3001

# Node 环境
# NODE_ENV=development
```

---

## 🎯 配置场景

### 场景 1：本地开发（推荐）

```env
# 实时查看文档更新
DATA_SOURCE=github-api
GITHUB_REPO=your-username/your-docs-repo
GITHUB_TOKEN=ghp_xxxxx
```

**特点**：
- ✅ 实时更新
- ✅ 无需推送 tag
- ❌ 加载较慢（2秒）
- ❌ 受 API 限制

### 场景 2：本地测试预渲染

```env
# 测试生产环境性能
DATA_SOURCE=pre-rendered
RENDERED_VERSION=latest
GITHUB_REPO=your-username/your-docs-repo
GITHUB_TOKEN=ghp_xxxxx
```

**特点**：
- ✅ 极速加载（0.1秒）
- ✅ 真实生产体验
- ❌ 需要推送 tag
- ✅ 无 API 限制

### 场景 3：生产部署

```env
# Vercel/Netlify 环境变量
DATA_SOURCE=pre-rendered
RENDERED_VERSION=latest
GITHUB_REPO=your-username/your-docs-repo
GITHUB_TOKEN=ghp_xxxxx
NEXT_PUBLIC_SITE_NAME=Production Docs
NEXT_PUBLIC_SITE_URL=https://docs.yoursite.com
REVALIDATE_SECRET=production_secret_123
```

**特点**：
- ✅ 最佳性能
- ✅ 稳定可靠
- ✅ CDN 加速
- ✅ 自动更新

### 场景 4：多环境分离

#### `.env.development`（开发）
```env
DATA_SOURCE=github-api
GITHUB_REPO=your-username/your-docs-repo
GITHUB_TOKEN=ghp_dev_token
```

#### `.env.staging`（预发布）
```env
DATA_SOURCE=pre-rendered
RENDERED_VERSION=latest
GITHUB_REPO=your-username/your-docs-repo
GITHUB_TOKEN=ghp_staging_token
```

#### `.env.production`（生产）
```env
DATA_SOURCE=pre-rendered
RENDERED_VERSION=v1.0.0
GITHUB_REPO=your-username/your-docs-repo
GITHUB_TOKEN=ghp_prod_token
```

---

## 🔐 安全建议

### 1. 保护 Token

```bash
# ❌ 不要提交到 Git
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore

# ✅ 使用环境变量（生产）
export GITHUB_TOKEN=ghp_xxxxx
```

### 2. 限制 Token 权限

创建 Token 时只勾选：
- ✅ `repo` → `public_repo`（如果是公开仓库）
- ❌ 不需要其他权限

### 3. 定期轮换 Secret

```bash
# 每 90 天更换一次
REVALIDATE_SECRET=$(openssl rand -hex 32)
```

---

## ⚙️ 高级配置

### 自定义文档路径

如果文档不在 `docs/` 目录：

```javascript
// blog.config.ts
github: {
  docsPath: 'documentation', // 改为实际路径
}
```

同时修改 `.github/scripts/render.js`：

```javascript
const DOCS_DIR = 'documentation';
```

### 多仓库支持

```env
# 主文档仓库
GITHUB_REPO=org/main-docs
GITHUB_TOKEN=ghp_main_token

# API 文档仓库（需要代码修改）
GITHUB_REPO_API=org/api-docs
GITHUB_TOKEN_API=ghp_api_token
```

### 版本分支策略

```env
# 使用特定分支的预渲染
# 需要修改 blog.config.ts 的 preRendered.branchPrefix
RENDERED_VERSION=v2.0.0
```

---

## 🧪 测试配置

验证配置是否正确：

```bash
# 1. 检查环境变量
node -e "console.log(require('dotenv').config())"

# 2. 测试 GitHub 连接
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$GITHUB_REPO

# 3. 测试预渲染数据
curl https://raw.githubusercontent.com/$GITHUB_REPO/rendered/latest/rendered/metadata.json

# 4. 启动项目
npm run dev
```

---

## 📊 性能对比

| 配置 | 首次加载 | 后续访问 | API 调用 | 推荐场景 |
|------|---------|---------|---------|---------|
| **github-api** | ~2000ms | ~500ms | 每次 | 开发调试 |
| **pre-rendered + latest** | ~200ms | ~50ms | 零 | 生产环境 |
| **pre-rendered + v1.0.0** | ~200ms | ~50ms | 零 | 版本锁定 |

---

## 🆘 常见问题

### Q1: Token 无效

**检查**：
```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user
```

**解决**：重新生成 Token

### Q2: 无法获取预渲染数据

**检查**：
```bash
# 确认分支存在
git ls-remote https://github.com/$GITHUB_REPO | grep rendered

# 确认文件存在
curl -I https://raw.githubusercontent.com/$GITHUB_REPO/rendered/latest/rendered/metadata.json
```

**解决**：推送 tag 触发 Actions

### Q3: 环境变量未生效

```bash
# 重启开发服务器
pkill -f "next dev"
npm run dev
```

---

## 📝 检查清单

部署前确认：

- [ ] `.env.local` 文件已创建
- [ ] `GITHUB_TOKEN` 已设置且有效
- [ ] `GITHUB_REPO` 格式正确（owner/repo）
- [ ] `DATA_SOURCE` 已选择
- [ ] `RENDERED_VERSION` 已配置（如使用预渲染）
- [ ] `.env.local` 已添加到 `.gitignore`
- [ ] 生产环境已配置环境变量

---

**需要帮助？查看 [完整文档](./GITHUB_ACTIONS_SETUP.md)**
