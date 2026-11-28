// Makes the favicons and the share images into public/: 1200x630 cards for the home page, every live
// tool (public/og/<id>.png) and every course (public/og/course/<id>.png), and 1200x675 cards for Blog
// articles (public/og/blog/<kind>-<slug>.png; research articles show their own chart). Run after adding or renaming a tool:  npm run images
// Uses the Playwright browser that the tests use. The images are committed, so the
// Cloudflare build does not need a browser.
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const brand = readFileSync('src/lib/brand.ts', 'utf8').match(/=> `(.*)`;/s)[1];
const mark = (ink = '#111', hole = '#fff') => brand.replaceAll('${ink}', ink).replaceAll('${hole}', hole);
const ICONS = Object.fromEntries([...readFileSync('src/lib/icons.ts', 'utf8').matchAll(/^\s+(\w+): '(.*)',$/gm)].map((m) => [m[1], m[2]]));
const tools = readdirSync('src/tools').map((id) => {
  const fm = readFileSync(`src/tools/${id}/guide.md`, 'utf8').split('---')[1];
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) || [])[1];
  return { id, name: get('name'), status: get('status'), icon: get('icon'), shelf: get('shelf'), works: get('works') };
}).filter((t) => t.status === 'live');

// Plain black on white, as the brand asks (no gradients or glows), with "fibub.com" on every card.
// Search engines and Discover need at least 1200 px wide: tool and course cards are 1200x630 (the
// Open Graph size), article cards 1200x675 (16:9, what Google's Article docs list first).
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const chip = (t, solid = true) => `<span class="chip${solid ? '' : ' line'}">${t}</span>`;
const page = (body, h = 630) => `<!doctype html><html><head><style>
  * { box-sizing: border-box; margin: 0; }
  /* The site's light-mode colours: research charts (scripts/blog-figures/svg.mjs) draw with these. */
  :root { --ink: #0a0a0a; --muted: #5c5c5c; --line: #e3e3e3; --accent-soft: #f2f2f2; --c-blog: #b45309; --c-tools: #1d4ed8; }
  body { width: 1200px; height: ${h}px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #111; background: #fff; position: relative; overflow: hidden; }
  .in { position: absolute; inset: 56px 72px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 14px; font-weight: 800; font-size: 36px; letter-spacing: -.02em; }
  .brand svg { width: 52px; height: 52px; }
  .top { display: flex; justify-content: space-between; align-items: center; }
  .kind { font-size: 26px; font-weight: 700; color: #444; text-transform: uppercase; letter-spacing: .06em; }
  .main { flex: 1; display: flex; align-items: center; gap: 40px; }
  .ico { width: 160px; height: 160px; border-radius: 36px; border: 6px solid #111; display: grid; place-items: center; flex: none; }
  .ico svg { width: 92px; height: 92px; }
  h1 { font-size: 88px; line-height: 1.02; letter-spacing: -.03em; font-weight: 800; }
  h1.long { font-size: 70px; }
  h1.xl { font-size: 58px; }
  .sub { margin-top: 18px; font-size: 32px; color: #444; font-weight: 500; line-height: 1.25; }
  .chips { display: flex; gap: 14px; }
  .chip { font-size: 28px; font-weight: 800; letter-spacing: .03em; padding: 10px 22px; border-radius: 999px; background: #111; color: #fff; border: 3px solid #111; }
  .chip.line { background: #fff; color: #111; }
  .rule { height: 3px; background: #111; margin: 22px 0; }
  .plot { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
  .plot svg { width: auto !important; height: 100% !important; max-width: 100%; }
  .plot figcaption, .plot p { display: none; }
  .art h1 { font-size: 46px; line-height: 1.1; letter-spacing: -.02em; }
  .art h1.long { font-size: 42px; }
  .foot { display: flex; justify-content: space-between; align-items: center; font-size: 26px; color: #444; font-weight: 600; margin-top: 18px; }
</style></head><body><div class="in">${body}</div></body></html>`;
const brandRow = `<div class="brand">${mark('#111', '#fff')}<span>fibub.com</span></div>`;
const clip = (t, n) => (t.length > n ? t.slice(0, t.lastIndexOf(' ', n - 3)).replace(/[\s,;:(–-]+$/, '') + '…' : t);
const size = (t, a = 16, b = 30) => (t.length > b ? 'xl' : t.length > a ? 'long' : '');

const toolCard = (t) => page(`${brandRow}
    <div class="main">
      <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[t.icon]}</svg></div>
      <div><h1 class="${size(t.name)}">${esc(t.name)}</h1><p class="sub">Runs in your browser. Nothing is uploaded.</p></div>
    </div>
    <div class="chips">${chip('FREE')}${chip('NO SIGN-UP')}${t.works === 'offline' ? chip('WORKS OFFLINE', false) : ''}</div>`);
const homeCard = page(`${brandRow}
  <div class="main"><div><h1>Free tools and courses that never see your files</h1>
  <p class="sub">Documents, money, data, science and learning, all in your browser.</p></div></div>
  <div class="chips">${chip('FREE')}${chip('NO SIGN-UP')}${chip('NOTHING UPLOADED', false)}</div>`);
const courseCard = (c) => page(`<div class="top">${brandRow}<span class="kind">Free course</span></div>
  <div class="main"><div><h1 class="${size(c.name, 18, 34)}">${esc(c.name)}</h1><p class="sub">${esc(clip(c.text, 150))}</p></div></div>
  <div class="chips">${chip('FREE')}${chip('NO SIGN-UP')}${chip('KEEPS YOUR PROGRESS', false)}</div>`);
// A research article: its title over its own verified-with-the-tools chart (the first figure in the article).
const plotCard = (a) => page(`<div class="art"><h1 class="${a.title.length > 70 ? 'long' : ''}">${esc(a.title)}</h1></div>
  <div class="rule"></div>
  <div class="plot">${a.svg}</div>
  <div class="foot"><span>${esc(a.label)}</span>${brandRow}</div>`, 675);
const titleCard = (a) => page(`<div class="top">${brandRow}<span class="kind">${esc(a.label)}</span></div>
  <div class="main"><div><h1 class="xl">${esc(a.title)}</h1><p class="sub">${esc(clip(a.summary, 160))}</p></div></div>
  <div class="chips">${chip('FREE')}${chip('FIBUB BLOG', false)}</div>`, 675);

// Blog articles that get their own card: research articles (their chart) and every kind except tool
// guides, which use their tool's card. Scheduled articles get theirs ahead of their day.
const LABEL = { discoveries: 'Research · checked with fibub tools', howto: 'How to', life: 'Life guide', together: 'Using tools together', kids: 'For students', nobel: 'Nobel Prize series' };
const fmField = (fm, k) => { const m = fm.match(new RegExp(`^${k}:[ \\t]*(.*)$`, 'm')); if (!m) return ''; let v = m[1].trim(); if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1).replace(/\\"/g, '"'); return v; };
const articles = readdirSync('src/blog', { withFileTypes: true }).filter((d) => d.isDirectory() && LABEL[d.name]).flatMap((d) =>
  readdirSync(`src/blog/${d.name}`).filter((f) => f.endsWith('.md')).map((f) => {
    const src = readFileSync(`src/blog/${d.name}/${f}`, 'utf8');
    const fm = src.split(/^---\s*$/m)[1] ?? '';
    const svg = (src.match(/<svg[\s\S]*?<\/svg>/) ?? [])[0];
    return { id: `${d.name}-${f.slice(0, -3)}`, title: fmField(fm, 'title'), summary: fmField(fm, 'summary'), label: LABEL[d.name], svg };
  }));
// Courses: one card each, used by the course home and all its lessons.
const unq = (v) => v.replace(/\\'/g, "'");
const courses = readdirSync('src/courses', { withFileTypes: true }).filter((d) => d.isDirectory()).flatMap((d) => {
  const f = `src/courses/${d.name}/syllabus.ts`;
  const m = d.name.match(/^ncert-class-(\d+)-([a-z]+)$/);
  const cap = (w) => w[0].toUpperCase() + w.slice(1);
  if (m) return [{ id: d.name, name: `Class ${m[1]} ${cap(m[2])}`, text: `Every NCERT chapter of Class ${m[1]} ${cap(m[2])}: clear notes, animations, live problems and practice questions with worked answers.` }];
  if (!existsSync(f)) return [];
  const src = readFileSync(f, 'utf8');
  const get = (k) => src.match(new RegExp(`^\\s+${k}: (['"])((?:(?!\\1)[^\\\\]|\\\\.)*)\\1`, 'm'))?.[2];
  const name = get('name'), text = get('text');
  return name ? [{ id: d.name, name: unq(name), text: unq(text ?? '') }] : [];
});
const skillSrc = existsSync('src/data/skill-courses.ts') ? readFileSync('src/data/skill-courses.ts', 'utf8') : '';
for (const m of skillSrc.matchAll(/id: '([a-z0-9-]+)',\s*name: '((?:[^'\\]|\\.)*)',\s*text: '((?:[^'\\]|\\.)*)'/g)) courses.push({ id: m[1], name: m[2].replace(/\\'/g, "'"), text: m[3].replace(/\\'/g, "'") });

const browser = await chromium.launch();
const shot = async (html, w, h, path, transparent = false) => {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html);
  await p.screenshot({ path, omitBackground: transparent });
  await p.close();
};
mkdirSync('public/og/blog', { recursive: true });
mkdirSync('public/og/course', { recursive: true });
// `npm run images -- id1 id2` makes only those cards: tool ids, article ids (<kind>-<slug>, or a slug)
// or course ids. `--blog` makes only article cards, `--courses` only course cards, `--icons` only icons.
// `--new` skips cards that already exist (the daily article run uses `--blog --new`).
const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith('--')));
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const fresh = (path) => !flags.has('--new') || !existsSync(path);
const want = (...ids) => !only.length || ids.some((id) => only.includes(id));
const iconsOnly = flags.has('--icons');
const part = flags.has('--blog') || flags.has('--courses') || iconsOnly;
let n = 0;
const make = async (html, h, path) => { if (fresh(path)) { await shot(html, 1200, h, path); n++; } };
if (!part || only.length) for (const t of tools) if (want(t.id)) await make(toolCard(t), 630, `public/og/${t.id}.png`);
if (!part || flags.has('--blog')) for (const a of articles) if (want(a.id, a.id.replace(/^[a-z]+-/, ''))) await make(a.svg ? plotCard(a) : titleCard(a), 675, `public/og/blog/${a.id}.png`);
if (!part || flags.has('--courses')) for (const c of courses) if (want(c.id)) await make(courseCard(c), 630, `public/og/course/${c.id}.png`);
if (only.length || (part && !iconsOnly)) { await browser.close(); console.log(`Made ${n} share images.`); process.exit(0); }
if (!iconsOnly) await shot(homeCard, 1200, 630, 'public/og/home.png');
const icon = (size, radius = 0.22) => `<body style="margin:0;width:${size}px;height:${size}px;background:transparent"><div style="width:${size}px;height:${size}px;border-radius:${size * radius}px;background:#fff;display:grid;place-items:center">${mark().replace('<svg ', `<svg width="${Math.round(size * 0.78)}" height="${Math.round(size * 0.78)}" `)}</div></body>`;
await shot(icon(32), 32, 32, 'public/favicon-32.png', true);
await shot(icon(192), 192, 192, 'public/icon-192.png', true);
await shot(icon(512), 512, 512, 'public/icon-512.png', true);
// Apple adds its own rounded corners and ignores transparency, so fill the square.
await shot(icon(180, 0), 180, 180, 'public/apple-touch-icon.png');
// Android crops app icons to its own shape (circle, squircle...), keeping only the middle 80%: a full
// white square with the bubbles inside that safe zone (the installed app's icon, site.webmanifest).
const maskable = (size) => `<body style="margin:0;width:${size}px;height:${size}px;background:#fff;display:grid;place-items:center">${mark().replace('<svg ', `<svg width="${Math.round(size * 0.56)}" height="${Math.round(size * 0.56)}" `)}</body>`;
await shot(maskable(512), 512, 512, 'public/icon-maskable-512.png');
await browser.close();
console.log(`Made ${n + 1} share images and 5 icons.`);
