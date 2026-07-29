# Seedance2 Director Guide

Static site. Custom build.mjs converts MDX→single-page HTML. 30 Q&A pages, 4 sections, zh-TW.

## Commands
| 用途 | 命令 |
|------|------|
| Build | `node build.mjs` |
| Dev | `node build.mjs && npx serve dist` |

## 架構
- `src/content/docs/01-basics/` — Part 1: 擴散模型基礎 (Q1-Q8)
- `src/content/docs/02-seedance/` — Part 2: Seedance 2.0 特性 (Q9-Q18)
- `src/content/docs/03-diagnosis/` — Part 3: 問題診斷 (Q19-Q26)
- `src/content/docs/04-workflow/` — Part 4: 實戰工作流
- `build.mjs` — 讀 MDX → 解析 frontmatter → 渲染 markdown → 注入 HTML 模板
- `dist/` — 輸出 (index.html + static assets)

## 約定
- **檔案命名**: `q##-slug.mdx`，編號跨章節連續 (Q1–Q26)
- **Frontmatter**: `title`, `description`, `sidebar: { order: N }`
- **內文結構**: `## 一句話` → 子章節 → `:::tip[🎬 導演要點]` → `:::note[📖 引用論文]`
- **標題鏈**: Part 1 標題設計為追問鏈，前半句承接上個 Q 的結論、後半句拋新問題
- **mermaid 圖表**: 僅 Part 1 Q1 使用，其餘章節以文字或表格敘述
- **語言**: 繁體中文，技術術語保留英文原名（括號標註）
- **提交**: conventional commits (`refactor:`, `feat:`, `fix:`, `chore:`)

## 陷阱
- README.md 是舊的 Starlight boilerplate，專案不使用 Astro/Starlight
- 沒有 hot reload — dev 只做一次性建置
- 沒有 linter/type-check — 手動驗證 `open dist/index.html`
