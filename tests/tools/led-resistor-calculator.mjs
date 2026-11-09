// #626 LED resistor calculator
export const path = '/science/led-resistor-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.ledr ';
  await page.goto(`${BASE}/science/led-resistor-calculator/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(R + c), facts = () => t('.lr-facts');
  check((await t('.lr-big')) === '150 Ω per string: use 150 Ω (E24)', `led: example (${await t('.lr-big')})`);
  { const f = await facts(); check(f.includes('20 mA per string') && f.includes('60 mW each') && f.includes('1/8 W') && f.includes('720 mW in all') && f.includes('80 mA, 960 mW') && f.includes('75 %') && f.includes('14 mA to 26 mA') && f.includes('Warning'), 'led: example powers, rating, spread and warning'); }
  check(await page.isVisible(R + '.lr-fig'), 'led: current chart');
  check((await t('.lr-big2')) === '4 strings (up to 3 LEDs each)' && (await t('.lr-tab')).includes('300 Ω') && (await t('.lr-sum')).includes('960 mW') && (await t('.lr-sum')).includes('37.5 %'), 'led: array planner and power budget');
  await page.fill(R + '.lr-vs', '5'); await page.selectOption(R + '.lr-type', '2.1,20'); await page.fill(R + '.lr-n', '1'); await page.fill(R + '.lr-p', '1'); await page.fill(R + '.lr-i', '10'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.lr-vf')) === '2.1' && (await t('.lr-big')) === '290 Ω per string: use 300 Ω (E24)' && (await facts()).includes('9.67 mA'), `led: yellow LED on 5 V (${await t('.lr-big')})`);
  await page.selectOption(R + '.lr-ser', '12'); await page.waitForTimeout(100);
  check((await t('.lr-big')).endsWith('use 330 Ω (E12)') && (await facts()).includes('270 Ω'), 'led: E12 next value up and nearest');
  await page.fill(R + '.lr-n', '3'); await page.waitForTimeout(100);
  check((await t('.lr-err')).includes('more than the 5 V supply') && await page.isHidden(R + '.lr-out'), 'led: too many LEDs message');
  await page.fill(R + '.lr-n', '1.5'); await page.waitForTimeout(100);
  check((await t('.lr-err')).includes('whole number'), 'led: whole-number message');
  await page.fill(R + '.lr-n', '1'); await page.fill(R + '.lr-tot', '0'); await page.waitForTimeout(100);
  check((await t('.lr-err2')).includes('whole number of LEDs'), 'led: planner bad total');
  await page.fill(R + '.lr-tot', '7'); await page.waitForTimeout(100);
  check((await t('.lr-big2')) === '4 strings (up to 2 LEDs each)', `led: planner on 5 V (${await t('.lr-big2')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'led: PDF download'); }
};
