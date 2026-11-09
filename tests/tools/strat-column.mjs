// #876 stratigraphic column
export const path = '/science/strat-column/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/strat-column/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.stc ' + c);
  const beds = () => page.$$eval('.stc .sc-view polygon', (p) => p.filter((x) => (x.getAttribute('fill') || '').startsWith('url(')).length);
  check((await t('.sc-facts')).includes('26.6 m') && (await t('.sc-facts')).includes('Beds12') && (await t('.sc-facts')).includes('1:200'), 'strat column: example total, beds and auto scale');
  check(await beds() === 12 && (await t('.sc-view')).includes('Bioclastic; crinoids and brachiopods') && (await t('.sc-view')).includes('Vertical scale 1:200'), 'strat column: 12 bed polygons, notes, legend and scale note');
  check((await t('.sc-tab')).includes('1018.423.4Limestone') && (await t('.sc-tab')).includes('45.76.1Coal'), 'strat column: base and top of each bed');
  { const h = await page.$eval('.stc .sc-view svg', (s) => s.viewBox.baseVal.height); check(h > 133 && h < 200, 'strat column: page taller than the 133 mm column'); }
  await page.selectOption('.stc .sc-scale', '100'); await page.waitForTimeout(300);
  check((await t('.sc-facts')).includes('1:100') && (await t('.sc-view')).includes('Vertical scale 1:100'), 'strat column: fixed scale');
  await page.selectOption('.stc .sc-scale', 'auto'); await page.selectOption('.stc .sc-unit', '0.01'); await page.waitForTimeout(300);
  check((await t('.sc-facts')).includes('26.6 cm') && (await t('.sc-facts')).includes('1:10'), 'strat column: thickness in cm');
  await page.selectOption('.stc .sc-unit', '1');
  await page.check('.stc .sc-colour'); await page.waitForTimeout(300);
  check(await page.$$eval('.stc .sc-view polygon', (p) => p.some((x) => x.getAttribute('fill') === '#f6e7a8')), 'strat column: colour fills');
  await page.uncheck('.stc .sc-colour');
  await page.selectOption('.stc .sc-order', 'down'); await page.waitForTimeout(300);
  { const tab = await t('.sc-tab'); check(tab.includes('02.2Dolostone') && tab.includes('25.126.6Conglomerate'), 'strat column: youngest-first heights'); }
  await page.selectOption('.stc .sc-order', 'up'); await page.waitForTimeout(300);
  for (const [cls, ext, magic] of [['.sc-svg', 'svg', '<svg'], ['.sc-png', 'png', '\x89PNG'], ['.sc-pdf', 'pdf', '%PDF']]) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click('.stc ' + cls)]); const f = OUT + 'sc.' + ext; await d.saveAs(f);
    check(readFileSync(f, 'latin1').startsWith(magic) && d.suggestedFilename() === 'Example-section-made-up.' + ext, `strat column: ${ext.toUpperCase()} download`);
  }
  let csvText;
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.stc .sc-csv')]); const f = OUT + 'sc.csv'; await d.saveAs(f); csvText = readFileSync(f, 'utf8'); const r = csvText.trim().split('\n');
    check(r.length === 13 && r[0] === 'thickness_m,lithology,grain,contact,notes,base_m,top_m' && r[1] === '1.5,conglomerate,pb-gr,erosive,"Clast-supported, imbricated pebbles",0,1.5' && r[12].endsWith(',24.4,26.6'), 'strat column: CSV with base and top'); }
  // Columns by header name, in another order (a TSV as the Open a file button makes it).
  await page.fill('.stc .sc-in', 'notes\tcontact\tlithology\tthickness_m\nlag\terosive\tsandy limestone\t2\n\t\tclaystone\t1'); await page.waitForTimeout(600);
  check((await t('.sc-facts')).includes('3 m') && (await t('.sc-tab')).includes('Limestone') && (await t('.sc-tab')).includes('Mudstone') && (await t('.sc-view')).includes('lag'), 'strat column: columns found by header name');
  await page.fill('.stc .sc-in', '2 granite-ish pebble\n1 unobtainium m weird'); await page.waitForTimeout(600);
  { const w = await t('.sc-warn'); check(w.includes('Bed 2: no pattern for "unobtainium"') && w.includes('contact "weird" not read'), 'strat column: warnings for unknown lithology and contact'); }
  await page.fill('.stc .sc-in', '2 sandstone\n-1 shale'); await page.waitForTimeout(600);
  check((await t('.sc-err')).includes('Bed 2: "-1" is not a thickness') && await page.isHidden('.stc .sc-out'), 'strat column: bad thickness');
  await page.fill('.stc .sc-in', '100000 sandstone'); await page.selectOption('.stc .sc-scale', '10'); await page.waitForTimeout(600);
  check((await t('.sc-err')).includes('over 20 m tall'), 'strat column: too tall for the scale');
  await page.selectOption('.stc .sc-scale', 'auto');
};
