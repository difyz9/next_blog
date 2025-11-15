// src/lib/prerendered.ts
import { blogConfig } from '../../blog.config';
import { DocPost, SidebarItem } from './docs';

/**
 * 获取请求头（包含认证信息）
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3.raw',
  };

  if (blogConfig.github.token) {
    headers.Authorization = `token ${blogConfig.github.token}`;
  }

  return headers;
}

/**
 * 获取预渲染文件的 GitHub API URL
 */
function getPreRenderedApiUrl(filePath: string): string {
  const { repo } = blogConfig.github;
  const { version, branchPrefix } = blogConfig.dataSource.preRendered;
  const branch = `${branchPrefix}${version}`;
  
  return `https://api.github.com/repos/${repo}/contents/rendered/${filePath}?ref=${branch}`;
}

/**
 * 从预渲染 JSON 获取所有文档列表
 */
export async function getPreRenderedDocsIndex(): Promise<any[]> {
  const url = getPreRenderedApiUrl('docs-index.json');

  console.log('[PreRendered] Fetching docs index from:', url);

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { 
        revalidate: 3600, // 缓存 1 小时
        tags: ['prerendered-index'],
      },
    });

    if (!response.ok) {
      console.error('[PreRendered] Error fetching index:', response.status);
      return [];
    }

    const index = await response.json();
    console.log('[PreRendered] Found documents:', index.length);
    
    return index;
  } catch (error) {
    console.error('[PreRendered] Error fetching docs index:', error);
    return [];
  }
}

/**
 * 从预渲染 JSON 获取单个文档
 */
export async function getPreRenderedDoc(slug: string): Promise<DocPost | null> {
  const url = getPreRenderedApiUrl(`docs/${slug}.json`);

  console.log('[PreRendered] Fetching document from:', url);

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { 
        revalidate: 3600, // 缓存 1 小时
        tags: [`prerendered-doc-${slug}`],
      },
    });

    if (!response.ok) {
      console.error('[PreRendered] Error fetching document:', response.status);
      return null;
    }

    const doc = await response.json();
    console.log('[PreRendered] Document loaded:', doc.metadata?.title || 'Unknown');
    
    // 转换为 DocPost 格式
    return {
      slug: doc.slug,
      path: doc.path,
      metadata: doc.metadata,
      content: doc.raw || '',
      htmlContent: doc.content,
      readingTime: doc.metadata.readingTime || '1 min read',
      toc: doc.toc,
    };
  } catch (error) {
    console.error('[PreRendered] Error fetching document:', error);
    return null;
  }
}

/**
 * 从预渲染 JSON 获取侧边栏
 */
export async function getPreRenderedSidebar(): Promise<SidebarItem[]> {
  const url = getPreRenderedApiUrl('sidebar.json');

  console.log('[PreRendered] Fetching sidebar from:', url);

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { 
        revalidate: 3600, // 缓存 1 小时
        tags: ['prerendered-sidebar'],
      },
    });

    if (!response.ok) {
      console.error('[PreRendered] Error fetching sidebar:', response.status);
      return [];
    }

    const sidebar = await response.json();
    console.log('[PreRendered] Sidebar items:', sidebar.length);
    
    return sidebar;
  } catch (error) {
    console.error('[PreRendered] Error fetching sidebar:', error);
    return [];
  }
}

/**
 * 从预渲染 JSON 获取元数据
 */
export async function getPreRenderedMetadata(): Promise<any> {
  const url = getPreRenderedApiUrl('metadata.json');

  console.log('[PreRendered] Fetching metadata from:', url);

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { 
        revalidate: 3600, // 缓存 1 小时
        tags: ['prerendered-metadata'],
      },
    });

    if (!response.ok) {
      console.error('[PreRendered] Error fetching metadata:', response.status);
      return null;
    }

    const metadata = await response.json();
    console.log('[PreRendered] Metadata loaded, version:', metadata.version);
    
    return metadata;
  } catch (error) {
    console.error('[PreRendered] Error fetching metadata:', error);
    return null;
  }
}
