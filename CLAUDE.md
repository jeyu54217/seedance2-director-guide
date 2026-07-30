# Seedance2 Director Guide

Static site. `node build.mjs` converts MDX→single-page HTML. 35 Q&A pages, 4 sections, zh-TW.

## Project

```
src/content/docs/
  01-basics/     — Part 1: 擴散模型基礎 (Q1-Q8)
  02-seedance/   — Part 2: Seedance 2.0 特性 (Q9-Q18)
  03-diagnosis/  — Part 3: 問題診斷 (Q19-Q30)
  04-workflow/   — Part 4: 實戰工作流
build.mjs         — MDX→HTML (frontmatter→markdown→template)
dist/             — output (index.html + static assets)
```

Commands: `node build.mjs` (build), `node build.mjs && npx serve dist` (dev). No hot reload, no linter. Verify with `open dist/index.html`.

## Writing Style

### Structure

Every Q follows a three-layer chain: **why this matters → what the model does → how it works**. Each layer gets one heading. The heading itself signals the layer — never write WHY/WHAT/HOW as heading text.

| Layer | Heading style | Example |
|-------|--------------|---------|
| Why | Question or phenomenon | `## 一張圖為什麼能產生多個鏡頭` |
| What | Noun phrase | `## 模型實際看到的是什麼` |
| How | Action-oriented | `## 鏡頭序列是怎麼生成的` |

End every Q with `:::tip[🎬 導演要點]` then `:::note[📖 引用論文]`. Optionally add `:::caution[⚠️ 誠實揭露]` before citations when stating inferences.

Short articles (under 40 lines) may merge What and How into one section or skip a standalone Why.

### Language

**Plain Chinese over jargon.** Replace technical terms with descriptions of what the thing does. Example:

> Model preserves spatial information when processing images — it knows top-left and bottom-right are different.

Not:

> Vision encoder's feature map retains spatial structure across different spatial positions.

**一句話 is exactly one sentence.** Not two clauses joined by a comma. Not a paragraph. One breath.

**Expand all abbreviations on first use:** `VAE（Variational Autoencoder，變分自編碼器）`. Never assume the reader knows the acronym.

**Bold (`**text**`) renders as orange-red.** Limit to 5 uses per article. Only for first occurrence of a core term and key director takeaways.

### Brevity

Target **40–55 lines** per Q. Short paragraphs. Tight logic. Every sentence earns its place.

Cut:
- Flowery metaphors, transition fluff ("now let's talk about...", "moving on to...")
- Repeating what a table already shows
- Multi-sentence scene descriptions — one concrete noun is enough
- **Over-proving**: no A/B/C hypothesis comparison tables, no evidence matrices. State the conclusion and the mechanism. Mark inferences as inferences.
- **Block-quoting community sources**: reference Reddit/nemovideo to support an observation, don't quote them at length

Keep: tables with quantitative data, cross-Q links, 1–2 sentence director takeaways.

### Sources

1. **Paper first.** Check arXiv PDF before writing any technical definition. Never write from memory.
2. **Always link papers.** Every citation gets an arXiv URL, whether in `:::note[📖]` or inline.
3. **Cross-Q links use relative paths.** `[Q4：注意力機制](../q04-spatial-temporal/)`. Never write "as mentioned in Q4" without a link.
4. **Mark uncertainty.** Anything not confirmed by a paper goes in `:::caution[⚠️ 誠實揭露]`.
5. **Community sources are supplementary.** Reddit, Hacker News, GitHub Discussions fill gaps papers don't cover. They describe behavior, not mechanism.

## Part 3 Rules

Part 3 (diagnosis Q&A) has additional constraints that do not apply to Parts 1/2/4:

- **Title format**: `白話現象描述（English Term）——中文補充說明`. Reader recognizes the symptom first, then sees the term. Example: `畫面一直閃、顏色太豔（Flicker & Oversaturation）——閃爍與過飽和`.
- **Theory-first diagnosis**: explain root cause using Part 1/2 concepts (Cross-Attention, CFG/SNR, Temporal Attention). Community sources only when theory doesn't cover the solution or the symptom description.
- **Hotness-sorted**: sidebar.order matches community discussion volume — most common problems first.
- **Dual-solution**: every Q provides both ComfyUI (general nodes) and Seedance-native (prompt/@ tags) approaches.

## Conventions

- Files: `q##-slug.mdx`, numbering continuous across sections (Q1–Q30)
- Frontmatter: `title`, `description`, `sidebar: { order: N }`
- Language: Traditional Chinese (zh-TW), keep technical terms in English with parenthetical explanation
- Commits: conventional commits (`refactor:`, `feat:`, `fix:`, `chore:`)
- Push after every update: `git push`
- Part 1 titles: chain questions — first half carries previous Q's conclusion, second half opens new question
- Mermaid diagrams: Q1 only. Text or tables for all other chapters.

## Footguns

- README.md is stale Starlight boilerplate — this project does not use Astro/Starlight
- No hot reload. Dev is one-shot build only.
- No linter or type-check. Manually verify with `open dist/index.html`.
