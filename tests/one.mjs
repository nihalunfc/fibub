// Browser checks for one or a few tools, for building tools side by side. Runs each tool's own checks
// (tests/tools/<id>.mjs) plus the checks every tool page gets in run.mjs: no page or CSP errors, nothing sent
// anywhere, fits a phone, and the step picture stays on one row at 320 px. `npm test` runs all of these too.
// Usage: npm run build && PORT=4401 node tests/one.mjs <id> [<id> ...]
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const ids = process.argv.slice(2);
if (!ids.length) { console.log('Usage: PORT=4401 node tests/one.mjs <tool-id> ...'); process.exit(2); }
const PORT = Number(process.env.PORT || 4401), BASE = `http://localhost:${PORT}`;
const OUT = new URL(`./out-${PORT}/`, import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failures++; };
const CSP = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8').match(/Content-Security-Policy: (.+)/)[1];
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
try {
  for (let i = 0; i < 100; i++) { try { await fetch(BASE); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }
  const browser = await chromium.launch();
  const setup = async (ctx) => {
    await ctx.route(BASE + '/api/**', (route) => route.fulfill({ json: { site: 1, v: 1, u: 1 } }));
    await ctx.route(BASE + '/**', async (route) => {
      if (new URL(route.request().url()).pathname.startsWith('/api/')) return route.fallback();
      const res = await route.fetch(), headers = { ...res.headers() };
      if ((headers['content-type'] || '').includes('text/html')) headers['content-security-policy'] = CSP.replace('upgrade-insecure-requests', '');
      await route.fulfill({ response: res, headers });
    });
  };
  const ctx = await browser.newContext({ acceptDownloads: true }); await setup(ctx);
  const page = await ctx.newPage();
  const requests = [], pageErrors = [];
  page.on('request', (r) => { if (!(r.method() === 'POST' && /^\/api\/(hit|use)$/.test(new URL(r.url()).pathname))) requests.push({ url: r.url(), method: r.method() }); });
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && /Content Security Policy|Refused/.test(m.text())) pageErrors.push('CSP: ' + m.text()); });
  const paths = [];
  for (const id of ids) {
    const t = await import(new URL(`./tools/${id}.mjs`, import.meta.url));
    if (t.path) paths.push(t.path);
    await t.default({ page, check, BASE, OUT, readFileSync, writeFileSync });
  }
  check(pageErrors.length === 0, `no page or CSP errors ${pageErrors.join(' | ')}`);
  const offsite = requests.filter((r) => !r.url.startsWith(BASE) && !/^(blob|data):/.test(r.url));
  check(offsite.length === 0, `nothing fetched from other sites ${offsite.map((r) => r.url).slice(0, 3).join(' ')}`);
  check(requests.every((r) => r.method === 'GET'), `no uploads: ${requests.length} requests, all GET`);
  const pctx = await browser.newContext({ ...devices['iPhone 13'], acceptDownloads: true }); await setup(pctx);
  const phone = await pctx.newPage();
  for (const path of paths) {
    await phone.goto(BASE + path);
    const sw = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(sw <= 390, `${path} fits a phone (scrollWidth ${sw})`);
  }
  await phone.setViewportSize({ width: 320, height: 640 });
  for (const path of paths) {
    await phone.goto(BASE + path);
    const rows = await phone.$$eval('.flow-step', (els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    const sw = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(rows === 1 && sw <= 320, `${path} step picture: one row at 320 px (rows ${rows}, scrollWidth ${sw})`);
  }
  await browser.close();
} finally { server.kill(); }
console.log(failures ? `${failures} FAILED` : 'All checks passed');
process.exit(failures ? 1 : 0);
