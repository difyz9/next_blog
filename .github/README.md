# GitHub Actions 配置文件

## 📁 目录说明

此目录包含 GitHub Actions 预渲染所需的配置文件。

### 📄 workflows/render-docs.yml

GitHub Actions workflow 配置文件，用于：
- 监听 tag 推送事件
- 自动渲染所有 Markdown 文档为 JSON
- 创建 `rendered/{tag}` 分支存储结果
- 更新 `rendered/latest` 指向最新版本

### 📄 scripts/render.js

文档渲染脚本，功能：
- 递归扫描文档目录
- 解析 frontmatter 元数据
- 渲染 Markdown 为 HTML
- 提取文章目录（TOC）
- 生成侧边栏结构
- 输出 JSON 格式数据

## 🚀 使用方法

### 1. 复制到文档仓库

将这两个文件复制到您的**文档仓库**（不是 Next.js 项目）：

```bash
# 在文档仓库中
mkdir -p .github/workflows
mkdir -p .github/scripts

# 复制文件
cp /path/to/next_blog/.github/workflows/render-docs.yml .github/workflows/
cp /path/to/next_blog/.github/scripts/render.js .github/scripts/
```

### 2. 修改配置（可选）

如果您的文档目录不是 `docs/`，需要修改 `render.js`：

```javascript
// .github/scripts/render.js
const DOCS_DIR = 'docs'; // 改为您的目录名
```

### 3. 推送 Tag 触发

```bash
# 创建 tag
git tag v1.0.0

# 推送 tag
git push origin v1.0.0
```

GitHub Actions 会自动运行并生成预渲染文件。

### 4. 检查结果

1. 访问 Actions 页面：`https://github.com/your-username/your-repo/actions`
2. 查看 "Render Documentation" workflow 状态
3. 成功后会创建 `rendered/v1.0.0` 和 `rendered/latest` 分支

## 📊 输出结构

渲染完成后会生成以下文件：

```
rendered/
├── docs/
│   ├── {slug1}.json      # 单个文档（包含 HTML）
│   ├── {slug2}.json
│   └── ...
├── docs-index.json       # 所有文档索引
├── sidebar.json          # 侧边栏结构
└── metadata.json         # 元数据（版本、生成时间等）
```

## 🔧 高级配置

### 自定义渲染逻辑

编辑 `scripts/render.js`：

```javascript
// 修改输出目录
const OUTPUT_DIR = 'rendered';

// 修改文档目录
const DOCS_DIR = 'docs';

// 自定义 slug 生成
function generateSlug(filePath, position) {
  // 您的逻辑
}
```

### 添加额外处理

```javascript
// 在 markdownToHtml 函数中添加自定义插件
const result = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(yourCustomPlugin) // 添加这里
  .use(remarkRehype)
  .process(markdown);
```

### 触发条件

修改 `workflows/render-docs.yml`：

```yaml
on:
  push:
    tags:
      - 'v*'        # 只匹配 v 开头的 tag
      # - '*'       # 匹配所有 tag
    branches:
      - main        # 每次推送到 main 也触发
```

## 📚 相关文档

- [快速开始](../QUICKSTART_PRERENDER.md)
- [完整指南](../GITHUB_ACTIONS_SETUP.md)
- [配置说明](../ENV_CONFIG_GUIDE.md)

## 🐛 故障排查

### Actions 失败

查看 Actions 日志获取详细错误信息：
1. 进入 Actions 页面
2. 点击失败的 workflow
3. 查看具体步骤的输出

常见问题：
- **依赖安装失败**：检查 npm install 步骤
- **文件路径错误**：确认 `DOCS_DIR` 配置正确
- **权限问题**：确认 Actions 有写入权限

### 输出文件缺失

检查 workflow 日志中的 "Render Markdown to JSON" 步骤输出：
- 应该显示找到的文档数量
- 应该显示生成的 JSON 文件路径

### 分支未创建

确认：
1. workflow 中的 git push 步骤成功执行
2. 检查仓库的分支列表：`git ls-remote origin | grep rendered`

## 💡 最佳实践

1. **语义化版本**：使用 `v1.0.0` 格式的 tag
2. **保留历史**：不要删除旧的 `rendered/*` 分支
3. **定期清理**：可选择性保留最近 N 个版本
4. **监控日志**：定期查看 Actions 运行状态

## 🎯 下一步

完成配置后：

1. 在 Next.js 项目配置环境变量：
   ```env
   DATA_SOURCE=pre-rendered
   RENDERED_VERSION=latest
   ```

2. 重启 Next.js 项目

3. 享受 10-20 倍性能提升！

---

**需要帮助？** 查看 [完整文档](../GITHUB_ACTIONS_SETUP.md)
