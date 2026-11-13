// Install-as-an-app checks (manifest, icons, service worker, offline pages, install buttons).
// Builds nothing: run `npm run build` first. Usage: node tests/pwa.mjs
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const PORT = 4331;
const BASE = `http://localhost:${PORT}`;
let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failures++; };

if (await fetch(BASE).then(() => true, () => false)) { console.log(`Port ${PORT} is busy (an old preview?). Run: pkill -f "astro preview"`); process.exit(1); }
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore', detached: true });
const stopServer = () => { try { process.kill(-server.pid); } catch { server.kill(); } };
let browser;
try {
  for (let i = 0; i < 50; i++) { try { await fetch(BASE); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }

  // The manifest: installable (standalone, start_url inside scope, a 192 and a 512 icon, a maskable icon), every icon there.
  const man = await (await fetch(`${BASE}/site.webmanifest`)).json();
  check(man.display === 'standalone' && man.start_url === '/' && man.scope === '/' && man.id === '/', 'manifest: standalone app at /');
  check(['192x192', '512x512'].every((s) => man.icons.some((i) => i.sizes === s && i.type === 'image/png')) && man.icons.some((i) => i.purpose === 'maskable'), 'manifest: 192 and 512 PNG icons and a maskable icon');
  const urls = [...man.icons.map((i) => i.src), ...man.shortcuts.map((s) => s.url)];
  const bad = [];
  for (const u of urls) if ((await fetch(BASE + u)).status !== 200) bad.push(u);
  check(!bad.length, `manifest: every icon and shortcut answers${bad.length ? ': ' + bad.join(', ') : ''}`);

  // The service worker: built with a real version and a precache list whose files all exist.
  const sw = readFileSync('dist/sw.js', 'utf8');
  const pre = JSON.parse(sw.match(/const PRECACHE = (\[.*?\]);/)[1]);
  check(!sw.includes('__VERSION__') && /const VERSION = "[0-9a-f]{12}"/.test(sw), 'sw.js: has a version');
  const missing = [];
  for (const u of pre) if ((await fetch(BASE + u)).status !== 200) missing.push(u);
  check(pre.includes('/offline/') && pre.includes('/') && !missing.length, `sw.js: precache has / and /offline/, all ${pre.length} files exist${missing.length ? ' (missing ' + missing.join(', ') + ')' : ''}`);
  check(!/\/offline\//.test(readFileSync('dist/sitemap-0.xml', 'utf8')), 'sitemap: /offline/ left out');
  const headers = readFileSync('public/_headers', 'utf8');
  check(/\/sw\.js\n\s+Cache-Control: no-cache/.test(headers), '_headers: sw.js is never cached by the browser, so deploys reach installed apps');

  browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${BASE}/`);
  const ready = await page.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
  check(ready, 'service worker: registers and activates');
  check(await page.locator('#all-tools a.at-install[href="/app/"]').count() === 1, 'menu: "Install fibub as an app" link');
  check(await page.locator('main a[data-install][href="/app/"]').count() >= 1, 'home: install link');

  // A tool opened once works offline; a page never opened shows the offline page listing what is kept.
  const tool = JSON.parse(readFileSync('dist/tools.json', 'utf8')).find((t) => t.id === 'loan-payoff-planner') ?? JSON.parse(readFileSync('dist/tools.json', 'utf8'))[0];
  await page.goto(BASE + tool.u);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.reload(); // now through the worker, so the page and its files are kept
  await page.goto(`${BASE}/tools/`); // menus' tool index etc.
  await page.waitForTimeout(500);
  await ctx.setOffline(true);
  await page.goto(BASE + tool.u);
  check(await page.locator(`.bm[data-id="${tool.id}"]`).count() === 1, `offline: ${tool.u} still opens`);
  const styled = await page.evaluate(() => getComputedStyle(document.querySelector('.tabbar')).position === 'fixed');
  check(styled, 'offline: the kept page has its styles (bottom bar in place)');
  await page.goto(`${BASE}/about/`);
  check((await page.locator('main h1').textContent()) === 'You are offline', 'offline: an unopened page shows the offline page');
  await page.waitForSelector('.off-list li');
  const kept = await page.locator('.off-list a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  check(kept.includes(tool.u), `offline page: lists the kept tool (${kept.length} kept)`);
  await ctx.setOffline(false);
  await page.goto(`${BASE}/about/`);
  check((await page.locator('main h1').textContent()) === 'About fibub', 'back online: the real page loads');
  check(!errors.length, `no script errors${errors.length ? ': ' + errors.join(' | ') : ''}`);

  // The /app/ page; on an iPhone the install button shows the Add to Home Screen steps.
  const ip = await browser.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
  const p2 = await ip.newPage();
  await p2.goto(`${BASE}/app/`);
  check(await p2.locator('.app-btn').isVisible(), 'iPhone: /app/ shows the Install button');
  await p2.locator('.app-btn').click();
  check(await p2.locator('.inst-dlg[open]').isVisible() && /Add to Home Screen/.test(await p2.locator('.inst-dlg').textContent()), 'iPhone: the button shows the Add to Home Screen steps');
  const wide = await p2.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  check(wide, 'iPhone: /app/ has no sideways scroll');
  // In the installed app (standalone), install links hide and a Back button shows.
  const app = await browser.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
  await app.addInitScript(() => Object.defineProperty(navigator, 'standalone', { get: () => true }));
  const p3 = await app.newPage();
  await p3.goto(BASE + tool.u);
  check(await p3.locator('.back-btn').isVisible() && !(await p3.locator('footer .ft-install').isVisible()), 'installed app: Back button shows, install links hide');
} finally {
  await browser?.close();
  stopServer();
}
console.log(failures ? `\n${failures} PWA check(s) failed` : '\nAll PWA checks passed');
process.exit(failures ? 1 : 0);
