// End-to-end test for fibub tools. Builds nothing: run `npm run build` first.
// Usage: npm test            (uses the Playwright that is installed on the machine)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, statSync } from 'node:fs';
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
    const r = await runTool(page, photoIn, level, { url: '/documents/compress-file/' });
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
    const p = await runTool(page, OUT + 'photo.png', 'smallest', { url: '/documents/compress-file/' });
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
    await page.goto(BASE + '/documents/compress-file/');
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

  // 6b. Image resizer: crop, rotate, resize, convert, size limit.
  {
    await page.goto(BASE + '/documents/image-resizer/');
    await page.waitForSelector('input[name=rz-format]', { state: 'attached' });
    await page.setInputFiles('.rz-input', OUT + 'photo.png'); // 3000 x 2000
    await page.waitForSelector('.rz-editor:not([hidden])');
    check((await page.inputValue('.rz-w')) === '3000' && (await page.inputValue('.rz-hgt')) === '2000', 'resizer: starts at the full 3000 × 2000');
    // Drag the bottom-right corner up and left by a quarter of the shown picture.
    await page.setViewportSize({ width: 1100, height: 1400 });
    await page.locator('.rz-stage').scrollIntoViewIfNeeded();
    const box = await page.locator('.rz-canvas').boundingBox();
    const h = await page.locator('.rz-h[data-h=se]').boundingBox();
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down();
    await page.mouse.move(h.x + h.width / 2 - box.width / 4, h.y + h.height / 2 - box.height / 4, { steps: 5 });
    await page.mouse.up();
    const cw = +(await page.inputValue('.rz-w')), chh = +(await page.inputValue('.rz-hgt'));
    check(Math.abs(cw - 2250) < 40 && Math.abs(chh - 1500) < 40, `resizer: dragging a corner crops to ${cw} × ${chh}`);
    // Square crop, rotate, then resize to 50%.
    await page.selectOption('.rz-aspect', '1');
    await page.click('[data-act=rotr]');
    await page.selectOption('.rz-aspect', '1');
    check((await page.inputValue('.rz-w')) === (await page.inputValue('.rz-hgt')), `resizer: square crop ${await page.inputValue('.rz-w')} × ${await page.inputValue('.rz-hgt')}`);
    await page.click('.rz-chip[data-pct="50"]');
    await page.check('input[name=rz-format][value="image/jpeg"]');
    await page.click('.rz-go');
    await page.waitForSelector('.rz-result:not([hidden]), .rz-error:not([hidden])');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.rz-download')]);
    await dl.saveAs(OUT + 'resized.jpg');
    const d = jpegSize(readFileSync(OUT + 'resized.jpg'));
    check(dl.suggestedFilename() === 'photo-resized.jpg' && d[0] === 1000 && d[1] === 1000, `resizer: PNG to JPG, square 50% = ${d.join(' × ')} (${dl.suggestedFilename()})`);
    // Exact size and a 60 KB limit.
    await page.selectOption('.rz-aspect', 'free');
    await page.fill('.rz-w', '1600');
    await page.check('.rz-target-on');
    await page.fill('.rz-target', '60');
    await page.click('.rz-go');
    await page.waitForSelector('.rz-result:not([hidden]), .rz-error:not([hidden])', { timeout: 60000 });
    const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('.rz-download')]);
    await dl2.saveAs(OUT + 'resized-60k.jpg');
    check(statSync(OUT + 'resized-60k.jpg').size <= 60 * 1024, `resizer: under 60 KB (${statSync(OUT + 'resized-60k.jpg').size} bytes, ${jpegSize(readFileSync(OUT + 'resized-60k.jpg')).join(' × ')})`);
    // Passport preset gives exact print pixels.
    await page.uncheck('.rz-target-on');
    await page.selectOption('.rz-aspect', { label: 'Photo 2 × 2 in (US, India OCI)' });
    await page.click('.rz-go');
    await page.waitForSelector('.rz-result:not([hidden])');
    const [dl3] = await Promise.all([page.waitForEvent('download'), page.click('.rz-download')]);
    await dl3.saveAs(OUT + 'passport.jpg');
    check(jpegSize(readFileSync(OUT + 'passport.jpg')).join('x') === '600x600', `resizer: 2 × 2 in preset = ${jpegSize(readFileSync(OUT + 'passport.jpg')).join(' × ')}`);
    // JPG to PNG and WebP.
    await page.click('.rz-new');
    await page.setInputFiles('.rz-input', OUT + 'photo.jpg');
    await page.waitForFunction(() => document.querySelector('.rz-name').textContent === 'photo.jpg');
    for (const [mime, ext] of [['image/png', 'png'], ['image/webp', 'webp']]) {
      await page.check(`input[name=rz-format][value="${mime}"]`);
      await page.click('.rz-chip[data-pct="25"]');
      await page.click('.rz-go');
      await page.waitForSelector('.rz-result:not([hidden])');
      const [x] = await Promise.all([page.waitForEvent('download'), page.click('.rz-download')]);
      const buf = readFileSync(await x.path());
      const ok = ext === 'png' ? buf.subarray(1, 4).toString() === 'PNG' : buf.subarray(8, 12).toString() === 'WEBP';
      check(ok && x.suggestedFilename() === `photo-resized.${ext}`, `resizer: JPG to ${ext.toUpperCase()} (${x.suggestedFilename()})`);
    }
    await page.setViewportSize({ width: 1100, height: 1400 });
    await page.locator('.rz-stage').scrollIntoViewIfNeeded();
    await page.screenshot({ path: OUT + 'resizer.png', fullPage: false });
    await page.setViewportSize({ width: 1280, height: 720 });
  }

  // 6d. Upload-limit switch.
  async function fit(fileName, kb) {
    await page.goto(BASE + '/documents/compress-file/');
    await page.setInputFiles('.cmp-input', OUT + fileName);
    await page.locator('.switch').click();
    await page.fill('.cmp-fit-kb', String(kb));
    await page.click('.cmp-go');
    await page.waitForSelector('.result:not([hidden]), .cmp-error:not([hidden])', { timeout: 180000 });
    if (await page.isVisible('.cmp-error')) return { error: await page.textContent('.cmp-error') };
    let offer = null;
    if (await page.isVisible('.cmp-loss')) {
      // No-loss floor is above the limit: note the offer, check its download, then go below anyway.
      const [d0] = await Promise.all([page.waitForEvent('download'), page.click('.cmp-download')]);
      offer = { note: await page.textContent('.cmp-note'), size: size(await d0.path()) };
      await page.click('.cmp-below');
      await page.waitForSelector('.result:not([hidden]), .cmp-error:not([hidden])', { timeout: 180000 });
      if (await page.isVisible('.cmp-error')) return { offer, error: await page.textContent('.cmp-error') };
    }
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.cmp-download')]);
    const path = OUT + `fit-${kb}-${dl.suggestedFilename()}`;
    await dl.saveAs(path);
    return { path, offer, note: await page.textContent('.cmp-note') };
  }
  {
    const r = await fit('photo.pdf', 200);
    check(r.path && size(r.path) <= 200 * 1024, `fit: 26 MB PDF under 200 KB -> ${r.path && (size(r.path) / 1024).toFixed(0)} KB (${r.note ?? r.error})`);
    check(r.path && (await PDFDocument.load(readFileSync(r.path))).getPageCount() === 3, 'fit: PDF keeps its 3 pages');
    check(r.offer && /without visible quality loss/.test(r.offer.note) && r.offer.size > 200 * 1024, `fit: PDF offers the no-loss size first -> "${(r.offer?.note ?? '').trim()}" (${r.offer && (r.offer.size / 1024).toFixed(0)} KB)`);
    const i = await fit('photo.png', 100);
    check(i.path && size(i.path) <= 100 * 1024, `fit: 13 MB PNG under 100 KB -> ${i.path && (size(i.path) / 1024).toFixed(0)} KB (${i.note ?? i.error})`);
    check(!i.offer && /quality 60%/.test(i.note), `fit: PNG reaches 100 KB without visible loss, so no offer is needed -> ${i.note}`);
    const i2 = await fit('photo.png', 40);
    check(i2.offer && i2.offer.size > 40 * 1024 && i2.path && size(i2.path) <= 40 * 1024, `fit: PNG to 40 KB offers the no-loss size (${i2.offer && (i2.offer.size / 1024).toFixed(0)} KB) then goes below -> ${i2.path && (size(i2.path) / 1024).toFixed(0)} KB`);
    const t = await fit('text.pdf', 100);
    check(/already under/.test(t.note ?? ''), `fit: small file already fits -> "${(t.note ?? t.error).trim()}"`);
    const tiny = await fit('photo.pdf', 10);
    check(/lowest quality/.test(tiny.error ?? '') || (tiny.path && size(tiny.path) <= 10240), `fit: impossible limit is explained -> "${(tiny.error ?? 'fitted').trim().slice(0, 90)}"`);
  }

  // 6e. Link cleaner.
  {
    await page.goto(BASE + '/everyday/link-cleaner/');
    await page.fill('.lc-in', 'Look: https://www.amazon.ca/Mug/dp/B0ABCDEFGH/ref=sr_1_3?crid=X&qid=1&tag=me-20 and https://www.google.com/url?q=https%3A%2F%2Fnews.site%2Fa%3Futm_source%3Dx%26p%3D2&ved=1 and https://github.com/a/b?ref=main.');
    const out = await page.inputValue('.lc-out');
    check(out === 'Look: https://www.amazon.ca/dp/B0ABCDEFGH and https://news.site/a?p=2 and https://github.com/a/b?ref=main.', `link cleaner: message cleaned -> ${out}`);
    await page.uncheck('.lc-aff');
    check((await page.inputValue('.lc-out')).includes('tag=me-20'), 'link cleaner: affiliate switch off keeps the tag');
    await page.fill('.lc-in', 'https://bit.ly/3abc');
    check(await page.isVisible('.lc-note'), 'link cleaner: short links are flagged');
  }

  // 6f. LinkedIn post formatter.
  {
    await page.goto(BASE + '/everyday/linkedin-post-formatter/');
    await page.fill('.lf-in', 'Big news today');
    await page.evaluate(() => { const t = document.querySelector('.lf-in'); t.setSelectionRange(0, 3); });
    await page.click('[data-do=bold]');
    const v = await page.inputValue('.lf-in');
    check(v === '𝗕𝗶𝗴 news today', `post formatter: bold selection -> ${v}`);
    await page.fill('.lf-in', '**Hi** there\n- one\n- two');
    await page.click('[data-do=markdown]');
    const m = await page.inputValue('.lf-in');
    check(m === '𝗛𝗶 there\n• one\n• two', `post formatter: from Markdown -> ${JSON.stringify(m)}`);
    await page.fill('.lf-in', 'x'.repeat(400));
    check(await page.isVisible('.lf-more'), 'post formatter: preview folds at "see more"');
  }

  // 6h. Prompt pruner.
  {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
    for (let i = 1; i <= 5; i++) {
      const pg = doc.addPage([595, 842]);
      pg.drawText('ACME Quarterly Report 2026 - Confidential', { x: 50, y: 800, size: 9, font });
      if (i === 1) pg.drawText('Revenue overview', { x: 50, y: 740, size: 22, font: bold });
      const words = ['north', 'south', 'east', 'west', 'online', 'outlet', 'airport', 'campus'];
      for (let l = 0; l < 20; l++) pg.drawText(`${words[(l + i) % 8]} region note ${l}-${i}: ${'sales grew '.repeat(1 + ((l * 7 + i) % 4))}thanks to new stores.`, { x: 50, y: 700 - l * 16, size: 11, font });
      pg.drawText(`Page ${i} of 5`, { x: 270, y: 40, size: 9, font });
      pg.drawText('(c) 2026 ACME Corp. All rights reserved.', { x: 50, y: 25, size: 8, font });
    }
    writeFileSync(OUT + 'report.pdf', await doc.save());
    await page.goto(BASE + '/documents/prompt-pruner/');
    await page.setInputFiles('.pp-input', OUT + 'report.pdf');
    await page.waitForSelector('.pp-result:not([hidden]), .pp-error:not([hidden])', { timeout: 60000 });
    const md = await page.inputValue('.pp-out');
    check(md.includes('# Revenue overview') && md.includes('note 19-5') && md.includes('note 0-1'), 'prompt pruner: PDF heading and body kept');
    check(!/ACME Quarterly|Page \d of 5|All rights reserved/.test(md), 'prompt pruner: headers, page numbers and copyright removed');
    check(/\d+%/.test(await page.textContent('.pp-saved')) && (await page.textContent('.pp-saved')) !== '0%', `prompt pruner: tokens saved ${await page.textContent('.pp-saved')}`);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.pp-dl')]);
    check(dl.suggestedFilename() === 'report-clean.md', `prompt pruner: download ${dl.suggestedFilename()}`);
    writeFileSync(OUT + 'repo.zip', zipSync({
      'proj-main/src/app.js': strToU8('/*\n * Copyright 2026 Someone\n * Licensed under the MIT License\n */\n\nexport const add = (a, b) => a + b;   \n\n\n\n// helper\nexport const sub = (a, b) => a - b;\n'),
      'proj-main/node_modules/x/index.js': strToU8('module.exports = 1;'),
      'proj-main/package-lock.json': strToU8('{}'),
      'proj-main/LICENSE': strToU8('MIT License ...'),
      'proj-main/README.md': strToU8('# Proj\n\nDoes maths.\n'),
    }));
    await page.click('.pp-again');
    await page.setInputFiles('.pp-input', OUT + 'repo.zip');
    await page.waitForSelector('.pp-result:not([hidden])');
    const r = await page.inputValue('.pp-out');
    check(r.includes('### src/app.js') && r.includes('export const add') && !r.includes('Licensed under') && !r.includes('node_modules') && !r.includes('package-lock') && r.includes('// helper'), 'prompt pruner: code ZIP keeps code, drops licence, dependencies and lock files');
    await page.check('[data-opt=comments]');
    await page.waitForFunction(() => !document.querySelector('.pp-out').value.includes('// helper'));
    check(true, 'prompt pruner: "All code comments" removes comments');
  }

  // 6i. File converter.
  {
    const conv = async (files, to) => {
      await page.goto(BASE + '/documents/file-converter/');
      await page.setInputFiles('.fc-input', files.map((f) => OUT + f));
      await page.waitForSelector('.fc-picked:not([hidden])');
      await page.locator('.fc-chips label', { hasText: to }).first().click();
      await page.click('.fc-go');
      await page.waitForSelector('.fc-result:not([hidden]), .fc-error:not([hidden])', { timeout: 60000 });
      if (await page.isVisible('.fc-error')) return { error: await page.textContent('.fc-error') };
      const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fc-dl')]);
      const path = OUT + 'conv-' + d.suggestedFilename();
      await d.saveAs(path);
      return { path, name: d.suggestedFilename() };
    };
    writeFileSync(OUT + 'people.csv', 'name,age,zip,note\nAsha,31,01234,"likes, commas"\nBen,40,90210,"said ""hi"""\n');
    const x = await conv(['people.csv'], 'Excel');
    check(x.name === 'people.xlsx', `converter: CSV to Excel -> ${x.name ?? x.error}`);
    const back = await conv(['conv-people.xlsx'], 'CSV');
    const csv = back.path ? readFileSync(back.path, 'utf8').replace(/^﻿/, '') : back.error;
    check(csv === 'name,age,zip,note\r\nAsha,31,01234,"likes, commas"\r\nBen,40,90210,"said ""hi"""\r\n', `converter: Excel back to CSV is identical -> ${JSON.stringify(csv)}`);
    const j = await conv(['people.csv'], 'JSON');
    const data = JSON.parse(readFileSync(j.path, 'utf8'));
    check(data[0].age === 31 && data[0].zip === '01234' && data[1].note === 'said "hi"', 'converter: CSV to JSON keeps numbers and leading zeros');
    const pics = await conv(['photo.jpg', 'photo.png'], 'PDF');
    check(pics.name === 'pictures.pdf' && (await PDFDocument.load(readFileSync(pics.path))).getPageCount() === 2, `converter: 2 pictures to one 2-page PDF -> ${pics.name ?? pics.error}`);
    const pages = await conv(['report.pdf'], 'PNG');
    check(pages.name === 'report-png.zip' && Object.keys(unzipSync(readFileSync(pages.path))).length === 5, `converter: 5-page PDF to PNG ZIP -> ${pages.name ?? pages.error}`);
    const txt = await conv(['report.pdf'], 'Text');
    check(txt.path && readFileSync(txt.path, 'utf8').includes('Revenue overview'), 'converter: PDF to text');
    const html = await conv(['report.docx'], 'HTML');
    check(html.path && /<html/.test(readFileSync(html.path, 'utf8')), `converter: Word to HTML -> ${html.name ?? html.error}`);
    const png = await conv(['photo.jpg'], 'PNG');
    check(png.name === 'photo.png', `converter: JPG to PNG -> ${png.name ?? png.error}`);
  }

  // 6g. Share images and icons: every live tool has its own 1200x630 image.
  {
    const pngSize = (f) => { const b = readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
    for (const path of ['/', '/documents/compress-file/', '/documents/image-resizer/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/']) {
      await page.goto(BASE + path);
      const og = await page.getAttribute('meta[property="og:image"]', 'content');
      const file = 'dist' + new URL(og).pathname;
      const ok = existsSync(file) && pngSize(file).join('x') === '1200x630';
      check(ok, `share image for ${path}: ${new URL(og).pathname}${ok ? '' : ' missing or wrong size (run npm run images)'}`);
    }
    for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest']) check(existsSync('dist/' + f), `icon file ${f}`);
  }

  // 6c. ZIP checker and hand-off to the compressor.
  {
    writeFileSync(OUT + 'stored.zip', zipSync({ 'sales.csv': [new Uint8Array(readFileSync(OUT + 'sales.csv')), { level: 0 }], 'photo.jpg': [new Uint8Array(readFileSync(OUT + 'photo.jpg')), { level: 0 }] }));
    writeFileSync(OUT + 'tight.zip', zipSync({ 'sales.csv': new Uint8Array(readFileSync(OUT + 'sales.csv')) }, { level: 9 }));
    const locked = Buffer.from(readFileSync(OUT + 'tight.zip'));
    const cd = locked.lastIndexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02])); locked[cd + 8] |= 1; // mark as encrypted
    writeFileSync(OUT + 'locked.zip', locked);

    await page.goto(BASE + '/documents/zip-checker/');
    await page.setInputFiles('.zc-input', OUT + 'tight.zip');
    await page.waitForSelector('.zc-report:not([hidden])');
    check(/Already as small/.test(await page.textContent('.zc-verdict')), `zip checker: tight ZIP -> "${(await page.textContent('.zc-verdict b')).trim()}"`);
    await page.click('.zc-again');
    await page.setInputFiles('.zc-input', OUT + 'locked.zip');
    await page.waitForSelector('.zc-report:not([hidden])');
    check(/Password-protected/.test(await page.textContent('.zc-verdict')), 'zip checker: locked ZIP is reported as locked');
    await page.click('.zc-again');
    await page.setInputFiles('.zc-input', OUT + 'stored.zip');
    await page.waitForSelector('.zc-report:not([hidden])');
    check(/Can be \d+% smaller/.test(await page.textContent('.zc-verdict')), `zip checker: stored ZIP -> "${(await page.textContent('.zc-verdict b')).trim()}"`);
    check(/could shrink/.test(await page.textContent('.zc-table')), 'zip checker: flags the uncompressed CSV');
    await page.setViewportSize({ width: 1100, height: 1300 });
    await page.screenshot({ path: OUT + 'zip-checker.png' });
    await page.setViewportSize({ width: 1280, height: 720 });
    await Promise.all([page.waitForURL('**/documents/compress-file/'), page.click('.zc-actions .btn')]);
    await page.waitForSelector('.file:not([hidden])');
    check((await page.textContent('.cmp-name')) === 'stored.zip', 'hand-off: compressor opens the same ZIP without uploading');
    await page.click('.cmp-go');
    await page.waitForSelector('.result:not([hidden])', { timeout: 60000 });
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.cmp-download')]);
    await dl.saveAs(OUT + 'repacked.zip');
    const out = unzipSync(readFileSync(OUT + 'repacked.zip'));
    check(Buffer.from(out['sales.csv']).equals(readFileSync(OUT + 'sales.csv')) && Buffer.from(out['photo.jpg']).equals(readFileSync(OUT + 'photo.jpg')), 'repack: files inside are byte-identical');
    check(size(OUT + 'repacked.zip') < size(OUT + 'stored.zip') * 0.8, `repack: ${mb(size(OUT + 'stored.zip'))} -> ${mb(size(OUT + 'repacked.zip'))}`);
    const r = await runTool(page, OUT + 'locked.zip', null);
    check(/could not be opened/i.test(r.error ?? ''), 'repack: locked ZIP refused, not damaged');
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
  // The other tools marked "Works offline" too.
  await page.goto(`${BASE}/documents/image-resizer/`);
  await page.waitForTimeout(2500);
  await ctx.setOffline(true);
  await page.setInputFiles('.rz-input', OUT + 'photo.jpg');
  await page.waitForSelector('.rz-editor:not([hidden])');
  await page.click('.rz-go');
  await page.waitForSelector('.rz-result:not([hidden]), .rz-error:not([hidden])');
  const [odl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click('.rz-download')]).catch(() => [null]);
  check(!!odl, 'offline: image resizer still works');
  await ctx.setOffline(false);
  await page.goto(`${BASE}/documents/zip-checker/`);
  await page.waitForTimeout(2500);
  await ctx.setOffline(true);
  await page.setInputFiles('.zc-input', OUT + 'stored.zip');
  await page.waitForSelector('.zc-report:not([hidden])', { timeout: 60000 });
  check(/smaller/.test(await page.textContent('.zc-report')), 'offline: ZIP checker still works');
  await ctx.setOffline(false);
  // Home search filters the tools.
  await page.goto(BASE + '/');
  await page.fill('.search input', 'zip');
  const shown = await page.$$eval('.tc', (els) => els.filter((e) => e.offsetParent !== null).map((e) => e.querySelector('b').textContent));
  check(shown.includes('ZIP checker') && !shown.includes('Image resizer'), `home search "zip" -> ${shown.join(', ')}`);
  await page.fill('.search input', 'qqqq');
  check(await page.isVisible('.empty'), 'home search: no match shows a suggestion link');
  for (const path of ['/', '/documents/compress-file/']) {
    await page.goto(BASE + path);
    const n = await page.$$eval('[data-works]', (els) => els.length);
    check(n > 0, `${path} shows offline/online labels (${n})`);
  }

  check(pageErrors.length === 0, `no page or CSP errors ${pageErrors.join(' | ')}`);

  // 9. Phone: 50 MB limit, layout fits.
  const phoneCtx = await browser.newContext({ ...require('playwright').devices['iPhone 13'], acceptDownloads: true });
  const phone = await phoneCtx.newPage();
  await phone.goto(BASE + '/documents/compress-file/');
  check((await phone.textContent('.cmp-limit')) === '50 MB', `phone limit shown: ${await phone.textContent('.cmp-limit')}`);
  writeFileSync(OUT + 'big.csv', Buffer.alloc(51 * 1024 * 1024, 65));
  await phone.setInputFiles('.cmp-input', OUT + 'big.csv');
  check(/limit is 50/.test(await phone.textContent('.cmp-error')), 'phone: 51 MB file gets a clear limit message');
  for (const path of ['/', '/documents/image-resizer/', '/documents/compress-file/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/', '/privacy/', '/terms/', '/stats/', '/contact/']) {
    await phone.goto(BASE + path);
    const sw = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(sw <= 390, `${path} fits a phone (scrollWidth ${sw})`);
  }
  // The picture of each tool's steps stays on one row, even on a 320 px screen.
  await phone.setViewportSize({ width: 320, height: 640 });
  for (const path of ['/documents/compress-file/', '/documents/image-resizer/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/']) {
    await phone.goto(BASE + path);
    const rows = await phone.$$eval('.flow-step', (els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    const sw = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(rows === 1 && sw <= 320, `${path} step picture: one row at 320 px (rows ${rows}, scrollWidth ${sw})`);
  }
  await phone.setViewportSize({ width: 390, height: 664 });
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
