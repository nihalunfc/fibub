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
};
