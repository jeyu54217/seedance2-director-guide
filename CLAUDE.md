# Seedance2 Director Guide

Static site, MDX→HTML via `node build.mjs`. 35 Q&A, 4 sections, zh-TW. No hot reload, no linter.

## Project

Part 1 (01-basics): Q1-Q8 擴散模型基礎. Part 2 (02-seedance): Q9-Q18 Seedance 特性. Part 3 (03-diagnosis): Q19-Q30 問題診斷. Part 4 (04-workflow): 實戰工作流. Build outputs to `dist/`.

## Writing Style

**Structure.** Every Q: heading chain WHY→WHAT→HOW, each heading from content not labels. End with `:::tip[🎬 導演要點]` then `:::note[📖 引用論文]`. Short Qs may merge WHAT+HOW.

**一句話 is one real sentence.** Not a paragraph. Not two clauses joined by comma.

**Plain Chinese over jargon.** Describe what things do, not what they're called. `模型保留圖片中各位置的資訊` not `feature map 保留 spatial structure`.

**Brevity.** Target 40-55 lines per Q. No metaphors, no transition fluff, no repeating table content in prose. No A/B/C hypothesis comparisons — state conclusion, mark inference. Community sources (Reddit/nemovideo) support observations, not quoted at length.

**Bold limit.** 5 per article — renders orange-red. Core term first use and key director takeaways only.

**Term expansion.** First use: `VAE（Variational Autoencoder，變分自編碼器）`. Never assume reader knows abbreviation.

**Cross-Q links.** Relative paths: `[Q4：注意力機制](../q04-spatial-temporal/)`. Never unlinked "as mentioned in Q4".

## Sources

1. Paper first — check arXiv PDF before writing definitions. Never from memory.
2. Every citation gets arXiv URL.
3. Uncertainty → `:::caution[⚠️ 誠實揭露]`. Mark what's inference vs confirmed.
4. Community sources fill gaps papers don't cover. They describe behavior, not mechanism.

## Part 3 Rules

Part 3 only. Title: `白話現象（English Term）——補充`. Root cause via Part 1/2 theory first, community only for uncovered gaps. Sort by community discussion heat. Dual solution: ComfyUI nodes + Seedance prompt/@ tags.

## Conventions

Files `q##-slug.mdx`, numbering continuous Q1–Q30. Frontmatter: `title`, `description`, `sidebar: { order: N }`. zh-TW, technical terms in English with parenthetical. Conventional commits. Push after every update. Part 1 titles chain: previous Q conclusion → new question. Mermaid: Q1 only.

## Footguns

README.md is stale Starlight boilerplate — not an Astro project. Dev is one-shot build. No type-check: verify with `open dist/index.html`.
