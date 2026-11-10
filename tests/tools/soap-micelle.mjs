// #1297 Soap, micelles and hard water
export const path = '/learn/soap-micelle/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/soap-micelle/`); await page.waitForSelector('.sw .sw-fig .sw-oil');
  const R = '.sw ', txt = (s) => page.textContent(R + s), add = async (k) => { for (let i = 0; i < k; i++) await page.click(R + '.sw-add'); };
  check((await txt('.sw-big')) === '0 soap molecules: 0 free' && (await txt('.sw-say')).includes('do not mix'), 'soap: starts empty');
  await add(1); check((await txt('.sw-big')) === '2 soap molecules: 2 free' && (await txt('.sw-say')).includes('not yet enough'), 'soap: 2 not enough');
  await add(1); check((await txt('.sw-big')) === '4 soap molecules: 4 free, oil wrapped in a micelle' && (await txt('.sw-say')).includes('micelle'), 'soap: micelle at 4');
  await page.click(R + '.sw-rinse'); check((await txt('.sw-say')).includes('carries the micelle'), 'soap: rinse');
  await page.click(R + '.sw-water button[data-w="5"]');
  check((await txt('.sw-big')) === '0 soap molecules: 0 free' && (await page.locator(R + '.sw-fig .sw-ion').count()) === 5, 'soap: hard water has 5 ions');
  await add(3); check((await txt('.sw-big')) === '6 soap molecules: 6 lost to scum, 0 free' && (await page.locator(R + '.sw-fig .sw-scum').count()) === 3, 'soap: scum first');
  await add(4); check((await txt('.sw-big')) === '14 soap molecules: 10 lost to scum, 4 free, oil wrapped in a micelle', 'soap: micelle at 14 in hard water');
  await add(5); check(await page.isDisabled(R + '.sw-add') && (await txt('.sw-big')).startsWith('24 soap'), 'soap: limit 24');
  await page.click(R + '.sw-kind button[data-k="detergent"]'); await add(2);
  check((await txt('.sw-big')) === '4 detergent molecules: 4 free, oil wrapped in a micelle' && (await txt('.sw-say')).includes('do not make scum'), 'soap: detergent in hard water');
  // Lather test.
  const lather = async () => (await page.locator(R + '.sw-tab tbody tr td:nth-child(3)').allTextContents()).map(Number);
  const first = [null, null, null];
  for (let d = 1; d <= 16; d++) { await page.click(R + '.sw-drop'); (await lather()).forEach((v, i) => { if (v > 0 && first[i] === null) first[i] = d; }); }
  check(first.join() === '3,7,15', `soap: lather after 3, 7 and 15 drops (${first.join()})`);
  check((await page.locator(R + '.sw-tubes .sw-foam').count()) === 3 && (await txt('.sw-tab')).includes('yes'), 'soap: foam and scum in tubes');
  await page.click(R + '.sw-tkind button[data-k="detergent"]');
  for (let d = 1; d <= 3; d++) await page.click(R + '.sw-drop');
  check((await lather()).join() === '1,1,1' && !(await txt('.sw-tab')).includes('yes'), 'soap: detergent lathers in all three');
  await page.click(R + '.sw-treset'); check((await lather()).join() === '0,0,0', 'soap: empty tubes');
  const items = page.locator('.sw .cq-item');
  check((await items.count()) === 3, 'soap: three questions');
  for (let i = 0; i < 3; i++) {
    const it = items.nth(i); await it.locator('.cq-show').click();
    const ans = /Answer: (.+)\.$/.exec(await it.locator('.cq-work').textContent())[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    check((await it.locator('.cq-res').textContent()) === 'Right!', `soap: quiz ${i + 1} (${ans})`);
  }
};
