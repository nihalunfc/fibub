// #213 SAR table builder
export const path = '/science/sar-table/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/sar-table/`); await page.waitForTimeout(600);
  const txt = (c) => page.textContent('.sar ' + c);
  check((await txt('.sar-big')) === 'Most potent: SAR-12 (4-Cl, morpholino), pIC50 8.25 (5.6 nM)', 'sar: example summary line');
  { const f = await txt('.sar-facts'); check(f.includes('25 rows, 25 distinct') && f.includes('Matched pairs87') && f.includes('25 different substituent changes') && f.includes('1 given only as a limit'), `sar: example facts (${f.slice(0, 120)})`);
    check(f.includes('R1: best / worst4-Cl / 4-CN') && f.includes('+0.65 and −0.52') && f.includes('R2: best / worstmorpholino / NMe2') && f.includes('Best ligand efficiency0.45 (SAR-12)') && f.includes('Best LLE5.65 (SAR-12)'), 'sar: best and worst groups, LE and LLE'); }
  check(await page.isVisible('.sar .sar-heat') && (await page.getAttribute('.sar .sar-heat', 'aria-label')).includes('R1 (rows) against R2 (columns)') && (await page.getAttribute('.sar .sar-heat', 'aria-label')).includes('from 5.00 to 8.25'), 'sar: potency matrix drawn');
  { const g = await page.$$eval('.sar .sar-gtab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent))); check(g.length === 6 && g[0][0] === '4-Cl' && g[0][4] === '+0.65' && g[5][0] === '4-CN' && g[5][3] === '10', 'sar: R1 group table'); }
  { const t = await page.$$eval('.sar .sar-ttab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent))); const r = t.find((x) => x[0] === 'H → 4-Cl'); check(r && r[1] === '4' && r[2] === '+0.90' && r[3] === '0.43', 'sar: H → 4-Cl change'); }
  await page.selectOption('.sar .sar-tp', '1'); await page.waitForTimeout(100);
  { const t = await page.$$eval('.sar .sar-ttab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent))); const r = t.find((x) => x[0] === 'NHMe → morpholino'); check(r && r[1] === '6' && r[2] === '+0.59' && r[3] === '0.46' && r[4] === '+0.11' && r[5] === '+1.43' && (await page.textContent('.sar .sar-gtab tbody tr td')) === 'morpholino', 'sar: R2 position, NHMe → morpholino'); }
  // Sorting the compound table.
  const first = () => page.$eval('.sar .sar-tab tbody tr', (r) => [...r.cells].map((c) => c.textContent));
  await page.locator('.sar .sar-sort[data-k="4"]').scrollIntoViewIfNeeded(); await page.click('.sar .sar-sort[data-k="4"]');
  { const r = await first(); check(r[0] === 'SAR-12' && r[4] === '8.25' && r[6] === '0.45' && r[8] === '5.65' && (await page.getAttribute('.sar .sar-tab th:nth-child(5)', 'aria-sort')) === 'descending', 'sar: sort by pIC50, most potent first'); }
  await page.click('.sar .sar-sort[data-k="4"]');
  { const r = await first(); check(r[0] === 'SAR-24' && r[3] === '>10000' && r[4] === '<5.00', 'sar: sort again, limit value last becomes first'); }
  await page.click('.sar .sar-sort[data-k="3"]'); check((await first())[0] === 'SAR-12', 'sar: raw activity column sorts by potency');
  await page.click('.sar .sar-sort[data-k="1"]'); check((await first())[1] === '3-CF3', 'sar: sort by R1 text');
  // Matrix options.
  await page.selectOption('.sar .sar-mo', 'potency'); await page.waitForTimeout(100);
  check(await page.isVisible('.sar .sar-heat'), 'sar: matrix in potency order');
  await page.selectOption('.sar .sar-mr', '1'); await page.selectOption('.sar .sar-mc', '0'); await page.waitForTimeout(100);
  check((await page.getAttribute('.sar .sar-heat', 'aria-label')).includes('R2 (rows) against R1 (columns)'), 'sar: matrix rows and columns swapped');
  await page.selectOption('.sar .sar-mc', '1'); await page.waitForTimeout(100);
  check(await page.isHidden('.sar .sar-heat') && (await txt('.sar-mnote')).includes('two different positions'), 'sar: same position for rows and columns');
  await page.selectOption('.sar .sar-mr', '0');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sar .sar-csv')]); const f = OUT + 'sar.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 26 && rows[0] === 'ID,R1,R2,IC50 (nM),pIC50 qualifier,pIC50,HA,LE (kcal/mol per heavy atom),cLogP,LLE' && rows[12].startsWith('SAR-12,4-Cl,morpholino,5.6,,8.2518,25,0.4522,2.6,5.6518') && rows[24].startsWith('SAR-24,4-CN,NMe2,>10000,<,5.0000'), 'sar: table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sar .sar-pcsv')]); const f = OUT + 'sarp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 88 && rows[0].startsWith('position,from,to,compound_from') && !rows.some((r) => r.includes('SAR-24')), 'sar: matched pairs CSV (limits left out)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sar .dl [data-f="png"]')]); check(d.suggestedFilename().endsWith('.png'), 'sar: report image download'); }
  // Units.
  await page.selectOption('.sar .sar-unit', 'uM'); await page.waitForTimeout(100);
  check((await txt('.sar-big')) === 'Most potent: SAR-12 (4-Cl, morpholino), pIC50 5.25 (5.6 µM)', 'sar: unit picked overrides the header');
  await page.selectOption('.sar .sar-unit', 'auto');
  // Bad input and other layouts.
  await page.fill('.sar .sar-data', 'ID,R1,IC50\na,H,10\nb,F,5'); await page.waitForTimeout(600);
  check((await txt('.sar-err')).includes('Say the unit') && await page.isHidden('.sar .sar-out'), 'sar: missing unit message');
  await page.selectOption('.sar .sar-unit', 'nM'); await page.waitForTimeout(200);
  check((await txt('.sar-big')).startsWith('Most potent: b (F), pIC50 8.30') && await page.isHidden('.sar .sar-mcard') && (await txt('.sar-facts')).includes('Matched pairs1'), 'sar: one R position, no matrix');
  await page.fill('.sar .sar-data', 'ID,R1,IC50 (nM)\na,H,ten\nb,F,5'); await page.waitForTimeout(600);
  check((await txt('.sar-err')).includes('Line 2: the activity "ten" is not a number'), 'sar: bad number message');
  await page.selectOption('.sar .sar-unit', 'auto');
  await page.fill('.sar .sar-data', 'Cpd\tR1\tR2\tR3\tpKi\nA\tH\tMe\tOH\t6\nB\tF\tMe\tOH\t6.5\nC\tF\tEt\tOH\t7\nD\tF\tEt\tNH2\t8\nE\tH\tEt\tNH2\t7.4'); await page.waitForTimeout(600);
  check((await txt('.sar-big')) === 'Most potent: D (F, Et, NH2), pKi 8.00' && (await txt('.sar-mnote')).includes('averaged over the other positions') && (await page.$$eval('.sar .sar-tp option', (o) => o.length)) === 3, 'sar: three positions, pKi');
  await page.click('.sar .sar-clear'); await page.waitForTimeout(100);
  check((await txt('.sar-err')).includes('Paste a series') && await page.isHidden('.sar .sar-out'), 'sar: cleared');
  await page.click('.sar .sar-ex'); await page.waitForTimeout(200);
  check((await txt('.sar-big')).startsWith('Most potent: SAR-12') && await page.isVisible('.sar .sar-heat'), 'sar: example back');
};
