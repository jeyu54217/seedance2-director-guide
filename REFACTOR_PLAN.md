# Seedance 2.0 Director Guide — 重構計畫

> 專案位置：`/Users/jy-m1/Documents/Code/seedance2-director-guide`
> 線上網址：https://jeyu54217.github.io/seedance2-director-guide/

## 決策摘要

| 項目 | 選擇 |
|------|------|
| 框架 | **Astro + Starlight**（官方文件主題） |
| 語言 | 3+ 語系（zh-TW 預設 + en + 未來 ja 等） |
| 部署 | GitHub Actions 自動 build → GitHub Pages |
| 設計 | Starlight 文件站風格（內建 dark mode、sidebar、search、TOC） |

## 現狀問題

- 純 HTML 單檔 `index.html`（~63k chars，30 個 `<details>` 區塊）
- 零外部依賴、零分離，CSS/JS/內容全塞同檔
- 內容持續成長，每加一個 QA 都要手插 HTML
- LLM 改一個區塊要讀整份 63k chars → 效率差、容易改錯
- 沒有 dark mode、沒有搜尋、沒有 sidebar 導航
- 圖片、i18n 等需求無法簡單擴充

## 為什麼選 Astro + Starlight？

Starlight 是 Astro 官方文件主題。這個專案本質是**技術文件/學習指引**，格式完全對應 Starlight 設計場景。

內建功能（全部不用自己刻）：

| 功能 | 現狀 | Starlight |
|------|------|-----------|
| Dark mode | 無 | 自動 + 手動切換 |
| 全文搜尋 | 無 | Pagefind（build 時產生索引） |
| Sidebar 導航 | 無，要自己捲 | 左側 sticky sidebar |
| 目錄（TOC） | 無 | 右側 sticky TOC |
| 語系切換 | 僅繁簡轉換 | 內建多語系選擇器 |
| 響應式設計 | 自訂 media query | 內建 mobile sidebar |
| SEO | 手寫 meta 標籤 | 自動 OG/Twitter/JSON-LD/sitemap |
| 圖片優化 | 無 | Astro Image 自動壓縮/webp |
| 程式碼高亮 | 自訂 CSS | Shiki 語法高亮 |
| 上一頁/下一頁 | 無 | 自動生成導航 |

## 頁面結構變化

```
現狀：單頁 30 個 <details> 折疊區塊

改為多頁文件站：
  /zh-TW/                   ← 首頁 landing
  /zh-TW/01-basics/         ← 一、基礎概念（sidebar group）
    q01-diffusion-model     ← 每個 QA 獨立一頁
    q02-latent-space
    q03-patchify-dit
    q04-attention
    q05-cfg
    q06-timestep
    q07-flow-matching
    q08-pipeline
  /zh-TW/02-seedance/       ← 二、Seedance 深度
    q09-dual-branch
    q10-multimodal-fusion
    q11-at-tags
    q12-training
    q13-15sec-limit
    q14-camera-motion
    q15-emotion
    q16-storyboard
    q17-storyboard-practice
    q18-zh-en-prompt
  /zh-TW/03-diagnosis/      ← 三、診斷與修復
    q19-identity-drift
    q20-limb-melting
    q21-lip-sync
    q22-feature-bleeding
    q23-background-drift
    q24-physics-failure
    q25-lighting-audio-face
    q26-flicker
  /zh-TW/04-workflow/       ← 四、實戰工作流
    comfyui-nodes
    scene-presets
    limitations
    paper-roadmap
```

LLM 編輯：從讀整份 63k chars 降到只讀目標頁面 ~2k chars。

## 專案架構

```
seedance2-director-guide/
├── astro.config.mjs            ← Starlight config + i18n locales
├── package.json
├── public/
│   ├── robots.txt
│   ├── images/                 ← 靜態圖片（截圖、示意圖）
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── docs/               ← Starlight 管理此目錄
│   │       ├── zh-TW/
│   │       │   ├── index.mdx
│   │       │   ├── 01-basics/
│   │       │   │   ├── q01-diffusion-model.mdx
│   │       │   │   ├── ...
│   │       │   │   └── q08-pipeline.mdx
│   │       │   ├── 02-seedance/
│   │       │   │   └── ...
│   │       │   ├── 03-diagnosis/
│   │       │   │   └── ...
│   │       │   └── 04-workflow/
│   │       │       └── ...
│   │       └── en/
│   │           ├── index.mdx
│   │           └── ...（逐步翻譯）
│   └── components/             ← 自訂元件（可選）
│       └── Mermaid.astro
├── .github/
│   └── workflows/
│       └── deploy.yml          ← 改：加 build step、改 artifact path
└── index-old.html              ← 原始 HTML 備份（內容搬遷參考用）
```

