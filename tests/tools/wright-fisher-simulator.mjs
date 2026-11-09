// #310 Wright-Fisher simulator
export const path = '/science/wright-fisher-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.wfs ';
  await page.goto(`${BASE}/science/wright-fisher-simulator/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.wf-big'), facts = () => page.textContent(R + '.wf-facts');
  check((await big()) === 'Fixed in 200 of 1,000 lines (20 %); Kimura 21 %', `wright-fisher: example result (${await big()})`);
  { const f = await facts(); check(f.includes('17.6 % to 22.6 %') && f.includes('all lines finished by generation 786') && f.includes('4Ns = 4'), 'wright-fisher: example facts'); }
  check(await page.isVisible(R + '.wf-fig') && await page.isVisible(R + '.wf-cum'), 'wright-fisher: both figures');
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(500); };
  await set('.wf-s', '0');
  check((await big()).startsWith('Fixed in 89 of 1,000') && (await facts()).includes('neutral theory: 189.6'), 'wright-fisher: neutral run');
  await set('.wf-s', '0.02');
  // Same seed gives the same result again; a new seed changes it.
  check((await big()).startsWith('Fixed in 200 of'), 'wright-fisher: same seed repeats');
  await page.locator(R + '.wf-new').scrollIntoViewIfNeeded(); await page.click(R + '.wf-new'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.wf-seed')) !== '1', 'wright-fisher: new seed');
  await set('.wf-seed', '1');
  await set('.wf-h', '0');
  check((await big()).includes('Kimura 16.6 %'), `wright-fisher: recessive h = 0 (${await big()})`);
  await set('.wf-h', '0.5');
  await page.selectOption(R + '.wf-start', 'one'); await page.waitForTimeout(500);
  check(await page.isHidden(R + '.wf-pbox') && (await facts()).includes('1 of 100') && (await big()).includes('Kimura 2.29 %'), `wright-fisher: one new copy (${await big()})`);
  await page.selectOption(R + '.wf-start', 'freq'); await page.waitForTimeout(400);
  await page.locator(R + '.wf-until').scrollIntoViewIfNeeded(); await page.click(R + '.wf-until'); await page.waitForTimeout(500);
  check((await facts()).includes('after 200 generations') && !(await facts()).includes('work limit'), 'wright-fisher: stop at the set generations');
  await set('.wf-r', '20');
  check((await page.textContent(R + '.wf-fighelp')).startsWith('All 20 lines are drawn'), 'wright-fisher: fewer lines');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.wf-csv')]); const f = OUT + 'wf-gen.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 202 && rows[0].startsWith('generation,mean frequency,share fixed,share lost,line 1') && rows[1].startsWith('0,0.1,0,0,0.1'), `wright-fisher: generations CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.wf-fcsv')]); const f = OUT + 'wf-lines.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 21 && rows[0] === 'line,final frequency,outcome' && rows.slice(1).every((r) => /^(\d+),[\d.e-]+,(fixed|lost|segregating)$/.test(r)), 'wright-fisher: lines CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'wf.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'wright-fisher: PDF report'); }
  // Bad input
  await set('.wf-n', '1');
  check((await page.textContent(R + '.wf-err')).includes('from 2 to 100,000') && await page.isHidden(R + '.wf-out'), 'wright-fisher: bad N message');
  await set('.wf-n', '50'); await set('.wf-p', '1');
  check((await page.textContent(R + '.wf-err')).includes('between 0 and 1'), 'wright-fisher: bad frequency message');
  await set('.wf-p', '0.1'); await set('.wf-s', '-2');
  check((await page.textContent(R + '.wf-err')).includes('above −1'), 'wright-fisher: bad s message');
  await set('.wf-s', '0.02'); await set('.wf-r', '10000'); await set('.wf-g', '5000');
  check((await page.textContent(R + '.wf-err')).includes('20 million'), 'wright-fisher: work limit message');
  await set('.wf-g', '200'); await set('.wf-p', '0.001');
  check((await page.textContent(R + '.wf-err')).includes('rounds to 0'), 'wright-fisher: frequency below one copy');
  await set('.wf-p', '0.1');
  check(await page.isHidden(R + '.wf-err') && await page.isVisible(R + '.wf-out'), 'wright-fisher: recovers');
};
