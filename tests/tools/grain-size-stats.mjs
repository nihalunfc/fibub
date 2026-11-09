// #875 grain-size statistics from sieve data
export const path = '/science/grain-size-stats/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/grain-size-stats/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.grs ' + c);
  check((await t('.gs-big')) === '3 samples: mean size Beach 1.68 φ, River bar 0.34 φ, Estuary 3.44 φ', 'grain size: example of three samples');
  { const s = (await t('.gs-sum')).replace(/\n/g, ''); check(s.includes('1.684') && s.includes('0.591moderately well sorted') && s.includes('−0.014symmetrical') && s.includes('1.059mesokurtic') && s.includes('311 µmmedium sand') && s.includes('1.554poorly sorted') && s.includes('20.4077.771.83') && s.includes('platykurtic'), 'grain size: Folk and Ward measures, classes and gravel/sand/mud'); }
  { const s = (await t('.gs-sum')).replace(/\n/g, ''); check(s.includes('1.6770.586') && s.includes('313 µm1.501') && s.includes('111.8'), 'grain size: moments and total'); }
  check((await t('.gs-warn')).includes('Estuary: 32 % passed the finest sieve, so φ95, φ84'), 'grain size: open pan warning');
  check(await page.isVisible('.grs .gs-cum') && await page.isVisible('.grs .gs-freq'), 'grain size: plots');
  check((await t('.gs-pct')).includes('φ501.686311 µm') && (await t('.gs-went')).includes('Medium sand500 µm to 250 µm62.25'), 'grain size: Beach percentiles and Wentworth classes');
  await page.selectOption('.grs .gs-pick', '1'); await page.waitForTimeout(200);
  check((await t('.gs-pct')).includes('φ500.348') && (await t('.gs-went')).includes('Granules'), 'grain size: details for another sample');
  await page.fill('.grs .gs-pan', '2'); await page.waitForTimeout(300);
  check((await t('.gs-warn')).includes('now to 5.99 φ') && !(await t('.gs-sum')).includes('0.899platykurtic'), 'grain size: pan class width changes the fine percentiles');
  await page.fill('.grs .gs-pan', '0'); await page.waitForTimeout(300);
  check((await t('.gs-err')).includes('open-class widths') && await page.isHidden('.grs .gs-out'), 'grain size: bad open-class width');
  await page.fill('.grs .gs-pan', '1'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grs .gs-csv')]); const f = OUT + 'gs.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 4 && r[0].startsWith('sample,total_mass,fw_mean_phi') && r[1].startsWith('Beach,111.8,1.68376,0.31127,0.590981,moderately well sorted'), 'grain size: statistics CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grs .gs-ccsv')]); const f = OUT + 'gsc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0].startsWith('sample,class_from_phi') && r.length === 1 + 3 * 14 && r.at(-1).endsWith(',100,yes'), 'grain size: curves CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grs .gs-svg')]); const f = OUT + 'gs.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('<?xml') && s.includes('Cumulative % coarser') && s.includes('Weight % per φ'), 'grain size: plots SVG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grs .gs-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'gs.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'grain size: Word report'); }
  await page.fill('.grs .gs-in', '-1 0\n0 5\n1 20\n2 50\n3 20\n4 5'); await page.selectOption('.grs .gs-unit', 'phi'); await page.waitForTimeout(600);
  check((await t('.gs-big')).startsWith('Sample 1: 1.50 φ (354 µm), medium sand') && (await t('.gs-warn')) === '', 'grain size: one sample in φ without a pan');
  await page.fill('.grs .gs-in', 'mm g\n0.5 3\nabc 4'); await page.selectOption('.grs .gs-unit', 'mm'); await page.waitForTimeout(600);
  check((await t('.gs-err')).includes('Line 3: "abc" is not a sieve size'), 'grain size: unreadable sieve size');
  await page.fill('.grs .gs-in', '0.5 3\n0.25 -4'); await page.waitForTimeout(600);
  check((await t('.gs-err')).includes('not a mass of zero or more'), 'grain size: negative mass');
};
