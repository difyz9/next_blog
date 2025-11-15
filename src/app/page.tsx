// src/app/page.tsx
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { blogConfig } from '../../blog.config';
import { getAllDocs } from '@/lib/docs';

export default async function Home() {
  // 获取文档统计数据
  const docs = await getAllDocs();
  const categories = new Set(docs.map(doc => doc.metadata.category).filter(Boolean));
  const tags = new Set(docs.flatMap(doc => doc.metadata.tags || []));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
          {/* 装饰性背景 */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6 border border-gray-200">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {docs.length} 篇文档持续更新中
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  {blogConfig.site.name}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                {blogConfig.site.description}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link
                  href="/docs"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center justify-center">
                    开始阅读
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <a
                  href={`https://github.com/${blogConfig.github.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all font-semibold"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </span>
                </a>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <StatCard label="文档" value={docs.length} />
                <StatCard label="分类" value={categories.size} />
                <StatCard label="标签" value={tags.size} />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              强大的功能特性
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              基于现代技术栈构建，提供出色的阅读和开发体验
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="📝"
              title="Markdown 驱动"
              description="使用 GitHub 仓库管理文档，支持 GFM、Frontmatter 和代码高亮"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon="⚡"
              title="极速加载"
              description="预渲染架构实现 10-20 倍性能提升，ISR 增量更新保证内容实时性"
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon="🎨"
              title="优雅设计"
              description="现代化 UI 设计，完美的响应式布局，舒适的阅读体验"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon="🔍"
              title="智能搜索"
              description="全文搜索支持，⌘K 快捷键，智能匹配算法快速定位内容"
              gradient="from-green-500 to-teal-500"
            />
            <FeatureCard
              icon="🚀"
              title="自动化部署"
              description="GitHub Actions 自动渲染，Tag 触发部署，版本管理简单高效"
              gradient="from-red-500 to-rose-500"
            />
            <FeatureCard
              icon="📱"
              title="移动优先"
              description="完美支持移动端，流畅的触摸交互，PWA Ready"
              gradient="from-indigo-500 to-blue-500"
            />
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                快速开始
              </h2>
              <p className="text-lg text-gray-600">
                3 步快速部署你的文档站点
              </p>
            </div>

            <div className="space-y-6">
              <StepCard
                number="1"
                title="克隆仓库"
                description="将项目克隆到本地并安装依赖"
                code="git clone [your-repo-url]\ncd next_blog\nnpm install"
              />
              <StepCard
                number="2"
                title="配置环境变量"
                description="设置 GitHub 仓库和访问令牌"
                code="cp .env.example .env.local\n# 编辑 .env.local 填入你的配置"
              />
              <StepCard
                number="3"
                title="启动开发服务器"
                description="本地预览你的文档站点"
                code="npm run dev"
              />
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/docs"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                查看完整文档
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{blogConfig.site.name}</h3>
              <p className="text-gray-600 mb-4">{blogConfig.site.description}</p>
              <div className="flex space-x-4">
                <a
                  href={`https://github.com/${blogConfig.github.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">资源</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-600 hover:text-primary-600 transition-colors">文档</Link></li>
                <li><a href={`https://github.com/${blogConfig.github.repo}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">GitHub</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">技术栈</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>Next.js 15</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>GitHub API</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} {blogConfig.site.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="text-3xl font-bold text-primary-600 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { 
  icon: string; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative p-6 bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`}></div>
      <div className="relative">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, code }: {
  number: string;
  title: string;
  description: string;
  code: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-3">{description}</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
