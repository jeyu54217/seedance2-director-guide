// build.mjs — Seedance Director Guide single-page HTML generator
// Reads MDX from src/content/docs/, renders to dist/index.html matching index-old.html style

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

// ==============================
// 1. CONFIGURATION
// ==============================

const SECTIONS = {
  '01-basics': {
    title: '一、一個畫面是怎麼生出來的？',
    type: 'qa',
  },
  '02-seedance': {
    title: '二、Seedance 2.0 和其他模型最不一樣的地方',
    type: 'qa',
  },
  '03-diagnosis': {
    title: '三、出問題了——為什麼？怎麼辦？',
    type: 'qa',
  },
  '04-workflow': {
    title: '四、實戰工作流',
    type: 'workflow',
    summaries: {
      'comfyui-nodes': '🎛️ ComfyUI 節點速查（含具體參數）',
      'scene-presets': '🎬 六種短劇場景標準組合（含完整參數）',
      'limitations': '⚠️ Seedance 2.0 的關鍵限制（附 Part 1–2 出處）',
      'paper-roadmap': '📚 論文閱讀路線圖（6 層，附 Q 對照）',
    },
  },
};

const CONTENT_DIR = 'src/content/docs';
const OUTPUT_DIR = 'dist';

// ==============================
// 2. TEMPLATE
// ==============================

