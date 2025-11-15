# URL 路径规则说明

本系统根据文档的 `sidebar_position` 字段自动生成友好的 URL 路径。

## URL 生成规则

### 1. 有 sidebar_position 的文档

URL 格式：`/docs/{position}-{filename}`

**示例：**

```markdown
# docs/intro.md
---
title: "介绍"
sidebar_position: 1
---
```

生成 URL: `/docs/1-intro`

---

```markdown
# docs/installation.md
---
title: "安装指南"
sidebar_position: 2
---
```

生成 URL: `/docs/2-installation`

### 2. 子目录中的文档

URL 格式：`/docs/{directory}-{position}-{filename}`

**示例：**

```markdown
# docs/tutorial/basic.md
---
title: "基础教程"
sidebar_position: 1
---
```

生成 URL: `/docs/tutorial-1-basic`

---

```markdown
# docs/api/models.md
---
title: "Models API"
sidebar_position: 5
---
```

生成 URL: `/docs/api-5-models`

### 3. 多层嵌套目录

URL 格式：`/docs/{dir1}-{dir2}-{position}-{filename}`

**示例：**

```markdown
# docs/guide/advanced/optimization.md
---
title: "性能优化"
sidebar_position: 3
---
```

生成 URL: `/docs/guide-advanced-3-optimization`

### 4. 没有 sidebar_position 的文档

URL 格式：`/docs/{full-path-with-dashes}`

**示例：**

```markdown
# docs/misc/notes.md
---
title: "笔记"
---
```

生成 URL: `/docs/misc-notes`

## 优势

### 1. **有序且直观**
- URL 中包含 position，一目了然知道文档顺序
- 例如：`/docs/1-intro`, `/docs/2-installation`, `/docs/3-quickstart`

### 2. **保持目录结构**
- 子目录信息保留在 URL 中
- 例如：`/docs/tutorial-1-basic`, `/docs/tutorial-2-advanced`

### 3. **SEO 友好**
- URL 包含文件名，对搜索引擎友好
- 例如：`/docs/api-1-models` 比 `/docs/api-models-ajk3h8` 更好

### 4. **易于管理**
- 通过调整 `sidebar_position` 就能改变 URL
- 不需要手动设置 slug

## 完整示例

### 文档结构：

```
docs/
├── intro.md (sidebar_position: 1)
├── installation.md (sidebar_position: 2)
├── quickstart.md (sidebar_position: 3)
├── tutorial/
│   ├── basic.md (sidebar_position: 1)
│   ├── advanced.md (sidebar_position: 2)
│   └── examples.md (sidebar_position: 3)
└── api/
    ├── overview.md (sidebar_position: 1)
    └── models.md (sidebar_position: 2)
```

### 生成的 URL：

```
/docs/1-intro
/docs/2-installation
/docs/3-quickstart
/docs/tutorial-1-basic
/docs/tutorial-2-advanced
/docs/tutorial-3-examples
/docs/api-1-overview
/docs/api-2-models
```

### 侧边栏显示：

```
- 介绍 → /docs/1-intro
- 安装 → /docs/2-installation
- 快速开始 → /docs/3-quickstart
- 教程/
  - 基础 → /docs/tutorial-1-basic
  - 进阶 → /docs/tutorial-2-advanced
  - 示例 → /docs/tutorial-3-examples
- API/
  - 概览 → /docs/api-1-overview
  - Models → /docs/api-2-models
```

## 注意事项

### 1. **sidebar_position 改变会影响 URL**

如果你修改了 `sidebar_position`：

```markdown
# 修改前
sidebar_position: 2
URL: /docs/2-installation

# 修改后
sidebar_position: 5
URL: /docs/5-installation
```

旧的 URL 将失效，需要注意外部链接。

### 2. **文件名重命名**

重命名文件也会改变 URL：

```markdown
# 修改前
docs/install.md → /docs/2-install

# 修改后  
docs/installation.md → /docs/2-installation
```

### 3. **建议使用重定向**

如果需要改变 position 但保持旧 URL 可访问，可以：
- 在 Next.js 中配置重定向
- 或者固定某些重要页面的 position

## 最佳实践

### 1. **预留 position 间隔**

```yaml
sidebar_position: 10  # 而不是 1
sidebar_position: 20  # 而不是 2
sidebar_position: 30  # 而不是 3
```

这样在中间插入新文档时不需要调整所有 position。

### 2. **核心文档固定 position**

```yaml
# docs/intro.md - 始终是 1
sidebar_position: 1

# docs/installation.md - 始终是 2
sidebar_position: 2
```

### 3. **使用有意义的文件名**

```yaml
# 好的
docs/quickstart.md → /docs/3-quickstart

# 不好的
docs/doc1.md → /docs/3-doc1
```

### 4. **同一目录下避免重复 position**

```markdown
# 避免
docs/a.md (sidebar_position: 1)
docs/b.md (sidebar_position: 1)  # 重复了

# 推荐
docs/a.md (sidebar_position: 1)
docs/b.md (sidebar_position: 2)
```

## 迁移指南

如果你有现有文档想要使用新的 URL 规则：

### 1. 为所有文档添加 sidebar_position

```bash
# docs/intro.md
---
title: "介绍"
sidebar_position: 1  # 添加
---

# docs/guide.md
---
title: "指南"
sidebar_position: 2  # 添加
---
```

### 2. URL 将自动更新

```
旧: /docs/intro → 新: /docs/1-intro
旧: /docs/guide → 新: /docs/2-guide
```

### 3. 配置重定向（可选）

在 `next.config.ts` 中添加：

```typescript
async redirects() {
  return [
    {
      source: '/docs/intro',
      destination: '/docs/1-intro',
      permanent: true,
    },
    {
      source: '/docs/guide',
      destination: '/docs/2-guide',
      permanent: true,
    },
  ];
}
```

## 总结

- ✅ **有 sidebar_position**: `/docs/{position}-{filename}`
- ✅ **子目录**: `/docs/{dir}-{position}-{filename}`
- ✅ **多层目录**: `/docs/{dir1}-{dir2}-{position}-{filename}`
- ✅ **无 position**: `/docs/{full-path}`
- ✅ **自动排序**: 按 position 排序
- ✅ **SEO 友好**: 包含关键词的可读 URL
