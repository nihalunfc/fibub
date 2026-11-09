// #654 road gradient and curve helper (maths checked against Python in tests/sci-tools/road-curve-design.mjs)
export const path = '/science/road-curve-design/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.rdc ';
  await page.goto(`${BASE}/science/road-curve-design/`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.rd-hbig')) === 'Minimum radius 251.7 m: R = 300 m is enough', `road: minimum radius (${await page.textContent(R + '.rd-hbig')})`);
  { const f = await page.textContent(R + '.rd-hfacts'); check(f.includes('0.108') && f.includes('109.19 m') && f.includes('209.44 m') && f.includes('19.25 m') && f.includes('18.09 m') && f.includes('PC 1+140.809, PT 1+350.248'), `road: curve elements (${f})`); }
  { const t = await page.textContent(R + '.rd-stab'); check((await page.$$(R + '.rd-stab tbody tr')).length === 12 && t.includes('1°49′57″') && t.includes('20°00′00″') && t.includes('205.212'), `road: setting-out table`); }
  check((await page.textContent(R + '.rd-sbig')) === 'Stopping sight distance 134.2 m' && (await page.textContent(R + '.rd-sfacts')).includes('7.474 m'), `road: stopping sight distance (${await page.textContent(R + '.rd-sfacts')})`);
  check((await page.textContent(R + '.rd-vbig')) === 'Crest curve 135.4 m long, K = 27.1', `road: crest curve (${await page.textContent(R + '.rd-vbig')})`);
  { const f = await page.textContent(R + '.rd-vfacts'); check(f.includes('1+432.280 at 97.968 m') && f.includes('1+567.720 at 98.646 m') && f.includes('High point1+513.544 at 99.187 m'), `road: BVC, EVC, high point (${f})`); }
  check(await page.isVisible(R + '.rd-plan') && await page.isVisible(R + '.rd-prof') && await page.isVisible(R + '.rd-h1') && await page.isHidden(R + '.rd-hl'), 'road: plan, profile and crest inputs');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rd-scsv')]); const f = OUT + 'so.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 13 && rows[2].startsWith('1160,19.191,1.832612'), `road: setting-out CSV (${rows[2]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rd-vcsv')]); const f = OUT + 'lv.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'chainage_m,tangent_level_m,offset_m,curve_level_m' && rows.some((r) => r.startsWith('1513.544,')), 'road: levels CSV with the high point'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'road-curves.pdf', 'road: PDF report'); }
  check((await page.textContent(R + '.rd-gbig')) === 'Gradient +2 %, 1 in 50', `road: gradient (${await page.textContent(R + '.rd-gbig')})`);
  // Too tight a radius.
  await page.fill(R + '.rd-R', '200'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-hbig')).endsWith('too tight') && (await page.textContent(R + '.rd-hfacts')).includes('MORE than'), 'road: radius too tight');
  await page.fill(R + '.rd-R', '300');
  // Sag curve.
  await page.fill(R + '.rd-g1', '-4'); await page.fill(R + '.rd-g2', '2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-vbig')).startsWith('Sag curve') && await page.isVisible(R + '.rd-hl') && (await page.textContent(R + '.rd-vfacts')).includes('Low point'), 'road: sag curve with low point');
  await page.selectOption(R + '.rd-mode', 'own'); await page.fill(R + '.rd-S', '100'); await page.fill(R + '.rd-g1', '-4'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-vbig')).startsWith('Sag curve 127.9 m'), `road: sag from own sight distance (${await page.textContent(R + '.rd-vbig')})`);
  await page.selectOption(R + '.rd-mode', 'k'); await page.fill(R + '.rd-K', '30'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-vbig')) === 'Sag curve 180 m long, K = 30', 'road: length from K');
  await page.selectOption(R + '.rd-mode', 'len'); await page.fill(R + '.rd-L', '200'); await page.fill(R + '.rd-g1', '2'); await page.fill(R + '.rd-g2', '5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-vfacts')).includes('at the BVC or EVC'), 'road: same-sign grades');
  await page.fill(R + '.rd-g2', '2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-verr')).includes('same'), 'road: equal grades message');
  await page.fill(R + '.rd-D', '200'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-herr')).includes('deflection angle') && await page.isHidden(R + '.rd-hout'), 'road: bad deflection message');
  await page.fill(R + '.rd-D', '40'); await page.fill(R + '.rd-c2', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rd-gbig')).includes('two different chainages'), 'road: gradient needs two chainages');
};
