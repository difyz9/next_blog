// src/components/DocNavigation.tsx
import Link from 'next/link';

interface DocNavigationProps {
  prev?: {
    title: string;
    slug: string;
  };
  next?: {
    title: string;
    slug: string;
  };
}

export default function DocNavigation({ prev, next }: DocNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prev && (
          <Link
            href={`/docs/${prev.slug}`}
            className="group p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一篇
            </div>
            <div className="text-primary-600 group-hover:text-primary-700 font-medium">
              {prev.title}
            </div>
          </Link>
        )}
        
        {next && (
          <Link
            href={`/docs/${next.slug}`}
            className="group p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all md:ml-auto md:text-right"
          >
            <div className="flex items-center justify-end text-sm text-gray-500 mb-2">
              下一篇
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-primary-600 group-hover:text-primary-700 font-medium">
              {next.title}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