const CSS = `:root{--bg:#faf9f6;--card:#fff;--text:#1a1a1a;--muted:#6b6b6b;--border:#e5e0d8;--accent:#c44f1c;--accent-light:#fdf0e8;--code-bg:#f4f0eb;--tag-bg:#f0ebe3;--tag-text:#8b6f4e;--good:#2d7d46;--warn:#b68b2c;--bad:#c44f1c;--blue:#1a6fb5;--blue-light:#e8f2fa}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"Noto Sans TC","PingFang TC","Noto Sans SC","Microsoft JhengHei",sans-serif;background:var(--bg);color:var(--text);line-height:1.8;-webkit-tap-highlight-color:transparent}
header{background:var(--card);border-bottom:1px solid var(--border);padding:2.5rem 1.5rem 2rem;text-align:center}
header h1{font-size:1.75rem;font-weight:700;letter-spacing:-.02em}
header .sub{color:var(--muted);font-size:.95rem;margin-top:.5rem}
header .meta{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1rem}
header .meta span{font-size:.8rem;background:var(--tag-bg);color:var(--tag-text);padding:.2rem .7rem;border-radius:999px}
.toolbar{max-width:860px;margin:1.5rem auto 0;padding:0 1.5rem;display:flex;gap:.5rem;justify-content:flex-end;flex-wrap:wrap}
.toolbar button{background:var(--card);border:1px solid var(--border);color:var(--text);padding:.4rem 1rem;border-radius:8px;cursor:pointer;font-size:.84rem;font-family:inherit;transition:all .15s;white-space:nowrap}
.toolbar button:hover{background:var(--accent-light);border-color:var(--accent)}
#lang-toggle{background:var(--accent);color:#fff;border-color:var(--accent);font-weight:700}
#lang-toggle:hover{background:#a03d10;border-color:#a03d10}
main{max-width:860px;margin:1rem auto 3rem;padding:0 1.5rem}
.section-header{font-size:1.25rem;font-weight:700;color:var(--accent);margin:2.5rem 0 1rem;padding-bottom:.5rem;border-bottom:2px solid var(--border)}
.section-header:first-child{margin-top:0}
details{background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:.9rem;transition:box-shadow .15s}
details[open]{box-shadow:0 2px 20px rgba(0,0,0,.06)}
summary{padding:1rem 2.4rem 1rem 1.3rem;cursor:pointer;font-weight:700;font-size:1rem;list-style:none;position:relative;user-select:none;line-height:1.55;border-radius:10px}
summary:hover{background:#fdfaf7}
summary::-webkit-details-marker{display:none}
summary::before{content:'\\25B8';position:absolute;right:1.2rem;top:50%;transform:translateY(-50%);font-size:.85rem;color:var(--accent);transition:transform .2s}
details[open]>summary::before{transform:translateY(-50%) rotate(90deg)}
details[open]>summary{border-radius:10px 10px 0 0;background:#fdfaf7}
.answer{padding:.8rem 1.5rem 1.5rem}
.answer h3{font-size:1.05rem;font-weight:700;color:var(--text);margin:1.2rem 0 .6rem;padding-bottom:.3rem;border-bottom:1px solid var(--border)}
.answer h3:first-child{margin-top:.3rem}
.answer h4{font-size:.92rem;font-weight:700;color:var(--accent);margin:1rem 0 .5rem;padding-bottom:.2rem;border-bottom:1px dotted var(--border);letter-spacing:.02em}
.answer p{margin-bottom:.6rem}
.answer strong{color:var(--accent)}
.answer img{max-width:100%;height:auto}
.answer ul,.answer ol{margin:.4rem 0 .8rem 0;padding-left:0;list-style:none}
.answer li{margin-bottom:.5rem;padding-left:1.3rem;position:relative;line-height:1.65}
.answer li::before{content:'\\2022';position:absolute;left:.25rem;color:var(--accent);font-weight:700;font-size:1.1em}
.answer ol{counter-reset:step}
.answer ol li{padding-left:1.6rem}
.answer ol li::before{content:counter(step);counter-increment:step;left:.1rem;top:.15rem;font-size:.72rem;font-weight:700;background:var(--accent);color:#fff;width:1.05rem;height:1.05rem;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;line-height:1;position:absolute}
.kw{font-weight:700;color:var(--accent)}
a.paper{color:var(--blue);text-decoration:none;border-bottom:1px dotted var(--blue);font-weight:600;font-size:.92em}
a.paper:hover{color:var(--accent);border-bottom-color:var(--accent)}
.cite-block{background:var(--blue-light);border-left:3px solid var(--blue);border-radius:0 8px 8px 0;padding:.7rem 1rem;margin:1rem 0 0;font-size:.84rem;line-height:1.6}
.cite-block strong{color:var(--blue);font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:.3rem}
.cite-block a{color:var(--blue)}
.highlight-box{background:var(--accent-light);border:1px solid #f0d8c8;border-radius:8px;padding:.9rem 1.1rem;margin:.9rem 0;font-size:.9rem;line-height:1.65}
.highlight-box strong{color:var(--accent)}
.warn-box{background:#fef9f0;border:1px solid #f0e0c0;border-radius:8px;padding:.9rem 1.1rem;margin:.9rem 0;font-size:.9rem;line-height:1.65}
.warn-box strong{color:var(--warn)}
.note-box{background:#fef9f4;border:1px solid #f0e0c8;border-radius:6px;padding:.5rem .9rem;margin:.7rem 0;font-size:.85rem;color:var(--muted)}
.tag{display:inline-block;font-size:.7rem;font-weight:700;padding:.12em .55em;border-radius:3px;margin-right:.35rem;vertical-align:middle;letter-spacing:.03em}
.tag-c{background:#fce8e0;color:var(--accent)}.tag-s{background:#e8f2fa;color:var(--blue)}
.tbl-wrap{overflow-x:auto;margin:.6rem 0 1rem;-webkit-overflow-scrolling:touch}
.answer table{width:100%;border-collapse:collapse;font-size:.86rem;min-width:500px}
.answer th,.answer td{border:1px solid var(--border);padding:.55rem .75rem;text-align:left;vertical-align:top}
.answer th{background:#faf7f3;font-weight:700;font-size:.8rem;color:var(--muted);white-space:nowrap}
.answer td{line-height:1.6}
.answer td:first-child{font-weight:600}
.answer tr:nth-child(even) td{background:#fdfaf7}
.answer code{background:var(--code-bg);padding:.15em .5em;border-radius:4px;font-size:.87em;font-family:"SF Mono","Fira Code","Cascadia Code",monospace;color:#8b4513;font-weight:500}
.answer pre{background:var(--code-bg);padding:.9rem 1.1rem;border-radius:8px;overflow-x:auto;font-size:.81rem;line-height:1.55;margin:.7rem 0 1rem;border:1px solid var(--border)}
.answer pre code{padding:0;background:none;font-size:inherit;color:inherit}
.answer blockquote{border-left:3px solid var(--accent);padding:.6rem 1rem;margin:.8rem 0;background:var(--accent-light);border-radius:0 8px 8px 0;font-size:.92rem}
.badge{display:inline-block;font-size:.7rem;font-weight:700;padding:.15em .55em;border-radius:999px;margin-right:.3rem}
.badge-yes{background:#e6f4ea;color:var(--good)}.badge-partial{background:#fef7e0;color:var(--warn)}.badge-no{background:#fce8e0;color:var(--bad)}
footer{text-align:center;padding:2.5rem 1.5rem;color:var(--muted);font-size:.82rem;border-top:1px solid var(--border);max-width:860px;margin:3rem auto 0}
footer a{color:var(--accent);text-decoration:none}
.mermaid{text-align:center;margin:1rem 0;padding:.5rem}
.mermaid svg{max-width:100%;height:auto}
@media(max-width:600px){
  header{padding:1.8rem 1rem 1.5rem}
  header h1{font-size:1.35rem}
  header .sub{font-size:.88rem}
  header .meta{gap:.5rem}
  header .meta span{font-size:.74rem;padding:.15rem .55rem}
  .toolbar{padding:0 1rem;gap:.4rem;justify-content:center}
  .toolbar button{min-height:44px;padding:.5rem 1rem;font-size:.88rem}
  .section-header{font-size:1.1rem;margin:2rem 0 .8rem}
  main{padding:0 1rem}
  .answer{padding:.6rem 1rem 1.2rem}
  .answer h3{font-size:.98rem}
  .answer h4{font-size:.87rem}
  .answer table{font-size:.78rem;min-width:400px}
  .answer td,.answer th{padding:.4rem}
  .answer li{padding-left:1.1rem}
  .answer pre{font-size:.75rem;padding:.7rem .85rem}
  summary{padding:.85rem 2.2rem .85rem 1.1rem;font-size:.94rem}
  summary::before{right:1rem;font-size:.8rem}
  .cite-block{padding:.6rem .85rem;font-size:.8rem}
  .highlight-box,.warn-box{padding:.75rem .9rem;font-size:.85rem}
  footer{padding:2rem 1rem;font-size:.78rem}
}
@media(min-width:601px) and (max-width:900px){
  header{padding:2.2rem 1.5rem 1.8rem}
  header h1{font-size:1.55rem}
  .section-header{font-size:1.15rem}
  .answer table{min-width:450px}
  summary{font-size:.97rem}
}
@media print{
  body{background:#fff;color:#000}
  header{background:#fff;border-bottom:1px solid #ccc}
  details{border:1px solid #ccc;break-inside:avoid}
  details[open]{box-shadow:none}
  .toolbar{display:none}
  footer{border-top:1px solid #ccc}
}`;

