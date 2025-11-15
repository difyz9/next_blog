'use client';

import { useEffect } from 'react';

/**
 * 生成标题 ID（与 markdown.ts 中的逻辑一致）
 */
function generateHeadingId(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .toLowerCase()
    // 移除特殊字符，保留中文、字母、数字、空格、连字符
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/gi, '')
    // 将空格替换为连字符
    .replace(/\s+/g, '-')
    // 移除多余的连字符
    .replace(/-+/g, '-')
    // 移除首尾的连字符
    .replace(/^-+|-+$/g, '');
}

interface DocContentWithIdsProps {
  htmlContent: string;
}

/**
 * 文档内容组件 - 自动为标题添加 ID
 * 用于处理预渲染数据中可能缺失的标题ID
 */
export default function DocContentWithIds({ htmlContent }: DocContentWithIdsProps) {
  useEffect(() => {
    // 稍微延迟以确保DOM已渲染
    const timer = setTimeout(() => {
      // 查找所有标题
      const headings = document.querySelectorAll('article h1, article h2, article h3, article h4, h1, h2, h3, h4');
      
      headings.forEach((heading) => {
        const currentId = heading.id;
        
        if (!currentId || currentId === '') {
          const text = heading.textContent || '';
          const id = generateHeadingId(text);
          if (id) {
            heading.id = id;
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [htmlContent]);

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
