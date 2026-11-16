// #T908 Fleet fuel
export const path = '/vehicles/fleet-fuel/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/fleet-fuel/`); await page.waitForTimeout(300);
  await page.setInputFiles('.ff .ff-file', 'tests/fixtures/fleet-fuel.csv'); await page.waitForTimeout(400);
  const big = () => page.textContent('.ff .ff-big'), flags = () => page.textContent('.ff .ff-flags'), sum = () => page.textContent('.ff .ff-sum');
  const set = async (k, v) => { await page.fill(`.ff [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // TRK-1: 3,760 km on 1,000 L = 3.76 km/L, 1,200 / 3,760 = 0.319 a km. Stretches 4,4,4,4,2.8: last is 30% under the median 4.
  check((await big()).startsWith('12 fills, 3 vehicles, 3 flags'), `fleet-fuel: 12 fills, 3 flags (${await big()})`);
  check((await sum()).includes('3.76') && (await sum()).includes('0.319'), 'fleet-fuel: TRK-1 3.76 km/L and 0.319 a km');
  check((await flags()).includes('TRK-2') && (await flags()).includes('Bigger than the tank') && (await flags()).includes('400 in a 300 tank'), 'fleet-fuel: 400 L fill in a 300 L tank is flagged');
  check((await flags()).includes('TRK-3') && (await flags()).includes('close together'), 'fleet-fuel: two fills 20 km apart flagged');
  check((await flags()).includes('TRK-1') && (await flags()).includes('30% under'), 'fleet-fuel: TRK-1 economy 30% under usual flagged');
  await set('tank', '500');
  check(!(await flags()).includes('Bigger than the tank'), 'fleet-fuel: a bigger tank clears the tank flag');
  await set('worse', '40');
  check(!(await flags()).includes('under the usual'), 'fleet-fuel: a looser economy limit clears the economy flag');
  await set('close', '10');
  check(!(await flags()).includes('close together') && (await big()).includes('0 flags'), 'fleet-fuel: smaller closeness limit clears the last flag');
  check((await page.$$('.ff .ff-charts svg')).length >= 1, 'fleet-fuel: a chart is drawn');
  // Fleet totals, sort, what-if, CSV out. Fleet: 5,780 km, 1,815 L = 3.18 km/L, 2,178 / 5,780 = 0.377 a km, 1.200 a litre.
  check(/5,780 km, 1,815\.0 litres, 3\.18 km\/L, 0\.377 per km, about 1\.200 per litre/.test(await page.textContent('.ff .ff-fleet')), `fleet-fuel: whole-fleet line (${await page.textContent('.ff .ff-fleet')})`);
  check((await page.textContent('.ff .ff-total')).includes('Fleet') && (await page.textContent('.ff .ff-total')).includes('5,780'), 'fleet-fuel: fleet total row');
  // TRK-2 is 2.31 km/L, below the middle 3.15: 1,500/2.3077 - 1,500/3.1515 = 174 L; at 1.20 = 209
  check(/about 174 litres less/.test(await page.textContent('.ff .ff-whatif')) && /about 209/.test(await page.textContent('.ff .ff-whatif')), `fleet-fuel: what-if (${await page.textContent('.ff .ff-whatif')})`);
  await page.selectOption('.ff [data-k="sort"]', 'best'); await page.waitForTimeout(100);
  check((await page.$$eval('.ff .ff-sum tr td:first-child', (e) => e.map((x) => x.textContent))).join() === 'TRK-1,TRK-3,TRK-2', 'fleet-fuel: best economy first');
  await page.selectOption('.ff [data-k="sort"]', 'worst'); await page.waitForTimeout(100);
  check((await page.$$eval('.ff .ff-sum tr td:first-child', (e) => e[0].textContent)) === 'TRK-2', 'fleet-fuel: worst economy first');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.ff .ff-dl-sum')]);
  check(dl.suggestedFilename() === 'fleet-fuel-summary.csv', 'fleet-fuel: summary CSV downloads');
};
