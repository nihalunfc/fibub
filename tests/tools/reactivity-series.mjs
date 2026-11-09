// #1086 Reactivity series lab
export const path = '/learn/reactivity-series/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/reactivity-series/`); await page.waitForSelector('.rx .rx-svg rect');
  const big = () => page.textContent('.rx .rx-big'), seen = () => page.textContent('.rx .rx-seen');
  const go = async (m, s) => { await page.selectOption('.rx .rx-m', m); await page.selectOption('.rx .rx-s', s); await page.locator('.rx .rx-go').scrollIntoViewIfNeeded(); await page.click('.rx .rx-go'); await page.waitForTimeout(200); };
  check((await page.textContent('.rx .rx-grid')).includes('Nothing tested yet'), 'reactivity: empty results');
  await go('Fe', 'CuSO4');
  check((await big()) === 'Yes: iron displaces copper' && (await page.textContent('.rx .rx-eq')) === 'Fe + CuSO₄ → FeSO₄ + Cu' && (await seen()).includes('blue to pale green'), 'reactivity: iron in copper sulfate');
  check((await page.textContent('.rx .rx-svg')).includes('pale green') && (await page.getAttribute('.rx .rx-svg .coat', 'opacity')) === '1', 'reactivity: beaker shows coat and colour');
  await go('Cu', 'FeSO4'); check((await big()) === 'No reaction' && await page.isHidden('.rx .rx-eq'), 'reactivity: copper in iron sulfate');
  await go('Zn', 'HCl'); check((await page.textContent('.rx .rx-eq')) === 'Zn + 2HCl → ZnCl₂ + H₂' && (await seen()).includes('Bubbles') && await page.locator('.rx .rx-svg .bub').count() > 0, 'reactivity: zinc in acid');
  await go('Na', 'CuSO4'); check((await big()).includes('reacts with the water itself'), 'reactivity: sodium warning');
  await go('Al', 'CuSO4'); check((await page.textContent('.rx .rx-eq')) === '2Al + 3CuSO₄ → Al₂(SO₄)₃ + 3Cu' && (await seen()).includes('oxide layer'), 'reactivity: aluminium');
  await page.selectOption('.rx .rx-m', 'Zn'); await page.click('.rx .rx-all');
  await page.selectOption('.rx .rx-m', 'Cu'); await page.click('.rx .rx-all');
  await page.selectOption('.rx .rx-m', 'Fe'); await page.click('.rx .rx-all');
  const grid = await page.textContent('.rx .rx-grid');
  check(grid.includes('Zn') && grid.includes('✓') && grid.includes('✗') && grid.includes('water'), 'reactivity: results grid');
  const order = await page.locator('.rx .rx-order li').allTextContents();
  const idx = (s) => order.findIndex((t) => t.startsWith(s + ' '));
  check(idx('Mg') < idx('Zn') && idx('Zn') < idx('Fe') && idx('Fe') < idx('Cu') && idx('Cu') < idx('Ag'), 'reactivity: series from results ' + order.map((t) => t.split(' ')[0]).join(' > '));
  await page.click('.rx .rx-clear'); check((await page.textContent('.rx .rx-grid')).includes('Nothing tested'), 'reactivity: clear');
  await page.locator('.rx .rx-rung[data-s="Al"]').scrollIntoViewIfNeeded(); await page.click('.rx .rx-rung[data-s="Al"]');
  check((await page.textContent('.rx .rx-facts')).includes('electrolysis') && (await page.textContent('.rx .rx-facts')).includes('cryolite'), 'reactivity: aluminium extraction');
  await page.click('.rx .rx-rung[data-s="Zn"]'); check((await page.textContent('.rx .rx-facts')).includes('carbon'), 'reactivity: zinc by carbon');
  await page.click('.rx .rx-rung[data-s="H"]'); check((await page.textContent('.rx .rx-facts')).includes('Not a metal'), 'reactivity: hydrogen rung');
  const items = page.locator('.rx .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `reactivity: every worked answer accepted (${right}/${n})`);
};
