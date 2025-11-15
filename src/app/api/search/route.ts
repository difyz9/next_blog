// src/app/api/search/route.ts
import { NextResponse } from 'next/server';
import { blogConfig } from '../../../../blog.config';

export const runtime = 'edge';
export const revalidate = 3600; // 缓存 1 小时

export async function GET() {
  try {
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
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status, await response.text());
      return NextResponse.json(
        { error: `GitHub API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const index = JSON.parse(content);
    
    return NextResponse.json(index, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching docs index:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
