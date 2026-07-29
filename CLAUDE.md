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

## 行文風格（CRITICAL）

### 問題意識
帶著「問題意識」寫——每一段回答一個自然浮現的追問。讀者看完上一段，心裡應該浮現一個問題，而下一段的第一句就回答它。不要堆砌名詞解釋，要先給讀者一個「為什麼需要知道這個」的動機。

### 段落結構：WHY → WHAT → HOW → 導演應用
1. **WHY**：先建立動機——為什麼需要這個？不用它會怎樣？
2. **WHAT**：給出核心概念，一句話講完，再用段落展開
3. **HOW**：機制細節（架構、流程、參數）
4. **導演應用**：對導演/使用者來說這意味著什麼（`:::tip[🎬 導演要點]`）

### 跨 Q 連結
提到前面 Q 的內容時，必須用相對路徑超連結。例：`[Q1：什麼是擴散模型](../q01-diffusion-model/)`。不可只寫「Q1 說過...」而不給連結。

### 事實查證
1. **論文原文優先**：所有技術定義必須先查閱原始論文（arXiv PDF），依照論文原文撰寫
2. **論文必須附超連結**：每次提到論文（無論是 `:::note[📖 引用論文]` 區塊還是內文引用），都必須附上 arXiv 超連結。不可只寫「某某論文說」而不給連結
3. **次級來源輔助**：搜尋 Reddit、Hacker News、GitHub Discussions 等論壇的權威討論作為補充
4. **禁止憑空杜撰**：不得憑記憶或訓練資料寫技術定義。不確定處標註 `:::caution[⚠️ 誠實揭露]`

### 紅字節制
`**bold**` 和 `<span class="kw">` 在 CSS 中皆渲染為橘紅色（`var(--accent)`）。全文紅字總數控制在 5 處以下。只在核心術語首次出現和關鍵導演句使用。

### 術語首次出現
所有縮寫（VAE、CFG、DiT、CLIP 等）必須在首次出現時展開全名，格式：`VAE（Variational Autoencoder，變分自編碼器）`。不可假設讀者認識縮寫。

### 圖片
- 靜態圖片放 `public/`，建置時自動複製到 `dist/`
- MDX 中圖片路徑用相對路徑（`latent-space.png`），**不可**用前導斜線（`/latent-space.png`）——GitHub Pages 部署在子目錄下，絕對路徑會指向 domain root 而非 repo root
- `.answer img{max-width:100%;height:auto}` 已內建在 CSS 中，圖片自動 responsive，不需額外處理

## 約定
- **檔案命名**: `q##-slug.mdx`，編號跨章節連續 (Q1–Q26)
- **Frontmatter**: `title`, `description`, `sidebar: { order: N }`
- **內文結構**: `## 一句話` → 子章節（WHY→WHAT→HOW）→ `:::tip[🎬 導演要點]` → `:::note[📖 引用論文]`
- **標題鏈**: Part 1 標題設計為追問鏈，前半句承接上個 Q 的結論、後半句拋新問題
- **mermaid 圖表**: 僅 Part 1 Q1 使用，其餘章節以文字或表格敘述
- **語言**: 繁體中文，技術術語保留英文原名（括號標註）
- **提交**: conventional commits (`refactor:`, `feat:`, `fix:`, `chore:`)
- **推送**: 每次更新完必須 commit 並 push 到 GitHub（`git push`）

## 陷阱
- README.md 是舊的 Starlight boilerplate，專案不使用 Astro/Starlight
- 沒有 hot reload — dev 只做一次性建置
- 沒有 linter/type-check — 手動驗證 `open dist/index.html`
