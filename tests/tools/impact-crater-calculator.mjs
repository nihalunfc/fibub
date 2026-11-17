// T58 impact crater calculator (usefulness upgrade)
export const path = '/science/impact-crater-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/impact-crater-calculator/`); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelectorAll('.ic details').forEach((d) => (d.open = true)));
  const big = () => page.textContent('.ic .ic-big'), facts = () => page.textContent('.ic .ic-facts'), cmp = () => page.textContent('.ic .ic-cmp');
  check((await big()) === 'A crater 1.28 km wide (a simple bowl)' && (await facts()).includes('6.78 megatons of TNT'), 'impact crater: default 50 m rock at 17 km/s');
  { const t = await cmp(); check(t.includes('Moon') && t.includes('1.9 km') && t.includes('1.58 km') && t.includes('537 m'), 'impact crater: Earth, Moon and Mars table'); }
  // energy mode: 1 megaton of dense rock at 17 km/s is a 26.4 m body, crater 777 m
  await page.click('.ic .ic-mode [data-m=energy]'); await page.waitForTimeout(150);
  check(await page.isVisible('.ic .ic-e') && await page.isHidden('.ic .ic-l') && (await big()) === 'An impactor about 26.4 m across makes a crater 777 m wide', 'impact crater: crater from 1 megaton');
  await page.selectOption('.ic .ic-eu', 'kt'); await page.fill('.ic .ic-e', '1000'); await page.waitForTimeout(150);
  check((await big()) === 'An impactor about 26.4 m across makes a crater 777 m wide', 'impact crater: 1000 kilotons equals 1 megaton');
  await page.fill('.ic .ic-e', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.ic .ic-err')).includes('above zero') && await page.isHidden('.ic .ic-out'), 'impact crater: zero energy message');
  await page.fill('.ic .ic-e', '1000');
  // impactor from crater: 1.2 km crater -> 46.1 m
  await page.click('.ic .ic-mode [data-m=impactor]'); await page.waitForTimeout(150);
  check((await big()) === 'An impactor about 46.1 m across', 'impact crater: impactor from a 1.2 km crater');
  // US units: same impact, 50 m = 164.042 ft, 17 km/s = 38027.9 mph; crater 0.794 miles
  await page.click('.ic .ic-mode [data-m=crater]'); await page.waitForTimeout(100);
  await page.selectOption('.ic .ic-un', 'us'); await page.waitForTimeout(200);
  check((await page.inputValue('.ic .ic-l')) === '164.042' && (await page.inputValue('.ic .ic-v')) === '38027.9' && (await big()) === 'A crater 0.794 miles wide (a simple bowl)', 'impact crater: US units keep the same impact');
  check((await page.textContent('.ic .ic-vl')) === 'Speed at impact (mph)', 'impact crater: speed label in mph');
  await page.fill('.ic .ic-v', ''); await page.waitForTimeout(150);
  check((await page.textContent('.ic .ic-err')).includes('mph'), 'impact crater: blank speed asks for mph');
  await page.selectOption('.ic .ic-un', 'si'); await page.waitForTimeout(150);
  await page.fill('.ic .ic-v', '17'); await page.fill('.ic .ic-l', '-4'); await page.waitForTimeout(150);
  check((await page.textContent('.ic .ic-err')).includes('metres'), 'impact crater: negative size message');
};
