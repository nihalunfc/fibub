// End-to-end test for fibub tools. Builds nothing: run `npm run build` first.
// Usage: npm test            (uses the Playwright that is installed on the machine)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, statSync } from 'node:fs';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const OUT = new URL('./out/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const PORT = 4329;
const BASE = `http://localhost:${PORT}`;
let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failures++; };

// ---------- fixtures ----------
async function photoPng(page, w, h, seed) {
  return page.evaluate(([w, h, seed]) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, `hsl(${seed * 50},70%,60%)`); g.addColorStop(1, `hsl(${seed * 50 + 120},60%,35%)`);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const img = x.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 40; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    x.putImageData(img, 0, 0);
    x.fillStyle = '#000'; x.font = 'bold 120px sans-serif'; x.fillText('SCAN ' + seed, 100, 300);
    return c.toDataURL('image/png').split(',')[1];
  }, [w, h, seed]).then((b64) => Buffer.from(b64, 'base64'));
}

async function makeFixtures(page) {
  const text = await PDFDocument.create();
  const font = await text.embedFont(StandardFonts.Helvetica);
  for (let p = 1; p <= 5; p++) {
    const pg = text.addPage([612, 792]);
    for (let l = 0; l < 40; l++) pg.drawText(`Page ${p}, line ${l + 1}: the quick brown fox jumps over the lazy dog.`, { x: 50, y: 740 - l * 17, size: 11, font, color: rgb(0, 0, 0) });
  }
  writeFileSync(OUT + 'text.pdf', await text.save());

  const photo = await PDFDocument.create();
  for (let p = 1; p <= 3; p++) {
    const png = await photo.embedPng(await photoPng(page, 1700, 2200, p));
    const pg = photo.addPage([612, 792]);
    pg.drawImage(png, { x: 0, y: 0, width: 612, height: 792 });
    if (p === 2) pg.setRotation(degrees(90));
  }
  writeFileSync(OUT + 'photo.pdf', await photo.save());

  // A PDF whose trailer says it is encrypted.
  const enc = await PDFDocument.create();
  enc.addPage([300, 300]);
  let s = Buffer.from(await enc.save({ useObjectStreams: false })).toString('latin1');
  s = s.replace(/trailer\s*<</, (m) => m + '\n/Encrypt 1 0 R');
  writeFileSync(OUT + 'encrypted.pdf', Buffer.from(s, 'latin1'));

  writeFileSync(OUT + 'not-a-pdf.pdf', 'hello, this is plain text');
}

// ---------- helpers ----------
async function runTool(page, file, level) {
  await page.goto(`${BASE}/documents/compress-pdf/`);
  await page.setInputFiles('#pdfc-file', file);
  await page.check(`input[name=level][value=${level}]`);
  await page.click('#pdfc-go');
  await page.waitForSelector('#pdfc-result:not([hidden]), #pdfc-error:not([hidden])', { timeout: 60000 });
  if (await page.isVisible('#pdfc-error')) return { error: await page.textContent('#pdfc-error') };
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#pdfc-download')]);
  const path = OUT + `${level}-${file.split('/').pop()}`;
  await dl.saveAs(path);
  return { path, summary: await page.textContent('#pdfc-summary'), name: dl.suggestedFilename() };
}

async function pageSizes(path) {
  const doc = await PDFDocument.load(readFileSync(path));
  return doc.getPages().map((p) => {
    const { width, height } = p.getSize(); const r = p.getRotation().angle % 180 !== 0;
    return r ? [Math.round(height), Math.round(width)] : [Math.round(width), Math.round(height)];
  });
}

