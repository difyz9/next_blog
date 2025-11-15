// src/app/docs/[slug]/page.tsx
import { getAllDocs, getDocBySlug } from '@/lib/docs';
import { notFound } from 'next/navigation';
import DocContent from '@/components/DocContent';
import TableOfContents from '@/components/TableOfContents';
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
    title: doc.metadata.title,
    description: doc.metadata.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="flex">
      <DocContent doc={doc} />
      <TableOfContents items={doc.toc} />
    </div>
  );
}
