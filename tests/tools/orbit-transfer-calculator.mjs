// T47 orbit transfer calculator (usefulness upgrade)
export const path = '/science/orbit-transfer-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/orbit-transfer-calculator/`); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelectorAll('.ot details').forEach((d) => (d.open = true)));
  const big = () => page.textContent('.ot .ot-big'), facts = () => page.textContent('.ot .ot-facts');
  check((await big()) === '3.893 km/s in two burns, 5.28 h apart', 'orbit transfer: LEO to GEO default');
  await page.selectOption('.ot .ot-su', 'ms'); await page.waitForTimeout(150);
  check((await big()).startsWith('3892.6 m/s'), 'orbit transfer: metres per second');
  await page.selectOption('.ot .ot-su', 'mph'); await page.waitForTimeout(150);
  check((await big()).startsWith('8707.4 mph'), 'orbit transfer: miles per hour');
  await page.selectOption('.ot .ot-su', 'kms');
  // radius from the centre gives the same answer
  await page.selectOption('.ot .ot-from', 'centre'); await page.waitForTimeout(200);
  check((await page.inputValue('.ot .ot-r1')) === '6678.137' && (await page.inputValue('.ot .ot-r2')) === '42164.137' && (await big()).startsWith('3.893 km/s'), 'orbit transfer: orbit radius from the centre');
  await page.selectOption('.ot .ot-from', 'surface'); await page.waitForTimeout(200);
  check((await page.inputValue('.ot .ot-r1')) === '300', 'orbit transfer: back to altitude');
  // miles
  await page.selectOption('.ot .ot-lu', 'mi'); await page.waitForTimeout(200);
  check((await page.inputValue('.ot .ot-r1')).startsWith('186.41') && (await big()).startsWith('3.893 km/s') && (await facts()).includes('15,175 miles'), 'orbit transfer: miles keep the same orbit');
  await page.selectOption('.ot .ot-lu', 'km'); await page.waitForTimeout(200);
  // plane change 28.5 degrees
  await page.fill('.ot .ot-inc', '28.5'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('1.514 km/s') && f.includes('1.830 km/s') && f.includes('5.406 km/s in all') && f.includes('4.256 km/s in all') && f.includes('1.150 km/s less'), 'orbit transfer: plane change separate and combined'); }
  await page.fill('.ot .ot-inc', '');
  // fuel
  await page.fill('.ot .ot-m', '1000'); await page.waitForTimeout(100);
  check((await page.textContent('.ot .ot-err')).includes('Isp') && await page.isHidden('.ot .ot-out'), 'orbit transfer: fuel needs Isp');
  await page.fill('.ot .ot-isp', '320'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('2,457 kg') && f.includes('1,861 kg for the first burn') && f.includes('596 kg for the second'), 'orbit transfer: fuel by burn'); }
  await page.fill('.ot .ot-inc', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.ot .ot-err')).includes('tilt'), 'orbit transfer: zero tilt message');
  await page.fill('.ot .ot-inc', ''); await page.fill('.ot .ot-r1', '-6500'); await page.waitForTimeout(150);
  check((await page.textContent('.ot .ot-err')).includes('Altitudes must be zero or more'), 'orbit transfer: negative altitude');
};
