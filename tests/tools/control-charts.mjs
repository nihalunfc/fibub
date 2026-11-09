// #690 control charts and process capability
export const path = '/science/control-charts/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/control-charts/`); await page.waitForTimeout(1200);
  const big = () => page.textContent('.ccs .cc-big'), facts = () => page.textContent('.ccs .cc-facts'), flags = () => page.textContent('.ccs .cc-flags'), cap = () => page.textContent('.ccs .cc-cap');
  const kind = async (k) => { await page.selectOption('.ccs .cc-kind', k); await page.waitForTimeout(250); };
  check((await big()) === 'Out of control: 5 points break a rule', 'cc: example X̄-R headline');
  { const f = await facts(); check(f.includes('500.24') && f.includes('LCL 499.64, UCL 500.83') && f.includes('UCL 2.1822') && f.includes('0.44369') && f.includes('d2 = 2.3259'), 'cc: X̄-R limits and constants'); }
  { const t = await flags(); check(t.includes('500.90') && t.includes('500.04') && t.includes('1, 2, 3'), 'cc: flagged subgroups table'); check((await page.textContent('.ccs .cc-rulekey')).includes('Rule 4: 8 points in a row on one side'), 'cc: Western Electric rule key'); }
  { const c = await cap(); check(c.includes('1.127') && c.includes('0.971 to 1.283') && c.includes('0.949') && c.includes('0.920') && c.includes('0.775') && c.includes('10,730 ppm'), 'cc: capability with intervals'); }
  check(await page.isVisible('.ccs .cc-f1') && await page.isVisible('.ccs .cc-f2') && await page.isVisible('.ccs .cc-f3'), 'cc: X̄, R and histogram figures');
  await page.selectOption('.ccs .cc-rules', 'nelson'); await page.waitForTimeout(200);
  check((await big()) === 'Out of control: 4 points break a rule' && (await page.textContent('.ccs .cc-rulekey')).includes('Rule 8'), 'cc: Nelson rules');
  await page.selectOption('.ccs .cc-rules', 'we');
  await kind('xbar-s');
  check((await facts()).includes('c4 = 0.9400') && (await cap()).includes('1.106'), 'cc: X̄-S chart');
  await kind('i-mr');
  check((await facts()).includes('UCL 501.67') && (await facts()).includes('MR̄ / d2(2)'), 'cc: I-MR chart');
  await kind('p');
  check((await page.inputValue('.ccs .cc-data')).startsWith('defective\tsample size') && (await facts()).includes('0.0398') && (await flags()).includes('14') && await page.isHidden('.ccs .cc-capbox'), 'cc: p chart swaps in the defectives example');
  await kind('np');
  check((await facts()).includes('7.96'), 'cc: np chart');
  await kind('u');
  check((await page.inputValue('.ccs .cc-data')).startsWith('defects\tunits') && (await facts()).includes('limits change with the sample size'), 'cc: u chart with varying limits');
  await kind('c');
  check((await facts()).includes('10.08') && (await facts()).includes('UCL 19.605'), 'cc: c chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ccs .cc-csv')]); const f = OUT + 'cc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 26 && rows[0].startsWith('sample,Defects c,CL,LCL,UCL'), 'cc: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ccs .dl [data-f=docx]')]); check((await d.suggestedFilename()) === 'control-chart.docx', 'cc: Word report'); }
  await kind('xbar-r'); await page.click('.ccs .cc-ex'); await page.waitForTimeout(250);
  await page.selectOption('.ccs .cc-lay', 'col'); await page.fill('.ccs .cc-n', '4'); await page.waitForTimeout(250);
  check((await facts()).includes('n = 4') && (await facts()).includes('1 value at the end'), 'cc: one-column layout in subgroups of 4');
  await page.fill('.ccs .cc-usl', ''); await page.waitForTimeout(200);
  check((await cap()).includes('needs both limits'), 'cc: one-sided spec');
  await page.fill('.ccs .cc-usl', '498'); await page.waitForTimeout(200);
  check((await page.textContent('.ccs .cc-err')).includes('upper spec limit must be above'), 'cc: bad spec message');
  await kind('p'); await page.fill('.ccs .cc-data', '5\t100\n120\t100\n3\t100\n4\t100\n2\t100'); await page.waitForTimeout(200);
  check((await page.textContent('.ccs .cc-err')).includes('cannot be more than the sample size'), 'cc: defectives above sample size message');
};
