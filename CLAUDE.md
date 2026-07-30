# Seedance2 Director Guide

Static site. Custom build.mjs converts MDX→single-page HTML. 35 Q&A pages, 4 sections, zh-TW.

## Commands
| 用途 | 命令 |
|------|------|
| Build | `node build.mjs` |
| Dev | `node build.mjs && npx serve dist` |

## 架構
- `src/content/docs/01-basics/` — Part 1: 擴散模型基礎 (Q1-Q8)
- `src/content/docs/02-seedance/` — Part 2: Seedance 2.0 特性 (Q9-Q18)
- `src/content/docs/03-diagnosis/` — Part 3: 問題診斷 (Q19-Q30)
- `src/content/docs/04-workflow/` — Part 4: 實戰工作流
- `build.mjs` — 讀 MDX → 解析 frontmatter → 渲染 markdown → 注入 HTML 模板
- `dist/` — 輸出 (index.html + static assets)

## 行文風格（CRITICAL）

### 問題意識
帶著「問題意識」寫——每一段回答一個自然浮現的追問。讀者看完上一段，心裡應該浮現一個問題，而下一段的第一句就回答它。不要堆砌名詞解釋，要先給讀者一個「為什麼需要知道這個」的動機。

### 段落結構：動機 → 機制 → 解法 → 導演應用

每題依序回答三個問題（對應 WHY → WHAT → HOW），最後給導演要點。每個問題的標題從內容中提煉，命名規則：

1. **動機（WHY）**：為什麼需要這個？標題寫成問句或現象。例：`## 一張圖為什麼能產生多個鏡頭`、`## 為什麼模型會運鏡、懂物理`
2. **機制（WHAT）**：模型到底在做什麼？標題寫成名詞短語。例：`## 模型實際看到的是什麼`、`## 訓練分三個階段`
3. **解法/生成過程（HOW）**：怎麼做到的？標題寫成動作導向。例：`## 鏡頭序列是怎麼生成的`、`## 但學到的是統計，不是物理`

**嚴禁直接打出 WHY/WHAT/HOW 三個字作為標題。** 標題本身暗示邏輯層次，不透過標籤宣告。

**不強制每題都有四個層次。** 簡短的題目（40 行以下）可以合併 WHAT 和 HOW 為單一標題，或省略獨立的動機段直接進入機制。

### 跨 Q 連結
提到前面 Q 的內容時，必須用相對路徑超連結。例：`[Q1：什麼是擴散模型](../q01-diffusion-model/)`。不可只寫「Q1 說過...」而不給連結。

### 事實查證
1. **論文原文優先**：所有技術定義必須先查閱原始論文（arXiv PDF），依照論文原文撰寫
2. **論文必須附超連結**：每次提到論文（無論是 `:::note[📖 引用論文]` 區塊還是內文引用），都必須附上 arXiv 超連結。不可只寫「某某論文說」而不給連結
3. **次級來源輔助**：搜尋 Reddit、Hacker News、GitHub Discussions 等論壇的權威討論作為補充
4. **禁止憑空杜撰**：不得憑記憶或訓練資料寫技術定義。不確定處標註 `:::caution[⚠️ 誠實揭露]`

### 人話原則（CRITICAL）

**用白話解釋機制，不要堆疊術語。** 專業術語能不用就不用。必須用時，用白話描述它做什麼，而不是只丟出名詞。反例：

> Vision encoder 輸出的 feature map 保留了空間結構——不同 spatial position 帶著不同 panel 的視覺特徵。

正例：

> 模型處理圖片時，會保留「哪個位置有什麼內容」的空間資訊——它知道左上方的畫面和右下方的畫面不一樣。

**一句話必須是真正的一句話。** 不是一個段落。不是兩個子句用逗號硬接。是一句讀完不用換氣的摘要。

### 精簡原則（CRITICAL）

**壓縮比**：每篇 Q 目標 40–55 行。能用一句講完，不用兩句。段落短，邏輯密。

