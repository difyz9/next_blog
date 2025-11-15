// src/hooks/useDocSearch.ts
'use client';

import { useState, useEffect, useMemo } from 'react';
import { blogConfig } from '../../blog.config';

export interface DocSearchResult {
  slug: string;
  path: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
  matchType: 'title' | 'description' | 'tag' | 'category';
  score: number;
}

interface DocIndexItem {
  slug: string;
  path: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
}

export function useDocSearch(query: string) {
  const [docsIndex, setDocsIndex] = useState<DocIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载文档索引
  useEffect(() => {
    async function loadIndex() {
      try {
        setLoading(true);
        setError(null);

        const { repo, token } = blogConfig.github;
        const version = blogConfig.dataSource.preRendered?.version || 'latest';
        const branchPrefix = blogConfig.dataSource.preRendered?.branchPrefix || 'rendered/';
        const ref = `${branchPrefix}${version}`;

        const url = `https://api.github.com/repos/${repo}/contents/rendered/docs-index.json?ref=${ref}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
          next: { revalidate: 3600 }, // 缓存 1 小时
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch docs index: ${response.status}`);
        }

        const data = await response.json();
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        const index = JSON.parse(content);
        
        setDocsIndex(index);
      } catch (err) {
        console.error('Error loading docs index:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadIndex();
  }, []);

  // 搜索逻辑
  const results = useMemo(() => {
    if (!query.trim() || docsIndex.length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const searchResults: DocSearchResult[] = [];

    docsIndex.forEach((doc) => {
      let score = 0;
      let matchType: DocSearchResult['matchType'] = 'title';

      // 标题匹配（最高权重）
      const titleMatch = doc.title.toLowerCase().includes(searchTerm);
      if (titleMatch) {
        score += 100;
        matchType = 'title';
        
        // 精确匹配加分
        if (doc.title.toLowerCase() === searchTerm) {
          score += 50;
        }
        // 开头匹配加分
        if (doc.title.toLowerCase().startsWith(searchTerm)) {
          score += 30;
        }
      }

      // 描述匹配
      if (doc.description?.toLowerCase().includes(searchTerm)) {
        score += 50;
        if (matchType === 'title') matchType = 'description';
      }

      // 分类匹配
      if (doc.category?.toLowerCase().includes(searchTerm)) {
        score += 40;
        if (score === 40) matchType = 'category';
      }

      // 标签匹配
      const tagMatch = doc.tags?.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      if (tagMatch) {
        score += 30;
        if (score === 30) matchType = 'tag';
      }

      // 路径匹配（最低权重）
      if (doc.path.toLowerCase().includes(searchTerm)) {
        score += 10;
      }

      if (score > 0) {
        searchResults.push({
          ...doc,
          matchType,
          score,
        });
      }
    });

    // 按分数排序
    return searchResults.sort((a, b) => b.score - a.score).slice(0, 20);
  }, [query, docsIndex]);

  return {
    results,
    loading,
    error,
    totalDocs: docsIndex.length,
  };
}
