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
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/reactivity-series/`); await page.waitForTimeout(600);
  {
  const S = '.rx-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  await pre(0);
  check((await ans()) === 'Yes: iron displaces copper from copper(II) sulfate.' && (await work()).includes('Fe + CuSO₄ → FeSO₄ + Cu'), `react solve: iron in copper sulfate (${await ans()})`);
  await pre(1); check((await ans()) === 'No reaction: copper is less reactive than iron.', `react solve: copper in iron sulfate (${await ans()})`);
  await pre(2); check((await ans()) === 'Yes: zinc displaces hydrogen from dilute acid.', `react solve: zinc and acid (${await ans()})`);
  await pre(3); check((await ans()) === 'Magnesium is more reactive than lead.', `react solve: compare (${await ans()})`);
  await pre(4); check((await ans()).startsWith('Aluminium is extracted by electrolysis'), `react solve: aluminium extraction (${await ans()})`);
  await pre(0); await page.selectOption(S + '[data-k="sv-m"]', 'Na'); check((await ans()).includes('reacts with the water itself'), `react solve: sodium (${await ans()})`);
  await page.selectOption(S + '[data-k="sv-m"]', 'Fe'); await page.selectOption(S + '[data-k="sv-s"]', 'FeSO4'); check((await ans()) === 'No change: iron cannot displace itself.', `react solve: same metal (${await ans()})`);
  await page.selectOption(S + '[data-k="sv-find"]', 'cmp'); await page.selectOption(S + '[data-k="sv-m2"]', 'Fe'); check((await ans()).startsWith('Pick two different metals'), `react solve: same two metals (${await ans()})`);
  await page.evaluate(() => { document.querySelectorAll('.rx details').forEach((d) => (d.open = true)); });
  await page.fill('[data-k="rx-order"]', 'Cu zinc Mg, silver'); check((await page.textContent('.rx-ord-out')) === 'Most reactive first: Mg > Zn > Cu > Ag.', `react solve: order typed metals (${await page.textContent('.rx-ord-out')})`);
  await page.fill('[data-k="rx-order"]', 'Cu xyz'); check((await page.textContent('.rx-ord-out')).includes('Type at least two') === false && (await page.textContent('.rx-ord-out')).includes('xyz'), 'react solve: unknown metal named');
  }
};