**禁止項目**：
- 華麗比喻——直接講機制
- 過渡廢話——直接進入下一點
- 重複敘述——表格已寫的不要在段落重講、前一步已提的不要在後一步再展開
- 長案例——一個具體名詞示範足以
- **過度證明**——不要列出 A/B/C 三種假設逐一比較、不要用表格對照證據。直接講結論和機制。推論就說是推論，不需要鋪陳所有可能性
- **長篇引用**——社群來源（Reddit、nemovideo）用來佐證行為現象即可，不要大段引用原文

**保留項目**：
- 表格（有意義的量化數據）、論文引用（一個 cite block 放文末）
- 跨 Q 連結
- 導演要點每項 1–2 句

### 紅字節制
`**bold**` 和 `<span class="kw">` 在 CSS 中皆渲染為橘紅色（`var(--accent)`）。全文紅字總數控制在 5 處以下。只在核心術語首次出現和關鍵導演句使用。

### 術語首次出現
所有縮寫（VAE、CFG、DiT、CLIP 等）必須在首次出現時展開全名，格式：`VAE（Variational Autoencoder，變分自編碼器）`。不可假設讀者認識縮寫。

### 圖片
- 靜態圖片放 `public/`，建置時自動複製到 `dist/`
- MDX 中圖片路徑用相對路徑（`latent-space.png`），**不可**用前導斜線（`/latent-space.png`）——GitHub Pages 部署在子目錄下，絕對路徑會指向 domain root 而非 repo root
- `.answer img{max-width:100%;height:auto}` 已內建在 CSS 中，圖片自動 responsive，不需額外處理

### Part 3 診斷題目特殊規範（僅 Part 3 適用，Part 1/2/4 不強制）

**標題格式**：`白話現象描述（English Term）——中文補充說明`。先讓讀者認出「這就是我遇到的問題」，再給術語。例：`畫面一直閃、顏色太豔（Flicker & Oversaturation）——閃爍與過飽和`。

**理論優先**：根因解釋優先引用 Part 1/2 已建立的理論架構（Cross-Attention、CFG/SNR、Temporal Attention 等），跨 Q 用相對路徑超連結。論壇意見（Reddit、社群文檔）僅在兩種情況下保留：(a) 理論未覆蓋的解法 (b) 理論描述不足的現象描述。不要在理論已能解釋的地方引用 Reddit。

**熱度排序**：Part 3 的 sidebar.order 按社群討論熱度排列（Reddit 貼文量、技術部落格覆蓋率、GitHub issues 數量），最常見/最困擾的問題排最前面，讓讀者優先看到最可能遇到的問題。

**三層對照**：每題提供 ComfyUI（通用節點解法）和 Seedance 原生（prompt/@ 標籤解法）兩套方案，讓使用不同工具的讀者都能對照。

## 約定
- **檔案命名**: `q##-slug.mdx`，編號跨章節連續 (Q1–Q30)
- **Frontmatter**: `title`, `description`, `sidebar: { order: N }`
- **內文結構**: `## 一句話` → 子章節（動機→機制→解法，標題從內容提煉，不寫 WHY/WHAT/HOW）→ `:::tip[🎬 導演要點]` → `:::note[📖 引用論文]`
- **標題鏈**: Part 1 標題設計為追問鏈，前半句承接上個 Q 的結論、後半句拋新問題
- **mermaid 圖表**: 僅 Part 1 Q1 使用，其餘章節以文字或表格敘述
- **語言**: 繁體中文，技術術語保留英文原名（括號標註）
- **提交**: conventional commits (`refactor:`, `feat:`, `fix:`, `chore:`)
- **推送**: 每次更新完必須 commit 並 push 到 GitHub（`git push`）

## 陷阱
- README.md 是舊的 Starlight boilerplate，專案不使用 Astro/Starlight
- 沒有 hot reload — dev 只做一次性建置
- 沒有 linter/type-check — 手動驗證 `open dist/index.html`
