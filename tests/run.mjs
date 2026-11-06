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
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.cmp-download')]);
    const path = OUT + `fit-${kb}-${dl.suggestedFilename()}`;
    await dl.saveAs(path);
    return { path, note: await page.textContent('.cmp-note') };
  }
  {
    const r = await fit('photo.pdf', 200);
    check(r.path && size(r.path) <= 200 * 1024, `fit: 26 MB PDF under 200 KB -> ${r.path && (size(r.path) / 1024).toFixed(0)} KB (${r.note ?? r.error})`);
    check(r.path && (await PDFDocument.load(readFileSync(r.path))).getPageCount() === 3, 'fit: PDF keeps its 3 pages');
    const i = await fit('photo.png', 100);
    check(i.path && size(i.path) <= 100 * 1024, `fit: 13 MB PNG under 100 KB -> ${i.path && (size(i.path) / 1024).toFixed(0)} KB (${i.note ?? i.error})`);
    const t = await fit('text.pdf', 100);
    check(/already under/.test(t.note ?? ''), `fit: small file already fits -> "${(t.note ?? t.error).trim()}"`);
    const tiny = await fit('photo.pdf', 10);
    check(/lowest quality/.test(tiny.error ?? '') || (tiny.path && size(tiny.path) <= 10240), `fit: impossible limit is explained -> "${(tiny.error ?? 'fitted').trim().slice(0, 90)}"`);
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

  check(pageErrors.length === 0, `no page or CSP errors ${pageErrors.join(' | ')}`);

  // 9. Phone: 50 MB limit, layout fits.
  const phoneCtx = await browser.newContext({ ...require('playwright').devices['iPhone 13'], acceptDownloads: true });
  const phone = await phoneCtx.newPage();
  await phone.goto(BASE + '/documents/compress-file/');
  check((await phone.textContent('.cmp-limit')) === '50 MB', `phone limit shown: ${await phone.textContent('.cmp-limit')}`);
  writeFileSync(OUT + 'big.csv', Buffer.alloc(51 * 1024 * 1024, 65));
  await phone.setInputFiles('.cmp-input', OUT + 'big.csv');
  check(/limit is 50/.test(await phone.textContent('.cmp-error')), 'phone: 51 MB file gets a clear limit message');
  for (const path of ['/', '/documents/image-resizer/', '/documents/compress-file/', '/documents/zip-checker/', '/privacy/', '/terms/', '/stats/', '/contact/']) {
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