const PAGE_OPEN = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true,theme:'neutral',securityLevel:'loose'});</script>
<meta name="theme-color" content="#faf9f6">
<meta name="description" content="AI 仿真人劇導演的進階技術知識手冊 — 理解擴散模型、DiT、Flow Matching 底層原理，精準操控 Seedance 2.0 工作流。18 篇論文導讀，6 場景 Preset，13 ComfyUI 節點速查。">
<meta name="keywords" content="Seedance 2.0, AI video generation, diffusion model, DiT, Flow Matching, ComfyUI, director guide, 擴散模型, 影片生成, 導演">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://jeyu54217.github.io/seedance2-director-guide/">
<meta property="og:title" content="Seedance 2.0 導演技術背景學習指引">
<meta property="og:description" content="AI 仿真人劇導演的進階技術知識手冊 — 理解底層模型，精準操控工作流。18 篇論文導讀，6 場景 Preset，ComfyUI 實戰。">
<meta property="og:url" content="https://jeyu54217.github.io/seedance2-director-guide/">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Seedance 2.0 導演技術背景學習指引">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"TechArticle","headline":"Seedance 2.0 導演技術背景學習指引","author":{"@type":"Person","name":"Claude Fable 5"},"datePublished":"2026-07-30","inLanguage":["zh-TW","zh-CN"]}
</script>
<title>Seedance 2.0 導演技術背景學習指引</title>
<style>${CSS}</style>
</head>
<body>
<header>
  <h1>🎬 Seedance 2.0 導演技術背景學習指引</h1>
  <p class="sub">針對 AI 仿真人劇導演的進階技術知識手冊 — 理解底層模型，精準操控工作流</p>
  <div class="meta">
    <span>📅 2026-07-30</span><span>🎯 非技術背景友善</span><span>📖 18 篇論文導讀</span><span>🔧 ComfyUI 實戰</span>
  </div>
