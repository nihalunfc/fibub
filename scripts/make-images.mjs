// Makes the favicons and the share images (Open Graph, 1200x630) for the home page and every
// live tool, into public/. Run after adding or renaming a tool:  npm run images
// Uses the Playwright browser that the tests use. The images are committed, so the
// Cloudflare build does not need a browser.
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
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

const SHELF = { money: ['#d97706', '#fff4e2'], documents: ['#4f5bd5', '#eceefe'], everyday: ['#e0457b', '#fdebf2'], science: ['#0b7fa6', '#e1f3fa'], learn: ['#0f766e', '#ddf3f0'], collecting: ['#8a6d1d', '#f6efdc'], vehicles: ['#334155', '#e7ecf3'] };
const chip = (t) => `<span class="chip">${t}</span>`;
const page = (body) => `<!doctype html><html><head><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #121826; background: #f6f7fb; position: relative; overflow: hidden; }
  .glow { position: absolute; width: 760px; height: 760px; right: -220px; top: -260px; border-radius: 50%; background: radial-gradient(closest-side, rgba(109,74,255,.22), transparent); }
  .glow2 { position: absolute; width: 640px; height: 640px; left: -240px; bottom: -330px; border-radius: 50%; background: radial-gradient(closest-side, rgba(20,184,166,.22), transparent); }
  .in { position: absolute; inset: 64px 72px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font-weight: 800; font-size: 40px; letter-spacing: -.03em; }
  .brand svg { width: 60px; height: 60px; }
  .brand span span { color: #5d6577; }
  .main { flex: 1; display: flex; align-items: center; gap: 40px; }
  .ico { width: 168px; height: 168px; border-radius: 40px; display: grid; place-items: center; flex: none; }
  .ico svg { width: 96px; height: 96px; }
  h1 { font-size: 92px; line-height: 1; letter-spacing: -.035em; font-weight: 850; }
  h1.long { font-size: 74px; }
  .sub { margin-top: 18px; font-size: 34px; color: #5d6577; font-weight: 500; }
  .chips { display: flex; gap: 14px; }
  .chip { font-size: 30px; font-weight: 800; letter-spacing: .02em; padding: 12px 24px; border-radius: 999px; background: #121826; color: #fff; }
  .chip.soft { background: #e6f6ec; color: #137a3e; }
  .grad { background: linear-gradient(90deg, #0e8f84, #6d4aff); -webkit-background-clip: text; color: transparent; }
</style></head><body><div class="glow"></div><div class="glow2"></div><div class="in">${body}</div></body></html>`;
const brandRow = `<div class="brand">${mark('#121826', '#f6f7fb')}<span>fi<span>bub</span>.com</span></div>`;

const toolCard = (t) => {
  const [c, cs] = SHELF[t.shelf];
  return page(`${brandRow}
    <div class="main">
      <div class="ico" style="background:${cs};color:${c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[t.icon]}</svg></div>
      <div><h1 class="${t.name.length > 16 ? 'long' : ''}">${t.name}</h1><p class="sub">Runs in your browser. Nothing is uploaded.</p></div>
    </div>
    <div class="chips">${chip('FREE')}${chip('NO SIGN-UP')}${t.works === 'offline' ? '<span class="chip soft">WORKS OFFLINE</span>' : ''}</div>`);
};
const homeCard = page(`${brandRow}
  <div class="main"><div><h1>Everyday tools that<br><span class="grad">never see your files</span></h1>
  <p class="sub">Compress files, resize photos, clean links and more.</p></div></div>
  <div class="chips">${chip('FREE')}${chip('NO SIGN-UP')}<span class="chip soft">NOTHING UPLOADED</span></div>`);

const browser = await chromium.launch();
const shot = async (html, w, h, path, transparent = false) => {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html);
  await p.screenshot({ path, omitBackground: transparent });
  await p.close();
};
mkdirSync('public/og', { recursive: true });
// `npm run images -- id1 id2` makes only those tools' share images (and nothing else); no ids makes everything.
const only = process.argv.slice(2);
for (const t of tools) if (!only.length || only.includes(t.id)) await shot(toolCard(t), 1200, 630, `public/og/${t.id}.png`);
if (only.length) { await browser.close(); console.log(`Made ${only.length} share images.`); process.exit(0); }
await shot(homeCard, 1200, 630, 'public/og/home.png');
const icon = (size, radius = 0.22) => `<body style="margin:0;width:${size}px;height:${size}px;background:transparent"><div style="width:${size}px;height:${size}px;border-radius:${size * radius}px;background:#fff;display:grid;place-items:center">${mark().replace('<svg ', `<svg width="${Math.round(size * 0.78)}" height="${Math.round(size * 0.78)}" `)}</div></body>`;
await shot(icon(32), 32, 32, 'public/favicon-32.png', true);
await shot(icon(192), 192, 192, 'public/icon-192.png', true);
await shot(icon(512), 512, 512, 'public/icon-512.png', true);
// Apple adds its own rounded corners and ignores transparency, so fill the square.
await shot(icon(180, 0), 180, 180, 'public/apple-touch-icon.png');
await browser.close();
console.log(`Made ${tools.length + 1} share images and 4 icons.`);
