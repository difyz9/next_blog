// src/components/DocContent.tsx
import { DocPost } from '@/lib/docs';

interface DocContentProps {
  doc: DocPost;
}

export default function DocContent({ doc }: DocContentProps) {
  return (
    <article className="flex-1 px-6 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {doc.metadata.title}
        </h1>
        
        {doc.metadata.description && (
          <p className="text-xl text-gray-600 mb-4">
            {doc.metadata.description}
          </p>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {doc.metadata.date && (
            <time dateTime={doc.metadata.date}>
              {new Date(doc.metadata.date).toLocaleDateString('zh-CN')}
            </time>
          )}
          <span>·</span>
          <span>{doc.readingTime}</span>
          {doc.metadata.category && (
            <>
              <span>·</span>
              <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded">
                {doc.metadata.category}
              </span>
            </>
          )}
        </div>

        {doc.metadata.tags && doc.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {doc.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: doc.htmlContent }}
      />

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            {doc.metadata.author && (
              <span>作者: {doc.metadata.author}</span>
            )}
          </div>
          <div>
            最后更新: {doc.metadata.date 
              ? new Date(doc.metadata.date).toLocaleDateString('zh-CN')
              : '未知'}
          </div>
        </div>
      </footer>
    </article>
  );
}
