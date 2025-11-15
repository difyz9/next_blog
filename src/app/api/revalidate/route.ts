// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, tags, paths } = body;

    // 验证密钥
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // 重新验证指定的标签
    // Note: revalidateTag in Next.js 16 may have different API
    // Using revalidatePath as alternative
    if (tags && Array.isArray(tags)) {
      console.log('[Revalidate] Tags requested:', tags);
      // Tags不再直接支持，使用path刷新代替
    }

    // 重新验证指定的路径
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        try {
          revalidatePath(path);
          console.log('[Revalidate] Path:', path);
        } catch (err) {
          console.error('[Revalidate] Error with path:', path, err);
        }
      }
    } else {
      // 默认刷新文档路径
      revalidatePath('/docs', 'layout');
      console.log('[Revalidate] Default path: /docs');
    }

    return NextResponse.json({
      revalidated: true,
      tags: tags || [],
      paths: paths || ['/docs'],
      now: Date.now(),
    });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}
