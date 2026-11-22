// Usage: node scripts/viz-check.mjs . name1 name2 ... [--shots dir]   (browser check for shared figures in public/learn-kit/viz/)
// Serves <repo>/public, mounts each /learn-kit/viz/<name>.js in a 375px (light) and a 900px (dark) page, clicks every
// button, moves every slider, reports exceptions, console errors and sideways scroll, and saves screenshots.
import http from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const root = path.resolve(args.shift());
let shots = null;
const si = args.indexOf('--shots');
if (si >= 0) { shots = args[si + 1]; args.splice(si, 2); mkdirSync(shots, { recursive: true }); }
const pub = path.join(root, 'public');
const cssFile = path.join(root, 'src/styles/lesson-kit.css');
const css = existsSync(cssFile) ? readFileSync(cssFile, 'utf8') : '';
const page = (name, dark) => `<!doctype html><html ${dark ? 'data-theme="dark"' : ''}><head><meta name=viewport content="width=device-width"><style>
body{--ink:${dark ? '#eee' : '#111'};--muted:#777;--line:${dark ? '#333' : '#ddd'};--surface:${dark ? '#000' : '#fff'};--bg:${dark ? '#000' : '#fff'};--accent-soft:${dark ? '#222' : '#eef'};
--s1:#0072b2;--s2:#e69f00;--s3:#009e73;--s4:#cc79a7;--s5:#56b4e9;--s6:#d55e00;--s7:#f0e442;--s8:#555;--good:#080;--bad:#c00;--warn:#b60;margin:0;padding:8px;font-family:system-ui;background:var(--bg);color:var(--ink)}
${css}</style></head><body><figure class="fig lk-fig" id=h><figcaption>cap</figcaption></figure>
<script type=module>import m from '/learn-kit/viz/${name}.js'; window.__ok = false; try { const c = await m(document.getElementById('h'), {data:{}}); window.__ctl = c; if (c && c.step) { c.step(0, 4); c.step(2, 4); } window.__ok = true; } catch (e) { window.__err = String(e.stack||e); }</script></body></html>`;

const srv = http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname.startsWith('/__p/')) {
    const parts = u.pathname.split('/');
    r.writeHead(200, { 'content-type': 'text/html' });
    return r.end(page(parts[3], parts[2] === 'd'));
  }
  const f = path.join(pub, decodeURIComponent(u.pathname));
  if (!f.startsWith(pub) || !existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'text/plain' });
  r.end(readFileSync(f));
}).listen(0);
const port = srv.address().port;
const b = await chromium.launch();
let bad = 0;
for (const name of args) {
  let mine = 0;
  for (const [w, dark] of [[375, 0], [900, 1]]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(`http://localhost:${port}/__p/${dark ? 'd' : 'l'}/${name}`);
    await p.waitForTimeout(700);
    const st = await p.evaluate(() => ({ ok: window.__ok, err: window.__err, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, canv: document.querySelectorAll('#h canvas, #h svg').length }));
    for (const bt of await p.$$('#h button')) { try { await bt.click({ timeout: 500 }); await p.waitForTimeout(50); } catch {} }
    for (const s of await p.$$('#h input[type=range]')) {
      try { await s.evaluate((e) => { for (const v of [e.max, e.min, (+e.max + +e.min) / 2]) { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); } }); } catch {}
    }
    await p.waitForTimeout(400);
    const st2 = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    const prob = [];
    if (!st.ok) prob.push('mount failed ' + (st.err || ''));
    if (Math.max(st.sw, st2.sw) > st.cw + 1) prob.push(`sideways scroll ${Math.max(st.sw, st2.sw)}>${st.cw}`);
    if (!st.canv) prob.push('no canvas/svg');
    prob.push(...errs);
    if (shots) { const el = await p.$('#h'); if (el) await el.screenshot({ path: path.join(shots, name + (dark ? '-dark' : '') + '.png') }); }
    if (prob.length) { mine++; console.log(`FAIL ${name} @${w}px: ${prob.join(' | ')}`); }
    await p.close();
  }
  if (mine) bad++; else console.log('ok ' + name);
}
await b.close();
srv.close();
process.exit(bad ? 1 : 0);
