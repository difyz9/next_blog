# GitHub Markdown Documentation System

基于 Next.js 和 GitHub 的文档管理系统，参考 Docusaurus 的布局设计。

## 功能特性

- 📝 从 GitHub 仓库读取 Markdown 文档
- 🎨 Docusaurus 风格的 UI 布局
- 📱 响应式设计
- 🔍 代码高亮支持
- ⚡ 静态站点生成 (SSG)
- 🔧 简单的配置文件

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
# GitHub 仓库配置
GITHUB_REPO=username/repo
GITHUB_TOKEN=your_github_token_here

# 可选配置
NEXT_PUBLIC_SITE_NAME=我的文档站点
NEXT_PUBLIC_SITE_DESCRIPTION=基于 GitHub 的文档管理系统
```

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

## 文档格式

在 GitHub 仓库中创建 Markdown 文件，使用 frontmatter 添加元数据：

```markdown
---
title: "文档标题"
description: "文档描述"
date: "2024-01-01"
category: "分类"
tags: ["标签1", "标签2"]
---

# 文档内容

这里是你的文档内容...
```

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

## 部署

本项目可以部署到任何支持 Next.js 的平台：

- Vercel（推荐）
- Netlify
- AWS Amplify
- 自托管服务器

## License

MIT
