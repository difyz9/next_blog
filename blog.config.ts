// Blog Configuration
import type { NavbarItem } from './src/types/navbar';

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

  // 导航栏配置 (参考 Docusaurus)
  // https://docusaurus.io/docs/api/themes/configuration#navbar
  navbar: {
    title: 'Docs',
    logo: {
      alt: 'Logo',
      src: '/logo.svg',
      // 可选：自定义 Logo 图标类型
      type: 'gradient' as 'gradient' | 'image', // 'gradient': 使用渐变色图标, 'image': 使用图片
      // 渐变色图标配置
      gradient: {
        from: 'blue-500',
        to: 'purple-600',
      }
    },
    // 副标题（显示在 Logo 下方）
    tagline: '技术文档中心',
    // 隐藏导航栏（默认 false）
    hideOnScroll: false,
    // 导航栏样式
    style: 'default' as 'default' | 'dark' | 'primary',
    items: [
      { 
        label: '文档', 
        href: '/docs',
        position: 'left',
      },
      { 
        label: '博客', 
        href: '/blog',
        position: 'left',
      },
      { 
        label: '关于', 
        href: '/about',
        position: 'left',
      },
      // 右侧项目
      {
        type: 'search',
        position: 'right',
      },
      {
        type: 'link',
        label: 'GitHub',
        href: `https://github.com/${process.env.GITHUB_REPO || 'coding520/langchain-go-tutorial'}`,
        icon: 'github',
        position: 'right',
      },
      {
        type: 'custom',
        component: 'ThemeToggle', // 主题切换按钮
        position: 'right',
      },
    ] as NavbarItem[],
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

  // 目录 (Table of Contents) 配置
  // 参考 Docusaurus: https://docusaurus.io/docs/api/themes/configuration#table-of-contents
  tableOfContents: {
    // 显示在目录中的最小标题级别（2-6）
    minHeadingLevel: 2,
    // 显示在目录中的最大标题级别（2-6）
    maxHeadingLevel: 3,
  },
};
