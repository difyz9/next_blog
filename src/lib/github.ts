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
  const { repo } = blogConfig.github;
  const fullPath = path ? `${blogConfig.github.docsPath}/${path}` : blogConfig.github.docsPath;
  const url = `https://api.github.com/repos/${repo}/contents/${fullPath}`;

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 60 }, // 缓存 60 秒
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files: GitHubFile[] = await response.json();
    return files.filter(file => file.type === 'file' && file.name.endsWith('.md'));
  } catch (error) {
    console.error('Error fetching GitHub files:', error);
    return [];
  }
}

/**
 * 获取文件内容
 */
export async function getFileContent(path: string): Promise<string> {
  const { repo, branch } = blogConfig.github;
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
}

/**
 * 递归获取目录树
 */
export async function getDirectoryTree(path: string = ''): Promise<GitHubTreeItem[]> {
  const { repo, branch, docsPath } = blogConfig.github;
  const url = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 300 }, // 缓存 5 分钟
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const tree: GitHubTreeItem[] = data.tree;

    // 过滤出文档目录下的 markdown 文件
    return tree.filter(item => {
      return (
        item.path.startsWith(docsPath) &&
        (item.type === 'blob' && item.path.endsWith('.md') || item.type === 'tree')
      );
    });
  } catch (error) {
    console.error('Error fetching directory tree:', error);
    return [];
  }
}
