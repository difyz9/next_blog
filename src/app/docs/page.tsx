// src/app/docs/page.tsx
import { getAllDocs } from '@/lib/docs';
import Link from 'next/link';

export default async function DocsPage() {
  const docs = await getAllDocs();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">文档概览</h1>
      
      <div className="grid gap-6">
        {docs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">暂无文档</p>
            <p className="text-sm text-gray-500">
              请在 GitHub 仓库的 <code className="bg-gray-100 px-2 py-1 rounded">docs</code> 目录中添加 Markdown 文件
            </p>
          </div>
        ) : (
          docs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {doc.metadata.title}
              </h2>
              {doc.metadata.description && (
                <p className="text-gray-600 mb-3">{doc.metadata.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {doc.metadata.category && (
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded">
                    {doc.metadata.category}
                  </span>
                )}
                <span>{doc.readingTime}</span>
                {doc.metadata.date && (
                  <time dateTime={doc.metadata.date}>
                    {new Date(doc.metadata.date).toLocaleDateString('zh-CN')}
                  </time>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
