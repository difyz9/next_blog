// src/app/docs/layout.tsx
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { generateSidebar } from '@/lib/docs';

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = await generateSidebar();

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
