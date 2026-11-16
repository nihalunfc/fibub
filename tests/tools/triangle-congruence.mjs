// #L353 Triangle congruence
export const path = '/learn/triangle-congruence/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/triangle-congruence/`); await page.waitForTimeout(300);
  await page.click('.tc .tc-play');
  const o = page.locator('.tc .tc-out');
  const set = async (i, v) => { await page.fill(`.tc .tc-i${i}`, String(v)); await page.dispatchEvent(`.tc .tc-i${i}`, 'input'); };
  check((await o.getAttribute('data-count')) === '1' && (await o.getAttribute('data-congruent')) === 'true', 'triangle-congruence: SSS gives one triangle');
  await page.selectOption('.tc .tc-cond', 'SSA');
  await set(0, 4); await set(1, 6); await set(2, 30);
  check((await o.getAttribute('data-count')) === '2' && (await o.getAttribute('data-congruent')) === 'false', 'triangle-congruence: SSA a=4 b=6 A=30 gives two triangles');
  await set(0, 7);
  check((await o.getAttribute('data-count')) === '1', 'triangle-congruence: SSA with a longer than b gives one');
  await set(0, 2);
  check((await o.getAttribute('data-count')) === '0', 'triangle-congruence: SSA with a too short gives none');
  await page.selectOption('.tc .tc-cond', 'AAA');
  check((await o.getAttribute('data-count')) === 'inf', 'triangle-congruence: AAA gives infinitely many');
  await page.selectOption('.tc .tc-cond', 'RHS');
  check((await o.getAttribute('data-count')) === '1' && (await o.getAttribute('data-congruent')) === 'true', 'triangle-congruence: RHS gives one triangle');
  { const a = await page.getAttribute('.tc .lq-item >> nth=3', 'data-ans'); await page.fill('.tc .lq-item >> nth=3 >> .lq-in', a); await page.click('.tc .lq-item >> nth=3 >> .lq-check');
    check((await page.textContent('.tc .lq-item >> nth=3 >> .lq-fb')) === 'Right.', 'triangle-congruence: quiz accepts the right answer'); }
  { const it = page.locator('.tc .lq-item').first(); const a = await it.getAttribute('data-ans'); await it.locator('.lq-choice').nth(+a).click();
    check((await it.locator('.lq-fb').textContent()) === 'Right.', 'triangle-congruence: prove-it accepts the right test'); }
};
