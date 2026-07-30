# Seedance 2.0 導演技術背景學習指引

靜態 MDX→HTML 單頁網站。35 篇 Q&A（Part 1–4），zh-TW。

## 連結

- **網站**：<https://jeyu54217.github.io/seedance2-director-guide/>
- **GitHub**：<https://github.com/jeyu54217/seedance2-director-guide>

## 建置

```bash
npm install
node build.mjs        # → dist/index.html
open dist/index.html
```

無 dev server、無 hot reload、無 linter。改完跑 build 再看。

## 結構

```
src/content/docs/
├── 01-basics/        Q1–Q8   擴散模型基礎（DiT, VAE, CFG, Flow Matching）
├── 02-seedance/      Q9–Q18  Seedance 2.0 特性（多模態融合、雙分支、@標籤、Storyboard）
├── 03-diagnosis/     Q19–Q31 問題診斷（閃爍、肢體融化、唇形同步、物理失敗等 13 題）
└── 04-workflow/      實戰工作流（場景 Preset、節點速查、限制總表、論文路線圖）
```

## 授權

CC0 — 內容以 [Creative Commons Zero](https://creativecommons.org/publicdomain/zero/1.0/) 釋出。
