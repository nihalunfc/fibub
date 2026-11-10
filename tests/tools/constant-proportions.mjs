// #1264 Law of constant proportions lab
export const path = '/learn/constant-proportions/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/constant-proportions/?seed=3`); await page.waitForSelector('.cp .cp-fig rect');
  const R = '.cp ', txt = (s) => page.textContent(R + s);
  check((await txt('.cp-fig')).includes('2.01 g') && (await txt('.cp-fig')).includes('15.99 g') && (await txt('.cp-sum')).includes('Press'), 'const: 18 g water split, empty table');
  await page.click(R + '.cp-go'); await page.fill(R + '.cp-m', '50'); await page.click(R + '.cp-go'); await page.fill(R + '.cp-m', '3.6'); await page.click(R + '.cp-go');
  const rows = await page.$$eval(R + '.cp-tab tbody tr', (t) => t.map((r) => [...r.children].map((c) => c.textContent)));
  check(rows.length === 3 && rows[0][0].startsWith('Rain') && rows[1][0].startsWith('River') && rows[1][1] === '50', `const: three samples from different sources (${rows.map((r) => r[0]).join(' | ')})`);
  check(rows.every((r) => { const k = Number(r[4].split(' : ')[1]); return Math.abs(k - 7.94) < 0.35; }), `const: H : O ≈ 1 : 7.94 in every row (${rows.map((r) => r[4]).join(', ')})`);
  check((await txt('.cp-big')) === 'H : O ≈ 1 : 8 by mass, from every source' && (await txt('.cp-sum')).includes('1 : 7.936') && (await txt('.cp-sum')).includes('mass is conserved'), 'const: summary');
  await page.selectOption(R + '.cp-c', 'caco3');
  check((await page.$$(R + '.cp-tab tbody tr')).length === 0 && (await page.$$(R + '.cp-tab thead th')).length === 6 && (await page.$$(R + '.cp-fig rect')).length === 3, 'const: calcium carbonate has three elements');
  await page.click(R + '.cp-go');
  check((await txt('.cp-big')) === 'Ca : C : O ≈ 10 : 3 : 12 by mass, from every source', 'const: CaCO3 ratio');
  await page.click(R + '.cp-clear');
  check((await page.$$(R + '.cp-tab tbody tr')).length === 0, 'const: clear');
  check(await page.isHidden(R + '[data-only="11"]'), 'const: multiple proportions hidden in Class 9');
  await page.click(R + '.cp-level [data-level="11"]');
  check(await page.isVisible(R + '[data-only="11"]') && (await txt('.cp-msum')) === '1.332 : 2.664 = 1 : 2, a simple whole-number ratio.', 'const: Class 11 CO/CO2 1 : 2');
  await page.selectOption(R + '.cp-p', '3');
  check((await txt('.cp-msum')).endsWith('= 1 : 2 : 4, a simple whole-number ratio.') && (await page.$$(R + '.cp-mtab tbody tr')).length === 3, 'const: nitrogen oxides 1 : 2 : 4');
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans'));
    await (await it.$('.lq-in')).fill(String(+ans.toFixed(2))); await (await it.$('.lq-check')).click();
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `const: quiz ${i + 1} (${ans})`);
  }
  check(items.length === 4, 'const: four questions');
};
