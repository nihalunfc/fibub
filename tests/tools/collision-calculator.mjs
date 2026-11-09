// #905 collision calculator
export const path = '/science/collision-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/collision-calculator/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.cco .cc-big'), facts = () => page.textContent('.cco .cc-facts'), err = () => page.textContent('.cco .cc-err');
  check((await big()) === 'After: 0.867 m/s and 3.27 m/s', 'collision: 1D example velocities');
  { const f = await facts(); check(f.includes('5 kg·m/s before and after') && f.includes('9.500 J → 6.087 J') && f.includes('3.413 J (35.9 %)') && f.includes('4.267 N·s') && f.includes('1.67 m/s'), 'collision: 1D momentum, energy, impulse, centre of mass'); }
  check(await page.isVisible('.cco .cc-fig'), 'collision: momentum diagram');
  await page.click('.cco .cc-el'); await page.waitForTimeout(100);
  check((await facts()).includes('none lost: elastic') && await page.inputValue('.cco .cc-ev') === '1', 'collision: elastic button');
  await page.click('.cco .cc-in'); await page.waitForTimeout(100);
  check((await big()) === 'After: 1.67 m/s and 1.67 m/s', 'collision: stick button (both at the centre-of-mass speed)');
  await page.fill('.cco .cc-ev', '1.4'); await page.waitForTimeout(100);
  check((await err()).includes('between 0 and 1') && await page.isHidden('.cco .cc-out'), 'collision: e above 1 message');
  await page.fill('.cco .cc-ev', '0.6'); await page.fill('.cco .cc-u1x', '-2'); await page.waitForTimeout(100);
  check((await err()).includes('catching up'), 'collision: bodies that never meet message');
  await page.fill('.cco .cc-u1x', '3'); await page.fill('.cco .cc-m2', '0'); await page.waitForTimeout(100);
  check((await err()).includes('masses'), 'collision: zero mass message');
  await page.fill('.cco .cc-m2', '1');
  await page.click('.cco .cc-mode [data-m="2d"]'); await page.waitForTimeout(150);
  check((await big()) === 'After: 1.07 m/s at 15.4° and 3.52 m/s at 33.3°' && (await facts()).includes('(5, 2.500) kg·m/s') && await page.isVisible('.cco .cc-phi'), 'collision: 2D example');
  await page.fill('.cco .cc-m1', '0.17'); await page.fill('.cco .cc-m2', '0.17'); await page.fill('.cco .cc-u1x', '2'); await page.fill('.cco .cc-u1y', '0'); await page.fill('.cco .cc-u2x', '0'); await page.fill('.cco .cc-u2y', '0'); await page.fill('.cco .cc-phi', '30'); await page.fill('.cco .cc-ev', '1'); await page.waitForTimeout(150);
  check((await big()) === 'After: 1 m/s at −60° and 1.73 m/s at 30°' && (await facts()).includes('90°'), 'collision: equal pool balls leave at 90°');
  await page.check('.cco .cc-stick'); await page.waitForTimeout(150);
  check((await big()) === 'Together: 1 m/s at 0°', 'collision: 2D sticking together');
  await page.uncheck('.cco .cc-stick'); await page.fill('.cco .cc-phi', '200'); await page.waitForTimeout(150);
  check((await err()).includes('moving apart'), 'collision: wrong line of centres message');
  await page.click('.cco .cc-mode [data-m="meas"]'); await page.waitForTimeout(150);
  await page.fill('.cco .cc-m1', '0.5'); await page.fill('.cco .cc-m2', '0.5'); await page.fill('.cco .cc-u1x', '0.8'); await page.fill('.cco .cc-u2x', '0'); await page.fill('.cco .cc-v1', '0.1'); await page.fill('.cco .cc-v2', '0.62'); await page.waitForTimeout(150);
  check((await big()) === 'e = 0.650' && (await facts()).includes('−10 %') && (await facts()).includes('more than 5 %') && await page.isHidden('.cco .cc-ev'), 'collision: e from a lab run');
  await page.fill('.cco .cc-v2', '0.72'); await page.waitForTimeout(150);
  check((await facts()).includes('within 5 %'), 'collision: good lab run');
  await page.fill('.cco .cc-v2', 'z'); await page.waitForTimeout(150);
  check((await err()).includes('measured velocities'), 'collision: missing measurement message');
  await page.fill('.cco .cc-v2', '0.62'); await page.waitForTimeout(100);
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cco .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `collision: ${n} download`); }
};
