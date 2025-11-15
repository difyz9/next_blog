// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { blogConfig } from '../../blog.config';
import { useState, useEffect } from 'react';
import DocSearch from './DocSearch';
import type { NavbarItem } from '@/types/navbar';

// 渲染导航项图标
const renderIcon = (iconName?: string): React.ReactNode => {
  if (!iconName) return null;
  
  const icons: Record<string, React.ReactNode> = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  };
  
  return icons[iconName] || null;
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { navbar } = blogConfig;

  // 监听滚动添加阴影效果
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 检查当前路径是否激活
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // 过滤左侧和右侧的导航项
  const leftItems = navbar.items.filter(item => !item.position || item.position === 'left');
  const rightItems = navbar.items.filter(item => item.position === 'right');

  // 渲染导航项
  const renderNavItem = (item: NavbarItem, isMobile = false) => {
    // 搜索项
    if (item.type === 'search') {
      return <DocSearch key="search" />;
    }

    // 自定义组件
    if (item.type === 'custom') {
      if (item.component === 'ThemeToggle') {
        return (
          <button
            key="theme-toggle"
            className={`
              ${isMobile ? 'w-full px-4 py-3' : 'w-9 h-9'} 
              flex items-center ${isMobile ? 'justify-start space-x-3' : 'justify-center'} 
              rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all
            `}
            aria-label="切换主题"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            {isMobile && <span className="text-sm font-medium">切换主题</span>}
          </button>
        );
      }
      return null;
    }

    // 下拉菜单（暂不实现）
    if (item.type === 'dropdown') {
      return null;
    }

    // 链接项
    if (!item.href) return null;
    
    const isExternal = item.href.startsWith('http');
    const linkClasses = isMobile
      ? `
          flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium
          transition-all duration-200
          ${isActive(item.href)
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
          }
        `
      : item.icon
        ? 'flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all'
        : `
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${isActive(item.href)
              ? 'bg-primary-50 text-primary-700 shadow-sm'
              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }
          `;

    const content = (
      <>
        {item.icon && renderIcon(item.icon)}
        <span className={item.icon && !isMobile ? 'text-sm font-medium' : ''}>
          {item.label}
        </span>
      </>
    );

    if (isExternal) {
      return (
        <a
          key={item.label}
          href={item.href}
          target={item.target || '_blank'}
          rel={item.rel || 'noopener noreferrer'}
          className={linkClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={linkClasses}
        onClick={() => isMobile && setMobileMenuOpen(false)}
      >
        {content}
      </Link>
    );
  };

  // 渲染 Logo
  const renderLogo = () => {
    const logoConfig = navbar.logo;
    const logoGradient = logoConfig?.gradient || { from: 'blue-500', to: 'purple-600' };
    
    return (
      <Link href="/" className="flex items-center space-x-3 group">
        {/* Logo 图标 */}
        <div className="relative">
          {logoConfig?.type === 'image' && logoConfig.src ? (
            <img src={logoConfig.src} alt={logoConfig.alt} className="w-8 h-8 rounded-lg" />
          ) : (
            <div className={`w-8 h-8 bg-gradient-to-br from-${logoGradient.from} to-${logoGradient.to} rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
        
        {/* 站点名称 */}
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {navbar.title || blogConfig.site.name}
          </span>
          {navbar.tagline && (
            <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
              {navbar.tagline}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <nav 
      className={`
        sticky top-0 z-50 
        bg-white/95 backdrop-blur-md
        border-b border-gray-200/50
        transition-all duration-300
        ${scrolled ? 'shadow-lg shadow-gray-200/50' : 'shadow-sm'}
      `}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo 和品牌 */}
          <div className="flex items-center space-x-8">
            {renderLogo()}

            {/* 桌面端左侧导航链接 */}
            <div className="hidden md:flex items-center space-x-1">
              {leftItems.map((item, index) => renderNavItem(item))}
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-2">
            {/* 桌面端右侧导航项 */}
            <div className="hidden md:flex items-center space-x-2">
              {rightItems.map((item, index) => renderNavItem(item))}
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all"
              aria-label="菜单"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {/* 移动端导航项 */}
            {navbar.items.map((item, index) => (
              <div key={index} onClick={() => setMobileMenuOpen(false)}>
                {renderNavItem(item, true)}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
