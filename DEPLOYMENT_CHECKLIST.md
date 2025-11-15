# GitHub Actions 预渲染 - 部署检查清单

## ✅ 部署前检查

### 📦 文件准备

- [ ] `.github/workflows/render-docs.yml` 已创建
- [ ] `.github/scripts/render.js` 已创建
- [ ] `render.js` 中的 `DOCS_DIR` 已正确配置
- [ ] 所有文档包含有效的 frontmatter

### ⚙️ Next.js 配置

- [ ] `.env.local` 文件已创建
- [ ] `DATA_SOURCE` 已设置（`pre-rendered` 或 `github-api`）
- [ ] `RENDERED_VERSION` 已设置（`latest` 或特定 tag）
- [ ] `GITHUB_REPO` 格式正确（`owner/repo`）
- [ ] `GITHUB_TOKEN` 已设置且有效
- [ ] `blog.config.ts` 中的 `docsPath` 与文档仓库一致

### 🔐 权限检查

- [ ] GitHub Token 包含 `repo` 权限
- [ ] Actions 有写入权限（Settings → Actions → Workflow permissions）
- [ ] 文档仓库允许创建新分支

### 📝 文档格式

- [ ] 所有 Markdown 文件包含 `title` frontmatter
- [ ] `sidebar_position` 使用数字（可选）
- [ ] 文件路径不包含特殊字符
- [ ] 文件编码为 UTF-8

---

## 🚀 首次部署步骤

### 1. 文档仓库配置

```bash
# 在文档仓库中
cd /path/to/your-docs-repo

# 创建目录
mkdir -p .github/workflows
mkdir -p .github/scripts

# 复制文件
cp /path/to/next_blog/.github/workflows/render-docs.yml .github/workflows/
cp /path/to/next_blog/.github/scripts/render.js .github/scripts/

# 提交
git add .github/
git commit -m "Add GitHub Actions for pre-rendering"
git push

# 创建第一个 tag
git tag v1.0.0
git push origin v1.0.0
```

### 2. 验证 Actions 运行

- [ ] 访问 `https://github.com/{owner}/{repo}/actions`
- [ ] 查看 "Render Documentation" workflow
- [ ] 等待状态变为 ✅（通常 1-3 分钟）
- [ ] 检查日志输出，确认文档数量正确

### 3. 验证输出文件

```bash
# 检查分支
git ls-remote origin | grep rendered

# 应该看到：
# refs/heads/rendered/latest
# refs/heads/rendered/v1.0.0

# 测试访问 JSON 文件
curl https://raw.githubusercontent.com/{owner}/{repo}/rendered/latest/rendered/metadata.json
```

- [ ] `rendered/latest` 分支存在
- [ ] `rendered/v1.0.0` 分支存在
- [ ] `metadata.json` 可访问
- [ ] `sidebar.json` 可访问
- [ ] `docs-index.json` 可访问

### 4. Next.js 项目配置

```bash
# 在 Next.js 项目中
cd /path/to/next_blog

# 配置环境变量
cat > .env.local << EOF
DATA_SOURCE=pre-rendered
RENDERED_VERSION=latest
GITHUB_REPO={owner}/{repo}
GITHUB_TOKEN={your-token}
EOF

# 重启开发服务器
npm run dev
```

### 5. 验证运行

- [ ] 访问 `http://localhost:3001`
- [ ] 点击"文档"菜单
- [ ] 检查浏览器控制台
- [ ] 应该看到：`[Docs] Data source: pre-rendered`
- [ ] 应该看到：`[PreRendered] Found documents: X`
- [ ] 文档页面正常显示
- [ ] 侧边栏正常显示
- [ ] 文章内容正确渲染

---

## 🔍 问题排查

### ❌ Actions 失败

**检查项**：
- [ ] 查看 Actions 日志
- [ ] 确认 `DOCS_DIR` 路径正确
- [ ] 确认文档包含有效 frontmatter
- [ ] 确认依赖安装成功

**常见错误**：

1. **Cannot find module 'gray-matter'**
   ```yaml
   # 在 workflow 中添加
   - name: Install dependencies
     run: npm install gray-matter remark ...
   ```

2. **Empty content for: docs/xxx.md**
   - 检查文件编码是否为 UTF-8
   - 检查文件是否为空

3. **Permission denied**
   - Settings → Actions → Workflow permissions → Read and write

### ❌ 找不到分支

**检查命令**：
```bash
git ls-remote origin | grep rendered
```

