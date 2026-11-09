// #688 pressure buildup analyser
export const path = '/science/well-test-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/well-test-analyser/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.wta .wt-big'), facts = () => page.textContent('.wta .wt-facts');
  const set = async (s, v) => { await page.fill(`.wta ${s}`, v); await page.waitForTimeout(150); };
  check((await big()) === 'k = 35.04 md, skin = +3.01, p* = 4167.21 psia', 'welltest: example headline');
  { const f = await facts(); check(f.includes('Δt 0.0126 to 10 h') && f.includes('31.32 psi/cycle') && f.includes('1402 md·ft') && f.includes('+3.006') && f.includes('81.81 psi') && f.includes('74.5 %') && f.includes('1231 ft') && f.includes('13.60 psi'), 'welltest: example facts'); }
  check(await page.isVisible('.wta .wt-sfig') && await page.isVisible('.wta .wt-dfig'), 'welltest: Horner and log-log plots');
  await page.selectOption('.wta .wt-m', 'mdh'); await page.waitForTimeout(150);
  check((await big()).startsWith('k = 35.12 md, skin = +3.02') && !(await big()).includes('p*') && (await facts()).includes('Horner only'), 'welltest: MDH');
  await page.selectOption('.wta .wt-m', 'horner');
  await set('.wt-a', '0.1'); await set('.wt-z', '5');
  { const f = await facts(); check(f.includes('your range') && f.includes('Δt 0.1 to 3.98 h'), 'welltest: manual range ' + f.slice(0, 80)); }
  await set('.wt-a', '20'); await set('.wt-z', '100');
  check(Number((await big()).match(/k = ([\d.]+)/)[1]) < 25, 'welltest: a line through the fault-affected points gives a lower k');
  await set('.wt-a', '5'); await set('.wt-z', '1');
  check((await page.textContent('.wta .wt-err')).includes('"from" smaller than "to"'), 'welltest: bad range message');
  await set('.wt-a', ''); await set('.wt-z', '');
  await page.selectOption('.wta .wt-l', '0.5'); await page.waitForTimeout(150);
  check((await facts()).includes('picked automatically'), 'welltest: more smoothing still finds radial flow');
  await page.selectOption('.wta .wt-l', '0.2');
  await set('.wt-pwf', '3800');
  check((await page.textContent('.wta .wt-facts')).includes('pwf at shut-in 3800 psia') && (await big()).includes('skin = +4'), 'welltest: typed pwf overrides the Δt = 0 row');
  await set('.wt-pwf', '');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wta .wt-csv')]); const f = OUT + 'wt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 42 && rows[0].startsWith('shut-in time (h),pws (psia),delta p') && rows[1].endsWith(',yes') === false && rows[2].endsWith(',yes'), 'welltest: CSV with derivative and line flags'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wta .dl [data-f=png]')]); check((await d.suggestedFilename()) === 'well-test.png', 'welltest: image report'); }
  await set('.wt-phi', '18');
  check((await page.textContent('.wta .wt-err')).includes('Porosity is a fraction'), 'welltest: porosity as a percent is refused');
  await set('.wt-phi', '0.18'); await set('.wt-data', '1\t100\n2\t110');
  check((await page.textContent('.wta .wt-err')).includes('at least 6 rows') && await page.isHidden('.wta .wt-out'), 'welltest: too few rows');
};
