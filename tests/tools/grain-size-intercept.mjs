// #853 grain size by line intercept
export const path = '/science/grain-size-intercept/';
// A tiny uncompressed 16-bit greyscale TIFF.
const tiff16 = (w, h, f) => {
  const n = 9, ifd = 8, data = ifd + 2 + n * 12 + 4, b = Buffer.alloc(data + w * h * 2);
  b.write('II', 0); b.writeUInt16LE(42, 2); b.writeUInt32LE(ifd, 4); b.writeUInt16LE(n, ifd);
  [[256, 3, w], [257, 3, h], [258, 3, 16], [259, 3, 1], [262, 3, 1], [273, 4, data], [277, 3, 1], [278, 3, h], [279, 4, w * h * 2]].forEach(([t, ty, v], i) => {
    const e = ifd + 2 + i * 12; b.writeUInt16LE(t, e); b.writeUInt16LE(ty, e + 2); b.writeUInt32LE(1, e + 4); if (ty === 3) b.writeUInt16LE(v, e + 8); else b.writeUInt32LE(v, e + 8);
  });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) b.writeUInt16LE(f(x, y), data + 2 * (y * w + x));
  return b;
};
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.gsi ';
  const big = () => page.textContent(R + '.gs-big'), facts = () => page.textContent(R + '.gs-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await big()) === 'ℓ = 16.41 µm, G = 8.6', `grain: example ℓ and G (${await big()})`);
  { const f = await facts(); check(f.includes('95 % CI 15.62 µm to 17.28 µm') && f.includes('8.56') && f.includes('8.41 to 8.71') && f.includes('179.5 on 10 lines') && f.includes('5.1 %'), 'grain: example interval, G, count and relative accuracy'); }
  check((await page.textContent(R + '.mg-calout')).startsWith('1 pixel = 500 nm') && (await page.textContent(R + '.gs-thelp')).includes('Automatic: 71'), 'grain: example scale and automatic threshold');
  check((await page.locator(R + '.gs-tab tbody tr').count()) === 10 && (await page.textContent(R + '.gs-tab')).includes('V5'), 'grain: per-line table');
  await page.selectOption(R + '.gs-conf', '0.99'); await page.waitForTimeout(100);
  check((await facts()).includes('99 % CI') && (await big()) === 'ℓ = 16.41 µm, G = 8.6', 'grain: 99 % interval keeps ℓ');
  await page.selectOption(R + '.gs-conf', '0.95');
  await page.selectOption(R + '.gs-pat', 'circles'); await page.waitForTimeout(150);
  check((await big()) === 'ℓ = 16.31 µm, G = 8.6' && (await facts()).includes('on 3 lines') && (await page.isDisabled(R + '.gs-n')), 'grain: three circles');
  await page.selectOption(R + '.gs-pat', 'h'); await page.waitForTimeout(150);
  check((await page.locator(R + '.gs-tab tbody tr').count()) === 5, 'grain: horizontal lines only');
  await page.selectOption(R + '.gs-pat', 'v'); await page.fill(R + '.gs-n', '8'); await page.waitForTimeout(500);
  check((await page.locator(R + '.gs-tab tbody tr').count()) === 8 && (await page.textContent(R + '.gs-tab')).includes('V8'), 'grain: eight vertical lines');
  await page.fill(R + '.gs-n', '0'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mg-err')).includes('between 1 and 40') && await page.isHidden(R + '.gs-out'), 'grain: bad number of lines message');
  await page.selectOption(R + '.gs-pat', 'hv'); await page.fill(R + '.gs-n', '5'); await page.waitForTimeout(500);
  check((await big()) === 'ℓ = 16.41 µm, G = 8.6', 'grain: back to the example');
  await page.fill(R + '.gs-t', '300'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mg-err')).includes('grey level from 0 to 255'), 'grain: bad threshold message');
  await page.fill(R + '.gs-t', '5'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mg-err')).includes('No boundaries were found') && await page.isHidden(R + '.gs-out'), 'grain: threshold too low finds nothing');
  await page.fill(R + '.gs-t', ''); await page.selectOption(R + '.gs-mode', 'light'); await page.waitForTimeout(300);
  check((await facts()).includes('on 10 lines') && !(await big()).includes('16.41'), 'grain: light-boundary mode counts something else');
  await page.selectOption(R + '.gs-mode', 'edge'); await page.waitForTimeout(300);
  { const b = await big(), l = Number(b.match(/ℓ = ([\d.]+) µm/)?.[1]); check((await page.textContent(R + '.gs-thelp')).includes('per pixel') && l > 14 && l < 19, `grain: edge mode finds the boundary lines too (${b})`); }
  await page.selectOption(R + '.gs-mode', 'dark'); await page.waitForTimeout(300);
  // Tap a line between two marks to add one, then tap it again to take it away.
  const marks = async () => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gs-mcsv')]); const f = OUT + 'gmarks.csv'; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  { const rows = (await marks()).slice(1).map((r) => r.split(',')).filter((r) => r[0] === 'H3').map((r) => Number(r[1])).sort((a, b) => a - b);
    let gx = 0, gw = 0; for (let i = 1; i < rows.length; i++) if (rows[i] - rows[i - 1] > gw) { gw = rows[i] - rows[i - 1]; gx = (rows[i] + rows[i - 1]) / 2; }
    const y = Math.floor(2.5 * 508 / 5), cv = page.locator(R + '.mg-canvas'); await cv.scrollIntoViewIfNeeded(); const bb = await cv.boundingBox();
    const at = [bb.x + (gx / 720) * bb.width, bb.y + ((y + 1) / 540) * bb.height];
    await page.mouse.click(...at); await page.waitForTimeout(150);
    check((await facts()).includes('180.5 on 10 lines') && (await page.textContent(R + '.gs-edits')) === '1 change by tapping' && (await page.textContent(R + '.gs-tab')).includes('H3'), 'grain: tap adds a mark');
    const m = await marks(); check(m.some((r) => r.startsWith('H3,') && r.endsWith(',yes')), 'grain: added mark in the marks CSV');
    await cv.scrollIntoViewIfNeeded(); const b2 = await cv.boundingBox();
    await page.mouse.click(b2.x + (gx / 720) * b2.width, b2.y + ((y + 1) / 540) * b2.height); await page.waitForTimeout(150);
    check((await facts()).includes('179.5 on 10 lines') && (await page.textContent(R + '.gs-edits')) === '2 changes by tapping', 'grain: tap on a mark removes it'); }
  await page.click(R + '.gs-recount'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.gs-edits')) === '', 'grain: count again clears tap changes');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gs-csv')]); const f = OUT + 'grain.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('line,length_um,boundaries,per_mm,intercept_um') && t.includes('G (ASTM E112 relation),8.564') && t.split('\n').length > 14, 'grain: lines CSV'); }
  // Scale: clearing the length leaves pixels; drawing on the scale bar sets the pixels.
  await page.fill(R + '.mg-blen', ''); await page.waitForTimeout(500);
  check((await big()) === 'ℓ = 32.81 px (calibrate for G)' && (await page.textContent(R + '.mg-calout')).startsWith('Not calibrated'), 'grain: no scale gives pixels and no G');
  { const cv = page.locator(R + '.mg-canvas'); await cv.scrollIntoViewIfNeeded(); await page.click(R + '.mg-draw'); await cv.scrollIntoViewIfNeeded(); const bb = await cv.boundingBox();
    await page.mouse.click(bb.x + (608 / 720) * bb.width, bb.y + (518 / 540) * bb.height); await page.mouse.click(bb.x + (708 / 720) * bb.width, bb.y + (518 / 540) * bb.height); await page.waitForTimeout(100);
    const px = Number(await page.inputValue(R + '.mg-bpx')); check(Math.abs(px - 100) < 2, `grain: two taps on the scale bar give about 100 px (${px})`); }
  await page.fill(R + '.mg-bpx', '100'); await page.fill(R + '.mg-blen', '0.05'); await page.selectOption(R + '.mg-unit', 'mm'); await page.waitForTimeout(500);
  check((await big()) === 'ℓ = 16.41 µm, G = 8.6', 'grain: the scale in mm gives the same ℓ');
  // Area by two taps: about the right half (lines then about 170 µm long instead of 345.5).
  { const cv = page.locator(R + '.mg-canvas'); await page.click(R + '.mg-area'); await cv.scrollIntoViewIfNeeded(); const bb = await cv.boundingBox();
    await page.mouse.click(bb.x + bb.width * 0.5, bb.y + bb.height * 0.4); await page.mouse.click(bb.x + bb.width * 0.99, bb.y + bb.height * 0.9); await page.waitForTimeout(200);
    const h1 = (await page.textContent(R + '.gs-tab tbody tr:first-child td:nth-child(2)')); check(Number(h1) > 160 && Number(h1) < 180, `grain: area set by two taps (H1 ${h1} µm)`); }
  await page.click(R + '.mg-full'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.gs-tab tbody tr:first-child td:nth-child(2)')) === '345.5' && (await facts()).includes('on 10 lines'), 'grain: whole image');
  // A 16-bit TIFF: vertical boundary lines every 20 px; horizontal lines 191 px long cross 10 of them, so ℓ = 19.1 px,
  // 1.91 µm at a typed pixel size of 0.1 µm.
  writeFileSync(OUT + 'grains16.tif', tiff16(200, 120, (x) => (x % 20 === 10 || x % 20 === 11 ? 5000 : 30000)));
  await page.setInputFiles(R + '.mg-file', OUT + 'grains16.tif'); await page.waitForTimeout(600);
  await page.selectOption(R + '.gs-pat', 'h'); await page.fill(R + '.gs-t', ''); await page.fill(R + '.mg-pix', '0.1'); await page.selectOption(R + '.mg-unit', 'µm'); await page.waitForTimeout(600);
  check((await big()) === 'ℓ = 1.91 µm, G = 14.8' && (await page.textContent(R + '.mg-note')).includes('16-bit data stretched from 5000') && (await facts()).includes('50 on 5 lines'), `grain: 16-bit TIFF with a typed pixel size (${await big()})`);
  // A PNG made in the page, 2000 px wide, scaled to 1600: the typed pixel size is for the original pixels.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 2000; c.height = 1000; const x = c.getContext('2d'); x.fillStyle = '#ddd'; x.fillRect(0, 0, 2000, 1000); x.fillStyle = '#222'; for (let i = 50; i < 2000; i += 100) x.fillRect(i, 0, 5, 1000); return c.toDataURL('image/png').split(',')[1]; });
    writeFileSync(OUT + 'grains.png', Buffer.from(b64, 'base64')); }
  await page.setInputFiles(R + '.mg-file', OUT + 'grains.png'); await page.waitForTimeout(800);
  { const b = await big(), l = Number(b.match(/ℓ = ([\d.]+) µm/)?.[1]); check((await page.textContent(R + '.mg-note')).includes('Scaled down from 2000 × 1000 to 1600 × 800') && (await page.textContent(R + '.mg-calout')).startsWith('1 pixel = 125 nm') && Math.abs(l / 10 - 1) < 0.05, `grain: scaled PNG keeps the original pixel size (${b})`); }
  await page.setInputFiles(R + '.mg-file', { name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('not an image') }); await page.waitForTimeout(400);
  check((await page.textContent(R + '.mg-err')).includes('could not be opened'), 'grain: unreadable file message');
};
