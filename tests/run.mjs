// End-to-end test for fibub tools. Builds nothing: run `npm run build` first.
// Usage: npm test            (uses the Playwright that is installed on the machine)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, statSync } from 'node:fs';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';

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

  // Images
  writeFileSync(OUT + 'photo.png', await photoPng(page, 3000, 2000, 4));
  const jpgB64 = await page.evaluate(async () => { const c = document.createElement('canvas'); c.width = 4000; c.height = 3000; const x = c.getContext('2d'); for (let i = 0; i < 400; i++) { x.fillStyle = `hsl(${i * 7},60%,${30 + (i % 40)}%)`; x.fillRect(Math.random() * 4000, Math.random() * 3000, 300, 300); } return c.toDataURL('image/jpeg', 0.95).split(',')[1]; });
  writeFileSync(OUT + 'photo.jpg', Buffer.from(jpgB64, 'base64'));

  // A minimal Word file holding two large pictures.
  const xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  writeFileSync(OUT + 'report.docx', zipSync({
    '[Content_Types].xml': strToU8(xml + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'),
    'word/document.xml': strToU8(xml + '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Quarterly report</w:t></w:r></w:p></w:body></w:document>'),
    'word/_rels/document.xml.rels': strToU8(xml + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image2.jpeg"/></Relationships>'),
    'word/media/image1.png': new Uint8Array(await photoPng(page, 2400, 1800, 5)),
    'word/media/image2.jpeg': new Uint8Array(Buffer.from(jpgB64, 'base64')),
  }, { level: 6 }));

  // A 3 MB CSV
  let csv = 'date,store,sku,units,price\n';
  for (let i = 0; i < 60000; i++) csv += `2026-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')},S${i % 40},SKU${(i * 7919) % 5000},${i % 17},${(i % 997) / 10}\n`;
  writeFileSync(OUT + 'sales.csv', csv);
}

// ---------- helpers ----------
async function runTool(page, file, level, { url = '/documents/compress-file/', method } = {}) {
  await page.goto(BASE + url);
  await page.setInputFiles('.cmp-input', file);
  if (await page.isVisible('.cmp-error')) return { error: await page.textContent('.cmp-error') };
  if (method) await page.check(`input[name=cmp-method][value=${method}]`);
  if (level && await page.isVisible('.cmp-levels')) await page.check(`input[name=cmp-level][value=${level}]`);
  await page.click('.cmp-go');
  await page.waitForSelector('.result:not([hidden]), .cmp-error:not([hidden])', { timeout: 90000 });
  if (await page.isVisible('.cmp-error')) return { error: await page.textContent('.cmp-error') };
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.cmp-download')]);
  const path = OUT + `out-${level ?? method}-${dl.suggestedFilename()}`;
  await dl.saveAs(path);
  return { path, note: (await page.textContent('.cmp-note')).trim(), name: dl.suggestedFilename() };
}

function jpegSize(b) {
  for (let i = 2; i < b.length;) {
    const marker = b[i + 1], len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  return [0, 0];
}

async function pageSizes(path) {
  const doc = await PDFDocument.load(readFileSync(path));
  return doc.getPages().map((p) => {
    const { width, height } = p.getSize(); const r = p.getRotation().angle % 180 !== 0;
    return r ? [Math.round(height), Math.round(width)] : [Math.round(width), Math.round(height)];
  });
}

// The security headers Cloudflare will send (from public/_headers), applied in tests too,
// so a Content Security Policy problem shows up here rather than on the live site.
const CSP = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8').match(/Content-Security-Policy: (.+)/)[1];

// ---------- run ----------
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
try {
  for (let i = 0; i < 50; i++) { try { await fetch(BASE); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ acceptDownloads: true });
  await ctx.route(BASE + '/**', async (route) => {
    const res = await route.fetch();
    const headers = { ...res.headers() };
    if ((headers['content-type'] || '').includes('text/html')) headers['content-security-policy'] = CSP.replace('upgrade-insecure-requests', '');
    await route.fulfill({ response: res, headers });
  });
  const page = await ctx.newPage();
  const requests = [];
  page.on('request', (r) => requests.push({ url: r.url(), method: r.method() }));
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && /Content Security Policy|Refused/.test(m.text())) pageErrors.push('CSP: ' + m.text()); });

  await page.goto(BASE);
  await makeFixtures(page);
  const size = (p) => statSync(p).size;
  const mb = (n) => (n / 1e6).toFixed(2) + ' MB';

  // 1. PDF: photo-heavy file shrinks a lot and keeps pages, order and sizes.
  const photoIn = OUT + 'photo.pdf';
  const before = await pageSizes(photoIn);
  for (const level of ['recommended', 'smallest']) {
    const r = await runTool(page, photoIn, level, { url: '/documents/compress-pdf/' });
    check(!r.error, `pdf ${level}: compresses without error ${r.error ?? ''}`);
    if (r.error) continue;
    check(size(r.path) < size(photoIn) * 0.5, `pdf ${level}: ${mb(size(photoIn))} -> ${mb(size(r.path))}`);
    check(JSON.stringify(await pageSizes(r.path)) === JSON.stringify(before), `pdf ${level}: same page count and page sizes (incl. rotated page)`);
    check(r.name === 'photo-compressed.pdf', `pdf ${level}: download name ${r.name}`);
  }
  for (const level of ['light', 'recommended']) {
    const r = await runTool(page, OUT + 'text.pdf', level);
    check(!r.error && size(r.path) <= size(OUT + 'text.pdf'), `pdf ${level}: text PDF never bigger (${size(OUT + 'text.pdf')} -> ${r.path && size(r.path)})`);
    check(r.path && (await PDFDocument.load(readFileSync(r.path))).getPageCount() === 5, `pdf ${level}: text PDF keeps 5 pages`);
  }

  // 2. Images
  {
    const r = await runTool(page, OUT + 'photo.jpg', 'recommended');
    check(!r.error && size(r.path) < size(OUT + 'photo.jpg') * 0.6, `jpg recommended: ${mb(size(OUT + 'photo.jpg'))} -> ${r.path && mb(size(r.path))} (${r.name})`);
    const dims = jpegSize(readFileSync(r.path));
    check(dims[0] === 2560 && dims[1] === 1920, `jpg recommended: resized to ${dims.join('x')}`);
    const p = await runTool(page, OUT + 'photo.png', 'smallest', { url: '/documents/compress-image/' });
    check(!p.error && p.name === 'photo-compressed.jpg' && size(p.path) < size(OUT + 'photo.png') * 0.2, `png smallest: opaque PNG becomes JPG ${mb(size(OUT + 'photo.png'))} -> ${p.path && mb(size(p.path))}`);
  }

  // 3. Word file: pictures shrink, every part is still there, text untouched.
  {
    const src = unzipSync(readFileSync(OUT + 'report.docx'));
    const r = await runTool(page, OUT + 'report.docx', 'recommended');
    check(!r.error && r.name === 'report-compressed.docx', `docx: works, name ${r.name} ${r.error ?? ''}`);
    const out = unzipSync(readFileSync(r.path));
    const expect = Object.keys(src).map((k) => k.replace('image1.png', 'image1.jpeg')).sort();
    check(JSON.stringify(Object.keys(out).sort()) === JSON.stringify(expect), 'docx: same parts inside (PNG photo now JPEG)');
    check(strFromU8(out['word/_rels/document.xml.rels']).includes('Target="media/image1.jpeg"'), 'docx: picture link updated to the new name');
    check(/Extension="jpeg"/.test(strFromU8(out['[Content_Types].xml'])), 'docx: JPEG type registered');
    check(strFromU8(out['word/document.xml']) === strFromU8(src['word/document.xml']), 'docx: document text unchanged');
    check(size(r.path) < size(OUT + 'report.docx') * 0.6, `docx: ${mb(size(OUT + 'report.docx'))} -> ${mb(size(r.path))} (${r.note})`);
    await page.goto(BASE + '/documents/compress-file/');
    await page.setInputFiles('.cmp-input', OUT + 'report.docx');
    check(await page.isVisible('input[name=cmp-method][value=zip]'), 'docx: user can choose ZIP instead');
    const rels = strFromU8(out['word/_rels/document.xml.rels'] ?? new Uint8Array());
    check(!out['word/media/image1.png'] || !('word/media/image1.jpeg' in out), 'docx: picture renamed cleanly');
  }

  // 4. CSV packs into a ZIP that unpacks to the identical file.
  {
    const r = await runTool(page, OUT + 'sales.csv', null);
    check(!r.error && r.name === 'sales.zip', `csv: packed as ${r.name}`);
    const out = unzipSync(readFileSync(r.path));
    check(Buffer.from(out['sales.csv']).equals(readFileSync(OUT + 'sales.csv')), 'csv: unzips to the identical file');
    check(size(r.path) < size(OUT + 'sales.csv') * 0.3, `csv: ${mb(size(OUT + 'sales.csv'))} -> ${mb(size(r.path))}`);
  }

  // 5. Bad inputs show a clear message.
  const enc = await runTool(page, OUT + 'encrypted.pdf', 'recommended');
  check(/password/i.test(enc.error ?? ''), `encrypted PDF: "${enc.error}"`);
  const bad = await runTool(page, OUT + 'not-a-pdf.pdf', 'recommended');
  check(/could not/i.test(bad.error ?? ''), `damaged PDF: "${bad.error}"`);

  // 6. The waiting screen shows a moving ring and bubbles you can pop.
  {
    await page.goto(BASE + '/documents/compress-pdf/');
    await page.setInputFiles('.cmp-input', photoIn);
    await page.check('input[name=cmp-level][value=recommended]');
    await page.click('.cmp-go');
    await page.waitForSelector('.bubble', { timeout: 5000 });
    check(await page.isVisible('.working'), 'waiting screen shows while compressing');
    await page.locator('.bubble').first().dispatchEvent('pointerdown');
    check((await page.textContent('.cmp-pops')) === '1', 'popping a bubble counts it');
    await page.locator('.working').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'waiting.png' });
    await page.waitForSelector('.result:not([hidden])', { timeout: 90000 });
    check((await page.locator('.bubble').count()) === 0, 'bubbles cleared when done');
    await page.screenshot({ path: OUT + 'result.png' });
  }

  // 7. Nothing is uploaded: every request is a GET to this site.
  const offsite = requests.filter((r) => !r.url.startsWith(BASE) && !/^(blob|data):/.test(r.url));
  check(offsite.length === 0, `no requests leave the site (${offsite.map((r) => r.url).join(', ') || 'none'})`);
  check(requests.every((r) => r.method === 'GET'), `no uploads: ${requests.length} requests, all GET`);

  // 8. Works offline once the page has loaded.
  await page.goto(`${BASE}/documents/compress-file/`);
  await page.waitForTimeout(2500);
  await ctx.setOffline(true);
  for (const f of ['photo.pdf', 'report.docx', 'sales.csv']) {
    await page.click('.cmp-clear').catch(() => {});
    await page.setInputFiles('.cmp-input', OUT + f);
    await page.click('.cmp-go');
    await page.waitForSelector('.result:not([hidden]), .cmp-error:not([hidden])', { timeout: 90000 });
    check(await page.isVisible('.result'), `offline: ${f} still works`);
    await page.click('.cmp-again');
  }
  await ctx.setOffline(false);

  check(pageErrors.length === 0, `no page or CSP errors ${pageErrors.join(' | ')}`);

  // 9. Phone: 50 MB limit, layout fits.
  const phoneCtx = await browser.newContext({ ...require('playwright').devices['iPhone 13'], acceptDownloads: true });
  const phone = await phoneCtx.newPage();
  await phone.goto(BASE + '/documents/compress-file/');
  check((await phone.textContent('.cmp-limit')) === '50 MB', `phone limit shown: ${await phone.textContent('.cmp-limit')}`);
  writeFileSync(OUT + 'big.csv', Buffer.alloc(51 * 1024 * 1024, 65));
  await phone.setInputFiles('.cmp-input', OUT + 'big.csv');
  check(/limit is 50/.test(await phone.textContent('.cmp-error')), 'phone: 51 MB file gets a clear limit message');
  for (const path of ['/', '/documents/compress-file/', '/documents/compress-office/', '/privacy/', '/terms/', '/stats/', '/contact/']) {
    await phone.goto(BASE + path);
    const sw = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(sw <= 390, `${path} fits a phone (scrollWidth ${sw})`);
  }
  await phone.goto(BASE + '/documents/compress-file/');
  await phone.setInputFiles('.cmp-input', OUT + 'report.docx');
  await phone.screenshot({ path: OUT + 'phone-ready.png' });
  const desk = await ctx.newPage();
  await desk.goto(`${BASE}/documents/compress-file/`);
  check((await desk.textContent('.cmp-limit')) === '200 MB', `desktop limit shown: ${await desk.textContent('.cmp-limit')}`);
  await browser.close();
} finally {
  server.kill();
}
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
