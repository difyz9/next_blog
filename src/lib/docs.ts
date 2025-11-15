// src/lib/docs.ts
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { getFileContent, getDirectoryTree, GitHubTreeItem } from './github';
import { markdownToHtml, extractToc, TocItem } from './markdown';
import { blogConfig } from '../../blog.config';
import { 
  getPreRenderedDocsIndex, 
  getPreRenderedDoc, 
  getPreRenderedSidebar 
} from './prerendered';

export interface DocMetadata {
  title: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  author?: string;
  sidebar_position?: number;
  sidebar_label?: string;
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
  label?: string;  // GitHub API 模式使用
  title?: string;  // 预渲染模式使用
  path: string;
  slug?: string;   // 预渲染模式使用
  type?: string;   // 'doc' | 'category'
  position?: number;
  items?: SidebarItem[];
}

/**
 * 获取所有文档
 */
export async function getAllDocs(): Promise<DocPost[]> {
  console.log('[Docs] Getting all docs...');
  console.log('[Docs] Data source:', blogConfig.dataSource.type);
  
  // 如果使用预渲染数据源
  if (blogConfig.dataSource.type === 'pre-rendered') {
    try {
      const index = await getPreRenderedDocsIndex();
      console.log('[Docs] Pre-rendered docs:', index.length);
      
      // 返回简化的文档列表（用于列表页面）
      // 完整内容在访问单个文档时加载
      return index.map(doc => ({
        slug: doc.slug,
        path: doc.path,
        metadata: {
          title: doc.title,
          description: doc.description,
          date: doc.date,
          category: doc.category,
          tags: doc.tags,
        },
        content: '',
        htmlContent: '',
        readingTime: '1 min read',
        toc: [],
      }));
    } catch (error) {
      console.error('[Docs] Error loading pre-rendered docs:', error);
      return [];
    }
  }
  
  // 否则使用 GitHub API
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

  // 生成 slug
  // 如果有 sidebar_position，使用 position + 简化的标题
  // 否则使用完整路径
  let slug: string;
  if (data.sidebar_position !== undefined) {
    const relativePath = path.replace(blogConfig.github.docsPath + '/', '');
    const parts = relativePath.split('/');
    const fileName = parts[parts.length - 1].replace('.md', '');
    
    // 如果在子目录中，保留目录结构
    if (parts.length > 1) {
      const dirs = parts.slice(0, -1).join('-');
      slug = `${dirs}-${data.sidebar_position}-${fileName}`;
    } else {
      slug = `${data.sidebar_position}-${fileName}`;
    }
  } else {
    // 没有 sidebar_position，使用原来的逻辑
    slug = path
      .replace(blogConfig.github.docsPath + '/', '')
      .replace('.md', '')
      .replace(/\//g, '-');
  }

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
      sidebar_position: data.sidebar_position,
      sidebar_label: data.sidebar_label,
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
  console.log('[Docs] Getting doc by slug:', slug);
  console.log('[Docs] Data source:', blogConfig.dataSource.type);
  
  try {
    // 如果使用预渲染数据源
    if (blogConfig.dataSource.type === 'pre-rendered') {
      const doc = await getPreRenderedDoc(slug);
      if (doc) {
        console.log('[Docs] Pre-rendered doc found:', doc.metadata.title);
      }
      return doc;
    }
    
    // 否则从 GitHub API 获取
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
  console.log('[Sidebar] Generating sidebar...');
  console.log('[Sidebar] Data source:', blogConfig.dataSource.type);
  
  try {
    // 如果使用预渲染数据源
    if (blogConfig.dataSource.type === 'pre-rendered') {
      const sidebar = await getPreRenderedSidebar();
      console.log('[Sidebar] Pre-rendered sidebar items:', sidebar.length);
      return sidebar;
    }
    
    // 否则从 GitHub API 动态生成
    // 获取所有文档（包含 frontmatter 信息）
    const docs = await getAllDocs();
    console.log('[Sidebar] Total docs:', docs.length);

    const docsPath = blogConfig.github.docsPath;

    // 构建文件树结构
    const sidebar: SidebarItem[] = [];
    const pathMap = new Map<string, SidebarItem>();

    // 获取目录树用于识别目录结构
    const tree = await getDirectoryTree();
    const directories = tree.filter(item => item.type === 'tree');

    // 首先处理所有目录
    for (const dir of directories) {
      const relativePath = dir.path.replace(docsPath + '/', '');
      const parts = relativePath.split('/');
      const dirName = parts[parts.length - 1];

      const sidebarItem: SidebarItem = {
        label: formatLabel(dirName),
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

    // 然后处理所有文档
    for (const doc of docs) {
      const relativePath = doc.path.replace(docsPath + '/', '');
      const parts = relativePath.split('/');

      // 使用 frontmatter 中的 sidebar_label 或 title
      const label = doc.metadata.sidebar_label || doc.metadata.title;
      const position = doc.metadata.sidebar_position;

      const sidebarItem: SidebarItem = {
        label,
        path: `/docs/${doc.slug}`,
        position,
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
    }

    // 递归排序函数
    const sortItems = (items: SidebarItem[]) => {
      items.sort((a, b) => {
        // 如果都有 position，按 position 排序
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }
        // 如果只有一个有 position，有 position 的排前面
        if (a.position !== undefined) return -1;
        if (b.position !== undefined) return 1;
        // 都没有 position，按 label 或 title 字母排序
        const aLabel = a.label || a.title || '';
        const bLabel = b.label || b.title || '';
        return aLabel.localeCompare(bLabel);
      });

      // 递归排序子项
      items.forEach(item => {
        if (item.items && item.items.length > 0) {
          sortItems(item.items);
        }
      });
    };

    // 排序所有项目
    sortItems(sidebar);

    console.log('[Sidebar] Generated sidebar items:', sidebar.length);
    return sidebar;
  } catch (error) {
    console.error('[Sidebar] Error generating sidebar:', error);
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
