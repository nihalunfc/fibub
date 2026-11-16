// #T902 Driving hours
export const path = '/vehicles/driving-hours/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/driving-hours/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.dh .dh-big'), br = () => page.textContent('.dh .dh-break'), out = () => page.textContent('.dh .dh-out');
  // US: driving since 06:00, now 14:00 -> break due now, 3 h left, window ends 20:00
  check((await big()).includes('3 h 00 m'), `driving-hours: US 8 h driven leaves 3 h (${await big()})`);
  check((await br()).startsWith('Break due now'), `driving-hours: break due now (${await br()})`);
  check((await out()).includes('Ends at 20:00'), 'driving-hours: 14-hour window ends 20:00');
  await page.fill('.dh [data-k="now"]', '12:00'); await page.waitForTimeout(100);
  check((await big()).includes('5 h 00 m') && (await br()).includes('2 h 00 m more'), `driving-hours: at 12:00 break in 2 h (${await br()})`);
  await page.fill('.dh [data-k="now"]', '14:00');
  await page.selectOption('.dh [data-k="rules"]', 'ca'); await page.waitForTimeout(100);
  check((await big()).includes('5 h 00 m') && (await out()).includes('Ends at 22:00'), `driving-hours: Canada 13 h limit leaves 5 h, 16 h ends 22:00 (${await big()})`);
  await page.fill('.dh [data-k="used"]', '60'); await page.waitForTimeout(100);
  check((await big()).includes('2 h 00 m'), `driving-hours: cycle hours cap the driving (${await big()})`);
  // More options
  await page.evaluate(() => document.querySelectorAll('.dh details').forEach((d) => (d.open = true)));
  await page.selectOption('.dh [data-k="rules"]', 'us'); await page.fill('.dh [data-k="used"]', '0'); await page.waitForTimeout(100);
  check(/Type a distance/.test(await page.textContent('.dh .dh-trip')), 'driving-hours: blank distance is friendly');
  await page.fill('.dh [data-k="dist"]', '150'); await page.fill('.dh [data-k="speed"]', '50'); await page.waitForTimeout(100);
  // 3 h of driving needed, 3 h left, arrive 17:00
  check(/3 h 00 m of driving: it fits/.test(await page.textContent('.dh .dh-trip')) && (await page.textContent('.dh .dh-trip')).includes('17:00'), 'driving-hours: trip fits exactly');
  await page.fill('.dh [data-k="dist"]', '200'); await page.waitForTimeout(100);
  check(/4 h 00 m of driving, 1 h 00 m more/.test(await page.textContent('.dh .dh-trip')) && /about 150 mi/.test(await page.textContent('.dh .dh-trip')), 'driving-hours: trip too long');
  await page.fill('.dh [data-k="dist"]', '-5'); await page.waitForTimeout(100);
  check(/Type a distance/.test(await page.textContent('.dh .dh-trip')), 'driving-hours: negative distance is friendly');
  await page.fill('.dh [data-k="offat"]', '20:00'); await page.waitForTimeout(100);
  check(/New shift from 06:00 \(\+1 day\)/.test(await page.textContent('.dh .dh-rest')) && /06:00 \(\+1 day\)/.test(await page.textContent('.dh .dh-rest')), 'driving-hours: US 10 h rest');
  check(/06:00 \(\+2 days\)/.test(await page.textContent('.dh .dh-rest')), 'driving-hours: 34 h restart time');
  await page.selectOption('.dh [data-k="rules"]', 'uspax'); await page.waitForTimeout(100);
  // passenger: 10 h driving, 8 driven -> 2 h left; window 15h ends 21:00 -> limit is 2 h
  check((await big()).includes('2 h 00 m') && (await br()) === '', `driving-hours: passenger 10 h limit (${await big()})`);
};