## 內容格式（MDX）

```mdx
---
title: 什麼是擴散模型（Diffusion Model）？
description: 理解 AI 生成影片的核心原理——從雜訊中「雕刻」出畫面
sidebar:
  order: 1
---

## 一句話

模型像雕刻家——不是「加上」畫面，而是從雜訊裡「鑿掉」不屬於畫面的部分。

![大衛像比喻](/images/david-metaphor.png)

:::tip[導演要點]
Steps 20–30 就夠用；前段（高 timestep）決定構圖，後段決定紋理。
:::

## 訓練：讓模型學會「什麼該鑿」

模型要先會分辨「大理石」和「雕像」。方法：拿真實圖片...
```

Starlight 內建 Asides 語法（`:::tip`、`:::caution`、`:::note`），完美替代現有 `div.highlight` / `div.warn` / `div.note`。

## i18n 策略

- **zh-TW**：完整 30 頁，來源語言
- **en**：逐步翻譯，進度用 frontmatter `status: translated | draft | missing`
- **ja/ko**：未來擴充，目錄鏡像 zh-TW

Starlight 的 `[lang]` dynamic route 自動處理：
- `/zh-TW/` → 讀 `zh-TW/` 目錄內容
- `/en/` → 讀 `en/` 目錄內容
- `/` → redirect 到 `/zh-TW/`

語系切換：當前頁面的對應語系版本（同 slug），找不到就回首頁。

## 部署變更

現有 `.github/workflows/pages.yml` 只改兩處：

```diff
  steps:
    - uses: actions/checkout@v4
+   - uses: actions/setup-node@v4
+     with: { node-version: 22 }
+   - run: npm ci
+   - run: npm run build
    - uses: actions/configure-pages@v4
    - uses: actions/upload-pages-artifact@v3
      with:
-       path: '.'
+       path: './dist'
```

推 code → GitHub Actions build + deploy。流程不變。

## 實作階段

### Phase 1：Starlight 初始化（一次性）
1. 初始化 Astro + Starlight 專案
2. 設定 astro.config.mjs（i18n locales、sidebar 結構）
3. 轉移現有 CSS 變數到 Starlight 自訂 theme
4. 更新 GitHub Actions deploy workflow
5. 本地 build 驗證

### Phase 2：內容逐篇搬遷（30 篇，可分批）
每篇 HTML `<details>` 區塊 → MDX 頁面：
1. `<summary>` 標題 → frontmatter `title`
2. `<div class="answer">` 內 HTML → MDX（markdown + Starlight Asides）
3. `<table>` 保留 raw HTML（MDX 允許混寫）
4. `<pre class="mermaid">` → Mermaid code block
5. 每搬完一篇 commit + push（GitHub Actions 自動 deploy），線上驗證

預計每篇 5-10 分鐘，全部約 3-5 小時。

### Phase 3：英文版建立
1. 從 zh-TW 目錄複製骨架（frontmatter 翻譯，內容留 placeholder）
2. 優先翻譯首頁 + 各 section overview
3. 逐步補齊各 QA（可用 LLM 輔助翻譯）

### Phase 4：設計微調（後續迭代）
1. Starlight 自訂 theme（顏色、字型）
2. 插圖/示意圖製作
3. Mermaid 圖升級
4. 首頁重新設計（hero + 快速導覽卡片）

## 驗證清單

- [ ] `npm run build` 無錯誤
- [ ] `npx astro preview` 本地正常
- [ ] 所有 30 頁載入正常
- [ ] 語系切換 `/zh-TW/` ↔ `/en/`
- [ ] Dark mode 切換
- [ ] Sidebar 導航正確
- [ ] Pagefind 搜尋可用
- [ ] Mermaid 圖正常渲染
- [ ] 圖片 lazy loading
- [ ] 手機版 responsive
- [ ] `curl https://jeyu54217.github.io/seedance2-director-guide/zh-TW/` 回 200
