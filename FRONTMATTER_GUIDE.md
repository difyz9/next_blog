# 文档 Frontmatter 字段说明

在 Markdown 文档的开头使用 YAML frontmatter 来配置文档元数据和侧边栏显示。

## 基本示例

```markdown
---
title: "快速开始"
sidebar_label: "开始"
sidebar_position: 1
description: "这是一个简短的描述"
category: "教程"
tags: ["入门", "基础"]
---

# 快速开始

文档内容...
```

## 字段说明

### 必需字段

- **`title`** (string, 必需)
  - 文档的标题
  - 会显示在页面顶部和浏览器标签
  - 如果没有设置 `sidebar_label`，也会用作侧边栏标签

### 侧边栏相关字段

- **`sidebar_label`** (string, 可选)
  - 在侧边栏中显示的标签
  - 如果未设置，使用 `title`
  - 用于缩短侧边栏中的显示文本
  
  ```yaml
  title: "LangChain Go 完整指南与最佳实践"
  sidebar_label: "LangChain Go"
  ```

- **`sidebar_position`** (number, 可选)
  - 控制在侧边栏中的排序位置
  - 数字越小，排序越靠前
  - 如果未设置，按字母顺序排序
  
  ```yaml
  sidebar_position: 1  # 排在第一位
  ```

### 其他字段

- **`description`** (string, 可选)
  - 文档的简短描述
  - 显示在文档标题下方
  - 用于 SEO

- **`date`** (string, 可选)
  - 文档的创建或更新日期
  - 格式: "YYYY-MM-DD"
  
  ```yaml
  date: "2024-01-15"
  ```

- **`category`** (string, 可选)
  - 文档分类
  - 显示为标签

- **`tags`** (array, 可选)
  - 文档标签列表
  - 用于分类和搜索
  
  ```yaml
  tags: ["Go", "LangChain", "AI"]
  ```

- **`author`** (string, 可选)
  - 文档作者
  - 显示在页面底部

## 完整示例

### 示例 1: 教程首页

```markdown
---
title: "LangChain Go 教程"
sidebar_label: "介绍"
sidebar_position: 1
description: "LangChain Go 的完整入门指南"
category: "入门"
tags: ["tutorial", "getting-started"]
author: "张三"
date: "2024-01-15"
---

# LangChain Go 教程

欢迎来到 LangChain Go 教程...
```

### 示例 2: API 参考

```markdown
---
title: "API Reference - Models"
sidebar_label: "Models"
sidebar_position: 10
description: "LangChain Go Models API 参考文档"
category: "API"
tags: ["api", "models"]
---

# Models API

## 概述

Models 模块提供了...
```

### 示例 3: 目录中的文档

```markdown
---
title: "安装 LangChain Go"
sidebar_position: 2
description: "如何在项目中安装和配置 LangChain Go"
category: "入门"
---

# 安装

## 使用 go get 安装

\```bash
go get github.com/tmc/langchaingo
\```
```

## 排序规则

侧边栏按以下规则排序：

1. **优先按 `sidebar_position` 数字排序**
   - 有 `sidebar_position` 的文档排在前面
   - 数字小的排在前面

2. **其次按字母顺序排序**
   - 没有 `sidebar_position` 的文档按 `sidebar_label` 或 `title` 字母顺序排序

3. **目录结构**
   - 保持目录层级结构
   - 每个目录内部独立排序

## 示例目录结构

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
    └── reference.md (sidebar_position: 2)
```

对应的侧边栏显示：

```
- 介绍 (intro.md)
- 安装 (installation.md)  
- 快速开始 (quickstart.md)
- 教程/
  - 基础 (basic.md)
  - 进阶 (advanced.md)
  - 示例 (examples.md)
- API/
  - 概览 (overview.md)
  - 参考 (reference.md)
```

## 注意事项

1. **YAML 语法**
   - frontmatter 必须以 `---` 开始和结束
   - 字段名称区分大小写
   - 字符串可以用引号括起来（推荐）

2. **必需字段**
   - 至少需要 `title` 字段
   - 其他字段都是可选的

3. **sidebar_position**
   - 使用整数（1, 2, 3...）
   - 可以跳过数字（1, 3, 5...）
   - 允许使用小数（1, 1.5, 2）

4. **中文支持**
   - 所有字段都支持中文
   - 推荐使用引号括起中文内容

## 最佳实践

1. **为所有文档设置 title**
   ```yaml
   title: "清晰的文档标题"
   ```

2. **为重要文档设置 sidebar_position**
   ```yaml
   sidebar_position: 1
   ```

3. **使用简洁的 sidebar_label**
   ```yaml
   title: "LangChain Go 完整使用指南和最佳实践"
   sidebar_label: "使用指南"
   ```

4. **添加描述提升 SEO**
   ```yaml
   description: "详细的文档描述，用于搜索引擎优化"
   ```

5. **合理使用分类和标签**
   ```yaml
   category: "教程"
   tags: ["go", "ai", "langchain"]
   ```
