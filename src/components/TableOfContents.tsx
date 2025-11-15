// src/components/TableOfContents.tsx
'use client';

import { TocItem } from '@/lib/markdown';
import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到最上方可见的标题
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // 按位置排序，取最上方的
          const topEntry = visibleEntries.reduce((top, entry) => {
            return entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top;
          });
          setActiveId(topEntry.target.id);
        }
      },
      { 
        rootMargin: '-80px 0px -80% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  // 检测滚动，显示/隐藏目录
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {/* 桌面端固定目录 - 参考 Docusaurus 样式 */}
      <aside className="hidden lg:block w-72 flex-shrink-0 border-l border-gray-200 bg-white">
        <div className="sticky top-0 pt-6 pb-4 px-6 max-h-screen flex flex-col">
          {/* 标题 */}
          <div className="mb-4 pb-3 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              本页导航
            </h3>
          </div>

          {/* 目录导航 - 可滚动区域 */}
          <nav className="toc-nav flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            <ul className="space-y-2 text-sm">
              {items.map((item) => {
                const isActive = activeId === item.id;
                const isH2 = item.level === 2;
                const isH3 = item.level === 3;
                
                return (
                  <li
                    key={item.id}
                    style={{ 
                      paddingLeft: isH2 ? '0' : isH3 ? '16px' : '32px' 
                    }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        
                        if (element) {
                          // Docusaurus 风格：使用原生 scrollIntoView + CSS scroll-margin-top
                          element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                      className={`
                        block py-1.5 px-3 -mx-3 rounded-md transition-all duration-200
                        border-l-2 relative
                        ${isActive 
                          ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' 
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                        ${isH2 ? 'font-medium' : ''}
                      `}
                    >
                      {/* 活动指示器 */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary-600 rounded-r"></span>
                      )}
                      
                      {/* 文本内容 */}
                      <span className="block leading-snug">
                        {item.text}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 编辑链接（可选） */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
            <a
              href="#"
              className="flex items-center text-xs text-gray-500 hover:text-primary-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑本页
            </a>
          </div>
        </div>
      </aside>

      {/* 移动端浮动目录按钮 */}
      <div className="lg:hidden fixed bottom-20 right-4 z-30">
        <button
          onClick={() => {
            const tocMenu = document.getElementById('mobile-toc-menu');
            tocMenu?.classList.toggle('hidden');
          }}
          className="p-3 bg-white border-2 border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:border-primary-500"
          aria-label="显示目录"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        {/* 移动端目录弹出菜单 */}
        <div
          id="mobile-toc-menu"
          className="hidden absolute bottom-16 right-0 w-72 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
        >
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 px-4 pt-4 sticky top-0 bg-white z-10">
            <h3 className="text-sm font-bold text-gray-900">本页导航</h3>
            <button
              onClick={() => {
                const tocMenu = document.getElementById('mobile-toc-menu');
                tocMenu?.classList.add('hidden');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="px-4 pb-4">
            <ul className="space-y-1 text-sm">
              {items.map((item) => {
                const isActive = activeId === item.id;
                
                return (
                  <li
                    key={item.id}
                    style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                          // 使用原生 scrollIntoView + CSS scroll-margin-top
                          element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                        document.getElementById('mobile-toc-menu')?.classList.add('hidden');
                      }}
                      className={`
                        block py-2 px-3 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
