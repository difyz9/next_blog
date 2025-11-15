# 使用指南

## 项目设置

### 1. 环境变量配置

创建 `.env.local` 文件：

```env
# GitHub 仓库配置（必需）
GITHUB_REPO=username/repo
GITHUB_TOKEN=your_github_personal_access_token

# 站点配置（可选）
NEXT_PUBLIC_SITE_NAME=我的文档站点
NEXT_PUBLIC_SITE_DESCRIPTION=基于 GitHub 的文档管理系统
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 获取 GitHub Token

1. 访问 GitHub Settings → Developer Settings → Personal Access Tokens
2. 点击 "Generate new token (classic)"
3. 选择 `public_repo` 权限（如果是私有仓库需要 `repo` 权限）
4. 生成并复制 token

### 3. 配置博客

编辑 `blog.config.ts` 文件：

```typescript
export const blogConfig = {
  github: {
    repo: 'your-username/your-repo',  // GitHub 仓库
    branch: 'main',                    // 分支名称
    docsPath: 'docs',                  // 文档目录
  },
  site: {
    name: '我的文档站点',
    description: '基于 GitHub 的文档管理系统',
  },
  navbar: {
    items: [
      { label: '文档', href: '/docs' },
      { label: '关于', href: '/about' },
    ],
  },
};
```

## 文档格式

### Markdown 文件结构

在 GitHub 仓库的 `docs` 目录中创建 Markdown 文件：

```markdown
---
title: "文档标题"
description: "文档描述"
date: "2024-01-01"
category: "分类"
tags: ["标签1", "标签2"]
author: "作者名称"
---

# 文档内容

这里是你的文档正文...
```

### 支持的 Frontmatter 字段

- `title`: 文档标题（必需）
- `description`: 文档描述（可选）
- `date`: 发布日期（可选）
- `category`: 分类（可选）
- `tags`: 标签数组（可选）
- `author`: 作者（可选）

### 文件组织

```
docs/
├── intro.md              # 介绍
├── getting-started.md    # 快速开始
├── guide/
│   ├── installation.md   # 安装指南
│   └── configuration.md  # 配置指南
└── api/
    ├── overview.md       # API 概览
    └── reference.md      # API 参考
```

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 部署

### Vercel（推荐）

1. 在 Vercel 导入项目
2. 配置环境变量
3. 部署

### 其他平台

- **Netlify**: 支持 Next.js
- **Cloudflare Pages**: 需要配置构建命令
- **自托管**: 使用 `npm run build && npm start`

## 常见问题

### 1. 无法获取 GitHub 内容

检查：
- GitHub Token 是否正确
- 仓库名称是否正确
- 是否有访问权限

### 2. 文档不显示

检查：
- `docsPath` 配置是否正确
- Markdown 文件是否在正确的目录
- Frontmatter 格式是否正确

### 3. 样式问题

确保 Tailwind CSS 配置正确，运行：
```bash
npm run dev
```

## 自定义

### 修改主题颜色

编辑 `tailwind.config.ts`：

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义颜色
      },
    },
  },
},
```

### 添加导航项

编辑 `blog.config.ts` 中的 `navbar.items`。

### 自定义组件

所有组件位于 `src/components/` 目录，可以自由修改。
