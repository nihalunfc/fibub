// #890 stream long profile and chi analysis
import { writeTiff } from '../../src/lib/sci/tiff.ts';
export const path = '/science/stream-profile/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/stream-profile/`); await page.waitForTimeout(900);
  const t = (c) => page.textContent('.spf ' + c);
  check((await t('.sp-big')) === 'ksn 11.5 at θref 0.45; best θ 0.33', 'stream profile: example ksn and best θ');
  { const f = await t('.sp-facts'); check(f.includes('Channel length30 km151 points') && f.includes('Relief290.1 m') && f.includes('R² 0.9870') && f.includes('θ 0.389') && f.includes('70.78 km²'), 'stream profile: facts (length, relief, fits)'); }
  check((await t('.sp-ktab')).includes('115 km211.020.93 km²5.6851610'), 'stream profile: knickpoint at 15 km with ksn 16 below and 10 above');
  check(await page.isVisible('.spf .sp-f1') && await page.isVisible('.spf .sp-f4'), 'stream profile: plots');
  await page.selectOption('.spf .sp-kmax', '0'); await page.waitForTimeout(300);
  check((await t('.sp-ktab')) === '', 'stream profile: knickpoint hints off');
  await page.selectOption('.spf .sp-kmax', '2');
  await page.fill('.spf .sp-acrit', '1e8'); await page.waitForTimeout(500);
  check((await t('.sp-err')).includes('Fewer than 5 points'), 'stream profile: channel start too big');
  await page.fill('.spf .sp-acrit', '5e6'); await page.waitForTimeout(500);
  check((await t('.sp-facts')).includes('upstream points left out'), 'stream profile: channel start trims the head');
  await page.fill('.spf .sp-acrit', '0'); await page.fill('.spf .sp-tref', '0.5'); await page.waitForTimeout(500);
  check((await t('.sp-big')).includes('θref 0.5') && (await t('.sp-facts')).includes('m^1'), 'stream profile: reference concavity');
  await page.fill('.spf .sp-tref', '0.45'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spf .sp-csv')]); const f = OUT + 'sp.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r.length === 152 && r[0] === 'distance_upstream_m,elevation_m,drainage_area_m2,slope,chi_theta_0.45,chi_theta_0.33' && r[1].startsWith('0,120,70776806,0.004,0,0') && r[151].startsWith('30000,'), 'stream profile: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spf .sp-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'sp.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'stream profile: Word report'); }
  // Pasted from the source downward in km and km².
  await page.selectOption('.spf .sp-du', '1000'); await page.selectOption('.spf .sp-au', '1e6');
  await page.fill('.spf .sp-in', '0 500 0.05\n1 450 0.4\n2 420 1.2\n3 400 2.5\n4 385 4\n5 375 6\n6 368 8.5'); await page.waitForTimeout(600);
  check((await t('.sp-facts')).includes('Channel length6 km') && (await t('.sp-facts')).includes('from 368.0 to 500.0 m'), 'stream profile: profile measured from the source, km and km²');
  await page.fill('.spf .sp-in', '0 500 0.05\n1 450 -0.4\n2 420 1.2\n3 400 2.5\n4 385 4'); await page.waitForTimeout(600);
  check((await t('.sp-err')).includes('above zero'), 'stream profile: bad area message');
  await page.selectOption('.spf .sp-du', '1'); await page.selectOption('.spf .sp-au', '1');
  // Made-up DEM: tap near the east end.
  await page.click('.spf .sp-src button[data-v=dem]'); await page.click('.spf .sp-demdemo');
  await page.waitForFunction(() => document.querySelector('.spf .sp-map')?.dataset.drawn === '0', null, { timeout: 15000 });
  check((await t('.sp-deminfo')).startsWith('Made-up DEM: 160 × 120 cells') && await page.isHidden('.spf .sp-out'), 'stream profile: made-up DEM loaded');
  const tap = async (fx, fy) => { const b = await page.$eval('.spf .sp-map', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }); await page.mouse.click(b.x + b.w * fx, b.y + b.h * fy); await page.waitForTimeout(400); };
  await tap(0.97, 0.5);
  { const f = await t('.sp-facts'); check((await t('.sp-big')).startsWith('ksn 22') && f.includes('Channel length5.613 km162 points') && Number(await page.$eval('.spf .sp-map', (c) => c.dataset.drawn)) === 162, 'stream profile: D8 trace on the DEM to the west edge'); }
  await page.fill('.spf .sp-snap', '0'); await tap(0.97, 0.2);
  check((await t('.sp-facts')).includes('points') && !(await t('.sp-facts')).includes('5.613 km'), 'stream profile: a start on the hillslope traces a different path');
  await page.fill('.spf .sp-snap', '2');
  // A GeoTIFF made here: a tilted plane with a V-shaped valley, 40 × 30 cells of 20 m.
  { const w = 40, h = 30, z = new Float32Array(w * h); for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) z[r * w + c] = 50 + 2 * c + 3 * Math.abs(r - 15);
    const tags = new Map([[33550, { type: 12, count: 3, values: [20, 20, 0] }], [33922, { type: 12, count: 6, values: [0, 0, 0, 500000, 4000000, 0] }]]);
    await page.setInputFiles('.spf .sp-file', { name: 'valley.tif', mimeType: 'image/tiff', buffer: Buffer.from(writeTiff(w, h, [z], tags)) }); await page.waitForTimeout(800);
    check((await t('.sp-deminfo')).startsWith('valley.tif: 40 × 30 cells. 20 × 20 cells (taken as metres).') && (await page.inputValue('.spf .sp-dx')) === '20', 'stream profile: GeoTIFF read with its cell size');
    await tap(0.95, 0.5);
    check((await t('.sp-facts')).includes('Channel length700 m36 points') && (await t('.sp-facts')).includes('from 50.0 to 120.0 m'), 'stream profile: GeoTIFF trace down the valley floor (start snapped 2 cells down)'); }
  await page.setInputFiles('.spf .sp-file', { name: 'g.asc', mimeType: 'text/plain', buffer: Buffer.from('ncols 3\nnrows 2\ncellsize 10\n1 2 3') }); await page.waitForTimeout(400);
  check((await t('.sp-err')).includes('g.asc: The grid should have 6 values but has 3'), 'stream profile: bad ASCII grid message');
  { const rows = Array.from({ length: 20 }, (_, r) => Array.from({ length: 30 }, (_, c) => (10 + c + 2 * Math.abs(r - 10)).toFixed(1)).join(' ')).join('\n');
    await page.setInputFiles('.spf .sp-file', { name: 'v.asc', mimeType: 'text/plain', buffer: Buffer.from(`ncols 30\nnrows 20\nxllcorner 0\nyllcorner 0\ncellsize 5\nNODATA_value -9999\n${rows}\n`) }); await page.waitForTimeout(500);
    await tap(0.95, 0.52);
    check((await t('.sp-deminfo')).startsWith('v.asc: 30 × 20 cells. 5 m cells.') && (await t('.sp-facts')).includes('Channel length130 m27 points'), 'stream profile: ASCII grid read and traced'); }
  await page.click('.spf .sp-src button[data-v=paste]'); await page.waitForTimeout(300);
};