**可能原因**：
- [ ] workflow 未成功运行
- [ ] git push 步骤失败
- [ ] 权限不足

**解决方法**：
1. 重新推送 tag：`git push origin v1.0.0 --force`
2. 检查 Actions 日志中的 git push 输出

### ❌ Next.js 报错 404

**检查项**：
- [ ] 确认 `RENDERED_VERSION` 存在
- [ ] 测试 JSON 文件是否可访问
- [ ] 检查网络请求（浏览器开发者工具）

**测试命令**：
```bash
# 替换为您的实际值
REPO="owner/repo"
VERSION="latest"

curl -I "https://raw.githubusercontent.com/$REPO/rendered/$VERSION/rendered/metadata.json"
```

**应该返回**：`HTTP/2 200`

### ❌ 文档内容未更新

**可能原因**：缓存未失效

**解决方法**：
```bash
# 方法 1：调用 revalidate API
curl -X POST http://localhost:3001/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","paths":["/docs"]}'

# 方法 2：重启服务器
pkill -f "next dev"
npm run dev

# 方法 3：清除 .next 缓存
rm -rf .next
npm run dev
```

---

## 📊 性能验证

### 开发环境测试

```bash
# 使用 curl 测试响应时间
time curl -s http://localhost:3001/docs/intro > /dev/null

# 使用浏览器开发者工具
# Network → 查看文档页面加载时间
```

**期望结果**：
- GitHub API 模式：1-3 秒
- 预渲染模式：100-300 毫秒

### 生产环境测试

部署到 Vercel 后：

```bash
# 测试响应时间
time curl -s https://your-domain.vercel.app/docs/intro > /dev/null

# 测试 CDN 缓存
curl -I https://your-domain.vercel.app/docs/intro | grep -i cache
```

**期望结果**：
- 首次访问：200-500 毫秒
- CDN 缓存命中：50-100 毫秒
- 响应头包含：`x-vercel-cache: HIT`

---

## 🎯 部署到生产

### Vercel 部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd next_blog
vercel

# 4. 设置环境变量
vercel env add DATA_SOURCE
# 输入：pre-rendered

vercel env add RENDERED_VERSION
# 输入：latest

vercel env add GITHUB_REPO
# 输入：owner/repo

vercel env add GITHUB_TOKEN
# 输入：ghp_xxxxx

# 5. 重新部署
vercel --prod
```

### 环境变量检查

- [ ] `DATA_SOURCE=pre-rendered`
- [ ] `RENDERED_VERSION=latest`
- [ ] `GITHUB_REPO` 已设置
- [ ] `GITHUB_TOKEN` 已设置
- [ ] `REVALIDATE_SECRET` 已设置（可选）

### 域名配置

- [ ] 自定义域名已添加
- [ ] DNS 记录已配置
- [ ] SSL 证书已生效

---

## 📈 监控和维护

### 定期检查

**每周**：
- [ ] 查看 Actions 运行历史
- [ ] 检查失败的 workflow
- [ ] 验证新文档是否正常渲染

**每月**：
- [ ] 清理旧的 `rendered/*` 分支（可选）
- [ ] 更新依赖版本
- [ ] 检查性能指标

### 日志监控

```bash
# 查看 Vercel 函数日志
vercel logs

# 过滤特定路径
vercel logs --filter "/docs"

# 实时监控
vercel logs --follow
```

### 性能监控

在 Vercel Dashboard：
1. Analytics → 查看页面访问统计
2. Speed Insights → 查看性能指标
3. 关注 Core Web Vitals：
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## 🎉 完成！

恭喜！您已成功部署 GitHub Actions 预渲染方案。

### 后续步骤

- [ ] 阅读 [性能优化文档](./PERFORMANCE_OPTIMIZATION.md)
- [ ] 配置 [缓存刷新策略](./GITHUB_ACTIONS_SETUP.md#监控和维护)
- [ ] 设置 [监控告警](https://vercel.com/docs/concepts/observability)
- [ ] 分享给团队成员

### 获取帮助

- 📚 查看[完整文档](./GITHUB_ACTIONS_SETUP.md)
- 🐛 提交 [Issue](https://github.com/your-repo/issues)
- 💬 参与 [讨论](https://github.com/your-repo/discussions)

---

**享受极速文档体验！🚀**

---

## 📝 部署记录

记录您的部署信息：

```
部署日期：__________
文档仓库：__________
Next.js 仓库：__________
首个 Tag：__________
Vercel 域名：__________
性能提升：__________ 倍
备注：__________
```
