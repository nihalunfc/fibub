// #1090 Order of reaction graphs
export const path = '/learn/order-graphs/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/order-graphs/`); await page.waitForSelector('.og .og-p0 polyline');
  const big = () => page.textContent('.og .og-big'), sub = () => page.textContent('.og .og-sub'), eq = () => page.textContent('.og .og-eq');
  const onFig = async () => page.locator('.og .og-plots figure.on figcaption').textContent();
  check((await big()) === 't½ = 69.3 s' && (await onFig()).startsWith('ln[A] against t') && (await sub()).includes('slope −k = −0.01') && (await eq()).includes('0.693 / 0.01 = 69.3 s'), 'orders: first-order worked example');
  check(await page.locator('.og .og-p0 line.hl').count() >= 3, 'orders: half-life marks');
  await page.locator('.og .og-a0').fill('2'); check((await big()) === 't½ = 69.3 s', 'orders: first-order half-life does not depend on [A]0');
  await page.locator('.og .og-a0').fill('1');
  await page.click('.og .og-n [data-n="2"]'); check((await big()) === 't½ = 100 s' && (await onFig()).startsWith('1/[A] against t') && (await eq()).includes('1 / (0.01 × 1) = 100 s'), 'orders: second order');
  await page.click('.og .og-n [data-n="0"]'); check((await big()) === 't½ = 50 s' && (await onFig()).startsWith('[A] against t') && (await sub()).includes('reaches zero at 100 s'), 'orders: zero order');
  const r2 = await page.locator('.og .og-plots figure').evaluateAll((fs) => fs.map((f) => Number(f.dataset.r2)));
  check(Math.abs(r2[0] - 1) < 1e-6 && r2[1] < 0.9999 && r2[2] < 0.9999, 'orders: zero order straight only in [A] ' + r2.join());
  await page.locator('.og .og-k').fill('-1'); check((await page.textContent('.og .og-ok')).startsWith('0.1 mol L⁻¹ s⁻¹') && (await big()) === 't½ = 5 s', 'orders: k slider and units');
  // Arrhenius
  const facts = () => page.textContent('.og .og-facts');
  check((await facts()).includes('2.64 × faster'), 'orders: 10 K warmer at Ea 75, 300 K ' + (await facts()));
  await page.locator('.og .og-cat').scrollIntoViewIfNeeded(); await page.click('.og .og-cat');
  check((await facts()).includes('1.67 × 10^5 times faster with the catalyst') && await page.locator('.og .og-ep path.cat').count() === 1, 'orders: catalyst lowers Ea');
  await page.locator('.og .og-t').fill('400'); check((await page.textContent('.og .og-ot')).startsWith('400 K'), 'orders: temperature slider');
  const items = page.locator('.og .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `orders: every worked answer accepted (${right}/${n})`);
  // Solve my numbers card
  const S = (k) => `.og .og-solve [data-k="${k}"]`, ans = () => page.textContent(S('answer')), wk = () => page.textContent(S('working'));
  check((await ans()) === 'After 60 min, [A] = 0.2 mol/L (25% of the start).' && (await wk()).includes('t½ = 0.693 ÷ k = 30 min'), `order solve: first order [A] (${await ans()})`);
  await page.selectOption(S('example'), '1'); check((await ans()) === 'It takes 400 s for [A] to fall from 0.5 to 0.1 mol/L.' && (await wk()).includes('= 100 s'), `order solve: second order time (${await ans()})`);
  await page.selectOption(S('example'), '2'); check((await ans()) === 'The half-life is 40 s.', `order solve: zero order half-life (${await ans()})`);
  await page.selectOption(S('example'), '3'); check((await ans()) === 'k = 0.0347 min⁻¹.', `order solve: k (${await ans()})`);
  await page.selectOption(S('example'), '4'); check((await ans()).startsWith('It is first order: ln[A] against t is the straight line') && (await wk()).includes('straightest'), `order solve: order from data (${await ans()})`);
  await page.selectOption(S('example'), '5'); check((await ans()).startsWith('The order with respect to this reactant is 2'), `order solve: initial rates (${await ans()})`);
  await page.selectOption(S('example'), '6'); check((await ans()) === 'The activation energy is 53.6 kJ/mol.', `order solve: Ea (${await ans()})`);
  await page.selectOption(S('example'), '7'); check((await ans()).startsWith('At the new temperature k = 0.00385 (1.92 times'), `order solve: k at 35 C (${await ans()})`);
  await page.fill(S('T2'), '25'); check((await ans()).includes('must be different'), 'order solve: equal temperatures');
  await page.fill(S('T2'), '-300'); check((await ans()).includes('above absolute zero'), 'order solve: below absolute zero');
  await page.selectOption(S('find'), 'order'); await page.fill(S('tl'), '0 10 20 30 40'); await page.fill(S('Al'), '1 0.5'); check((await ans()).includes('You typed 5 times but 2'), `order solve: unequal lists (${await ans()})`);
  await page.fill(S('Al'), '1 0.5 0 0.1 0.1'); check((await ans()).includes('more than 0'), 'order solve: zero concentration refused');
  await page.selectOption(S('find'), 't'); await page.selectOption(S('example'), '1'); await page.fill(S('A'), '0.9'); check((await ans()).includes('must be less than [A]₀'), 'order solve: [A] above [A]0');
};
