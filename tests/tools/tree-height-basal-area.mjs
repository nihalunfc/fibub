// #334 tree height by clinometer and basal area
export const path = '/science/tree-height-basal-area/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.thb ';
  const t = async (c) => (await page.textContent(R + c)) ?? '';
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(350); };
  const pick = async (c, v) => { await page.selectOption(R + c, v); await page.waitForTimeout(350); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await t('.th-hbig')) === 'Tree height: 27.0 m', 'tree height: example, tangent method in degrees');
  check((await t('.th-hfacts')).includes('25.6 m') && (await t('.th-hfacts')).includes('1.399 m'), 'tree height: parts above and below eye level');
  check((await t('.th-bbig')) === 'Basal area: 10.6 m²/ha' && (await t('.th-bfacts')).includes('250 per ha') && (await t('.th-bfacts')).includes('23.2 cm'), 'basal area: example plot');
  await pick('.th-dm', 's'); await fill('.th-d', '22');
  check((await t('.th-hbig')) === 'Tree height: 28.7 m' && (await t('.th-hfacts')).includes('along a slope of 15°'), 'tree height: distance along a slope');
  await pick('.th-ang', 'pct'); await fill('.th-top', '128'); await fill('.th-base', '-7'); await fill('.th-slope', '25');
  check((await t('.th-hbig')) === 'Tree height: 28.8 m', 'tree height: percent readings on a slope');
  await pick('.th-dm', 'h'); await fill('.th-d', '20');
  check((await t('.th-hbig')) === 'Tree height: 27.0 m', 'tree height: percent readings on the level');
  await pick('.th-ang', 'deg'); await fill('.th-top', '52'); await pick('.th-bm', 'eye');
  check((await t('.th-hbig')) === 'Tree height: 27.2 m' && (await t('.th-hfacts')).includes('your eye height'), 'tree height: level ground with eye height');
  await pick('.th-m', 'sin');
  check((await t('.th-hbig')) === 'Tree height: 28.5 m' && await page.isHidden(R + '.th-tan'), 'tree height: sine method');
  await fill('.th-at', '-8');
  check((await t('.th-herr')).includes('angle to the top must be higher') && await page.isHidden(R + '.th-hout'), 'tree height: bad angles message');
  await fill('.th-at', '53');
  await pick('.th-m', 'tan'); await fill('.th-d', '');
  check((await t('.th-herr')).includes('distance to the trunk'), 'tree height: missing distance message');
  await fill('.th-d', '20');
  // Plot by radius, then imperial units.
  await pick('.th-pm', 'radius'); await fill('.th-pa', '11.28');
  check((await t('.th-bbig')) === 'Basal area: 10.6 m²/ha' && (await t('.th-bfacts')).includes('399.7 m²'), 'basal area: circular plot radius');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.th-csv')]); const f = OUT + 'thb-plot.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 11 && rows[0].startsWith('tree,dbh_cm,basal_area_m2') && rows[8].startsWith('8,40.2,0.12692'), 'basal area: plot CSV'); }
  await fill('.th-dbhs', '12\n-3'); check((await t('.th-berr')).includes('Row 2: give a DBH'), 'basal area: bad DBH message');
  await pick('.th-u', 'imperial'); await pick('.th-pm', 'area'); await fill('.th-dbhs', '10\n14\n20'); await fill('.th-pa', '4356');
  check((await t('.th-bbig')) === 'Basal area: 38 ft²/acre' && (await t('.th-bfacts')).includes('30 per acre'), 'basal area: imperial tenth-acre plot');
  check((await t('.th-hbig')) === 'Tree height: 27.2 ft', 'tree height: imperial labels');
  await pick('.th-bmode', 'one'); await pick('.th-u', 'metric');
  check((await t('.th-bbig')) === 'Basal area: 0.09621 m²' && await page.isHidden(R + '.th-csv'), 'basal area: one tree');
  await fill('.th-dbh', 'abc'); check((await t('.th-berr')).includes('Give the DBH'), 'basal area: one tree bad input');
  await fill('.th-dbh', '35');
  await pick('.th-bmode', 'prism');
  check((await t('.th-bbig')) === 'Basal area: 16.6 m²/ha' && (await t('.th-bfacts')).includes('± 1.78') && (await t('.th-bfacts')).includes('10.6 m'), 'basal area: prism sweep with standard error and borderline check');
  check(await page.isVisible(R + '.th-fig'), 'basal area: prism chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.th-csv')]); const f = OUT + 'thb-prism.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[2] === 'P2,9.5,19', 'basal area: prism CSV'); }
  await pick('.th-rows', 'dbh'); await fill('.th-pts', 'point,DBHs\nA,20,30\nB,25');
  check((await t('.th-bbig')) === 'Basal area: 3 m²/ha' && (await t('.th-bfacts')).includes('66.35 per ha'), 'basal area: prism with in-tree DBHs gives stems');
  await pick('.th-rows', 'count'); await fill('.th-pts', 'A,2.3');
  check((await t('.th-berr')).includes('whole or half numbers'), 'basal area: prism bad count message');
  await fill('.th-pts', 'A,7\nB,9.5\nC,6\nD,11\nE,8');
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check((await d.suggestedFilename()) === `tree-height-basal-area.${f}`, `tree height: ${f} download`); }
};
