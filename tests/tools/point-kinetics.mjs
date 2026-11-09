// #677 reactor point kinetics
export const path = '/science/point-kinetics/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/point-kinetics/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.pkn .pk-big'), facts = () => page.textContent('.pkn .pk-facts');
  check((await big()) === 'Power after 60 s: 2.342 × the start', `kinetics: +0.1 $ step (${await big()})`);
  { const t = await facts(); check(t.includes('98.72 s') && t.includes('doubles every 68.43 s') && t.includes('× 1.111') && t.includes('65 pcm'), 'kinetics: period, doubling, prompt jump, units'); }
  check((await page.textContent('.pkn .pk-tab')).includes('1.1139'), 'kinetics: table shows the prompt jump (1.114 at 0.1 s)');
  check((await page.textContent('.pkn .pk-roots')).includes('0.0101299') && await page.$$eval('.pkn .pk-roots tr', (r) => r.length) === 8, 'kinetics: seven inhour roots');
  check(await page.isVisible('.pkn .pk-fig') && await page.isVisible('.pkn .pk-rfig'), 'kinetics: power and reactivity charts');
  await page.fill('.pkn .pk-rho', '0.5'); await page.waitForTimeout(600);
  check((await big()).includes('83,554') || (await big()).includes('8.355 × 10⁴'), `kinetics: +0.5 $ (${await big()})`);
  await page.fill('.pkn .pk-rho', '-1'); await page.waitForTimeout(600);
  { const t = await facts(); check((await big()).includes('0.06451') && t.includes('−83.9 s') && t.includes('halves every'), 'kinetics: −1 $ step'); }
  await page.selectOption('.pkn .pk-u', 'pcm'); await page.waitForTimeout(300);
  check((await page.inputValue('.pkn .pk-rho')) === '-650' && (await big()).includes('0.06451'), 'kinetics: switching units converts the values');
  await page.selectOption('.pkn .pk-u', 'dollar'); await page.fill('.pkn .pk-rho', '1.2'); await page.fill('.pkn .pk-tend', '0.2'); await page.waitForTimeout(600);
  check((await facts()).includes('Prompt critical') && (await big()).includes('87.63'), `kinetics: prompt critical (${await big()})`);
  await page.fill('.pkn .pk-tend', '60'); await page.waitForTimeout(600);
  check((await big()).startsWith('Runaway'), 'kinetics: runaway stops cleanly');
  await page.selectOption('.pkn .pk-kind', 'ramp'); await page.waitForTimeout(600);
  check(await page.isVisible('.pkn .pk-rate') && await page.isHidden('.pkn .pk-rho') && (await facts()).includes('held value') && (await big()).startsWith('Power after 60 s: 19.32'), `kinetics: ramp 1 ¢/s to 30 ¢ (${await big()})`);
  await page.selectOption('.pkn .pk-kind', 'step'); await page.fill('.pkn .pk-rho', '0.2'); await page.check('.pkn .pk-scram'); await page.fill('.pkn .pk-st', '4'); await page.fill('.pkn .pk-tend', '30'); await page.waitForTimeout(600);
  check((await big()).includes('0.03026'), `kinetics: scram at 4 s (${await big()})`);
  await page.fill('.pkn .pk-sw', '2'); await page.waitForTimeout(500);
  check((await page.textContent('.pkn .pk-err')).includes('negative'), 'kinetics: positive rod worth refused');
  await page.uncheck('.pkn .pk-scram'); await page.selectOption('.pkn .pk-scale', 'lin'); await page.waitForTimeout(300);
  check(!(await page.isVisible('.pkn .pk-err')) && await page.isVisible('.pkn .pk-fig'), 'kinetics: linear plot');
  // One averaged group: β = 0.0065, λ = 0.08 /s.
  await page.fill('.pkn .pk-groups', '0.0065, 0.08'); await page.waitForTimeout(600);
  check((await page.$$eval('.pkn .pk-roots tr', (r) => r.length)) === 3, 'kinetics: one-group data gives two inhour roots');
  await page.fill('.pkn .pk-groups', '0.0065'); await page.waitForTimeout(600);
  check((await page.textContent('.pkn .pk-err')).includes('λ above 0'), 'kinetics: bad group message');
  await page.click('.pkn .pk-reset'); await page.waitForTimeout(500);
  check((await page.inputValue('.pkn .pk-groups')).startsWith('0.0002145, 0.0124') && (await page.textContent('.pkn .pk-facts')).includes('0.0065'), 'kinetics: reset to U-235 values');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pkn .pk-csv')]); const f = OUT + 'pk.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length > 402 && rows.length < 420 && rows[0] === 'time_s,rho_dollars,n_relative,C1,C2,C3,C4,C5,C6', 'kinetics: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pkn .dl [data-f=png]')]); const f = OUT + 'pk.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'kinetics: image report'); }
};
