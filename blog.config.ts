// Blog Configuration
export const blogConfig = {
  // 数据源配置
  dataSource: {
    // 'github-api': 实时从 GitHub API 获取（开发模式）
    // 'pre-rendered': 使用预渲染的 JSON 文件（生产模式，更快）
    type: (process.env.DATA_SOURCE || 'pre-rendered') as 'github-api' | 'pre-rendered',
    
    // 预渲染数据源配置（当 type = 'pre-rendered' 时使用）
    preRendered: {
      // 使用的分支或 tag
      // 'latest': 使用最新渲染版本
      // 'v1.0.0': 使用特定 tag 版本
      version: process.env.RENDERED_VERSION || 'latest',
      // 渲染文件的分支前缀
      branchPrefix: 'rendered/',
    },
  },

  // GitHub 仓库配置
  github: {
    repo: process.env.GITHUB_REPO || 'coding520/langchain-go-tutorial',
    branch: 'main',
    docsPath: 'docs', // 文档所在目录（相对于仓库根目录）
    token: process.env.GITHUB_TOKEN,
  },

  // 站点配置
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Documentation Site',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A GitHub-powered documentation system',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // 导航配置
  navbar: {
    title: 'Docs',
    logo: {
      alt: 'Logo',
      src: '/logo.svg',
    },
    items: [
      { label: '文档', href: '/docs' },
      { label: '关于', href: '/about' },
    ],
  },

  // 侧边栏配置（可选，如果不配置将自动生成）
  sidebar: {
    auto: true, // 自动从文件结构生成侧边栏
  },

  // 默认作者信息
  defaultAuthor: {
    name: 'Anonymous',
    avatar: '/default-avatar.png',
  },
};
