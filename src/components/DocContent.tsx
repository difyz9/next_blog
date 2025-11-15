// src/components/DocContent.tsx
import { DocPost } from '@/lib/docs';
import EnhancedCodeBlock from './EnhancedCodeBlock';
import ShareButton from './ShareButton';
import DocContentWithIds from './DocContentWithIds';

interface DocContentProps {
  doc: DocPost;
}

export default function DocContent({ doc }: DocContentProps) {
  return (
    <article className="flex-1 max-w-4xl">
      {/* Header */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {doc.metadata.title}
        </h1>
        
        {doc.metadata.description && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {doc.metadata.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {doc.metadata.date && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={doc.metadata.date}>
                {new Date(doc.metadata.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          )}
          
          {doc.readingTime && (
            <>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{doc.readingTime}</span>
              </div>
            </>
          )}
          
          {doc.metadata.category && (
            <>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-primary-700 rounded-full font-medium">
                {doc.metadata.category}
              </span>
            </>
          )}
        </div>

        {doc.metadata.tags && doc.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {doc.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors cursor-pointer"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <DocContentWithIds htmlContent={doc.htmlContent} />

      {/* 代码块增强 */}
      <EnhancedCodeBlock />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t-2 border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {doc.metadata.author && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {doc.metadata.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {doc.metadata.author}
                  </div>
                  <div className="text-xs text-gray-500">作者</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              最后更新: {doc.metadata.date 
                ? new Date(doc.metadata.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '未知'}
            </span>
          </div>
        </div>

        {/* 分享按钮 */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">分享这篇文章</span>
            <div className="flex gap-2">
              <ShareButton 
                title={doc.metadata.title} 
                description={doc.metadata.description} 
              />
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
