// #683 Traffic flow fundamentals
export const path = '/science/traffic-flow/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/traffic-flow/`); await page.waitForTimeout(1000);
  const big = () => page.textContent('.tqf .tq-big'), tab = () => page.textContent('.tqf .tq-tab'), obig = () => page.textContent('.tqf .tq-obig'), ofacts = () => page.textContent('.tqf .tq-ofacts');
  const wait = () => page.waitForTimeout(400);
  check((await big()) === 'Capacity 2,923 veh/h at 60.7 veh/km and 48.2 km/h (Greenshields)', 'traffic: example capacity (best fit Greenshields)');
  { const t = await tab(); check(t.includes('Greenshields (best)96.3121.460.748.22,9230.99080.99082.32') && t.includes('Greenberg∞233.685.931.62,713') && t.includes('Underwood123.3∞56.045.32,539'), 'traffic: three models in the table'); }
  check(await page.isVisible('.tqf .tq-vk') && await page.isVisible('.tqf .tq-qk') && await page.isVisible('.tqf .tq-vq'), 'traffic: three fundamental diagrams');
  check((await obig()) === 'LOS D: 76.5 km/h, 1,912 veh/h' && (await ofacts()).includes('spacing 40.0 m, headway 1.88 s'), 'traffic: operating point at 25 veh/km');
  await page.selectOption('.tqf .tq-given', 'q'); await wait();
  check((await obig()) === 'LOS E: 75.2 km/h, 2,000 veh/h · or · LOS F: 21.1 km/h, 2,000 veh/h' && (await ofacts()).includes('Congested state'), 'traffic: two states for 2000 veh/h');
  await page.fill('.tqf .tq-g', '3500'); await wait();
  check((await page.textContent('.tqf .tq-oerr')).includes('above the capacity of 2,923'), 'traffic: flow above capacity message');
  await page.selectOption('.tqf .tq-given', 'v'); await wait();
  check((await obig()) === 'LOS F: 60.0 km/h, 2,747 veh/h' && (await ofacts()).includes('density 45.8 veh/km'), 'traffic: given a speed of 60 km/h');
  await page.selectOption('.tqf .tq-given', 'k'); await wait();
  // Other models.
  await page.selectOption('.tqf .tq-m', 'greenberg'); await wait();
  check((await big()) === 'Capacity 2,713 veh/h at 85.9 veh/km and 31.6 km/h (Greenberg)', 'traffic: Greenberg selected');
  await page.selectOption('.tqf .tq-m', 'underwood'); await wait();
  check((await big()) === 'Capacity 2,539 veh/h at 56.0 veh/km and 45.3 km/h (Underwood)', 'traffic: Underwood selected');
  await page.selectOption('.tqf .tq-m', 'own'); await wait();
  check((await big()) === 'Capacity 3,000 veh/h at 60.0 veh/km and 50.0 km/h (Greenshields, your values)' && await page.isVisible('.tqf .tq-vf'), 'traffic: own Greenshields values 100 km/h, 120 veh/km');
  await page.fill('.tqf .tq-vf', '0'); await wait();
  check((await page.textContent('.tqf .tq-err')).includes('free-flow speed and a jam density above 0') && (await big()).endsWith('(Greenshields)'), 'traffic: bad own values message, best fit shown meanwhile');
  await page.fill('.tqf .tq-vf', '100'); await page.selectOption('.tqf .tq-m', 'best'); await wait();
  // LOS limits.
  await page.locator('.tqf .tq-l').nth(3).fill('40'); await wait();
  check((await obig()) === '' && (await page.textContent('.tqf .tq-oerr')).includes('rising from A to E'), 'traffic: LOS limits must rise');
  await page.locator('.tqf .tq-l').nth(3).fill('22'); await wait();
  check((await obig()).startsWith('LOS E:'), 'traffic: changed limit gives LOS E');
  await page.locator('.tqf .tq-l').nth(3).fill('26'); await wait();
  // Units.
  await page.selectOption('.tqf .tq-u', 'us'); await wait();
  check((await page.inputValue('.tqf .tq-l >> nth=0')) === '12.9' && (await big()).includes('veh/mi') && (await big()).includes('mi/h'), 'traffic: US units relabel and convert the LOS limits');
  await page.selectOption('.tqf .tq-u', 'si'); await wait();
  // Layouts: flow, speed.
  const ex = await page.inputValue('.tqf .tq-data');
  const rows = ex.trim().split('\n').slice(1).map((l) => l.split('\t').map(Number));
  await page.fill('.tqf .tq-data', 'flow\tspeed\n' + rows.map(([k, v]) => `${(k * v).toFixed(2)}\t${v}`).join('\n')); await page.selectOption('.tqf .tq-lay', 'qv'); await wait();
  check((await big()) === 'Capacity 2,923 veh/h at 60.7 veh/km and 48.2 km/h (Greenshields)', 'traffic: flow and speed columns');
  writeFileSync(OUT + 'kq.csv', 'density,flow\n' + rows.map(([k, v]) => `${k},${(k * v).toFixed(2)}`).join('\n'));
  await page.selectOption('.tqf .tq-lay', 'kq'); await page.setInputFiles('.tqf .dfb-in', OUT + 'kq.csv'); await page.waitForTimeout(1000);
  check((await big()) === 'Capacity 2,923 veh/h at 60.7 veh/km and 48.2 km/h (Greenshields)', 'traffic: density and flow columns, opened as a file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tqf .tq-csv')]); const f = OUT + 'tf.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 20 && r[0].startsWith('Model,Free-flow speed') && r[1].startsWith('Greenshields (best)'), 'traffic: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tqf .dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'traffic-flow.png', 'traffic: report image'); }
  // Bad input.
  await page.selectOption('.tqf .tq-lay', 'kv'); await page.fill('.tqf .tq-data', '10\t80\n20\t70'); await wait();
  check((await page.textContent('.tqf .tq-err')).includes('at least 3 rows') && await page.isHidden('.tqf .tq-out'), 'traffic: too few rows');
  await page.fill('.tqf .tq-data', '10\t60\n20\t70\n30\t80'); await wait();
  check((await page.textContent('.tqf .tq-err')).includes('does not fall with density'), 'traffic: rising speed message');
};
