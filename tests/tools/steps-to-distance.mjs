// #T915 Steps to distance
export const path = '/everyday/steps-to-distance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/steps-to-distance/`); await page.waitForTimeout(300);
  const R = '.sd ';
  const t = (c) => page.textContent(R + c);
  check((await t('.sd-big')) === '7.04 km' && (await t('.sd-say')).includes('70.4 cm'), `steps: 10,000 steps at 170 cm -> 70.4 cm, 7.04 km (${await t('.sd-big')})`);
  check((await t('.sd-kcal')) === 'About 408 kcal', `steps: 70 kg, 100 min, 3.5 MET -> 408 kcal (${await t('.sd-kcal')})`);
  await page.selectOption(R + '[data-k="src"]', 'm'); await page.waitForTimeout(100);
  check((await t('.sd-big')) === '7.5 km', `steps: measured 75 cm stride -> 7.5 km (${await t('.sd-big')})`);
  await page.selectOption(R + '[data-k="dir"]', 'd2s'); await page.fill(R + '[data-k="dist"]', '3'); await page.waitForTimeout(100);
  check((await t('.sd-big')) === '4,000 steps', `steps: 3 km at 75 cm -> 4,000 steps (${await t('.sd-big')})`);
  await page.selectOption(R + '[data-k="act"]', 'run'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="met"]')) === '8.3', 'steps: running sets MET 8.3');
  // more options: step goals table, feet and inches
  await page.goto(`${BASE}/everyday/steps-to-distance/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const g = await t('.sd-goals tr[data-s="10000"]');
  check(g.includes('7.04') && g.includes('84') && g.includes('345'), `steps: 10,000-step row 7.04 km, 84 min, 345 kcal (${g})`);
  check((await t('.sd-per')).includes('1,421 steps per km'), `steps: about 1,421 steps per km (${await t('.sd-per')})`);
  await page.selectOption(R + '[data-k="sys"]', 'i'); await page.fill(R + '[data-k="h"]', "5'7"); await page.waitForTimeout(100);
  check((await t('.sd-big')) === '4.38 miles', `steps: height 5'7 (67 in) -> 10,000 steps = 4.38 miles (${await t('.sd-big')})`);
  await page.fill(R + '[data-k="steps"]', '999999999'); await page.waitForTimeout(100);
  check((await t('.sd-say')).includes('check the number'), 'steps: huge step count gives a message');
};