</header>
<div class="toolbar">
  <button onclick="document.querySelectorAll('details').forEach(d=>d.open=true)">📖 全部展開</button>
  <button onclick="document.querySelectorAll('details').forEach(d=>d.open=false)">📕 全部折疊</button>
  <button id="lang-toggle" onclick="toggleLang()">繁</button>
</div>
<main>`;

const PAGE_CLOSE = `
</main>
<footer>
  <p>由 Claude Fable 5 整理 · 來源：<a href="https://share.gemini.google/Jqa3sF8Vg28S">Gemini Deep Research</a> + 18 篇學術論文 + Reddit 社群討論</p>
  <p style="margin-top:.3rem">內容以 <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a> 釋出 · 最後更新 2026-07-30</p>
</footer>
<script>
const T2S={"著":"着","體":"体","對":"对","會":"会","們":"们","來":"来","開":"开","關":"关","機":"机","後":"后","畫":"画","聲":"声","聽":"听","點":"点","學":"学","說":"说","長":"长","門":"门","間":"间","見":"见","頭":"头","萬":"万","裡":"里","兒":"儿","氣":"气","時":"时","過":"过","為":"为","嗎":"吗","樣":"样","麼":"么","國":"国","動":"动","種":"种","實":"实","從":"从","這":"这","當":"当","還":"还","沒":"没","電":"电","話":"话","視":"视","車":"车","東":"东","經":"经","網":"网","飛":"飞","馬":"马","鳥":"鸟","魚":"鱼","龍":"龙","僅":"仅","單":"单","層":"层","將":"将","無":"无","極":"极","擇":"择","數":"数","據":"据","確":"确","標":"标","準":"准","導":"导","師":"师","團":"团","隊":"队","際":"际","圍":"围","雜":"杂","亂":"乱","潰":"溃","爛":"烂","隱":"隐","穩":"稳","態":"态","歷":"历","異":"异","衛":"卫","護":"护","讓":"让","調":"调","設":"设","計":"计","試":"试","認":"认","識":"识","誤":"误","證":"证","評":"评","論":"论","該":"该","誰":"谁","許":"许","請":"请","謝":"谢","讚":"赞","議":"议","變":"变","爭":"争","權":"权","參":"参","觀":"观","圖":"图","線":"线","於":"于","與":"与","寫":"写","處":"处","雖":"虽","壓":"压","縮":"缩","擴":"扩","構":"构","連":"连","進":"进","運":"运","驗":"验","顯":"显","預":"预","類":"类","風":"风","區":"区","別":"别","剛":"刚","業":"业","嚴":"严","質":"质","創":"创","節":"节","術":"术","藝":"艺","藥":"药","響":"响","優":"优","勢":"势","價":"价","塊":"块","紋":"纹","錄":"录","鏡":"镜","鍵":"键","鏈":"链","錯誤":"错误","輸入":"输入","輸出":"输出","選擇":"选择","執行":"执行","應用":"应用","繼續":"继续","歷史":"历史","範圍":"范围"}
const S2T={};for(const[k,v]of Object.entries(T2S))S2T[v]=k
let isTraditional=false
const originals=new Map()
let converted=false
function walkTextNodes(root,fn){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);while(w.nextNode())fn(w.currentNode)}
function convertText(text,map){let r='';for(let i=0;i<text.length;){let m=false;if(i+1<text.length){const t2=text.substring(i,i+2);if(map[t2]){r+=map[t2];i+=2;m=true;continue}}const t1=text[i];if(map[t1]){r+=map[t1];i++;m=true;continue}r+=t1;i++}return r}
function initLang(){const m=document.querySelector('main');walkTextNodes(m,n=>{if(!originals.has(n))originals.set(n,n.textContent);n.textContent=convertText(n.textContent,T2S)});converted=true;document.documentElement.lang='zh-CN'}
document.addEventListener('DOMContentLoaded',initLang)
initLang()
function toggleLang(){const m=document.querySelector('main');const b=document.getElementById('lang-toggle')
if(!isTraditional){walkTextNodes(m,n=>{if(originals.has(n))n.textContent=originals.get(n)});b.textContent='簡';document.documentElement.lang='zh-TW';isTraditional=true}
else{originals.clear();walkTextNodes(m,n=>{if(!originals.has(n))originals.set(n,n.textContent);n.textContent=convertText(n.textContent,T2S)});converted=true;b.textContent='繁';document.documentElement.lang='zh-CN';isTraditional=false}}
</script>
</body>
</html>`;

// ==============================
// 3. MARKDOWN-IT SETUP
// ==============================

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
});

// ==============================
// 4. DIRECTIVE PROCESSING
// ==============================

function extractDirectives(body) {
  let id = 0;
  const directives = [];

  const patterns = [
    { type: 'tip',     re: /:::\s*tip\s*\[(.*?)\]\s*\n([\s\S]*?):::/g },
    { type: 'note',    re: /:::\s*note\s*\[(.*?)\]\s*\n([\s\S]*?):::/g },
    { type: 'caution', re: /:::\s*caution\s*\[(.*?)\]\s*\n([\s\S]*?):::/g },
  ];

  for (const { type, re } of patterns) {
    body = body.replace(re, (_, label, content) => {
      const placeholder = `\x01DIRECTIVE_${id}\x01`;
      directives.push({ id, type, label, content: content.trim() });
      id++;
      return placeholder;
    });
  }

  return { body, directives };
}

function renderDirectives(html, directives) {
  for (const d of directives) {
    const inner = md.render(d.content);
    let div;
    if (d.type === 'tip') {
      div = `<div class="highlight-box"><strong>${d.label}</strong>${inner}</div>`;
    } else if (d.type === 'note') {
      div = `<div class="cite-block"><strong>${d.label}</strong>${inner}</div>`;
    } else if (d.type === 'caution') {
      div = `<div class="warn-box"><strong>${d.label}</strong>${inner}</div>`;
    }
    html = html.replace(`\x01DIRECTIVE_${d.id}\x01`, div);
  }
  return html;
}

// ==============================
// 5. POST-PROCESSING
// ==============================

function postprocessAnswerHTML(html) {
  // Convert mermaid code blocks before heading conversion (mermaid blocks may contain ##)
  html = html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, content) => `<pre class="mermaid">\n${content.trim()}\n</pre>`
  );

  // Convert h2 → h4 (section headers are outside answer content, untouched)
  html = html.replace(/<h2(?=\s|>)/g, '<h4');
  html = html.replace(/<\/h2>/g, '</h4>');

  // Merge "一句話" heading with following paragraph
  html = html.replace(
    /<h4>一句話<\/h4>\s*<p>(.*?)<\/p>/g,
    (_, content) => `<h4>一句話：${content}</h4>`
  );

  // Wrap tables in .tbl-wrap
  html = html.replace(
    /(<table>[\s\S]*?<\/table>)/g,
    '<div class="tbl-wrap">$1</div>'
  );

  // Convert Q{N} cross-references to links (skip inside pre/code tags)
  html = html.replace(
    /(<pre[\s\S]*?<\/pre>|<code[^>]*>[\s\S]*?<\/code>)|Q(\d+)/g,
    (match, skipped, num) => skipped ? skipped : `<a href="#q${num}">Q${num}</a>`
  );

  return html;
}

// ==============================
// 6. ITEM PROCESSING
// ==============================

function processMDXFile(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  // Determine section from directory path
  const relPath = filePath.replace(CONTENT_DIR + '/', '');
  const dirName = dirname(relPath);
  const sectionKey = dirName;
  const fileName = basename(filePath, '.mdx');

  if (!SECTIONS[sectionKey]) return null;

  // Extract Q number from filename (e.g., "q01-diffusion-model" → 1)
  const qMatch = fileName.match(/q(\d+)/);
  const qNumber = qMatch ? parseInt(qMatch[1]) : null;

  // Preprocess: strip imports and Starlight JSX
  let body = content;
  body = body.replace(/^import\s+.*?;?\s*$/gm, '');
  body = body.replace(/<CardGrid[^>]*>[\s\S]*?<\/CardGrid>/g, '');
  body = body.replace(/<Card[^>]*>[\s\S]*?<\/Card>/g, '');

  // Extract and render directives
  const { body: processedBody, directives } = extractDirectives(body);

  // Render markdown to HTML
  let html = md.render(processedBody);

  // Render directive content and insert
  html = renderDirectives(html, directives);

  // Post-process HTML
  html = postprocessAnswerHTML(html);

  // Generate summary
  const section = SECTIONS[sectionKey];
  let summary;
  if (section.type === 'workflow') {
    summary = section.summaries[fileName] || data.title;
  } else if (qNumber !== null) {
    summary = `Q${qNumber}: ${data.title}`;
  } else {
    summary = data.title;
  }

  // Generate details id
  const id = qNumber !== null ? `q${qNumber}` : null;

  return {
    section: sectionKey,
    order: data.sidebar?.order ?? 999,
    qNumber,
    id,
    summary,
    html,
  };
}

// ==============================
// 7. MAIN BUILD
// ==============================

async function main() {
  // Discover all MDX files, excluding index pages and English locale
  const mdxFiles = await glob(`${CONTENT_DIR}/**/*.mdx`, {
    ignore: [`${CONTENT_DIR}/en/**`, `${CONTENT_DIR}/**/index.mdx`, `${CONTENT_DIR}/index.mdx`],
  });

  console.log(`Found ${mdxFiles.length} MDX files`);

  // Process each file
  const items = [];
  let skipped = 0;
  for (const file of mdxFiles.sort()) {
    const item = processMDXFile(file);
    if (item) {
      items.push(item);
    } else {
      skipped++;
      console.log(`  SKIP: ${file} (unknown section)`);
    }
  }

  // Group by section
  const grouped = {};
  for (const item of items) {
    if (!grouped[item.section]) grouped[item.section] = [];
    grouped[item.section].push(item);
  }

  // Sort within each section by order
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => a.order - b.order);
  }

  // Generate final HTML
  const sectionKeys = Object.keys(SECTIONS);
  let mainContent = '';

  for (const key of sectionKeys) {
    if (!grouped[key] || grouped[key].length === 0) {
      console.log(`  WARN: No items for section "${key}"`);
      continue;
    }

    mainContent += `\n<!-- ===== ${SECTIONS[key].title} ===== -->\n`;
    mainContent += `<h2 class="section-header">${SECTIONS[key].title}</h2>\n`;

    for (const item of grouped[key]) {
      const idAttr = item.id ? ` id="${item.id}"` : '';
      mainContent += `<details${idAttr}><summary>${item.summary}</summary><div class="answer">\n${item.html}\n</div></details>\n\n`;
    }
  }

  // Assemble page
  const fullHtml = PAGE_OPEN + mainContent + PAGE_CLOSE;

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write index.html
  writeFileSync(join(OUTPUT_DIR, 'index.html'), fullHtml, 'utf-8');

  // Copy public assets
  if (existsSync('public')) {
    const publicFiles = readdirSync('public');
    for (const f of publicFiles) {
      const src = join('public', f);
      const dst = join(OUTPUT_DIR, f);
      cpSync(src, dst, { recursive: true });
      console.log(`  Copy: public/${f} → dist/${f}`);
    }
  }

  console.log(`\n✓ Generated ${OUTPUT_DIR}/index.html`);
  console.log(`  ${items.length} content items from ${mdxFiles.length} files`);
  if (skipped > 0) console.log(`  ${skipped} files skipped`);
}

main().catch(err => { console.error('Build failed:', err); process.exit(1); });
