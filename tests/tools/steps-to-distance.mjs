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
};
