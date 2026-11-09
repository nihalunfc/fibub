// #805 figure checker
export const path = '/science/figure-checker/';
const LINEART = 'SUkqACAAAAD/ycCz///////////////////x/8AEAEAMAAABAwABAAAAUAAAAAEBAwABAAAAPAAAAAIBAwABAAAAAQAAAAMBAwABAAAABAAAAAYBAwABAAAAAQAAABEBBAABAAAACAAAABYBAwABAAAAPAAAABcBBAABAAAAGAAAABoBBQABAAAAtgAAABsBBQABAAAAvgAAABwBAwABAAAAAQAAACgBAwABAAAAAgAAAAAAAACwBAAAAQAAALAEAAABAAAA';
const RGBTIF = 'SUkqAD4AAACAIslOV4qkggZQJU1CZXrxmq9ymJ8gpKF8rJNjEITmpqqsWqcckUojcHJlZNcmDQTvokNeAgANAAABAwABAAAABQAAAAEBAwABAAAAAwAAAAIBAwADAAAA8AAAAAMBAwABAAAABQAAAAYBAwABAAAAAgAAABEBBAABAAAACAAAABUBAwABAAAAAwAAABYBAwABAAAAAwAAABcBBAABAAAANQAAABoBBQABAAAA4AAAABsBBQABAAAA6AAAABwBAwABAAAAAQAAACgBAwABAAAAAgAAAAAAAADCAQAAAQAAAMIBAAABAAAACAAIAAgA';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const { readMeta } = await import('../../src/lib/sci/figcheck.ts');
  await page.goto(`${BASE}/science/figure-checker/`); await page.waitForTimeout(900);
  const big = () => page.textContent('.fgc .fc-big');
  check((await big()) === 'Passes at 1 of 3 widths: up to 102 mm wide at 300 dpi', 'figure checker: example headline');
  { const f = await page.textContent('.fgc .fc-facts'); check(f.includes('1200 × 800') && f.includes('150 dpi') && f.includes('PNG pHYs') && f.includes('203 × 135 mm') && f.includes('102 × 67.7 mm'), 'figure checker: example facts'); }
  { const t = await page.textContent('.fgc .fc-tab'); check(t.includes('35956.7') && t.includes('Too few pixels') && t.includes('2067 wide') && t.includes('1418 wide') && t.includes('OK'), 'figure checker: example table'); }
  check((await page.$$('.fgc .fc-grid canvas')).length === 5 && (await page.textContent('.fgc .fc-grid')).includes('Deuteranopia') && (await page.textContent('.fgc .fc-grid')).includes('Greyscale print'), 'figure checker: five previews');
  // Deuteranopia view: the red and green bars come out much closer than in the original.
  { const d = await page.evaluate(() => { const cs = [...document.querySelectorAll('.fgc .fc-grid canvas')]; const at = (c, x, y) => [...c.getContext('2d').getImageData(x, y, 1, 1).data]; const w = cs[0].width / 1200; const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); return [0, 1].map((k) => dist(at(cs[k], Math.round(950 * w), Math.round(600 * w)), at(cs[k], Math.round(1050 * w), Math.round(600 * w)))); });
    check(d[0] > 150 && d[1] < 60, `figure checker: red and green bars merge for deuteranopia (${d.map(Math.round).join(' → ')})`); }
  // Line art: 1000 dpi, every width fails.
  await page.selectOption('.fgc .fc-type', '1000'); await page.waitForTimeout(400);
  check((await big()).startsWith('Too small for every width at 1000 dpi') && await page.inputValue('.fgc .fc-min') === '1000', 'figure checker: line art type');
  await page.fill('.fgc .fc-min', '150'); await page.waitForTimeout(400);
  check((await big()) === 'Passes at every width: up to 203 mm wide at 150 dpi', 'figure checker: typed minimum DPI');
  await page.fill('.fgc .fc-widths', 'Tiny, 40, 20'); await page.waitForTimeout(400);
  check((await page.textContent('.fgc .fc-tab')).includes('Too tall') && (await big()).startsWith('Passes at 0 of 1'), 'figure checker: maximum height');
  await page.fill('.fgc .fc-widths', 'Wide, lots'); await page.waitForTimeout(400);
  check((await page.textContent('.fgc .fc-werr')).includes('Line 1 (Wide)'), 'figure checker: bad width message');
  await page.fill('.fgc .fc-widths', 'Single column, 85'); await page.fill('.fgc .fc-min', '300'); await page.waitForTimeout(400);
  // Strength slider.
  await page.fill('.fgc .fc-sev', '50'); await page.dispatchEvent('.fgc .fc-sev', 'input'); await page.waitForTimeout(500);
  check((await page.textContent('.fgc .fc-sevv')) === '50 %', 'figure checker: strength slider');
  // Fix the DPI and read the download back.
  await page.fill('.fgc .fc-newdpi', '300');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fgc .fc-fix')]); const f = OUT + 'fixed.png'; await d.saveAs(f); const m = readMeta(new Uint8Array(readFileSync(f)));
    check(Math.abs(m.dpiX - 300) < 0.05 && m.width === 1200 && d.suggestedFilename() === 'example-figure-300dpi.png' && (await page.textContent('.fgc .fc-fixnote')).includes('102 × 67.7 mm'), 'figure checker: download with a new DPI'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fgc .fc-png')]); const f = OUT + 'cmp.png'; await d.saveAs(f); check(readFileSync(f).length > 5000, 'figure checker: comparison PNG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fgc .dl [data-f=pdf]')]); const f = OUT + 'fc.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'figure checker: PDF report'); }
  // A JPEG made in the page at 72 dpi.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 3000; c.height = 2000; const x = c.getContext('2d'); x.fillStyle = '#369'; x.fillRect(0, 0, 3000, 2000); return c.toDataURL('image/jpeg', 0.8).split(',')[1]; });
    writeFileSync(OUT + 'photo.jpg', Buffer.from(b64, 'base64')); }
  await page.setInputFiles('.fgc .fc-file', OUT + 'photo.jpg'); await page.waitForTimeout(1200);
  { const f = await page.textContent('.fgc .fc-facts'); check(f.includes('JPEG') && f.includes('3000 × 2000') && (await big()).startsWith('Passes at every width: up to 254 mm'), `figure checker: opened JPEG (${(await big())})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fgc .fc-fix')]); const f = OUT + 'photo300.jpg'; await d.saveAs(f); const m = readMeta(new Uint8Array(readFileSync(f))); check(m.dpiX === 300 && m.width === 3000, 'figure checker: JPEG DPI rewritten'); }
  // TIFFs: RGB with LZW (preview), and 1-bit fax line art (size only).
  writeFileSync(OUT + 'rgb.tif', Buffer.from(RGBTIF, 'base64')); writeFileSync(OUT + 'line.tif', Buffer.from(LINEART, 'base64'));
  await page.setInputFiles('.fgc .fc-file', OUT + 'rgb.tif'); await page.waitForTimeout(800);
  check((await page.textContent('.fgc .fc-facts')).includes('450 dpi') && (await page.textContent('.fgc .fc-notes')).includes('LZW') && await page.isVisible('.fgc .fc-grid canvas') && await page.isDisabled('.fgc .fc-fix'), 'figure checker: RGB TIFF with LZW, preview shown, DPI fix off');
  await page.setInputFiles('.fgc .fc-file', OUT + 'line.tif'); await page.waitForTimeout(800);
  check((await page.textContent('.fgc .fc-facts')).includes('1200 dpi') && (await page.textContent('.fgc .fc-facts')).includes('1-bit') && (await page.textContent('.fgc .fc-cvdnote')).includes('not shown') && await page.isHidden('.fgc .fc-grid'), 'figure checker: 1-bit line-art TIFF, sizes only');
  // SVG: vector.
  writeFileSync(OUT + 'fig.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="85mm" height="60mm" viewBox="0 0 85 60"><rect width="85" height="60" fill="#d62728"/></svg>');
  await page.setInputFiles('.fgc .fc-file', OUT + 'fig.svg'); await page.waitForTimeout(600);
  check((await big()) === 'SVG vector figure, 85 × 60 mm' && await page.isHidden('.fgc .fc-raster') && await page.isHidden('.fgc .fc-cvd'), 'figure checker: SVG is vector');
  // Not a figure.
  writeFileSync(OUT + 'notes.txt', 'hello');
  await page.setInputFiles('.fgc .fc-file', OUT + 'notes.txt'); await page.waitForTimeout(400);
  check((await page.textContent('.fgc .fc-err')).startsWith('This file is not a PNG') && await page.isHidden('.fgc .fc-out'), 'figure checker: other file message');
  await page.click('.fgc .fc-ex'); await page.waitForTimeout(800);
  check(await page.isHidden('.fgc .fc-err') && (await big()).includes('300 dpi'), 'figure checker: back to the example');
};
