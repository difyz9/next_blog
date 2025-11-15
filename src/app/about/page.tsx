// src/app/about/page.tsx
import Navbar from '@/components/Navbar';
import { blogConfig } from '../../../blog.config';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">关于本站</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              {blogConfig.site.description}
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              技术栈
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Next.js 15</strong> - React 框架，支持 SSG 和 ISR</li>
              <li><strong>TypeScript</strong> - 类型安全的 JavaScript</li>
              <li><strong>Tailwind CSS</strong> - 实用优先的 CSS 框架</li>
              <li><strong>GitHub API</strong> - 文档内容管理</li>
              <li><strong>Remark/Rehype</strong> - Markdown 处理和渲染</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              功能特性
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>从 GitHub 仓库自动获取和更新文档</li>
              <li>支持完整的 Markdown 语法和 GFM 扩展</li>
              <li>代码语法高亮</li>
              <li>自动生成侧边栏和目录</li>
              <li>响应式设计，支持移动端</li>
              <li>SEO 优化</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              数据源
            </h2>
            <p className="text-gray-700">
              文档内容来自 GitHub 仓库：
              <a
                href={`https://github.com/${blogConfig.github.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline ml-2"
              >
                {blogConfig.github.repo}
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} {blogConfig.site.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
