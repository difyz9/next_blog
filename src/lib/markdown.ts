// src/lib/markdown.ts
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { Element, Root } from 'hast';
import { Plugin } from 'unified';

/**
 * 生成标题 ID
 */
function generateHeadingId(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .toLowerCase()
    // 移除特殊字符，保留中文、字母、数字、空格、连字符
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/gi, '')
    // 将空格替换为连字符
    .replace(/\s+/g, '-')
    // 移除多余的连字符
    .replace(/-+/g, '-')
    // 移除首尾的连字符
    .replace(/^-+|-+$/g, '');
}

/**
 * 提取文本内容
 */
function getTextContent(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(getTextContent).join('');
  }
  return '';
}

/**
 * 自定义 Markdown 渲染器，添加 Tailwind CSS 类和 ID
 */
const customRenderer: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName) {
        const props = node.properties || {};

        switch (node.tagName) {
          case 'h1':
            props.className = ['text-4xl', 'font-bold', 'text-gray-900', 'mt-8', 'mb-4'];
            if (!props.id) {
              const text = getTextContent(node);
              props.id = generateHeadingId(text);
            }
            break;
          case 'h2':
            props.className = ['text-3xl', 'font-bold', 'text-gray-900', 'mt-6', 'mb-4'];
            if (!props.id) {
              const text = getTextContent(node);
              props.id = generateHeadingId(text);
            }
            break;
          case 'h3':
            props.className = ['text-2xl', 'font-bold', 'text-gray-900', 'mt-4', 'mb-2'];
            if (!props.id) {
              const text = getTextContent(node);
              props.id = generateHeadingId(text);
            }
            break;
          case 'h4':
            props.className = ['text-xl', 'font-semibold', 'text-gray-900', 'mt-4', 'mb-2'];
            if (!props.id) {
              const text = getTextContent(node);
              props.id = generateHeadingId(text);
            }
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
    .use(remarkRehype, { allowDangerousHtml: true }) // 允许 HTML
    .use(customRenderer)
    .use(rehypePrism)
    // 移除 rehypeSanitize，因为我们需要保留所有属性（className, id等）
    .use(rehypeStringify, { allowDangerousHtml: true })
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
    
    // 清理 Markdown 语法（链接、加粗等）
    const cleanText = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接
      .replace(/[*_`]/g, '') // 移除加粗、斜体、代码标记
      .trim();
    
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // 支持中文
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    toc.push({ id, text: cleanText, level });
  }

  return toc;
}
