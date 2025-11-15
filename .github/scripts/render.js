import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

// 配置
const DOCS_DIR = 'docs'; // 文档目录
const OUTPUT_DIR = 'rendered'; // 输出目录

/**
 * Markdown 转 HTML
 */
async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrism, { 
      showLineNumbers: true,
      ignoreMissing: true  // 忽略未知语言
    })
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

/**
 * 提取目录 TOC
 */
function extractToc(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      headings.push({ level, text, id });
    }
  }
  
  return headings;
}

/**
 * 递归读取目录下所有 Markdown 文件
 */
function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }
  
  return files;
}

/**
 * 生成侧边栏结构
 */
function generateSidebar(documents) {
  const sidebarItems = [];
  const groups = {};

  // 按目录分组
  for (const doc of documents) {
    const pathParts = doc.path.split('/');
    
    if (pathParts.length === 1) {
      // 根目录文件
      sidebarItems.push({
        type: 'doc',
        path: doc.path,
        slug: doc.slug,
        title: doc.metadata.title || doc.metadata.sidebar_label || pathParts[0],
        position: doc.metadata.sidebar_position || 999,
      });
    } else {
      // 子目录文件
      const groupName = pathParts[0];
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      
      groups[groupName].push({
        type: 'doc',
        path: doc.path,
        slug: doc.slug,
        title: doc.metadata.title || doc.metadata.sidebar_label || pathParts[pathParts.length - 1],
        position: doc.metadata.sidebar_position || 999,
      });
    }
  }

  // 排序并添加分组
  for (const [groupName, items] of Object.entries(groups)) {
    items.sort((a, b) => {
      if (a.position !== b.position) {
        return a.position - b.position;
      }
      return a.title.localeCompare(b.title);
    });

    sidebarItems.push({
      type: 'category',
      label: groupName,
      items: items,
    });
  }

  // 排序根目录项
  const rootItems = sidebarItems.filter(item => item.type === 'doc');
  const categoryItems = sidebarItems.filter(item => item.type === 'category');
  
  rootItems.sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position;
    }
    return a.title.localeCompare(b.title);
  });

  return [...rootItems, ...categoryItems];
}

/**
 * 生成 slug
 */
function generateSlug(filePath, position) {
  const pathWithoutExt = filePath.replace(/\.mdx?$/, '');
  const parts = pathWithoutExt.split('/');
  const fileName = parts[parts.length - 1];
  
  if (parts.length > 1) {
    const dir = parts[0];
    return position 
      ? `${dir}-${position}-${fileName}`
      : `${dir}-${fileName}`;
  }
  
  return position ? `${position}-${fileName}` : fileName;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Starting documentation rendering...\n');
  
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 获取所有 Markdown 文件
  const markdownFiles = getAllMarkdownFiles(DOCS_DIR);
  console.log(`📁 Found ${markdownFiles.length} markdown files\n`);

  const documents = [];
  
  // 处理每个文件
  for (const filePath of markdownFiles) {
    const fullPath = path.join(DOCS_DIR, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    console.log(`📄 Processing: ${filePath}`);
    
    // 解析 frontmatter
    const { data: metadata, content: markdown } = matter(content);
    
    // 渲染 HTML
    const html = await markdownToHtml(markdown);
    
    // 提取 TOC
    const toc = extractToc(markdown);
    
    // 生成 slug
    const slug = generateSlug(filePath, metadata.sidebar_position);
    
    // 构建文档对象
    const doc = {
      path: filePath,
      slug: slug,
      metadata: {
        title: metadata.title || path.basename(filePath, path.extname(filePath)),
        description: metadata.description || '',
        date: metadata.date || new Date().toISOString(),
        category: metadata.category || '',
        tags: metadata.tags || [],
        sidebar_position: metadata.sidebar_position || 999,
        sidebar_label: metadata.sidebar_label || '',
        ...metadata,
      },
      content: html,
      toc: toc,
      raw: markdown,
    };
    
    documents.push(doc);
    
    // 保存单个文档 JSON
    const outputPath = path.join(OUTPUT_DIR, 'docs', `${slug}.json`);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(doc, null, 2));
    
    console.log(`  ✅ Saved to: rendered/docs/${slug}.json`);
  }
  
  console.log('\n📊 Generating sidebar...');
  
  // 生成侧边栏
  const sidebar = generateSidebar(documents);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'sidebar.json'),
    JSON.stringify(sidebar, null, 2)
  );
  
  console.log('  ✅ Saved to: rendered/sidebar.json');
  
  // 生成文档列表索引
  const docsIndex = documents.map(doc => ({
    slug: doc.slug,
    path: doc.path,
    title: doc.metadata.title,
    description: doc.metadata.description,
    date: doc.metadata.date,
    category: doc.metadata.category,
    tags: doc.metadata.tags,
  }));
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'docs-index.json'),
    JSON.stringify(docsIndex, null, 2)
  );
  
  console.log('  ✅ Saved to: rendered/docs-index.json');
  
  // 生成元数据
  const metadata = {
    generatedAt: new Date().toISOString(),
    version: process.env.GITHUB_REF?.replace('refs/tags/', '') || 'dev',
    totalDocs: documents.length,
    categories: [...new Set(documents.map(d => d.metadata.category).filter(Boolean))],
    tags: [...new Set(documents.flatMap(d => d.metadata.tags))],
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('  ✅ Saved to: rendered/metadata.json');
  
  console.log('\n✨ Rendering complete!');
  console.log(`📦 Total documents: ${documents.length}`);
  console.log(`🏷️  Categories: ${metadata.categories.length}`);
  console.log(`🔖 Tags: ${metadata.tags.length}`);
  console.log(`📂 Output directory: ${OUTPUT_DIR}/`);
}

// 运行
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
