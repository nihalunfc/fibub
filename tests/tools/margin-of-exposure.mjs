// #476 margin of exposure
export const path = '/science/margin-of-exposure/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/margin-of-exposure/`); await page.waitForTimeout(500);
  const R = '.moe';
  const big = () => page.textContent(`${R} .moe-big`), tab = () => page.textContent(`${R} .moe-tab`), facts = () => page.textContent(`${R} .moe-facts`);
  check((await page.textContent(`${R} .moe-med`)).includes('not medical advice'), 'moe: medical line at the top');
  check((await big()) === 'Lowest MOE 400 (Child, high consumer)', 'moe: example lowest MOE');
  { const t = await tab(); check(t.includes('2100') && t.includes('700') && t.includes('0.000143') && t.includes('200'), 'moe: example table (MOE 2100, 700, 400; child meets target at 200 µg/kg)'); }
  { const f = await facts(); check(f.includes('Target MOE100') && f.includes('0.003 mg/kg bw/day') && f.includes('0 of 3'), 'moe: target 100 and tolerable exposure'); }
  check(await page.isVisible(`${R} .moe-fig`), 'moe: chart drawn');
  await page.locator(`${R} .moe-10k`).scrollIntoViewIfNeeded(); await page.click(`${R} .moe-10k`); await page.waitForTimeout(200);
  check((await facts()).includes('3 of 3') && (await page.$$(`${R} td.below`)).length === 3, 'moe: 10 000 target, none met');
  await page.click(`${R} .moe-100`); await page.waitForTimeout(200);
  check((await facts()).includes('0 of 3'), 'moe: back to 100');
  await page.fill(`${R} .moe-uf`, 'Between species 10\nWithin humans 10\nLOAEL to NOAEL 5'); await page.waitForTimeout(400);
  check((await facts()).includes('Target MOE500') && (await facts()).includes('1 of 3'), 'moe: own factors (500)');
  await page.selectOption(`${R} .moe-du`, 'µg/kg bw/day'); await page.waitForTimeout(200);
  check((await big()) === 'Lowest MOE 0.4 (Child, high consumer)', 'moe: POD unit µg/kg bw/day');
  await page.selectOption(`${R} .moe-du`, 'mg/kg bw/day'); await page.selectOption(`${R} .moe-cu`, 'mg/kg'); await page.waitForTimeout(200);
  check((await big()) === 'Lowest MOE 0.4 (Child, high consumer)', 'moe: concentration unit mg/kg');
  await page.selectOption(`${R} .moe-cu`, 'µg/L'); await page.selectOption(`${R} .moe-iu`, 'L/day'); await page.fill(`${R} .moe-data`, 'Drinking water, adult\t2\t2\t70\nDrinking water, infant\t2\t0.8\t5'); await page.waitForTimeout(400);
  check((await big()) === 'Lowest MOE 937 (Drinking water, infant)', 'moe: water in µg/L and L/day');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .moe-csv`)]); const f = OUT + 'moe.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 3 && rows[0].startsWith('Scenario,Concentration (µg/L)') && rows[2].startsWith('"Drinking water, infant",2,0.8,5'), 'moe: CSV download'); }
  writeFileSync(OUT + 'moe-in.csv', 'name,conc,intake,bw\nFish,30,100,60\n');
  await page.setInputFiles(`${R} .dfb-in`, OUT + 'moe-in.csv'); await page.waitForTimeout(600);
  check((await big()).includes('(Fish)'), 'moe: open a CSV file');
  await page.fill(`${R} .moe-data`, 'Bad row, 1, 2'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .moe-err`)).includes('needs a name, then concentration') && await page.isHidden(`${R} .moe-out`), 'moe: bad scenario message');
  await page.fill(`${R} .moe-data`, 'A\t1\t1\t60'); await page.fill(`${R} .moe-uf`, 'Species 0.5'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .moe-err`)).includes('1 or more'), 'moe: bad factor message');
  await page.fill(`${R} .moe-uf`, 'Species 10'); await page.fill(`${R} .moe-pod`, ''); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .moe-err`)).includes('point of departure'), 'moe: missing POD message');
  await page.fill(`${R} .moe-pod`, '0.3'); await page.waitForTimeout(400);
  for (const [f, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    await page.locator(`${R} .dl button[data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=${f}]`)]);
    const p = OUT + 'moe.' + ext; await d.saveAs(p);
    check(readFileSync(p).length > 2000 && d.suggestedFilename().endsWith('.' + ext), `moe: ${f} download`);
  }
};
