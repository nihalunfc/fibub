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

  // 6j. ATS resume checker.
  {
    const x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
    const para = (t) => `<w:p><w:r><w:t xml:space="preserve">${t.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</w:t></w:r></w:p>`;
    const docx = (body) => zipSync({
      '[Content_Types].xml': strToU8(x + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'),
      'word/document.xml': strToU8(x + `<w:document ${W}><w:body>${body}</w:body></w:document>`),
    });
    const resume = [
      'Asha Rao', 'asha.rao@example.com | +1 416 555 0100 | linkedin.com/in/asharao', 'Toronto, ON', '',
      'Summary', 'Data analyst with 4 years of experience turning sales and operations data into clear Power BI dashboards and SQL reports.', '',
      'Experience', 'Data Analyst, Northwind Retail', 'Jan 2023 – Present',
      ...['Built 12 Power BI dashboards used by 40 store managers every week, replacing manual Excel reports.', 'Reduced monthly reporting time by 60% by automating SQL extracts and data cleaning in Python.', 'Analysed basket data for 2 million transactions to find cross-sell pairs worth $300K a year.', 'Led stakeholder reporting for the regional operations team of 8 people.', 'Designed a star schema data model for sales, stock and staffing data.'].map((b) => '• ' + b),
      'Junior Analyst, Contoso Logistics', 'Jun 2020 – Dec 2022',
      ...['Created weekly KPI reports for delivery times across 30 depots.', 'Improved data quality checks, cutting duplicate shipment records by 25%.', 'Maintained SQL Server views and documented 50 business definitions.', 'Supported the migration of 3 legacy reports to Power BI.'].map((b) => '• ' + b), '',
      'Education', 'Master of Data Analytics, Example University, 2020', 'BSc Statistics, Example College, 2018', '',
      'Skills', 'SQL, Power BI, DAX, Python, pandas, Excel, data modelling, ETL, stakeholder reporting, A/B testing', '',
      'Projects', ...['Forecast hotel room demand with a seasonal model and a Power BI what-if page; error fell to 6%.', 'Cleaned and joined 5 public datasets into a tidy warehouse with dbt-style SQL steps.'].map((b) => '• ' + b),
      'Certifications', 'Microsoft PL-300 Power BI Data Analyst, 2024',
      'Additional', 'Comfortable presenting findings to non-technical leaders, writing clear documentation, and training colleagues on dashboards and self-serve reporting. Volunteer data mentor for a local coding club, 2 hours a week, helping beginners learn spreadsheets, SQL basics and simple charts. Fluent in English, Hindi and Tamil.',
    ];
    writeFileSync(OUT + 'resume-good.docx', docx(resume.map(para).join('')));
    const table = `<w:tbl><w:tr><w:tc>${resume.slice(0, 12).map(para).join('')}</w:tc><w:tc>${resume.slice(12).map(para).join('')}</w:tc></w:tr></w:tbl>`;
    writeFileSync(OUT + 'resume-table.docx', docx(table + `<w:p><w:r><w:pict><v:shape xmlns:v="urn:schemas-microsoft-com:vml"><v:textbox><w:txbxContent>${para('Hire me')}</w:txbxContent></v:textbox></v:shape></w:pict></w:r></w:p>`));
    // A two-column PDF: left column skills, right column experience, on the same lines.
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pg = doc.addPage([612, 792]);
    const plain = resume.map((l) => l.replace('•', '-').replace('–', '-'));
    for (let i = 0; i < 26; i++) {
      pg.drawText(['SQL', 'Power BI', 'Python', 'Excel', 'DAX', 'ETL', 'pandas', 'dbt'][i % 8] + ' expert level', { x: 40, y: 740 - i * 26, size: 9, font });
      if (plain[i]) pg.drawText(plain[i].slice(0, 70), { x: 250, y: 740 - i * 26, size: 9, font });
      if (plain[i + 26]) pg.drawText(plain[i + 26].slice(0, 70), { x: 250, y: 740 - i * 26 - 12, size: 9, font });
    }
    writeFileSync(OUT + 'resume-2col.pdf', await doc.save());
    writeFileSync(OUT + 'resume.doc', 'old');

    const ats = async (file, jd) => {
      await page.goto(BASE + '/documents/ats-resume-checker/');
      if (jd) { await page.click('.ats-jdbox summary'); await page.fill('.ats-jd', jd); }
      await page.setInputFiles('.ats-input', OUT + file);
      await page.waitForSelector('.ats-result:not([hidden]), .ats-error:not([hidden])', { timeout: 60000 });
      if (await page.isVisible('.ats-error')) return { error: await page.textContent('.ats-error') };
      const fails = await page.$$eval('.ats-checks li.fail b, .ats-checks li.warn b', (b) => b.map((e) => e.textContent));
      return { score: +(await page.textContent('.ats-score')), fails, chips: await page.$$eval('.ats-chips span', (s) => s.map((e) => e.textContent)) };
    };
    const good = await ats('resume-good.docx', 'We need a Data Analyst skilled in SQL and Power BI. Power BI dashboards, SQL reporting, stakeholder reporting and Python are key. Experience with Snowflake and Snowflake data sharing is a plus.');
    check(good.score >= 85, `ATS: clean Word resume scores ${good.score} (fixes: ${good.fails?.join(', ') || 'none'})`);
    check(good.chips?.some((c) => c.includes('✓') && c.includes('power bi')) && good.chips?.some((c) => c.includes('✕') && c.includes('snowflake')), `ATS: job ad keywords matched and missing -> ${good.chips?.join(' ')}`);
    const tbl = await ats('resume-table.docx');
    check(tbl.fails?.includes('No tables for layout') && tbl.fails?.includes('No text boxes') && tbl.score < 75, `ATS: Word tables and text boxes flagged (${tbl.score})`);
    const two = await ats('resume-2col.pdf');
    check(two.fails?.includes('Single-column layout'), `ATS: two-column PDF flagged (${two.score}; ${two.error ?? two.fails?.join(', ')})`);
    const old = await ats('resume.doc');
    check(/\.docx or PDF/.test(old.error ?? ''), 'ATS: old .doc file asks to save as .docx or PDF');
  }

  // 6k. Weekly and monthly planner.
  {
    await page.goto(BASE + '/everyday/planner/');
    await page.evaluate(() => localStorage.removeItem('fibub-planner-v1'));
    await page.reload();
    for (const t of ['Gym 7am mon', 'Client call 10-11am tue', 'Groceries sat', 'Movie night 8pm sat', 'Late shift 9-11pm thu']) { await page.fill('.pl-quick-in', t); await page.press('.pl-quick-in', 'Enter'); }
    const days = await page.$$eval('.pl-day', (d) => d.map((x) => [x.querySelector('.pl-dh b').textContent, [...x.querySelectorAll('.pl-it')].map((i) => i.textContent.trim())]));
    const on = (d) => days.find(([n]) => n.startsWith(d))?.[1] ?? [];
    check(on('Mon').some((t) => /7:00.*Gym/i.test(t)) && on('Tue').some((t) => /10:00.*11:00.*Client call/i.test(t)), `planner: quick add reads day and time -> ${JSON.stringify(days.filter(([, i]) => i.length))}`);
    check(on('Sat').length === 2 && /Groceries/.test(on('Sat')[0]) && /8:00.*Movie night/i.test(on('Sat')[1]), 'planner: several plans a day, untimed first then by time');
    check(on('Thu').some((t) => /9:00\s*pm.*11:00\s*pm|21:00.*23:00/i.test(t)), `planner: "9-11pm" is an evening range -> ${on('Thu')}`);
    await page.locator('.pl-day', { hasText: 'Gym' }).locator('.pl-it', { hasText: 'Gym' }).click();
    await page.fill('.pl-form [name=text]', 'Gym and swim');
    await page.click('.pl-form button[value=save]');
    check(await page.locator('.pl-it', { hasText: 'Gym and swim' }).waitFor({ timeout: 3000 }).then(() => true, () => false), 'planner: edit a plan');
    await page.locator('.pl-it', { hasText: 'Groceries' }).locator('.pl-tick').click();
    check(await page.locator('.pl-it.done', { hasText: 'Groceries' }).count() === 1, 'planner: tick a plan as done');
    await page.reload();
    check(await page.locator('.pl-it', { hasText: 'Movie night' }).count() === 1, 'planner: plans are still there after reload (kept in this browser)');
    const [png] = await Promise.all([page.waitForEvent('download'), page.click('.pl-png')]);
    await png.saveAs(OUT + 'week.png');
    const pb = readFileSync(OUT + 'week.png');
    check(/^week-\d{4}-\d{2}-\d{2}\.png$/.test(png.suggestedFilename()) && pb.readUInt32BE(16) === 2339 && pb.readUInt32BE(20) === 1654, `planner: week image ${png.suggestedFilename()} ${pb.readUInt32BE(16)}x${pb.readUInt32BE(20)}`);
    await page.click('[data-view=month]');
    check(await page.locator('.pl-cell i', { hasText: 'Movie night' }).count() === 1, 'planner: month view shows plans');
    const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.pl-pdf')]);
    await pdf.saveAs(OUT + 'month.pdf');
    const pd = await PDFDocument.load(readFileSync(OUT + 'month.pdf'));
    check(pd.getPageCount() === 1 && Math.round(pd.getPage(0).getWidth()) === 842, `planner: month PDF is one A4 landscape page (${pdf.suggestedFilename()})`);
    await page.click('[data-view=week]');
  }

  // 6l. Loan payoff planner (50 lakh at 8.5% for 20 years: EMI 43,391).
  {
    const lp = await browser.newContext({ locale: 'en-IN' }).then((c) => c.newPage());
    await lp.goto(BASE + '/money/loan-payoff-planner/');
    const base = await lp.textContent('.ln-base');
    check(/43,391/.test(base) && /54,13,8\d\d/.test(base), `loan: EMI and total interest -> ${base}`);
    const row = lp.locator('.ln-presets tr', { hasText: '1 extra payment every year' });
    const cells = await row.locator('td').allTextContents();
    check(/10,2\d,\d{3}/.test(cells[2]) && cells[3] === '3 years 3 months', `loan: one extra EMI a year saves ~10.2 lakh and 3 years 3 months -> ${cells.join(' | ')}`);
    await row.locator('button').click();
    check((await lp.textContent('.ln-s-time')) === '3 years 3 months', 'loan: "Use" copies a ready-made plan into your plan');
    await lp.click('.ln-addrow');
    const rows = lp.locator('.ln-row');
    await rows.nth(1).locator('.r-amt').fill('2000');
    await rows.nth(1).locator('.r-freq').selectOption('1');
    const more = await lp.textContent('.ln-s-int');
    check(/₹1[1-9],\d\d,\d{3}/.test(more), `loan: mixing a yearly and a monthly prepayment saves more -> ${more}`);
    await lp.check('[name=ln-mode][value=emi]');
    check((await lp.textContent('.ln-s-time-l')) === 'New monthly payment' && /₹/.test(await lp.textContent('.ln-s-time')), `loan: "Lower my EMI" shows the new EMI -> ${await lp.textContent('.ln-s-time')}`);
    await lp.fill('.ln-once', '100000');
    check(/save ₹4,1\d,\d{3} in interest/.test(await lp.textContent('.ln-what-out')), `loan: one-time what-if -> ${await lp.textContent('.ln-what-out')}`);
    check((await lp.$$('.ln-ybody tr')).length === 20, 'loan: year-by-year table has 20 years');
    await lp.fill('[data-k=pay]', '30000');
    check(!(await lp.isHidden('.ln-err')) && /never end/.test(await lp.textContent('.ln-err')), 'loan: a payment below the interest is flagged');
    await lp.context().close();
  }

  // 6m. Budget planner.
  {
    const bp = await browser.newContext({ locale: 'en-CA' }).then((c) => c.newPage());
    await bp.goto(BASE + '/money/budget-calculator/');
    const amts = [1200, 900, 400, 250, 300, 80, 0, 150];
    const inputs = await bp.$$('.p-lines .l-amt');
    for (let i = 0; i < inputs.length; i++) if (amts[i]) await inputs[i].fill(String(amts[i]));
    await bp.fill('.p-saved', '500');
    const ry = new Date(); ry.setMonth(ry.getMonth() + 12);
    await bp.fill('.p-date', `${ry.getFullYear()}-${String(ry.getMonth() + 1).padStart(2, '0')}`);
    check((await bp.textContent('.p-total')) === '$3,608' && (await bp.textContent('.p-month')) === '$259', `budget: trip total with 10% extra and monthly saving -> ${await bp.textContent('.p-total')} ${await bp.textContent('.p-month')}`);
    await bp.fill('.p-can', '400');
    check(/8 months/.test(await bp.textContent('.p-ready')), `budget: "I can save" gives the ready date -> ${await bp.textContent('.p-ready')}`);
    await bp.click('[data-tab=month]');
    await bp.click('.m-example');
    check((await bp.textContent('.m-exp')) === '$3,313' && (await bp.textContent('.m-left')) === '$887', `budget: monthly in/out with weekly and yearly costs -> ${await bp.textContent('.m-exp')} ${await bp.textContent('.m-left')}`);
    check(/Set aside each month\$392/.test(await bp.textContent('.m-yearly')), 'budget: yearly bills turned into a monthly set-aside');
    check(/\$135 a month, \$1,620 a year/.test(await bp.textContent('.m-cutout')), 'budget: trimming wants by 20%');
    check(/After 5 years\$67,758/.test(await bp.textContent('.m-grow')), `budget: savings growth -> ${await bp.textContent('.m-grow')}`);
    await bp.reload();
    check((await bp.inputValue('.m-out .l-amt')) === '', 'budget: nothing is remembered unless you tick the box');
    await bp.click('[data-tab=month]'); await bp.click('.m-example'); await bp.check('.bg-remember');
    await bp.reload();
    check((await bp.inputValue('.m-out .l-amt')) === '1,500', 'budget: "Remember my numbers" keeps them on this device');
    await bp.uncheck('.bg-remember');
    check(await bp.evaluate(() => localStorage.getItem('fibub-budget-v1')) === null, 'budget: unticking deletes them');
    await bp.context().close();
  }

  // 6n. ATS resume builder: build from the form, then read the downloads back with the ATS checker.
  {
    const rp = await ctx.newPage();
    rp.on('dialog', (d) => d.accept());
    await rp.goto(BASE + '/documents/resume-builder/');
    await rp.fill('[data-p="name"]', 'Sam Lee');
    await rp.fill('[data-p="email"]', 'sam@example.com');
    await rp.fill('[data-p="experience.0.title"]', 'Store Supervisor');
    await rp.fill('[data-p="experience.0.company"]', 'Corner Mart');
    await rp.fill('[data-p="experience.0.start"]', '2022-03');
    await rp.check('[data-p="experience.0.current"]');
    await rp.fill('[data-p="experience.0.bullets"]', 'Led a team of 6\nCut stock losses by 15%');
    await rp.waitForTimeout(300);
    const doc = await rp.textContent('.rb-doc');
    check(/Sam Lee/.test(doc) && /Store Supervisor, Corner Mart/.test(doc) && /Mar 2022 – Present/.test(doc) && /Cut stock losses by 15%/.test(doc), 'resume builder: preview follows the form (title, employer, dates, bullets)');
    await rp.reload();
    check((await rp.inputValue('[data-p="name"]')) === 'Sam Lee', 'resume builder: draft survives a reload in the same tab');
    await rp.click('.rb-example');
    await rp.waitForTimeout(300);
    const sc = +(await rp.textContent('.rb-sc'));
    check(sc >= 90, `resume builder: example scores ${sc} live`);
    await rp.click('.rb-jd summary');
    await rp.fill('.rb-jdt', 'Data Analyst with SQL, Power BI and Tableau. Tableau dashboards and SQL reporting.');
    check(await rp.locator('.rb-kw .miss', { hasText: 'tableau' }).count() === 1, 'resume builder: job ad shows missing keywords');
    const [pdf] = await Promise.all([rp.waitForEvent('download'), rp.click('.rb-pdf')]);
    await pdf.saveAs(OUT + 'built-resume.pdf');
    const [docx] = await Promise.all([rp.waitForEvent('download'), rp.click('.rb-docx')]);
    await docx.saveAs(OUT + 'built-resume.docx');
    check(pdf.suggestedFilename() === 'Alex-Morgan-Resume.pdf' && docx.suggestedFilename() === 'Alex-Morgan-Resume.docx', `resume builder: file names ${pdf.suggestedFilename()}, ${docx.suggestedFilename()}`);
    const files = unzipSync(readFileSync(OUT + 'built-resume.docx'));
    const xml = strFromU8(files['word/document.xml']);
    check(!/<w:tbl|txbxContent|<w:drawing|<w:hdr/.test(xml) && /Heading1/.test(xml) && /<w:numPr>/.test(xml) && !files['word/header1.xml'], 'resume builder: Word file has real headings and bullets, no tables, text boxes, pictures or page headers');
    for (const f of ['built-resume.pdf', 'built-resume.docx']) {
      await rp.goto(BASE + '/documents/ats-resume-checker/');
      await rp.setInputFiles('.ats-input', OUT + f);
      await rp.waitForSelector('.ats-result:not([hidden]), .ats-error:not([hidden])', { timeout: 60000 });
      const s = +(await rp.textContent('.ats-score'));
      const bad = await rp.$$eval('.ats-checks li.fail b', (b) => b.map((e) => e.textContent));
      check(s >= 90 && !bad.length, `resume builder: the downloaded ${f.split('.').pop().toUpperCase()} scores ${s} in the ATS checker${bad.length ? ' (fails: ' + bad.join(', ') + ')' : ''}`);
    }
    await rp.goto(BASE + '/documents/resume-builder/');
    const [bk] = await Promise.all([rp.waitForEvent('download'), rp.click('.rb-save')]);
    await bk.saveAs(OUT + 'resume-backup.json');
    await rp.click('.rb-reset');
    check((await rp.inputValue('[data-p="name"]')) === '', 'resume builder: start over clears the form');
    await rp.setInputFiles('.rb-file', OUT + 'resume-backup.json');
    await rp.waitForTimeout(200);
    check((await rp.inputValue('[data-p="name"]')) === 'Alex Morgan', 'resume builder: backup file opens again');
    await rp.fill('[data-p="name"]', 'Анна Иванова');
    await rp.waitForTimeout(200);
    await Promise.all([rp.waitForEvent('download'), rp.click('.rb-pdf')]);
    check(await rp.isVisible('.rb-lost') && /Word file keeps them/.test(await rp.textContent('.rb-lost')), 'resume builder: warns when the PDF fonts cannot show some letters');
    await rp.close();
  }

  // 6o. Science shelf: every astronomy tool loads, draws and downloads PNG, PDF and Word.
  {
    const ASTRO = ['/science/sky-tonight/', '/science/object-altitude/', '/science/polar-alignment/', '/science/sky-events-calendar/', '/science/telescope-calculator/', '/science/star-trail-exposure/', '/science/astro-time/', '/science/sky-coordinates/'];
    for (const path of ASTRO) {
      await page.goto(`${BASE}${path}?date=2026-11-07`);
      await page.waitForTimeout(400);
      if (path.includes('sky-coordinates')) { await page.fill('.sc-obj', 'M42'); await page.press('.sc-obj', 'Tab'); await page.waitForTimeout(400); }
      const ok = [];
      for (const f of ['png', 'pdf', 'docx']) {
        const btn = page.locator(`.dl [data-f=${f}]`).first();
        if (!(await btn.count())) continue;
        const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), btn.click()]).catch(() => [null]);
        if (d) { await d.saveAs(OUT + 'astro.' + f); if (size(OUT + 'astro.' + f) > 1000) ok.push(f); }
      }
      check(ok.length === 3, `${path}: downloads ${ok.join(', ')}`);
    }
    // Sky tonight for Toronto on 7 Nov 2026: dark from 18:38.
    await page.goto(`${BASE}/science/sky-tonight/?date=2026-11-07`);
    const zone = await page.$eval('.sp-tz', (el) => el.value);
    check(zone === Intl.DateTimeFormat().resolvedOptions().timeZone || zone === 'UTC', `sky tonight: times start in the visitor's own time zone (${zone})`);
    await page.selectOption('.sp-tz', 'America/Toronto');
    await page.waitForTimeout(300);
    check(/18:3\d/.test(await page.textContent('.ax')), 'sky tonight: switched to Toronto time, dark from about 18:38');
    await page.selectOption('.sp-tz', 'Asia/Tokyo');
    await page.waitForTimeout(300);
    check(/08:3\d/.test(await page.textContent('.ax')), 'sky tonight: in Tokyo time the same Toronto dark starts about 08:38');
    // FITS viewer reads a small 16-bit image with a header.
    const cards = ['SIMPLE  =                    T', 'BITPIX  =                   16', 'NAXIS   =                    2', 'NAXIS1  =                   64', 'NAXIS2  =                   48', "OBJECT  = 'M42     '", 'EXPTIME =                 30.0', "FILTER  = 'Ha      '", 'END'];
    const hdr = Buffer.alloc(2880, ' '); cards.forEach((c, i) => hdr.write(c.padEnd(80), i * 80, 'latin1'));
    const data = Buffer.alloc(2880 * Math.ceil(64 * 48 * 2 / 2880));
    for (let i = 0; i < 64 * 48; i++) data.writeInt16BE(((i * 37) % 2000) + (i % 64 === 32 ? 20000 : 0), i * 2);
    writeFileSync(OUT + 'm42.fits', Buffer.concat([hdr, data]));
    await page.goto(`${BASE}/science/fits-viewer/`);
    await page.setInputFiles('.fv-in', OUT + 'm42.fits');
    await page.waitForTimeout(800);
    check((await page.textContent('.fv-hdr')).includes('EXPTIME'), 'fits viewer: shows the header cards');
    // Observing log: save asks where it goes; "Keep in this tab" lists it.
    await page.goto(`${BASE}/science/observing-log/`);
    await page.fill('input[name=object]', 'M13');
    await page.click('.ol-save');
    check(await page.isVisible('.ol-dlg'), 'observing log: saving asks new file, existing file or keep');
    await page.click('.ol-later');
    check((await page.textContent('.ol-table')).includes('M13'), 'observing log: observation kept in the tab');
    // Observing session: parts can be downloaded together.
    await page.goto(`${BASE}/science/observing-session/?date=2026-11-07`);
    await page.waitForSelector('.os-sec');
    const [sd] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click('[data-all=pdf]')]);
    await sd.saveAs(OUT + 'session.pdf');
    check((await PDFDocument.load(readFileSync(OUT + 'session.pdf'))).getPageCount() >= 2, `observing session: one PDF with ${(await PDFDocument.load(readFileSync(OUT + 'session.pdf'))).getPageCount()} pages`);
  }

  // 6p. Bill calendar: sample data, a new bill, running balance, downloads.
  {
    await page.goto(`${BASE}/money/bill-calendar/`);
    await page.click('.bc-sample');
    check((await page.locator('.bc-day .bc-chip').count()) > 10, 'bill calendar: sample bills fill the month');
    await page.click('.bc-set summary');
    await page.fill('.s-start', '100');
    await page.waitForTimeout(500);
    check(/Lowest balance/.test(await page.textContent('.bc-sum')), 'bill calendar: starting balance gives a lowest balance');
    await page.click('.bc-new');
    await page.fill('input[name=title]', 'Gym');
    await page.fill('input[name=amount]', '40');
    await page.click('button[value=save]');
    check((await page.locator('.bc-chip', { hasText: 'Gym' }).count()) >= 1, 'bill calendar: new bill appears');
    const [bd] = await Promise.all([page.waitForEvent('download'), page.click('.dl [data-f=pdf]')]);
    check(/^bills-\d{4}-\d{2}\.pdf$/.test(bd.suggestedFilename()), `bill calendar: PDF download ${bd.suggestedFilename()}`);
    check(!(await page.evaluate(() => localStorage.getItem('fibub-bills-v1'))), 'bill calendar: nothing kept in the browser unless asked');
    // A backup from the older expense calendar on nihalsulaiman.com restores here.
    const ym = new Date().toISOString().slice(0, 7);
    writeFileSync(OUT + 'old-expenses.json', JSON.stringify({ v: 1, currency: 'CAD', budget: 2000, weekStart: 0, items: [
      { id: 'a1', title: 'Rent', amount: 1450, cat: 'housing', date: `${ym}-01`, time: '', repeat: 'monthly', until: '', note: '', done: { [`${ym}-01`]: 1 }, skip: {} },
      { id: 'a2', title: 'Dentist', amount: 90, cat: 'health', date: `${ym}-09`, time: '', repeat: 'none', until: '', note: 'cleaning', paid: true, done: {}, skip: {} },
    ] }));
    await page.setInputFiles('.s-restore', OUT + 'old-expenses.json');
    await page.waitForTimeout(400);
    const sum = await page.textContent('.bc-sum');
    check(/Restored 2/.test(await page.textContent('.s-msg')) && (sum.match(/1,540/g) || []).length >= 2, `bill calendar: old expense calendar backup restores with paid ticks (${sum.replace(/\s+/g, ' ')})`);
  }

  // 6q. Header drop-downs on a computer, the bookmark dialog and My tools.
  {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/science/sky-tonight/`);
    await page.hover('.dd[data-shelf=science] > a');
    await page.waitForTimeout(300);
    check(await page.isVisible('.dd[data-shelf=science] .dd-panel'), 'header: Science drop-down opens on hover');
    // Light by default; the header switch turns the page dark and is remembered; red light sits next to it.
    check((await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === 'rgb(255, 255, 255)', 'theme: white page by default');
    await page.click('.theme-btn');
    check((await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === 'rgb(0, 0, 0)', 'theme: the switch turns the page black');
    await page.reload();
    check((await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark', 'theme: dark is remembered in this browser');
    await page.click('.red-btn');
    check(await page.evaluate(() => document.documentElement.classList.contains('red-mode')), 'theme: red light switch beside it on astronomy pages');
    await page.click('.red-btn'); await page.click('.theme-btn');
    await page.hover('.dd[data-shelf=science] > a'); await page.waitForTimeout(300);
    await page.hover('.dd-mega .dd-subj >> text=Astronomy'); await page.waitForTimeout(200);
    check(await page.isVisible('.dd-mega .dd-subj[aria-expanded=true]') && await page.isVisible('.dd-mega .dd-pane.on >> text=Sky tonight'), 'header: Science shows subjects, then the chosen subject\'s sections and tools');
    const over = await page.$$eval('.dd-mega .dd-item', (els) => els.some((e) => { const r = e.getBoundingClientRect(), p = e.closest('.dd-group').getBoundingClientRect(); return r.right > p.right + 1; }));
    check(!over, 'header: no tool name runs into the next column');
    await page.click('.bm-btn');
    check(await page.isVisible('.bm-dlg'), 'bookmark: button opens the bookmark dialog');
    await page.check('.bm-pin');
    await page.click('.bm-done');
    const mine = await page.evaluate(() => localStorage.getItem('fibub-mytools-v1') || '');
    check(mine.includes('sky-tonight'), 'bookmark: "pin to My tools" saves only the tool id in this browser');
    await page.goto(BASE + '/');
    check(!!(await page.waitForSelector('.mine:not([hidden])', { timeout: 5000 }).catch(() => null)), 'home: My tools shows the pinned tool');
    // Only my tools: star a second tool, hide the rest, then bring them back.
    await page.click('.dir .ti[data-id=bill-calendar] .pin');
    await page.waitForFunction(() => document.querySelectorAll('.mine-list .ti').length === 2, null, { timeout: 5000 }).catch(() => {});
    check((await page.locator('.mine-list .ti').count()) === 2, 'home: the star adds a tool to My tools');
    await page.click('.focus-btn');
    check(!(await page.isVisible('.dir')) && await page.isVisible('.mine'), 'home: "Show only my tools" hides every other tool');
    await page.reload();
    check(!(await page.isVisible('.dir')), 'home: only-my-tools is remembered in this browser');
    await page.click('.focus-btn');
    check(await page.isVisible('.dir'), 'home: "Show all" brings every tool back');
    await page.evaluate(() => localStorage.removeItem('fibub-focus-v1'));
    await page.evaluate(() => localStorage.removeItem('fibub-mytools-v1'));
    // Every tool has a #number: shown on its page, and "#3" finds exactly that tool.
    await page.fill('.find input', '#3');
    await page.waitForSelector('.hits:not([hidden]) .hits-list .ti');
    const byNum = await page.$$eval('.hits-list .ti .nm', (els) => els.map((e) => e.textContent));
    check(byNum.length === 1 && byNum[0] === 'ZIP checker', `tool numbers: home search "#3" -> ${byNum.join(', ')}`);
    await page.goto(`${BASE}/documents/zip-checker/`);
    check((await page.textContent('.tool-num')) === 'Tool #3', 'tool numbers: the tool page shows Tool #3');
  }

  // 6g. Share images and icons: every live tool has its own 1200x630 image.
  {
    const pngSize = (f) => { const b = readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
    for (const path of ['/', '/documents/compress-file/', '/documents/image-resizer/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/', '/documents/ats-resume-checker/', '/everyday/planner/', '/money/loan-payoff-planner/', '/money/budget-calculator/', '/documents/resume-builder/']) {
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
  await page.fill('.find input', 'zip');
  await page.waitForSelector('.hits-list .ti');
  const shown = await page.$$eval('.hits-list .ti .nm', (els) => els.map((e) => e.textContent));
  check(shown[0] === 'ZIP checker' && !shown.includes('Image resizer'), `home search "zip" -> ${shown.join(', ')}`);
  check(!(await page.isVisible('.dir')), 'home search: the shelf index steps aside while searching');
  await page.fill('.find input', 'sky astronomy');
  await page.waitForTimeout(150);
  const sky = await page.$$eval('.hits-list .ti .nm', (els) => els.map((e) => e.textContent));
  check(sky.length >= 3 && sky[0].startsWith('Sky'), `home search finds tools on every subject page: "sky astronomy" -> ${sky.join(', ')}`);
  await page.fill('.find input', 'qqqq');
  await page.waitForTimeout(150);
  check(await page.isVisible('.empty'), 'home search: no match shows a suggestion link');
  await page.fill('.find input', '');
  await page.waitForTimeout(150);
  check(await page.isVisible('.dir'), 'home search: clearing the box brings the shelves back');
  // Science is grouped by subject: the shelf page lists subjects, each subject has its own page.
  {
    const idx = JSON.parse(await (await fetch(BASE + '/tools.json')).text());
    const nums = idx.map((e) => e.k);
    check(idx.length >= 24 && new Set(nums).size === nums.length && nums.every((n) => n > 0), `search index: ${idx.length} live tools, each with its own #number`);
    await page.goto(BASE + '/science/');
    check(await page.isVisible('.sj-grid a[href="/science/astronomy/"]'), 'science shelf: lists its subjects');
    await page.goto(BASE + '/science/astronomy/');
    const rows = await page.locator('.secs .ti').count();
    check(rows === idx.filter((e) => e.p.startsWith('Science › Astronomy')).length, `subject page: /science/astronomy/ lists all ${rows} astronomy tools`);
    await page.fill('.sp-find input', 'fits header');
    check((await page.$$eval('.secs .ti', (els) => els.filter((e) => !e.hidden).length)) === 1, 'subject page: the filter box narrows the list');
    await page.goto(BASE + '/science/sky-tonight/');
    check((await page.getAttribute('.crumbs a[href="/science/astronomy/"]', 'href')) === '/science/astronomy/', 'tool page: breadcrumb links to its subject page');
    await page.hover('.dd[data-shelf=science] > a'); await page.waitForTimeout(300);
    await page.hover('.dd-mega .dd-subj >> text=Astronomy'); await page.waitForTimeout(200);
    check(await page.isVisible('.dd-pane.on .dd-all') && /All \d+ astronomy/.test(await page.textContent('.dd-pane.on .dd-all')), 'header: each subject links to all its tools');
    const perSec = await page.$$eval('.dd-pane.on .dd-group', (gs) => Math.max(...gs.map((g) => g.querySelectorAll('.dd-item').length)));
    check(perSec <= 3, `header: at most 3 tools per section in the menu (${perSec}), so it stays one screen tall`);
    // Change log: footer link, newest first, 50 to a page; each tool page shows its own changes.
    await page.goto(BASE + '/');
    await Promise.all([page.waitForURL('**/changes/'), page.click('footer a[href="/changes/"]')]);
    const log = JSON.parse(readFileSync('src/data/changelog.json', 'utf8'));
    const shownLog = await page.locator('.cl li').count();
    check(shownLog === Math.min(50, log.length) && shownLog > 0, `change log: footer link opens it, ${shownLog} of ${log.length} changes on page 1`);
    const times = await page.$$eval('.cl time', (els) => els.map((e) => e.getAttribute('datetime')));
    check(times.every((t, i) => i === 0 || t <= times[i - 1]), 'change log: newest first, with times');
    if (log.length > 50) { await page.goto(BASE + '/changes/2/'); check((await page.locator('.cl li').count()) === Math.min(50, log.length - 50), 'change log: page 2 holds the next 50'); }
    await page.goto(BASE + '/science/sky-tonight/');
    check((await page.locator('#changes .cl li').count()) === Math.min(10, log.filter((c) => c.tools.includes('sky-tonight')).length), 'change log: a tool page lists its own changes');
    await page.goto(BASE + '/');
    check(Number((await page.textContent('.total b')).trim()) === JSON.parse(await (await fetch(BASE + '/tools.json')).text()).length, 'home: the number of tools is shown as a figure');
    await page.goto(BASE + '/science/sky-tonight/');
    await page.click('.find-btn');
    await page.keyboard.type('#13');
    await page.waitForSelector('.at-results .ti');
    check((await page.textContent('.at-results .ti .nm')) === 'Sky tonight', 'header search: "#13" from any page finds Sky tonight');
    await page.keyboard.press('Escape');
  }
  for (const path of ['/documents/compress-file/', '/money/bill-calendar/']) {
    await page.goto(BASE + path);
    const n = await page.$$eval('[data-works]', (els) => els.length);
    check(n > 0, `${path} shows offline/online labels (${n})`);
  }

  // Science batch A: each tool against a published worked example, plus its downloads.
  {
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/uncertainty-calculator/');
    await page.waitForFunction(() => /±/.test(document.querySelector('.up-big')?.textContent ?? ''));
    check(/g = 9\.81 ± 0\.14/.test(await page.textContent('.up-big')), `uncertainty: pendulum example gives ${await page.textContent('.up-big')}`);
    check(/9\.6\d\d to 9\.9\d\d\. This agrees/.test(await page.textContent(".up-mc")), `uncertainty: Monte Carlo check agrees (${(await page.textContent('.up-mc')).slice(0, 80)})`);
    await page.selectOption('.up-ex', '1');
    await page.waitForFunction(() => /^R = /.test(document.querySelector('.up-big')?.textContent ?? ''));
    check(/R = 25\.00 ± 0\.16/.test(await page.textContent('.up-big')), `uncertainty: Ohm's law example ${await page.textContent('.up-big')}`);
    await page.fill('.up-f', 'R = V / (I');
    await page.waitForSelector('.up-ferr:not([hidden])');
    check(true, 'uncertainty: a broken formula shows a plain message');

    await page.goto(BASE + '/science/calibration-curve/');
    await page.waitForSelector('.cc-out:not([hidden])');
    check(/1\.930/.test(await page.textContent('.cc-eq')) && /1\.518/.test(await page.textContent('.cc-eq')), `calibration: Miller & Miller line ${await page.textContent('.cc-eq')}`);
    const cc = await page.$$eval('.cc-tab tbody tr', (rs) => rs.map((r) => r.textContent));
    check(cc.length === 3 && /0\.71[56]/.test(cc[0]) && /6\.2[01]/.test(cc[1]) && /11\.1[23]/.test(cc[2]), `calibration: unknowns read back as in the book (${cc.join(" | ")})`);
    check(/LOD/i.test(cc[0]), 'calibration: sample below the LOD is flagged');
    const ccPdf = await dl(page, '.dl [data-f=pdf]');
    check((await PDFDocument.load(readFileSync(ccPdf))).getPageCount() >= 1, 'calibration: PDF report downloads');

    await page.goto(BASE + '/science/dose-response/');
    await page.waitForSelector('.dr-out:not([hidden])');
    check(/IC50 = 3\.058/.test(await page.textContent('.dr-big')), `dose-response: ryegrass IC50 matches drc (${await page.textContent('.dr-big')})`);
    check(/−2\.98/.test(await page.textContent('.dr-facts')), 'dose-response: Hill slope −2.98');
    await page.fill('.dr-unk', 'S1: 4.0 4.2\nS2: 9');
    await page.waitForFunction(() => document.querySelectorAll('.dr-tab tbody tr').length === 2);
    const dr = await page.$$eval('.dr-tab tbody tr', (rs) => rs.map((r) => r.textContent));
    check(/OK/.test(dr[0]) && /Outside the curve/.test(dr[1]), 'dose-response: samples read off the curve, one above the top is flagged');
    const drDoc = await dl(page, '.dl [data-f=docx]');
    check(/word\/document\.xml/.test(Object.keys(unzipSync(readFileSync(drDoc))).join()), 'dose-response: Word report downloads');

    // Graph digitiser: a drawn plot with a red line y = x/10 and three blue markers.
    await page.goto(BASE + '/science/graph-digitizer/');
    const png = await page.evaluate(() => {
      const c = document.createElement('canvas'); c.width = 400; c.height = 300; const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, 400, 300); g.strokeStyle = '#000'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(50.5, 20); g.lineTo(50.5, 250.5); g.lineTo(380, 250.5); g.stroke();
      g.strokeStyle = '#d00000'; g.lineWidth = 3; g.beginPath(); g.moveTo(50, 250); g.lineTo(350, 50); g.stroke();
      g.fillStyle = '#0050c0'; for (const [x, y] of [[30, 5], [60, 2], [75, 7]]) { g.beginPath(); g.arc(50 + 3 * x, 250 - 20 * y, 4, 0, 7); g.fill(); }
      return c.toDataURL('image/png').split(',')[1];
    });
    writeFileSync(OUT + 'plot.png', Buffer.from(png, 'base64'));
    await page.setInputFiles('.gd-file', OUT + 'plot.png');
    await page.waitForSelector('.gd-work:not([hidden])');
    const at = async (x, y) => { const b = await page.locator('.gd-cv').boundingBox(); await page.locator('.gd-cv').click({ position: { x: (x * b.width) / 400, y: (y * b.height) / 300 } }); };
    // x: 20 at pixel 110, 80 at 290. y: 2 at pixel 210, 8 at 90.
    await at(110, 250); await at(290, 250); await at(50, 210); await at(50, 90);
    for (const [k, v] of [['x1', '20'], ['x2', '80'], ['y1', '2'], ['y2', '8']]) await page.fill(`.gd-v[data-k=${k}]`, v);
    await page.click('.gd-steps [data-mode=points]');
    await at(200, 150);
    const row = await page.$$eval('.gd-tab tbody td', (t) => t.map((c) => c.textContent));
    check(Math.abs(Number(row[1]) - 50) < 0.6 && Math.abs(Number(row[2]) - 5) < 0.1, `digitiser: a click at (50, 5) reads ${row[1]}, ${row[2]}`);
    await page.click('.gd-undo');
    await page.click('.gd-steps [data-mode=auto]');
    await at(200, 150);
    await page.click('.gd-run');
    const line = await page.$$eval('.gd-tab tbody tr', (rs) => rs.map((r) => [...r.cells].slice(1, 3).map((c) => Number(c.textContent))));
    const worst = Math.max(...line.map(([x, y]) => Math.abs(y - x / 10)));
    check(line.length > 40 && worst < 0.1, `digitiser: line traced by colour, ${line.length} points, worst error ${worst.toFixed(3)} (y units)`);
    await page.click('.gd-add');
    await page.click('.gd-steps [data-mode=auto]');
    await page.selectOption('.gd-kind', 'markers');
    await at(140, 150);
    await page.click('.gd-run');
    const mk = await page.$$eval('.gd-tab tbody tr', (rs) => rs.map((r) => [...r.cells].slice(1, 3).map((c) => Number(c.textContent))));
    const want = [[30, 5], [60, 2], [75, 7]];
    check(mk.length === 3 && mk.every(([x, y], i) => Math.abs(x - want[i][0]) < 0.4 && Math.abs(y - want[i][1]) < 0.06), `digitiser: markers found at their centres ${JSON.stringify(mk)}`);
    const csvF = await dl(page, '.gd-csv');
    const csvT = readFileSync(csvF, 'utf8').trim().split('\n');
    check(csvT[0].startsWith('series,x,y') && csvT.length === 1 + line.length + 3, `digitiser: CSV holds both series (${csvT.length - 1} rows for ${line.length} + 3 points)`);
    await page.click('.gd-undo');
    check((await page.locator('.gd-tab tbody tr').count()) === 0, 'digitiser: undo removes a whole colour search');
    check(!requests.some((r) => r.method !== 'GET' && r.url.startsWith(BASE)), 'digitiser: the image is never sent anywhere');

    // Plot maker: journal size, vector downloads, PNG with its dpi recorded.
    await page.goto(BASE + '/science/plot-maker/');
    await page.waitForSelector('.pm-out:not([hidden])');
    check((await page.textContent('.pm-size')) === '85 × 64 mm, 8 pt text', `plot maker: single column size ${await page.textContent('.pm-size')}`);
    check((await page.$$eval('.pm-cols select', (s) => s.map((x) => x.value).join())) === 'x,y,err,y,err', 'plot maker: SD columns become error bars');
    const svg = readFileSync(await dl(page, '.pm-out [data-f=svg]'), 'utf8');
    check(/width="85mm"/.test(svg) && /Control/.test(svg) && /Treated/.test(svg) && /Optical density/.test(svg), 'plot maker: SVG is 85 mm wide with labels and legend');
    const pdfDoc = await PDFDocument.load(readFileSync(await dl(page, '.pm-out [data-f=pdf]')));
    const { width: pw, height: ph } = pdfDoc.getPage(0).getSize();
    check(Math.abs(pw - 240.94) < 0.1 && Math.abs(ph - 180.71) < 0.1, `plot maker: PDF page is 85 × 63.75 mm (${pw.toFixed(1)} × ${ph.toFixed(1)} pt)`);
    const pngB = readFileSync(await dl(page, '.pm-out [data-f="300"]'));
    const ihdr = [pngB.readUInt32BE(16), pngB.readUInt32BE(20)], phys = pngB.indexOf('pHYs');
    check(ihdr[0] === 1004 && ihdr[1] === 753 && phys > 0 && pngB.readUInt32BE(phys + 4) === 11811, `plot maker: 300 dpi PNG is ${ihdr.join(' × ')} px with its dpi recorded`);
    await page.selectOption('.pm-cols select[data-i="3"]', 'skip');
    await page.selectOption('.pm-w', '178');
    await page.check('.pm-ylog');
    await page.waitForFunction(() => /^178 ×/.test(document.querySelector('.pm-size')?.textContent ?? ''));
    check(await page.isVisible('.pm-fig'), 'plot maker: double column, log axis, one series left out');
    await page.fill('.pm-data', '1\n2\n3');
    await page.waitForSelector('.pm-err:not([hidden])');
    check(/two columns/.test(await page.textContent('.pm-err')), 'plot maker: one column gives a plain message');
    // Open a file instead of pasting: CSV, an Excel workbook (second sheet has the data), limits.
    check(/up to 10 MB, 20 columns and 50,000 rows/.test(await page.textContent('.pm-limit')), 'plot maker: file limits shown');
    await page.setInputFiles('.pm-in', { name: 'growth.csv', mimeType: 'text/csv', buffer: Buffer.from('Dose,"Response, %",SD\n1,10,1\n2,20,2\n3,35,2\n4,48,3\n') });
    await page.waitForSelector('.pm-file-note:not([hidden])');
    check(/Opened growth\.csv: 5 rows and 3 columns/.test(await page.textContent('.pm-file-note')) && (await page.$$eval('.pm-cols select', (x) => x.map((e) => e.value).join())) === 'x,y,err', 'plot maker: CSV file with a quoted comma');
    {
      const { zipSync, strToU8 } = await import('fflate');
      const sheet = (rows) => `<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows.map((r, i) => `<row r="${i + 1}">${r.map((c, j) => `<c r="${String.fromCharCode(65 + j)}${i + 1}"${typeof c === 'string' ? ' t="inlineStr"><is><t>' + c + '</t></is>' : '><v>' + c + '</v>'}</c>`).join('')}</row>`).join('')}</sheetData></worksheet>`;
      const wide = [Array.from({ length: 24 }, (_, j) => (j ? `S${j}` : 'x')), ...Array.from({ length: 6 }, (_, i) => Array.from({ length: 24 }, (_, j) => (j ? i * j : i)))];
      const xlsx = zipSync({
        '[Content_Types].xml': strToU8('<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>'),
        'xl/workbook.xml': strToU8('<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Notes" sheetId="1" r:id="rId1"/><sheet name="Data" sheetId="2" r:id="rId2"/></sheets></workbook>'),
        'xl/_rels/workbook.xml.rels': strToU8('<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Target="worksheets/sheet2.xml"/></Relationships>'),
        'xl/worksheets/sheet1.xml': strToU8(sheet([])),
        'xl/worksheets/sheet2.xml': strToU8(sheet(wide)),
      });
      await page.setInputFiles('.pm-in', { name: 'wide.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(xlsx) });
      await page.waitForFunction(() => /wide\.xlsx/.test(document.querySelector('.pm-file-note')?.textContent ?? ''));
      const note = await page.textContent('.pm-file-note');
      check(/7 rows and 20 columns/.test(note) && /sheet "Data"/.test(note) && /24 columns; only the first 20/.test(note) && (await page.$$('.pm-cols select')).length === 20, `plot maker: Excel file, sheet and column limit (${note})`);
    }
    await page.setInputFiles('.pm-in', { name: 'big.csv', mimeType: 'text/csv', buffer: Buffer.alloc(10_500_000, 'a') });
    await page.waitForFunction(() => /10\.5 MB/.test(document.querySelector('.pm-err')?.textContent ?? ''));
    check(/up to 10 MB/.test(await page.textContent('.pm-err')), 'plot maker: file size limit explained');
    await page.setInputFiles('.pm-in', { name: 'old.xls', mimeType: 'application/vnd.ms-excel', buffer: Buffer.from('x') });
    await page.waitForFunction(() => /Save it as \.xlsx/.test(document.querySelector('.pm-err')?.textContent ?? ''));
    check(true, 'plot maker: old .xls explained');
  }
  // Science batch B.
  {
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/solution-calculator/');
    check((await page.textContent('.sc-out')) === 'Weigh 7.305 g', `solutions: 0.5 M NaCl in 250 mL (${await page.textContent('.sc-out')})`);
    await page.selectOption('.sc-solve', 'conc'); await page.fill('.sc-m', '9'); await page.selectOption('.sc-cu', 'mg/mL'); await page.fill('.sc-v', '1'); await page.selectOption('.sc-vu', 'L');
    check((await page.textContent('.sc-out')) === '9 mg/mL', `solutions: concentration from mass (${await page.textContent('.sc-out')})`);
    check((await page.textContent('.sc-dout')) === 'Take 5 of stock and add 45 of diluent', `solutions: C1V1 (${await page.textContent('.sc-dout')})`);
    await page.fill('.sc-d[data-k=c2]', '20');
    check(/cannot dilute up/.test(await page.textContent('.sc-derr')), 'solutions: diluting up is refused');
    const ser = await page.$$eval('.sc-tab tbody tr', (rs) => rs.map((r) => r.cells[3].textContent));
    check(ser.length === 6 && ser[5] === '0.001' && /move 100 µL/.test(await page.textContent('.sc-sout')), `solutions: serial plan (${ser.join(', ')})`);

    await page.goto(BASE + '/science/pcr-master-mix/');
    const mm = await page.$$eval('.mm-tab tbody tr, .mm-tab tfoot tr', (rs) => rs.map((r) => [...r.cells].slice(1).map((c) => c.textContent)));
    check(mm.find((r) => /Water/.test(r[0]))?.[1] === '40.75' && mm[mm.length - 1][2] === '539', `master mix: NEB Taq recipe, water 40.75 µL, 539 µL in all`);
    await page.click('.mm-tab tbody tr input');
    check(await page.$eval('.mm-tab tbody tr', (r) => r.classList.contains('done')), 'master mix: a line can be ticked off');
    await page.fill('.mm-n', '96');
    await page.waitForFunction(() => /96 tubes/.test(document.querySelector('.mm-big').textContent));
    check(await page.$eval('.mm-tab tbody tr', (r) => r.classList.contains('done')), 'master mix: ticks stay when the numbers change');
    await page.locator('.mm-row').nth(1).locator('.c-fu').selectOption('X');
    await page.waitForSelector('.mm-err:not([hidden])');
    check(/do not match/.test(await page.textContent('.mm-err')), 'master mix: mismatched units are explained');
    await page.locator('.mm-row').nth(1).locator('.c-fu').selectOption('µM');
    const mmPdf = await dl(page, '.dl [data-f=pdf]');
    check((await PDFDocument.load(readFileSync(mmPdf))).getPageCount() >= 1, 'master mix: printable PDF');

    await page.goto(BASE + '/science/sample-size/');
    check((await page.textContent('.ss-big')) === '64 per group', `sample size: d = 0.5, power 0.8 gives ${await page.textContent('.ss-big')} (R: 63.77)`);
    await page.selectOption('.ss-k', 'prop'); await page.selectOption('.ss-pw', '0.9');
    check((await page.textContent('.ss-big')) === '77 per group', `sample size: 50 % against 75 % (${await page.textContent('.ss-big')})`);
    await page.selectOption('.ss-k', 'survey'); await page.fill('.ss-N', '1000');
    await page.waitForFunction(() => document.querySelector('.ss-big').textContent === '278 responses');
    check(true, 'sample size: survey of 1000 people needs 278');
    await page.selectOption('.ss-k', 'two-sample'); await page.fill('.ss-diff', '0');
    await page.waitForSelector('.ss-err:not([hidden])');
    check(true, 'sample size: a zero difference gives a plain message');

    await page.goto(BASE + '/science/stereonet/');
    check(/8 planes, 3 lines/.test(await page.textContent('.sn-facts')), 'stereonet: reads the sample planes and lines');
    await page.fill('.sn-planes', '030 40\n025 45\n035 38\n028 50\nN30E 40');
    await page.waitForFunction(() => /^Data4 planes/.test(document.querySelector('.sn-facts').textContent));
    const sf = await page.textContent('.sn-facts');
    check(/46\.8° → 299/.test(sf) && /029 \/ 43\.2/.test(sf), `stereonet: mean pole and plane of the bedding (${sf.slice(0, 120)})`);
    check(/line 5/.test(await page.textContent('.sn-err')), 'stereonet: a line it cannot read is named');
    const svgN = readFileSync(await dl(page, '.sn .dl [data-f=svg]'), 'utf8');
    check(/<svg/.test(svgN) && (svgN.match(/<circle/g) || []).length >= 5, 'stereonet: SVG download');
    const polesCsv = readFileSync(await dl(page, '.sn-csv'), 'utf8').trim().split('\n');
    check(polesCsv.length === 5 && polesCsv[1] === '030,40,120,300,50', `stereonet: poles CSV (${polesCsv[1]})`);

    await page.goto(BASE + '/science/psychrometric-calculator/');
    check(/50 % RH, dew point 13\.9 °C/.test(await page.textContent('.ps-big')), `psychrometrics: 25 °C 50 % (${await page.textContent('.ps-big')})`);
    await page.fill('.ps-t', '40'); await page.selectOption('.ps-k', 'tw'); await page.fill('.ps-v', '20');
    await page.waitForFunction(() => /^14 % RH/.test(document.querySelector('.ps-big').textContent));
    const pf = await page.textContent('.ps-facts');
    check(/6\.40\d g\/kg/.test(pf) && /56\.7\d? kJ\/kg/.test(pf), `psychrometrics: ASHRAE example (${pf.slice(0, 160)})`);
    await page.selectOption('.ps-u', 'F');
    check((await page.inputValue('.ps-t')) === '104' && /^14 % RH/.test(await page.textContent('.ps-big')), 'psychrometrics: °F keeps the same air');
    await page.selectOption('.ps-k', 'rh'); await page.fill('.ps-t', '90'); await page.fill('.ps-v', '70');
    await page.waitForFunction(() => /106 °F/.test(document.querySelector('.ps-heat').textContent));
    check(/danger/.test(await page.textContent('.ps-heat')), 'psychrometrics: heat index 106 °F at 90 °F and 70 %');

    await page.goto(BASE + '/science/plate-layout/');
    check((await page.textContent('.pl-big')) === '94 of 94 wells placed on a 96-well plate' && (await page.locator('.pl-plate .pl-w').count()) === 96, `plate: ELISA example fits (${await page.textContent('.pl-big')})`);
    check((await page.getAttribute('.pl-w[data-w=B1]', 'title')) === 'B1: Std1 (replicate 2)', 'plate: replicates sit in a block');
    await page.check('.pl-edge');
    check(await page.isVisible('.pl-err') && /\d+ wells did not fit/.test(await page.textContent('.pl-err')) && /^(5\d|60) of 94/.test(await page.textContent('.pl-big')), `plate: edge wells kept empty (${await page.textContent('.pl-err')})`);
    await page.uncheck('.pl-edge');
    await page.click('.pl-w[data-w=A1]');
    check((await page.getAttribute('.pl-w[data-w=A1]', 'title')) === 'A1: kept empty' && (await page.getAttribute('.pl-w[data-w=A2]', 'title')) === 'A2: Std1 (replicate 1)', 'plate: tapping a well keeps it empty and the layout moves on');
    const plCsv = readFileSync(await dl(page, '.pl-csv'), 'utf8').trim().split('\n');
    check(plCsv.length === 97 && plCsv[1] === 'A1,A,1,Empty (kept),,', `plate: CSV lists all 96 wells (${plCsv[1]})`);
    await page.selectOption('.pl-size', '1536');
    check((await page.locator('.pl-plate .pl-w').count()) === 1536, 'plate: 1536-well plate draws');
  }
  {
    // Batch C: hemocytometer, radiocarbon, SQL playground, biodiversity, reliability.
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/hemocytometer/');
    const cells = page.locator('.hc-tab input');
    const vals = [52, 4, 47, 3, 55, 5, 46, 4];
    for (let i = 0; i < vals.length; i++) await cells.nth(i).fill(String(vals[i]));
    const hcBig = await page.textContent('.hc-big'), hcFacts = await page.textContent('.hc-facts');
    check(/^1 × 10⁶ live/.test(hcBig) && /92\.6 %/.test(hcBig + hcFacts), `hemocytometer: 1.0 × 10⁶ live/mL, 92.6 % (${hcBig} | ${hcFacts.slice(0, 120)})`);
    check(/2\.64 mL/.test(await page.textContent('.hc-seed')) && /10\.56 mL/.test(await page.textContent('.hc-seed') + await page.textContent('.hc-seedsub')), `hemocytometer: seeding 2.64 mL + 10.56 mL (${await page.textContent('.hc-seed')})`);
    await page.click('.hc-reset'); await page.locator('h1').click();
    for (let i = 0; i < 3; i++) await page.keyboard.press('l');
    await page.keyboard.press('d'); await page.keyboard.press('Backspace');
    check((await cells.nth(0).inputValue()) === '3' && (await cells.nth(1).inputValue()) === '0', 'hemocytometer: L tallies a live cell and Backspace undoes');
    await page.keyboard.press('n'); await page.keyboard.press('l');
    check((await cells.nth(2).inputValue()) === '1', 'hemocytometer: N moves to the next square');

    await page.goto(BASE + '/science/radiocarbon-calibration/');
    await page.waitForSelector('.rc-out:not([hidden])');
    const rcT = await page.textContent('.rc-tab');
    check(/1304/.test(rcT) && /1125/.test(rcT) && /1239/.test(rcT), `radiocarbon: 3000 ± 30 calibrates to 1304–1125 BC (${rcT.slice(0, 200)})`);
    await page.selectOption('.rc-f', 'bp');
    check(/cal BP/.test(await page.textContent('.rc-tab')), 'radiocarbon: cal BP switch');

    await page.goto(BASE + '/science/sql-playground/');
    await page.click('.sqp-sample');
    await page.waitForSelector('.sqp-tables code');
    const prof = await page.textContent('.sqp-tables');
    check(/344 rows/.test(prof), `sql: penguins load (${prof.slice(0, 120)})`);
    await page.click('.sqp-run');
    await page.waitForFunction(() => /rows? in/.test(document.querySelector('.sqp-info')?.textContent || ''), null, { timeout: 15000 });
    const res = await page.textContent('.sqp-tab');
    check(/Adelie152/.test(res) && /Gentoo124/.test(res) && /Chinstrap68/.test(res), `sql: GROUP BY species (${res.slice(0, 160)})`);
    await page.fill('.sqp-sql', "SELECT island, sex, COUNT(*) AS n FROM penguins WHERE sex IS NOT NULL GROUP BY island, sex");
    await page.press('.sqp-sql', 'Control+Enter');
    await page.waitForFunction(() => /^6 rows/.test(document.querySelector('.sqp-info')?.textContent || ''), null, { timeout: 15000 });
    check(true, 'sql: Ctrl+Enter runs');
    await page.fill('.sqp-sql', 'SELEC 1');
    await page.click('.sqp-run');
    await page.waitForSelector('.sqp-qerr:not([hidden])');
    check(/syntax error/.test(await page.textContent('.sqp-qerr')), 'sql: errors are shown');
    const sqlCsv = (await (async () => { await page.fill('.sqp-sql', 'SELECT species FROM penguins LIMIT 2'); await page.click('.sqp-run'); await page.waitForFunction(() => /^2 rows/.test(document.querySelector('.sqp-info')?.textContent || '')); return readFileSync(await dl(page, '.sqp-csv'), 'utf8'); })()).trim().split(/\r?\n/);
    check(sqlCsv[0] === 'species' && sqlCsv.length === 3, `sql: CSV download (${sqlCsv.join('|')})`);

    await page.goto(BASE + '/science/biodiversity-indices/');
    const bdT = await page.textContent('.bd-tab');
    check(/Shannon H′1\.5691\.601/.test(bdT.replace(/\s/g, '')) || (/1\.569/.test(bdT) && /1\.601/.test(bdT)), `biodiversity: Shannon (${bdT.slice(0, 200)})`);
    check(/Meadow: 7\.50 ± 0\.62/.test(await page.textContent('.bd-rare')), `biodiversity: rarefied to 66 (${await page.textContent('.bd-rare')})`);
    check(/0\.55/.test(await page.textContent('.bd-cmp')), 'biodiversity: Bray-Curtis');
    await page.fill('.bd-in', 'Species\tA\nx\t1.5');
    await page.waitForSelector('.bd-err:not([hidden])');
    check(/whole numbers/.test(await page.textContent('.bd-err')), 'biodiversity: fractional counts are refused');

    await page.goto(BASE + '/science/reliability-analysis/');
    check((await page.textContent('.rl-big')) === 'α = 0.744', `reliability: alpha with Q4 reversed (${await page.textContent('.rl-big')})`);
    check(/Q5/.test(await page.textContent('.rl-note')) && (await page.locator('.rl-tab td.rl-low').count()) >= 2, 'reliability: Q5 flagged');
    await page.fill('.rl-rev', '');
    await page.waitForFunction(() => document.querySelector('.rl-big')?.textContent !== 'α = 0.744');
    await page.click('.rl-mode button[data-m=cohen]');
    check((await page.textContent('.rl-big')) === 'κ = 0.400' && /70\.0 %/.test(await page.textContent('.rl-facts')), `reliability: Cohen 0.400 (${await page.textContent('.rl-big')})`);
    await page.selectOption('.rl-cform', 'raw');
    await page.fill('.rl-p[data-m=cohen] .rl-in', 'A\tB\nmild\tmild\nmild\tmoderate\nsevere\tsevere\nmoderate\tmoderate\nsevere\tmoderate\nmild\tmild');
    await page.waitForFunction(() => /κ = /.test(document.querySelector('.rl-big')?.textContent || '') && document.querySelectorAll('.rl-tab tbody tr').length === 4);
    check((await page.locator('.rl-tab thead th').count()) === 5, 'reliability: raw ratings become a 3 × 3 table');
    await page.click('.rl-mode button[data-m=fleiss]');
    check((await page.textContent('.rl-big')) === 'κ = 0.210', `reliability: Fleiss 0.210 (${await page.textContent('.rl-big')})`);
    await page.click('.rl-mode button[data-m=icc]');
    const iccT = await page.textContent('.rl-tab');
    check((await page.textContent('.rl-big')) === 'ICC(2,1) = 0.290' && /0\.019 to 0\.761/.test(iccT) && /0\.909/.test(iccT), `reliability: Shrout and Fleiss ICCs (${await page.textContent('.rl-big')})`);
    await page.fill('.rl-p[data-m=icc] .rl-in', '1\t2\nx\t3\n4\t5');
    await page.waitForSelector('.rl-err:not([hidden])');
    check(/"x" in row 2 is not a number/.test(await page.textContent('.rl-err')), 'reliability: text in scores is reported');
  }
  {
    // Batch D: astronomy.
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/cosmology-calculator/');
    check((await page.textContent('.cz-big')) === 'Light left 11.643 billion years ago', `cosmology: Planck z = 3 (${await page.textContent('.cz-big')})`);
    const czF = await page.textContent('.cz-facts');
    check(/13\.786 Gyr/.test(czF) && /7\.883 kpc per arcsecond/.test(czF) && /26,015 Mpc/.test(czF), `cosmology: ages and distances (${czF.slice(0, 200)})`);
    await page.selectOption('.cz-pre', 'round'); await page.fill('.cz-z', '0');
    check(/^The universe is 13\.4\d+ billion years old$/.test(await page.textContent('.cz-big')), `cosmology: H0 70 age (${await page.textContent('.cz-big')})`);
    await page.uncheck('.cz-flat'); await page.fill('.cz-ol', '2'); await page.fill('.cz-z', '5');
    await page.waitForSelector('.cz-err:not([hidden])');
    check(/no Big Bang/.test(await page.textContent('.cz-err')), 'cosmology: impossible universe explained');

    await page.goto(BASE + '/science/sub-exposure-calculator/');
    check((await page.textContent('.sx-big')) === 'At least 8 s per sub', `sub-exposure: test frame example (${await page.textContent('.sx-big')})`);
    check(/99\.4 % efficient/.test(await page.textContent('.sx-facts')), 'sub-exposure: test frame efficiency');
    await page.click('.sx-mode button[data-m=sqm]');
    check(/^At least 17 s per sub$/.test(await page.textContent('.sx-big')), `sub-exposure: SQM estimate (${await page.textContent('.sx-big')})`);
    await page.selectOption('.sx-band', '7');
    check(/min per sub$/.test(await page.textContent('.sx-big')), `sub-exposure: narrowband needs minutes (${await page.textContent('.sx-big')})`);
    await page.click('.sx-mode button[data-m=frame]'); await page.fill('.sx-bg', '300');
    check(await page.isVisible('.sx-err') && /above the offset/.test(await page.textContent('.sx-err')), 'sub-exposure: background below offset is explained');

    await page.goto(BASE + '/science/backfocus-calculator/');
    check((await page.textContent('.bf-big')) === 'Add 9.17 mm of spacers', `backfocus: gap (${await page.textContent('.bf-big')})`);
    const bfF = await page.textContent('.bf-facts');
    check(/5 \+ 2 \+ 2 \+ 0\.2 = 9\.2 mm/.test(bfF) && /long by 0\.03 mm/.test(bfF), `backfocus: stack (${bfF})`);
    check((await page.locator('.bf-stack li').count()) === 9, 'backfocus: stack listed front to back');
    await page.fill('.bf-need', '40');
    check(/more than the/.test(await page.textContent('.bf-err')), 'backfocus: too many parts explained');

    await page.goto(BASE + '/science/magnitude-flux-converter/');
    const mfT = await page.textContent('.mf-tab');
    check(/mJy57\.627/.test(mfT) && /magnitude \(AB\)11\.999/.test(mfT), `magnitudes: V = 12 (${mfT.slice(0, 200)})`);
    await page.selectOption('.mf-b', 'g');
    check((await page.inputValue('.mf-u')) === 'ab' && !/Vega\)/.test(await page.textContent('.mf-tab')), 'magnitudes: AB-only band switches to AB');
    await page.selectOption('.mf-b', 'custom'); await page.selectOption('.mf-u', 'Jy'); await page.fill('.mf-v', '3631');
    check(/magnitude \(AB\)0\.000/.test(await page.textContent('.mf-tab')), 'magnitudes: 3631 Jy is AB 0');

    await page.goto(BASE + '/science/dark-sky-calendar/?year=2027');
    await page.waitForSelector('.dk-out:not([hidden])', { timeout: 30000 });
    check(/^1,5\d\d hours of Moon-free darkness in 2027$/.test(await page.textContent('.dk-big')), `dark sky: Toronto 2027 (${await page.textContent('.dk-big')})`);
    check((await page.locator('.dk-tab tbody tr').count()) === 13, 'dark sky: twelve months and a total');
    const dkCsv = readFileSync(await dl(page, '.dk-csv'), 'utf8').trim().split(/\r?\n/);
    check(dkCsv.length === 366 && dkCsv[0].startsWith('evening,astronomical_dusk'), `dark sky: CSV has every night (${dkCsv.length})`);
    await page.click('.dk-next');
    await page.waitForFunction(() => /in 2028$/.test(document.querySelector('.dk-big')?.textContent || ''), null, { timeout: 30000 });
    check(true, 'dark sky: next year');
  }
  {
    // Batch E: spaceflight, periods, mosaics, meteors.
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/rocket-equation/');
    check((await page.textContent('.re-big')) === '11.03 km/s in total', `rocket: two-stage example (${await page.textContent('.re-big')})`);
    check(/1,627 m\/s to spare/.test(await page.textContent('.re-facts')), 'rocket: margin against LEO');
    await page.fill('.re-pl', '60000');
    check(/short/.test(await page.textContent('.re-facts')) && /more propellant/.test(await page.textContent('.re-facts')), 'rocket: heavy payload falls short');
    await page.fill('.re-in', 'Stage 1\t1000\tx\t300');
    check(/Line 1 needs/.test(await page.textContent('.re-err')), 'rocket: bad line explained');

    await page.goto(BASE + '/science/orbit-transfer-calculator/');
    check((await page.textContent('.ot-big')) === '3.893 km/s in two burns, 5.28 h apart', `orbit: LEO to GEO (${await page.textContent('.ot-big')})`);
    await page.selectOption('.ot-body', 'sun');
    await page.click('.ot-quick button:has-text("Earth to Mars")');
    const otF = await page.textContent('.ot-facts');
    check(/2\.94\d km\/s/.test(otF) && /258\.\d days|259\.\d days/.test(otF) && /44\.\d°/.test(otF), `orbit: Earth to Mars (${otF.slice(0, 220)})`);
    await page.fill('.ot-rb', '10');
    check(/Bi-elliptic instead/.test(await page.textContent('.ot-facts')), 'orbit: bi-elliptic comparison');

    await page.goto(BASE + '/science/period-finder/');
    await page.waitForSelector('.lsq-out:not([hidden])');
    check((await page.textContent('.lsq-big')) === 'Best period 0.567126', `period: example star (${await page.textContent('.lsq-big')})`);
    await page.click('.lsq-tab tbody tr:nth-child(2)');
    check(/lsq-on/.test(await page.getAttribute('.lsq-tab tbody tr:nth-child(2)', 'class')), 'period: tap a peak to fold');
    await page.fill('.lsq-in', '1 2\n2 3');
    await page.waitForSelector('.lsq-errmsg:not([hidden])');
    check(/at least 5/.test(await page.textContent('.lsq-errmsg')), 'period: too few points explained');

    await page.goto(BASE + '/science/mosaic-planner/');
    check((await page.textContent('.mo-big')) === '2 × 1 = 2 panels', `mosaic: M31 (${await page.textContent('.mo-big')})`);
    check(/00h 46m 25\.9s/.test(await page.textContent('.mo-tab')), 'mosaic: panel 1 centre');
    const moCsv = readFileSync(await dl(page, '.mo-csv'), 'utf8').trim().split(/\r?\n/);
    check(moCsv.length === 3 && moCsv[0].startsWith('panel,row,column,ra_deg'), 'mosaic: CSV');
    await page.fill('.mo-t', 'M42');
    await page.waitForFunction(() => /05 35/.test(document.querySelector('.mo-ra')?.value || ''));
    check(true, 'mosaic: picking an object fills its position');

    await page.goto(BASE + '/science/meteor-shower-planner/?shower=perseids');
    check(/^Up to about \d+ meteors an hour, around \d\d:\d\d$/.test(await page.textContent('.ms-big')), `meteors: Perseids (${await page.textContent('.ms-big')})`);
    check((await page.locator('.ms-year tbody tr').count()) === 11 && (await page.locator('.ms-nights tbody tr').count()) === 5, 'meteors: year and nights tables');
    const before = await page.textContent('.ms-big');
    await page.selectOption('.ms-lm', '3');
    check((await page.textContent('.ms-big')) !== before, 'meteors: a city sky lowers the rate');
  }
  {
    // Batch F: sky brightness, habitable zones, Mars time, transits, redshift.
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/light-pollution-calculator/');
    check((await page.textContent('.lp-title')) === 'Bortle class 4: Rural to suburban transition' && (await page.textContent('.lp-big')) === '20.80 mag/arcsec², stars to magnitude 6.0', `light pollution: SQM 20.8 (${await page.textContent('.lp-big')})`);
    check(/0\.517 mcd\/m²/.test(await page.textContent('.lp-facts')) && /197 %/.test(await page.textContent('.lp-facts')), 'light pollution: luminance and artificial share');
    await page.fill('.lp-ref', '21.6');
    check(/2\.09 times brighter here/.test(await page.textContent('.lp-facts')), 'light pollution: compared with a darker site');
    await page.fill('.lp-v', '20.9 21.0 21.1');
    check(/average of 3 readings/.test(await page.textContent('.lp-facts')) && /^21\.00 /.test(await page.textContent('.lp-big')), 'light pollution: several readings averaged');
    await page.selectOption('.lp-kind', 'bortle'); await page.fill('.lp-v', '2');
    check((await page.textContent('.lp-title')).startsWith('Bortle class 2'), 'light pollution: from a Bortle class');
    await page.selectOption('.lp-kind', 'sqm'); await page.fill('.lp-v', '30');
    check(/run from about 16/.test(await page.textContent('.lp-err')), 'light pollution: impossible reading explained');

    await page.goto(BASE + '/science/habitable-zone-calculator/');
    check((await page.textContent('.hz-big')) === 'Inside the conservative habitable zone' && /254 K \(−19 °C\)/.test(await page.textContent('.hz-facts')) && /0\.951 to 1\.677 AU/.test(await page.textContent('.hz-facts')), 'habitable zone: Earth');
    await page.selectOption('.hz-pl', 'venus');
    check((await page.textContent('.hz-big')) === 'Too close to the star for liquid water', 'habitable zone: Venus too close');
    await page.selectOption('.hz-pl', 'proxb');
    check((await page.textContent('.hz-big')) === 'Inside the conservative habitable zone' && /0\.659 times/.test(await page.textContent('.hz-facts')) && /11\.2 days/.test(await page.textContent('.hz-facts')), 'habitable zone: Proxima b');
    await page.selectOption('.hz-pl', 't1e');
    check(/extrapolated/.test(await page.textContent('.hz-facts')), 'habitable zone: TRAPPIST-1 flagged outside the fit');
    await page.selectOption('.hz-pl', 'earth'); await page.fill('.hz-p', '687');
    check(/1\.52\d AU/.test(await page.textContent('.hz-facts')), 'habitable zone: distance from the period');

    await page.goto(BASE + '/science/mars-time/?site=curiosity&sol=1000');
    check(/^Sol 1,000, 1[12]:\d\d local mean solar time$/.test(await page.textContent('.mt-big')) && /May 30, 2015/.test(await page.textContent('.mt-facts')), `mars time: Curiosity sol 1000 (${await page.textContent('.mt-big')})`);
    await page.click('.mt-mode button[data-m=earth]');
    await page.fill('.mt-dt', '2000-01-06T00:00');
    check(/44795\.9997\d/.test(await page.textContent('.mt-facts')) && /Ls 277\.19°, Mars Year 24/.test(await page.textContent('.mt-facts')), 'mars time: Allison and McEwen example');
    await page.click('.mt-mode button[data-m=now]');
    check(/^Sol [\d,]+, \d\d:\d\d local mean solar time$/.test(await page.textContent('.mt-big')) && (await page.locator('.mt-tab tbody tr').count()) === 7, 'mars time: live clock and the year table');

    await page.goto(BASE + '/science/transit-planner/');
    check(/^HD 189733 b from /.test(await page.textContent('.tp-title')) && /transits? in the next 60 days$/.test(await page.textContent('.tp-big')), `transits: HD 189733 b (${await page.textContent('.tp-big')})`);
    const visible = await page.locator('.tp-tab tbody tr').count();
    await page.check('.tp-all');
    check((await page.locator('.tp-tab tbody tr').count()) >= 26 && (await page.locator('.tp-tab tbody tr').count()) > visible, 'transits: every transit listed on request');
    await page.click('.tp-tab tbody tr:nth-child(3)');
    check(/tp-on/.test(await page.getAttribute('.tp-tab tbody tr:nth-child(3)', 'class')) && /^Night of /.test(await page.textContent('.tp-nh')), 'transits: tap a row to plot that night');
    const tpCsv = readFileSync(await dl(page, '.tp-csv'), 'utf8').trim().split(/\r?\n/);
    check(tpCsv.length >= 27 && tpCsv[0].startsWith('epoch,ingress_utc,mid_utc'), 'transits: CSV');
    await page.fill('.tp-p', '');
    check(/period in days/.test(await page.textContent('.tp-err')), 'transits: missing period explained');

    await page.goto(BASE + '/science/redshift-calculator/');
    check((await page.textContent('.rz-big')) === 'z = 0.05' && /14,615 km\/s/.test(await page.textContent('.rz-facts')) && /14,276 km\/s/.test(await page.textContent('.rz-facts')), 'redshift: z = 0.05');
    await page.selectOption('.rz-kind', 'lam');
    check((await page.textContent('.rz-big')) === 'z = 0.0500075' && /rz-on/.test(await page.getAttribute('.rz-tab tbody tr:nth-child(11)', 'class')), `redshift: from Hα (${await page.textContent('.rz-big')})`);
    await page.selectOption('.rz-kind', 'freq');
    check((await page.textContent('.rz-big')) === 'z = 0.0521524', `redshift: from the 21 cm line (${await page.textContent('.rz-big')})`);
    await page.selectOption('.rz-kind', 'v'); await page.fill('.rz-v', '300000');
    check(/below the speed of light/.test(await page.textContent('.rz-err')), 'redshift: faster than light explained');
  }
  {
    // Batch G: blackbody, exoplanet mass, impact craters, link budgets, radio telescopes.
    await page.goto(BASE + '/science/blackbody-calculator/');
    check((await page.textContent('.bb-big')) === 'Peak at 502 nm; it looks white with a hint of yellow' && /bolometric 4\.74, visual 4\.82/.test(await page.textContent('.bb-facts')), 'blackbody: the Sun');
    await page.selectOption('.bb-pre', 'sirius');
    check(/V = −1\.44/.test(await page.textContent('.bb-facts')) && /25\.7\d* Suns/.test(await page.textContent('.bb-facts')), 'blackbody: Sirius from Earth');
    await page.selectOption('.bb-kind', 'bv');
    check(/5,778 K/.test(await page.textContent('.bb-facts')), 'blackbody: temperature from B − V');
    await page.fill('.bb-cmp', '3000');
    check(await page.isVisible('.bb-fig'), 'blackbody: compare two spectra');
    await page.fill('.bb-v', '9');
    check(/B − V runs/.test(await page.textContent('.bb-err')), 'blackbody: impossible colour explained');

    await page.goto(BASE + '/science/exoplanet-mass-calculator/');
    check((await page.textContent('.rv-big')) === 'm sin i = 0.477 Jupiter masses (152 Earths)' && /0\.05301 AU/.test(await page.textContent('.rv-facts')), 'exoplanet mass: 51 Peg b');
    await page.selectOption('.rv-pre', 'jupiter');
    check(/1\.33 g\/cm³/.test(await page.textContent('.rv-facts')), 'exoplanet mass: Jupiter density from a transit');
    await page.click('.rv-mode button[data-m=k]');
    await page.selectOption('.rv-pre', 'earth');
    check((await page.textContent('.rv-big')) === 'K = 8.95 cm/s', `exoplanet mass: Earth's wobble on the Sun (${await page.textContent('.rv-big')})`);
    await page.fill('.rv-e', '1.2');
    check(/Eccentricity runs/.test(await page.textContent('.rv-err')), 'exoplanet mass: bad eccentricity explained');

    await page.goto(BASE + '/science/impact-crater-calculator/');
    check((await page.textContent('.ic-big')) === 'A crater 1.28 km wide (a simple bowl)' && /6\.78 megatons/.test(await page.textContent('.ic-facts')) && /485 years/.test(await page.textContent('.ic-facts')), 'impact: 50 m rock');
    await page.click('.ic-quick button:has-text("10 km rock")');
    check(/complex crater/.test(await page.textContent('.ic-big')), 'impact: big impact makes a complex crater');
    await page.click('.ic-mode button[data-m=impactor]');
    await page.selectOption('.ic-body', 'moon'); await page.fill('.ic-d', '1.28');
    check(/^An impactor about \d+(\.\d+)? m across$/.test(await page.textContent('.ic-big')), `impact: impactor from a lunar crater (${await page.textContent('.ic-big')})`);

    await page.goto(BASE + '/science/link-budget-calculator/');
    check((await page.textContent('.lb-big')) === 'Margin +1.60 dB: only just, with little to spare' && /1,695 km/.test(await page.textContent('.lb-facts')), 'link budget: CubeSat UHF');
    check((await page.locator('.lb-tab tbody tr').count()) === 17, 'link budget: every step listed');
    await page.selectOption('.lb-pre', 'sband');
    check(/^Margin \+9\.33 dB/.test(await page.textContent('.lb-big')), `link budget: S-band to a 3 m dish (${await page.textContent('.lb-big')})`);
    await page.fill('.lb-r', '0');
    check(/data rate/.test(await page.textContent('.lb-err')), 'link budget: missing data rate explained');

    await page.goto(BASE + '/science/radio-telescope-calculator/');
    check((await page.textContent('.rt-big')) === 'Signal-to-noise 244 on a 1,590 Jy source in 1 minute' && /78,129 Jy/.test(await page.textContent('.rt-facts')), 'radio telescope: backyard dish on Cygnus A');
    await page.selectOption('.rt-pre', '100m');
    check(/1\.99 K\/Jy/.test(await page.textContent('.rt-facts')) && /flux density10 Jy/.test(await page.textContent('.rt-facts')), 'radio telescope: 100 m dish gain and SEFD');
    await page.fill('.rt-n', '0');
    check(/whole number of dishes/.test(await page.textContent('.rt-err')), 'radio telescope: bad dish count explained');

  }
  {
    // Batch H: Sun position, Jupiter's moons, porkchop plot, radial velocity fitter.
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/sun-position-calculator/');
    await page.selectOption('.sp-tz', 'America/Toronto');
    await page.fill('.spc-date', '2026-06-21'); await page.fill('.spc-time', '15:00'); await page.dispatchEvent('.spc-time', 'change');
    await page.fill('.spc-h', '1.8'); await page.dispatchEvent('.spc-h', 'input');
    check((await page.textContent('.spc-big')) === '61.1° above the horizon, towards the south-west (azimuth 233.8°)', `sun: Toronto solstice afternoon (${await page.textContent('.spc-big')})`);
    check(/0\.993 m, pointing NE/.test(await page.textContent('.spc-now-facts')), 'sun: shadow of a 1.8 m person');
    const spDay = await page.textContent('.spc-day');
    check(/Sunrise05:36/.test(spDay) && /Sunset21:02/.test(spDay) && /15 h 27 min/.test(spDay) && /13:19, 69\.8° high/.test(spDay), 'sun: rise, set, noon and day length');
    check((await page.locator('.spc-tab tbody tr').count()) === 12 && (await page.locator('.spc-seasons tbody tr').count()) === 4, 'sun: monthly and season tables');
    const spCsv = readFileSync(await dl(page, '.spc-csv'), 'utf8').trim().split(/\r?\n/);
    check(spCsv.length === 366 && spCsv[0].startsWith('date,sunrise_utc'), 'sun: year CSV');
    await page.fill('.spc-date', '1500-01-01'); await page.dispatchEvent('.spc-date', 'change');
    check(/1700 to 2300/.test(await page.textContent('.spc-err')), 'sun: out-of-range year explained');

    await page.goto(BASE + '/science/jupiter-moons/');
    await page.selectOption('.sp-tz', 'America/Toronto');
    await page.fill('.jm-t', '2027-02-11T20:00'); await page.dispatchEvent('.jm-t', 'change');
    check((await page.textContent('.jm-big')) === 'Jupiter is 27° up in a dark sky', `jupiter: Toronto evening (${await page.textContent('.jm-big')})`);
    check(/Europaon the disc/.test(await page.textContent('.jm-pos')) && /hidden behind Jupiter/.test(await page.textContent('.jm-pos')), 'jupiter: Europa behind the planet');
    const jmEv = await page.textContent('.jm-ev');
    check(/Feb 11 19:0\d21:53Europain Jupiter's shadow/.test(jmEv), `jupiter: Europa eclipse ends 21:53`);
    await page.check('.jm-vis');
    check(!/No$/m.test(await page.textContent('.jm-ev tbody')) && !(await page.textContent('.jm-ev tbody')).includes('No'), 'jupiter: only visible events');
    await page.click('.jm-ev tbody tr:nth-child(1)');
    check(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(await page.inputValue('.jm-t')) && (await page.inputValue('.jm-t')) !== '2027-02-11T20:00', 'jupiter: tap an event to jump to it');
    await page.click('.jm-fwd');
    const jmCsv = readFileSync(await dl(page, '.jm-csv'), 'utf8').trim().split(/\r?\n/);
    check(jmCsv.length >= 6 && jmCsv[0] === 'start_utc,end_utc,moon,event,visible_from_place', 'jupiter: event CSV');

    await page.goto(BASE + '/science/porkchop-plot/?from=earth&to=mars&depart=2020-06-01');
    check(/^Cheapest launch in this range: /.test(await page.textContent('.pk-big')), 'porkchop: Mars 2020 window drawn');
    await page.fill('.pk-dep', '2026-06-12'); await page.fill('.pk-span', '281'); await page.fill('.pk-t0', '130'); await page.fill('.pk-t1', '410'); await page.dispatchEvent('.pk-t1', 'change');
    check((await page.textContent('.pk-big')) === 'Cheapest launch in this range: 1 Nov 2026, 291 days to Mars, C3 9.20 km²/s²', `porkchop: 2026 window (${await page.textContent('.pk-big')})`);
    await page.click('.pk-fig', { position: { x: 200, y: 200 } });
    check(!(await page.locator('.pk-pick').isHidden()) && /Launch energy C3/.test(await page.textContent('.pk-sel')), 'porkchop: tap to read a flight');
    await page.selectOption('.pk-by', 'vinfArr');
    check(/Lowest arrival excess speed/.test(await page.textContent('.pk-best')), 'porkchop: colour by arrival speed');
    const pkCsv = readFileSync(await dl(page, '.pk-csv'), 'utf8').trim().split(/\r?\n/);
    check(pkCsv.length > 3000 && pkCsv[0].startsWith('departure_utc,flight_days'), 'porkchop: grid CSV');
    await page.selectOption('.pk-to', 'Earth');
    check(/two different planets/.test(await page.textContent('.pk-err')), 'porkchop: same planet explained');

    await page.goto(BASE + '/science/radial-velocity-fitter/');
    check((await page.textContent('.rvf-big')) === 'Period 12.3415 ± 0.0056 days, semi-amplitude K = 23.56 ± 0.28 km/s', `rv fit: example (${await page.textContent('.rvf-big')})`);
    await page.fill('.rvf-ms', '1'); await page.dispatchEvent('.rvf-ms', 'input');
    const rvF = await page.textContent('.rvf-facts');
    check(/0\.423 ± 0\.011/.test(rvF) && /0\.01244 M☉/.test(rvF) && /3\.623 million km/.test(rvF) && /0\.272 solar masses/.test(rvF), 'rv fit: eccentricity, mass function, a sin i and companion mass');
    check(/led to this fit/.test(await page.textContent('.rvf-cand')), 'rv fit: candidate periods listed');
    await page.check('.rvf-circ');
    check(/Time of greatest velocity/.test(await page.textContent('.rvf-facts')), 'rv fit: circular orbit');
    await page.fill('.rvf-in', '1 2\n2 3');
    await page.waitForTimeout(700);
    check(/at least 5 rows/.test(await page.textContent('.rvf-err')), 'rv fit: too few rows explained');
  }
  {
    // Batch I: eclipse finder, satellite tracker, uv coverage, double stars.
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/eclipse-finder/');
    await page.selectOption('.sp-tz', 'America/Toronto');
    check(/^Next you can see: /.test(await page.textContent('.ec-big')) && (await page.locator('.ec-tab tbody tr').count()) >= 8, `eclipses: list for Toronto (${await page.textContent('.ec-big')})`);
    const ecVisible = await page.locator('.ec-tab tbody tr').count();
    await page.check('.ec-all');
    check((await page.locator('.ec-tab tbody tr').count()) > ecVisible, 'eclipses: unseen ones on request');
    await page.selectOption('.ec-type', 'solar');
    await page.click('.ec-tab tbody tr:nth-child(1)');
    check(/^Solar/.test(await page.textContent('.ec-dt')) && !(await page.locator('.ec-safe').isHidden()), 'eclipses: solar detail shows the eye-safety warning');
    await page.fill('.ec-slide', '1000'); await page.dispatchEvent('.ec-slide', 'input');
    check(/covers (0|< 1) % of the Sun/.test(await page.textContent('.ec-now')), `eclipses: slider to last contact (${await page.textContent('.ec-now')})`);
    await page.selectOption('.ec-type', 'lunar');
    await page.click('.ec-tab tbody tr:has-text("Lunar, total")');
    check(/fully in Earth's shadow for \d+ minutes|Moon is below your horizon/.test(await page.textContent('.ec-db')) && (await page.locator('.ec-safe').isHidden()), 'eclipses: total lunar eclipse detail');
    const ecCsv = readFileSync(await dl(page, '.ec-csv'), 'utf8').trim().split(/\r?\n/);
    check(ecCsv.length > 10 && ecCsv[0].startsWith('type,kind_here,kind_global'), 'eclipses: CSV');

    await page.goto(BASE + '/science/satellite-tracker/');
    check((await page.textContent('.st-big')) === 'One orbit every 92.9 minutes, 415 × 422 km up' && /−4\.950° a day/.test(await page.textContent('.st-facts')), 'satellite: space station orbit');
    check((await page.locator('.st-tab tbody tr').count()) >= 6, 'satellite: passes listed');
    await page.selectOption('.st-pre', 'sso');
    check(/sun-synchronous: it passes over at the same local time/.test(await page.textContent('.st-facts')), 'satellite: sun-synchronous orbit recognised');
    await page.selectOption('.st-pre', 'geo');
    check(/^One orbit every 23\.93 hours/.test(await page.textContent('.st-big')), `satellite: geostationary period (${await page.textContent('.st-big')})`);
    await page.click('.st-mode button[data-m=tle]');
    const issTle = 'ISS (ZARYA)\n1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927\n2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537';
    await page.fill('.st-tx', issTle);
    check((await page.textContent('.st-title')) === 'ISS (ZARYA)' && /too old for reliable pass times/.test(await page.textContent('.st-facts')), 'satellite: TLE read, age flagged');
    await page.fill('.st-tx', issTle.replace('51.6416', '51.6417'));
    check(/checksum on line 2/.test(await page.textContent('.st-err')), 'satellite: bad TLE digit caught');
    await page.fill('.st-tx', issTle);
    const stCsv = readFileSync(await dl(page, '.st-csv'), 'utf8').trim().split(/\r?\n/);
    check(stCsv.length > 300 && stCsv[0] === 'time_utc,latitude_deg,longitude_deg,height_km,sunlit', 'satellite: track CSV');

    await page.goto(BASE + '/science/uv-coverage/');
    check((await page.textContent('.uvc-big')) === 'Beam about 57.8″ × 52.1″ (east–west × north–south)' && /351 baselines/.test(await page.textContent('.uvc-facts')), `uv: Y array beam (${await page.textContent('.uvc-big')})`);
    await page.selectOption('.uvc-pre', 'y36');
    check(/^Beam about 9\.\d+″ × 8\.\d+″/.test(await page.textContent('.uvc-big')), 'uv: wider array, sharper beam');
    await page.fill('.uvc-dec', '-60'); await page.dispatchEvent('.uvc-dec', 'change');
    check(/never rises above 15°/.test(await page.textContent('.uvc-err')), 'uv: source too far south explained');
    await page.fill('.uvc-dec', '30'); await page.dispatchEvent('.uvc-dec', 'change');
    await page.fill('.uvc-ants', '0 0\n20 0'); await page.dispatchEvent('.uvc-ants', 'input');
    check((await page.inputValue('.uvc-pre')) === 'custom' && /2 dishes, 1 baselines|2 dishes, 1 baseline/.test(await page.textContent('.uvc-facts')), 'uv: own antennas');
    const uvCsv = readFileSync(await dl(page, '.uvc-csv'), 'utf8').trim().split(/\r?\n/);
    check(uvCsv.length > 50 && uvCsv[0] === 'u_wavelengths,v_wavelengths', 'uv: CSV');

    await page.goto(BASE + '/science/double-star-calculator/');
    check(/^B is \d+\.\d″ from A at position angle/.test(await page.textContent('.ds-big')) && /3\.07 solar masses/.test(await page.textContent('.ds-facts')), 'double star: Sirius and its mass');
    await page.selectOption('.ds-pre', 'eta');
    check((await page.textContent('.ds-big')) === 'B is 0.411″ from A at position angle 318.4° (towards the north-west)', 'double star: Meeus example 57.a');
    await page.click('.ds-mode button[data-m=measure]');
    // A dark test image with two stars: A at (60, 60), B 20 px straight up at (60, 40).
    const png = await page.evaluate(async () => { const c = document.createElement('canvas'); c.width = 120; c.height = 120; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 120, 120); g.fillStyle = '#fff'; for (const [x, y] of [[60, 60], [60, 40]]) { g.beginPath(); g.arc(x, y, 2.5, 0, 7); g.fill(); } const b = await new Promise((r) => c.toBlob(r, 'image/png')); return Array.from(new Uint8Array(await b.arrayBuffer())); });
    await page.setInputFiles('.ds-file', { name: 'pair.png', mimeType: 'image/png', buffer: Buffer.from(png) });
    await page.waitForSelector('.ds-img:not([hidden])');
    const box = await page.locator('.ds-img').boundingBox(), k = box.width / 120;
    await page.click('.ds-img', { position: { x: 61 * k, y: 59 * k } });
    await page.click('.ds-img', { position: { x: 59 * k, y: 41 * k } });
    check(/^Separation 7\.7\d″, position angle (0\.\d|359\.\d)°$/.test(await page.textContent('.ds-big')), `double star: taps snap to the stars (${await page.textContent('.ds-big')})`);
    await page.check('.ds-mir'); await page.fill('.ds-ax', '60'); await page.fill('.ds-ay', '60'); await page.fill('.ds-bx', '40'); await page.fill('.ds-by', '60');
    check(/position angle 270\.0°/.test(await page.textContent('.ds-big')), 'double star: mirrored image');
  }
  {
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/rotation-curve-fitter/');
    await page.waitForFunction(() => document.querySelector('.rcv-big')?.textContent);
    check((await page.textContent('.rcv-big')) === 'Dark matter is 80 % of the mass inside 30 kpc', `rotation curve: example dark share (${await page.textContent('.rcv-big')})`);
    check(/M₂₀₀\)1\.1\d × 10¹² M☉/.test(await page.textContent('.rcv-facts')), 'rotation curve: halo virial mass');
    await page.fill('.rcv-rd', '3'); await page.dispatchEvent('.rcv-rd', 'change');
    check(/scale length 3 kpc \(fixed\)/.test(await page.textContent('.rcv-facts')), 'rotation curve: fixed scale length');
    await page.selectOption('.rcv-halo', 'iso');
    check(/core radius/.test(await page.textContent('.rcv-facts')) && !/M₂₀₀/.test(await page.textContent('.rcv-facts')), 'rotation curve: isothermal halo');
    const rcCsv = readFileSync(await dl(page, '.rcv-csv'), 'utf8').trim().split(/\r?\n/);
    check(rcCsv.length === 201 && rcCsv[0] === 'radius_kpc,total_km_s,bulge_km_s,disc_km_s,halo_km_s', 'rotation curve: CSV');
    await page.fill('.rcv-in', '1 50\n2 60'); await page.dispatchEvent('.rcv-in', 'input'); await page.waitForTimeout(700);
    check(/at least 4 rows/.test(await page.textContent('.rcv-err')), 'rotation curve: too few points explained');

    await page.goto(BASE + '/science/spectral-line-identifier/');
    await page.waitForFunction(() => document.querySelector('.sl-big')?.textContent);
    check((await page.textContent('.sl-big')) === 'Redshift z = 0.0832, from 10 lines that agree; 10 of 10 lines identified', `spectral lines: example (${await page.textContent('.sl-big')})`);
    check(/Hα6562\.8/.test(await page.textContent('.sl-tab')), 'spectral lines: Hα in the table');
    await page.selectOption('.sl-kind', 'ab');
    check(/Ca II K/.test(await page.textContent('.sl-tab')) && /O₂ A band \(not shifted\)/.test(await page.textContent('.sl-tab')), 'spectral lines: absorption and the atmosphere');
    await page.click('.sl-sample2');
    check(/O₂ A band \(not shifted\)/.test(await page.textContent('.sl-tab')) && /z = 0\.083/.test(await page.textContent('.sl-big')), 'spectral lines: list of wavelengths');
    await page.selectOption('.sl-zmode', 'set'); await page.fill('.sl-z', '0'); await page.dispatchEvent('.sl-z', 'change');
    await page.fill('.sl-in', '589.0\n656.3'); await page.selectOption('.sl-unit', '10');
    check(/Na I D/.test(await page.textContent('.sl-tab')) && /Hα/.test(await page.textContent('.sl-tab')) && /Rest \(nm\)/.test(await page.textContent('.sl-tab')), 'spectral lines: nanometres at z = 0');
    const slCsv = readFileSync(await dl(page, '.sl-csv'), 'utf8').trim().split(/\r?\n/);
    check(slCsv.length === 3 && slCsv[0] === 'measured,line,rest,offset,also_possible', 'spectral lines: CSV');

    await page.goto(BASE + '/science/transit-light-curve-fitter/');
    await page.waitForFunction(() => document.querySelector('.tf-big')?.textContent);
    check(/^1\.6\d % deep and 3\.1\d hours long: the planet is 0\.1(19|20|21) times/.test(await page.textContent('.tf-big')), `transit: example (${await page.textContent('.tf-big')})`);
    check(/Star's mean density(0\.9\d|1\.0\d) ± 0\.1\d g\/cm³/.test(await page.textContent('.tf-facts')), 'transit: star density');
    await page.fill('.tf-rs', '1.2'); await page.dispatchEvent('.tf-rs', 'change');
    check(/Planet radius1[5-6]\.\d\d ± /.test(await page.textContent('.tf-facts')), 'transit: planet radius from the star radius');
    await page.selectOption('.tf-ld', 'custom'); await page.fill('.tf-u1', '0.9'); await page.fill('.tf-u2', '0.5'); await page.dispatchEvent('.tf-u2', 'change');
    check(/Limb darkening needs/.test(await page.textContent('.tf-err')), 'transit: impossible limb darkening explained');
    await page.selectOption('.tf-ld', '0.40,0.25');
    const tfCsv = readFileSync(await dl(page, '.tf-csv'), 'utf8').trim().split(/\r?\n/);
    check(tfCsv.length === 302 && tfCsv[0] === 'hours_from_mid,time,relative_flux', 'transit: CSV');

    await page.goto(BASE + '/science/star-fwhm-checker/');
    await page.waitForFunction(() => /^Median FWHM/.test(document.querySelector('.fw-big')?.textContent ?? ''));
    check(/^Median FWHM 4\.[2-5]\d px \(4\.\d\d″\), HFR 2\.\d\d px, from 1\d\d stars$/.test(await page.textContent('.fw-big')), `FWHM: example (${await page.textContent('.fw-big')})`);
    check(/tracking or guiding error/.test(await page.textContent('.fw-facts')) && /sensor is probably tilted/.test(await page.textContent('.fw-facts')), 'FWHM: trailing and tilt diagnosed');
    // A small 16-bit FITS file with 12 round Gaussian stars of FWHM 4 px, and pixel size and focal length in the header.
    const W = 200, H = 150, card = (k, v) => (k.padEnd(8) + (v === undefined ? '' : '= ' + String(v).padStart(20))).padEnd(80);
    const hdr = [card('SIMPLE', 'T'), card('BITPIX', 16), card('NAXIS', 2), card('NAXIS1', W), card('NAXIS2', H), card('BZERO', 32768), card('XPIXSZ', 3.76), card('FOCALLEN', 800), 'END'.padEnd(80)].join('').padEnd(2880);
    const pix = new Float64Array(W * H).fill(300);
    for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { const cx = 30 + i * 45 + 0.3, cy = 30 + j * 45 - 0.2; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) pix[y * W + x] += 4000 * Math.exp(-0.5 * ((x - cx) ** 2 + (y - cy) ** 2) / (4 / 2.3548) ** 2); }
    const data = Buffer.alloc(Math.ceil((W * H * 2) / 2880) * 2880);
    let sd = 5; pix.forEach((v, i) => { sd = (sd * 16807) % 2147483647; data.writeInt16BE(Math.round(v + 6 * (sd / 2147483647 - 0.5)) - 32768, i * 2); });
    await page.setInputFiles('.fw-in', { name: 'stars.fits', mimeType: 'application/fits', buffer: Buffer.concat([Buffer.from(hdr, 'latin1'), data]) });
    await page.waitForFunction(() => /stars\.fits/.test(document.querySelector('.fw-title')?.textContent ?? '') && /^Median FWHM/.test(document.querySelector('.fw-big')?.textContent ?? ''));
    check(/^Median FWHM (3\.9\d|4\.0\d) px \(3\.[89]\d″\), HFR (1\.9\d|2\.0\d) px, from 12 stars$/.test(await page.textContent('.fw-big')), `FWHM: FITS file with header scale (${await page.textContent('.fw-big')})`);
    check(/Elongation1\.0\d/.test(await page.textContent('.fw-facts')) && /round/.test(await page.textContent('.fw-facts')), 'FWHM: round stars');
    const fwCsv = readFileSync(await dl(page, '.fw-csv'), 'utf8').trim().split(/\r?\n/);
    check(fwCsv.length === 13 && fwCsv[0].startsWith('x,y,FWHM (px),FWHM (″)'), 'FWHM: CSV of every star');
  }
  {
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/hydrogen-line-analyser/');
    await page.waitForFunction(() => document.querySelector('.hi-big')?.textContent);
    check(/^Terminal velocity 11[0-8]\.\d km\/s: the Milky Way turns at 22\d km\/s at 4\.25 kpc from its centre$/.test(await page.textContent('.hi-big')), `hydrogen: example (${await page.textContent('.hi-big')})`);
    check(/Correction to LSR\+11\.6\d km\/s/.test(await page.textContent('.hi-facts')), 'hydrogen: LSR correction');
    check((await page.$$('.hi-tab tbody tr')).length >= 3 && / or /.test(await page.textContent('.hi-tab')), 'hydrogen: peaks with near and far distances');
    await page.click('.hi-pts-clear'); await page.click('.hi-add');
    check((await page.inputValue('.hi-pts')).trim().split('\n').length === 1 && /1 pointing/.test(await page.textContent('.hi-curve-note')), 'hydrogen: pointing added to the rotation curve');
    await page.selectOption('.hi-coord', 'eq'); await page.fill('.hi-c1', '18.5'); await page.fill('.hi-c2', '-10'); await page.dispatchEvent('.hi-c2', 'change');
    check(/l = 2\d\.\d\d°/.test(await page.textContent('.hi-facts')), 'hydrogen: RA and Dec converted to galactic');
    await page.fill('.hi-time', ''); await page.dispatchEvent('.hi-time', 'change');
    check(/date and time/.test(await page.textContent('.hi-err')), 'hydrogen: missing time explained');
    await page.click('.hi-sample');
    const hiCsv = readFileSync(await dl(page, '.hi-csv'), 'utf8').trim().split(/\r?\n/);
    check(hiCsv.length > 200 && hiCsv[0] === 'v_lsr_km_s,measured,baseline,line', 'hydrogen: CSV');

    await page.goto(BASE + '/science/planet-data-explorer/');
    await page.waitForFunction(() => document.querySelector('.pdx-big')?.textContent);
    check((await page.textContent('.pdx-big')) === 'Earth is 1.88 times as wide as Mars and 9.30 times as heavy', `planets: compare (${await page.textContent('.pdx-big')})`);
    check((await page.$$('.pdx-tab tbody tr')).length === 9, 'planets: nine rows');
    await page.click('.pdx-sort >> nth=2');
    check((await page.textContent('.pdx-tab tbody tr:first-child td')) === 'Saturn', 'planets: sort by density');
    await page.click('.pdx-set button[data-s=moon]');
    check((await page.$$('.pdx-tab tbody tr')).length === 11 && /Ganymede/.test(await page.textContent('.pdx-tab')), 'planets: moons');
    await page.fill('.pdx-kg', '100');
    check(/Moon16\.[56]/.test(await page.textContent('.pdx-wt')), 'planets: weight on the Moon');
    await page.selectOption('.pdx-a', 'jupiter'); await page.selectOption('.pdx-b', 'earth');
    check(/Jupiter is 11\.2 times as wide as Earth and 318 times as heavy/.test(await page.textContent('.pdx-big')), 'planets: Jupiter and Earth');
    const pdCsv = readFileSync(await dl(page, '.pdx-csv'), 'utf8').trim().split(/\r?\n/);
    check(pdCsv.length === 21 && pdCsv[0].startsWith('name,kind,orbits'), 'planets: CSV');

    await page.goto(BASE + '/science/sunspot-counter/');
    await page.waitForFunction(() => document.querySelector('.ssn-big')?.textContent);
    check((await page.textContent('.ssn-big')) === 'R = 37: 3 groups and 7 spots', `sunspots: example (${await page.textContent('.ssn-big')})`);
    {
      const box = await page.locator('.ssn-img').boundingBox(), k = box.width / 600, at = { x: (304 + 0.62 * 264) * k, y: (297 + 0.3 * 264) * k };
      await page.click('.ssn-img', { position: at });
      check((await page.textContent('.ssn-big')) === 'R = 26: 2 groups and 6 spots', 'sunspots: tap leaves a spot out');
      await page.click('.ssn-img', { position: at });
      await page.click('.ssn-img', { position: { x: (304 - 0.1 * 264) * k, y: (297 + 0.6 * 264) * k } });
      check((await page.textContent('.ssn-big')) === 'R = 48: 4 groups and 8 spots', 'sunspots: tap adds a spot');
    }
    await page.fill('.ssn-k', '0.6'); await page.dispatchEvent('.ssn-k', 'change');
    check(/R = 0\.6 × \(10 × 4 \+ 8\) = 28\.8/.test(await page.textContent('.ssn-facts')), 'sunspots: k factor');
    const ssCsv = readFileSync(await dl(page, '.ssn-csv'), 'utf8').trim().split(/\r?\n/);
    check(ssCsv.length === 9 && ssCsv[0].startsWith('date,group'), 'sunspots: CSV');

    await page.goto(BASE + '/science/image-stacker/');
    await page.click('.stk-go');
    check(/at least two light frames/.test(await page.textContent('.stk-err')), 'stacker: needs lights');
    await page.click('.stk-sample');
    await page.waitForSelector('.stk-out:not([hidden])', { timeout: 60000 });
    check(/^8 of 8 frames stacked: the background noise is (2\.[6-9]|3(\.\d)?) times lower than in one frame$/.test(await page.textContent('.stk-big')), `stacker: example (${await page.textContent('.stk-big')})`);
    check(/25 hot pixels/.test(await page.textContent('.stk-facts')) && /corners get 5\d %/.test(await page.textContent('.stk-facts')), 'stacker: darks and flats');
    check((await page.$$eval('.stk-tab tbody tr', (r) => r.filter((x) => /used$/.test(x.textContent)).length)) === 8, 'stacker: all frames aligned');
    const fitsFile = await dl(page, '.stk-fits'), fb = readFileSync(fitsFile);
    check(fb.length % 2880 === 0 && fb.slice(0, 30).toString('latin1').startsWith('SIMPLE  =') && /BITPIX  =\s+-32/.test(fb.slice(0, 800).toString('latin1')), 'stacker: FITS download');
    await page.click('.stk-view button[data-v=raw]');
    check((await page.getAttribute('.stk-view button[data-v=raw]', 'aria-pressed')) === 'true', 'stacker: compare with a raw frame');
  }
  {
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/variable-star-log/');
    await page.waitForFunction(() => document.querySelector('.vsl-est')?.textContent);
    check(/^Estimate: 11\.1 /.test(await page.textContent('.vsl-est')), 'variable stars: step estimate');
    await page.click('.vsl-sample');
    check(/^26 observations of 2 stars: 22 visual, 4 camera\./.test(await page.textContent('.vsl-count')) && /from 8\.3 at brightest to 12\.1 at faintest/.test(await page.textContent('.vsl-plot-note')), `variable stars: example (${await page.textContent('.vsl-count')})`);
    check((await page.$$('.vsl-tab tbody tr')).length === 25, 'variable stars: table of the chosen star');
    await page.fill('.vsl-name', 'Mira'); await page.fill('.vsl-time', '2026-10-01T03:00'); await page.fill('.vsl-mag', '3.4'); await page.click('.vsl-add');
    check((await page.inputValue('.vsl-star')) === 'MIRA' && /2461314\.6250/.test(await page.textContent('.vsl-tab')), 'variable stars: add an estimate with its JD');
    await page.fill('.vsl-mag', 'x'); await page.click('.vsl-add');
    check(/as a number/.test(await page.textContent('.vsl-err')), 'variable stars: bad magnitude explained');
    await page.click('.vsl-vis-dl');
    check(/observer code/.test(await page.textContent('.vsl-io-err')), 'variable stars: observer code needed');
    await page.fill('.vsl-obscode', 'abcd');
    const vis = readFileSync(await dl(page, '.vsl-vis-dl'), 'utf8').trim().split(/\r?\n/);
    check(vis[0] === '#TYPE=VISUAL' && vis[1] === '#OBSCODE=ABCD' && vis.length === 6 + 23 && vis.includes('MIRA,2461314.6250,3.4,na,na,na,na,na') && vis.some((l) => l.startsWith('SS CYG,') && /,<12\.4,U,/.test(l)), 'variable stars: AAVSO visual file');
    const ext = readFileSync(await dl(page, '.vsl-ext-dl'), 'utf8').trim().split(/\r?\n/);
    check(ext[0] === '#TYPE=EXTENDED' && ext.length === 7 + 4 && /^SS CYG,\d+\.\d{5},8\.405,0\.007,TG,NO,ABS,000-BCP-170,8\.968,/.test(ext[9]), 'variable stars: AAVSO extended file');
    await page.click('.vsl-help-kind button[data-h=flux]');
    check((await page.textContent('.vsl-est')) === 'Magnitude: 11.426', 'variable stars: differential photometry');
    await page.click('.vsl-use');
    check((await page.inputValue('.vsl-mag')) === '11.426' && await page.isVisible('.vsl-cname'), 'variable stars: use the magnitude');
    page.once('dialog', (d) => d.accept()); await page.click('.vsl-clear');
    check(/No observations yet/.test(await page.textContent('.vsl-count')), 'variable stars: clear');
    await page.setInputFiles('.vsl-in', { name: 'mine.txt', mimeType: 'text/plain', buffer: Buffer.from(vis.join('\n')) });
    await page.waitForFunction(() => /Added/.test(document.querySelector('.vsl-count')?.textContent || ''));
    check(/^Added 23 of 23 from mine\.txt/.test(await page.textContent('.vsl-count')) && (await page.inputValue('.vsl-obscode')) === 'ABCD', 'variable stars: open an AAVSO file');
  }
  {
    const dl = async (p, sel) => { const [d] = await Promise.all([p.waitForEvent('download'), p.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
    await page.goto(BASE + '/science/molar-mass-calculator/');
    await page.waitForFunction(() => document.querySelector('.mmc-big')?.textContent);
    check((await page.textContent('.mmc-big')) === 'CuSO₄·5H₂O: 249.68 g/mol', `molar mass: example (${await page.textContent('.mmc-big')})`);
    check(/Cu \(Copper\)1.*25\.45/.test(await page.textContent('.mmc-tab')), 'molar mass: composition');
    check((await page.textContent('.mmc-conv')).startsWith('10 g = 0.040052 mol'), `molar mass: grams to moles (${await page.textContent('.mmc-conv')})`);
    await page.fill('.mmc-mol', '2');
    check((await page.inputValue('.mmc-g')) === '499.35', 'molar mass: moles to grams');
    await page.click('.mmc-ex button[data-f="C8H10N4O2"]');
    check((await page.textContent('.mmc-big')) === 'C₈H₁₀N₄O₂: 194.19 g/mol' && /194\.08038/.test(await page.textContent('.mmc-facts')) && /Rings plus double bonds6/.test(await page.textContent('.mmc-facts')), 'molar mass: caffeine');
    await page.fill('.mmc-in', 'Xy2');
    check(/not an element symbol/.test(await page.textContent('.mmc-err')) && await page.isHidden('.mmc-tab'), 'molar mass: bad symbol explained');
    await page.fill('.mmc-in', 'SO4^2-');
    check((await page.textContent('.mmc-big')) === 'SO₄²⁻: 96.06 g/mol' && /Charge−2/.test(await page.textContent('.mmc-facts')), 'molar mass: ion');
    const mmCsv = readFileSync(await dl(page, '.mmc-csv'), 'utf8').trim().split(/\r?\n/);
    check(mmCsv[0].startsWith('element,name,atoms') && mmCsv.length === 4, 'molar mass: CSV');

    await page.goto(BASE + '/science/equation-balancer/');
    await page.waitForFunction(() => document.querySelector('.eqb-big')?.textContent);
    check((await page.textContent('.eqb-big')) === 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', `balancer: propane (${await page.textContent('.eqb-big')})`);
    check((await page.$$eval('.eqb-check tbody tr', (r) => r.filter((x) => x.textContent.endsWith('✓')).length)) === 3, 'balancer: atom check');
    check(/At most 29\.94 g of CO₂, 16\.34 g of H₂O/.test(await page.textContent('.eqb-lim')), `balancer: yield with oxygen in excess (${await page.textContent('.eqb-lim')})`);
    await page.fill('.eqb-amt-1', '20'); await page.dispatchEvent('.eqb-amt-1', 'change');
    check(/^O₂ runs out first\. At most 16\.50 g of CO₂/.test(await page.textContent('.eqb-lim')) && /4\.488 g/.test(await page.textContent('.eqb-tab')), 'balancer: limiting reagent and leftover');
    await page.fill('.eqb-actual', '15');
    check(/Percent yield: 90\.9 %/.test(await page.textContent('.eqb-pct')), `balancer: percent yield (${await page.textContent('.eqb-pct')})`);
    await page.click('.eqb-ex button:nth-of-type(4)');
    check((await page.textContent('.eqb-big')) === 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O' && /Charge1717✓/.test(await page.textContent('.eqb-check')), 'balancer: ionic redox');
    await page.fill('.eqb-in', 'H2O -> H2 + CO2');
    check(/Carbon \(C\) appears on only one side/.test(await page.textContent('.eqb-err')), 'balancer: impossible reaction explained');
    await page.fill('.eqb-in', 'Fe + O2 = Fe2O3');
    const eqCsv = readFileSync(await dl(page, '.eqb-csv'), 'utf8').trim().split(/\r?\n/);
    check(eqCsv.length === 4 && eqCsv[0].startsWith('Substance,Coefficient'), 'balancer: CSV');

    await page.goto(BASE + '/science/isotope-pattern-calculator/');
    await page.waitForFunction(() => document.querySelector('.ipc-big')?.textContent);
    check((await page.textContent('.ipc-big')) === '[M+H]⁺: m/z 286.1438', `isotopes: morphine (${await page.textContent('.ipc-big')})`);
    check(/M\+1 ÷ M19\.1 %/.test(await page.textContent('.ipc-facts')), 'isotopes: M+1');
    check(/\[M\+Na\]⁺C₁₇H₁₉NNaO₃⁺308\.12571/.test(await page.textContent('.ipc-all')), 'isotopes: all ions table');
    await page.fill('.ipc-meas', '286.1436 100\n287.1470 19.5\n288.1497 2.4');
    check(/^Mass error -0\.6 ppm/.test(await page.textContent('.ipc-cmp-big')) && /A good match/.test(await page.textContent('.ipc-cmp-big')), `isotopes: measured peaks (${await page.textContent('.ipc-cmp-big')})`);
    await page.click('.ipc-ex button[data-f="CH2Cl2"]'); await page.selectOption('.ipc-ad', 'M+');
    check(/M\+2 ÷ M64\.0 %/.test(await page.textContent('.ipc-facts')), 'isotopes: chlorine M+2');
    await page.click('.ipc-mode button[data-m=fine]');
    check((await page.$$('.ipc-tab tbody tr')).length > 5, 'isotopes: fine structure');
    await page.fill('.ipc-in', 'C6H12O6^+');
    check(/neutral molecule/.test(await page.textContent('.ipc-err')), 'isotopes: charged input explained');
    await page.click('.ipc-ex button[data-f="C254H377N65O75S6"]'); await page.selectOption('.ipc-ad', 'M+H');
    check(/M\+3 is taller/.test(await page.textContent('.ipc-facts')), 'isotopes: protein');
    const ipCsv = readFileSync(await dl(page, '.ipc-csv'), 'utf8').trim().split(/\r?\n/);
    check(ipCsv[0] === 'mz,mass,relative_abundance' && ipCsv.length > 10, 'isotopes: CSV');
  }
  {
    await page.goto(BASE + '/science/reaction-kinetics-fitter/');
    await page.waitForFunction(() => document.querySelector('.rkf-big')?.textContent);
    check((await page.textContent('.rkf-big')) === 'First order fits best: k = (6.174 ± 0.025) × 10⁻⁴ 1/s, half-life 1123 s', `kinetics: example (${await page.textContent('.rkf-big')})`);
    check(/First orderrate = k\[A\].*100 %/.test(await page.textContent('.rkf-tab')) && /n = 0\.98\d* ± 0\.009\d*, close to 1/.test(await page.textContent('.rkf-free')), 'kinetics: support and free order');
    await page.click('.rkf-view button[data-v="1"]');
    check(/R² = 0\.9999/.test(await page.textContent('.rkf-fig-note')), 'kinetics: ln[A] plot');
    await page.fill('.rkf-data', '0 0.050\n10 0.0357\n20 0.0278\n40 0.0192\n60 0.0147\n100 0.0100\n150 0.0071');
    check(/^Second order fits best: k = .*L\/\(mol·s\)/.test(await page.textContent('.rkf-big')), `kinetics: second order (${await page.textContent('.rkf-big')})`);
    await page.fill('.rkf-data', '0 1\n1 0.5');
    check(/at least three points/.test(await page.textContent('.rkf-err')), 'kinetics: too few points explained');
    check((await page.textContent('.rkf-arr-big')) === 'Ea = 158.4 ± 2.6 kJ/mol' && /1\.81 × 10¹³/.test(await page.textContent('.rkf-arr-facts')), `kinetics: Arrhenius (${await page.textContent('.rkf-arr-big')})`);
    await page.fill('.rkf-arr', '300 1\n310 2'); await page.selectOption('.rkf-tunit', 'K');
    check((await page.textContent('.rkf-arr-big')) === 'Ea = 53.60 kJ/mol', `kinetics: two-point Arrhenius (${await page.textContent('.rkf-arr-big')})`);

    await page.goto(BASE + '/science/titration-curve/');
    await page.waitForFunction(() => document.querySelector('.tit-big')?.textContent);
    check((await page.textContent('.tit-big')) === 'Equivalence at 25.00 mL, pH 8.73', `titration: acetic (${await page.textContent('.tit-big')})`);
    check(/Starting pH2\.88/.test(await page.textContent('.tit-facts')) && /pH 4\.76/.test(await page.textContent('.tit-facts')), 'titration: start and half-way');
    check((await page.textContent('.tit-ind tbody tr:first-child td')) === 'Phenolphthalein', 'titration: indicator');
    await page.click('.tit-fill');
    check(/^End point at 25\.0\d mL/.test(await page.textContent('.tit-mbig')) && /Analyte concentration0\.(0999|1000)/.test(await page.textContent('.tit-mfacts')), `titration: end point (${await page.textContent('.tit-mbig')})`);
    await page.selectOption('.tit-preset', 'phosphoric');
    check((await page.textContent('.tit-big')) === 'Equivalence points at 25.00, 50.00 mL (pH 4.70, 9.66)' && /Steps with no clear jump75\.00 mL/.test(await page.textContent('.tit-facts')), 'titration: phosphoric acid');
    await page.selectOption('.tit-preset', 'ammonia');
    check((await page.textContent('.tit-big')) === 'Equivalence at 25.00 mL, pH 5.28' && (await page.textContent('.tit-tname')) === 'HCl', 'titration: ammonia with HCl');
    await page.selectOption('.tit-preset', 'hcl');
    check((await page.textContent('.tit-big')) === 'Equivalence at 25.00 mL, pH 7.00', 'titration: strong acid');
    await page.fill('.tit-pka', 'abc');
    check(/pKa values/.test(await page.textContent('.tit-err')), 'titration: bad pKa explained');
  }
  {
    // "Open a file" on the paste boxes of the science tools: limits shown, data loaded, the tool updates.
    await page.goto(BASE + '/science/reaction-kinetics-fitter/');
    await page.waitForFunction(() => document.querySelector('.rkf-big')?.textContent);
    check((await page.$$('.dfb')).length === 2 && /up to 10 MB, 2 columns and 50,000 rows/.test(await page.textContent('.dfb-limit')), 'data files: kinetics shows two upload buttons with limits');
    await page.setInputFiles('.dfb >> nth=0 >> .dfb-in', { name: 'run.csv', mimeType: 'text/csv', buffer: Buffer.from('time,conc,notes\n0,0.050,a\n10,0.0357,b\n20,0.0278,c\n40,0.0192,d\n60,0.0147,e\n100,0.0100,f\n150,0.0071,g\n') });
    await page.waitForFunction(() => /^Second order/.test(document.querySelector('.rkf-big')?.textContent ?? ''));
    check(/Opened run\.csv: 8 rows and 2 columns\. The file has 3 columns; only the first 2 are used/.test(await page.textContent('.dfb-note')), 'data files: CSV loaded into kinetics, extra column trimmed');
    await page.goto(BASE + '/science/calibration-curve/');
    await page.waitForLoadState('networkidle');
    const before = await page.inputValue('.cc-std');
    await page.setInputFiles('.dfb >> nth=0 >> .dfb-in', { name: 'empty.csv', mimeType: 'text/csv', buffer: Buffer.from('\n\n') });
    await page.waitForSelector('.dfb-err:not([hidden])');
    check(/empty/.test(await page.textContent('.dfb-err')) && (await page.inputValue('.cc-std')) === before, 'data files: empty file explained, data kept');
  }
  {
    await page.goto(BASE + '/science/gas-law-calculator/');
    await page.waitForFunction(() => document.querySelector('.gas-big')?.textContent);
    check((await page.textContent('.gas-big')) === 'Volume: 22.414 L' && /Density1\.250 g\/L/.test(await page.textContent('.gas-facts')), `gas: molar volume of nitrogen (${await page.textContent('.gas-big')})`);
    check((await page.textContent('.gas-cbig')) === 'V₂ = 1.2516 L', 'gas: combined law');
    await page.selectOption('.gas-gas', 'co2'); await page.fill('.gas-V', '1'); await page.fill('.gas-P', ''); await page.fill('.gas-T', '27');
    check((await page.textContent('.gas-big')) === 'Pressure: 2495.6 kPa' && /Real gas \(van der Waals\)2242\.8 kPa/.test(await page.textContent('.gas-facts')) && /Critical temperature30\.85 °C/.test(await page.textContent('.gas-facts')), 'gas: CO2 real gas and critical point');
    await page.fill('.gas-P', '100'); await page.fill('.gas-n', '');
    await page.selectOption('.gas-nu', 'g');
    check(/^Amount: 1\.76\d* g$/.test(await page.textContent('.gas-big')), `gas: grams of CO2 (${await page.textContent('.gas-big')})`);
    await page.selectOption('.gas-gas', 'ideal');
    check(/Choose a gas/.test(await page.textContent('.gas-err')), 'gas: grams need a gas');
    await page.fill('.gas-P', '');
    check(/exactly one/.test(await page.textContent('.gas-err')) || /Choose a gas/.test(await page.textContent('.gas-err')), 'gas: two blanks explained');

    await page.goto(BASE + '/science/beer-lambert-calculator/');
    await page.waitForFunction(() => document.querySelector('.bl-big')?.textContent);
    check((await page.textContent('.bl-big')) === 'Concentration: 0.1000 mmol/L' && /Transmittance23\.88 %/.test(await page.textContent('.bl-facts')), `Beer–Lambert: NADH (${await page.textContent('.bl-big')})`);
    await page.fill('.bl-A', '2.5');
    check(/too high/.test(await page.textContent('.bl-facts')), 'Beer–Lambert: high absorbance warned');
    await page.fill('.bl-A', '0.622');
    await page.click('.bl-sample');
    check(/259 \(1\.44\d\), 3(39|40) \(0\.62\d\)/.test(await page.textContent('.bl-tab')) && /0\.(0999\d|1000) mmol\/L/.test(await page.textContent('.bl-tab')), `Beer–Lambert: spectrum maxima and concentration (${await page.textContent('.bl-tab')})`);
    await page.setInputFiles('.dfb-in', { name: 'two.csv', mimeType: 'text/csv', buffer: Buffer.from('nm,A,B\n300,10,50\n320,20,40\n340,50,30\n360,20,20\n380,10,10\n') });
    await page.waitForFunction(() => /two\.csv/.test(document.querySelector('.dfb-note')?.textContent ?? ''));
    await page.selectOption('.bl-kind', 'T');
    check((await page.$$('.bl-tab tbody tr')).length === 2 && /^A/.test(await page.textContent('.bl-tab tbody tr:first-child td')), 'Beer–Lambert: transmittance file with two samples');

    await page.goto(BASE + '/science/reaction-equivalents/');
    await page.waitForFunction(() => document.querySelector('.req-big')?.textContent);
    const reqTab = await page.textContent('.req-tab');
    check(/935\.2 mg626 µL/.test(reqTab) && /731\.6 mg/.test(reqTab) && /1\.382 g/.test(reqTab) && /1155\.59/.test(reqTab) && /288\.9 mg/.test(reqTab), `equivalents: Suzuki table (${reqTab})`);
    await page.fill('.req-actual', '780');
    check(/921\.2 mg.*84\.7 %/.test(await page.textContent('.req-yield')), `equivalents: yield (${await page.textContent('.req-yield')})`);
    await page.selectOption('.req-by', 'mg'); await page.fill('.req-scale', '1200');
    check(/6\.416 mmol/.test(await page.textContent('.req-big')), 'equivalents: scale from 1.20 g');
    await page.selectOption('.req-by-row', '1'); await page.selectOption('.req-by', 'ul');
    check(/density or a molarity/.test(await page.textContent('.req-err')), 'equivalents: volume scale of a solid explained');
    await page.click('.req-add');
    check(/give a formula or molar mass/.test(await page.textContent('.req-err')), 'equivalents: empty reagent explained');
    await page.click('.req-example');
    check((await page.$$('.req-tab tbody tr')).length === 4 && /5 mmol/.test(await page.textContent('.req-big')), 'equivalents: example reloads');

    await page.goto(BASE + '/science/chromatography-calculator/');
    await page.waitForFunction(() => document.querySelector('.chr-big')?.textContent);
    check(/Rs = 2\.66/.test(await page.textContent('.chr-big')) && /N₂ = 10,919/.test(await page.textContent('.chr-facts')) && /13\.7 µm/.test(await page.textContent('.chr-facts')), `chromatography: resolution and plates (${await page.textContent('.chr-big')})`);
    check(/0\.579 mL\/min, inject 1\.67 µL/.test(await page.textContent('.chr-tbig')) && /\+11 %/.test(await page.textContent('.chr-tfacts')) && /3\.74/.test(await page.textContent('.chr-gtab')), `chromatography: method transfer (${await page.textContent('.chr-tbig')})`);
    await page.selectOption('.chr-wk', 'base');
    check(/Rs = 4\.52/.test(await page.textContent('.chr-big')), `chromatography: baseline widths (${await page.textContent('.chr-big')})`);
    await page.fill('.chr-t2', '6.0');
    check(/after peak 1/.test(await page.textContent('.chr-err')), 'chromatography: peak order explained');
    await page.fill('.chr-L2', '50');
    check(/outside/.test(await page.textContent('.chr-tfacts')), 'chromatography: USP window warning');

    await page.goto(BASE + '/science/method-validation/');
    await page.waitForFunction(() => document.querySelector('.mv-big')?.textContent);
    check((await page.textContent('.mv-big')) === 'RSD 0.82 %, recovery 100.3 %, 1 outlier flagged (103.9 in Day 2)', `validation: headline (${await page.textContent('.mv-big')})`);
    const mvf = await page.textContent('.mv-facts');
    check(/s_I = 1\.06/.test(mvf) && /F = 4\.92, p = 0\.023/.test(mvf) && /Recovery100\.33 %/.test(mvf) && /p = 0\.180: no significant bias/.test(mvf), `validation: precision and accuracy (${mvf})`);
    check(/103\.9 flagged \(G 2\.01 > 1\.89\)/.test(await page.textContent('.mv-tab')), 'validation: Grubbs in the table');
    await page.fill('.mv-conc', '5');
    check(/HorRat 0\.34/.test(await page.textContent('.mv-facts')), 'validation: Horwitz ratio');
    await page.check('.mv-drop');
    check(/^RSD 0\.31 %, recovery 100\.1 %, 1 outlier left out/.test(await page.textContent('.mv-big')), `validation: outlier left out (${await page.textContent('.mv-big')})`);
    await page.click('.mv-clear');
    check(/Paste your replicate results/.test(await page.textContent('.mv-err')), 'validation: empty box explained');
    await page.setInputFiles('.dfb-in', { name: 'reps.csv', mimeType: 'text/csv', buffer: Buffer.from('Run\n10.1\n10.3\n9.9\n10.0\n10.2\n') });
    await page.waitForFunction(() => /RSD 1\.57 %/.test(document.querySelector('.mv-big')?.textContent ?? ''));
    await page.fill('.mv-true', '10');
    check((await page.textContent('.mv-big')) === 'RSD 1.57 %, recovery 101.0 %, no outliers', `validation: one-column file (${await page.textContent('.mv-big')})`);

    await page.goto(BASE + '/science/colligative-properties/');
    await page.waitForFunction(() => document.querySelector('.col-big')?.textContent);
    check((await page.textContent('.col-big')) === 'Freezes at -0.516 °C, boils at 100.142 °C' && /6\.859 bar/.test(await page.textContent('.col-facts')), `colligative: glucose in water (${await page.textContent('.col-big')})`);
    check((await page.textContent('.col-mbig')) === 'Molar mass ≈ 256 g/mol' && /0\.998: a good match/.test(await page.textContent('.col-mfacts')), 'colligative: S8 from benzene');
    await page.fill('.col-exp', 'S');
    check(/8-unit clusters/.test(await page.textContent('.col-mfacts')), 'colligative: clusters recognised');
    await page.selectOption('.col-meth', 'osm'); await page.fill('.col-ms', '100'); await page.fill('.col-dt', '3.73');
    check((await page.textContent('.col-mbig')) === 'Molar mass ≈ 66,500 g/mol', `colligative: albumin by osmometry (${await page.textContent('.col-mbig')})`);
    await page.selectOption('.col-solv', 'camphor');
    check(!/Boiling point/.test(await page.textContent('.col-facts')) && /Freezing point/.test(await page.textContent('.col-facts')), 'colligative: camphor has only Kf');
    await page.selectOption('.col-ipre', '2');
    check((await page.inputValue('.col-i')) === '2', 'colligative: i preset');
    await page.fill('.col-sol', 'Xx');
    check(/solute formula/.test(await page.textContent('.col-err')), 'colligative: bad formula explained');

    await page.goto(BASE + '/science/equilibrium-solver/');
    await page.waitForFunction(() => document.querySelector('.eqs-big')?.textContent);
    check((await page.textContent('.eqs-big')) === 'Goes forward: at equilibrium HI = 0.7865 mol/L' && /0\.1067/.test(await page.textContent('.eqs-tab')), `equilibrium: Chang's HI (${await page.textContent('.eqs-big')})`);
    await page.fill('.eqs-dadd', '0.2');
    check(/^Shifts towards products/.test(await page.textContent('.eqs-lbig')) && /0\.8870/.test(await page.textContent('.eqs-ltab')), 'equilibrium: adding H2 shifts right');
    await page.selectOption('.eqs-ex', 'acetic');
    check(/pH2\.88/.test(await page.textContent('.eqs-facts')), 'equilibrium: acetic acid pH');
    await page.selectOption('.eqs-ex', 'n2o4');
    check(/Kp0\.1148/.test(await page.textContent('.eqs-facts')), `equilibrium: Kp from Kc (${await page.textContent('.eqs-facts')})`);
    await page.fill('.eqs-dvol', '0.5');
    check(/towards reactants \(left\): squeezing/.test(await page.textContent('.eqs-lbig')), 'equilibrium: squeezing N2O4');
    await page.fill('.eqs-dvol', '1'); await page.fill('.eqs-dT', '50'); await page.fill('.eqs-dH', '57.2');
    check(/K becomes 0\.02760 at 50 °C/.test(await page.textContent('.eqs-lbig')), 'equilibrium: van \'t Hoff');
    await page.selectOption('.eqs-ex', 'agcl');
    check(/Ag⁺ = 1\.8/.test(await page.textContent('.eqs-big')) && /Molar solubility/.test(await page.textContent('.eqs-facts')), `equilibrium: AgCl common ion (${await page.textContent('.eqs-big')})`);
    await page.fill('.eqs-rxn', 'H2 + I2');
    check(/arrow/.test(await page.textContent('.eqs-err')), 'equilibrium: missing arrow explained');

    await page.goto(BASE + '/science/cyclic-voltammetry/');
    await page.waitForFunction(() => document.querySelector('.cv-big')?.textContent && document.querySelector('.cv-sbig')?.textContent);
    check((await page.textContent('.cv-big')) === 'ΔEp 58 mV, E½ 199 mV: reversible (fast electron transfer)', `CV: example peaks (${await page.textContent('.cv-big')})`);
    check(/ip = 18\.9\d µA/.test(await page.textContent('.cv-facts')) && /Peak ratio1\.0\d/.test(await page.textContent('.cv-facts')), 'CV: peak current and ratio');
    check(/^D = 9\.9\d × 10⁻⁶ cm²\/s$/.test(await page.textContent('.cv-rbig')), `CV: D from the peak (${await page.textContent('.cv-rbig')})`);
    check(/log–log slope 0\.50: diffusion controlled/.test(await page.textContent('.cv-sbig')), 'CV: scan-rate study');
    await page.fill('.cv-D', '1e-5'); await page.fill('.cv-ip', '');
    check(/^Peak current 18\.99 µA$/.test(await page.textContent('.cv-rbig')), `CV: Randles–Sevcik forward (${await page.textContent('.cv-rbig')})`);
    await page.fill('.cv-A', '');
    check(/Leave exactly one box empty/.test(await page.textContent('.cv-rerr')), 'CV: two blanks explained');
    await page.selectOption('.cv-sign', '-1');
    check(/switch the current sign/.test(await page.textContent('.cv-big')), 'CV: wrong sign hinted');
    await page.selectOption('.cv-sign', '1');
    await page.setInputFiles('.dfb-in >> nth=0', { name: 'irr.csv', mimeType: 'text/csv', buffer: Buffer.from('E,I\n' + Array.from({ length: 40 }, (_, i) => { const e = i < 20 ? i * 0.05 : (39 - i) * 0.05; return `${e.toFixed(2)},${(i < 20 ? Math.exp(-((e - 0.6) ** 2) / 0.02) : 0.02).toFixed(4)}`; }).join('\n')) });
    await page.waitForFunction(() => /no return peak/.test(document.querySelector('.cv-big')?.textContent ?? ''));
    check(/Anodic peak at 600 mV/.test(await page.textContent('.cv-big')), `CV: irreversible file (${await page.textContent('.cv-big')})`);

    await page.goto(BASE + '/science/tlc-rf-calculator/');
    await page.waitForFunction(() => document.querySelector('.tlc-big')?.textContent);
    check((await page.textContent('.tlc-big')) === '6 spots in 3 lanes, Rf 0.12 to 0.58', `TLC: example plate (${await page.textContent('.tlc-big')})`);
    check(/spots 3 and 4: ΔRf 0\.22, ΔCV 1\.1/.test(await page.textContent('.tlc-facts')), 'TLC: closest pair');
    const cvBox = await page.locator('.tlc-cv').boundingBox();
    await page.locator('.tlc-cv').click({ position: { x: cvBox.width * 0.5, y: cvBox.height * 0.5 } });
    check(/^7 spots/.test(await page.textContent('.tlc-big')) && (await page.$$('.tlc-tab tbody tr')).length === 7, 'TLC: tap adds a spot');
    await page.click('.tlc-undo');
    check(/^6 spots/.test(await page.textContent('.tlc-big')), 'TLC: undo');
    await page.click('.tlc-tab tbody tr:last-child button');
    check(/^5 spots in 3 lanes, Rf 0\.36 to 0\.58/.test(await page.textContent('.tlc-big')), 'TLC: remove a spot');
    check(/0\.35.*0\.62/.test(await page.textContent('.tlc-mtab')) && /ΔCV 1\.3/.test(await page.textContent('.tlc-mnote')), 'TLC: measured distances');
    await page.fill('.tlc-sd', '60 too far');
    check(/further than the solvent front/.test(await page.textContent('.tlc-merr')), 'TLC: impossible distance explained');
    const png = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 40; c.height = 60; const x = c.getContext('2d'); x.fillStyle = '#ddd'; x.fillRect(0, 0, 40, 60); return c.toDataURL('image/png').split(',')[1]; });
    await page.setInputFiles('.tlc-file', { name: 'plate.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') });
    await page.waitForFunction(() => /Tap the baseline/.test(document.querySelector('.tlc-big')?.textContent ?? ''));
    check(true, 'TLC: own photo opens and asks for the baseline');

    await page.goto(BASE + '/science/huckel-mo-calculator/');
    await page.waitForFunction(() => document.querySelector('.hmo-big')?.textContent);
    check((await page.textContent('.hmo-big')) === 'Benzene: 6 π electrons, Eπ = 6α + 8.000β, delocalisation energy 2.000β', `Hückel: benzene (${await page.textContent('.hmo-big')})`);
    check(/aromatic \(4n \+ 2/.test(await page.textContent('.hmo-facts')) && (await page.$$('.hmo-tab tbody tr')).length === 6, 'Hückel: aromatic and six MOs');
    await page.selectOption('.hmo-pre', 'butadiene');
    check(/delocalisation energy 0\.472β/.test(await page.textContent('.hmo-big')) && /1–20\.894/.test(await page.textContent('.hmo-btab')), 'Hückel: butadiene');
    await page.selectOption('.hmo-pre', 'cyclobutadiene');
    check(/antiaromatic/.test(await page.textContent('.hmo-facts')) && /2 half-filled orbitals/.test(await page.textContent('.hmo-facts')), 'Hückel: cyclobutadiene diradical');
    await page.selectOption('.hmo-pre', 'pyridine');
    check(/not shown with heteroatoms/.test(await page.textContent('.hmo-facts')) && /1 \(N\)/.test(await page.textContent('.hmo-atab')), 'Hückel: pyridine');
    await page.fill('.hmo-het', '9 N');
    check(/atom number must be 1 to 6/.test(await page.textContent('.hmo-err')), 'Hückel: bad heteroatom explained');
    await page.fill('.hmo-het', ''); await page.fill('.hmo-n', '3'); await page.fill('.hmo-bonds', '1-2 2-3'); await page.fill('.hmo-q', '-1');
    check(/^4 π electrons, Eπ = 4α \+ 2\.828β, delocalisation energy 0\.828β$/.test(await page.textContent('.hmo-big')), `Hückel: own allyl anion (${await page.textContent('.hmo-big')})`);

    await page.goto(BASE + '/science/crystal-field-calculator/');
    await page.waitForFunction(() => document.querySelector('.cfs-big')?.textContent);
    check((await page.textContent('.cfs-big')) === 'High spin d⁶: t2g⁴ eg², 4 unpaired electrons, μ = 4.90 BM', `crystal field: Fe(H2O)6 (${await page.textContent('.cfs-big')})`);
    await page.fill('.cfs-D', '33000');
    check(/^Low spin d⁶: t2g⁶ eg⁰, 0 unpaired/.test(await page.textContent('.cfs-big')) && /−2\.4Δo/.test(await page.textContent('.cfs-facts')), 'crystal field: low spin with cyanide');
    await page.selectOption('.cfs-m', 'Cu');
    check((await page.inputValue('.cfs-d')) === '9' && /strong distortion/.test(await page.textContent('.cfs-facts')), 'crystal field: Cu2+ Jahn–Teller');
    await page.selectOption('.cfs-m', 'Ti'); await page.fill('.cfs-ox', '3'); await page.fill('.cfs-nm', '493');
    check(/20284 cm⁻¹ = 242\.7 kJ\/mol/.test(await page.textContent('.cfs-facts')) && /absorbs blue-green light/.test(await page.textContent('.cfs-facts')), `crystal field: band to Δ (${await page.textContent('.cfs-facts')})`);
    await page.fill('.cfs-nm', ''); await page.selectOption('.cfs-m', 'Ni'); await page.fill('.cfs-ox', '2'); await page.fill('.cfs-D', '33000'); await page.selectOption('.cfs-g', 'sp');
    check(/0 unpaired/.test(await page.textContent('.cfs-big')) && /d⁸ square planar/.test(await page.textContent('.cfs-facts')), 'crystal field: square planar Ni2+');
    await page.selectOption('.cfs-u', 'kj');
    check(/kJ\/mol/.test(await page.textContent('.cfs-facts')) && Math.abs(Number(await page.inputValue('.cfs-D')) - 394.8) < 0.5, `crystal field: unit switch (${await page.inputValue('.cfs-D')})`);
    await page.fill('.cfs-d', '12');
    check(/0 to 10/.test(await page.textContent('.cfs-err')), 'crystal field: bad d count explained');

    await page.goto(BASE + '/science/diatomic-spectroscopy/');
    await page.waitForFunction(() => document.querySelector('.dia-big')?.textContent && document.querySelector('.dia-fbig')?.textContent);
    check((await page.textContent('.dia-big')) === 'H³⁵Cl: fundamental 2885.3 cm⁻¹ (3.466 µm), bond length 1.2746 Å', `diatomic: HCl (${await page.textContent('.dia-big')})`);
    check(/2905\.57/.test(await page.textContent('.dia-tab')) && /2864\.43/.test(await page.textContent('.dia-tab')), 'diatomic: R(0) and P(1)');
    check(/measured D0 is 4\.434 eV/.test(await page.textContent('.dia-facts')), 'diatomic: Morse with measured D0');
    await page.fill('.dia-a1', '2H');
    check(/fundamental 2090\.8 cm⁻¹/.test(await page.textContent('.dia-big')) && /rescaled from H³⁵Cl/.test(await page.textContent('.dia-facts')), 'diatomic: DCl isotope shift');
    await page.fill('.dia-a1', '9H');
    check(/not an isotope in the table/.test(await page.textContent('.dia-err')), 'diatomic: unknown isotope explained');
    await page.selectOption('.dia-mol', 'CO');
    check(/bond length 1\.1283 Å/.test(await page.textContent('.dia-big')) && /115\.3 GHz/.test(await page.textContent('.dia-facts')), 'diatomic: CO');
    check(/^ωe = 2989\.2 ± 0\.2 cm⁻¹, ωexe = 51\.71 ± 0\.06 cm⁻¹$/.test(await page.textContent('.dia-fbig')), `diatomic: fit (${await page.textContent('.dia-fbig')})`);
    await page.click('.dia-ffacts button');
    check((await page.inputValue('.dia-we')) === '2989.22' && (await page.inputValue('.dia-mol')) === '', 'diatomic: fit sent to the molecule card');

    await page.goto(BASE + '/science/thermochemistry-calculator/');
    await page.waitForFunction(() => document.querySelector('.thc-big')?.textContent);
    check(/ΔrH° −890\.6 kJ\/mol \(exothermic\), ΔrG° −818\.2 kJ\/mol at 298\.15 K: spontaneous/.test(await page.textContent('.thc-big')), `thermo: methane (${await page.textContent('.thc-big')})`);
    check(/−242\.9 J/.test(await page.textContent('.thc-facts')) && (await page.isHidden('.thc-warn')), 'thermo: ΔS and balanced');
    await page.fill('.thc-rxn', 'CaCO3(s) → CaO(s) + CO2(g)');
    check(/1119 K/.test(await page.textContent('.thc-facts')) && /not spontaneous/.test(await page.textContent('.thc-big')), 'thermo: limestone turnover');
    await page.fill('.thc-T', '1200');
    check(/spontaneous as written/.test(await page.textContent('.thc-big')) && !/not spontaneous/.test(await page.textContent('.thc-big')), 'thermo: limestone at 1200 K');
    await page.fill('.thc-rxn', 'CaCO3(s) → CaO(s) + 2CO2(g)');
    check(/Not balanced for C, O/.test(await page.textContent('.thc-warn')), 'thermo: balance warning');
    await page.fill('.thc-rxn', 'XeF4(g) → Xe(g) + 2F2(g)');
    check(/not in the table/.test(await page.textContent('.thc-in')) && /Type ΔfH° and S° for XeF/.test(await page.textContent('.thc-err')), 'thermo: unknown species asks for values');

    await page.goto(BASE + '/science/nernst-calculator/');
    await page.waitForFunction(() => document.querySelector('.nst-big')?.textContent && document.querySelector('.nst-rtab tbody'));
    check((await page.textContent('.nst-big')) === 'E°cell +1.1037 V, Ecell +1.0445 V: galvanic, runs by itself as written', `nernst: Daniell (${await page.textContent('.nst-big')})`);
    check(/Zn\(s\) \| Zn²⁺\(aq\) ‖ Cu²⁺\(aq\) \| Cu\(s\)/.test(await page.textContent('.nst-facts')) && /−213\.0 kJ\/mol/.test(await page.textContent('.nst-facts')), 'nernst: notation and ΔG°');
    await page.click('.nst-swap');
    check(/electrolytic, needs at least 1\.045 V/.test(await page.textContent('.nst-big')), 'nernst: swapped cell is electrolytic');
    await page.click('.nst-mode button[data-m=one]');
    await page.selectOption('.nst-cat', 'O2acid');
    await page.fill('.nst-v[data-f="H^+"]', '7');
    await page.fill('.nst-v[data-f="O2"]', '0.21');
    check(/^E = \+0\.8049 V vs SHE/.test(await page.textContent('.nst-big')), `nernst: oxygen at pH 7 (${await page.textContent('.nst-big')})`);
    await page.fill('.nst-v[data-f="O2"]', '0');
    check(/above zero for O₂/.test(await page.textContent('.nst-err')), 'nernst: bad pressure explained');
    await page.fill('.nst-rv', '0.300');
    await page.selectOption('.nst-rfrom', 'SCE');
    check(/\+0\.541 V/.test(await page.textContent('.nst-rtab')) && /\+0\.344 V/.test(await page.textContent('.nst-rtab')), 'nernst: reference converter');

    await page.goto(BASE + '/science/electroplating-calculator/');
    await page.waitForFunction(() => document.querySelector('.far-big')?.textContent);
    check((await page.textContent('.far-big')) === '23.35 µm of nickel (2.080 g)', `plating: nickel (${await page.textContent('.far-big')})`);
    check(/2 A\/dm²/.test(await page.textContent('.far-facts')) && /23\.35 µm\/h/.test(await page.textContent('.far-facts')), 'plating: current density and rate');
    await page.click('.far-mode button[data-m=time]');
    check(/^64\.23 min at 2 A for 25 µm$/.test(await page.textContent('.far-big')), `plating: time (${await page.textContent('.far-big')})`);
    await page.selectOption('.far-sub', 'Cr');
    check((await page.inputValue('.far-eff')) === '15', 'plating: chrome sets 15 %');
    await page.selectOption('.far-sub', 'H2');
    await page.click('.far-mode button[data-m=amount]');
    await page.fill('.far-eff', '100'); await page.fill('.far-I', '1');
    check(/^456\.4 mL of hydrogen gas/.test(await page.textContent('.far-big')) && (await page.isHidden('.far-A')), `plating: hydrogen (${await page.textContent('.far-big')})`);
    await page.fill('.far-I', '0');
    check(/current in amperes/.test(await page.textContent('.far-err')), 'plating: zero current explained');

    await page.goto(BASE + '/science/green-chemistry-metrics/');
    await page.waitForFunction(() => document.querySelector('.grn-big')?.textContent);
    check((await page.textContent('.grn-ae')) === 'Atom economy 83.0 % for CH₃COOC₂H₅', `green: atom economy (${await page.textContent('.grn-ae')})`);
    check((await page.textContent('.grn-big')) === 'Yield 80.0 %, E-factor 13.8 (7.05 without water), PMI 14.8', `green: metrics (${await page.textContent('.grn-big')})`);
    check(/Total in104\.2/.test(await page.textContent('.grn-tab')), 'green: mass table');
    await page.fill('.grn-oth', 'toluene 40');
    check(/Line 1 of the other materials/.test(await page.textContent('.grn-err')), 'green: bad line explained');
    await page.fill('.grn-rxn', 'C6H5CH3 + O2 -> C6H5COOH + H2O');
    check(/^Atom economy 87\.1 %/.test(await page.textContent('.grn-ae')) && /2C₆H₅CH₃ \+ 3O₂/.test(await page.textContent('.grn-afacts')), 'green: new reaction balanced');
    await page.fill('.grn-rxn', 'NaCl -> Cl2');
    check(/only one side/.test(await page.textContent('.grn-rerr')), 'green: unbalanceable reaction explained');

    await page.goto(BASE + '/science/decay-calculator/');
    await page.waitForFunction(() => document.querySelector('.dec-big')?.textContent && document.querySelector('.dec-sfacts dt'));
    check(/^173\.4 MBq on .* \(46\.87 % of the reference\)$/.test(await page.textContent('.dec-big')), `decay: F-18 (${await page.textContent('.dec-big')})`);
    check(/2 h 0 min/.test(await page.textContent('.dec-facts')) && (await page.$$('.dec-tab tbody tr')).length === 13, 'decay: elapsed time and table');
    await page.fill('.dec-target', '100');
    check(/3 h 27 min after the reference/.test(await page.textContent('.dec-facts')), 'decay: time to 100 MBq');
    await page.selectOption('.dec-n', 'C-14');
    check(/62\.72 mCi\/mmol|0\.06272 Ci\/mmol/.test(await page.textContent('.dec-sfacts')), `decay: C-14 molar activity (${await page.textContent('.dec-sfacts')})`);
    await page.selectOption('.dec-au', 'mCi');
    await page.fill('.dec-sa', '50'); await page.fill('.dec-smol', '1000');
    check(/79\.72 %/.test(await page.textContent('.dec-sout')), 'decay: labelled fraction');
    await page.fill('.dec-a0', '0');
    check(/above zero/.test(await page.textContent('.dec-err')), 'decay: zero activity explained');

    await page.goto(BASE + '/science/polymer-molar-mass/');
    await page.waitForFunction(() => document.querySelector('.pmw-big')?.textContent);
    check(/^Mn 50,0\d\d g\/mol, Mw 99,9\d\d g\/mol, Đ 2\.00$/.test(await page.textContent('.pmw-big')), `polymer: GPC example (${await page.textContent('.pmw-big')})`);
    check(/Degree of polymerisation \(DPn\)480/.test(await page.textContent('.pmw-facts')) && /cubic, R²/.test(await page.textContent('.pmw-facts')), 'polymer: DPn and calibration');
    await page.fill('.pmw-hi', '29');
    check(/outside the standards|calibration curve turns back/.test((await page.textContent('.pmw-facts')) + (await page.textContent('.pmw-err'))), 'polymer: extrapolation flagged');
    await page.fill('.pmw-hi', '10');
    check(/window end must be after/.test(await page.textContent('.pmw-err')), 'polymer: bad window explained');
    await page.click('.pmw-mode button[data-m=list]');
    check((await page.textContent('.pmw-big')) === 'Mn 15,000 g/mol, Mw 16,667 g/mol, Đ 1.11', `polymer: list (${await page.textContent('.pmw-big')})`);
    await page.selectOption('.pmw-kind', 'w');
    check((await page.textContent('.pmw-big')) === 'Mn 13,333 g/mol, Mw 15,000 g/mol, Đ 1.13', 'polymer: list by mass');
    await page.setInputFiles('.dfb-in >> nth=2', { name: 'chains.csv', mimeType: 'text/csv', buffer: Buffer.from('M,n\n50000,2\n100000,1\n') });
    await page.waitForFunction(() => /Mn 60,000/.test(document.querySelector('.pmw-big')?.textContent ?? ''));
    check(true, 'polymer: list from a file');

    await page.goto(BASE + '/science/copolymer-composition/');
    await page.waitForFunction(() => document.querySelector('.cop-big')?.textContent && document.querySelector('.cop-fbig')?.textContent);
    check((await page.textContent('.cop-big')) === 'Copolymer F₁ = 0.371 from a feed of f₁ = 0.300: richer in styrene than the feed', `copolymer: S/MMA (${await page.textContent('.cop-big')})`);
    check(/f₁ = 0\.529/.test(await page.textContent('.cop-facts')) && /F̄₁ = 0\.32/.test(await page.textContent('.cop-facts')), 'copolymer: azeotrope and drift');
    check((await page.textContent('.cop-fbig')) === 'r₁ = 0.516, r₂ = 0.456 (non-linear least squares)', `copolymer: fit (${await page.textContent('.cop-fbig')})`);
    await page.selectOption('.cop-pair', 'S-AN');
    check(/styrene is used up here/.test(await page.textContent('.cop-facts')), 'copolymer: SAN runs out of styrene');
    await page.click('.cop-use');
    check((await page.inputValue('.cop-r1')) === '0.516' && (await page.inputValue('.cop-pair')) === 'custom', 'copolymer: fitted values used');
    await page.fill('.cop-data', '0.1, 15\n0.2, 30\n0.3, 40');
    check(/strictly between 0 and 1/.test(await page.textContent('.cop-ferr')), 'copolymer: percentages explained');

    await page.goto(BASE + '/science/glass-transition-calculator/');
    await page.waitForFunction(() => document.querySelector('.gtg-big')?.textContent && document.querySelector('.gtg-gbig')?.textContent && document.querySelector('.gtg-fbig')?.textContent);
    check((await page.textContent('.gtg-big')) === 'Tg ≈ 4.3 °C (277.5 K) by the Fox equation', `glass: Fox MMA/BA (${await page.textContent('.gtg-big')})`);
    check(/MMA 60\.0 %, BA 40\.0 % by weight/.test(await page.textContent('.gtg-facts')), 'glass: target 20 °C');
    check(/22\.5 °C with 5\.0 %/.test(await page.textContent('.gtg-gbig')) && /8\.8 % of component 2/.test(await page.textContent('.gtg-gfacts')), 'glass: sucrose and water');
    check(/90\.0 °C/.test(await page.textContent('.gtg-fbig')), 'glass: Flory–Fox');
    await page.selectOption('.gtg-row >> nth=2 >> .gtg-m', 'AA');
    await page.fill('.gtg-row >> nth=2 >> .gtg-w', '2.0408');
    check(/MMA 58\.0 %, BA 40\.0 %/.test(await page.textContent('.gtg-facts')), `glass: target with acid fixed (${await page.textContent('.gtg-facts')})`);
    await page.click('.gtg-use');
    check(/Tg ≈ 20\.0 °C/.test(await page.textContent('.gtg-big')), 'glass: use composition');
    await page.fill('.gtg-target', '150');
    check(/out of reach/.test(await page.textContent('.gtg-facts')), 'glass: unreachable target');
    await page.selectOption('.gtg-kmode', 'sb');
    check((await page.inputValue('.gtg-k')) === '3.89', 'glass: Simha–Boyer k');

    await page.goto(BASE + '/science/dsc-tga-analyser/');
    await page.waitForFunction(() => document.querySelector('.dtg-big')?.textContent && document.querySelector('.dtg-tbig')?.textContent);
    check((await page.textContent('.dtg-big')) === 'Tg 78.0 °C; exotherm 135.0 °C, 25.0 J/g; melting 250.0 °C, 40.0 J/g', `dsc: events (${await page.textContent('.dtg-big')})`);
    check(/ΔCp 0\.40/.test(await page.textContent('.dtg-tab')) && /10\.7 %/.test(await page.textContent('.dtg-facts')), 'dsc: ΔCp and crystallinity');
    check((await page.textContent('.dtg-tbig')) === '3 mass loss steps; residue 38.4 % at 900.0 °C', `tga: steps (${await page.textContent('.dtg-tbig')})`);
    check(/H₂O \(12\.33 %\)/.test(await page.textContent('.dtg-ttab')) && /CO₂ \(30\.12 %\)/.test(await page.textContent('.dtg-ttab')) && /56\.1 g\/mol/.test(await page.textContent('.dtg-tfacts')), 'tga: fragments and residue');
    await page.selectOption('.dtg-dir', 'endo');
    check(/exotherm 250\.0 °C/.test(await page.textContent('.dtg-big')) && /wrong way/.test(await page.textContent('.dtg-tab')), 'dsc: plot direction flips endo and exo');
    await page.selectOption('.dtg-dir', 'exo');
    await page.fill('.dtg-wp', '50');
    check(/21\.4 %/.test(await page.textContent('.dtg-facts')), 'dsc: filled sample');
    await page.fill('.dtg-dsc', '100, 1\n90, 2\n' + Array.from({ length: 40 }, (_, i) => `${100 + i}, 1`).join('\n'));
    check(/turns back/.test(await page.textContent('.dtg-err')), 'dsc: mixed heating and cooling rejected');
    await page.fill('.dtg-formula', 'Xq2');
    check(/could not be read/.test(await page.textContent('.dtg-tfacts')), 'tga: bad formula explained');

    await page.goto(BASE + '/science/battery-cycling-analyser/');
    await page.waitForFunction(() => document.querySelector('.bcy-big')?.textContent && document.querySelector('.bcy-dbig')?.textContent);
    check((await page.textContent('.bcy-big')) === 'Retention 78.9 % after 200 cycles; 80 % reached at cycle 184', `battery: retention (${await page.textContent('.bcy-big')})`);
    check(/efficiency 88\.0 %/.test(await page.textContent('.bcy-facts')) && /99\.91 %/.test(await page.textContent('.bcy-facts')), 'battery: efficiencies');
    check((await page.textContent('.bcy-dbig')) === '2 peaks: 4.000 V, 4.140 V', `battery: dQ/dV (${await page.textContent('.bcy-dbig')})`);
    await page.fill('.bcy-ref', '3');
    check(/80\.1 % after 200/.test(await page.textContent('.bcy-big')) && /extrapolated/.test(await page.textContent('.bcy-facts')), 'battery: reference cycle 3');
    await page.selectOption('.bcy-order', 'vq');
    check(/swap the column order|hardly changes/.test(await page.textContent('.bcy-derr')), 'battery: wrong column order explained');
    await page.selectOption('.bcy-unit', 'mAh'); await page.fill('.bcy-mass', '10');
    check(/17615\.0 mAh\/g|17,615/.test(await page.textContent('.bcy-facts')) || /mAh\/g on cycle 1/.test(await page.textContent('.bcy-facts')), 'battery: specific capacity');

    await page.goto(BASE + '/science/tafel-corrosion-rate/');
    await page.waitForFunction(() => document.querySelector('.tfl-big')?.textContent && document.querySelector('.tfl-cbig')?.textContent);
    check((await page.textContent('.tfl-big')) === 'icorr 10.0 µA/cm²: about 0.116 mm per year', `corrosion: icorr (${await page.textContent('.tfl-big')})`);
    check(/4\.57 mpy/.test(await page.textContent('.tfl-facts')) && /Wagner–Traud fit.*-650\.0/.test(await page.textContent('.tfl-tab')), 'corrosion: mpy and fit');
    check((await page.textContent('.tfl-cbig')) === 'About 0.166 mm per year', `corrosion: coupon (${await page.textContent('.tfl-cbig')})`);
    await page.selectOption('.tfl-iu', 'mA');
    check(/about 0\.000116 mm per year/.test(await page.textContent('.tfl-big')), `corrosion: mA on 1 cm² is 1000× smaller (${await page.textContent('.tfl-big')})`);
    await page.selectOption('.tfl-iu', 'A/cm²');
    await page.selectOption('.tfl-metal', 'Al');
    check(/0\.109 mm per year/.test(await page.textContent('.tfl-big')), 'corrosion: aluminium');
    await page.fill('.tfl-e2', '400'); await page.fill('.tfl-e1', '300');
    check(/Too few points/.test(await page.textContent('.tfl-err')), 'corrosion: range beyond the scan explained');

    await page.goto(BASE + '/science/nmr-impurity-checker/');
    await page.waitForFunction(() => document.querySelector('.nmi-big')?.textContent);
    check((await page.textContent('.nmi-big')) === '8 of 9 peaks match a solvent or impurity signal; all signals of ethyl acetate are present', `nmr: summary (${await page.textContent('.nmi-big')})`);
    check(/no match: likely your compound/.test(await page.textContent('.nmi-tab')) && /8\.60/.test(await page.textContent('.nmi-imp')), 'nmr: unmatched peaks and missing pyridine signals');
    await page.selectOption('.nmi-sol', 'DMSO');
    await page.fill('.nmi-peaks', '2.50\n3.33\n5.76\n7.95, 2.89, 2.73');
    check(/all signals of DMF/.test(await page.textContent('.nmi-big')) && /dichloromethane/.test(await page.textContent('.nmi-tab')), 'nmr: DMSO-d6 water, DCM and DMF');
    await page.fill('.nmi-find', 'ether');
    check(/diethyl ether/.test(await page.textContent('.nmi-all')) && /3\.40/.test(await page.textContent('.nmi-all')), 'nmr: table search');
    await page.selectOption('.nmi-nuc', 'c');
    check((await page.inputValue('.nmi-tol')) === '0.3' && /outside the usual/.test(await page.textContent('.nmi-err')) === false, 'nmr: 13C switches tolerance');
    await page.fill('.nmi-peaks', '400');
    check(/outside the usual/.test(await page.textContent('.nmi-err')), 'nmr: out-of-range shift explained');

    await page.goto(BASE + '/science/electron-count-calculator/');
    await page.waitForFunction(() => document.querySelector('.eco-big')?.textContent);
    check((await page.textContent('.eco-big')) === 'Fe(II), d⁶, 18 valence electrons', `electron count: ferrocene (${await page.textContent('.eco-big')})`);
    await page.selectOption('.eco-pre', 'wilk');
    check((await page.textContent('.eco-big')) === 'Rh(I), d⁸, 16 valence electrons' && /square-planar/.test(await page.textContent('.eco-facts')), 'electron count: Wilkinson');
    await page.selectOption('.eco-pre', 'coam');
    check(/Co\(III\), d⁶, 18/.test(await page.textContent('.eco-big')) && /\[ML₆\]³⁺/.test(await page.textContent('.eco-facts')), 'electron count: hexaammine cobalt');
    await page.fill('.eco-q', '9');
    check(/whole number/.test(await page.textContent('.eco-err')), 'electron count: silly charge explained');
    await page.fill('.eco-q', '0'); await page.selectOption('.eco-row >> nth=0 >> .eco-l', 'N'); await page.fill('.eco-row >> nth=0 >> .eco-n', '4');
    check(/more than its 9 valence electrons/.test(await page.textContent('.eco-err')), 'electron count: impossible oxidation state explained');

    await page.goto(BASE + '/science/phase-diagram-calculator/');
    await page.waitForFunction(() => document.querySelector('.phd-big')?.textContent && document.querySelector('.phd-lbig')?.textContent);
    check((await page.textContent('.phd-big')) === 'At 1225.0 °C, 35.0 wt % Ni is 55 % liquid and 45 % solid solution', `phase diagram: Cu–Ni (${await page.textContent('.phd-big')})`);
    check(/1237\.1 °C/.test(await page.textContent('.phd-facts')) && /31\.9 wt % Ni/.test(await page.textContent('.phd-facts')), 'phase diagram: liquidus and liquid composition');
    check((await page.textContent('.phd-lbig')) === '68.2 % liquid and 31.8 % α solid', `phase diagram: lever rule (${await page.textContent('.phd-lbig')})`);
    await page.selectOption('.phd-sys', 'BiCd');
    check(/135\.3 °C at 41\.1 wt % Cd/.test(await page.textContent('.phd-facts')) && /23 % solid Bi/.test(await page.textContent('.phd-big')), `phase diagram: Bi–Cd eutectic (${await page.textContent('.phd-big')})`);
    await page.selectOption('.phd-u', 'x');
    check((await page.inputValue('.phd-x')) === '31.7', `phase diagram: units switch keeps the mixture (${await page.inputValue('.phd-x')})`);
    await page.fill('.phd-c0', '50');
    check(/must lie between/.test(await page.textContent('.phd-lerr')), 'phase diagram: lever rule outside the tie line');

    await page.goto(BASE + '/science/decay-calculator/');
    check(/NNDC/.test(await page.textContent('#sources')) && (await page.getAttribute('#sources a', 'href')) === '/contact/?about=rights-decay-calculator#rights', 'sources: listed with a removal-request link');
    await page.goto(BASE + '/contact/');
    check(/data removal requests/.test(await page.textContent('#rights')), 'contact: rights requests section');

    await page.goto(BASE + '/science/ir-band-finder/');
    await page.waitForFunction(() => document.querySelector('.irb-big')?.textContent && document.querySelector('.irb-sbig')?.textContent);
    check(/Consistent with: .*ester/.test(await page.textContent('.irb-big')) && /alkyl chain/.test(await page.textContent('.irb-big')), `ir: ester example (${await page.textContent('.irb-big')})`);
    check(/ruled out by another band/.test(await page.textContent('.irb-grp')), 'ir: ether ruled out');
    check(/^9 peaks: 2984, 2940/.test(await page.textContent('.irb-sbig')), `ir: peaks picked from the spectrum (${await page.textContent('.irb-sbig')})`);
    await page.fill('.irb-peaks', '3300-2500 br, 1710, 1290');
    check(/carboxylic acid/.test(await page.textContent('.irb-big')), 'ir: carboxylic acid');
    await page.click('.irb-use');
    check(/^2984, 2940/.test(await page.inputValue('.irb-peaks')), 'ir: picked peaks sent to the list');
    await page.fill('.irb-find', '2250');
    check(/nitrile/.test(await page.textContent('.irb-all')), 'ir: table search by wavenumber');
    check(/5\.831 µm/.test(await page.textContent('.irb-conv')), 'ir: cm⁻¹ to µm');
    await page.fill('.irb-peaks', '5.8');
    check(/between 300 and 5000/.test(await page.textContent('.irb-err')), 'ir: µm typed by mistake');

    await page.goto(BASE + '/science/point-group-finder/');
    await page.waitForFunction(() => document.querySelector('.pgf-big')?.textContent && document.querySelector('.pgf-fbig')?.textContent);
    check((await page.textContent('.pgf-big')) === 'Point group D₃h', `point group: BF3 (${await page.textContent('.pgf-big')})`);
    check(/12/.test(await page.textContent('.pgf-facts')) && /σh/.test(await page.textContent('.pgf-facts')), 'point group: order and elements');
    await page.selectOption('.pgf-ex', 'ch4');
    check((await page.textContent('.pgf-big')) === 'Point group Td', 'point group: methane');
    await page.selectOption('.pgf-ex', 'h2o2');
    check(/Chiral\?yes/.test(await page.textContent('.pgf-facts')), 'point group: H2O2 chiral');
    await page.selectOption('.pgf-view', 'side');
    check(!(await page.isHidden('.pgf-fig')), 'point group: side view drawn');
    await page.fill('.pgf-xyz', 'O 0 0 0\nH 0.757 0.586\nH -0.757 0.586 0');
    check(/not "element x y z"/.test(await page.textContent('.pgf-err')), 'point group: bad line explained');
    await page.setInputFiles('.pgf-file', { name: 'w.xyz', mimeType: 'text/plain', buffer: Buffer.from('3\nwater\nO 0 0 0\nH 0.757 0.586 0\nH -0.757 0.586 0\n') });
    await page.waitForFunction(() => document.querySelector('.pgf-big')?.textContent === 'Point group C₂v');
    check(true, 'point group: .xyz file opened');
    await page.selectOption('.pgf-n', '2'); await page.selectOption('.pgf-c2', '0'); await page.selectOption('.pgf-sh', '0');
    check((await page.textContent('.pgf-fbig')) === 'Point group C₂v' && /Water/.test(await page.textContent('.pgf-ffacts')), 'point group: flowchart');

    await page.goto(BASE + '/science/impedance-fitter/');
    await page.waitForFunction(() => document.querySelector('.eis-big')?.textContent);
    check((await page.textContent('.eis-big')) === 'R(Q(RW)) fit: Rs 19.98 Ω, Rct 100.1 Ω (error 0.079 % rms)', `eis: Randles (${await page.textContent('.eis-big')})`);
    check(/10\.02 µF/.test(await page.textContent('.eis-facts')) && /3\.632 mA\/cm²/.test(await page.textContent('.eis-facts')), 'eis: effective capacitance and i0');
    check(/values not pinned down/.test(await page.textContent('.eis-cmp')), 'eis: comparison flags the two-arc circuit');
    await page.selectOption('.eis-model', 'RC');
    check(!(await page.isHidden('.eis-warn')) && /misses the data/.test(await page.textContent('.eis-warn')), 'eis: poor fit warned');
    await page.fill('.eis-data', '100\t10\t-5\n10\t20\t-8');
    check(/at least 6 frequencies/.test(await page.textContent('.eis-err')), 'eis: too few points');

    await page.goto(BASE + '/science/enzyme-kinetics-fitter/');
    await page.waitForFunction(() => document.querySelector('.enz-big')?.textContent);
    check((await page.textContent('.enz-big')) === 'Competitive inhibition: Vmax 98.1 ± 0.36 µM/min, Km 19.2 ± 0.24 µM, Ki 9.82 ± 0.15 µM', `enzyme: competitive chosen (${await page.textContent('.enz-big')})`);
    check(/9813 per min/.test(await page.textContent('.enz-facts')) && /8\.52 per µM per s/.test(await page.textContent('.enz-facts')), 'enzyme: kcat and kcat/Km');
    check(/Mixed inhibition40\.346 %also supported/.test(await page.textContent('.enz-cmp')), 'enzyme: comparison table');
    check(/Lineweaver–Burk \(1\/v against 1\/S\)10220\.8/.test(await page.textContent('.enz-lin')), 'enzyme: straight-line values');
    await page.selectOption('.enz-model', 'mm');
    check(/choose an inhibition model/.test(await page.textContent('.enz-err')), 'enzyme: model needs the right columns');
    await page.selectOption('.enz-model', 'best');
    await page.fill('.enz-data', 'S v\n1 9\n2 17\n5 33\n10 50\n20 66\n40 80\n80 89');
    check(/^Michaelis–Menten: Vmax 100 ± 0\.40 µM\/min, Km 10\.1 ± 0\.13 µM$/.test(await page.textContent('.enz-big')), `enzyme: two columns (${await page.textContent('.enz-big')})`);
    await page.fill('.enz-data', 'S v\n1 9\n2 17\n5 33');
    check(/highest \[S\] is only/.test(await page.textContent('.enz-facts')) || /Use more rates/.test(await page.textContent('.enz-err')), 'enzyme: short substrate range flagged');
    await page.fill('.enz-data', 'S v\n0 0\n2 17\n5 33\n10 50');
    check(/above zero/.test(await page.textContent('.enz-err')), 'enzyme: zero substrate refused');

    await page.goto(BASE + '/science/buffer-recipe-calculator/');
    await page.waitForFunction(() => document.querySelector('.buf-big')?.textContent);
    check((await page.textContent('.buf-big')) === '6.057 g Tris base + 28.4 mL 1 M HCl in 1000 mL', `buffer: Tris recipe (${await page.textContent('.buf-big')})`);
    check(/pH at 4 °C8\.63/.test(await page.textContent('.buf-facts')) && /pKa′ 8\.12/.test(await page.textContent('.buf-facts')), 'buffer: cold-room pH and pKa′');
    await page.fill('.buf-ph', '7.4'); await page.selectOption('.buf-b', 'phosphate'); await page.selectOption('.buf-mode', 'two'); await page.fill('.buf-c', '100');
    check((await page.textContent('.buf-big')) === '2.425 g sodium dihydrogen phosphate + 11.33 g disodium hydrogen phosphate in 1000 mL', `buffer: phosphate pair (${await page.textContent('.buf-big')})`);
    check(/H₂A⁻20\.2 %20\.2 mM/.test(await page.textContent('.buf-sp')), 'buffer: species table');
    await page.fill('.buf-ph', '10');
    check(/only reach between pH 4\.48 and 9\.22/.test(await page.textContent('.buf-err')), 'buffer: pair out of reach');
    await page.selectOption('.buf-b', 'tricine');
    check(/one form only/.test(await page.textContent('.buf-err')), 'buffer: single-form buffer');
    await page.selectOption('.buf-mode', 'one'); await page.fill('.buf-ph', '15');
    check(/between 0 and 14/.test(await page.textContent('.buf-err')), 'buffer: pH range');

    await page.goto(BASE + '/science/binding-curve-fitter/');
    await page.waitForFunction(() => document.querySelector('.bnd-big')?.textContent);
    check((await page.textContent('.bnd-big')) === 'One site: Bmax 1204 ± 11 fmol/mg, Kd 2.51 ± 0.083 nM', `binding: one site chosen (${await page.textContent('.bnd-big')})`);
    check(/2\.51, 22\.6 and 249 nM/.test(await page.textContent('.bnd-facts')) && /Kd 2\.59 nM, Bmax 1214/.test(await page.textContent('.bnd-facts')), 'binding: occupancy and Scatchard');
    check((await page.textContent('.bnd-ki')) === 'Ki = 22.3 nM (IC50 is 1.80 × Ki)', `binding: Cheng–Prusoff (${await page.textContent('.bnd-ki')})`);
    const bv = await page.inputValue('.bnd-data');
    await page.fill('.bnd-data', bv.split('\n').map((r) => r.split('\t').slice(0, 2).join('\t')).join('\n'));
    check(/^One site \+ non-specific: Bmax 1210 ± 36 fmol\/mg, Kd 2\.53 ± 0\.15 nM, NS 14\.1/.test(await page.textContent('.bnd-big')), `binding: total binding (${await page.textContent('.bnd-big')})`);
    await page.selectOption('.bnd-model', 'tight');
    await page.fill('.bnd-data', '0\t0.1\n0.2\t0.26\n0.5\t0.5\n1\t0.74\n1.5\t0.85\n2\t0.88\n3\t0.89\n5\t0.9\n10\t0.9');
    check(/^Tight binding/.test(await page.textContent('.bnd-big')) && /very tight/.test(await page.textContent('.bnd-facts')), 'binding: tight-binding titration');
    await page.fill('.bnd-rt', '');
    check(/receptor or protein concentration/.test(await page.textContent('.bnd-err')), 'binding: tight binding needs the receptor');
    await page.fill('.bnd-data', '1\t2\n2\t3');
    check(/at least four/.test(await page.textContent('.bnd-err')), 'binding: too few points');

    await page.goto(BASE + '/science/centrifuge-calculator/');
    await page.waitForFunction(() => document.querySelector('.cen-cbig')?.textContent);
    check((await page.textContent('.cen-big')) === '13,000 rpm = 17,953 × g at 9.5 cm', `centrifuge: rpm to g (${await page.textContent('.cen-big')})`);
    check((await page.textContent('.cen-kbig')) === 'k-factor 119.3: 70 S particles pellet in about 102 min', `centrifuge: k-factor (${await page.textContent('.cen-kbig')})`);
    check((await page.textContent('.cen-cbig')) === 'Run your rotor for about 48 min at 45,000 rpm', 'centrifuge: protocol in another rotor');
    await page.fill('.cen-g', '1000');
    check((await page.inputValue('.cen-rpm')) === '3068', 'centrifuge: g to rpm');
    await page.fill('.cen-rmax', '3');
    check(/must be larger than the minimum/.test(await page.textContent('.cen-kerr')), 'centrifuge: bad radii');

    await page.goto(BASE + '/science/air-quality-calculator/');
    await page.waitForFunction(() => document.querySelector('.aq-hbig')?.textContent);
    check((await page.textContent('.aq-big')) === '100 µg/m³ NO2 = 53.18 ppb', `air quality: unit conversion (${await page.textContent('.aq-big')})`);
    check((await page.textContent('.aq-us')) === 'US AQI 102: Unhealthy for sensitive groups (from PM2.5)', `air quality: US AQI (${await page.textContent('.aq-us')})`);
    check((await page.textContent('.aq-in-big')) === 'India AQI 126: Moderately polluted (from Ozone, 8-hour)', `air quality: India AQI (${await page.textContent('.aq-in-big')})`);
    check((await page.textContent('.aq-hbig')) === 'AQHI 4: Moderate risk', 'air quality: AQHI');
    await page.fill('.aq-hp1', '85');
    check((await page.textContent('.aq-hbig')) === 'AQHI 9: High risk', 'air quality: AQHI+ in smoke');
    await page.selectOption('.aq-gas', ''); await page.fill('.aq-f', 'Xq2');
    check(/not an element/.test(await page.textContent('.aq-err')), 'air quality: bad formula');

    await page.goto(BASE + '/science/altermagnet-checker/');
    await page.waitForFunction(() => document.querySelector('.alt-big')?.textContent);
    check((await page.textContent('.alt-big')) === 'Altermagnet (d-wave)' && /Δ\(k\) ∝ kxky/.test(await page.textContent('.alt-facts')), `altermagnet: rutile (${await page.textContent('.alt-big')})`);
    check(/4-fold screw \(\+90°\) about \[0 0 1\]/.test(await page.textContent('.alt-facts')), 'altermagnet: names the 4₂ screw');
    await page.selectOption('.alt-ex', 'nias');
    check((await page.textContent('.alt-big')) === 'Altermagnet (g-wave)', 'altermagnet: MnTe g-wave');
    await page.selectOption('.alt-ex', 'bcc');
    check((await page.textContent('.alt-big')) === 'Conventional antiferromagnet' && (await page.isHidden('.alt-map')), 'altermagnet: bcc antiferromagnet, no map');
    await page.selectOption('.alt-ex', 'ferri');
    check((await page.textContent('.alt-big')) === 'Ferrimagnet', 'altermagnet: ferrimagnet');
    await page.fill('.alt-in', 'hello');
    await page.waitForFunction(() => !document.querySelector('.alt-err')?.hidden);
    check(/is not "cell a b c/.test(await page.textContent('.alt-err')), 'altermagnet: bad line');

    await page.goto(BASE + '/science/gaussian-plume-calculator/');
    await page.waitForFunction(() => document.querySelector('.gp-big')?.textContent);
    check(/^Highest at the ground: 217 µg\/m³ \(82\.9 ppb\), 97\d m downwind$/.test(await page.textContent('.gp-big')), `plume: worked example (${await page.textContent('.gp-big')})`);
    check(/BC: moderately unstable to slightly unstable/.test(await page.textContent('.gp-facts')) && /82\.8 m/.test(await page.textContent('.gp-facts')), 'plume: class and rise');
    await page.uncheck('.gp-rise'); await page.selectOption('.gp-cls', 'D');
    check(/^Highest at the ground: 951 µg\/m³ .*, 81\d m downwind$/.test(await page.textContent('.gp-big')), `plume: no rise, class D (${await page.textContent('.gp-big')})`);
    check(await page.isHidden('.gp-skyl') && await page.isHidden('.gp-rbox'), 'plume: hides unused inputs');
    await page.fill('.gp-u', '0.2');
    check(/at least 0\.5 m\/s/.test(await page.textContent('.gp-err')), 'plume: calm wind refused');

    await page.goto(BASE + '/science/mccabe-thiele-calculator/');
    await page.waitForFunction(() => document.querySelector('.mct-big')?.textContent);
    check((await page.textContent('.mct-big')) === '12 theoretical stages (11.67 stepped), feed on stage 6', `mccabe: worked example (${await page.textContent('.mct-big')})`);
    check(/1\.100/.test(await page.textContent('.mct-facts')) && /16/.test(await page.textContent('.mct-facts')) && /D = 50, B = 50/.test(await page.textContent('.mct-facts')), 'mccabe: Rmin, trays and flows');
    await page.selectOption('.mct-rm', 'total');
    check(/^7 stages at total reflux \(minimum: 6\.\d\d\)$/.test(await page.textContent('.mct-big')), `mccabe: total reflux (${await page.textContent('.mct-big')})`);
    await page.selectOption('.mct-rm', 'abs'); await page.fill('.mct-r', '1');
    check(/at or below the minimum, 1\.100/.test(await page.textContent('.mct-err')), 'mccabe: below minimum reflux');
    await page.fill('.mct-r', '2'); await page.selectOption('.mct-mode', 'data');
    check(!(await page.isHidden('.mct-dbox')) && /theoretical stages/.test(await page.textContent('.mct-big')), `mccabe: data mode (${await page.textContent('.mct-big')})`);

    await page.goto(BASE + '/science/vapour-pressure-calculator/');
    await page.waitForFunction(() => document.querySelector('.vp-big')?.textContent);
    check((await page.textContent('.vp-big')) === 'At 101.3 kPa, it starts to boil at 92.07 °C and is all vapour at 98.73 °C', `vle: worked example (${await page.textContent('.vp-big')})`);
    check(/43\.7 % vapour/.test(await page.textContent('.vp-facts')) && /2\.471 \(mean\)/.test(await page.textContent('.vp-facts')), 'vle: flash and alpha');
    check(/80\.06 °C/.test(await page.textContent('.vp-pure')) && /157\.1 kPa/.test(await page.textContent('.vp-pure')), 'vle: pure table');
    await page.selectOption('.vp-comp[data-k="1"] .vp-ex', '0'); await page.fill('.vp-p', '70');
    check(/90\.03 °C/.test(await page.textContent('.vp-pure')), 'vle: water boils at 90 °C at 70 kPa');
    await page.fill('.vp-comp[data-k="1"] .vp-b', 'x');
    check(/Enter numbers for A, B and C of Water/.test(await page.textContent('.vp-err')), 'vle: bad constants');

    await page.goto(BASE + '/science/radiometric-age-calculator/');
    await page.waitForFunction(() => document.querySelector('.ra-big3')?.textContent);
    check((await page.textContent('.ra-big1')) === 'Age: 3436 ± 34 Ma', `geochron: ratio age (${await page.textContent('.ra-big1')})`);
    check((await page.textContent('.ra-big2')) === 'Isochron age: 1250.4 ± 3.1 Ma', `geochron: isochron (${await page.textContent('.ra-big2')})`);
    check(/0\.703474 ± 0\.000050/.test(await page.textContent('.ra-f2')) && /0\.51 \(7 points\)/.test(await page.textContent('.ra-f2')), 'geochron: initial ratio and MSWD');
    check((await page.textContent('.ra-big3')) === '²⁰⁷Pb/²⁰⁶Pb age 1896 ± 14 Ma; 10.8 % discordant', `geochron: U-Pb (${await page.textContent('.ra-big3')})`);
    await page.selectOption('.ra-m', 'kar');
    check((await page.textContent('.ra-big1')) === 'K-Ar age: 89.98 Ma', `geochron: K-Ar (${await page.textContent('.ra-big1')})`);
    await page.selectOption('.ra-m', 'arar');
    check((await page.textContent('.ra-big1')) === '⁴⁰Ar/³⁹Ar age: 69.69 ± 0.18 Ma', `geochron: Ar-Ar (${await page.textContent('.ra-big1')})`);
    await page.fill('.ra-data', '1 0.1 2 0.1');
    check(/at least three rows/.test(await page.textContent('.ra-err2')), 'geochron: too few isochron points');

    await page.goto(BASE + '/science/isotope-delta-converter/');
    await page.waitForFunction(() => document.querySelector('.d8-big5')?.textContent);
    check((await page.inputValue('.d8-r')) === '0.001988156', `delta: ratio from δ (${await page.inputValue('.d8-r')})`);
    check((await page.textContent('.d8-big2')) === '−5.20 ‰ vs VPDB = +25.56 ‰ vs VSMOW', `delta: scale (${await page.textContent('.d8-big2')})`);
    check(/1\.030151/.test(await page.textContent('.d8-f3')) && /\+29\.71 ‰/.test(await page.textContent('.d8-f3')), 'delta: fractionation');
    check(/−20 per meg/.test(await page.textContent('.d8-f4')), 'delta: Δ17O');
    check((await page.textContent('.d8-big5')) === 'Mixture: −17.33 ‰' && /64\.3 %/.test(await page.textContent('.d8-f5')), 'delta: mixing');
    await page.fill('.d8-r', '0.0020'); 
    check((await page.inputValue('.d8-d')) === '-2.593', `delta: δ from ratio (${await page.inputValue('.d8-d')})`);
    await page.fill('.d8-t', '-40');
    check(/not possible/.test(await page.textContent('.d8-f5')), 'delta: impossible target');

    await page.goto(BASE + '/science/mixing-model-calculator/');
    await page.waitForFunction(() => document.querySelector('.mx-big')?.textContent);
    check((await page.textContent('.mx-big')) === '4 samples unmixed into Rain, Soil water, Groundwater', `mixing: summary (${await page.textContent('.mx-big')})`);
    check(/Stream120\.128\.851\.10\.003/.test((await page.textContent('.mx-tab')).replace(/\s+/g, '')), 'mixing: stream 1 fractions');
    await page.fill('.mx-sm', 'sample\tCl\tSO4\td18O\nOdd\t0.5\t1\t-13');
    check(/Odd: Rain 100\.0 %/.test(await page.textContent('.mx-big')) && /outside/.test(await page.textContent('.mx-tab')), 'mixing: outside sample');
    await page.fill('.mx-sm', 'sample\tCl\tSO4\nX\t1\t2');
    check(/same columns as the sources/.test(await page.textContent('.mx-err')), 'mixing: missing column');

    await page.goto(BASE + '/science/ternary-plot-maker/');
    await page.waitForFunction(() => document.querySelector('.tr-big')?.textContent && document.querySelector('.sp-big')?.textContent);
    check((await page.textContent('.tr-big')) === '8 points in 2 groups', `ternary: summary (${await page.textContent('.tr-big')})`);
    check(/RiverA471\.616\.511\.9/.test((await page.textContent('.tr-tab')).replace(/\s+/g, '')) && /RiverB439\.534\.226\.3/.test((await page.textContent('.tr-tab')).replace(/\s+/g, '')), 'ternary: group centres');
    check((await page.textContent('.sp-big')) === '2 samples, 14 elements, normalised to Reference (made up)', `spider: summary (${await page.textContent('.sp-big')})`);
    check(/Eu\/Eu\* 0\.60, \(La\/Yb\)N 8\.4/.test(await page.textContent('.sp-facts')), `spider: Eu anomaly (${await page.textContent('.sp-facts')})`);
    await page.selectOption('.tr-b', { index: 0 });
    check(/three different columns/.test(await page.textContent('.tr-err')), 'ternary: same corner twice explained');
    await page.fill('.tr-data', 'a\tb\tc\td\nx\t1\t2\t3\ny\t-1\t2\t3');
    check(/^1 point; 1 row skipped/.test(await page.textContent('.tr-big')), `ternary: negative row skipped (${await page.textContent('.tr-big')})`);
    await page.fill('.sp-data', 'x\tLa');
    check(/header row of element names/.test(await page.textContent('.sp-err')), 'spider: too little data explained');

    await page.goto(BASE + '/science/piper-diagram/');
    await page.waitForFunction(() => document.querySelector('.pp-big')?.textContent);
    check((await page.textContent('.pp-big')) === '6 samples in 2 groups; all ion balances within 5 %', `piper: summary (${await page.textContent('.pp-big')})`);
    const ppTab = (await page.textContent('.pp-tab')).replace(/\s+/g, '');
    check(/W15\.055\.10-0\.5Ca-Mg-HCO₃Ca-Mg-HCO₃210/.test(ppTab) && /D112\.7012\.70-0\.0Na-ClNa-K-Cl-SO₄175/.test(ppTab), `piper: W1 and D1 rows (${ppTab.slice(0, 200)})`);
    await page.fill('.pp-data', 'site\tCa (meq/L)\tMg\tNa+K\tAlk\tSulfate\tChloride\nX\t5.5\t0\t0\t4.5\t0\t0');
    await page.selectOption('.pp-unit', 'meq');
    check(/1 with an ion balance error above 5 %/.test(await page.textContent('.pp-big')) && /\+10\.0 \(check\)/.test(await page.textContent('.pp-tab')), `piper: meq input, alkalinity and a bad balance (${await page.textContent('.pp-big')})`);
    await page.fill('.pp-data', 'site\tCa\tMg\tNa\tCl\nX\t1\t2\t3\t4');
    check(/Add a column for SO4, HCO3 or Alk/.test(await page.textContent('.pp-err')), 'piper: missing columns explained');

    await page.goto(BASE + '/science/pump-test-analyser/');
    await page.waitForFunction(() => document.querySelector('.pt-big')?.textContent && document.querySelector('.dd-big')?.textContent);
    check((await page.textContent('.pt-big')) === 'T = 250 m²/day, S = 2.0 × 10⁻⁴ (Theis fit)', `pump test: Theis fit (${await page.textContent('.pt-big')})`);
    check(/Cooper-Jacob lineT 252 m²\/day/.test(await page.textContent('.pt-facts')), 'pump test: Cooper-Jacob');
    check((await page.textContent('.rc-big')) === 'T = 253 m²/day from recovery' && (await page.textContent('.dd-big')) === 'T = 251 m²/day, S = 1.9 × 10⁻⁴ from 4 wells', 'pump test: recovery and distance-drawdown');
    await page.fill('.pt-b', '20');
    check(/12\.5 m\/day/.test(await page.textContent('.pt-facts')), `pump test: K from thickness (${await page.textContent('.pt-facts')})`);
    await page.selectOption('.pt-qu', 'm3h');
    check(/^T = 60\d\d m²\/day/.test(await page.textContent('.pt-big')), `pump test: rate unit scales T (${await page.textContent('.pt-big')})`);
    await page.fill('.pt-data', 'time\tdrawdown\n1\t0.1');
    check(/at least three readings/.test(await page.textContent('.pt-err')), 'pump test: too few readings explained');
    await page.fill('.rc-data', '');
    check(await page.isHidden('.rc-out'), 'pump test: recovery card optional');

    await page.goto(BASE + '/science/slug-test-analyser/');
    await page.waitForFunction(() => document.querySelector('.sl-big')?.textContent);
    check((await page.textContent('.sl-big')) === 'K = 1.0 × 10⁻⁵ m/s (0.864 m/day), Hvorslev' && /70\.8 s/.test(await page.textContent('.sl-facts')), `slug: example (${await page.textContent('.sl-big')})`);
    await page.fill('.sl-lnre', '2.5');
    check(/Bouwer-RiceK = 7\.4 × 10⁻⁶ m\/s/.test(await page.textContent('.sl-facts')), `slug: Bouwer-Rice (${await page.textContent('.sl-facts')})`);
    await page.selectOption('.sl-kind', 'depth');
    check(/static level/.test(await page.textContent('.sl-err')), 'slug: static level needed');
    await page.fill('.sl-data', 'time\tdepth\n0\t2\n10\t2.5\n20\t2.75\n30\t2.875'); await page.fill('.sl-static', '3');
    check(/^K = /.test(await page.textContent('.sl-big')) && /14\.4 s/.test(await page.textContent('.sl-facts')), `slug: depth to water, rising head (${await page.textContent('.sl-facts')})`);

    await page.goto(BASE + '/science/darcy-flow-calculator/');
    await page.waitForFunction(() => document.querySelector('.dc-big')?.textContent && document.querySelector('.gs-big')?.textContent);
    check((await page.textContent('.dc-big')) === 'Seepage velocity 0.0800 m/day; 500 m takes 17.1 years' && /15\.5 darcy/.test(await page.textContent('.dc-facts')), `darcy: example (${await page.textContent('.dc-big')})`);
    check((await page.textContent('.gw-big')) === 'Gradient 0.00150, water flows towards 70.6° (east)', `darcy: three wells (${await page.textContent('.gw-big')})`);
    check((await page.textContent('.gs-big')) === 'd10 = 0.129 mm, Hazen K ≈ 14 m/day' && /Uniformity Cu = d60\/d103\.76/.test(await page.textContent('.gs-facts')), 'darcy: grain size');
    await page.selectOption('.dc-isrc', 'wells'); await page.selectOption('.dc-ksrc', 'hazen');
    check(/Gradient i0\.0015/.test(await page.textContent('.dc-facts')) && /K used14\.3 m\/day/.test(await page.textContent('.dc-facts')), `darcy: linked gradient and Hazen K (${await page.textContent('.dc-facts')})`);
    await page.fill('.gw-data', 'a\t0\t0\t1\nb\t1\t1\t2\nc\t2\t2\t3');
    check(/straight line/.test(await page.textContent('.gw-err')) && /not available/.test(await page.textContent('.dc-err')), 'darcy: wells in a line explained');

    await page.goto(BASE + '/science/well-field-drawdown/');
    await page.waitForFunction(() => document.querySelector('.wf-big')?.textContent && document.querySelector('.cz-big')?.textContent);
    check((await page.textContent('.wf-big')) === 'Drawdown at (200, 100) on day 30: 2.17 m', `well field: example (${await page.textContent('.wf-big')})`);
    check((await page.textContent('.cz-big')) === 'Capture zone 800 m wide upstream; stagnation point 127 m downstream', 'well field: capture zone');
    await page.selectOption('.wf-bk', 'head');
    check((await page.textContent('.wf-big')) === 'Drawdown at (200, 100) on day 30: 0.749 m', `well field: river boundary (${await page.textContent('.wf-big')})`);
    await page.selectOption('.wf-bk', 'noflow');
    check(+((await page.textContent('.wf-big')).match(/([\d.]+) m$/) || [])[1] > 2.17, 'well field: no-flow boundary raises drawdown');
    await page.fill('.wf-t', '5');
    check(/1 of 3/.test(await page.textContent('.wf-facts')), 'well field: wells start on their day');
    await page.fill('.cz-k', '0');
    check(/above zero/.test(await page.textContent('.cz-err')), 'well field: bad capture input explained');

    await page.goto(BASE + '/science/grade-tonnage-calculator/');
    await page.waitForFunction(() => document.querySelector('.gt-big')?.textContent);
    check((await page.textContent('.gt-big')) === 'Breakeven cut-off 0.184 %: 929 kt at 0.454 %' && /Marginal \(mill\) cut-off0\.150 %/.test(await page.textContent('.gt-facts')), `grade-tonnage: example (${await page.textContent('.gt-big')})`);
    check(/0\.4379kt0\.689/.test((await page.textContent('.gt-tab')).replace(/\s+/g, ' ').replace(/ /g, '')), 'grade-tonnage: table row');
    await page.fill('.gt-data', 'b\tvolume\tdensity\tgrade\nA\t1000\t2.7\t2.5\nB\t1000\t2.7\t0.5');
    await page.selectOption('.gt-gu', 'gpt');
    check(/^Breakeven cut-off [\d.]+ g\/t: 5\.40 kt at 1\.50 g\/t$/.test(await page.textContent('.gt-big')), `grade-tonnage: gold from volume and density (${await page.textContent('.gt-big')})`);
    await page.fill('.gt-rec', '0');
    check(/recovery/.test(await page.textContent('.gt-err')), 'grade-tonnage: bad economics explained');
    await page.goto(BASE + '/science/drill-hole-composites/');
    await page.waitForFunction(() => document.querySelector('.dh-big')?.textContent);
    check((await page.textContent('.dh-big')) === '3 holes, 49 samples; best intercept 4.0 m @ 4.72 g/t from 9.0 m (DDH-03)', `drill holes: example (${await page.textContent('.dh-big')})`);
    const dhi = await page.textContent('.dh-int');
    check(dhi.includes('DDH-01: 6.0 m @ 2.51 g/t from 20.0 m, including 4.0 m @ 3.13 g/t from 21.0 m') && /DDH-02 gap 20\.0–21\.0 m/.test(await page.textContent('.dh-facts')), `drill holes: intercepts and gap (${dhi})`);
    check((await page.textContent('.dh-tab')).replace(/\s+/g, '').includes('DDH-01202222.64100%'), 'drill holes: composite table');
    await page.fill('.dh-cap', '10');
    check((await page.textContent('.dh-big')).endsWith('4.0 m @ 4.37 g/t from 9.0 m (DDH-03)'), `drill holes: top cut (${await page.textContent('.dh-big')})`);
    await page.selectOption('.dh-mode', 'lith');
    check(/QV/.test(await page.textContent('.dh-tab')) && (await page.isDisabled('.dh-len')), 'drill holes: lithology composites');
    await page.fill('.dh-data', 'A\t0\t2\t1\nA\t2\t2\t1');
    check(/1 to look at/.test(await page.textContent('.dh-facts')), 'drill holes: bad row flagged');
    await page.fill('.dh-cut', '0');
    check(/cut-off/.test(await page.textContent('.dh-err')), 'drill holes: bad settings explained');
    await page.goto(BASE + '/science/traverse-calculator/');
    await page.waitForFunction(() => document.querySelector('.tv-big')?.textContent);
    check((await page.textContent('.tv-big')) === 'Misclosure 0.015 m, precision 1 : 61,500' && /60621\.6 m² \(6\.0622 ha\)/.test(await page.textContent('.tv-facts')), `traverse: example (${await page.textContent('.tv-big')})`);
    check((await page.textContent('.tc-x')) === 'The lines cross at E 5251.053, N 5000.000, 251.053 m from A and 151.007 m from B.', `traverse: intersection (${await page.textContent('.tc-x')})`);
    await page.selectOption('.tv-mode', 'angle');
    check(/Angular misclosure13\.0″/.test(await page.textContent('.tv-facts')) && (await page.textContent('.tv-big')).endsWith('1 : 62,100'), `traverse: angle mode (${await page.textContent('.tv-big')})`);
    await page.selectOption('.tv-mode', 'bearing');
    await page.selectOption('.tv-type', 'link');
    await page.fill('.tv-data', 'A\t90\t50\nB\tN 90 E\t50.1');
    await page.fill('.tv-e0', '0'); await page.fill('.tv-n0', '0'); await page.fill('.tv-e1', '100'); await page.fill('.tv-n1', '0');
    check((await page.textContent('.tv-big')) === 'Misclosure 0.100 m, precision 1 : 1,000' && !/Area/.test(await page.textContent('.tv-facts')), `traverse: link traverse (${await page.textContent('.tv-big')})`);
    await page.selectOption('.tc-kind', 'dd');
    await page.fill('.tc-va', '1');
    check(/do not meet/.test(await page.textContent('.tc-x')), 'traverse: circles that miss explained');
    await page.fill('.tv-data', 'nothing');
    check(/at least two legs/.test(await page.textContent('.tv-err')), 'traverse: bad input explained');
    await page.goto(BASE + '/science/level-book-reducer/');
    await page.waitForFunction(() => document.querySelector('.lv-big')?.textContent);
    check((await page.textContent('.lv-big')) === 'Closing error +4.0 mm (allowed 4.9 mm): within the limit', `level book: example (${await page.textContent('.lv-big')})`);
    const lvf = await page.textContent('.lv-facts');
    check(/0\.615 = 0\.615height of collimation agrees/.test(lvf) && /Full collimation checkagrees/.test(lvf) && /−1\.3 mm per setup/.test(lvf), `level book: checks (${lvf.slice(0, 200)})`);
    check((await page.textContent('.lv-tab')).replace(/\s+/g, '').includes('BMB2.0210.43385.825-0.00485.821165'), 'level book: table row');
    await page.fill('.lv-k', '6'); await page.selectOption('.lv-kb', 'setup');
    check((await page.textContent('.lv-big')) === 'Closing error +4.0 mm (allowed 10.4 mm): within the limit', `level book: k per setup (${await page.textContent('.lv-big')})`);
    await page.selectOption('.lv-close', 'loop');
    check(/too large/.test(await page.textContent('.lv-big')), 'level book: loop that does not close flagged');
    await page.fill('.lv-data', 'A\t1.2\t\t\nB\t\t1.0\t');
    check(/last reading must be a fore sight/.test(await page.textContent('.lv-err')), 'level book: bad book explained');
    await page.goto(BASE + '/science/gps-track-analyser/');
    await page.waitForFunction(() => document.querySelector('.gp-big')?.textContent);
    check((await page.textContent('.gp-big')) === '4.75 km in 29:00 moving (6:06 /km)', `gps: example (${await page.textContent('.gp-big')})`);
    const gpf = await page.textContent('.gp-facts');
    check(/Climbing\+44 m \/ −44 m/.test(gpf) && /1 jump skipped/.test(gpf) && /2:00 stopped/.test(gpf), `gps: facts (${gpf.slice(0, 160)})`);
    check((await page.textContent('.gp-tab')).replace(/\s+/g, '').includes('115:175:175:1711.3'), 'gps: first split');
    await page.selectOption('.gp-units', 'mi');
    check(/^2\.95 mi in 29:00 moving \(9:49 \/mi\)$/.test(await page.textContent('.gp-big')), `gps: miles (${await page.textContent('.gp-big')})`);
    // A GPX file with two segments, opened from disk: read on the device, no distance across the gap.
    const gpx = '<?xml version="1.0"?><gpx version="1.1" creator="test" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg>' +
      '<trkpt lat="0" lon="0"><ele>10</ele><time>2026-01-01T00:00:00Z</time></trkpt><trkpt lat="0.00905" lon="0"><ele>20</ele><time>2026-01-01T00:05:00Z</time></trkpt></trkseg><trkseg>' +
      '<trkpt lat="1" lon="1"><ele>20</ele><time>2026-01-01T01:00:00Z</time></trkpt><trkpt lat="1.00905" lon="1"><ele>20</ele><time>2026-01-01T01:05:00Z</time></trkpt></trkseg></trk></gpx>';
    writeFileSync(OUT + 'track.gpx', gpx);
    await page.selectOption('.gp-units', 'km');
    await page.setInputFiles('.gp-in', OUT + 'track.gpx');
    await page.waitForFunction(() => /2 segments/.test(document.querySelector('.gp-facts')?.textContent ?? ''));
    check(/^2\.00 km in 10:00 moving/.test(await page.textContent('.gp-big')) && /on this device/.test(await page.textContent('.gp-note')), `gps: GPX file (${await page.textContent('.gp-big')})`);
    await page.fill('.gp-data', 'nothing here');
    check(/No track found/.test(await page.textContent('.gp-err')), 'gps: bad input explained');
    await page.goto(BASE + '/science/spectral-index-calculator/');
    await page.waitForFunction(() => document.querySelector('.sp-big')?.textContent);
    check((await page.textContent('.sp-big')) === 'Mean NDVI 0.44; 53 % of pixels above 0.3 (14.4 km²)', `spectral: example (${await page.textContent('.sp-big')})`);
    await page.selectOption('.sp-idx', 'ndwi'); await page.fill('.sp-t', '0');
    check((await page.textContent('.sp-big')).endsWith('10 % of pixels above 0 (2.79 km²)'), `spectral: NDWI lake (${await page.textContent('.sp-big')})`);
    await page.selectOption('.sp-idx', 'nbr'); await page.fill('.sp-t', '-0.2'); await page.selectOption('.sp-dir', 'below');
    check((await page.textContent('.sp-big')).endsWith('5 % of pixels below -0.2 (1.41 km²)'), `spectral: NBR burn (${await page.textContent('.sp-big')})`);
    await page.selectOption('.sp-b-swir2', '');
    check(/needs the swir2|needs the SWIR2/.test(await page.textContent('.sp-err')), 'spectral: missing band explained');
    // A real file opened from disk: two 16-bit bands (red, NIR) stored as integers with a scale, written by the tool's own writer.
    const { writeTiff } = await import('../src/lib/sci/tiff.ts');
    const red = new Float32Array(400).fill(2000), nir = new Float32Array(400).map((_, i) => (i < 100 ? 2000 : 6000));
    const gt = new Map([[33550, { type: 12, count: 3, values: [10, 10, 0] }], [33922, { type: 12, count: 6, values: [0, 0, 0, 300000, 5000000, 0] }], [34735, { type: 3, count: 8, values: [1, 1, 0, 1, 1024, 0, 1, 1] }]]);
    writeFileSync(OUT + 'two-band.tif', writeTiff(20, 20, [red, nir], gt, true));
    await page.setInputFiles('.sp-in', OUT + 'two-band.tif');
    await page.waitForFunction(() => /two-band\.tif on this device/.test(document.querySelector('.sp-note')?.textContent ?? ''));
    await page.selectOption('.sp-idx', 'ndvi'); await page.selectOption('.sp-b-red', '0'); await page.selectOption('.sp-b-nir', '1'); await page.fill('.sp-t', '0.3'); await page.selectOption('.sp-dir', 'above');
    check((await page.textContent('.sp-big')) === 'Mean NDVI 0.38; 75 % of pixels above 0.3 (3 ha)', `spectral: GeoTIFF from disk (${await page.textContent('.sp-big')})`);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.sp-geotiff')]);
    const { readTiff } = await import('../src/lib/sci/tiff.ts');
    const back = readTiff(new Uint8Array(readFileSync(await dl.path())).buffer);
    check(back.width === 20 && Math.abs(back.bands[0][399] - 0.5) < 1e-6 && back.geo.scale[0] === 10 && back.geo.tie[2] === 300000, 'spectral: index GeoTIFF keeps the georeferencing');
    await page.goto(BASE + '/science/skew-t-sounding/');
    await page.waitForFunction(() => document.querySelector('.sk-big')?.textContent);
    check((await page.textContent('.sk-big')) === 'SBCAPE 2,891 J/kg, CIN 0 J/kg; LCL 852 hPa (1,273 m above the ground)', `skew-t: example (${await page.textContent('.sk-big')})`);
    check(/Lifted index-7\.5 °C/.test(await page.textContent('.sk-facts')) && /0–6 km 52\.1 kt/.test(await page.textContent('.sk-facts')), `skew-t: indices and shear (${await page.textContent('.sk-facts')})`);
    check((await page.$$eval('.sk-tab tbody tr', (r) => r.length)) === 20, 'skew-t: level table');
    await page.selectOption('.sk-parcel', 'ml');
    check(/^MLCAPE 2,2\d\d J\/kg, CIN -1\d J\/kg/.test(await page.textContent('.sk-big')), `skew-t: mixed layer (${await page.textContent('.sk-big')})`);
    await page.selectOption('.sk-wu', 'ms');
    check(/0–6 km 26\.8 m\/s/.test(await page.textContent('.sk-facts')), 'skew-t: shear in m/s');
    // A Wyoming text list opened from a file: an elevated case where only the most unstable parcel has CAPE.
    const pad = (cells) => cells.map((c) => String(c).padStart(7)).join('');
    const wyo = ['-'.repeat(77), '   PRES   HGHT   TEMP   DWPT   RELH   MIXR   DRCT   SKNT   THTA   THTE   THTV', '    hPa     m      C      C      %    g/kg    deg   knot     K      K      K ', '-'.repeat(77)]
      .concat([[1000, 100, 2.0, 0.0, 90, 10], [950, 500, 1.0, -1.0, 120, 20], [900, 930, 8.0, 7.0, 200, 35], [850, 1400, 10.0, 9.5, 220, 45], [800, 1880, 7.5, 7.0, 230, 50], [750, 2390, 4.2, 3.8, 235, 52], [700, 2930, 0.6, 0.0, 240, 55], [650, 3500, -3.4, -4.5, 245, 58], [600, 4100, -7.6, -10.0, 250, 60], [550, 4740, -12.2, -16.0, 250, 64], [500, 5430, -17.4, -24.0, 255, 68], [400, 6990, -29.4, -38.0, 260, 75], [300, 8850, -44.0, -52.0, 260, 85], [250, 9960, -52.5, -60.0, 265, 90], [200, 11300, -56.0, -68.0, 265, 80]].map(([p, z, t, td, d, s]) => pad([p.toFixed(1), z, t.toFixed(1), td.toFixed(1), '', '', d, s, '', '', ''])))
      .concat(['', 'Station information and sounding indices']).join('\n');
    writeFileSync(OUT + 'sounding.txt', wyo);
    await page.selectOption('.sk-parcel', 'sb');
    await page.setInputFiles('.sk-in', OUT + 'sounding.txt');
    await page.waitForFunction(() => /University of Wyoming/.test(document.querySelector('.sk-note')?.textContent ?? ''));
    check(/^SBCAPE 0 J\/kg/.test(await page.textContent('.sk-big')) && /LFCnone/.test(await page.textContent('.sk-facts')), `skew-t: Wyoming file, stable surface (${await page.textContent('.sk-big')})`);
    await page.selectOption('.sk-parcel', 'mu');
    check(/^MUCAPE 3[67]\d J\/kg/.test(await page.textContent('.sk-big')) && /800 hPa/.test(await page.textContent('.sk-facts')), `skew-t: elevated MU parcel (${await page.textContent('.sk-big')})`);
    const [skc] = await Promise.all([page.waitForEvent('download'), page.click('.sk-csv')]);
    const skCsv = readFileSync(await skc.path(), 'utf8').split('\n');
    check(skCsv.length === 16 && skCsv[0].startsWith('p (hPa),Height (m),T (°C)') && skCsv[1].startsWith('1000.0,100,2.0,0.0'), `skew-t: CSV (${skCsv[1]})`);
    await page.fill('.sk-data', 'pressure,temperature\n1000,20\n900,12\n800,5');
    check(/dew point/.test(await page.textContent('.sk-err')), 'skew-t: missing dew point explained');
    await page.goto(BASE + '/science/koppen-climate/');
    await page.waitForFunction(() => document.querySelector('.kp-big')?.textContent);
    check((await page.textContent('.kp-big')) === 'Csa: Mediterranean, hot summer', `koppen: example (${await page.textContent('.kp-big')})`);
    check((await page.$$eval('.kp-steps li', (l) => l.length)) === 6 && /Dry months \(Walter-Lieth\)5/.test(await page.textContent('.kp-facts')), 'koppen: steps and dry months');
    for (const [ex, code] of [['monsoon', 'Am'], ['desert', 'BWh'], ['continental', 'Dfb'], ['south', 'Cfb'], ['tundra', 'ET']]) {
      await page.selectOption('.kp-ex', ex);
      check((await page.textContent('.kp-big')).startsWith(code + ':'), `koppen: ${ex} example is ${code} (${await page.textContent('.kp-big')})`);
    }
    // US units from a file, two rows of 12 (made-up continental values in °F and inches).
    const fT = [-12, -10, -3, 6, 13, 18, 21, 19, 13, 6, -2, -9].map((c) => +(c * 9 / 5 + 32).toFixed(1)), fP = [30, 25, 35, 50, 70, 90, 100, 90, 70, 55, 45, 35].map((mm) => +(mm / 25.4).toFixed(3));
    writeFileSync(OUT + 'normals.csv', 'element,' + 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec\nTemperature (F),' + fT.join(',') + '\nPrecipitation (in),' + fP.join(',') + '\n');
    await page.setInputFiles('.kpc .dfb-in', OUT + 'normals.csv');
    await page.waitForFunction(() => document.querySelector('.kp-ex')?.value === 'own');
    await page.selectOption('.kp-u', 'us');
    check((await page.textContent('.kp-big')) === 'Dfb: Humid continental, warm summer', `koppen: °F and inches from a file (${await page.textContent('.kp-big')})`);
    check(/Mean annual temperature41\.0 °F/.test(await page.textContent('.kp-facts')), `koppen: shows °F (${await page.textContent('.kp-facts')})`);
    await page.selectOption('.kp-start', '6');
    check(await page.$eval('.kp-fig', (c) => c.width > 0), 'koppen: diagram drawn');
    await page.fill('.kp-data', 'Jan,1,2\nFeb,3,4');
    check(/only 2 months/.test(await page.textContent('.kp-err')), 'koppen: missing months explained');
    await page.goto(BASE + '/science/trend-analyser/');
    await page.waitForFunction(() => document.querySelector('.tr-big')?.textContent);
    check((await page.textContent('.tr-big')) === 'Significant increasing trend: +0.152 °C per decade (95 % CI +0.087 to +0.223), p = 6.1 × 10⁻⁵', `trend: example (${await page.textContent('.tr-big')})`);
    check(/between 2009 and 2010/.test(await page.textContent('.tr-facts')) && /Change over the record\+0\.747 °C/.test(await page.textContent('.tr-facts')), `trend: change point and total (${await page.textContent('.tr-facts')})`);
    await page.selectOption('.tr-test', 'hr');
    check(/p = 0\.011$/.test(await page.textContent('.tr-big')) && /Var\(S\) × 2\.470/.test(await page.textContent('.tr-facts')), `trend: Hamed-Rao (${await page.textContent('.tr-big')})`);
    await page.selectOption('.tr-test', 'seasonal');
    check(/needs dates/.test(await page.textContent('.tr-err')), 'trend: seasonal needs dates');
    // Made-up monthly file with dates: 10 years, seasonal cycle plus a slow rise of 0.05 per year.
    const mon = [];
    for (let k = 0; k < 120; k++) mon.push(`${2010 + Math.floor(k / 12)}-${String((k % 12) + 1).padStart(2, '0')},${(5 + 10 * Math.sin(((k % 12) / 12) * 2 * Math.PI) + 0.05 * Math.floor(k / 12) + 0.4 * Math.sin(k * 2.3)).toFixed(2)}`);
    writeFileSync(OUT + 'monthly.csv', 'date,value\n' + mon.join('\n') + '\n');
    await page.setInputFiles('.trn .dfb-in', OUT + 'monthly.csv');
    await page.waitForFunction(() => /120/.test(document.querySelector('.tr-facts')?.textContent ?? ''));
    await page.selectOption('.tr-per', '1');
    check(/^Significant increasing trend: \+0\.05 °C per year/.test(await page.textContent('.tr-big')) && /p = 2\.9 × 10⁻⁵/.test(await page.textContent('.tr-big')), `trend: seasonal monthly file (${await page.textContent('.tr-big')})`);
    await page.fill('.tr-data', '1\n2');
    check(/at least 4 values/.test(await page.textContent('.tr-err')), 'trend: too short explained');
    await page.goto(BASE + '/science/wave-calculator/');
    await page.waitForFunction(() => document.querySelector('.wv-big')?.textContent);
    check((await page.textContent('.wv-big')) === 'Wavelength 151.3 m, speed 15.1 m/s in 50 m of water (intermediate water)', `waves: example (${await page.textContent('.wv-big')})`);
    check((await page.textContent('.wv-big2')) === 'At 5 m the wave is 2.33 m high' && /3\.26 m deep, 2\.54 m high/.test(await page.textContent('.wv-facts2')) && /spilling/.test(await page.textContent('.wv-facts2')), `waves: shoaling and breaking (${await page.textContent('.wv-facts2')})`);
    check(/43 kW per m/.test(await page.textContent('.wv-facts')), 'waves: power');
    await page.fill('.wv-a', '20');
    check(/3\.19 m deep, 2\.49 m high/.test(await page.textContent('.wv-facts2')) && /Angle at breaking7\.1°/.test(await page.textContent('.wv-facts2')), `waves: oblique (${await page.textContent('.wv-facts2')})`);
    await page.fill('.wv-h2', '2');
    check(/already broken/.test(await page.textContent('.wv-big2')), 'waves: broken before the chosen depth');
    await page.fill('.wv-a', '0'); await page.fill('.wv-h2', '5'); await page.selectOption('.wv-u', 'ft');
    check(/Wavelength [\d.]+ ft/.test(await page.textContent('.wv-big')) && (await page.textContent('.wv-lu')) === 'ft', 'waves: feet');
    await page.fill('.wv-T', '0');
    check(/period/.test(await page.textContent('.wv-err')), 'waves: bad period explained');
    await page.goto(BASE + '/science/manning-weir-calculator/');
    await page.waitForFunction(() => document.querySelector('.mw-big')?.textContent);
    check((await page.textContent('.mw-big')) === 'Discharge 3.782 m³/s at 1.2 m deep', `manning: example (${await page.textContent('.mw-big')})`);
    check(/Froude number0\.26subcritical/.test(await page.textContent('.mw-facts')) && /Critical depth0\.5838 m/.test(await page.textContent('.mw-facts')), `manning: Froude and critical (${await page.textContent('.mw-facts')})`);
    check((await page.textContent('.mw-wbig')) === '0.8891 m³/s over the sharp-crested rectangular weir at 0.4 m head', `manning: weir (${await page.textContent('.mw-wbig')})`);
    await page.selectOption('.mw-mode', 'y'); await page.fill('.mw-Q', '5');
    check((await page.textContent('.mw-big')) === 'Normal depth 1.37 m for 5 m³/s', `manning: normal depth (${await page.textContent('.mw-big')})`);
    await page.selectOption('.mw-shape', 'circ'); await page.fill('.mw-D', '1'); await page.fill('.mw-S', '0.002'); await page.fill('.mw-n', '0.013'); await page.fill('.mw-Q', '0.8');
    check((await page.textContent('.mw-big')) === 'Normal depth 0.6438 m for 0.8 m³/s' && /most it can carry is 1\.153 m³\/s at 93\.8 % full/.test(await page.textContent('.mw-facts')), `manning: pipe (${await page.textContent('.mw-facts')})`);
    await page.fill('.mw-Q', '2');
    check(/cannot carry 2 m³\/s/.test(await page.textContent('.mw-err')), 'manning: pipe too small explained');
    await page.selectOption('.mw-npick', '0.010');
    check((await page.inputValue('.mw-n')) === '0.010', 'manning: typical n fills in');
    await page.selectOption('.mw-wt', 'v'); await page.fill('.mw-wh', '0.3');
    check((await page.inputValue('.mw-wcd')) === '0.58' && /^0\.06753 m³\/s over the 90° V-notch weir/.test(await page.textContent('.mw-wbig')), `manning: V-notch (${await page.textContent('.mw-wbig')})`);
    await page.selectOption('.mw-wm', 'h'); await page.fill('.mw-wq', '0.06753131');
    check(/^Head 0\.3 m/.test(await page.textContent('.mw-wbig')), `manning: head from flow (${await page.textContent('.mw-wbig')})`);
    await page.selectOption('.mw-u', 'us');
    check((await page.textContent('.mw-lu')) === 'ft' && /ft³\/s/.test(await page.textContent('.mw-wbig')), 'manning: US units');
    await page.goto(BASE + '/science/runoff-calculator/');
    await page.waitForFunction(() => document.querySelector('.ro-rbig')?.textContent);
    check((await page.textContent('.ro-rbig')) === 'Peak flow 2.42 m³/s', `runoff: rational (${await page.textContent('.ro-rbig')})`);
    { const cf = await page.textContent('.ro-cfacts'); check(/Area-weighted C0\.37/.test(cf) && /Area-weighted CN69\.4/.test(cf) && /Time of concentration12\.1 min/.test(cf), `runoff: catchment (${cf})`); }
    check((await page.textContent('.ro-sbig')) === 'Runoff 19.6 mm of 80 mm rain (24.5 %)', `runoff: SCS (${await page.textContent('.ro-sbig')})`);
    { const sf = await page.textContent('.ro-sfacts'); check(/Triangular hydrograph peak1\.31 m³\/s/.test(sf) && /Runoff volume3,?913 m³/.test(sf) && /Initial abstraction Ia22\.4 mm/.test(sf), `runoff: SCS facts (${sf})`); }
    await page.selectOption('.ro-amc', '3');
    check(/Curve number used83\.9wet/.test(await page.textContent('.ro-sfacts')), `runoff: wet ground (${await page.textContent('.ro-sfacts')})`);
    await page.selectOption('.ro-cf', '1.25');
    check(/C used0\.463/.test(await page.textContent('.ro-rfacts')), `runoff: return period factor (${await page.textContent('.ro-rfacts')})`);
    await page.selectOption('.ro-im', 'i'); await page.fill('.ro-i', '100');
    check((await page.textContent('.ro-rbig')) === 'Peak flow 2.57 m³/s', `runoff: typed intensity (${await page.textContent('.ro-rbig')})`);
    await page.fill('.ro-tc', '30');
    check(/Time of concentration30 mintyped/.test(await page.textContent('.ro-cfacts')), 'runoff: typed tc');
    await page.locator('.ro-use').nth(2).selectOption('0.90|98');
    check((await page.locator('.ro-c').nth(2).inputValue()) === '0.90' && (await page.locator('.ro-cn').nth(2).inputValue()) === '98' && (await page.locator('.ro-a').nth(2).inputValue()) === '1', 'runoff: typical land use fills a row');
    await page.locator('.ro-a').nth(0).fill('');
    check(/Part 1: give its area/.test(await page.textContent('.ro-err')), 'runoff: missing area explained');
    await page.locator('.ro-a').nth(0).fill('12'); await page.selectOption('.ro-amc', '2'); await page.fill('.ro-P', '10');
    check(/no runoff/.test(await page.textContent('.ro-sfacts')), 'runoff: rain below Ia');
    await page.selectOption('.ro-u', 'us');
    check((await page.textContent('.ro-au')) === 'acres' && /ft³\/s/.test(await page.textContent('.ro-rbig')) && /in of 10 in rain/.test(await page.textContent('.ro-sbig')), `runoff: US units (${await page.textContent('.ro-sbig')})`);
    await page.goto(BASE + '/science/flood-frequency/');
    await page.waitForFunction(() => document.querySelector('.ff-big')?.textContent);
    const ffBig = async () => { await page.waitForTimeout(450); return page.textContent('.ff-big'); };
    check((await ffBig()) === '100-year flood 1,016 m³/s (90 % range 833 to 1,174)', `flood: GEV example (${await page.textContent('.ff-big')})`);
    { const f = await page.textContent('.ff-facts'); check(/GEV 19\.9; LP3 21\.3; Gumbel L 19\.8; Gumbel mom\. 21\.8/.test(f) && /in 30 years26 %/.test(f) && /Grubbs-Beck, 10 %\)none/.test(f), `flood: facts (${f})`); }
    check((await page.locator('.ff-tab tbody tr').count()) === 8 && (await page.textContent('.ff-tab .ff-hit')).startsWith('1001 %1,016'), `flood: table (${await page.textContent('.ff-tab .ff-hit')})`);
    await page.selectOption('.ff-dist', 'lp3');
    check(/^100-year flood 987 m³\/s/.test(await ffBig()) && /log10 mean 2\.662, sd 0\.145, skew −?-?0\.0523 \(station\)/.test(await page.textContent('.ff-facts')), `flood: LP3 (${await page.textContent('.ff-facts')})`);
    await page.fill('.ff-skew', '-0.1');
    check(/^100-year flood 976 m³\/s/.test(await ffBig()), `flood: typed skew (${await page.textContent('.ff-big')})`);
    await page.fill('.ff-T', '1000');
    check(/^1000-year flood/.test(await ffBig()) && (await page.locator('.ff-tab tbody tr').count()) === 9 && /1000 years is more than twice the record/.test(await page.textContent('.ff-facts')), 'flood: other return period');
    await page.setInputFiles('.ffa .dfb-in', { name: 'peaks.csv', mimeType: 'text/csv', buffer: Buffer.from('Water year,Peak (cfs)\n' + Array.from({ length: 25 }, (_, i) => `${1990 + i},${[3100, 2800, 5400, 4100, 3600, 2900, 7200, 3300, 4500, 3900, 2600, 6100, 3500, 4200, 3000, 4800, 3700, 5200, 2700, 4000, 3400, 8900, 3800, 4400, 3200][i]}`).join('\n')) });
    await page.waitForFunction(() => /Water year/.test(document.querySelector('.ff-data').value));
    check(/^1000-year flood [\d,]+ m³\/s/.test(await ffBig()) && /25 years, 1990 to 2014/.test(await page.textContent('.ff-facts')), `flood: file opened (${await page.textContent('.ff-facts')})`);
    await page.fill('.ff-data', '2001 50\n2002 60\n2003 70');
    check(/at least 10 annual peaks \(found 3\)/.test((await ffBig(), await page.textContent('.ff-err'))), 'flood: short record explained');
    await page.fill('.ff-data', [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].join('\n'));
    check(/above zero/.test((await ffBig(), await page.textContent('.ff-err'))), 'flood: zero flow explained');
    await page.goto(BASE + '/science/et0-calculator/');
    await page.waitForFunction(() => document.querySelector('.et-big')?.textContent);
    check((await page.textContent('.et-big')) === 'ET0 5.53 mm/day', `et0: example day (${await page.textContent('.et-big')})`);
    { const f = await page.textContent('.et-facts'); check(/Wind at 2 m2\.32 m\/sfrom 3\.1 m\/s at 10 m/.test(f) && /Sun at the top of the air Ra40\.7 MJ\/m²/.test(f) && /Hargreaves ET05\.48 mm\/day/.test(f), `et0: day facts (${f})`); }
    check((await page.textContent('.et-tbig')) === '152.4 mm over 31 days (4.92 mm/day)', `et0: table (${await page.textContent('.et-tbig')})`);
    await page.fill('.et-kc', '1.15');
    check((await page.textContent('.et-big')) === 'ET0 5.53 mm/day; crop 6.36 mm/day' && /; crop [\d.]+ mm$/.test(await page.textContent('.et-tbig')), `et0: crop (${await page.textContent('.et-big')})`);
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.et-csv')]); const t = readFileSync(await dl.path(), 'utf8'); check(dl.suggestedFilename() === 'et0-daily.csv' && t.startsWith('date,ET0 Penman-Monteith (mm),ET0 Hargreaves (mm),ETc (mm)\n2026-07-01,') && t.trim().split('\n').length === 32, 'et0: CSV download'); }
    await page.selectOption('.et-hm', 'tdew'); await page.fill('.et-td', '14');
    check(/actual 1\.6 kPa/.test(await page.textContent('.et-facts')), `et0: dew point (${await page.textContent('.et-facts')})`);
    await page.selectOption('.et-sm', 'temp');
    check(/^ET0 [\d.]+ mm\/day/.test(await page.textContent('.et-big')) && (await page.isHidden('.et-s1')) && (await page.isVisible('.et-s3')), 'et0: radiation from temperature');
    await page.fill('.et-tn', '35');
    check(/lowest temperature is above the highest/.test(await page.textContent('.et-err')), 'et0: Tmin above Tmax explained');
    await page.fill('.et-tn', '16.5'); await page.fill('.et-kc', '');
    await page.setInputFiles('.etc .dfb-in', { name: 'wx.csv', mimeType: 'text/csv', buffer: Buffer.from('day,max temp,min temp,humidity,solar radiation\n2026-05-01,22,10,65,20\n2026-05-02,24,11,60,22\n2026-05-03,19,9,80,12\n') });
    await page.waitForFunction(() => /max temp/.test(document.querySelector('.et-data').value));
    { const f = await page.textContent('.et-tfacts'); check(/ over 3 days/.test(await page.textContent('.et-tbig')) && /humidity: mean RH; sun: solar radiation/.test(f) && /wind: 2 m\/s \(no column\)/.test(f), `et0: file opened (${f})`); }
    await page.fill('.et-data', 'date,temp\n2026-01-01,5');
    check(/Name the temperature columns/.test(await page.textContent('.et-terr')), 'et0: missing columns explained');
    await page.goto(BASE + '/science/rating-curve/');
    await page.waitForFunction(() => document.querySelector('.rc-big')?.textContent);
    check((await page.textContent('.rc-big')) === 'Q = 11.61 (h − 0.3406)^1.681', `rating: example (${await page.textContent('.rc-big')})`);
    check(/Scatter about the curve−6\.99 % to \+7\.51 %/.test(await page.textContent('.rc-facts')) && /10 % offnone/.test(await page.textContent('.rc-facts')), `rating: scatter (${await page.textContent('.rc-facts')})`);
    { const u = await page.textContent('.rc-ufacts'); check(/Discharge at 2\.5 m42\.36 m³\/s95 % range 41\.46 to 43\.27/.test(u) && /Stage for 30 m³\/s2\.099 m/.test(u), `rating: use (${u})`); }
    check((await page.locator('.rc-tab tbody tr').count()) === 13 && (await page.locator('.rc-tab tr.rc-ext').count()) === 3, 'rating: table with extrapolation marked');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.rc-csv')]); const t = readFileSync(await dl.path(), 'utf8'); check(dl.suggestedFilename() === 'rating-table.csv' && t.startsWith('Stage (m),Discharge (m³/s),95 % low,95 % high,Note\n0.5,0.5297,') && /outside gauged range/.test(t), 'rating: CSV download'); }
    await page.fill('.rc-h0', '0.3');
    check((await page.textContent('.rc-big')) === 'Q = 10.6 (h − 0.3)^1.764' && /h0 typed/.test(await page.textContent('.rc-facts')), `rating: typed h0 (${await page.textContent('.rc-big')})`);
    await page.fill('.rc-h0', '1');
    check(/below the lowest gauged stage \(0\.642 m\)/.test(await page.textContent('.rc-err')), 'rating: h0 above gaugings explained');
    await page.fill('.rc-h0', ''); await page.selectOption('.rc-seg', '2');
    check(/below 2 m; Q = .* above$/.test(await page.textContent('.rc-big')) && /Step at the break/.test(await page.textContent('.rc-facts')), `rating: two segments (${await page.textContent('.rc-big')})`);
    await page.fill('.rc-brk', '0.7');
    check(/Each segment needs at least 4 gaugings/.test(await page.textContent('.rc-err')), 'rating: break too low explained');
    await page.selectOption('.rc-seg', '1'); await page.fill('.rc-tol', '3');
    check(/3 % off[^n]*\(/.test(await page.textContent('.rc-facts')), `rating: flagged gaugings (${await page.textContent('.rc-facts')})`);
    await page.setInputFiles('.rcf .dfb-in', { name: 'g.csv', mimeType: 'text/csv', buffer: Buffer.from('date,Discharge (cfs),Gauge height (ft)\n2021-03-01,120,2.1\n2021-05-04,410,3.4\n2021-07-09,35,1.3\n2022-01-15,900,4.6\n2022-04-02,1500,5.7\n2022-09-30,60,1.6\n') });
    await page.waitForFunction(() => /Gauge height/.test(document.querySelector('.rc-data').value));
    check(/^Gaugings6, stage 1\.3 to 5\.7/.test(await page.textContent('.rc-facts')), `rating: file with named columns (${await page.textContent('.rc-facts')})`);
    await page.fill('.rc-data', 'stage,flow\n1,2\n2,5\n3,9');
    check(/at least 4 gaugings/.test(await page.textContent('.rc-err')), 'rating: too few gaugings explained');
    // #145 altermagnet band explorer
    await page.goto(BASE + "/science/altermagnet-bands/");
    await page.waitForTimeout(400);
    check((await page.textContent('.am-big')).includes('D-wave altermagnet: spin splitting up to 1.6'), 'altermagnet bands: example splitting');
    check(/Electrons per cell1\.007 spin up, 1\.007 spin down/.test(await page.textContent('.am-facts')), 'altermagnet bands: filling per spin');
    await page.fill('.am-tb', '0.3');
    await page.waitForTimeout(400);
    check((await page.textContent('.am-big')).includes('No spin splitting'), 'altermagnet bands: ta = tb is spin-degenerate');
    await page.selectOption('.am-kind', 'one');
    await page.selectOption('.am-form', 'g');
    await page.waitForTimeout(400);
    check(/g-wave/i.test(await page.textContent('.am-big')), 'altermagnet bands: one-band g-wave');
    await page.fill('.am-t', '20');
    await page.waitForTimeout(400);
    check(await page.isVisible('.am-err'), 'altermagnet bands: hopping out of range');
    // #146 anomalous Hall checker
    await page.goto(BASE + '/science/anomalous-hall-checker/');
    await page.waitForFunction(() => document.querySelector('.ah-big')?.textContent);
    check((await page.textContent('.ah-big')) === 'Anomalous Hall effect allowed: Hall vector along [0\u00a01\u00a00]', `ahe: rutile [100] (${await page.textContent('.ah-big')})`);
    { const f = await page.textContent('.ah-facts'); check(/Magnet typealtermagnet/.test(f) && /σzx \(Hall vector along y\)/.test(f) && /8 operations, 4 of them only with time reversal/.test(f), `ahe: facts (${f})`); }
    check((await page.locator('.ah-dtab tbody tr').count()) === 8 && /\[0\u00a00\u00a01\]nonone/.test(await page.textContent('.ah-dtab')), 'ahe: direction table');
    check(/^1identityno/.test(await page.textContent('.ah-otab tbody')), 'ahe: identity listed first');
    await page.fill('.ah-u', '0'); await page.fill('.ah-w', '1'); await page.waitForTimeout(450);
    check(/^No anomalous Hall effect for moments along \[0\u00a00\u00a01\]/.test(await page.textContent('.ah-big')), 'ahe: rutile [001] forbidden');
    await page.selectOption('.ah-ex', 'nias'); await page.fill('.ah-u', '1'); await page.fill('.ah-v', '2'); await page.fill('.ah-w', '0'); await page.waitForTimeout(450);
    check(/Hall vector along \[0\u00a00\u00a01\]/.test(await page.textContent('.ah-big')), 'ahe: MnTe in-plane gives Hall along c');
    await page.selectOption('.ah-ex', 'bcc'); await page.waitForTimeout(300);
    check(/^No anomalous Hall effect/.test(await page.textContent('.ah-big')) && /conventional antiferromagnet/.test(await page.textContent('.ah-facts')), 'ahe: bcc antiferromagnet forbidden');
    await page.fill('.ah-u', '0'); await page.fill('.ah-v', '0'); await page.fill('.ah-w', '0'); await page.waitForTimeout(450);
    check(/cannot all be 0/.test(await page.textContent('.ah-err')), 'ahe: zero direction explained');
    await page.fill('.ah-w', '1');
    await page.setInputFiles('.ahc .ah-file', { name: 'fe.txt', mimeType: 'text/plain', buffer: Buffer.from('cell 3 3 3 90 90 90\nFe 0 0 0 up\nFe 1/2 1/2 1/2 up\n') });
    await page.waitForFunction(() => /Fe 1\/2/.test(document.querySelector('.ah-in').value) && /Hall/.test(document.querySelector('.ah-big').textContent));
    check(/Hall vector along \[0\u00a00\u00a01\]/.test(await page.textContent('.ah-big')) && /ferromagnet/.test(await page.textContent('.ah-facts')), `ahe: ferromagnet file (${await page.textContent('.ah-big')})`);
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.ahc .dl [data-f=pdf]')]); check(dl.suggestedFilename() === 'anomalous-hall-check.pdf', 'ahe: PDF download'); }
    // #147 spin splitter conductivity
    await page.goto(BASE + '/science/spin-splitter-conductivity/');
    await page.waitForFunction(() => document.querySelector('.ss-big')?.textContent);
    check((await page.textContent('.ss-big')) === 'Spin splitter ratio 0.242 at 45°', `ssc: example (${await page.textContent('.ss-big')})`);
    { const f = await page.textContent('.ss-facts'); check(/Largest ratio0\.242 at 45°/.test(f) && /Charge conductivityσxx 0\.579, σxy 0, σyy 0\.579/.test(f) && /Spin conductivityσxx −0\.14, σxy 0, σyy 0\.14/.test(f) && /spin up drifts to the left/.test(f), `ssc: facts (${f})`); }
    await page.fill('.ss-ang', '0'); await page.waitForTimeout(450);
    { const f = await page.textContent('.ss-facts'); check(/Spin polarisation along the field−0\.242/.test(f) && /^Spin splitter ratio 0 at 0°$/.test(await page.textContent('.ss-big')), `ssc: field along x (${f})`); }
    await page.fill('.ss-ta', '0.2'); await page.fill('.ss-tb', '0.2'); await page.waitForTimeout(450);
    check(/No spin splitter effect/.test(await page.textContent('.ss-big')) && /plain antiferromagnet/.test(await page.textContent('.ss-facts')), 'ssc: ta = tb gives nothing');
    await page.selectOption('.ss-kind', 'one'); await page.selectOption('.ss-form', 'g'); await page.fill('.ss-mu', '-0.5'); await page.fill('.ss-J', '0.3'); await page.waitForTimeout(500);
    check(/No spin splitter effect/.test(await page.textContent('.ss-big')) && /g-wave splitting averages out/.test(await page.textContent('.ss-facts')), 'ssc: g-wave gives nothing');
    await page.selectOption('.ss-form', 'dx2y2'); await page.fill('.ss-ang', '45'); await page.waitForTimeout(500);
    check((await page.textContent('.ss-big')) === 'Spin splitter ratio 0.471 at 45°', `ssc: one-band d-wave (${await page.textContent('.ss-big')})`);
    await page.fill('.ss-mu', '20'); await page.waitForTimeout(450);
    check(/no states at the Fermi level/.test(await page.textContent('.ss-err')), 'ssc: empty band explained');
    await page.fill('.ss-mu', '-0.5'); await page.fill('.ss-kT', '0.001'); await page.waitForTimeout(450);
    check(/kT between 0\.02 and 5/.test(await page.textContent('.ss-err')), 'ssc: kT too small explained');
    // #148 chiral magnon bands
    await page.goto(BASE + '/science/chiral-magnon-bands/');
    await page.waitForFunction(() => document.querySelector('.mg-big')?.textContent);
    check((await page.textContent('.mg-big')) === 'Chiral magnons split by up to 1 (d-wave)', `magnon: example (${await page.textContent('.mg-big')})`);
    { const f = await page.textContent('.mg-facts'); check(/Largest splitting ωα − ωβ−1at k = \(0, −π\), the Y point/.test(f) && /Gap at Γ0\.567/.test(f) && /Top of the bands5\.44/.test(f), `magnon: facts (${f})`); }
    await page.fill('.mg-Jb', '0.3'); await page.waitForTimeout(300);
    check(/^No chirality splitting/.test(await page.textContent('.mg-big')), 'magnon: Ja = Jb degenerate');
    await page.fill('.mg-Jb', '0.05'); await page.fill('.mg-K', '0'); await page.waitForTimeout(300);
    check(/Gap at Γ0no anisotropy: gapless/.test(await page.textContent('.mg-facts')), 'magnon: gapless without anisotropy');
    await page.fill('.mg-K', '-0.05'); await page.waitForTimeout(300);
    check(/not stable/.test(await page.textContent('.mg-err')) && /negative K/.test(await page.textContent('.mg-err')), 'magnon: hard axis unstable');
    await page.fill('.mg-K', '0.02'); await page.fill('.mg-J1', '-1'); await page.waitForTimeout(300);
    check(/J1 must be above 0/.test(await page.textContent('.mg-err')), 'magnon: J1 sign explained');
    // #149 unit hydrograph builder
    await page.goto(BASE + '/science/unit-hydrograph/');
    await page.waitForFunction(() => document.querySelector('.uh-dbig')?.textContent);
    check((await page.textContent('.uh-big')) === 'Peak 3.58 m³/s per mm at 3 h' && /Tp 2\.9 h, gamma shape m 3\.7/.test(await page.textContent('.uh-facts')), `uh: synthetic (${await page.textContent('.uh-big')})`);
    check((await page.textContent('.uh-sbig')) === 'Peak flow 84.9 m³/s at 5 h', `uh: storm (${await page.textContent('.uh-sbig')})`);
    { const f = await page.textContent('.uh-dfacts'); check((await page.textContent('.uh-dbig')) === 'Derived unit hydrograph: peak 2.9 m³/s per mm at 3 h' && /27\.1 mm of 40 mm rain/.test(f) && /2\.48 mm per step/.test(f) && /holds 1 mm/.test(f), `uh: derived (${f})`); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.uh-csv')]); const t = readFileSync(await dl.path(), 'utf8'); check(dl.suggestedFilename() === 'unit-hydrograph.csv' && t.startsWith('Time (h),Unit hydrograph (m³/s per mm),Storm flow (m³/s)\n0,0,3\n'), `uh: CSV (${t.slice(0, 80)})`); }
    await page.selectOption('.uh-kind', 'nash'); await page.waitForTimeout(450);
    check((await page.textContent('.uh-big')) === 'Peak 3.09 m³/s per mm at 3 h', `uh: Nash (${await page.textContent('.uh-big')})`);
    await page.fill('.uh-pe', '5, x'); await page.waitForTimeout(450);
    check(/excess rain as numbers/.test(await page.textContent('.uh-serr')), 'uh: bad rain explained');
    await page.fill('.uh-pe', '5'); await page.fill('.uh-A', '5'); await page.waitForTimeout(450);
    check(/more than the rain/.test(await page.textContent('.uh-derr')), 'uh: runoff above rain explained');
    await page.fill('.uh-A', '50');
    await page.setInputFiles('.uhb .dfb-in', { name: 's.csv', mimeType: 'text/csv', buffer: Buffer.from('time,Q,precip\n0,2,0\n1,2,6\n2,9,10\n3,20,2\n4,14,0\n5,7,0\n6,4,0\n7,2.5,0\n8,2,0\n') });
    await page.waitForFunction(() => /precip/.test(document.querySelector('.uh-data').value));
    await page.waitForTimeout(450);
    check(/^Derived unit hydrograph/.test(await page.textContent('.uh-dbig')), `uh: file with other column names (${await page.textContent('.uh-dbig')} ${await page.textContent('.uh-derr')})`);
    // #150 rain gauge network average
    await page.goto(BASE + '/science/rain-gauge-average/');
    await page.waitForFunction(() => document.querySelector('.rg-big')?.textContent);
    check((await page.textContent('.rg-big')) === 'Catchment rainfall 31.0 mm (Thiessen)', `thiessen: example (${await page.textContent('.rg-big')})`);
    { const f = await page.textContent('.rg-facts'); check(/Plain average of the gauges30\.6 mm7 gauges with a reading; 30\.0 mm for those inside/.test(f) && /Catchment area125 km²/.test(f) && /outside the catchment that still count1/.test(f), `thiessen: facts (${f})`); }
    check((await page.locator('.rg-tab tbody tr').count()) === 7 && /School3628\.7323\u00a0%/.test(await page.textContent('.rg-tab')), `thiessen: table (${await page.textContent('.rg-tab')})`);
    check(/storm 1 \(mm\)31\.030\.67storm 2 \(mm\)15\.816\.26/.test(await page.textContent('.rg-all')), `thiessen: every column (${await page.textContent('.rg-all')})`);
    await page.selectOption('.rg-col', '1'); await page.waitForTimeout(300);
    check((await page.textContent('.rg-big')) === 'Catchment rainfall 15.8 mm (Thiessen)' && /Schoolno reading/.test(await page.textContent('.rg-tab')), 'thiessen: missing reading redraws');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.rg-csv')]); const t = readFileSync(await dl.path(), 'utf8'); check(dl.suggestedFilename() === 'thiessen-weights.csv' && t.startsWith('Gauge,x,y,storm 1 (mm),storm 1 (mm) weight,storm 2 (mm),storm 2 (mm) weight\nHill Farm,2,2,32,0.141398,') && /\nThiessen mean,,,30\.9849,,15\.8381,/.test(t), `thiessen: CSV (${t.slice(0, 120)})`); }
    await page.fill('.rg-poly', '0,0\n2,2\n2,0\n0,2'); await page.waitForTimeout(300);
    check(/crosses itself/.test(await page.textContent('.rg-err')), 'thiessen: bow-tie boundary explained');
    await page.selectOption('.rg-crs', 'deg');
    await page.fill('.rg-poly', '-79.10,43.00\n-78.90,43.00\n-78.90,43.15\n-79.10,43.15');
    await page.fill('.rg-g', 'a,-79.05,43.05,10\nb,-78.95,43.10,20'); await page.waitForTimeout(300);
    check((await page.textContent('.rg-big')) === 'Catchment rainfall 15.0 mm (Thiessen)' && /Catchment area269\.7 km²/.test(await page.textContent('.rg-facts')), `thiessen: longitude and latitude (${await page.textContent('.rg-big')} ${await page.textContent('.rg-facts')})`);
    // #151 LC50 probit
    await page.goto(`${BASE}/science/lc50-probit/`); await page.waitForTimeout(600);
    check((await page.textContent('.lcp .lc-big')).includes('LC50 = 4.11 mg/L (95 % limits 3.12 to 5.25)'), 'lc50: probit example');
    check((await page.textContent('.lcp .lc-tab')).includes('11.15'), 'lc50: LC90 row');
    await page.selectOption('.lcp .lc-link', 'logit'); await page.waitForTimeout(400);
    check((await page.textContent('.lcp .lc-big')).startsWith('LC50 = 4.13'), 'lc50: logit');
    await page.selectOption('.lcp .lc-kind', 'EC'); await page.selectOption('.lcp .lc-nat', 'none'); await page.waitForTimeout(400);
    check((await page.textContent('.lcp .lc-big')).startsWith('EC50'), 'lc50: EC label');
    await page.fill('.lcp .lc-data', 'c n r\n1 10 0\n2 10 0\n4 10 10\n8 10 10'); await page.waitForTimeout(500);
    check(!(await page.isHidden('.lcp .lc-err')) && (await page.textContent('.lcp .lc-err')).includes('jump'), 'lc50: complete separation error');
    await page.fill('.lcp .lc-data', 'c n r\n1 10 3\n2 10 12'); await page.waitForTimeout(500);
    check((await page.textContent('.lcp .lc-err')).includes('between 0 and the number exposed'), 'lc50: r > n error');
    await page.setInputFiles('.lcp .dfb-in', { name: 'tox.csv', mimeType: 'text/csv', buffer: Buffer.from('conc,n,dead\n0,20,1\n1,20,2\n1.8,20,4\n3.2,20,8\n5.6,20,13\n10,20,17\n18,20,20\n') });
    await page.selectOption('.lcp .lc-link', 'probit'); await page.selectOption('.lcp .lc-nat', 'control'); await page.waitForTimeout(600);
    check((await page.textContent('.lcp .lc-big')).includes('4.11'), 'lc50: file open');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lcp .lc-csv')]); check(dl.suggestedFilename() === 'lc50-results.csv', 'lc50: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lcp .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'lc50: PDF'); }
    // #152 species sensitivity distribution
    await page.goto(`${BASE}/science/species-sensitivity/`); await page.waitForTimeout(800);
    check((await page.textContent('.ssd .sd-big')) === 'HC5 = 7.43 µg/L (95 % limits 2.2 to 22)', 'ssd: averaged example');
    check((await page.textContent('.ssd .sd-facts')).includes('7 groups'), 'ssd: groups counted');
    await page.selectOption('.ssd .sd-model', 'lnorm'); await page.waitForTimeout(500);
    check((await page.textContent('.ssd .sd-big')).startsWith('HC5 = 7.94'), 'ssd: log-normal');
    await page.fill('.ssd .sd-paf', '10'); await page.selectOption('.ssd .sd-model', 'avg'); await page.waitForTimeout(500);
    check((await page.textContent('.ssd .sd-facts')).includes('8.04 %'), 'ssd: fraction affected');
    await page.fill('.ssd .sd-data', 'a 1\nb 2\nc 3\nd 4'); await page.waitForTimeout(500);
    check((await page.textContent('.ssd .sd-err')).includes('at least 5'), 'ssd: too few species');
    await page.fill('.ssd .sd-data', 'a 1\nb 2\nc 0\nd 4\ne 5'); await page.waitForTimeout(500);
    check((await page.textContent('.ssd .sd-err')).includes('above zero'), 'ssd: zero value');
    await page.setInputFiles('.ssd .dfb-in', { name: 'ssd.csv', mimeType: 'text/csv', buffer: Buffer.from('species,value\nA,3\nB,10\nC,30\nD,100\nE,300\nF,1000\n') });
    await page.waitForTimeout(800);
    check((await page.textContent('.ssd .sd-facts')).includes('Caution'), 'ssd: file open and few-species caution');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.ssd .sd-csv')]); check(dl.suggestedFilename() === 'species-sensitivity.csv', 'ssd: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.ssd .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'ssd: PDF'); }
    // #153 non-detect statistics
    await page.goto(`${BASE}/science/non-detects/`); await page.waitForTimeout(700);
    check((await page.textContent('.nds .nd-big')) === 'Mean 2.48 µg/L, median 1.5 µg/L (Kaplan–Meier)', 'nd: example');
    check((await page.textContent('.nds .nd-facts')).includes('3.54 µg/L'), 'nd: UCL95');
    check((await page.textContent('.nds .nd-tab')).includes('2.43'), 'nd: ROS row');
    await page.fill('.nds .nd-g', '5'); await page.waitForTimeout(400);
    check((await page.textContent('.nds .nd-facts')).includes('2 of 16 samples'), 'nd: guideline count');
    await page.fill('.nds .nd-g', '1.5'); await page.waitForTimeout(400);
    check((await page.textContent('.nds .nd-facts')).includes('could be either side'), 'nd: guideline below a limit');
    await page.fill('.nds .nd-data', 'a,ND,5\nb,7\nc,3,U\nd,<2\ne,12'); await page.waitForTimeout(500);
    check((await page.textContent('.nds .nd-facts')).includes('2 detected, 3 non-detects'), 'nd: ND and U flags');
    await page.fill('.nds .nd-data', '<1 <1 <2 3'); await page.waitForTimeout(500);
    check((await page.textContent('.nds .nd-err')).includes('too few'), 'nd: too few detects');
    await page.fill('.nds .nd-data', '<1 <1 <2 3 4 0'); await page.waitForTimeout(500);
    check((await page.textContent('.nds .nd-err')).includes('above zero'), 'nd: zero rejected');
    await page.setInputFiles('.nds .dfb-in', { name: 'lab.csv', mimeType: 'text/csv', buffer: Buffer.from('id,result,flag\nS1,1,<\nS2,1.2,\nS3,2,<\nS4,1.5,\nS5,5,\nS6,0.6,\nS7,3,\n') });
    await page.waitForTimeout(700);
    check((await page.textContent('.nds .nd-facts')).includes('5 detected, 2 non-detects'), 'nd: file open with flag column');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.nds .nd-csv')]); check(dl.suggestedFilename() === 'non-detect-statistics.csv', 'nd: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.nds .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'nd: PDF'); }
    // #154 landfill gas
    await page.goto(`${BASE}/science/landfill-gas/`); await page.waitForTimeout(600);
    check((await page.textContent('.lfg .lf-big')) === 'Peak 4.34 million m³ of methane in 2025', 'lfg: example peak');
    { const t = await page.textContent('.lfg .lf-facts'); check(t.includes('4.13 million m³') && t.includes('943.2 m³/h') && t.includes('2661 t') && t.includes('71,852 t CO₂e'), 'lfg: report-year facts'); }
    await page.fill('.lfg .lf-col', '60'); await page.waitForTimeout(400);
    check((await page.textContent('.lfg .lf-facts')).includes('about 0.984 MW'), 'lfg: power from collected gas');
    await page.selectOption('.lfg .lf-gwp', '28'); await page.waitForTimeout(400);
    check((await page.textContent('.lfg .lf-facts')).includes('GWP 28'), 'lfg: GWP choice');
    await page.fill('.lfg .lf-k', '0'); await page.waitForTimeout(400);
    check((await page.textContent('.lfg .lf-err')).includes('decay rate'), 'lfg: k error');
    await page.fill('.lfg .lf-k', '0.05'); await page.fill('.lfg .lf-data', 'year,t\n2010.5,100'); await page.waitForTimeout(400);
    check((await page.textContent('.lfg .lf-err')).includes('whole years'), 'lfg: year error');
    await page.setInputFiles('.lfg .dfb-in', { name: 'waste.csv', mimeType: 'text/csv', buffer: Buffer.from('year,tonnes\n2020,10000\n2020,10000\n2021,20000\n') });
    await page.fill('.lfg .lf-yr', '2022'); await page.waitForTimeout(600);
    check((await page.textContent('.lfg .lf-big')).includes('in 2022'), 'lfg: file open, duplicate years added');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lfg .lf-csv')]); check(dl.suggestedFilename() === 'landfill-gas.csv', 'lfg: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lfg .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'lfg: PDF'); }
    // #155 detention pond
    await page.goto(`${BASE}/science/detention-pond/`); await page.waitForTimeout(1200);
    check((await page.textContent('.dpd .dp-big')) === 'Peak outflow 0.219 m³/s, cut by 83 %', 'pond: example');
    { const t = await page.textContent('.dpd .dp-facts'); check(t.includes('1,986 m³') && t.includes('425 mm diameter') && t.includes('not reached'), 'pond: storage, sizing, weir'); }
    await page.fill('.dpd .dp-L', '15'); await page.fill('.dpd .dp-W', '10'); await page.waitForTimeout(1200);
    { const t = await page.textContent('.dpd .dp-facts'); check(t.includes('the pond overtops') || t.includes('used'), 'pond: small pond spills or overtops'); }
    await page.fill('.dpd .dp-L', '40'); await page.fill('.dpd .dp-W', '25'); await page.fill('.dpd .dp-C', '1.5'); await page.waitForTimeout(800);
    check((await page.textContent('.dpd .dp-err')).includes('runoff coefficient'), 'pond: C error');
    await page.fill('.dpd .dp-C', '0.65'); await page.selectOption('.dpd .dp-src', 'tab'); await page.waitForTimeout(1200);
    check((await page.textContent('.dpd .dp-facts')).includes('pasted hydrograph'), 'pond: pasted hydrograph');
    await page.setInputFiles('.dpd .dfb-in', { name: 'h.csv', mimeType: 'text/csv', buffer: Buffer.from('t,q\n0,0\n20,2\n10,1\n') }); await page.waitForTimeout(1000);
    check((await page.textContent('.dpd .dp-err')).includes('Times must increase'), 'pond: file open, order check');
    await page.selectOption('.dpd .dp-src', 'rat'); await page.waitForTimeout(1200);
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.dpd .dp-csv')]); check(dl.suggestedFilename() === 'detention-pond.csv', 'pond: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.dpd .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'pond: PDF'); }
    // #156 water quality index
    await page.goto(`${BASE}/science/water-quality-index/`); await page.waitForTimeout(600);
    check((await page.textContent('.wqx .wq-big')) === 'WQI 58 (Marginal)', 'wqi: example');
    { const t = await page.textContent('.wqx .wq-facts'); check(t.includes('4 of 6 variables') && t.includes('10 of 48 tests') && t.includes('19.5'), 'wqi: F1 F2 F3'); }
    check((await page.textContent('.wqx .wq-tab')).includes('8×'), 'wqi: worst E. coli as multiple');
    await page.fill('.wqx .wq-res', 'site,pH,Zinc,Nitrate (mg/L)\nA,7,5,<0.5\nB,7.1,6,1'); await page.waitForTimeout(500);
    { const t = await page.textContent('.wqx .wq-facts'); check(t.includes('Zinc') && t.includes('Results below detection') && t.includes('Caution'), 'wqi: unknown column, <DL, caution'); }
    check((await page.textContent('.wqx .wq-big')).startsWith('WQI 100'), 'wqi: all pass');
    await page.fill('.wqx .wq-obj', 'variable,lo,hi\npH,9,6'); await page.waitForTimeout(500);
    check((await page.textContent('.wqx .wq-err')).includes('lowest allowed value is above'), 'wqi: objective order error');
    await page.fill('.wqx .wq-obj', 'variable,lo,hi\npH,6.5,8.5\nNitrate (mg/L),,2.5');
    await page.setInputFiles('.wqx .dfb-in >> nth=1', { name: 'r.csv', mimeType: 'text/csv', buffer: Buffer.from('date,pH,Nitrate (mg/L)\n1,7,1\n2,9,5\n3,7,1\n4,7,1\n') });
    await page.waitForTimeout(700);
    check((await page.textContent('.wqx .wq-facts')).includes('2 of 2 variables'), 'wqi: results file open');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.wqx .wq-csv')]); check(dl.suggestedFilename() === 'water-quality-index.csv', 'wqi: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.wqx .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'wqi: PDF'); }
    // #157 activated sludge
    await page.goto(`${BASE}/science/activated-sludge/`); await page.waitForTimeout(600);
    check((await page.textContent('.asl .as-big')) === 'Aeration tank 1,248 m³ (HRT 7.49 h)', 'asludge: example');
    { const t = await page.textContent('.asl .as-facts'); check(t.includes('1.88 mg/L') && t.includes('468 kg TSS/day') && t.includes('848 kg O₂/day') && t.includes('21.1 m³/min') && t.includes('60 % of the flow'), 'asludge: facts'); }
    await page.fill('.asl .as-srt', '0.2'); await page.waitForTimeout(500);
    check((await page.textContent('.asl .as-err')).includes('Washout'), 'asludge: washout');
    await page.fill('.asl .as-srt', '8'); await page.fill('.asl .as-xr', '2000'); await page.waitForTimeout(500);
    check((await page.textContent('.asl .as-err')).includes('thicker than the MLSS'), 'asludge: return check');
    await page.fill('.asl .as-xr', '8000'); await page.waitForTimeout(500);
    check((await page.textContent('.asl .as-tabl')).includes('30'), 'asludge: SRT table');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.asl .as-csv')]); check(dl.suggestedFilename() === 'activated-sludge.csv', 'asludge: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.asl .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'asludge: PDF'); }
    // #158 field sampling planner
    await page.goto(`${BASE}/science/field-sampling-planner/`); await page.waitForTimeout(600);
    check((await page.textContent('.fsp .fs-big')) === '73 sample points, 24.1 m apart', 'fsp: example');
    { const t = await page.textContent('.fsp .fs-facts'); check(t.includes('3.87 ha') && t.includes('77') && t.includes('90 %') && t.includes('13.9 m'), 'fsp: facts'); }
    await page.selectOption('.fsp .fs-mode', 'mean'); await page.waitForTimeout(500);
    check((await page.textContent('.fsp .fs-facts')).includes('37'), 'fsp: n for mean');
    await page.selectOption('.fsp .fs-mode', 'action'); await page.selectOption('.fsp .fs-lay', 'random'); await page.waitForTimeout(500);
    check((await page.textContent('.fsp .fs-big')) === '18 sample points, placed at random', 'fsp: action level, random');
    await page.selectOption('.fsp .fs-mode', 'n'); await page.selectOption('.fsp .fs-lay', 'strat'); await page.waitForTimeout(500);
    { const a = await page.textContent('.fsp .fs-tab'); await page.click('.fsp .fs-new'); await page.waitForTimeout(300); check(a !== (await page.textContent('.fsp .fs-tab')), 'fsp: new layout'); }
    await page.fill('.fsp .fs-poly', '0,0\n10,10\n10,0\n0,10'); await page.waitForTimeout(500);
    check((await page.textContent('.fsp .fs-err')).includes('crosses itself'), 'fsp: self-crossing');
    await page.selectOption('.fsp .fs-crs', 'deg'); await page.fill('.fsp .fs-poly', 'lon,lat\n-79.08,43.08\n-79.075,43.08\n-79.075,43.084\n-79.08,43.084'); await page.waitForTimeout(500);
    check((await page.textContent('.fsp .fs-tab')).includes('-79.07') && !(await page.isHidden('.fsp .fs-gpx')), 'fsp: degrees out');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fsp .fs-gpx')]); check(dl.suggestedFilename() === 'sampling-points.gpx', 'fsp: GPX'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fsp .fs-csv')]); check(dl.suggestedFilename() === 'sampling-points.csv', 'fsp: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fsp .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'fsp: PDF'); }
    // #159 bioaccumulation factor
    await page.goto(`${BASE}/science/bioaccumulation-factor/`); await page.waitForTimeout(700);
    check((await page.textContent('.bioa .bi-big')) === 'BCF 1,254 L/kg (k1/k2)', 'bcf: example');
    { const t = await page.textContent('.bioa .bi-facts'); check(t.includes('1,205 to 1,304') && t.includes('0.1202 per day') && t.includes('1,114 L/kg') && t.includes('1,360 L/kg') && t.includes('1,568 L/kg'), 'bcf: facts'); }
    await page.selectOption('.bioa .bi-log', 'raw'); await page.waitForTimeout(600);
    check((await page.textContent('.bioa .bi-big')) === 'BCF 1,248 L/kg (k1/k2)', 'bcf: raw fit');
    await page.fill('.bioa .bi-w2', ''); await page.waitForTimeout(500);
    check((await page.textContent('.bioa .bi-err')).includes('both fish weights'), 'bcf: weight check');
    await page.fill('.bioa .bi-w1', ''); await page.fill('.bioa .bi-tu', '60'); await page.waitForTimeout(500);
    check((await page.textContent('.bioa .bi-err')).includes('2 after it'), 'bcf: phase check');
    await page.fill('.bioa .bi-tu', '28'); await page.waitForTimeout(500);
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.bioa .bi-csv')]); check(dl.suggestedFilename() === 'bcf-fit.csv', 'bcf: CSV'); }
    await page.selectOption('.bioa .bi-mode', 'tmf'); await page.waitForTimeout(600);
    check((await page.textContent('.bioa .bi-big')) === 'TMF 2.72 (95 % CI 2.27 to 3.26)', 'tmf: example');
    check((await page.textContent('.bioa .bi-facts')).includes('biomagnifies'), 'tmf: verdict');
    await page.setInputFiles('.bioa .dfb-in >> nth=1', { name: 'w.csv', mimeType: 'text/csv', buffer: Buffer.from('tl,c\n2,10\n3,12\n4,9\n') });
    await page.waitForTimeout(700);
    check((await page.textContent('.bioa .bi-facts')).includes('no clear trend') && (await page.textContent('.bioa .bi-facts')).includes('3 samples'), 'tmf: file open, flat');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.bioa .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'tmf: PDF'); }
    // #160 noise barrier
    await page.goto(`${BASE}/science/noise-barrier/`); await page.waitForTimeout(600);
    check((await page.textContent('.nbr .nb-big')) === 'Barrier cuts 17.2 dB(A): 76.5 → 59.4 dB(A)', 'barrier: example');
    { const t = await page.textContent('.nbr .nb-facts'); check(t.includes('686 mm') && t.includes('2.02') && t.includes('8.4 to 20.0 dB'), 'barrier: facts'); }
    await page.selectOption('.nbr .nb-m', 'simple'); await page.waitForTimeout(400);
    check((await page.textContent('.nbr .nb-big')) === 'Barrier cuts 15.2 dB(A): 76.5 → 61.3 dB(A)', 'barrier: simple method');
    await page.fill('.nbr .nb-hb', '0.6'); await page.waitForTimeout(400);
    check((await page.textContent('.nbr .nb-facts')).includes('not broken'), 'barrier: clear line of sight');
    await page.fill('.nbr .nb-hb', '4'); await page.fill('.nbr .nb-L0', ''); await page.fill('.nbr .nb-L7', 'x'); await page.waitForTimeout(400);
    check((await page.textContent('.nbr .nb-err')).includes('kHz level should be'), 'barrier: band check');
    await page.fill('.nbr .nb-L7', '58'); await page.waitForTimeout(400);
    check(!(await page.textContent('.nbr .nb-tab')).includes('63\u00a0Hz') && (await page.textContent('.nbr .nb-tab')).includes('125\u00a0Hz'), 'barrier: blank band left out');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.nbr .nb-csv')]); check(dl.suggestedFilename() === 'noise-barrier.csv', 'barrier: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.nbr .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'barrier: PDF'); }
    // #161 tree carbon
    await page.goto(`${BASE}/science/tree-carbon/`); await page.waitForTimeout(600);
    check((await page.textContent('.tkc .tk-big')) === '9 t CO₂e stored in 8 trees', 'tree: example');
    { const t = await page.textContent('.tkc .tk-facts'); check(t.includes('346 kg CO₂e per year') && t.includes('2.46 t') && t.includes('Pine 1, 2.7 t'), 'tree: facts'); }
    await page.fill('.tkc .tk-data', 'A,30,15\nB,40,20'); await page.waitForTimeout(500);
    check((await page.textContent('.tkc .tk-facts')).includes('growing DBH by 0.5 cm'), 'tree: growth rate');
    await page.selectOption('.tkc .tk-form', 'rdh'); await page.waitForTimeout(400);
    check(!(await page.isHidden('.tkc .tk-rhol')) && (await page.textContent('.tkc .tk-big')).includes('2 trees'), 'tree: density form');
    await page.fill('.tkc .tk-data', 'A,30\nB,40,20'); await page.waitForTimeout(500);
    check((await page.textContent('.tkc .tk-err')).includes('needs a height'), 'tree: height check');
    await page.selectOption('.tkc .tk-form', 'd'); await page.waitForTimeout(400);
    await page.setInputFiles('.tkc .dfb-in', { name: 't.csv', mimeType: 'text/csv', buffer: Buffer.from('tree,dbh\nX,25\nY,35\nZ,45\n') });
    await page.waitForTimeout(700);
    check((await page.textContent('.tkc .tk-big')).includes('3 trees'), 'tree: file open');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.tkc .tk-csv')]); check(dl.suggestedFilename() === 'tree-carbon.csv', 'tree: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.tkc .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'tree: PDF'); }
    // #162 LCA compare
    await page.goto(`${BASE}/science/lca-compare/`); await page.waitForTimeout(900);
    check((await page.textContent('.lcc .lx-big')) === 'Reusable bottle is 76 % lower over 365 uses', 'lca: example');
    { const t = await page.textContent('.lcc .lx-facts'); check(t.includes('41.8 kg CO₂e') && t.includes('29 uses') && t.includes('100 % of runs') && t.includes('+435 %'), 'lca: facts'); }
    await page.fill('.lcc .lx-n', '30'); await page.waitForTimeout(900);
    check((await page.textContent('.lcc .lx-facts')).includes('59.2 % of runs'), 'lca: 30 uses uncertainty');
    await page.fill('.lcc .lx-n', '10'); await page.waitForTimeout(900);
    check((await page.textContent('.lcc .lx-big')).startsWith('Single-use bottles is'), 'lca: below break-even');
    await page.fill('.lcc .lx-data', 'A,Materials,Steel,0.3,6,sometimes,20\nB,Materials,PET,0.025,3,once,20'); await page.waitForTimeout(700);
    check((await page.textContent('.lcc .lx-err')).includes('"counted"'), 'lca: basis check');
    await page.setInputFiles('.lcc .dfb-in', { name: 'l.csv', mimeType: 'text/csv', buffer: Buffer.from('product,stage,input,amount,factor,counted\nA,Make,Glass,1,1,once\nB,Make,Can,0.1,5,once\n') });
    await page.waitForTimeout(900);
    check((await page.textContent('.lcc .lx-big')) === 'Reusable bottle is 80 % lower over 10 uses', 'lca: file open');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lcc .lx-csv')]); check(dl.suggestedFilename() === 'lca-compare.csv', 'lca: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lcc .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'lca: PDF'); }
    // #163 DNA sequence tools
    await page.goto(`${BASE}/science/sequence-tools/`); await page.waitForTimeout(900);
    check((await page.textContent('.sqt .sq-big')) === '732 bp, GC 49.5 %, 2 ORFs', 'seq: example');
    check((await page.inputValue('.sqt .sq-rc')).startsWith('>example made-up sequence reverse complement\nGTAGTAAGGATCC'), 'seq: reverse complement');
    { const t = await page.textContent('.sqt .sq-tab'); check(t.includes('41') && t.includes('406') && t.includes('121') && t.includes('457') && t.includes('702') && t.includes('81'), 'seq: ORF table'); }
    await page.selectOption('.sqt .sq-both', '0'); await page.waitForTimeout(700);
    check((await page.textContent('.sqt .sq-big')).endsWith('1 ORF'), 'seq: top strand only');
    await page.selectOption('.sqt .sq-both', '1'); await page.fill('.sqt .sq-min', '10'); await page.waitForTimeout(700);
    check(Number((await page.textContent('.sqt .sq-big')).match(/(\d+) ORFs/)[1]) > 2, 'seq: shorter minimum finds more');
    await page.fill('.sqt .sq-in', '123 !!'); await page.waitForTimeout(700);
    check(!(await page.isHidden('.sqt .sq-err')), 'seq: no bases error');
    await page.fill('.sqt .sq-in', 'AUGGCC'); await page.waitForTimeout(700);
    check((await page.textContent('.sqt .sq-big')).startsWith('6 nt'), 'seq: RNA read');
    check((await page.inputValue('.sqt .sq-rc')).endsWith('GGCCAT'), 'seq: RNA reverse complement');
    await page.setInputFiles('.sqt .sq-file', { name: 's.fasta', mimeType: 'text/plain', buffer: Buffer.from('>one\nATGAAATTTGGGTAA\n>two\nCCCC\n') });
    await page.waitForTimeout(900);
    check((await page.textContent('.sqt .sq-big')).startsWith('15 bp'), 'seq: file open');
    check((await page.textContent('.sqt .sq-facts')).includes('first of 2'), 'seq: multi-record note');
    await page.fill('.sqt .sq-min', '3'); await page.waitForTimeout(700);
    check((await page.textContent('.sqt .sq-big')).endsWith('1 ORF'), 'seq: small ORF');
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.sqt .sq-csv')]); check(dl.suggestedFilename() === 'orfs.csv', 'seq: CSV'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.sqt .sq-faa')]); check(dl.suggestedFilename() === 'orf-proteins.fasta', 'seq: protein FASTA'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.sqt .sq-dl-rc')]); check(dl.suggestedFilename() === 'reverse-complement.fasta', 'seq: RC FASTA'); }
    { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.sqt .dl [data-f=pdf]')]); check(dl.suggestedFilename().endsWith('.pdf'), 'seq: PDF'); }
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
  for (const path of ['/', '/documents/image-resizer/', '/documents/compress-file/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/', '/documents/ats-resume-checker/', '/everyday/planner/', '/money/loan-payoff-planner/', '/money/budget-calculator/', '/documents/resume-builder/', '/money/bill-calendar/', '/science/', '/science/astronomy/', '/science/sky-tonight/', '/science/object-altitude/', '/science/polar-alignment/', '/science/sky-events-calendar/', '/science/observing-log/', '/science/observing-session/', '/science/telescope-calculator/', '/science/star-trail-exposure/', '/science/fits-viewer/', '/science/astro-time/', '/science/sky-coordinates/', '/science/uncertainty-calculator/', '/science/graph-digitizer/', '/science/plot-maker/', '/science/calibration-curve/', '/science/dose-response/', '/science/solution-calculator/', '/science/pcr-master-mix/', '/science/sample-size/', '/science/stereonet/', '/science/psychrometric-calculator/', '/science/plate-layout/', '/science/hemocytometer/', '/science/radiocarbon-calibration/', '/science/sql-playground/', '/science/biodiversity-indices/', '/science/reliability-analysis/', '/science/cosmology-calculator/', '/science/sub-exposure-calculator/', '/science/backfocus-calculator/', '/science/magnitude-flux-converter/', '/science/dark-sky-calendar/', '/science/rocket-equation/', '/science/orbit-transfer-calculator/', '/science/period-finder/', '/science/mosaic-planner/', '/science/meteor-shower-planner/', '/science/light-pollution-calculator/', '/science/habitable-zone-calculator/', '/science/mars-time/', '/science/transit-planner/', '/science/redshift-calculator/', '/science/blackbody-calculator/', '/science/exoplanet-mass-calculator/', '/science/impact-crater-calculator/', '/science/link-budget-calculator/', '/science/radio-telescope-calculator/', '/science/sun-position-calculator/', '/science/jupiter-moons/', '/science/porkchop-plot/', '/science/radial-velocity-fitter/', '/science/eclipse-finder/', '/science/satellite-tracker/', '/science/uv-coverage/', '/science/double-star-calculator/', '/science/rotation-curve-fitter/', '/science/spectral-line-identifier/', '/science/transit-light-curve-fitter/', '/science/star-fwhm-checker/', '/science/hydrogen-line-analyser/', '/science/planet-data-explorer/', '/science/sunspot-counter/', '/science/image-stacker/', '/science/variable-star-log/', '/science/molar-mass-calculator/', '/science/equation-balancer/', '/science/isotope-pattern-calculator/', '/science/reaction-kinetics-fitter/', '/science/titration-curve/', '/science/gas-law-calculator/', '/science/beer-lambert-calculator/', '/science/reaction-equivalents/', '/science/chromatography-calculator/', '/science/method-validation/', '/science/colligative-properties/', '/science/equilibrium-solver/', '/science/cyclic-voltammetry/', '/science/tlc-rf-calculator/', '/science/huckel-mo-calculator/', '/science/crystal-field-calculator/', '/science/diatomic-spectroscopy/', '/science/thermochemistry-calculator/', '/science/nernst-calculator/', '/science/electroplating-calculator/', '/science/green-chemistry-metrics/', '/science/decay-calculator/', '/science/polymer-molar-mass/', '/science/copolymer-composition/', '/science/glass-transition-calculator/', '/science/dsc-tga-analyser/', '/science/battery-cycling-analyser/', '/science/tafel-corrosion-rate/', '/science/nmr-impurity-checker/', '/science/electron-count-calculator/', '/science/phase-diagram-calculator/', '/science/ir-band-finder/', '/science/point-group-finder/', '/science/impedance-fitter/', '/science/enzyme-kinetics-fitter/', '/science/buffer-recipe-calculator/', '/science/binding-curve-fitter/', '/science/centrifuge-calculator/', '/science/air-quality-calculator/', '/science/altermagnet-checker/', '/science/gaussian-plume-calculator/', '/science/mccabe-thiele-calculator/', '/science/vapour-pressure-calculator/', '/science/radiometric-age-calculator/', '/science/isotope-delta-converter/', '/science/mixing-model-calculator/', '/science/ternary-plot-maker/', '/science/piper-diagram/', '/science/pump-test-analyser/', '/science/slug-test-analyser/', '/science/darcy-flow-calculator/', '/science/well-field-drawdown/', '/science/grade-tonnage-calculator/', '/science/drill-hole-composites/', '/science/traverse-calculator/', '/science/level-book-reducer/', '/science/gps-track-analyser/', '/science/spectral-index-calculator/', '/science/skew-t-sounding/', '/science/koppen-climate/', '/science/trend-analyser/', '/science/wave-calculator/', '/science/manning-weir-calculator/', '/science/runoff-calculator/', '/science/flood-frequency/', '/science/et0-calculator/', '/science/rating-curve/', '/science/altermagnet-bands/', '/science/anomalous-hall-checker/', '/science/spin-splitter-conductivity/', '/science/chiral-magnon-bands/', '/science/unit-hydrograph/', '/science/rain-gauge-average/', '/science/lc50-probit/', '/science/species-sensitivity/', '/science/non-detects/', '/science/landfill-gas/', '/science/detention-pond/', '/science/water-quality-index/', '/science/activated-sludge/', '/science/field-sampling-planner/', '/science/bioaccumulation-factor/', '/science/noise-barrier/', '/science/tree-carbon/', '/science/lca-compare/', '/science/sequence-tools/', '/science/environment/', '/science/cell-biology/', '/science/ecology/', '/science/social/', '/privacy/', '/terms/', '/stats/', '/contact/']) {
    await phone.goto(BASE + path);
    const sw = await phone.evaluate(() => document.documentElement.scrollWidth);
    check(sw <= 390, `${path} fits a phone (scrollWidth ${sw})`);
  }
  // Phone tool list: a full-height side panel half the screen wide; the page behind still scrolls.
  await phone.goto(BASE + '/money/bill-calendar/');
  await phone.click('.menu-btn');
  const box = await phone.locator('#all-tools').boundingBox();
  const vw = phone.viewportSize();
  check(box && box.width < vw.width * 0.75 && box.y + box.height >= vw.height - 2, `phone menu: side panel ${box && Math.round(box.width)} of ${vw.width} px wide, full height`);
  check((await phone.locator('#all-tools .at-shelf').count()) === 4 && (await phone.locator('#all-tools details[open]').count()) === 0, 'phone menu: every shelf and subject starts folded');
  await phone.click('#all-tools .at-shelf[data-shelf=science] > summary'); await phone.click('#all-tools .at-sj > summary');
  check(await phone.isVisible('#all-tools .at-sj[open] .at-item'), 'phone menu: opening a subject lists its tools with their numbers');
  await phone.fill('.at-search', 'loan');
  await phone.waitForSelector('.at-results .ti');
  check((await phone.textContent('.at-results .ti .nm')) === 'Loan payoff planner' && !(await phone.isVisible('.at-browse')), 'phone menu: search finds any tool and hides the shelves');
  await phone.fill('.at-search', '');
  await phone.mouse.wheel(0, 0);
  await phone.evaluate(() => window.scrollTo(0, 400));
  check((await phone.evaluate(() => window.scrollY)) > 300, 'phone menu: the page still scrolls while it is open');
  await phone.click('.at-close');
  // The picture of each tool's steps stays on one row, even on a 320 px screen.
  await phone.setViewportSize({ width: 320, height: 640 });
  for (const path of ['/documents/compress-file/', '/documents/image-resizer/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/', '/documents/ats-resume-checker/', '/everyday/planner/', '/money/loan-payoff-planner/', '/money/budget-calculator/', '/documents/resume-builder/', '/money/bill-calendar/', '/science/sky-tonight/', '/science/object-altitude/', '/science/polar-alignment/', '/science/sky-events-calendar/', '/science/observing-log/', '/science/observing-session/', '/science/telescope-calculator/', '/science/star-trail-exposure/', '/science/fits-viewer/', '/science/astro-time/', '/science/sky-coordinates/', '/science/uncertainty-calculator/', '/science/graph-digitizer/', '/science/plot-maker/', '/science/calibration-curve/', '/science/dose-response/', '/science/solution-calculator/', '/science/pcr-master-mix/', '/science/sample-size/', '/science/stereonet/', '/science/psychrometric-calculator/', '/science/plate-layout/', '/science/hemocytometer/', '/science/radiocarbon-calibration/', '/science/sql-playground/', '/science/biodiversity-indices/', '/science/reliability-analysis/', '/science/cosmology-calculator/', '/science/sub-exposure-calculator/', '/science/backfocus-calculator/', '/science/magnitude-flux-converter/', '/science/dark-sky-calendar/', '/science/rocket-equation/', '/science/orbit-transfer-calculator/', '/science/period-finder/', '/science/mosaic-planner/', '/science/meteor-shower-planner/', '/science/light-pollution-calculator/', '/science/habitable-zone-calculator/', '/science/mars-time/', '/science/transit-planner/', '/science/redshift-calculator/', '/science/blackbody-calculator/', '/science/exoplanet-mass-calculator/', '/science/impact-crater-calculator/', '/science/link-budget-calculator/', '/science/radio-telescope-calculator/', '/science/sun-position-calculator/', '/science/jupiter-moons/', '/science/porkchop-plot/', '/science/radial-velocity-fitter/', '/science/eclipse-finder/', '/science/satellite-tracker/', '/science/uv-coverage/', '/science/double-star-calculator/', '/science/rotation-curve-fitter/', '/science/spectral-line-identifier/', '/science/transit-light-curve-fitter/', '/science/star-fwhm-checker/', '/science/hydrogen-line-analyser/', '/science/planet-data-explorer/', '/science/sunspot-counter/', '/science/image-stacker/', '/science/variable-star-log/', '/science/molar-mass-calculator/', '/science/equation-balancer/', '/science/isotope-pattern-calculator/', '/science/reaction-kinetics-fitter/', '/science/titration-curve/', '/science/gas-law-calculator/', '/science/beer-lambert-calculator/', '/science/reaction-equivalents/', '/science/chromatography-calculator/', '/science/method-validation/', '/science/colligative-properties/', '/science/equilibrium-solver/', '/science/cyclic-voltammetry/', '/science/tlc-rf-calculator/', '/science/huckel-mo-calculator/', '/science/crystal-field-calculator/', '/science/diatomic-spectroscopy/', '/science/thermochemistry-calculator/', '/science/nernst-calculator/', '/science/electroplating-calculator/', '/science/green-chemistry-metrics/', '/science/decay-calculator/', '/science/polymer-molar-mass/', '/science/copolymer-composition/', '/science/glass-transition-calculator/', '/science/dsc-tga-analyser/', '/science/battery-cycling-analyser/', '/science/tafel-corrosion-rate/', '/science/nmr-impurity-checker/', '/science/electron-count-calculator/', '/science/phase-diagram-calculator/', '/science/ir-band-finder/', '/science/point-group-finder/', '/science/impedance-fitter/', '/science/enzyme-kinetics-fitter/', '/science/buffer-recipe-calculator/', '/science/binding-curve-fitter/', '/science/centrifuge-calculator/', '/science/air-quality-calculator/', '/science/altermagnet-checker/', '/science/gaussian-plume-calculator/', '/science/mccabe-thiele-calculator/', '/science/vapour-pressure-calculator/', '/science/radiometric-age-calculator/', '/science/isotope-delta-converter/', '/science/mixing-model-calculator/', '/science/ternary-plot-maker/', '/science/piper-diagram/', '/science/pump-test-analyser/', '/science/slug-test-analyser/', '/science/darcy-flow-calculator/', '/science/well-field-drawdown/', '/science/grade-tonnage-calculator/', '/science/drill-hole-composites/', '/science/traverse-calculator/', '/science/level-book-reducer/', '/science/gps-track-analyser/', '/science/spectral-index-calculator/', '/science/skew-t-sounding/', '/science/koppen-climate/', '/science/trend-analyser/', '/science/wave-calculator/', '/science/manning-weir-calculator/', '/science/runoff-calculator/', '/science/flood-frequency/', '/science/et0-calculator/', '/science/rating-curve/', '/science/altermagnet-bands/', '/science/anomalous-hall-checker/', '/science/spin-splitter-conductivity/', '/science/chiral-magnon-bands/', '/science/unit-hydrograph/', '/science/rain-gauge-average/', '/science/lc50-probit/', '/science/species-sensitivity/', '/science/non-detects/', '/science/landfill-gas/', '/science/detention-pond/', '/science/water-quality-index/', '/science/activated-sludge/', '/science/field-sampling-planner/', '/science/bioaccumulation-factor/', '/science/noise-barrier/', '/science/tree-carbon/', '/science/lca-compare/', '/science/sequence-tools/']) {
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
  await ctx.unrouteAll({ behavior: 'ignoreErrors' });
  await browser.close();
} finally {
  server.kill();
}
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
