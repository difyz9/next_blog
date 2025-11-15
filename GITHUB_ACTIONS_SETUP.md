# GitHub Actions 预渲染部署指南

## 📋 概述

这个方案通过 GitHub Actions 自动将 Markdown 文档预渲染为 JSON 格式，实现：
- ✅ **10-20倍性能提升** - 无需实时处理 Markdown
- ✅ **零侵入** - 仅需在文档仓库配置 Actions
- ✅ **自动化** - 推送 tag 自动触发渲染
- ✅ **版本控制** - 支持多版本文档共存

---

## 🚀 快速开始

### 1. 在文档仓库添加 Actions 配置

将以下两个文件复制到您的**文档仓库**（如 `difyz9/QuickNote`）：

#### 📁 `.github/workflows/render-docs.yml`

```yaml
name: Render Documentation

on:
  push:
    tags:
      - 'v*'  # 匹配 v1.0.0, v2.1.3 等版本标签
      - '*'   # 或匹配所有 tag

jobs:
  render:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm install gray-matter@4.0.3
          npm install remark@15.0.1
          npm install remark-gfm@4.0.0
          npm install remark-parse@11.0.0
          npm install remark-rehype@11.1.1
          npm install rehype-prism-plus@2.0.0
          npm install rehype-sanitize@6.0.0
          npm install rehype-stringify@10.0.1
          npm install unified@11.0.5
      
      - name: Render Markdown to JSON
        run: node .github/scripts/render.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Get tag name
        id: tag
        run: echo "TAG_NAME=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT
      
      - name: Commit rendered files
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          
          git checkout -b rendered/${{ steps.tag.outputs.TAG_NAME }}
          git add rendered/
          git commit -m "🚀 Render docs for tag ${{ steps.tag.outputs.TAG_NAME }}"
          git push origin rendered/${{ steps.tag.outputs.TAG_NAME }}
      
      - name: Create or update latest branch
        run: |
          git branch -f rendered/latest
          git push origin rendered/latest --force
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: rendered-docs-${{ steps.tag.outputs.TAG_NAME }}
          path: rendered/
          retention-days: 30
```

#### 📁 `.github/scripts/render.js`

将 `next_blog/.github/scripts/render.js` 文件内容复制到文档仓库的相同位置。

**重要**：确保 `render.js` 中的 `DOCS_DIR` 配置与您的文档目录匹配（默认是 `docs`）。

---

### 2. 在 Next.js 项目配置数据源

#### 修改 `.env.local`

```env
# 数据源类型
DATA_SOURCE=pre-rendered

# 预渲染版本（'latest' 或特定 tag 如 'v1.0.0'）
RENDERED_VERSION=latest

# GitHub 仓库（保持不变）
GITHUB_REPO=difyz9/QuickNote
GITHUB_TOKEN=your_github_token
```

#### 配置说明

**DATA_SOURCE** 选项：
- `github-api`: 实时从 GitHub API 获取（开发模式，灵活但较慢）
- `pre-rendered`: 使用预渲染 JSON（生产模式，快速）

**RENDERED_VERSION** 选项：
- `latest`: 使用最新渲染版本（推荐）
- `v1.0.0`: 使用特定 tag 版本（用于版本锁定）

---

### 3. 推送 Tag 触发渲染

在您的**文档仓库**中：

```bash
# 创建 tag
git tag v1.0.0

# 推送 tag
git push origin v1.0.0
```

GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 渲染所有 Markdown 为 JSON
4. 创建 `rendered/v1.0.0` 分支
5. 推送渲染结果
6. 更新 `rendered/latest` 分支指向最新版本

---

## 📊 渲染输出结构

渲染完成后，会在 `rendered/` 目录生成：

```
rendered/
├── docs/
│   ├── intro.json              # 单个文档
│   ├── langchain-go-1-setup.json
│   └── ...
├── docs-index.json             # 所有文档索引
├── sidebar.json                # 侧边栏结构
└── metadata.json               # 元数据（版本、生成时间等）
```

### 单个文档 JSON 格式

