// scripts/revalidate.js
// 用于手动刷新文档缓存

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-token';

async function revalidateDocs() {
  try {
    console.log('🔄 Revalidating all docs...');
    
    const response = await fetch(`${SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: REVALIDATE_SECRET,
        tags: ['github-files', 'directory-tree'],
      }),
    });

    if (response.ok) {
      console.log('✅ Cache revalidated successfully!');
    } else {
      console.error('❌ Failed to revalidate:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

revalidateDocs();
