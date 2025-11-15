// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '@/lib/docs';
import { useState } from 'react';

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  // 调试日志
  console.log('[Sidebar Component] Received items:', items.length);
  items.forEach((item, i) => {
    console.log(`[Sidebar Component] Item ${i}:`, {
      type: (item as any).type,
      label: item.label,
      title: (item as any).title,
      hasChildren: !!(item.items && item.items.length > 0),
      childCount: item.items?.length || 0
    });
  });
  
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
      <div className="py-6 px-4">
        <nav className="space-y-1">
          {items.map((item, index) => (
            <SidebarItemComponent key={index} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SidebarItemComponent({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.items && item.items.length > 0;
  
  // 支持两种格式：
  // 1. slug: 预渲染模式，转换为 /docs/{slug}
  // 2. path: GitHub API 模式，直接使用路径
  const itemPath = item.slug 
    ? `/docs/${item.slug}`
    : item.path?.startsWith('/') 
      ? item.path 
      : item.path 
        ? `/docs/${item.path.replace(/\.mdx?$/, '')}`
        : '#';
  
  const isActive = pathname === itemPath;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-md"
        >
          <span>{item.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1">
            {item.items?.map((child, index) => (
              <SidebarItemComponent key={index} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 获取显示标签：优先使用 label，否则使用 title（预渲染数据使用 title）
  const displayLabel = item.label || (item as any).title || 'Untitled';

  return (
    <Link
      href={itemPath}
      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
        isActive
          ? 'bg-primary-50 text-primary-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {displayLabel}
    </Link>
  );
}
