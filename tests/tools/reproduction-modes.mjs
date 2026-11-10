// #1267 Asexual reproduction explorer
export const path = '/learn/reproduction-modes/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/reproduction-modes/`); await page.waitForSelector('.rp .rp-fig ellipse');
  const R = '.rp ', txt = (s) => page.textContent(R + s);
  const snap = () => page.$eval(R + '.rp-fig', (s) => s.innerHTML);
  check((await txt('.rp-cap')) === 'One full-grown cell.' && (await txt('.rp-who')).includes('Amoeba'), 'repro: binary fission start');
  const seen = new Set();
  for (const m of ['binary', 'multiple', 'budding', 'fragment', 'regen', 'spores']) {
    await page.click(`${R}.rp-mode [data-m=${m}]`);
    const caps = new Set(), pics = new Set();
    for (const v of ['0', '0.35', '0.65', '1']) { await page.locator(R + '.rp-t').fill(v); caps.add(await txt('.rp-cap')); pics.add(await snap()); }
    seen.add(m);
    check(caps.size === 4 && pics.size === 4, `repro: ${m} has 4 different stages and drawings`);
  }
  await page.click(R + '.rp-mode [data-m=binary]');
  check(Number(await page.inputValue(R + '.rp-t')) === 0, 'repro: changing mode restarts');
  await page.click(R + '.rp-play'); await page.waitForTimeout(5400);
  check((await txt('.rp-cap')).startsWith('Two daughter cells'), 'repro: play to the end');
  check((await txt('.rp-big')) === 'After 180 min: 512 cells' && (await txt('.rp-f')).includes('9 full doublings') && (await txt('.rp-f')).includes('after 399 min'), 'repro: 512 cells after 180 min');
  await page.fill(R + '.rp-h', '190');
  check((await txt('.rp-f')).includes('and part of the next'), 'repro: part doubling');
  await page.fill(R + '.rp-h', '600'); await page.check(R + '.rp-log');
  check((await txt('.rp-big')).includes('× 10^9') && (await page.$$(R + '.rp-graph .sm-grid')).length >= 9, `repro: big numbers on a log scale (${await txt('.rp-big')})`);
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans')), ch = await it.$$('.lq-choice');
    if (ch.length) await ch[ans].click(); else { await (await it.$('.lq-in')).fill(String(ans)); await (await it.$('.lq-check')).click(); }
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `repro: quiz ${i + 1}`);
  }
  check(items.length === 4, 'repro: four questions');
};
