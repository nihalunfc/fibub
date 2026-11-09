// #306 community ordination
export const path = '/science/community-ordination/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/community-ordination/`); await page.waitForTimeout(900);
  const t = (s) => page.textContent(`.cord ${s}`);
  check((await t('.co-pbig')) === 'PC1 68.9 %, PC2 23.1 % of the variation', 'ordination: example Hellinger PCA');
  check((await t('.co-load')).includes('Carex nigra') && (await t('.co-eig')).includes('PC4'), 'ordination: loadings and axes tables');
  check((await t('.co-nbig')) === 'Stress 0.024: excellent' && (await t('.co-nfacts')).includes('20 reached the lowest stress'), 'ordination: NMDS stress on Bray-Curtis');
  check((await t('.co-cbig')) === '3 groups, cophenetic correlation 0.791', 'ordination: UPGMA cophenetic r');
  { const g = await t('.co-grp'); check(g.includes('Q1, Q2, Q3') && g.includes('Q4, Q5, Q6, Q7') && g.includes('Q8, Q9, Q10, Q11, Q12'), 'ordination: three groups'); }
  check(await page.isVisible('.cord .co-pfig') && await page.isVisible('.cord .co-nfig') && await page.isVisible('.cord .co-shep') && await page.isVisible('.cord .co-dend'), 'ordination: four figures');
  await page.selectOption('.cord .co-tr', 'none'); await page.waitForTimeout(500);
  check((await t('.co-pbig')) === 'PC1 47.8 %, PC2 37.9 % of the variation', 'ordination: PCA on raw values = numpy');
  await page.selectOption('.cord .co-tr', 'sqrt'); await page.waitForTimeout(500);
  const sq = await t('.co-pbig'); await page.selectOption('.cord .co-tr', 'relative'); await page.waitForTimeout(500);
  check(sq.startsWith('PC1 ') && (await t('.co-pbig')).startsWith('PC1 ') && sq !== (await t('.co-pbig')), 'ordination: square root and proportions');
  await page.selectOption('.cord .co-link', 'ward'); await page.waitForTimeout(500);
  check((await t('.co-cbig')) === '3 groups, cophenetic correlation 0.750' && (await t('.co-cfacts')).includes('1.467'), 'ordination: Ward = SciPy');
  await page.selectOption('.cord .co-link', 'single'); await page.waitForTimeout(500);
  check((await t('.co-cbig')).endsWith('0.727'), 'ordination: single linkage = SciPy');
  await page.selectOption('.cord .co-link', 'complete'); await page.waitForTimeout(500);
  check((await t('.co-cbig')).endsWith('0.790'), 'ordination: complete linkage = SciPy');
  await page.selectOption('.cord .co-dist', 'euclid-hellinger'); await page.selectOption('.cord .co-link', 'ward'); await page.waitForTimeout(500);
  check((await t('.co-cbig')).endsWith('0.736') && (await t('.co-cfacts')).includes('2.013'), 'ordination: Ward on Hellinger distance = SciPy');
  for (const v of ['bray-sqrt', 'bray-relative', 'euclid-none']) { await page.selectOption('.cord .co-dist', v); await page.waitForTimeout(500); check(/^Stress 0\.\d{3}: /.test(await t('.co-nbig')), `ordination: NMDS with ${v}`); }
  await page.fill('.cord .co-k', '2'); await page.waitForTimeout(500);
  check((await t('.co-cbig')).startsWith('2 groups'), 'ordination: 2 groups');
  await page.locator('.cord .co-sp').scrollIntoViewIfNeeded(); await page.click('.cord .co-sp'); await page.waitForTimeout(400);
  check(!(await page.isChecked('.cord .co-sp')) && await page.isVisible('.cord .co-pfig'), 'ordination: biplot off');
  await page.selectOption('.cord .co-dist', 'bray-none'); await page.selectOption('.cord .co-link', 'average'); await page.fill('.cord .co-k', '3'); await page.waitForTimeout(600);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cord .co-csv')]); const f = OUT + 'ord-scores.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 13 && r[0] === 'site,PC1,PC2,NMDS1,NMDS2,group' && r[1].startsWith('Q1,') && r[12].endsWith(',3'), 'ordination: site scores CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cord .co-dcsv')]); const f = OUT + 'ord-dist.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 13 && r[1].split(',')[2] === '0.214724', 'ordination: Bray-Curtis CSV = SciPy'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cord .co-nwk')]); const f = OUT + 'ord.nwk'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.trim().endsWith(';') && (s.match(/Q\d+/g) || []).length === 12, 'ordination: Newick dendrogram'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cord .dl [data-f="pdf"]')]); const f = OUT + 'ord.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 4).toString() === '%PDF', 'ordination: PDF report'); }
  writeFileSync(OUT + 'ord-up.csv', 'Species,A,B,C,D\nx,1,2,0,5\ny,3,0,4,1\nz,0,2,2,2\n');
  await page.setInputFiles('.cord .dfb-in', OUT + 'ord-up.csv'); await page.waitForTimeout(700);
  check((await t('.co-pfacts')).includes('4, 3') && (await t('.co-nbig')).startsWith('Stress'), 'ordination: CSV file opened');
  await page.fill('.cord .co-in', 'Species\tA\tB\tC\nx\t1\t0\t2\ny\t0\t0\t3'); await page.waitForTimeout(500);
  check((await t('.co-err')).includes('no species at all') && await page.isHidden('.cord .co-out'), 'ordination: empty site message');
  await page.fill('.cord .co-in', 'Species\tA\tB\nx\t1\t2\ny\t3\t1'); await page.waitForTimeout(500);
  check((await t('.co-err')).includes('at least three sites'), 'ordination: too few sites message');
  await page.fill('.cord .co-in', 'Species\tA\tB\tC\nx\t1\tlots\t2\ny\t0\t1\t3'); await page.waitForTimeout(500);
  check((await t('.co-err')).includes('"lots"'), 'ordination: not a number message');
  await page.fill('.cord .co-in', 'Species\tA\tB\tC\nx\t1\t-2\t2\ny\t0\t1\t3'); await page.waitForTimeout(500);
  check((await t('.co-err')).includes('negative'), 'ordination: negative message');
  await page.fill('.cord .co-in', 'Species\tA\tB\tC\nx\t1\t2\t2\ny\t0\t1\t3'); await page.waitForTimeout(500);
  check((await t('.co-nbig')) === 'NMDS needs at least 4 sites.' && await page.isVisible('.cord .co-dend'), 'ordination: 3 sites skips NMDS');
  await page.fill('.cord .co-k', '9'); await page.waitForTimeout(500);
  check((await t('.co-err')).includes('1 to 8'), 'ordination: groups out of range message');
};
