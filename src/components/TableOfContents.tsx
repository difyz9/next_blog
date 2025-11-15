// src/components/TableOfContents.tsx
'use client';

import { TocItem } from '@/lib/markdown';
import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 flex-shrink-0">
      <div className="sticky top-20 py-6 px-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">目录</h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block py-1 text-sm transition-colors ${
                activeId === item.id
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
