// #336 forest inventory summary
export const path = '/science/forest-inventory-summary/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.fis ';
  const t = async (c) => (await page.textContent(R + c)) ?? '';
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await t('.fi-big')) === 'Basal area 6.28 m²/ha, 154 stems/ha', 'inventory: example summary');
  { const f = await t('.fi-facts'); check(f.includes('± 1.05 (16.7 %)') && f.includes('3.59 to 8.97') && f.includes('± 18.7') && f.includes('22.8 cm') && f.includes('14.6 m') && f.includes('23 measured trees'), 'inventory: SE, range, QMD and Lorey height'); }
  { const s = await t('.fi-sp'); check(s.includes('Pine') && s.includes('4.621') && s.includes('73.5') && s.includes('27.3') && s.includes('All'), 'inventory: species table'); }
  { const c = await t('.fi-cl'); check(c.includes('25–30') && c.includes('41.67'), 'inventory: diameter class table'); }
  check(await page.isVisible(R + '.fi-fig'), 'inventory: diameter chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fi-csv1')]); const f = OUT + 'inv1.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[2].startsWith('Pine,19,79.1667,') && rows[4].startsWith('All,37,154.167'), 'inventory: species CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fi-csv2')]); const f = OUT + 'inv2.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[0] === 'class_from_cm,class_to_cm,Birch,Pine,Spruce,all' && rows[5].endsWith(',41.6667'), 'inventory: diameter class CSV'); }
  await fill('.fi-k', '7');
  check((await t('.fi-big')) === 'Basal area 5.39 m²/ha, 132 stems/ha' && (await t('.fi-facts')).includes('1 plot with no trees'), 'inventory: an empty plot counted');
  await fill('.fi-k', '3'); check((await t('.fi-err')).includes('at least the 6 plots'), 'inventory: too few plots message');
  await fill('.fi-k', '');
  await page.selectOption(R + '.fi-pm', 'radius'); await fill('.fi-pa', '11.28');
  check((await t('.fi-facts')).includes('399.7 m²') && (await t('.fi-big')).startsWith('Basal area 6.29'), 'inventory: circular plot radius');
  await page.selectOption(R + '.fi-pm', 'area'); await fill('.fi-pa', '400');
  await fill('.fi-w', '10'); check((await t('.fi-cl')).includes('20–30'), 'inventory: class width');
  await fill('.fi-w', '0'); check((await t('.fi-err')).includes('class width'), 'inventory: bad class width message');
  await fill('.fi-w', '5');
  await page.selectOption(R + '.fi-u', 'imperial'); await fill('.fi-pa', '4356'); await fill('.fi-data', 'A,10\nA,14\nB,20');
  check((await t('.fi-big')) === 'Basal area 19 ft²/acre, 15 stems/acre' && (await t('.fi-sp')).includes('All') && (await t('.fi-facts')).includes('no heights given'), 'inventory: imperial, two columns (plot and DBH)');
  await fill('.fi-data', 'plot,species,dbh\n1,Oak,-4'); check((await t('.fi-err')).includes('Row 2: give the DBH') && await page.isHidden(R + '.fi-out'), 'inventory: bad DBH message');
  await page.selectOption(R + '.fi-u', 'metric'); await fill('.fi-pa', '400'); await fill('.fi-data', 'plot,species,dbh,height\n1,Oak,30,x');
  check((await t('.fi-err')).includes('height must be a number'), 'inventory: bad height message');
  await fill('.fi-data', 'plot,species,dbh,height\n1,Oak,30,20\n2,Ash,20,');
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check((await d.suggestedFilename()) === `forest-inventory.${f}`, `inventory: ${f} download`); }
};
