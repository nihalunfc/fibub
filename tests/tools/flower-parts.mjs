// #1488 Flower parts
export const path = '/learn/flower-parts/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/flower-parts/`); await page.waitForTimeout(300);
  const names = await page.$$eval('.fp .fp-list dt', (e) => e.map((x) => x.textContent));
  check(names.length === 8 && new Set(names).size === 8, 'flower-parts: each part listed once (' + names.join(', ') + ')');
  await page.click('.fp .fp-peel'); await page.click('.fp .fp-peel');
  check((await page.textContent('.fp .fp-out')).includes('Petals removed'), 'flower-parts: peeling twice removes the petals');
  await page.click('.fp .fp-pol');
  check((await page.textContent('.fp .fp-out')).includes('landed on the stigma'), 'flower-parts: pollen reaches the stigma');
  await page.click('.fp .fp-peel');
  check((await page.textContent('.fp .fp-out')).includes('Only the carpel'), 'flower-parts: only the carpel is left');
  await page.click('.fp .fp-reset');
  let ok = 0;
  for (let k = 0; k < 6; k++) {
    await page.click('.fp .lq-new');
    const items = await page.$$('.fp .lq-item');
    for (const it of items) {
      const a = Number(await it.getAttribute('data-ans'));
      await (await it.$$('.lq-choice'))[a].click();
      if ((await (await it.$('.lq-fb')).textContent()) === 'Right.') ok++;
    }
  }
  check(ok === 24, `flower-parts: quiz answers match labels (${ok}/24)`);
};
