# 性能优化方案

## 当前架构性能分析

### 现状
- 每次页面访问都需要调用 GitHub API
- Markdown 解析在服务端进行
- 60秒 ISR 缓存
- 侧边栏每次重新生成

### 瓶颈
1. **GitHub API 调用** - 主要瓶颈（200-500ms）
2. **Markdown 渲染** - 次要瓶颈（50-100ms）
3. **侧边栏生成** - 需要获取所有文档元数据

---

## 方案 1：完全静态导出（零 API 调用）

### 架构
```
构建时获取所有文档 → 生成静态 HTML → 部署到 CDN
```

### 实现步骤

#### 1. 修改 Next.js 配置启用完全静态导出

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export', // 启用静态导出
  images: {
    unoptimized: true, // 静态导出需要
  },
  // 移除 ISR，改用完全静态
};
```

#### 2. 在构建时获取所有数据

```typescript
// src/lib/static-builder.ts
export async function buildStaticData() {
  // 构建时一次性获取所有文档
  const docs = await getAllDocs();
  const sidebar = await generateSidebar();
  
  // 保存为静态 JSON
  fs.writeFileSync(
    'public/data/docs.json',
    JSON.stringify(docs)
  );
  fs.writeFileSync(
    'public/data/sidebar.json',
    JSON.stringify(sidebar)
  );
}
```

#### 3. 触发构建的 GitHub Actions

```yaml
# .github/workflows/rebuild.yml
name: Rebuild on Docs Update

on:
  repository_dispatch:
    types: [docs-updated]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### 性能提升
- **首次加载**: 2000ms → **200ms** (10x)
- **后续导航**: 500ms → **50ms** (10x)
- **无 API 限额问题**

### 缺点
- 内容更新需要重新构建
- 构建时间可能较长（文档多时）

---

## 方案 2：GitHub Actions 预渲染（您的建议）

### 在文档仓库配置 Actions

```yaml
# 文档仓库: .github/workflows/render-docs.yml
name: Render Markdown to HTML

on:
  push:
    paths:
      - 'docs/**/*.md'

jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install remark remark-html gray-matter
      
      - name: Render Markdown
        run: node scripts/render-docs.js
      
      - name: Commit rendered files
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add rendered/
          git commit -m "Auto-render docs"
          git push
```

### 渲染脚本

```javascript
// scripts/render-docs.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { remark } = require('remark');
const html = require('remark-html');

async function renderDocs() {
  const docsDir = 'docs';
  const outputDir = 'rendered';
  
  // 递归处理所有 MD 文件
  const files = getAllMarkdownFiles(docsDir);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const { data, content: markdown } = matter(content);
    
    // 渲染 HTML
    const result = await remark()
      .use(html)
      .process(markdown);
    
    // 生成 JSON（包含元数据和 HTML）
    const output = {
      metadata: data,
      html: result.toString(),
      path: file.replace(docsDir, ''),
    };
    
    // 保存
    const outputPath = file
      .replace(docsDir, outputDir)
      .replace('.md', '.json');
    
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  }
  
  // 生成索引
  const index = files.map(f => ({
    path: f.replace(docsDir, '').replace('.md', ''),
    title: '...', // 从 frontmatter 提取
  }));
  
  fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(index, null, 2)
  );
}

renderDocs();
```

### Next.js 读取预渲染内容

```typescript
// src/lib/prerendered.ts
export async function getPrerenderedDoc(slug: string) {
  const { repo, branch } = blogConfig.github;
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/rendered/${slug}.json`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // 1小时缓存
  });
  
  return await response.json();
}
```

### 性能提升
- **首次加载**: 2000ms → **300ms** (6.7x)
- **无 Markdown 解析开销**
- **仍有一次 HTTP 请求**

---

## 方案 3：混合方案（最优）

### 架构流程

```
┌─────────────────┐
│  文档仓库更新    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│  1. 渲染 MD     │
│  2. 生成索引    │
│  3. 推送到分支  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Vercel部署    │
│  触发重新构建   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 静态HTML页面    │
│ + Edge CDN缓存  │
└─────────────────┘
```

### 实现特点
- ✅ 预渲染（无运行时解析）
- ✅ 静态导出（CDN 友好）
- ✅ 自动更新（Actions 触发）
- ✅ 零侵入（独立 Actions）

### 详细配置

#### 文档仓库 Actions
```yaml
name: Pre-render and Deploy

