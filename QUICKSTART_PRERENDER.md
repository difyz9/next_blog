# 快速开始：GitHub Actions 预渲染

## 🎯 目标

让您的文档网站加载速度提升 **10-20 倍**！

## ⏱️ 5 分钟完成配置

### 步骤 1：复制文件到文档仓库

在您的**文档仓库**（如 `difyz9/QuickNote`）创建这两个文件：

#### 📄 `.github/workflows/render-docs.yml`

```bash
mkdir -p .github/workflows
curl -o .github/workflows/render-docs.yml \
  https://raw.githubusercontent.com/your-username/next_blog/main/.github/workflows/render-docs.yml
```

或手动复制 `next_blog/.github/workflows/render-docs.yml` 的内容。

#### 📄 `.github/scripts/render.js`

```bash
mkdir -p .github/scripts
curl -o .github/scripts/render.js \
  https://raw.githubusercontent.com/your-username/next_blog/main/.github/scripts/render.js
```

或手动复制 `next_blog/.github/scripts/render.js` 的内容。

**重要**：如果您的文档目录不是 `docs/`，需要修改 `render.js` 第 13 行：

```javascript
const DOCS_DIR = 'docs'; // 改为您的目录，如 'documentation'
```

### 步骤 2：配置 Next.js 项目

修改 `next_blog/.env.local`：

```env
# 切换到预渲染模式
DATA_SOURCE=pre-rendered

# 使用最新版本
RENDERED_VERSION=latest

# 保持原有配置
GITHUB_REPO=difyz9/QuickNote
GITHUB_TOKEN=ghp_xxxxx
```

### 步骤 3：推送第一个 Tag

在**文档仓库**执行：

```bash
# 添加、提交文件
git add .github/
git commit -m "Add GitHub Actions for pre-rendering"
git push

# 创建 tag
git tag v1.0.0
git push origin v1.0.0
```

### 步骤 4：等待渲染完成

1. 访问 `https://github.com/difyz9/QuickNote/actions`
2. 查看 "Render Documentation" workflow
3. 等待状态变为 ✅（通常 1-3 分钟）

### 步骤 5：重启 Next.js 项目

```bash
cd next_blog

# 重启服务
npm run dev
```

访问 http://localhost:3001/docs

您应该看到控制台输出：
```
[Docs] Data source: pre-rendered
[PreRendered] Fetching docs index...
[PreRendered] Found documents: 45
```

## ✅ 完成！

现在您的文档加载速度已经提升 10-20 倍！

---

## 🔄 更新文档

以后每次更新文档，只需：

```bash
# 在文档仓库
git add .
git commit -m "Update docs"
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions 会自动：
1. 渲染所有 Markdown
2. 更新 `rendered/latest` 分支
3. Next.js 项目自动使用新数据（1小时后）

**立即刷新**缓存：

```bash
curl -X POST http://localhost:3001/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","tags":["prerendered-index"]}'
```

---

## 🎨 高级配置

### 使用特定版本

```env
# .env.local
RENDERED_VERSION=v1.0.0  # 锁定版本，不会自动更新
```

### 开发模式（实时更新）

```env
# .env.local
DATA_SOURCE=github-api  # 每次从 GitHub API 获取最新内容
```

### 环境分离

```bash
# 开发环境 - 实时
export DATA_SOURCE=github-api

# 生产环境 - 预渲染
export DATA_SOURCE=pre-rendered
export RENDERED_VERSION=latest
```

---

## 🐛 遇到问题？

### Actions 失败

查看日志：`https://github.com/your-repo/actions`

常见原因：
- 文档目录路径错误
- 缺少 frontmatter

### 文档未更新

```bash
# 1. 检查 rendered 分支是否存在
git ls-remote origin | grep rendered

# 2. 手动触发 revalidate
curl -X POST http://localhost:3001/api/revalidate \
  -d '{"secret":"your-secret","tags":["prerendered-index"]}'
```

### 404 错误

确认环境变量：
```bash
echo $DATA_SOURCE
echo $RENDERED_VERSION
```

---

## 📚 更多文档

- [完整部署指南](./GITHUB_ACTIONS_SETUP.md)
- [性能优化详解](./PERFORMANCE_OPTIMIZATION.md)
- [故障排查](./GITHUB_ACTIONS_SETUP.md#🐛-故障排查)

---

**享受极速文档体验！🚀**