```json
{
  "path": "docs/intro.md",
  "slug": "intro",
  "metadata": {
    "title": "介绍",
    "description": "快速入门指南",
    "sidebar_position": 1,
    "date": "2025-01-15",
    "tags": ["tutorial"]
  },
  "content": "<h1>介绍</h1><p>这是渲染后的 HTML...</p>",
  "toc": [
    { "level": 1, "text": "介绍", "id": "intro" },
    { "level": 2, "text": "开始使用", "id": "getting-started" }
  ],
  "raw": "# 介绍\n\n这是原始 Markdown..."
}
```

---

## 🔧 高级配置

### 自定义文档目录

如果您的文档不在 `docs/` 目录，修改 `render.js`：

```javascript
// .github/scripts/render.js
const DOCS_DIR = 'documentation'; // 改为您的目录
```

### 修改渲染配置

```javascript
// 在 render.js 中自定义
const OUTPUT_DIR = 'rendered';      // 输出目录
const DOCS_DIR = 'docs';            // 源文档目录
```

### 版本管理策略

**方式 1：始终使用最新版本**（推荐）
```env
RENDERED_VERSION=latest
```

**方式 2：锁定特定版本**
```env
RENDERED_VERSION=v1.2.0
```

**方式 3：环境变量分离**
```env
# .env.development
DATA_SOURCE=github-api

# .env.production
DATA_SOURCE=pre-rendered
RENDERED_VERSION=latest
```

---

## 🎯 工作流程

### 完整流程图

```
文档仓库                        Next.js 项目
  │                               │
  ├─ 1. 推送 tag v1.0.0          │
  │                               │
  ├─ 2. GitHub Actions 触发      │
  │    ├─ 安装依赖               │
  │    ├─ 运行 render.js         │
  │    └─ 生成 JSON              │
  │                               │
  ├─ 3. 创建分支                 │
  │    └─ rendered/v1.0.0        │
  │                               │
  ├─ 4. 推送渲染结果             │
  │    └─ rendered/ 目录         │
  │                               │
  └────────────────────────────> 5. 访问预渲染 JSON
                                    ├─ 读取 sidebar.json
                                    ├─ 读取 docs-index.json
                                    └─ 按需加载 docs/*.json
```

### 开发模式 vs 生产模式

| 特性 | 开发模式 (github-api) | 生产模式 (pre-rendered) |
|------|----------------------|------------------------|
| **速度** | ~2000ms | ~100ms |
| **实时性** | 立即看到更新 | tag 推送后更新 |
| **API 限制** | 受 GitHub API 限制 | 无限制 |
| **推荐场景** | 本地开发、调试 | 生产部署、演示 |

---

## 🔍 验证部署

### 1. 检查 Actions 运行状态

访问您的文档仓库：
```
https://github.com/difyz9/QuickNote/actions
```

查看 "Render Documentation" workflow 是否成功。

### 2. 验证渲染分支

```bash
git ls-remote origin | grep rendered
# 应该看到：
# refs/heads/rendered/latest
# refs/heads/rendered/v1.0.0
```

### 3. 验证 JSON 文件

访问 GitHub raw URL：
```
https://raw.githubusercontent.com/difyz9/QuickNote/rendered/latest/rendered/metadata.json
```

应该返回类似：
```json
{
  "generatedAt": "2025-01-15T10:30:00.000Z",
  "version": "v1.0.0",
  "totalDocs": 45,
  "categories": ["tutorial", "api"],
  "tags": ["golang", "langchain"]
}
```

### 4. 测试 Next.js 项目

```bash
cd next_blog
npm run dev
```

访问 http://localhost:3001/docs

查看浏览器控制台：
```
[Docs] Data source: pre-rendered
[PreRendered] Fetching docs index from: https://raw.githubusercontent.com/...
[PreRendered] Found documents: 45
```

---

## ⚡ 性能对比

| 指标 | GitHub API 模式 | 预渲染模式 | 提升 |
|------|----------------|------------|------|
| **首次加载** | ~2000ms | ~200ms | **10x** |
| **后续访问** | ~500ms | ~50ms | **10x** |
| **Markdown 处理** | 每次请求 | 预先完成 | **∞** |
| **API 调用** | 每次 | 零 | **100%** |
| **CDN 可缓存** | 否 | 是 | **✓** |

