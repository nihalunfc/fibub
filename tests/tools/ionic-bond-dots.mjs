// #1294 Ionic bond builder
export const path = '/learn/ionic-bond-dots/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ionic-bond-dots/`); await page.waitForSelector('.ib .ib-shell');
  const R = '.ib ', txt = (s) => page.textContent(R + s);
  check((await txt('.ib-big')) === '0 of 2 electrons moved' && (await page.$$(R + '.ib-arrow')).length === 1, 'ionic: MgCl₂ starts with 2 to move');
  check((await page.$$(R + '.ib-sym')).length === 3, 'ionic: one Mg and two Cl drawn');
  await page.click(R + '.ib-next'); await page.waitForTimeout(80);
  check((await txt('.ib-big')) === '1 of 2 electrons moved' && (await txt('.ib-step')).includes('Cl atom 2'), 'ionic: one moved, next to the second Cl');
  await page.click(R + '.ib-next'); await page.waitForTimeout(80);
  check((await txt('.ib-big')) === 'MgCl₂: Magnesium chloride' && await page.isDisabled(R + '.ib-next') && (await page.$$(R + '.ib-arrow')).length === 0, 'ionic: MgCl₂ done');
  check((await page.$$(R + '.ib-br')).length === 3 && (await txt('.ib-fig')).includes('2+'), 'ionic: ions bracketed with charges');
  check((await txt('.ib-out')).includes('Mg²⁺ is 2, 8') && (await txt('.ib-out')).includes('Cl⁻ is 2, 8, 8'), 'ionic: ion shells');
  await page.selectOption(R + '.ib-m', 'Al'); await page.selectOption(R + '.ib-x', 'O'); await page.waitForTimeout(80);
  check((await txt('.ib-big')) === '0 of 6 electrons moved' && (await page.$$(R + '.ib-sym')).length === 5, 'ionic: Al₂O₃ has 5 atoms and 6 electrons');
  await page.click(R + '.ib-all'); await page.waitForTimeout(80);
  check((await txt('.ib-big')) === 'Al₂O₃: Aluminium oxide' && (await txt('.ib-out')).includes('2 Al (giving 2 × 3 = 6)'), 'ionic: aluminium oxide');
  await page.click(R + '.ib-reset'); await page.waitForTimeout(80);
  check((await txt('.ib-big')).startsWith('0 of 6'), 'ionic: start again');
  for (const [m, x, f] of [['Na', 'Cl', 'NaCl: Sodium chloride'], ['Li', 'N', 'Li₃N: Lithium nitride'], ['K', 'S', 'K₂S: Potassium sulfide'], ['Ca', 'F', 'CaF₂: Calcium fluoride']]) {
    await page.selectOption(R + '.ib-m', m); await page.selectOption(R + '.ib-x', x); await page.click(R + '.ib-all'); await page.waitForTimeout(60);
    check((await txt('.ib-big')) === f, `ionic: ${f}`);
  }
  const items = page.locator('.ib .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 4 && right === n, `ionic: every worked answer accepted (${right}/${n})`);
  await items.nth(0).locator('.cq-in').fill('XY9'); await items.nth(0).locator('.cq-check').click();
  check((await items.nth(0).locator('.cq-res').textContent()).startsWith('Not quite'), 'ionic: wrong formula marked');
};
