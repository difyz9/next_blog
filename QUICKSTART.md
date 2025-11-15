# 快速开始

本项目是一个基于 Next.js 和 GitHub 的文档管理系统，灵感来自 Docusaurus 的设计。

## 主要特性

✨ **GitHub 驱动**: 直接从 GitHub 仓库读取 Markdown 文档  
🎨 **Docusaurus 风格**: 熟悉的导航和侧边栏布局  
⚡ **快速加载**: Next.js SSG/ISR 实现极速访问  
📱 **响应式设计**: 完美支持移动端和桌面端  
🔍 **代码高亮**: 支持多种编程语言的语法高亮  
📑 **自动目录**: 自动生成文档目录和导航  

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制示例文件并编辑：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的 GitHub 仓库信息：

```env
GITHUB_REPO=your-username/your-repo
GITHUB_TOKEN=ghp_your_github_token_here
```

**获取 GitHub Token**:
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `public_repo` 权限
4. 生成并复制 token

### 3. 配置站点

编辑 `blog.config.ts` 文件：

```typescript
export const blogConfig = {
  github: {
    repo: 'your-username/your-repo',
    branch: 'main',
    docsPath: 'docs',  // 文档所在目录
  },
  site: {
    name: '我的文档站点',
    description: '基于 GitHub 的文档管理系统',
  },
};
```

### 4. 准备文档

在你的 GitHub 仓库中创建 `docs` 目录，添加 Markdown 文件：

```markdown
---
title: "快速开始"
description: "5分钟上手指南"
date: "2024-01-01"
category: "入门"
tags: ["教程", "快速开始"]
---

# 快速开始

欢迎使用文档系统！
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
next_blog/
├── src/
│   ├── app/              # Next.js 页面
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 首页
│   │   ├── docs/         # 文档页面
│   │   └── about/        # 关于页面
│   ├── components/       # React 组件
│   │   ├── Navbar.tsx    # 导航栏
│   │   ├── Sidebar.tsx   # 侧边栏
│   │   ├── DocContent.tsx      # 文档内容
│   │   └── TableOfContents.tsx # 目录
│   └── lib/             # 工具函数
│       ├── github.ts    # GitHub API
│       ├── markdown.ts  # Markdown 处理
│       └── docs.ts      # 文档管理
├── blog.config.ts       # 配置文件
├── next.config.ts       # Next.js 配置
├── tailwind.config.ts   # Tailwind 配置
└── package.json
```

## 文档格式

### Frontmatter 字段

- `title`: 标题（必需）
- `description`: 描述
- `date`: 日期
- `category`: 分类
- `tags`: 标签数组
- `author`: 作者

### 示例文档

```markdown
---
title: "API 参考"
description: "完整的 API 文档"
category: "API"
tags: ["reference", "api"]
---

# API 参考

## 概述

这是 API 文档...

## 端点

### GET /api/users

获取用户列表

\`\`\`typescript
const response = await fetch('/api/users');
const users = await response.json();
\`\`\`
```

## 部署

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 自动部署

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 文档

- [使用指南](./USAGE.md) - 详细的使用说明
- [部署指南](./DEPLOYMENT.md) - 各平台部署教程
- [README.md](./README.md) - 项目概述

## 技术栈

- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Remark/Rehype** - Markdown 处理
- **GitHub API** - 内容源

## 开发命令

```bash
npm run dev      # 开发模式
npm run build    # 构建生产版本
npm start        # 启动生产服务器
npm run lint     # 代码检查
```

## 自定义

### 修改主题颜色

编辑 `tailwind.config.ts`：

```typescript
colors: {
  primary: {
    500: '#0ea5e9',  // 主色调
    // ...其他色阶
  },
}
```

### 添加导航项

编辑 `blog.config.ts`：

```typescript
navbar: {
  items: [
    { label: '文档', href: '/docs' },
    { label: '博客', href: '/blog' },  // 新增
    { label: '关于', href: '/about' },
  ],
}
```

### 自定义组件

所有组件都在 `src/components/` 目录下，可以自由修改。

## 常见问题

**Q: 文档不显示？**  
A: 检查 GitHub Token 和仓库路径是否正确。

**Q: 如何添加新页面？**  
A: 在 `src/app/` 目录下创建新的文件夹和 `page.tsx` 文件。

**Q: 支持私有仓库吗？**  
A: 支持，但 GitHub Token 需要 `repo` 权限。

**Q: 如何更新文档？**  
A: 直接在 GitHub 上编辑，系统会自动同步（默认60秒缓存）。

## License

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关项目

- [Docusaurus](https://docusaurus.io/) - Meta 的文档框架
- [Next.js](https://nextjs.org/) - React 框架
- [nextjs-github-markdown-blog](https://github.com/Dicklesworthstone/nextjs-github-markdown-blog) - 参考项目
