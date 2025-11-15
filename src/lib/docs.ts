// src/lib/docs.ts
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { getFileContent, getDirectoryTree, GitHubTreeItem } from './github';
import { markdownToHtml, extractToc, TocItem } from './markdown';
import { blogConfig } from '../../blog.config';

export interface DocMetadata {
  title: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  author?: string;
}

export interface DocPost {
  slug: string;
  path: string;
  metadata: DocMetadata;
  content: string;
  htmlContent: string;
  readingTime: string;
  toc: TocItem[];
}

export interface SidebarItem {
  label: string;
  path: string;
  items?: SidebarItem[];
}

/**
 * 获取所有文档
 */
export async function getAllDocs(): Promise<DocPost[]> {
  console.log('[Docs] Getting all docs...');
  
  try {
    const tree = await getDirectoryTree();
    console.log('[Docs] Directory tree items:', tree.length);
    
    const mdFiles = tree.filter(item => item.type === 'blob' && item.path.endsWith('.md'));
    console.log('[Docs] Markdown files found:', mdFiles.length);
    console.log('[Docs] Sample files:', mdFiles.slice(0, 3).map(f => f.path));

    const docs = await Promise.all(
      mdFiles.map(async (file) => {
        try {
          console.log('[Docs] Processing file:', file.path);
          return await getDocByPath(file.path);
        } catch (error) {
          console.error(`[Docs] Error processing ${file.path}:`, error);
          return null;
        }
      })
    );

    const validDocs = docs.filter((doc): doc is DocPost => doc !== null);
    console.log('[Docs] Valid docs:', validDocs.length);
    
    return validDocs;
  } catch (error) {
    console.error('[Docs] Error getting all docs:', error);
    return [];
  }
}

/**
 * 根据路径获取文档
 */
export async function getDocByPath(path: string): Promise<DocPost> {
  console.log('[Docs] Getting doc by path:', path);
  
  const content = await getFileContent(path);
  
  if (!content) {
    console.error('[Docs] Empty content for:', path);
    throw new Error(`Empty content for ${path}`);
  }
  
  console.log('[Docs] Content length:', content.length);
  
  const { data, content: markdown } = matter(content);
  console.log('[Docs] Frontmatter title:', data.title);

  const htmlContent = await markdownToHtml(markdown);
  const toc = extractToc(markdown);

  // 生成 slug（从路径中提取）
  const slug = path
    .replace(blogConfig.github.docsPath + '/', '')
    .replace('.md', '')
    .replace(/\//g, '-');

  console.log('[Docs] Generated slug:', slug);

  return {
    slug,
    path,
    metadata: {
      title: data.title || 'Untitled',
      description: data.description,
      date: data.date,
      category: data.category,
      tags: data.tags,
      author: data.author,
    },
    content: markdown,
    htmlContent,
    readingTime: readingTime(markdown).text,
    toc,
  };
}

/**
 * 根据 slug 获取文档
 */
export async function getDocBySlug(slug: string): Promise<DocPost | null> {
  try {
    const docs = await getAllDocs();
    return docs.find(doc => doc.slug === slug) || null;
  } catch (error) {
    console.error('Error getting doc by slug:', error);
    return null;
  }
}

/**
 * 生成侧边栏
 */
export async function generateSidebar(): Promise<SidebarItem[]> {
  try {
    const tree = await getDirectoryTree();
    const docsPath = blogConfig.github.docsPath;

    // 构建文件树结构
    const sidebar: SidebarItem[] = [];
    const pathMap = new Map<string, SidebarItem>();

    // 按路径排序
    const sortedTree = tree.sort((a, b) => a.path.localeCompare(b.path));

    for (const item of sortedTree) {
      const relativePath = item.path.replace(docsPath + '/', '');
      const parts = relativePath.split('/');

      if (item.type === 'blob' && item.path.endsWith('.md')) {
        // 处理文件
        const fileName = parts[parts.length - 1].replace('.md', '');
        const label = formatLabel(fileName);
        const slug = relativePath.replace('.md', '').replace(/\//g, '-');

        const sidebarItem: SidebarItem = {
          label,
          path: `/docs/${slug}`,
        };

        if (parts.length === 1) {
          // 顶层文件
          sidebar.push(sidebarItem);
        } else {
          // 嵌套文件
          const parentPath = parts.slice(0, -1).join('/');
          const parent = pathMap.get(parentPath);
          if (parent) {
            if (!parent.items) parent.items = [];
            parent.items.push(sidebarItem);
          }
        }
      } else if (item.type === 'tree') {
        // 处理目录
        const dirName = parts[parts.length - 1];
        const label = formatLabel(dirName);

        const sidebarItem: SidebarItem = {
          label,
          path: '',
          items: [],
        };

        pathMap.set(relativePath, sidebarItem);

        if (parts.length === 1) {
          sidebar.push(sidebarItem);
        } else {
          const parentPath = parts.slice(0, -1).join('/');
          const parent = pathMap.get(parentPath);
          if (parent) {
            if (!parent.items) parent.items = [];
            parent.items.push(sidebarItem);
          }
        }
      }
    }

    return sidebar;
  } catch (error) {
    console.error('Error generating sidebar:', error);
    return [];
  }
}

/**
 * 格式化标签（将文件名转换为可读标签）
 */
function formatLabel(fileName: string): string {
  return fileName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}
