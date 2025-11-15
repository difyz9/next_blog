// src/app/docs/[slug]/page.tsx
import { getAllDocs, getDocBySlug } from '@/lib/docs';
import { notFound } from 'next/navigation';
import DocContent from '@/components/DocContent';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import BackToTop from '@/components/BackToTop';
import Breadcrumb from '@/components/Breadcrumb';
import DocNavigation from '@/components/DocNavigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${doc.metadata.title} | Documentation`,
    description: doc.metadata.description,
    keywords: doc.metadata.tags?.join(', '),
    openGraph: {
      title: doc.metadata.title,
      description: doc.metadata.description,
      type: 'article',
      publishedTime: doc.metadata.date,
      tags: doc.metadata.tags,
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  // 获取所有文档用于上下篇导航
  const allDocs = await getAllDocs();
  const currentIndex = allDocs.findIndex(d => d.slug === slug);
  
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : undefined;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : undefined;

  // 构建面包屑
  const breadcrumbItems: Array<{ label: string; href?: string }> = [
    { label: '文档', href: '/docs' },
  ];
  
  if (doc.metadata.category) {
    breadcrumbItems.push({ label: doc.metadata.category });
  }
  
  breadcrumbItems.push({ label: doc.metadata.title });

  // 调试：打印目录信息
  console.log('[DocPage] TOC items:', doc.toc?.length || 0);
  if (doc.toc && doc.toc.length > 0) {
    console.log('[DocPage] First TOC item:', doc.toc[0]);
  }

  return (
    <>
      <ReadingProgress />
      <div className="flex max-w-[1920px] mx-auto">
        {/* 主内容区 */}
        <div className="flex-1 min-w-0">
          <div className="px-6 py-8 max-w-4xl mx-auto lg:ml-0 lg:mr-auto">
            <Breadcrumb items={breadcrumbItems} />
            <DocContent doc={doc} />
            <DocNavigation 
              prev={prevDoc ? { title: prevDoc.metadata.title, slug: prevDoc.slug } : undefined}
              next={nextDoc ? { title: nextDoc.metadata.title, slug: nextDoc.slug } : undefined}
            />
          </div>
        </div>
        
        {/* 右侧目录 - Docusaurus 风格 */}
        <TableOfContents items={doc.toc} />
      </div>
      <BackToTop />
    </>
  );
}
