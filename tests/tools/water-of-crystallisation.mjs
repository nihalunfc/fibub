// #1295 Water of crystallisation lab
export const path = '/learn/water-of-crystallisation/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/water-of-crystallisation/`); await page.waitForSelector('.wc .wc-cru');
  const R = '.wc ', txt = (s) => page.textContent(R + s);
  check((await txt('.wc-fig')).includes('22.495 g') && (await txt('.wc-out')).includes('holds 0.9 g of water'), 'hydrate: starts at 22.495 g, 0.9 g water');
  check((await txt('.wc-own')).includes('= 5, so the formula is about CuSO₄·5H₂O'), 'hydrate: own results give x = 5');
  await page.click(R + '.wc-heat'); await page.click(R + '.wc-heat'); await page.waitForTimeout(80);
  const two = await txt('.wc-out');
  check((await page.$$(R + '.wc-tab tr')).length === 5 && two.includes('Not at constant mass') && /x = moles of water ÷ moles of salt = (3\.\d+)/.test(two), `hydrate: two heatings, x too small (${two.match(/= (\d\.\d+)/)?.[1]})`);
  await page.click(R + '.wc-const'); await page.waitForTimeout(80);
  check((await txt('.wc-out')).includes('which rounds to 5: CuSO₄·5H₂O') && (await txt('.wc-sub')).includes('Constant mass reached') && await page.isDisabled(R + '.wc-heat'), 'hydrate: constant mass gives x = 5');
  check((await txt('.wc-fig')).includes('21.59'), 'hydrate: final reading about 21.595');
  await page.click(R + '.wc-wet'); await page.waitForTimeout(80);
  check((await txt('.wc-sub')).includes('warms up') && (await txt('.wc-fig')).includes('22.495 g'), 'hydrate: water added back');
  await page.selectOption(R + '.wc-h', 'na2co3'); await page.fill(R + '.wc-m', '2.86'); await page.waitForTimeout(80);
  check((await txt('.wc-out')).includes('(286 g/mol) holds 1.8 g of water'), 'hydrate: washing soda 286 g/mol');
  await page.click(R + '.wc-const'); await page.waitForTimeout(80);
  check((await txt('.wc-out')).includes('rounds to 10: Na₂CO₃·10H₂O'), 'hydrate: washing soda x = 10');
  await page.selectOption(R + '.wc-h', 'caso4'); await page.waitForTimeout(80);
  check((await page.$$(R + '.wc-tab tr')).length === 3, 'hydrate: changing salt restarts');
  await page.fill(R + '.wc-m', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.wc-err'), 'hydrate: mass 0 rejected');
  await page.fill(R + '.wc-m', '3'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.wc-err'), 'hydrate: message clears');
  await page.fill(R + '.wc-w2', '25'); await page.waitForTimeout(80);
  check((await txt('.wc-own')).startsWith('The weighings must go'), 'hydrate: impossible weighings rejected');
  await page.fill(R + '.wc-w1', '23.44'); await page.fill(R + '.wc-w2', '22.72'); await page.waitForTimeout(80);
  check((await txt('.wc-own')).includes('CaSO₄·2H₂O'), 'hydrate: gypsum own result x = 2');
  const items = page.locator('.wc .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans.replace('−', '-')); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 4 && right === n, `hydrate: every worked answer accepted (${right}/${n})`);
};
