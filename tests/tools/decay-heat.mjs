// #679 decay heat estimator
export const path = '/science/decay-heat/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/decay-heat/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.dht .dh-big'), facts = () => page.textContent('.dht .dh-facts');
  check((await big()) === '1 hour after shutdown: 30.37\u00a0MW (1.012 % of P₀)', `decay heat: example (${await big()})`);
  { const t = await facts(); check(t.includes('111.8\u00a0MW') && t.includes('13.31\u00a0MW') && t.includes('0.4438 %') && t.includes('after 1.05 hours') && t.includes('435\u00a0MWh') && t.includes('1,565\u00a0GJ') && t.includes('365 days'), 'decay heat: facts'); }
  { const t = await page.textContent('.dht .dh-tab'); check(t.includes('1 second *') && t.includes('48.4\u00a0t') && t.includes('1 year *') && !t.includes('1 hour *'), 'decay heat: heat table with validity marks'); }
  { const t = await page.textContent('.dht .dh-etab'); check(t.includes('1,309\u00a0MWh') && t.includes('Yours: 1 day to 7 days'), 'decay heat: energy table and own interval'); }
  check(await page.isVisible('.dht .dh-fig') && await page.isVisible('.dht .dh-efig'), 'decay heat: both charts');
  await page.selectOption('.dht .dh-Tu', 'inf'); await page.waitForTimeout(200);
  check((await big()).includes('(1.209 % of P₀)') && await page.isDisabled('.dht .dh-T') && (await facts()).includes('equilibrium'), `decay heat: very long operation (${await big()})`);
  await page.selectOption('.dht .dh-Tu', '3600'); await page.fill('.dht .dh-T', '1'); await page.waitForTimeout(200);
  check((await big()).includes('(0.1565 % of P₀)'), `decay heat: one hour of operation (${await big()})`);
  await page.selectOption('.dht .dh-Tu', '86400'); await page.fill('.dht .dh-T', '365'); await page.fill('.dht .dh-lv', '0.1'); await page.waitForTimeout(200);
  check(/Falls below 0.1 %after [\d.]+ (days|years)/.test(await facts()), 'decay heat: time below 0.1 %');
  await page.fill('.dht .dh-a', '0'); await page.fill('.dht .dh-b', '60'); await page.selectOption('.dht .dh-iu', '60'); await page.waitForTimeout(200);
  check((await page.textContent('.dht .dh-etab')).includes('Yours: 0 to 1 hour'), 'decay heat: own interval in minutes');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dht .dh-csv')]); const f = OUT + 'dh.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('seconds_after_shutdown,fraction_of_P0') && rows.length > 140 && rows[1].startsWith('1,'), 'decay heat: CSV'); }
  await page.fill('.dht .dh-lv', '10'); await page.waitForTimeout(200);
  check((await page.textContent('.dht .dh-err')).includes('6.22 %') && await page.isHidden('.dht .dh-out'), 'decay heat: level above the formula refused');
  await page.fill('.dht .dh-lv', '1'); await page.fill('.dht .dh-b', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.dht .dh-err')).includes('later than'), 'decay heat: bad interval message');
  await page.fill('.dht .dh-b', '7'); await page.fill('.dht .dh-p', 'x'); await page.waitForTimeout(200);
  check((await page.textContent('.dht .dh-err')).includes('thermal power'), 'decay heat: bad power message');
  await page.fill('.dht .dh-p', '3000'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dht .dl [data-f=docx]')]); const f = OUT + 'dh.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'decay heat: Word report'); }
};
