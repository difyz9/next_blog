// 右侧目录显示问题排查指南

## 检查清单

### 1. 浏览器宽度
- ✅ 确保浏览器宽度 ≥ 1024px（lg 断点）
- 如果宽度不够，目录会隐藏，显示浮动按钮

### 2. 查看控制台日志
打开浏览器控制台（F12），查找：
- `[TableOfContents] Received items: X` - 应该显示目录项数量
- `[TableOfContents] Items:` - 显示完整的目录数据
- `[TableOfContents] No items, returning null` - 如果看到这个，说明没有目录数据
- `[TableOfContents] Rendering with X items` - 正在渲染目录

### 3. 检查文档内容
目录只会从标题生成：
- 需要有 `##` (H2) 或更多级别的标题
- `#` (H1) 通常是页面标题，不会出现在右侧目录中

### 4. 临时测试方法

#### 方法 A：强制显示（调试用）
修改 `src/components/TableOfContents.tsx` 第 59 行：
```tsx
// 原来
<aside className="hidden lg:block w-72 ...">

// 改为（强制显示）
<aside className="block w-72 ...">
```

#### 方法 B：降低断点
已经从 `xl:block`（≥1280px）改为 `lg:block`（≥1024px）

### 5. 检查文档数据
访问文档页面时，查看终端输出：
```
[DocPage] TOC items: X  <- 应该 > 0
[DocPage] First TOC item: { id: '...', text: '...', level: 2 }
```

### 6. 测试步骤
1. 访问 http://localhost:3001/docs/[任意文档]
2. 打开浏览器开发者工具（F12）
3. 切换到 Console 标签
4. 查找 `[TableOfContents]` 开头的日志
5. 检查浏览器宽度是否 ≥1024px
6. 如果还是不显示，尝试强制显示方法

### 7. 可能的原因

#### 原因 1：浏览器宽度不够
- **解决**：将浏览器拉宽到至少 1024px
- 或者使用移动端浮动按钮（右下角）

#### 原因 2：文档没有标题
- **解决**：确保文档中有 ## 或 ### 标题
- 检查控制台日志确认 TOC items 数量

#### 原因 3：样式被覆盖
- **解决**：检查是否有其他 CSS 隐藏了右侧栏
- 在浏览器开发者工具中检查 `<aside>` 元素

#### 原因 4：Z-index 问题
- **解决**：确保目录不在其他元素下方
- 已添加 `bg-white` 确保可见

### 8. 快速验证命令

在浏览器控制台运行：
```javascript
// 检查目录容器是否存在
document.querySelector('aside.border-l');

// 检查目录项数量
document.querySelectorAll('.toc-nav a').length;

// 检查是否被隐藏
window.getComputedStyle(document.querySelector('aside.border-l')).display;
```

### 9. 如果还是不显示

临时强制显示版本：
修改 TableOfContents.tsx 第 59-61 行为：
```tsx
<aside className="block w-72 flex-shrink-0 border-l-2 border-red-500 bg-yellow-50">
  <div className="sticky top-20 py-8 px-6">
```

这会：
- 强制显示（移除 hidden lg:block）
- 红色边框（容易看到）
- 黄色背景（确认位置）

如果这样还看不到，那就是布局问题，不是显示问题。
