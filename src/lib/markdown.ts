// src/lib/markdown.ts
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { Element, Root } from 'hast';
import { Plugin } from 'unified';

/**
 * 自定义 Markdown 渲染器，添加 Tailwind CSS 类
 */
const customRenderer: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName) {
        const props = node.properties || {};

        switch (node.tagName) {
          case 'h1':
            props.className = ['text-4xl', 'font-bold', 'text-gray-900', 'mt-8', 'mb-4'];
            break;
          case 'h2':
            props.className = ['text-3xl', 'font-bold', 'text-gray-900', 'mt-6', 'mb-4'];
            break;
          case 'h3':
            props.className = ['text-2xl', 'font-bold', 'text-gray-900', 'mt-4', 'mb-2'];
            break;
          case 'h4':
            props.className = ['text-xl', 'font-semibold', 'text-gray-900', 'mt-4', 'mb-2'];
            break;
          case 'p':
            props.className = ['text-gray-800', 'leading-relaxed', 'mb-4'];
            break;
          case 'a':
            props.className = ['text-blue-600', 'hover:text-blue-800', 'underline'];
            break;
          case 'ul':
            props.className = ['list-disc', 'list-inside', 'mb-4', 'space-y-2', 'pl-4'];
            break;
          case 'ol':
            props.className = ['list-decimal', 'list-inside', 'mb-4', 'space-y-2', 'pl-4'];
            break;
          case 'blockquote':
            props.className = ['border-l-4', 'border-gray-300', 'pl-4', 'italic', 'my-4', 'text-gray-600'];
            break;
          case 'pre':
            props.className = ['bg-gray-900', 'rounded-lg', 'p-4', 'overflow-x-auto', 'mb-4'];
            break;
          case 'code':
            if (!props.className) {
              props.className = ['bg-gray-100', 'px-1', 'py-0.5', 'rounded', 'text-sm', 'font-mono'];
            }
            break;
          case 'table':
            props.className = ['min-w-full', 'divide-y', 'divide-gray-300', 'my-4'];
            break;
          case 'thead':
            props.className = ['bg-gray-50'];
            break;
          case 'th':
            props.className = ['px-4', 'py-2', 'text-left', 'text-sm', 'font-semibold', 'text-gray-900'];
            break;
          case 'td':
            props.className = ['px-4', 'py-2', 'text-sm', 'text-gray-700'];
            break;
          case 'img':
            props.className = ['rounded-lg', 'shadow-lg', 'my-4', 'max-w-full', 'h-auto'];
            break;
          default:
            break;
        }

        node.properties = props;
      }
    });
  };
};

/**
 * 将 Markdown 转换为 HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(customRenderer)
    .use(rehypePrism)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

/**
 * 提取标题生成目录
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}
