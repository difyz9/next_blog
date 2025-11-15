# Docusaurus 优化指南

本文档记录了参考 [Docusaurus](https://github.com/facebook/docusaurus) 对 next_blog 项目的优化。

## 已完成的优化

### 1. ✅ CSS scroll-margin-top 优化

**参考文件**: `packages/docusaurus-theme-common/src/utils/anchorUtils.module.css`

**实现位置**: `src/app/globals.css`

```css
/* Docusaurus 风格：使用 scroll-margin-top 处理锚点定位 */
article h1[id],
article h2[id],
article h3[id],
article h4[id],
article h5[id],
article h6[id] {
  scroll-margin-top: calc(var(--navbar-height, 80px) + 1rem);
}
```

**优势**:
- ✅ 使用原生 CSS 属性，无需 JavaScript 计算
- ✅ 更高性能，浏览器原生支持
- ✅ 自动处理锚点跳转和滚动
- ✅ 代码更简洁，易于维护

### 2. ✅ 简化 TOC 点击处理

**参考**: Docusaurus TOC 组件

**优化前**:
```typescript
const headerOffset = 100;
const elementTop = element.offsetTop;
window.scrollTo({
  top: elementTop - headerOffset,
  behavior: 'smooth'
});
```

**优化后**:
```typescript
element.scrollIntoView({
  behavior: 'smooth',
  block: 'start'
});
```

配合 CSS `scroll-margin-top`，无需手动计算偏移量。

### 3. ✅ TOC 配置支持

**参考**: `themeConfig.tableOfContents` in Docusaurus

**实现位置**: `blog.config.ts`

```typescript
tableOfContents: {
  minHeadingLevel: 2,  // 最小标题级别
  maxHeadingLevel: 3,  // 最大标题级别
}
```

**用途**:
- 允许用户自定义显示的标题层级
- 可以在配置中全局设置，也可以在单个页面 frontmatter 中覆盖

## 建议的进一步优化

### 1. IntersectionObserver 优化

**参考文件**: 
- `packages/docusaurus-theme-common/src/hooks/useTOCHighlight.ts`
- `packages/docusaurus-theme-classic/src/theme/TOCItems/index.tsx`

**当前实现问题**:
- rootMargin 配置可能不够精确
- threshold 设置可以更优化

**建议改进**:
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    const visibleHeadings = entries
      .filter(entry => entry.isIntersecting)
      .map(entry => ({
        target: entry.target,
        boundingClientRect: entry.boundingClientRect
      }));

    if (visibleHeadings.length > 0) {
      // 找到最上方的可见标题
      const topHeading = visibleHeadings.reduce((top, current) => {
        return current.boundingClientRect.top < top.boundingClientRect.top
          ? current
          : top;
      });
      setActiveId(topHeading.target.id);
    }
  },
  {
    rootMargin: '-100px 0px -66%',
    threshold: [0, 0.5, 1]
  }
);
```

### 2. 移动端 TOC 折叠组件

**参考文件**: 
- `packages/docusaurus-theme-classic/src/theme/TOCCollapsible/index.tsx`
- `packages/docusaurus-theme-classic/src/theme/TOCCollapsible/CollapseButton/index.tsx`

**建议**:
创建类似 Docusaurus 的可折叠 TOC 组件：
- 默认折叠状态
- 点击展开/收起
- 平滑动画过渡
- 使用 Collapsible 组件

### 3. TOC 树形结构

**参考文件**: `packages/docusaurus-theme-common/src/utils/tocUtils.ts`

**当前**: 扁平化的 TOC 列表

**建议**: 转换为树形结构，支持嵌套显示

```typescript
export type TOCTreeNode = {
  readonly value: string;
  readonly id: string;
  readonly level: number;
  readonly children: readonly TOCTreeNode[];
};

function treeifyTOC(flatTOC: readonly TOCItem[]): TOCTreeNode[] {
  const tree: TOCTreeNode[] = [];
  const stack: TOCTreeNode[] = [];

  for (const item of flatTOC) {
    const node: TOCTreeNode = {
      ...item,
      children: []
    };

    // 找到父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return tree;
}
```

### 4. 滚动位置保存

**参考文件**: `packages/docusaurus-theme-common/src/utils/scrollUtils.tsx`

**功能**: 
- 路由切换时保存滚动位置
- 返回时恢复滚动位置
- 提升用户体验

### 5. 响应式优化

**参考**: Docusaurus 的响应式设计

**建议**:
- 桌面端 (≥996px): 固定侧边栏 + 固定 TOC
- 平板端 (768px-996px): 可折叠侧边栏
- 移动端 (<768px): 全屏菜单 + 折叠 TOC

## 样式优化建议

### 1. TOC 高亮样式

参考 Docusaurus 的高亮效果：
```css
.table-of-contents__link--active {
  color: var(--ifm-color-primary);
  font-weight: 600;
  margin-left: -16px;
  padding-left: 12px;
  border-left: 4px solid var(--ifm-color-primary);
}
```

### 2. 平滑过渡

```css
.table-of-contents__link {
  transition: all 0.2s ease-in-out;
}
```

### 3. 悬停效果

```css
.table-of-contents__link:hover {
  color: var(--ifm-color-primary);
  text-decoration: none;
}
```

## 性能优化

### 1. TOC 渲染优化

**当前**: 每次滚动都更新 activeId

**建议**: 使用 throttle/debounce 限制更新频率

```typescript
import { throttle } from 'lodash';

const handleIntersection = throttle((entries) => {
  // 处理逻辑
}, 100);
```

### 2. 懒加载

对于长文档，考虑懒加载不在视口的部分。

### 3. Memo 优化

```typescript
const TOCItemTree = React.memo(({ toc, className, linkClassName }) => {
  // 组件逻辑
});
```

## 总结

通过参考 Docusaurus 的实现，我们已经完成了以下核心优化：

✅ **CSS scroll-margin-top** - 更优雅的锚点定位  
✅ **简化点击处理** - 使用原生 scrollIntoView API  
✅ **TOC 配置支持** - 可自定义标题级别范围  

还可以进一步参考 Docusaurus 实现：
- 更精确的 IntersectionObserver 配置
- 移动端折叠 TOC 组件
- TOC 树形结构渲染
- 滚动位置保存和恢复
- 完整的响应式设计

这些优化使 next_blog 更接近 Docusaurus 的专业体验！
