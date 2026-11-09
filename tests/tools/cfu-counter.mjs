// #195 CFU counter
import { examplePlate } from '../../src/lib/sci/cfu.ts';
export const path = '/science/cfu-counter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/cfu-counter/`); await page.waitForTimeout(1200);
  const txt = (s) => page.textContent('.cfu ' + s);
  check((await txt('.cf-count')) === '142 colonies on this plate (142 found)', 'cfu: example plate counted (142)');
  check((await txt('.cf-big')) === '1.5 × 10⁸ CFU/mL', 'cfu: example result 1.5 × 10⁸ CFU/mL');
  { const f = await txt('.cf-facts'); check(f.includes('1.485 × 10⁸ CFU/mL') && f.includes('297 colonies') && f.includes('1.32 × 10⁸ to 1.66 × 10⁸') && f.includes('χ² = 0.569, 1 df, p = 0.45') && f.includes('5 × 10⁵ CFU/mL'), 'cfu: example facts (estimate, interval, agreement, one colony)'); }
  { const t = await txt('.cf-tab'); check(t.includes('TNTC') && t.includes('below 30') && t.includes('countable, used') && t.includes('Photo (example plate)') && t.includes('1.55 × 10⁸'), 'cfu: plate table'); }
  check(await page.isVisible('.cfu .cf-chart') && await page.isVisible('.cfu .cf-photo'), 'cfu: photo and chart shown');

  // Taps on the photo: add on bare agar, remove it again, remove a found colony, then undo.
  const E = examplePlate();
  let spot = null;
  for (let a = 0; a < 6.3 && !spot; a += 0.1) { const x = E.circle.cx + 150 * Math.cos(a), y = E.circle.cy + 150 * Math.sin(a); if (E.discs.every((d) => Math.hypot(d.x - x, d.y - y) > d.r + 25)) spot = { x, y }; }
  const tap = async (x, y) => { await page.locator('.cfu .cf-photo').scrollIntoViewIfNeeded(); const bb = await page.locator('.cfu .cf-photo').boundingBox(); await page.mouse.click(bb.x + (x / E.w) * bb.width, bb.y + (y / E.h) * bb.height); await page.waitForTimeout(150); };
  await tap(spot.x, spot.y);
  check((await txt('.cf-count')) === '143 colonies on this plate (142 found, 1 added)', 'cfu: tap on bare agar adds a colony');
  await tap(spot.x, spot.y);
  check((await txt('.cf-count')) === '142 colonies on this plate (142 found)', 'cfu: tap on an added colony removes it');
  const d0 = E.discs.find((d) => d.r < 6 && E.discs.every((o) => o === d || Math.hypot(o.x - d.x, o.y - d.y) > 30));
  await tap(d0.x, d0.y);
  check((await txt('.cf-count')) === '141 colonies on this plate (141 found, 1 removed)' && (await txt('.cf-facts')).includes('296 colonies'), 'cfu: tap on a found colony removes it, and the result follows');
  await page.click('.cfu .cf-clear');
  check((await txt('.cf-count')) === '142 colonies on this plate (142 found)', 'cfu: undo my taps');

  // Colony settings.
  await page.click('.cfu .cf-set summary');
  await page.uncheck('.cfu .cf-split'); await page.waitForTimeout(400);
  check((await txt('.cf-count')).startsWith('131 colonies'), 'cfu: without splitting, touching pairs count once (131)');
  await page.check('.cfu .cf-split'); await page.waitForTimeout(400);
  await page.fill('.cfu .cf-min', '1.5'); await page.waitForTimeout(700);
  { const n = parseInt(await txt('.cf-count')); check(n < 142 && n > 60, `cfu: a larger smallest colony leaves small ones out (${n})`); }
  await page.fill('.cfu .cf-min', '0.4'); await page.fill('.cfu .cf-thr', '30'); await page.waitForTimeout(700);
  check((await txt('.cf-count')).startsWith('142 colonies'), 'cfu: a typed threshold of 30 still finds 142');
  await page.fill('.cfu .cf-thr', ''); await page.selectOption('.cfu .cf-pol', 'darker'); await page.waitForTimeout(500);
  check((await txt('.cf-count')).startsWith('0 colonies'), 'cfu: looking for darker colonies on this plate finds none');
  await page.selectOption('.cfu .cf-pol', 'auto'); await page.fill('.cfu .cf-dish', '5'); await page.waitForTimeout(700);
  check((await txt('.cf-perr')).includes('plate diameter') && await page.isVisible('.cfu .cf-perr'), 'cfu: bad plate diameter message');
  await page.fill('.cfu .cf-dish', '90'); await page.fill('.cfu .cf-margin', '60'); await page.waitForTimeout(700);
  check((await txt('.cf-perr')).includes('between 0 and 40'), 'cfu: bad rim margin message');
  await page.fill('.cfu .cf-margin', '5'); await page.waitForTimeout(700);
  check((await txt('.cf-count')).startsWith('142 colonies') && await page.isHidden('.cfu .cf-perr'), 'cfu: settings back to normal');

  // Dilution maths options.
  await page.fill('.cfu .cf-lo', '10'); await page.waitForTimeout(500);
  check((await txt('.cf-facts')).includes('1.495 × 10⁸') && (await txt('.cf-facts')).includes('3 plates with 10 to 300'), 'cfu: range from 10 also uses the 10⁻⁶ plate');
  await page.fill('.cfu .cf-lo', '30'); await page.selectOption('.cfu .cf-conf', '0.99'); await page.selectOption('.cfu .cf-per', 'g'); await page.waitForTimeout(300);
  check((await txt('.cf-facts')).includes('99 % interval') && (await txt('.cf-big')) === '1.5 × 10⁸ CFU/g', 'cfu: 99 % interval and CFU per g');
  await page.selectOption('.cfu .cf-conf', '0.95'); await page.selectOption('.cfu .cf-per', 'mL');
  await page.uncheck('.cfu .cf-use'); await page.waitForTimeout(300);
  check((await txt('.cf-big')) === '1.6 × 10⁸ CFU/mL' && (await txt('.cf-facts')).includes('one plate only'), 'cfu: without the photo plate (155 alone)');
  await page.check('.cfu .cf-use'); await page.fill('.cfu .cf-pdil', '1:1000000'); await page.waitForTimeout(500);
  check((await txt('.cf-facts')).includes('Poor') && (await txt('.cf-tab')).includes('1.42 × 10⁹'), 'cfu: photo plate at another dilution, and the plates then disagree');
  await page.fill('.cfu .cf-pdil', 'ten'); await page.waitForTimeout(500);
  check((await txt('.cf-err')).includes('dilution is not readable') && await page.isHidden('.cfu .cf-out'), 'cfu: bad photo-plate dilution message');
  await page.fill('.cfu .cf-pdil', '10^-5'); await page.fill('.cfu .cf-pvol', '100 µL'); await page.waitForTimeout(500);
  check((await txt('.cf-big')) === '1.5 × 10⁸ CFU/mL', 'cfu: 10^-5 and 100 µL read like 1e-5 and 0.1 mL');
  await page.fill('.cfu .cf-hi', '20'); await page.waitForTimeout(500);
  check((await txt('.cf-err')).includes('countable range'), 'cfu: bad countable range message');
  await page.fill('.cfu .cf-hi', '300'); await page.fill('.cfu .cf-plates', '1e-5, 0.1, 155\nfoo, 0.1, 3'); await page.waitForTimeout(500);
  check((await txt('.cf-err')).includes('Line 2: "foo" is not a dilution'), 'cfu: bad table line message');
  await page.uncheck('.cfu .cf-use'); await page.fill('.cfu .cf-plates', '1e-2, 0.1, TNTC'); await page.waitForTimeout(500);
  check((await txt('.cf-err')).includes('too many to count'), 'cfu: only TNTC plates message');
  await page.fill('.cfu .cf-plates', '1e-1, 0.1, 12\n1e-2, 0.1, 1'); await page.waitForTimeout(500);
  check((await txt('.cf-big')) === 'Estimated 1200 CFU/mL' && (await txt('.cf-facts')).includes('no plate reached 30'), 'cfu: below the range gives an estimate');
  await page.fill('.cfu .cf-plates', '1, 1, 0'); await page.waitForTimeout(500);
  check((await txt('.cf-big')) === 'Below detection: fewer than 3.69 CFU/mL (upper 95 % limit)', 'cfu: no colonies gives an upper limit');

  // Back to the example; downloads.
  await page.click('.cfu .cf-ex'); await page.waitForTimeout(800);
  check((await txt('.cf-big')) === '1.5 × 10⁸ CFU/mL', 'cfu: example reloads');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cfu .cf-csv')]); const f = OUT + 'cfu.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[0].startsWith('plate,dilution') && rows[2].includes(',155,countable,yes,155000000,') && rows[5] === '' && rows[6].startsWith('result,CFU/mL,148500000,') && rows[7].startsWith('colonies used,297,mL plated,0.000002,'), 'cfu: plates and result CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cfu .cf-pcsv')]); const f = OUT + 'cfu-col.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 143 && rows[0] === 'colony,x_px,y_px,how', 'cfu: colony positions CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cfu .dl [data-f="png"]')]); const f = OUT + 'cfu.png'; await d.saveAs(f); check(readFileSync(f).length > 20000, 'cfu: report image download'); }

  // A photo of dark colonies on pale agar, 1400 px (scaled to 1000), with the plate edge set by three taps.
  { const b64 = await page.evaluate(() => {
      const c = document.createElement('canvas'); c.width = 1400; c.height = 1200; const x = c.getContext('2d');
      x.fillStyle = '#303030'; x.fillRect(0, 0, 1400, 1200); x.fillStyle = '#e8e2d0'; x.beginPath(); x.arc(700, 600, 520, 0, 7); x.fill();
      x.fillStyle = '#6a4a2a'; let n = 0;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { x.beginPath(); x.arc(460 + 120 * i, 360 + 120 * j, 14, 0, 7); x.fill(); n++; }
      return c.toDataURL('image/png').split(',')[1]; });
    writeFileSync(OUT + 'dark-plate.png', Buffer.from(b64, 'base64')); }
  await page.setInputFiles('.cfu .cf-file', OUT + 'dark-plate.png'); await page.waitForTimeout(1500);
  check((await txt('.cf-ph')).includes('Scaled to 1000 × 857'), 'cfu: big photo scaled down');
  await page.locator('.cfu .cf-photo').scrollIntoViewIfNeeded(); await page.click('.cfu .cf-rim');
  { await page.locator('.cfu .cf-photo').scrollIntoViewIfNeeded(); const bb = await page.locator('.cfu .cf-photo').boundingBox(); const s = bb.width / 1400;
    for (const a of [0.3, 2.2, 4.4]) await page.mouse.click(bb.x + (700 + 518 * Math.cos(a)) * s, bb.y + (600 + 518 * Math.sin(a)) * s); }
  await page.waitForTimeout(800);
  check((await txt('.cf-count')).startsWith('25 colonies') && await page.isHidden('.cfu .cf-perr'), `cfu: dark colonies on an opened photo, rim set by three taps (${await txt('.cf-count')})`);
};
