// src/lib/github.ts
import { blogConfig } from '../../blog.config';

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

/**
 * 获取 GitHub API 请求头
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'NextJS-Docs',
  };

  if (blogConfig.github.token) {
    headers.Authorization = `token ${blogConfig.github.token}`;
  }

  return headers;
}

/**
 * 获取指定目录的所有文件
 */
export async function getGitHubFiles(path: string = ''): Promise<GitHubFile[]> {
  const { repo, docsPath } = blogConfig.github;
  const fullPath = path ? `${docsPath}/${path}` : docsPath;
  const url = `https://api.github.com/repos/${repo}/contents/${fullPath}`;

  console.log('[GitHub API] Fetching files from:', url);

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { 
        revalidate: 3600, // 缓存 1 小时
        tags: ['github-files'],
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[GitHub API] Error response:', response.status, errorText);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const files: GitHubFile[] = await response.json();
    console.log('[GitHub API] Found files:', files.length);
    
    const mdFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.md'));
    console.log('[GitHub API] Markdown files:', mdFiles.length);
    
    return mdFiles;
  } catch (error) {
    console.error('[GitHub API] Error fetching files:', error);
    return [];
  }
}

/**
 * 获取文件内容
 */
export async function getFileContent(path: string): Promise<string> {
  const { repo, branch } = blogConfig.github;
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;

  console.log('[GitHub API] Fetching file content:', url);

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { 
        revalidate: 3600, // 缓存 1 小时
        tags: [`file-${path}`],
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[GitHub API] Error fetching file:', response.status, errorText);
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const content = await response.text();
    console.log('[GitHub API] File content length:', content.length);
    
    return content;
  } catch (error) {
    console.error('[GitHub API] Error fetching file content:', error);
    return '';
  }
}

/**
 * 递归获取目录树
 */
export async function getDirectoryTree(path: string = ''): Promise<GitHubTreeItem[]> {
  const { repo, branch, docsPath } = blogConfig.github;
  const url = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;

  console.log('[GitHub API] Fetching directory tree from:', url);
  console.log('[GitHub API] Docs path:', docsPath);

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { 
        revalidate: 3600, // 缓存 1 小时
        tags: ['directory-tree'],
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[GitHub API] Error response:', response.status, errorText);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const tree: GitHubTreeItem[] = data.tree;

    console.log('[GitHub API] Total items in tree:', tree.length);

    // 过滤出文档目录下的 markdown 文件和目录
    const filtered = tree.filter(item => {
      const inDocsPath = item.path.startsWith(docsPath);
      const isMarkdown = item.type === 'blob' && item.path.endsWith('.md');
      const isDirectory = item.type === 'tree';
      
      return inDocsPath && (isMarkdown || isDirectory);
    });

    console.log('[GitHub API] Filtered items:', filtered.length);
    console.log('[GitHub API] Sample paths:', filtered.slice(0, 5).map(i => i.path));
    
    return filtered;
  } catch (error) {
    console.error('[GitHub API] Error fetching directory tree:', error);
    return [];
  }
}
