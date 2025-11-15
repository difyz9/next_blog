# GitHub Markdown Documentation System

基于 Next.js 和 GitHub 的文档管理系统，参考 Docusaurus 的布局设计。

## ⚡ 核心特性

- 📝 从 GitHub 仓库读取 Markdown 文档
- 🎨 Docusaurus 风格的 UI 布局（三栏布局）
- 📱 响应式设计（移动端适配）
- 🔍 代码高亮支持（Prism.js）
- ⚡ 两种数据源模式：
  - **GitHub API 模式**：实时获取（开发）
  - **预渲染模式**：10-20倍性能提升（生产）
- 🚀 GitHub Actions 自动渲染
- 🏷️ 基于 sidebar_position 的排序和 URL
- 📊 完整的 ISR 缓存策略
- 🔧 简单的配置文件

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 并重命名为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 数据源类型（'github-api' 或 'pre-rendered'）
DATA_SOURCE=github-api

# GitHub 仓库配置
GITHUB_REPO=username/repo
GITHUB_TOKEN=your_github_token_here

# 可选配置
NEXT_PUBLIC_SITE_NAME=我的文档站点
NEXT_PUBLIC_SITE_DESCRIPTION=基于 GitHub 的文档管理系统
```

**开发模式推荐使用 `github-api`，生产模式推荐使用 `pre-rendered`**

### 3. 配置文档源

编辑 `blog.config.ts` 文件，设置你的 GitHub 仓库和文档路径：

```typescript
export const blogConfig = {
  github: {
    repo: 'username/repo',
    branch: 'main',
    docsPath: 'docs', // 文档所在目录
  },
  site: {
    name: '我的文档站点',
    description: '基于 GitHub 的文档管理系统',
  },
};
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 📖 文档格式

在 GitHub 仓库中创建 Markdown 文件，使用 frontmatter 添加元数据：

```markdown
---
title: "文档标题"
description: "文档描述"
date: "2024-01-01"
category: "分类"
tags: ["标签1", "标签2"]
sidebar_position: 1
sidebar_label: "显示标题"
---

# 文档内容

这里是你的文档内容...
```

### Frontmatter 字段说明

- `title`: 文档标题（必填）
- `description`: 文档描述
- `sidebar_position`: 侧边栏排序位置（数字越小越靠前）
- `sidebar_label`: 侧边栏显示的标题（不设置则使用 title）
- `date`: 发布日期
- `category`: 分类
- `tags`: 标签数组

详细说明见：[FRONTMATTER_GUIDE.md](./FRONTMATTER_GUIDE.md)

## 项目结构

```
next_blog/
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   ├── lib/             # 工具函数和API
│   └── styles/          # 全局样式
├── public/              # 静态资源
├── blog.config.ts       # 博客配置文件
└── next.config.ts       # Next.js 配置
```

## 🚀 GitHub Actions 预渲染（推荐）

启用预渲染可获得 **10-20 倍性能提升**！

### 快速开始（5 分钟）

1. 在文档仓库添加 Actions 配置：
   - 复制 `.github/workflows/render-docs.yml` 
   - 复制 `.github/scripts/render.js`

2. 配置 Next.js 项目：
   ```env
   DATA_SOURCE=pre-rendered
   RENDERED_VERSION=latest
   ```

3. 推送 tag 触发渲染：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. 重启项目，享受极速体验！

**详细指南**: [QUICKSTART_PRERENDER.md](./QUICKSTART_PRERENDER.md)

## 📚 完整文档

| 文档 | 说明 |
|------|------|
| [QUICKSTART_PRERENDER.md](./QUICKSTART_PRERENDER.md) | 5分钟快速启用预渲染 |
| [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) | GitHub Actions 完整指南 |
| [ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md) | 环境变量配置说明 |
| [PRERENDER_SUMMARY.md](./PRERENDER_SUMMARY.md) | 预渲染方案总结 |
| [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) | 性能优化策略 |
| [FRONTMATTER_GUIDE.md](./FRONTMATTER_GUIDE.md) | Frontmatter 使用指南 |
| [URL_GUIDE.md](./URL_GUIDE.md) | URL 生成规则 |

## ⚡ 性能对比

| 模式 | 首次加载 | 后续访问 | 场景 |
|------|---------|---------|------|
| **GitHub API** | ~2000ms | ~500ms | 开发调试 |
| **预渲染** | ~200ms | ~50ms | 生产部署 |
| **提升** | **10x** | **10x** | - |

## 🌐 部署

本项目可以部署到任何支持 Next.js 的平台：

- **Vercel**（推荐）
- Netlify
- AWS Amplify
- 自托管服务器

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

记得在 Vercel 环境变量中设置：
- `DATA_SOURCE=pre-rendered`
- `RENDERED_VERSION=latest`
- `GITHUB_REPO=your-repo`
- `GITHUB_TOKEN=your-token`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
