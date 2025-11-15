// src/app/page.tsx
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { blogConfig } from '../../blog.config';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                {blogConfig.site.name}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {blogConfig.site.description}
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/docs"
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  开始阅读
                </Link>
                <a
                  href={`https://github.com/${blogConfig.github.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📝"
              title="Markdown 驱动"
              description="使用 GitHub 仓库管理文档，支持完整的 Markdown 语法和代码高亮"
            />
            <FeatureCard
              icon="🎨"
              title="优雅设计"
              description="参考 Docusaurus 的设计风格，提供清晰的导航和阅读体验"
            />
            <FeatureCard
              icon="⚡"
              title="极速加载"
              description="基于 Next.js 构建，利用静态生成和增量更新实现快速加载"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
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

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
