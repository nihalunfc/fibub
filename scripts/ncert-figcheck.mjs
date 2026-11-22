// Opens NCERT lesson-kit figures in a headless browser and reports any error, so a writer can check figures
// without a full site build. Usage: node scripts/ncert-figcheck.mjs <fig-name> [...] [--shots <dir>]
// (no names = every figure in public/learn-kit/ncert/figs/). Step players are stepped through every step.
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH ?? 'playwright');
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const pub = new URL('../public/', import.meta.url).pathname;
const names = args.length ? args : readdirSync(join(pub, 'learn-kit/ncert/figs')).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3));
const css = readFileSync(new URL('../src/styles/lesson-kit.css', import.meta.url), 'utf8');
const page0 = (name) => `<!doctype html><html><head><meta charset="utf-8"><style>:root{--ink:#111;--muted:#666;--line:#ddd;--surface:#fff;--bg:#fff;--accent:#0b6e6e;--accent-soft:#e2f2f2;--good:#1a7f37;--bad:#c62828;--warn:#b26a00}body{font-family:system-ui;max-width:420px;margin:0 auto;padding:8px}${css}</style></head>
<body><div class="cs-layout" data-kit="/learn-kit/ncert/"><figure class="lk-fig" id="f"><figcaption>x</figcaption></figure></div>
<script type="module">
const mod = await import('/learn-kit/ncert/figs/${name}.js');
const api = mod.default(document.getElementById('f'), { steps: [], data: {} }) || {};
window.__api = api; window.__ready = true;
</script></body></html>`;
const types = { '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
const srv = createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u.startsWith('/__fig/')) { s.writeHead(200, { 'content-type': 'text/html' }); return s.end(page0(u.slice(7))); }
  const f = join(pub, u);
  if (!f.startsWith(pub) || !existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': types[extname(f)] ?? 'application/octet-stream' }); s.end(readFileSync(f));
}).listen(0);
const port = srv.address().port;
const browser = await chromium.launch();
let bad = 0;
if (shots) mkdirSync(shots, { recursive: true });
for (const name of names) {
  const page = await browser.newPage({ viewport: { width: 400, height: 700 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.goto(`http://localhost:${port}/__fig/${name}`);
  try { await page.waitForFunction(() => window.__ready, null, { timeout: 5000 }); } catch { errs.push('did not mount in 5 s'); }
  await page.waitForTimeout(+(process.env.WAIT ?? 700));
  if (process.env.WAIT) console.log(await page.evaluate(() => document.querySelector('.lk-readout')?.textContent));
  const n = await page.evaluate(() => (typeof window.__api?.step === 'function' ? 8 : 0));
  for (let i = 0; i < n; i++) { await page.evaluate((i) => window.__api.step(i, 8), i); await page.waitForTimeout(250); }
  // move every slider and press every button once
  await page.evaluate(() => { for (const r of document.querySelectorAll('input[type=range]')) { r.value = r.max; r.dispatchEvent(new Event('input')); r.value = r.min; r.dispatchEvent(new Event('input')); } for (const b of document.querySelectorAll('button')) b.click(); });
  await page.waitForTimeout(400);
  const blank = await page.evaluate(() => { const c = document.querySelector('canvas'); return c ? c.width === 0 : false; });
  if (blank) errs.push('canvas has no size');
  if (shots) await page.screenshot({ path: join(shots, name + '.png'), fullPage: true });
  console.log(errs.length ? `FAIL ${name}: ${[...new Set(errs)].join(' | ')}` : `ok   ${name}`);
  if (errs.length) bad++;
  await page.close();
}
await browser.close(); srv.close();
console.log(`${names.length - bad}/${names.length} figures ok`);
process.exit(bad ? 1 : 0);
