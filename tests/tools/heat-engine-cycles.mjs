// #917 heat engine cycles
export const path = '/science/heat-engine-cycles/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/heat-engine-cycles/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.hec .he-big'), facts = () => page.textContent('.hec .he-facts');
  check((await big()) === 'Efficiency 56.5 % (Carnot limit 83.3 %)', 'cycles: example Otto efficiency');
  { const f = await facts(); check(f.includes('450.1 kJ/kg') && f.includes('797 kJ/kg') && f.includes('346.9 kJ/kg') && f.includes('597.4 kPa') && f.includes('4800 kPa'), 'cycles: Otto work, heats, MEP and peak pressure'); }
  { const t = await page.textContent('.hec .he-st'); check(t.includes('689.2') && t.includes('783.5') && t.includes('0.861'), 'cycles: Otto state table'); }
  { const t = await page.textContent('.hec .he-pr'); check(t.includes('constant volume') && t.includes('isentropic') && t.includes('797'), 'cycles: Otto process table'); }
  check(await page.isVisible('.hec .he-pv') && await page.isVisible('.hec .he-ts') && await page.isHidden('.hec .he-rc'), 'cycles: both diagrams, Diesel-only field hidden');
  await page.click('.hec .he-seg [data-c=diesel]'); await page.waitForTimeout(150);
  check((await big()).startsWith('Efficiency 49 %') && await page.isVisible('.hec .he-rc') && (await facts()).includes('339.5 kJ/kg'), 'cycles: Diesel r 8 rc 2');
  await page.click('.hec .he-seg [data-c=brayton]'); await page.waitForTimeout(150);
  check((await big()).startsWith('Efficiency 48.2 %') && (await facts()).includes('Back work ratio32.2 %'), 'cycles: Brayton rp 10 with back work ratio');
  await page.click('.hec .he-seg [data-c=carnot]'); await page.waitForTimeout(150);
  check((await big()) === 'Efficiency 83.3 % (Carnot limit 83.3 %)' && (await facts()).includes('473 kJ/kg'), 'cycles: Carnot equals its limit');
  await page.click('.hec .he-seg [data-c=stirling]'); await page.waitForTimeout(150);
  check((await big()).startsWith('Efficiency 83.3 %'), 'cycles: Stirling with an ideal regenerator');
  await page.fill('.hec .he-eps', '50'); await page.waitForTimeout(150);
  check((await big()).startsWith('Efficiency 55.5 %') && (await facts()).includes('recycled by the regenerator'), 'cycles: Stirling at 50 % regenerator');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hec .he-csv')]); const f = OUT + 'cyc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 325 && rows[0].startsWith('process,P (kPa)') && d.suggestedFilename() === 'stirling-cycle.csv', 'cycles: path CSV'); }
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.hec .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `stirling-cycle.${fm}`, `cycles: ${fm} download`); }
  await page.click('.hec .he-seg [data-c=otto]'); await page.selectOption('.hec .he-gas', '2077,1.667'); await page.waitForTimeout(150);
  check((await big()).startsWith('Efficiency 75 %') && (await page.inputValue('.hec .he-k')) === '1.667', 'cycles: helium gas preset');
  await page.fill('.hec .he-k', '1.4'); await page.waitForTimeout(100);
  check((await page.inputValue('.hec .he-gas')) === 'custom', 'cycles: typed gas switches to Other');
  await page.fill('.hec .he-Tm', '500'); await page.waitForTimeout(150);
  check((await page.textContent('.hec .he-err')).includes('end-of-compression temperature') && await page.isHidden('.hec .he-out'), 'cycles: peak below compression temperature message');
  await page.fill('.hec .he-Tm', '1800'); await page.click('.hec .he-seg [data-c=diesel]'); await page.fill('.hec .he-rc', '9'); await page.waitForTimeout(150);
  check((await page.textContent('.hec .he-err')).includes('less than the compression ratio'), 'cycles: cut-off ratio too large message');
  await page.fill('.hec .he-rc', '2'); await page.fill('.hec .he-k', '3'); await page.waitForTimeout(150);
  check((await page.textContent('.hec .he-err')).includes('between 1 and 2'), 'cycles: bad gamma message');
};
