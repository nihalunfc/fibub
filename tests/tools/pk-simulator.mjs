// #473 pharmacokinetics simulator (teaching)
export const path = '/science/pk-simulator/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/pk-simulator/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.pks .pks-big'), facts = () => page.textContent('.pks .pks-facts');
  check((await page.textContent('.pks .pks-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'pksim: medical note shown');
  check((await big()) === 'At steady state: Cmax 4.612 mg/L, Cmin 1.916 mg/L', `pksim: example steady state (${await big()})`);
  { const f = await facts(); check(f.includes('2.16 h after each') && f.includes('3.333 mg/L') && f.includes('AUCτ 40 mg·h/L') && f.includes('1.503') && f.includes('1.489') && f.includes('80.9 %') && f.includes('Cmax 3.097 mg/L') && f.includes('at 2.56 h') && f.includes('6.93 h') && f.includes('about 1.9 intervals'), 'pksim: example facts match the guide'); }
  check(await page.isHidden('.pks .pks-q') && await page.isVisible('.pks .pks-ka') && await page.isHidden('.pks .pks-tinf'), 'pksim: one-compartment oral fields');
  check(!(await page.content()).match(/target concentration|dose needed|recommended dose/i), 'pksim: no dose-finding feature');
  // Presets.
  await page.selectOption('.pks .pks-preset', 'b'); await page.waitForTimeout(200);
  check((await big()) === 'At steady state: Cmax 5.029 mg/L, Cmin 1.545 mg/L' && (await facts()).includes('0.743 h, 10.3 h') && (await facts()).includes('2.500 mg/L') && await page.isVisible('.pks .pks-q') && await page.isVisible('.pks .pks-tinf'), `pksim: two-compartment infusion preset (${await big()})`);
  await page.selectOption('.pks .pks-preset', 'c'); await page.waitForTimeout(200);
  check((await big()) === 'At steady state: Cmax 7.264 mg/L, Cmin 3.264 mg/L' && (await facts()).includes('1.816'), `pksim: bolus preset, R = 1/(1−e^(−kτ)) (${await big()})`);
  // Model switch by hand.
  await page.selectOption('.pks .pks-comp', '2'); await page.waitForTimeout(200);
  check((await page.textContent('.pks .pks-vl')) === 'Central volume V1 (L)' && (await facts()).includes('Half-lives (α, β)'), 'pksim: two-compartment switch');
  await page.selectOption('.pks .pks-comp', '1'); await page.waitForTimeout(200);
  // Log axis.
  await page.locator('.pks .pks-scale button[data-s=log]').scrollIntoViewIfNeeded(); await page.click('.pks .pks-scale button[data-s=log]'); await page.waitForTimeout(100);
  check((await page.getAttribute('.pks .pks-scale button[data-s=log]', 'aria-pressed')) === 'true' && await page.isVisible('.pks .pks-fig'), 'pksim: log axis');
  // Changing the regimen.
  await page.fill('.pks .pks-tau', '3'); await page.fill('.pks .pks-amt', '60'); await page.waitForTimeout(500);
  check((await facts()).includes('Average at steady state5 mg/L') && Number((await facts()).match(/Accumulation ratio([\d.]+)/)[1]) > 3, 'pksim: shorter interval accumulates more');
  // CSV.
  { await page.locator('.pks .pks-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pks .pks-csv')]); const f = OUT + 'pks.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_h,concentration_mg_per_L' && rows.length > 1200 && rows[1].startsWith('0,'), `pksim: curve CSV (${rows.length} rows)`); }
  { await page.locator('.pks .dl button[data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pks .dl button[data-f=png]')]); check(d.suggestedFilename() === 'pk-simulation.png', 'pksim: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pks .dl button[data-f=docx]')]); check(d.suggestedFilename() === 'pk-simulation.docx', 'pksim: Word report'); }
  // Bad input.
  await page.selectOption('.pks .pks-route', 'infusion'); await page.fill('.pks .pks-tinf', '5'); await page.waitForTimeout(400);
  check((await page.textContent('.pks .pks-err')).includes('must end before the next one') && await page.isHidden('.pks .pks-out'), 'pksim: infusion longer than interval');
  await page.selectOption('.pks .pks-route', 'oral'); await page.fill('.pks .pks-f', '1.4'); await page.waitForTimeout(400);
  check((await page.textContent('.pks .pks-err')).includes('fraction absorbed'), 'pksim: F above 1 message');
  await page.fill('.pks .pks-f', '0.8'); await page.fill('.pks .pks-cl', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.pks .pks-err')).includes('Clearance and volume'), 'pksim: zero clearance message');
  await page.fill('.pks .pks-cl', '4'); await page.fill('.pks .pks-n', '2.5'); await page.waitForTimeout(400);
  check((await page.textContent('.pks .pks-err')).includes('whole number'), 'pksim: number of administrations message');
};
