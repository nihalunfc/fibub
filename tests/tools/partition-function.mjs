// #919 partition function explorer
export const path = '/science/partition-function/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/partition-function/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.pfx .pf-big'), facts = () => page.textContent('.pfx .pf-facts');
  check((await big()) === 'Z = 3.278 at 300 K', 'partition: example Z');
  { const f = await facts(); check(f.includes('208.5 cm⁻¹') && f.includes('144.7 cm⁻¹') && f.includes('1.731 kJ/mol') && f.includes('1.881 kB') && f.includes('15.64 J/(mol·K)') && f.includes('0.5853 kB') && f.includes('4.867 J/(mol·K)'), 'partition: example U, S, Cv'); }
  { const t = await page.textContent('.pfx .pf-tab'); check(t.includes('0.305') && t.includes('0.5147') && t.includes('0.1762') && t.includes('0.004072'), 'partition: example populations'); }
  check(await page.isVisible('.pfx .pf-warn') && (await page.textContent('.pfx .pf-warn')).includes('0.407 %'), 'partition: truncation warning');
  check(await page.isVisible('.pfx .pf-fp') && await page.isVisible('.pfx .pf-fc') && await page.isVisible('.pfx .pf-fs'), 'partition: three charts');
  await page.selectOption('.pfx .pf-k', 'rot'); await page.fill('.pfx .pf-sp', '10'); await page.fill('.pfx .pf-n', '40'); await page.click('.pfx .pf-make'); await page.waitForTimeout(150);
  check((await big()) === 'Z = 21.19 at 300 K' && (await facts()).includes('1 kB') && await page.isHidden('.pfx .pf-warn'), 'partition: rigid rotor preset');
  await page.selectOption('.pfx .pf-k', 'osc'); await page.fill('.pfx .pf-sp', '1000'); await page.click('.pfx .pf-make'); await page.waitForTimeout(150);
  check((await facts()).includes('0.1932 kB'), 'partition: oscillator preset nearly frozen at 300 K');
  await page.selectOption('.pfx .pf-k', 'two'); await page.fill('.pfx .pf-sp', '208.5'); await page.click('.pfx .pf-make'); await page.waitForTimeout(150);
  check((await page.inputValue('.pfx .pf-in')).split('\n').length === 2, 'partition: two-level preset');
  await page.fill('.pfx .pf-in', '0 1\n0.0258520 1'); await page.selectOption('.pfx .pf-u', 'eV'); await page.waitForTimeout(150);
  check((await facts()).includes('0.02585 eV') && (await big()).startsWith('Z = 1.368'), 'partition: eV unit, gap of kT');
  await page.selectOption('.pfx .pf-u', 'K'); await page.fill('.pfx .pf-in', '0, 2\n300, 1'); await page.waitForTimeout(150);
  check((await big()).startsWith('Z = 2.368'), 'partition: kelvin unit');
  for (const u of ['meV', 'kJmol', 'zJ']) { await page.selectOption('.pfx .pf-u', u); await page.waitForTimeout(80); check(!(await page.isVisible('.pfx .pf-err')), `partition: unit ${u}`); }
  writeFileSync(OUT + 'levels.csv', 'energy,g\n0,1\n120,3\n450,5\n900,1\n');
  await page.selectOption('.pfx .pf-u', 'cm'); await page.setInputFiles('.pfx .dfb-in', OUT + 'levels.csv'); await page.waitForTimeout(400);
  check((await big()) === 'Z = 3.278 at 300 K', 'partition: open a CSV file with a header');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pfx .pf-csv')]); const f = OUT + 'pf.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 202 && rows[0].startsWith('T (K),Z,U'), 'partition: CSV against temperature'); }
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.pfx .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `partition-function.${fm}`, `partition: ${fm} download`); }
  await page.fill('.pfx .pf-in', '0 1\nabc 2'); await page.waitForTimeout(150);
  check((await page.textContent('.pfx .pf-err')).includes('Line 2') && await page.isHidden('.pfx .pf-out'), 'partition: bad line message');
  await page.fill('.pfx .pf-in', '0 1\n100 3'); await page.fill('.pfx .pf-T', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.pfx .pf-err')).includes('above 0 K'), 'partition: zero temperature message');
  await page.fill('.pfx .pf-T', '300'); await page.fill('.pfx .pf-n', '1'); await page.click('.pfx .pf-make'); await page.waitForTimeout(150);
  check((await page.textContent('.pfx .pf-err')).includes('whole number from 2'), 'partition: bad level count message');
};
