// #970 GPS relativity explainer
export const path = '/science/gps-relativity/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.gpr ';
  const big = () => page.textContent(R + '.gp-big'), facts = () => page.textContent(R + '.gp-facts'), err = () => page.textContent(R + '.gp-err');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(300); };
  await page.goto(`${BASE}/science/gps-relativity/`); await page.waitForTimeout(800);
  check((await big()) === 'Satellite clock gains 38.6 µs per day', 'gps: example result');
  { const f = await facts(); check(f.includes('+45.72 µs/day') && f.includes('−7.11 µs/day') && f.includes('+38.61 µs/day') && f.includes('10.22999999543 MHz') && f.includes('11.6 km per day') && f.includes('482 m per hour') && f.includes('±22.9 ns') && f.includes('±6.86 m') && f.includes('9540 km radius'), 'gps: all the numbers'); }
  check(await page.isVisible(R + '.gp-fig') && await page.isVisible(R + '.gp-efig'), 'gps: charts');
  await page.selectOption(R + '.gp-pre', '6780'); await page.waitForTimeout(300);
  check((await big()) === 'Satellite clock loses 24.5 µs per day' && (await page.inputValue(R + '.gp-a')) === '6780', 'gps: low orbit loses time');
  await page.selectOption(R + '.gp-pre', '42164'); await page.waitForTimeout(300); check((await big()) === 'Satellite clock gains 46.6 µs per day', 'gps: geostationary');
  await page.selectOption(R + '.gp-pre', '29600'); await page.waitForTimeout(300); check((await big()) === 'Satellite clock gains 40.8 µs per day', 'gps: Galileo');
  await set('.gp-a', '30000'); check((await page.inputValue(R + '.gp-pre')) === '', 'gps: typed radius switches to custom');
  await set('.gp-a', '26560'); await set('.gp-lat', '45'); await set('.gp-h', '1000'); check((await facts()).includes('+38.55 µs/day'), 'gps: receiver latitude and height');
  await set('.gp-lat', '0'); await set('.gp-h', '0'); await set('.gp-e', '0'); check((await facts()).includes('none (circular)') && await page.isHidden(R + '.gp-efig'), 'gps: circular orbit');
  await set('.gp-e', '0.01'); await set('.gp-f', '1'); check((await facts()).includes('0.99999999955'), 'gps: other clock frequency');
  await set('.gp-f', '10.23');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gp-csv')]); const f = OUT + 'gps.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 202 && rows[0].startsWith('orbit radius (km)') && rows[1].startsWith('6500,'), 'gps: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'gps.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'gps: image report'); }
  await set('.gp-a', '5000'); check((await err()).includes('at least 6,500 km') && await page.isHidden(R + '.gp-out'), 'gps: radius too small message');
  await set('.gp-a', '7000'); await set('.gp-e', '0.5'); check((await err()).includes('dips into the atmosphere'), 'gps: eccentric orbit hits the atmosphere');
  await set('.gp-a', '26560'); await set('.gp-e', '0.01'); await set('.gp-lat', '100'); check((await err()).includes('latitude'), 'gps: bad latitude message');
  await set('.gp-lat', '0'); check((await big()) === 'Satellite clock gains 38.6 µs per day', 'gps: back to the example');
};