// ---------- run ----------
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
try {
  for (let i = 0; i < 50; i++) { try { await fetch(BASE); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();
  const requests = [];
  page.on('request', (r) => requests.push({ url: r.url(), method: r.method(), body: r.postData() }));
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));

  await page.goto(BASE);
  await makeFixtures(page);

  // 1. Photo-heavy PDF shrinks a lot and keeps pages, order and sizes.
  const photoIn = OUT + 'photo.pdf';
  const before = await pageSizes(photoIn);
  for (const level of ['balanced', 'smallest']) {
    const r = await runTool(page, photoIn, level);
    check(!r.error, `${level}: photo PDF compresses without error ${r.error ?? ''}`);
    if (r.error) continue;
    const a = statSync(photoIn).size, b = statSync(r.path).size;
    check(b < a * 0.5, `${level}: photo PDF ${(a / 1e6).toFixed(2)} MB -> ${(b / 1e6).toFixed(2)} MB`);
    check(JSON.stringify(await pageSizes(r.path)) === JSON.stringify(before), `${level}: same page count and page sizes (incl. rotated page)`);
    check(r.name === 'photo-compressed.pdf', `${level}: download name is ${r.name}`);
  }
  const bal = statSync(OUT + 'balanced-photo.pdf').size, small = statSync(OUT + 'smallest-photo.pdf').size;
  check(small < bal, `smallest (${small}) is smaller than recommended (${bal})`);

  // 2. Text PDF never gets bigger, and stays text when images would not help.
  for (const level of ['lossless', 'balanced']) {
    const r = await runTool(page, OUT + 'text.pdf', level);
    check(!r.error, `${level}: text PDF works`);
    if (r.error) continue;
    check(statSync(r.path).size <= statSync(OUT + 'text.pdf').size, `${level}: text PDF not bigger (${statSync(OUT + 'text.pdf').size} -> ${statSync(r.path).size})`);
    const doc = await PDFDocument.load(readFileSync(r.path));
    check(doc.getPageCount() === 5, `${level}: text PDF keeps 5 pages`);
    console.log('      summary:', r.summary.trim());
  }

  // 3. Bad inputs show a clear message.
  const enc = await runTool(page, OUT + 'encrypted.pdf', 'balanced');
  check(/password/i.test(enc.error ?? ''), `encrypted PDF shows password message: "${enc.error}"`);
  const bad = await runTool(page, OUT + 'not-a-pdf.pdf', 'balanced');
  check(/could not be read/i.test(bad.error ?? ''), `non-PDF shows read error: "${bad.error}"`);

  // 4. Nothing is uploaded: every request is a GET to this site.
  const offsite = requests.filter((r) => !r.url.startsWith(BASE) && !r.url.startsWith('blob:') && !r.url.startsWith('data:'));
  const posts = requests.filter((r) => r.method !== 'GET');
  check(offsite.length === 0, `no requests leave the site (${offsite.map((r) => r.url).join(', ') || 'none'})`);
  check(posts.length === 0, `no uploads: ${requests.length} requests, all GET`);

  // 5. Works offline once the page has loaded.
  await page.goto(`${BASE}/documents/compress-pdf/`);
  await page.waitForTimeout(2500); // let the idle preload finish
  await ctx.setOffline(true);
  await page.setInputFiles('#pdfc-file', photoIn);
  await page.click('#pdfc-go');
  await page.waitForSelector('#pdfc-result:not([hidden]), #pdfc-error:not([hidden])', { timeout: 60000 });
  check(await page.isVisible('#pdfc-result'), 'works with the network switched off after load');
  await ctx.setOffline(false);

  check(consoleErrors.length === 0, `no uncaught page errors ${consoleErrors.join(' | ')}`);

  // 6. Phone layout: no sideways scroll.
  const phone = await browser.newPage({ viewport: { width: 375, height: 800 } });
  for (const path of ['/', '/documents/compress-pdf/', '/privacy/']) {
    await phone.goto(BASE + path);
    const sw = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(sw <= 375, `${path} fits a 375px phone (scrollWidth ${sw})`);
  }
  await phone.goto(BASE + '/documents/compress-pdf/');
  await phone.screenshot({ path: OUT + 'phone-compress.png', fullPage: false });
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(BASE + '/');
  await page.screenshot({ path: OUT + 'desktop-home.png' });
  await browser.close();
} finally {
  server.kill();
}
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
