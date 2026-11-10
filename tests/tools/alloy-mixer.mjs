// #1296 Alloy mixer
export const path = '/learn/alloy-mixer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/alloy-mixer/`); await page.waitForSelector('.al .al-fig circle');
  const R = '.al ', txt = (s) => page.textContent(R + s), set = (el, v) => page.fill(`${R}.al-p[data-el="${el}"]`, String(v));
  check((await txt('.al-big')) === 'Brass' && (await txt('.al-facts')).includes('taps') && (await txt('.al-tot')) === 'Total 100%.', 'alloy: starts as brass');
  await page.fill(R + '.al-g', '250'); check((await txt('.al-mass')) === 'In 250 g: Cu 175 g, Zn 75 g', 'alloy: grams in a 250 g piece');
  await set('Zn', 0); await set('Cu', 88); await set('Sn', 12);
  check((await txt('.al-big')) === 'Bronze' && (await page.inputValue(R + '.al-pre')) === '', 'alloy: bronze by hand');
  await set('Sn', 20); check((await txt('.al-big')) === 'Make the total 100%.' && (await txt('.al-tot')).includes('must add up to 100'), 'alloy: total check');
  await page.click(R + '.al-clear'); check((await txt('.al-big')) === 'Add some metals.', 'alloy: clear');
  await set('Fe', 99.7); await set('C', 0.3); check((await txt('.al-big')) === 'Carbon steel', 'alloy: steel');
  await set('Fe', 96.5); await set('C', 3.5); check((await txt('.al-big')) === 'Cast iron', 'alloy: cast iron');
  await set('Fe', 95); await set('C', 0); await set('Cr', 5); check((await txt('.al-big')).startsWith('A mixture, but not'), 'alloy: 5% chromium is not stainless');
  await page.selectOption(R + '.al-pre', 'stainless'); check((await txt('.al-big')) === 'Stainless steel' && (await txt('.al-facts')).includes('rusting'), 'alloy: stainless preset');
  await page.selectOption(R + '.al-pre', 'gold18'); check((await txt('.al-big')) === '18-carat gold' && (await txt('.al-facts')).includes('75% gold = 18 carat'), 'alloy: 18 carat');
  await page.selectOption(R + '.al-pre', 'solder'); check((await txt('.al-facts')).includes('183 °C'), 'alloy: solder melts low');
  await page.click(R + '.al-clear'); await set('Cu', 100); check((await txt('.al-big')) === 'Pure copper: not an alloy' && (await txt('.al-facts')).includes('1085 °C'), 'alloy: pure copper');
  await page.locator(R + '.al-push').scrollIntoViewIfNeeded();
  await page.click(R + '.al-push'); await page.waitForTimeout(700);
  check((await page.getAttribute(R + '.al-top', 'transform')) === 'translate(60 0)' && (await txt('.al-why')).includes('slide over each other'), 'alloy: pure metal rows slide');
  await page.click(R + '.al-lat button[data-l="alloy"]'); await page.click(R + '.al-push'); await page.waitForTimeout(700);
  check((await page.getAttribute(R + '.al-top', 'transform')) === 'translate(6 0)' && (await page.locator(R + '.al-fig .al-b').count()) === 4 && (await txt('.al-why')).includes('jam'), 'alloy: alloy rows jam');
  const items = page.locator('.al .cq-item');
  check((await items.count()) === 4, 'alloy: four questions');
  for (let i = 0; i < 4; i++) {
    const it = items.nth(i); await it.locator('.cq-show').click();
    const ans = /Answer: (.+)\.$/.exec(await it.locator('.cq-work').textContent())[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    check((await it.locator('.cq-res').textContent()) === 'Right!', `alloy: quiz ${i + 1} (${ans})`);
  }
};
