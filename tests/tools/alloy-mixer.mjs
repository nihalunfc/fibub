// #1299 Alloy mixer
export const path = '/learn/alloy-mixer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/alloy-mixer/`); await page.waitForSelector('.al .al-host');
  const R = '.al ', txt = (s) => page.textContent(R + s);
  check((await txt('.al-big')) === 'Brass: density about 8.22 g/cm³' && (await txt('.al-out')).includes('325 g of copper, 175 g of zinc') && (await txt('.al-out')).includes('60.82 cm³'), 'alloy: brass 500 g');
  check((await page.$$(R + '.al-row')).length === 2 && (await txt('.al-about')).includes('taps'), 'alloy: two sliders and uses');
  await page.fill(R + '.al-pct[data-el="Zn"]', '45'); await page.waitForTimeout(80);
  check((await txt('.al-out')).includes('scaled to 100 %') && (await txt('.al-out')).includes('Zn 40.91 %'), 'alloy: numbers scaled to 100');
  await page.click(R + '.al-reset'); await page.waitForTimeout(80);
  check((await txt('.al-big')).includes('8.22'), 'alloy: reset recipe');
  await page.selectOption(R + '.al-pick', 'gold22'); await page.waitForTimeout(80);
  check((await page.$$(R + '.al-row')).length === 3 && (await txt('.al-out')).includes('= 22.01 carat'), 'alloy: 22 carat gold');
  await page.selectOption(R + '.al-pick', 'steel'); await page.waitForTimeout(80);
  check((await page.$$(R + '.al-small')).length > 0 && (await page.$$(R + '.al-fig .al-bigatom')).length === 0, 'alloy: steel shows carbon in the gaps');
  await page.click(R + '.al-push'); await page.waitForTimeout(80);
  check((await txt('.al-why')).includes('carbon atoms sit in the gaps') && (await txt('.al-push')) === 'Put the layers back', 'alloy: push steel');
  await page.click(R + '.al-pure button[data-p="1"]'); await page.waitForTimeout(80);
  check((await txt('.al-why')).includes('slide over each other easily') && (await page.$$(R + '.al-small')).length === 0, 'alloy: pure metal slides');
  await page.click(R + '.al-pure button[data-p="0"]'); await page.selectOption(R + '.al-pick', 'bronze'); await page.click(R + '.al-push'); await page.waitForTimeout(80);
  check((await page.$$(R + '.al-fig .al-bigatom')).length > 0 && (await txt('.al-why')).includes('different size'), 'alloy: bronze has bigger atoms');
  await page.fill(R + '.al-m', '-5'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.al-err'), 'alloy: negative mass rejected');
  await page.fill(R + '.al-m', '100'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.al-err') && (await txt('.al-out')).includes('88 g of copper, 12 g of tin'), 'alloy: bronze 100 g');
  check((await txt('.al-kout')).includes('91.67 % gold') && (await txt('.al-kout')).includes('9.167 g of pure gold') && (await txt('.al-kout')).includes('917'), 'alloy: 22 carat chain');
  await page.fill(R + '.al-k', '18'); await page.waitForTimeout(80);
  check((await txt('.al-kout')).includes('75 % gold') && (await txt('.al-kout')).includes('7.5 g'), 'alloy: 18 carat');
  await page.fill(R + '.al-k', '30'); await page.waitForTimeout(80);
  check((await txt('.al-kout')).startsWith('Carat must be'), 'alloy: 30 carat rejected');
  const items = page.locator('.al .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 4 && right === n, `alloy: every worked answer accepted (${right}/${n})`);
};
