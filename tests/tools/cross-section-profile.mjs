// #509 cross-section and topographic profile
import { writeTiff } from '../../src/lib/sci/tiff.ts';
export const path = '/science/cross-section-profile/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.xsp ';
  const t = (s) => page.textContent(R + s);
  const wait = () => page.waitForTimeout(450);
  await page.goto(`${BASE}/science/cross-section-profile/`); await page.waitForTimeout(700);
  check((await t('.xs-big')) === '3529 m long, towards 080°, then 109°', 'xsection: example section line');
  { const f = await t('.xs-facts'); check(f.includes('285 samples') && f.includes('337.65 to 633.83 m') && f.includes('2×'), 'xsection: example facts'); }
  { const tb = await t('.xs-tab'); check(tb.includes('Sandstone2600 m401.28 m010° / 20°109°19.8° (down along the section)35.7°') && tb.includes('Shale1500 m623.68 m015° / 25°080°22.9°') && tb.includes('26.6°') && tb.includes('45.0°'), 'xsection: apparent dips in the table'); }
  check(await page.isVisible(R + '.xs-fig') && await page.isVisible(R + '.xs-map'), 'xsection: section and map drawn');
  // VE: the figure height follows it.
  const h2 = await page.$eval(R + '.xs-fig', (c) => c.height);
  await page.fill(R + '.xs-ve', '1'); await wait();
  { const h1 = await page.$eval(R + '.xs-fig', (c) => c.height); check(h1 < h2 && (await t('.xs-tab')).includes('19.8° (down along the section)19.8°'), 'xsection: VE 1 is true scale'); }
  await page.fill(R + '.xs-ve', '200'); await wait();
  check((await t('.xs-err')).includes('from 0.1 to 100'), 'xsection: bad VE message');
  await page.fill(R + '.xs-ve', '2'); await page.fill(R + '.xs-base', '0'); await wait();
  check((await t('.xs-facts')).includes('Drawn down to0 m'), 'xsection: draw down to a chosen elevation');
  await page.fill(R + '.xs-base', '');
  // Contacts: bad rows.
  await page.fill(R + '.xs-con', 'Sandstone, 9000, 10, 20'); await wait();
  check((await t('.xs-err')).includes('off the section'), 'xsection: contact off the section');
  await page.fill(R + '.xs-con', 'Sandstone, 900, 10, 120'); await wait();
  check((await t('.xs-err')).includes('dip is between 0 and 90'), 'xsection: bad dip');
  await page.fill(R + '.xs-con', ''); await wait();
  check((await t('.xs-tab')) === '' && (await page.evaluate(() => document.querySelector('.xsp .xs-fig').getAttribute('aria-label'))).includes('3529'), 'xsection: plain profile without contacts');
  // Tapping the map: clear, two taps, undo.
  await page.click(R + '.xs-clear'); await wait();
  check((await t('.xs-err')).includes('at least two points'), 'xsection: cleared line message');
  await page.locator(R + '.xs-map').scrollIntoViewIfNeeded();
  { const bb = await page.locator(R + '.xs-map').boundingBox(); await page.mouse.click(bb.x + bb.width * 0.1, bb.y + bb.height * 0.5); await page.mouse.click(bb.x + bb.width * 0.9, bb.y + bb.height * 0.5); await page.mouse.click(bb.x + bb.width * 0.9, bb.y + bb.height * 0.2); }
  await wait();
  { const lines = (await page.inputValue(R + '.xs-line')).split('\n'); const big = await t('.xs-big'); check(lines.length === 3 && /^50\d{4}\.\d, 42\d{5}\.\d$/.test(lines[0]) && big.includes('towards 090°, then 000°'), `xsection: taps add points (${big})`); }
  await page.click(R + '.xs-undo'); await wait();
  { const big = await t('.xs-big'); const L = Number(big.split(' ')[0]); check(big.endsWith('towards 090°') && Math.abs(L - 0.8 * 4000) < 30, `xsection: undo last point (${big})`); }
  // SVG and CSV.
  await page.fill(R + '.xs-con', 'Upper, 1600, 0, 30'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.xs-svg')]); const f = OUT + 'xs.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('<?xml') && s.includes('<polygon') && s.includes('Upper') && s.includes('VE 2×'), 'xsection: SVG download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.xs-csv')]); const f = OUT + 'xs.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'distance_m,x,y,elevation,Upper_base' && rows.length > 200 && rows[1].startsWith('0,'), 'xsection: profile CSV'); }
  // An ASCII grid: a plane rising 1 m per metre to the east (z = x), 10 m cells.
  { const f = OUT + 'plane.asc'; const rows = []; for (let r = 0; r < 20; r++) rows.push(Array.from({ length: 30 }, (_, c) => 5 + 10 * c).join(' '));
    writeFileSync(f, `ncols 30\nnrows 20\nxllcorner 0\nyllcorner 0\ncellsize 10\nNODATA_value -9999\n${rows.join('\n')}\n`);
    await page.setInputFiles(R + '.xs-file', f); await wait();
    check((await t('.xs-err')).includes('at least two points') && (await t('.xs-dinfo')).includes('ASCII grid, 30 × 20 cells of 10'), 'xsection: ASCII grid opened, line cleared');
    await page.fill(R + '.xs-line', '50, 100\n250, 100'); await page.fill(R + '.xs-ve', '1'); await wait();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.xs-csv')]); const g = OUT + 'plane.csv'; await d.saveAs(g);
    const rr = readFileSync(g, 'utf8').trim().split('\n').slice(1).map((l) => l.split(',').map(Number));
    check((await t('.xs-big')) === '200 m long, towards 090°' && rr.length === 41 && rr.every((x) => Math.abs(x[3] - x[1]) < 1e-6), `xsection: bilinear on a plane is exact (${await t('.xs-big')})`); }
  // A GeoTIFF in latitude and longitude.
  { const tags = new Map([[33550, { type: 12, count: 3, values: [0.001, 0.001, 0] }], [33922, { type: 12, count: 6, values: [0, 0, 0, 10, 1, 0] }], [34735, { type: 3, count: 8, values: [1, 1, 0, 1, 1024, 0, 1, 2] }]]);
    const f = OUT + 'geo.tif'; writeFileSync(f, writeTiff(50, 50, [new Float32Array(2500).fill(100)], tags));
    await page.setInputFiles(R + '.xs-file', f); await wait();
    await page.fill(R + '.xs-line', '10.005, 0.99\n10.045, 0.99'); await wait();
    check((await t('.xs-dinfo')).includes('degrees of longitude and latitude') && /^44\d\d m long, towards 090°$/.test(await t('.xs-big')), `xsection: latitude-longitude GeoTIFF (${await t('.xs-big')})`); }
  { const f = OUT + 'junk.asc'; writeFileSync(f, 'hello world'); await page.setInputFiles(R + '.xs-file', f); await wait(); check((await t('.xs-derr')).includes('ncols and nrows'), 'xsection: bad DEM message'); }
  // Typed profile.
  await page.click(R + '.xs-m[data-m="typed"]'); await page.fill(R + '.xs-con', 'Top, 1000, 0, 45'); await page.fill(R + '.xs-az', '90'); await wait();
  check((await t('.xs-big')) === '2000 m long, towards 090°' && (await t('.xs-tab')).includes('45.0° (down along the section)'), 'xsection: typed profile, dip direction along the section');
  await page.fill(R + '.xs-az', '270'); await wait();
  check((await t('.xs-tab')).includes('45.0° (up along the section)'), 'xsection: reversed azimuth reverses the apparent dip');
  await page.fill(R + '.xs-pairs', '0\t10'); await wait();
  check((await t('.xs-err')).includes('at least two rows'), 'xsection: too few typed points');
  await page.click(R + '.xs-m[data-m="dem"]'); await page.click(R + '.xs-ex'); await wait();
  check((await t('.xs-big')) === '3529 m long, towards 080°, then 109°', 'xsection: example restored');
};