---

## 🐛 故障排查

### 问题 1：Actions 失败 - "Cannot find module"

**原因**：依赖安装失败

**解决**：
```yaml
# 在 workflow 中添加
- name: Install dependencies
  run: |
    npm init -y
    npm install gray-matter remark remark-gfm ...
```

### 问题 2：找不到 rendered 分支

**原因**：首次运行需要推送 tag

**解决**：
```bash
# 创建并推送 tag
git tag v1.0.0
git push origin v1.0.0

# 等待 Actions 完成后检查
git ls-remote origin | grep rendered
```

### 问题 3：Next.js 报错 404

**原因**：`RENDERED_VERSION` 不存在

**解决**：
```bash
# 1. 检查可用版本
git ls-remote origin | grep rendered

# 2. 更新 .env.local
RENDERED_VERSION=latest  # 或实际存在的 tag
```

### 问题 4：文档未更新

**原因**：缓存未失效

**解决**：
```bash
# 调用 revalidate API
curl -X POST http://localhost:3001/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "tags": ["prerendered-index", "prerendered-sidebar"]
  }'
```

---

## 📈 监控和维护

### 监控渲染状态

在文档仓库添加 status badge：

```markdown
# README.md
![Docs Status](https://github.com/difyz9/QuickNote/actions/workflows/render-docs.yml/badge.svg)
```

### 自动清理旧版本

添加到 workflow：

```yaml
- name: Clean old rendered branches
  run: |
    # 保留最近 5 个版本
    git for-each-ref --sort=-committerdate refs/remotes/origin/rendered/ \
      | tail -n +6 \
      | cut -f2 \
      | xargs -r -n1 git push origin --delete
```

### 通知渲染完成

在 workflow 末尾添加：

```yaml
- name: Notify webhook
  run: |
    curl -X POST https://your-domain.com/api/revalidate \
      -H "Content-Type: application/json" \
      -d "{\"secret\":\"${{ secrets.REVALIDATE_SECRET }}\",\"tags\":[\"prerendered-index\"]}"
```

---

## 🎓 最佳实践

### 1. 版本命名规范

```bash
# 遵循语义化版本
git tag v1.0.0  # 主要版本
git tag v1.1.0  # 次要版本
git tag v1.1.1  # 补丁版本
```

### 2. 分支策略

- `main` - 开发分支
- `rendered/latest` - 最新渲染（自动更新）
- `rendered/v1.0.0` - 特定版本（永久保留）

### 3. 缓存策略

```typescript
// 生产环境使用长缓存
next: { 
  revalidate: 86400, // 24 小时
  tags: ['prerendered-docs'],
}
```

### 4. 环境配置

```env
# 开发环境
DATA_SOURCE=github-api
RENDERED_VERSION=latest

# 预发布环境
DATA_SOURCE=pre-rendered
RENDERED_VERSION=latest

# 生产环境
DATA_SOURCE=pre-rendered
RENDERED_VERSION=v1.0.0  # 锁定版本
```

---

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/actions)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [性能优化指南](./PERFORMANCE_OPTIMIZATION.md)

---

## ✅ 检查清单

部署前确认：

- [ ] 在文档仓库添加了 `.github/workflows/render-docs.yml`
- [ ] 在文档仓库添加了 `.github/scripts/render.js`
- [ ] 修改了 `render.js` 中的 `DOCS_DIR`（如需要）
- [ ] 在 Next.js 项目更新了 `.env.local`
- [ ] 推送了至少一个 tag 到文档仓库
- [ ] 验证了 Actions 运行成功
- [ ] 验证了 `rendered/latest` 分支存在
- [ ] 测试了 Next.js 项目可以访问预渲染数据

---

## 🆘 获取帮助

如遇问题：

1. 检查 GitHub Actions 日志
2. 查看浏览器控制台日志
3. 验证环境变量配置
4. 检查网络请求是否正确

需要帮助？创建 Issue 或查看项目文档。

---

**现在您可以享受 10-20 倍的性能提升了！🚀**
