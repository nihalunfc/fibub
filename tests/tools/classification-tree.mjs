// #1270 Classification tree
export const path = '/learn/classification-tree/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/classification-tree/`); await page.waitForSelector('.ct .ct-kids button');
  const R = '.ct ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.ct-kids button')).length === 5, 'tree: five kingdoms');
  for (const g of ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'Panthera leo']) await page.click(`${R}.ct-kids button:has-text("${g}")`);
  check(await page.isVisible(R + '.ct-sp') && (await txt('.ct-name')).includes('Panthera leo') && (await page.$$(R + '.ct-tab tr')).length === 7, 'tree: walked to the lion');
  await page.click(`${R}.ct-crumbs button:has-text("Felidae")`);
  check((await page.$$(R + '.ct-kids button')).length === 2 && await page.isHidden(R + '.ct-sp'), 'tree: back up to Felidae');
  check((await page.$$(R + '.ct-cmp tr.same')).length === 6 && (await txt('.ct-rel')).includes('genus (Panthera)'), 'compare: tiger and lion');
  await page.selectOption(R + '.ct-b', 'mango');
  check((await page.$$(R + '.ct-cmp tr.same')).length === 0 && (await txt('.ct-rel')).startsWith('Different kingdoms'), 'compare: tiger and mango');
  await page.selectOption(R + '.ct-b', 'human');
  check((await txt('.ct-rel')).includes('class (Mammalia)'), 'compare: tiger and human');
  check((await txt('.ct-out')).includes('Panthera tigris') && (await page.$$(R + '.ct-issues li')).length === 2, 'name: default fixed');
  await page.fill(R + '.ct-in', 'Panthera tigris tigris');
  check((await page.$$(R + '.ct-issues li')).length === 0 && (await txt('.ct-extra')).includes('subspecies'), 'name: trinomial');
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans')), ch = await it.$$('.lq-choice');
    if (ch.length) await ch[ans].click(); else { await (await it.$('.lq-in')).fill(String(ans)); await (await it.$('.lq-check')).click(); }
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `tree: quiz ${i + 1}`);
  }
  check(items.length === 4, 'tree: four questions');
};
