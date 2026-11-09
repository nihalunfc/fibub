// #209 Permafrost active layer (Stefan) estimator
export const path = '/science/permafrost-active-layer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.pfa ';
  const txt = (c) => page.textContent(R + c);
  const wait = () => page.waitForTimeout(450);
  await page.goto(`${BASE}/science/permafrost-active-layer/`); await page.waitForTimeout(600);
  check((await txt('.pf-big')) === '1.02 m thaw depth', 'permafrost: example year, one silty soil, 1.02 m');
  { const f = await txt('.pf-facts'); check(f.includes('888 °C·days') && f.includes('136 days above 0 °C') && f.includes('710 °C·days') && f.includes('140 MJ/m³') && f.includes('42 % by volume') && f.includes('102 cm'), `permafrost: example facts (${f})`); }
  { const s = await txt('.pf-stab'); check(s.includes('1.12') && s.includes('0.94') && s.includes('0.92') && s.includes('depth in m') && s.includes('Dry density'), 'permafrost: sensitivity table'); }
  check(await page.isVisible(R + '.pf-curve') && await page.isVisible(R + '.pf-tfig') && (await txt('.pf-tnote')).includes('365 days read'), 'permafrost: curve, temperature figure and day count');
  { const box = await page.locator(R + '.pf-curve').boundingBox(); check(box && box.height > 100, 'permafrost: curve drawn'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pf-ccsv')]); const f = OUT + 'pf-curve.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 366 && rows[0] === 'day,air_temperature_C,thawing_index_air_Cdays,surface_index_Cdays,thaw_depth_m' && rows[365].endsWith(',887.90,710.32,1.0247'), `permafrost: curve CSV (${rows[365]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pf-scsv')]); const f = OUT + 'pf-sens.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[1].startsWith('Surface index (index × n),0.9165'), 'permafrost: sensitivity CSV'); }
  // Two layers
  await page.selectOption(R + '.pf-nl', '2'); await wait();
  check((await txt('.pf-big')) === '1.52 m thaw depth' && (await txt('.pf-facts')).includes('front stops in layer 2'), 'permafrost: two layers, 1.52 m');
  { const t = await txt('.pf-ltab'); check(t.includes('169') && t.includes('day 184') && t.includes('all thawed') && t.includes('front at 1.52 m') && t.includes('on down'), `permafrost: layer table (${t})`); }
  check((await page.locator(R + '.pf-layer').nth(1).locator('.pf-hl').isHidden()) && (await page.locator(R + '.pf-layer').nth(0).locator('.pf-hl').isVisible()), 'permafrost: last layer has no thickness box');
  check((await txt('.pf-stab')).includes('Top layer thickness'), 'permafrost: sensitivity adds the top-layer thickness');
  await page.selectOption(R + '.pf-nl', '3'); await wait();
  check((await txt('.pf-big')) === '1.53 m thaw depth' && (await txt('.pf-facts')).includes('layer 3'), 'permafrost: three layers, 1.53 m');
  // Frost depth
  await page.selectOption(R + '.pf-nl', '1'); await page.click(R + '.pf-kind button[data-k=freeze]'); await wait();
  check((await txt('.pf-big')) === '2.14 m frost depth' && (await txt('.pf-facts')).includes('3440 °C·days') && (await txt('.pf-facts')).includes('2064 °C·days') && await page.isVisible(R + '.pf-nf') && await page.isHidden(R + '.pf-nt'), 'permafrost: frost depth 2.14 m with the freezing n-factor');
  check((await txt('.pf-title')) === 'Frost depth' && (await txt('.pf-khelp')).includes('autumn to spring'), 'permafrost: frost wording');
  await page.fill(R + '.pf-nf', '1'); await wait();
  check((await txt('.pf-big')) === `${Math.sqrt(2 * 1.8 * 3440.1 * 86400 / (1400 * 0.3 * 334000)).toFixed(2)} m frost depth`, 'permafrost: n-factor 1 uses the air index');
  await page.fill(R + '.pf-nf', '0.6'); await page.click(R + '.pf-kind button[data-k=thaw]'); await wait();
  // Typed degree-days
  await page.selectOption(R + '.pf-src', 'dd'); await wait();
  check(await page.isHidden(R + '.pf-temps') && await page.isHidden(R + '.pf-tfig') && (await txt('.pf-big')) === '1.09 m thaw depth', 'permafrost: typed 1000 °C·days, n 0.8 → 1.09 m');
  await page.fill(R + '.pf-nt', '1'); await page.fill(R + '.pf-dd', '500'); await wait();
  check((await txt('.pf-big')) === `${Math.sqrt(2 * 1.2 * 500 * 86400 / 1.4028e8).toFixed(2)} m thaw depth`, 'permafrost: typed index, n 1');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pf-ccsv')]); const f = OUT + 'pf-dd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 102 && rows[0].startsWith('thawing_index_air_Cdays'), 'permafrost: index curve CSV'); }
  // Soil values change the answer, and bad input gives messages
  await page.locator(R + '.pf-layer').nth(0).locator('.pf-w').fill('60'); await wait();
  check((await txt('.pf-big')) === `${Math.sqrt(2 * 1.2 * 500 * 86400 / (1400 * 0.6 * 334000)).toFixed(2)} m thaw depth`, 'permafrost: wetter soil, shallower thaw');
  await page.locator(R + '.pf-layer').nth(0).locator('.pf-w').fill('0'); await wait();
  check((await txt('.pf-err')).includes('Dry soil') && await page.isHidden(R + '.pf-out'), 'permafrost: zero water content refused');
  await page.locator(R + '.pf-layer').nth(0).locator('.pf-w').fill('30'); await page.fill(R + '.pf-dd', '-5'); await wait();
  check((await txt('.pf-err')).includes('thawing index above 0'), 'permafrost: bad index refused');
  await page.fill(R + '.pf-dd', '500'); await page.fill(R + '.pf-nt', '0'); await wait();
  check((await txt('.pf-err')).includes('n-factor'), 'permafrost: bad n-factor refused');
  await page.fill(R + '.pf-nt', '0.8'); await page.selectOption(R + '.pf-src', 'daily'); await wait();
  // Pasted temperatures
  await page.fill(R + '.pf-temps', 'date,temp\n2026-06-01,4\n2026-06-02,6\n2026-06-03,-2\n2026-06-04,10'); await wait();
  check((await txt('.pf-facts')).includes('20 °C·days') && (await txt('.pf-facts')).includes('3 days above') && (await txt('.pf-tnote')).includes('1 line without a temperature skipped'), 'permafrost: pasted CSV with dates and a header');
  await page.fill(R + '.pf-temps', '-3\n-5\n-1'); await wait();
  check((await txt('.pf-err')).includes('No day in the list is above 0'), 'permafrost: no thaw days message');
  await page.click(R + '.pf-clear'); await wait();
  check((await txt('.pf-err')).includes('at least two daily'), 'permafrost: empty box message');
  await page.click(R + '.pf-ex'); await wait();
  check((await txt('.pf-big')) === '1.02 m thaw depth', 'permafrost: example back');
  // Report downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(/\.png$/.test(d.suggestedFilename()), 'permafrost: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(/\.pdf$/.test(d.suggestedFilename()), 'permafrost: PDF report'); }
};