on:
  push:
    paths:
      - 'docs/**'

jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout docs repo
        uses: actions/checkout@v3
        
      - name: Render all docs
        run: npm run render-docs
        
      - name: Trigger website rebuild
        run: |
          curl -X POST https://api.vercel.com/v1/integrations/deploy/... \
            -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}"
```

#### Next.js 构建时获取预渲染数据
```typescript
// 构建时一次性获取所有预渲染数据
export async function getStaticProps() {
  const prerenderedIndex = await fetch(
    'https://raw.githubusercontent.com/.../rendered/index.json'
  );
  
  return {
    props: { docs: await prerenderedIndex.json() },
    revalidate: false, // 完全静态
  };
}
```

---

## 方案 4：增量优化（最简单，立即可做）

### 不改架构，只优化现有代码

#### 1. 更激进的缓存

```typescript
// src/lib/github.ts
export async function getDirectoryTree() {
  const response = await fetch(url, {
    next: { 
      revalidate: 3600, // 1小时（而不是5分钟）
      tags: ['docs-tree'], // 支持按需重新验证
    },
  });
}

export async function getFileContent(path: string) {
  const response = await fetch(url, {
    next: { 
      revalidate: 3600, // 1小时
      tags: [`doc-${path}`],
    },
  });
}
```

#### 2. 并行化 API 调用

```typescript
// src/lib/docs.ts
export async function getAllDocs() {
  const tree = await getDirectoryTree();
  const mdFiles = tree.filter(/* ... */);
  
  // 并行获取所有文档（而不是串行）
  const docs = await Promise.all(
    mdFiles.map(file => getDocByPath(file.path))
  );
  
  return docs;
}
```

#### 3. 使用 Vercel Edge Cache

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/docs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};
```

#### 4. 预取侧边栏数据

```typescript
// src/app/docs/layout.tsx
export default async function DocsLayout() {
  // 在布局层级预取，避免每个页面都请求
  const sidebarData = await generateSidebar();
  
  return (
    <SidebarProvider data={sidebarData}>
      {children}
    </SidebarProvider>
  );
}
```

### 性能提升
- **首次加载**: 2000ms → **800ms** (2.5x)
- **后续导航**: 500ms → **100ms** (5x)
- **零配置成本**

---

## 📊 方案对比总结

| 方案 | 性能提升 | 实现成本 | 维护成本 | 实时性 |
|------|---------|---------|---------|--------|
| 完全静态导出 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ❌ 需重新构建 |
| Actions预渲染 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ Actions延迟 |
| 混合方案 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ 自动触发 |
| 增量优化 | ⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐ 接近实时 |

---

## 🎯 我的推荐

### 阶段 1：立即实施（今天）
**方案 4 - 增量优化**
- 修改缓存策略为 1 小时
- 添加并行 API 调用
- 配置 Edge Cache

**预期效果**: 性能提升 2-5 倍，无需改架构

### 阶段 2：中期优化（1-2周）
**方案 2 - Actions 预渲染**
- 在文档仓库添加 Actions
- 预渲染 Markdown 为 JSON
- Next.js 读取预渲染内容

**预期效果**: 性能提升 6-7 倍，轻度侵入

### 阶段 3：长期方案（1个月+）
**方案 3 - 混合方案**
- 完整的预渲染管道
- 自动触发构建
- 完全静态导出

**预期效果**: 性能提升 10+ 倍，生产级方案

---

## 💻 我现在可以帮您做什么？

1. **立即实施增量优化** - 修改现有代码提升性能
2. **创建 GitHub Actions 配置** - 帮您写预渲染脚本
3. **配置完全静态导出** - 改为纯静态站点
4. **设计混合方案架构** - 详细实现方案

您想从哪个开始？我推荐先做 **增量优化**，这是零风险、高回报的选择。
