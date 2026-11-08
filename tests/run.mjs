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
  check(pageErrors.length === 0, `no page or CSP errors ${pageErrors.join(' | ')}`);

  // 9. Phone: 50 MB limit, layout fits.
  const phoneCtx = await browser.newContext({ ...require('playwright').devices['iPhone 13'], acceptDownloads: true });
  const phone = await phoneCtx.newPage();
  await phone.goto(BASE + '/documents/compress-file/');
  check((await phone.textContent('.cmp-limit')) === '50 MB', `phone limit shown: ${await phone.textContent('.cmp-limit')}`);
  writeFileSync(OUT + 'big.csv', Buffer.alloc(51 * 1024 * 1024, 65));
  await phone.setInputFiles('.cmp-input', OUT + 'big.csv');
  check(/limit is 50/.test(await phone.textContent('.cmp-error')), 'phone: 51 MB file gets a clear limit message');
  for (const path of ['/', '/documents/image-resizer/', '/documents/compress-file/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/', '/documents/ats-resume-checker/', '/everyday/planner/', '/money/loan-payoff-planner/', '/money/budget-calculator/', '/documents/resume-builder/', '/money/bill-calendar/', '/science/', '/science/astronomy/', '/science/sky-tonight/', '/science/object-altitude/', '/science/polar-alignment/', '/science/sky-events-calendar/', '/science/observing-log/', '/science/observing-session/', '/science/telescope-calculator/', '/science/star-trail-exposure/', '/science/fits-viewer/', '/science/astro-time/', '/science/sky-coordinates/', '/science/uncertainty-calculator/', '/science/graph-digitizer/', '/science/plot-maker/', '/science/calibration-curve/', '/science/dose-response/', '/science/solution-calculator/', '/science/pcr-master-mix/', '/science/sample-size/', '/science/stereonet/', '/science/psychrometric-calculator/', '/science/plate-layout/', '/science/hemocytometer/', '/science/radiocarbon-calibration/', '/science/sql-playground/', '/science/biodiversity-indices/', '/science/reliability-analysis/', '/science/ecology/', '/science/social/', '/privacy/', '/terms/', '/stats/', '/contact/']) {
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
  for (const path of ['/documents/compress-file/', '/documents/image-resizer/', '/documents/zip-checker/', '/everyday/link-cleaner/', '/everyday/linkedin-post-formatter/', '/documents/prompt-pruner/', '/documents/file-converter/', '/documents/ats-resume-checker/', '/everyday/planner/', '/money/loan-payoff-planner/', '/money/budget-calculator/', '/documents/resume-builder/', '/money/bill-calendar/', '/science/sky-tonight/', '/science/object-altitude/', '/science/polar-alignment/', '/science/sky-events-calendar/', '/science/observing-log/', '/science/observing-session/', '/science/telescope-calculator/', '/science/star-trail-exposure/', '/science/fits-viewer/', '/science/astro-time/', '/science/sky-coordinates/', '/science/uncertainty-calculator/', '/science/graph-digitizer/', '/science/plot-maker/', '/science/calibration-curve/', '/science/dose-response/', '/science/solution-calculator/', '/science/pcr-master-mix/', '/science/sample-size/', '/science/stereonet/', '/science/psychrometric-calculator/', '/science/plate-layout/', '/science/hemocytometer/', '/science/radiocarbon-calibration/', '/science/sql-playground/', '/science/biodiversity-indices/', '/science/reliability-analysis/']) {
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
