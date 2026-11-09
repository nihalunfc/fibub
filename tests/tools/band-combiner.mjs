// #895 band combiner
import { deflateSync } from 'node:zlib';
export const path = '/science/band-combiner/';
// A one-band 16-bit TIFF, w × h, values f(x, y).
const tiff16 = (w, h, f) => {
  const n = 9, ifd = 8, data = ifd + 2 + n * 12 + 4, b = Buffer.alloc(data + w * h * 2);
  b.write('II', 0); b.writeUInt16LE(42, 2); b.writeUInt32LE(ifd, 4); b.writeUInt16LE(n, ifd);
  [[256, 3, w], [257, 3, h], [258, 3, 16], [259, 3, 1], [262, 3, 1], [273, 4, data], [277, 3, 1], [278, 3, h], [279, 4, w * h * 2]].forEach(([t, ty, v], i) => {
    const e = ifd + 2 + i * 12; b.writeUInt16LE(t, e); b.writeUInt16LE(ty, e + 2); b.writeUInt32LE(1, e + 4); if (ty === 3) b.writeUInt16LE(v, e + 8); else b.writeUInt32LE(v, e + 8);
  });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) b.writeUInt16LE(f(x, y), data + 2 * (y * w + x));
  return b;
};
// An 8-bit grey PNG.
const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (buf) => { let c = 0xffffffff; for (const v of buf) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const pngGrey = (w, h, f) => {
  const hd = Buffer.alloc(13); hd.writeUInt32BE(w, 0); hd.writeUInt32BE(h, 4); hd[8] = 8; hd[9] = 0;
  const raw = Buffer.alloc((w + 1) * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) raw[y * (w + 1) + 1 + x] = f(x, y);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', hd), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
};
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.bcx ', big = () => page.textContent(R + '.bc-big'), tab = () => page.$$eval(R + '.bc-tab tr', (r) => r.map((x) => Array.from(x.children, (c) => c.textContent)));
  const px = () => page.textContent(R + '.bc-px'), err = () => page.textContent(R + '.bc-err'), wait = (ms = 400) => page.waitForTimeout(ms);
  await page.goto(`${BASE}${path}`); await wait(1200);
  check((await big()) === 'R 4, G 3, B 2: NIR / Red / Green', `bands: example opens in colour infrared (${await big()})`);
  { const t = await tab(); check(t[1].join('|') === 'Red|4: NIR|0.016851|0.54049|0.014136|0.57568|0.29117|0.14752' && t[3][1] === '2: Green', `bands: example channel table, 2–98 % clip (${t[1].join('|')})`); }
  { const p = await px(); check(p.includes('row 90, column 120') && p.includes('map x 501205, y 5199095 (EPSG:32633)') && p.includes('R 0, G 14, B 50') && p.includes('4: 0.016763'), 'bands: pixel box at the centre: river, map coordinates, display levels, all six bands'); }
  check((await page.textContent(R + '.bc-pnote')).startsWith('Healthy plants'), 'bands: combination note');
  // Combinations.
  await page.selectOption(R + '.bc-preset', 'true'); await wait();
  check((await big()) === 'R 3, G 2, B 1: Red / Green / Blue', 'bands: true colour');
  await page.selectOption(R + '.bc-preset', 'swir'); await wait();
  check((await big()) === 'R 6, G 4, B 3: SWIR2 / NIR / Red', 'bands: shortwave infrared');
  await page.selectOption(R + '.bc-preset', 'agri'); await wait();
  check((await big()) === 'R 5, G 4, B 1: SWIR1 / NIR / Blue', 'bands: agriculture');
  await page.selectOption(R + '.bc-g', '0'); await wait();
  check((await big()) === 'R 5, G 1, B 1: SWIR1 / Blue / Blue' && (await page.inputValue(R + '.bc-preset')) === '', 'bands: choosing a band by hand leaves the combination');
  await page.selectOption(R + '.bc-preset', 'cir'); await wait();
  // Stretches: min-max = min and max; mean ± k sd; equalisation; typed limits.
  await page.selectOption(R + '.bc-method', 'minmax'); await wait();
  { const t = await tab(); check(t[1][2] === t[1][4] && t[1][3] === t[1][5] && t[2][2] === t[2][4], 'bands: min-max limits = band minimum and maximum'); }
  await page.selectOption(R + '.bc-method', 'sd'); await page.fill(R + '.bc-k', '1.5'); await wait();
  { const t = await tab(), [m, s, lo, hi] = [6, 7, 2, 3].map((k) => +t[1][k]); check(Math.abs(lo - (m - 1.5 * s)) < 2e-4 && Math.abs(hi - (m + 1.5 * s)) < 2e-4, `bands: mean ± 1.5 sd limits (${lo}, ${hi})`); }
  await page.fill(R + '.bc-k', '0'); await wait();
  check((await err()).includes('standard deviations above 0') && await page.isHidden(R + '.bc-out'), 'bands: k = 0 message');
  await page.fill(R + '.bc-k', '2');
  await page.selectOption(R + '.bc-method', 'eq'); await wait();
  check((await tab())[1][2] === 'equalised' && !(await page.isHidden(R + '.bc-o-eq')), 'bands: equalisation');
  await page.fill(R + '.bc-nb', '1'); await wait();
  check((await err()).includes('Histogram bins'), 'bands: bad bins message');
  await page.fill(R + '.bc-nb', '256');
  await page.selectOption(R + '.bc-method', 'pct'); await page.fill(R + '.bc-lp', '50'); await page.fill(R + '.bc-hp', '50'); await wait();
  check((await err()).includes('low one below the high one'), 'bands: bad percentiles message');
  await page.fill(R + '.bc-lp', '0'); await page.fill(R + '.bc-hp', '100'); await wait();
  { const t = await tab(); check(t[1][2] === t[1][4] && t[1][3] === t[1][5], 'bands: 0–100 % clip = min-max'); }
  await page.fill(R + '.bc-lp', '2'); await page.fill(R + '.bc-hp', '98'); await wait();
  await page.selectOption(R + '.bc-method', 'manual'); await wait();
  check((await page.inputValue(R + '.bc-lo0')) === '0.016851' && (await page.inputValue(R + '.bc-hi0')) === '0.54049', 'bands: typed limits start from the last stretch');
  await page.fill(R + '.bc-lo0', '0'); await page.fill(R + '.bc-hi0', '0.5'); await page.fill(R + '.bc-row', '0'); await page.fill(R + '.bc-col', '0'); await wait();
  { const t = await tab(), p = await px(); check(t[1][2] === '0' && t[1][3] === '0.5', 'bands: typed limits used');
    const nir = +p.match(/4: ([\d.]+)/)[1], r = +p.match(/R (\d+), G/)[1]; check(Math.abs(r - Math.round((nir / 0.5) * 255)) <= 1 && p.includes('row 0, column 0'), `bands: pixel (0, 0) shown red = NIR / 0.5 × 255 (${r})`); }
  await page.fill(R + '.bc-hi0', '-1'); await wait();
  check((await err()).includes('Red: give a low and a high limit'), 'bands: high below low message');
  await page.fill(R + '.bc-hi0', '0.5'); await page.fill(R + '.bc-gamma', '2'); await wait();
  { const p = await px(), nir = +p.match(/4: ([\d.]+)/)[1], r = +p.match(/R (\d+), G/)[1]; check(Math.abs(r - Math.round(Math.sqrt(nir / 0.5) * 255)) <= 1, `bands: gamma 2 = square root of the stretch (${r})`); }
  await page.fill(R + '.bc-gamma', '20'); await wait();
  check((await err()).includes('Gamma is between 0.1 and 10'), 'bands: bad gamma message');
  await page.fill(R + '.bc-gamma', '1'); await page.selectOption(R + '.bc-method', 'pct'); await wait();
  // Tap the picture: the lower-left forest.
  { const c = await page.$(R + '.bc-fig'); await c.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(200); const b = await c.boundingBox(); await page.waitForFunction(() => document.querySelector('.bc-fig').width > 0);
    await page.mouse.click(b.x + b.width * 0.2, b.y + b.height * 0.8); await wait();
    const row = +(await page.inputValue(R + '.bc-row')), col = +(await page.inputValue(R + '.bc-col'));
    check(row > 140 && row < 170 && col > 30 && col < 60 && (await px()).includes(`row ${row}, column ${col}`), `bands: tap reads that pixel (row ${row}, column ${col})`); }
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bc-png')]); const f = OUT + 'bc.png'; await d.saveAs(f); const b = readFileSync(f);
    check(b.subarray(1, 4).toString() === 'PNG' && b.readUInt32BE(16) === 240 && b.readUInt32BE(20) === 180 && d.suggestedFilename() === 'example-432.png', `bands: full-size PNG 240 × 180 (${d.suggestedFilename()})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bc-csv')]); const f = OUT + 'bc.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t.length === 7 && t[0] === 'band,label,valid_pixels,min,max,mean,sd,p2,p98' && t[4].startsWith('4,"NIR",43200,0.014135848,0.57567877') , 'bands: statistics CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); const f = OUT + 'bc.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'bands: PDF report'); }
  // Own files: four Sentinel-2-like band files, 12 × 8, values 1000·k + 10·y + x.
  const files = ['B02', 'B03', 'B04', 'B08'].map((nm, k) => ({ name: `T33_${nm}.tif`, mimeType: 'image/tiff', buffer: tiff16(12, 8, (x, y) => 1000 * (k + 1) + 10 * y + x) }));
  await page.setInputFiles(R + '.bc-in', files); await wait(800);
  check((await page.textContent(R + '.bc-note')).includes('12 × 8 pixels, 4 bands') && (await big()).startsWith('R 1, G 2, B 3') && (await page.textContent(R + '.bc-pnote')).startsWith('Bands 1, 2 and 3'), 'bands: four TIFFs open; names not guessed without a sensor');
  await page.selectOption(R + '.bc-sensor', 's2'); await page.selectOption(R + '.bc-preset', 'cir'); await wait();
  check((await big()) === 'R 4, G 3, B 2: T33_B08 / T33_B04 / T33_B03', `bands: Sentinel-2 numbers give colour infrared (${await big()})`);
  await page.selectOption(R + '.bc-preset', 'swir'); await wait();
  check((await page.textContent(R + '.bc-pnote')).includes('Could not find the swir2 band') || (await page.textContent(R + '.bc-pnote')).includes('SWIR2'), 'bands: missing SWIR2 band message');
  await page.selectOption(R + '.bc-preset', 'cir');
  await page.fill(R + '.bc-row', '2'); await page.fill(R + '.bc-col', '3'); await wait();
  { const p = await px(); check(p.includes('row 2, column 3') && p.includes('no map coordinates') && p.includes('1: 1023, 2: 2023, 3: 3023, 4: 4023'), 'bands: pixel values from the files'); }
  await page.selectOption(R + '.bc-method', 'minmax'); await wait();
  { const t = await tab(); check(t[1].slice(2, 4).join() === '4000,4081' && t[2].slice(2, 4).join() === '3000,3081', `bands: min-max of the TIFF bands (${t[1]} ${t[2]})`); }
  // A grey PNG: one band.
  await page.setInputFiles(R + '.bc-in', { name: 'pan.png', mimeType: 'image/png', buffer: pngGrey(20, 10, (x, y) => 10 * x + y) }); await wait(800);
  check((await page.textContent(R + '.bc-note')).includes('1 band. With fewer than three bands') && (await big()) === 'R 1, G 1, B 1: pan / pan / pan', 'bands: grey PNG as one band');
  { const t = await tab(); check(t[1].slice(4, 6).join() === '0,199', 'bands: PNG values 0 to 199'); }
  // Bad files.
  await page.setInputFiles(R + '.bc-in', [files[0], { name: 'small.tif', mimeType: 'image/tiff', buffer: tiff16(5, 5, () => 1) }]); await wait(600);
  check((await page.textContent(R + '.bc-note')).includes('must be the same size'), 'bands: size mismatch message');
  await page.setInputFiles(R + '.bc-in', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }); await wait(600);
  check((await page.textContent(R + '.bc-note')).includes('not a TIFF, PNG or JPEG'), 'bands: wrong file type message');
  await page.click(R + '.bc-demo'); await wait(600);
  check((await big()) === 'R 4, G 3, B 2: NIR / Red / Green', 'bands: example again');
};
