// #181 protein assay standard curve
export const path = '/science/protein-assay/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/protein-assay/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent(`.pas ${c}`);
  const row = async (i) => (await page.$$eval('.pas .pa-utab tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent))))[i];
  check((await t('.pa-big')) === 'Quadratic (curved), R² 0.99956', 'protein assay: example quadratic curve and R²');
  check((await t('.pa-facts')).includes('0.4517') && (await t('.pa-facts')).includes('100 to 2000 µg/mL') && (await t('.pa-facts')).includes('3156 µg/mL'), 'protein assay: blank, range and the top of the curve');
  check((await row(1)).join('|') === 'Cell lysate|10|0.8677|0.0065|0.7|0.4160|590|5900|104|3.39|21.6|In range', `protein assay: cell lysate row (${(await row(1)).join('|')})`);
  check((await row(2))[4] === '11.7' && (await row(2))[11] === 'High CV' && (await t('.pa-unote')).includes('High CV: the readings'), 'protein assay: CV flag on the tissue extract');
  check((await row(3))[6] === '2751' && (await row(3))[11] === 'Above top standard', 'protein assay: purified protein above the standards');
  check((await row(4))[6] === '31.99' && (await row(4))[11] === 'Below lowest standard', 'protein assay: wash fraction below the standards');
  check((await t('.pa-stab')).includes('98.3') && (await t('.pa-warn')).startsWith('Every standard reads back within 10 %') && await page.isVisible('.pas .pa-fig'), 'protein assay: standards read back and figure');
  await page.selectOption('.pas .pa-fit', 'linear'); await page.waitForTimeout(100);
  check((await t('.pa-big')) === 'Straight line, R² 0.98264' && (await row(1))[7] === '6666' && (await t('.pa-warn')).includes('try the quadratic'), 'protein assay: straight line and its warning');
  check((await row(4))[11] === 'At the blank' && (await row(4))[7] === '–', 'protein assay: straight line reads the wash below zero');
  await page.selectOption('.pas .pa-fit', 'p2p'); await page.waitForTimeout(100);
  check((await t('.pa-big')) === 'Point to point through 8 standards' && (await row(1))[7] === '5868', 'protein assay: point to point');
  await page.selectOption('.pas .pa-fit', 'quadratic');
  await page.selectOption('.pas .pa-blank', 'value'); await page.waitForTimeout(100);
  check(await page.isVisible('.pas .pa-bv') && (await t('.pa-facts')).includes('0.4500'), 'protein assay: typed blank');
  await page.selectOption('.pas .pa-blank', 'none'); await page.waitForTimeout(100);
  check((await t('.pa-facts')).includes('none taken away') && await page.isHidden('.pas .pa-bv'), 'protein assay: no blank');
  await page.selectOption('.pas .pa-blank', 'zero'); await page.waitForTimeout(100);
  await page.fill('.pas .pa-amt', '30'); await page.fill('.pas .pa-fv', '4'); await page.waitForTimeout(400);
  { const h = await page.$$eval('.pas .pa-utab th', (e) => e.map((x) => x.textContent)); const r = await row(1); check(h.includes('µL for 30 µg') && h.includes('Buffer to 4 µL') && r[9] === '5.08' && r[10] === 'too dilute' && (await t('.pa-unote')).includes('Too dilute'), 'protein assay: other amount, too dilute for the final volume'); }
  await page.fill('.pas .pa-fv', ''); await page.waitForTimeout(400);
  check(!(await page.$$eval('.pas .pa-utab th', (e) => e.map((x) => x.textContent))).some((x) => x.startsWith('Buffer')), 'protein assay: final volume left out');
  await page.selectOption('.pas .pa-unit', 'mg/mL'); await page.waitForTimeout(100);
  check((await page.textContent('.pas .pa-utab th:nth-child(7)')) === 'In assay (mg/mL)' && (await t('.pa-unote')).includes('1 mg/mL holds 1 µg'), 'protein assay: mg/mL unit');
  await page.fill('.pas .pa-cvl', '0.5'); await page.waitForTimeout(400);
  check((await row(1)).at(-1) === 'High CV', 'protein assay: lower CV limit flags the lysate');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pas .pa-csv')]); const f = OUT + 'protein-assay.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 15 && rows[0].startsWith('sample,dilution,mean_A') && rows[1].startsWith('Cell lysate,10,') && rows[6].startsWith('standard_mg/mL'), 'protein assay: results CSV'); }
  { await page.locator('.pas .dl [data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pas .dl [data-f=png]')]); check(d.suggestedFilename() === 'protein-assay.png', 'protein assay: PNG report'); }
  // Bad input.
  await page.fill('.pas .pa-std', '0, 0.45\n100, abc'); await page.waitForTimeout(400);
  check((await t('.pa-err')).includes('Standards line 2') && await page.isHidden('.pas .pa-out'), 'protein assay: bad standard reading message');
  await page.fill('.pas .pa-std', '100, 0.5\n200, 0.6\n400, 0.8'); await page.waitForTimeout(400);
  check((await t('.pa-err')).includes('no 0 standard'), 'protein assay: no 0 standard for the blank');
  await page.fill('.pas .pa-std', '0, 0.4\n500, 0.9\n1000, 0.8'); await page.selectOption('.pas .pa-fit', 'p2p'); await page.waitForTimeout(400);
  check((await t('.pa-err')).includes('higher than the one below'), 'protein assay: point to point needs rising standards');
  await page.fill('.pas .pa-unk', 'A, 0, 0.5'); await page.waitForTimeout(400);
  check((await t('.pa-err')).includes('dilution factor must be 1 or more'), 'protein assay: bad dilution message');
  await page.click('.pas .pa-ex'); await page.waitForTimeout(100);
  check(await page.isHidden('.pas .pa-err') && (await t('.pa-big')) === 'Quadratic (curved), R² 0.99956' && (await row(1))[7] === '5900', 'protein assay: example button restores everything');
};
