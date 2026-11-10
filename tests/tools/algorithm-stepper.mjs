// #1287 Algorithm stepper
export const path = '/learn/algorithm-stepper/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/algorithm-stepper/`); await page.waitForSelector('.as .as-fig .as-b');
  const R = '.as ';
  const txt = (s) => page.textContent(R + s);
  const click = async (s) => { await page.click(R + s); await page.waitForTimeout(60); };
  check((await page.$$(R + '.as-fig .as-b')).length === 8 && (await txt('.as-facts')).includes('0 of 28'), `algo: example list of 8, 28 steps (${(await page.$$(R + '.as-fig .as-b')).length} bars, ${await txt('.as-facts')})`);
  check(await page.isDisabled(R + '.as-back'), 'algo: back disabled at start');
  await click('.as-step');
  check((await txt('.as-note')).includes('29 > 10, so swap') && (await page.$$(R + '.as-swp')).length === 2, 'algo: first step swaps 29 and 10');
  for (let i = 0; i < 6; i++) await click('.as-step');
  check((await page.$$(R + '.as-fix')).length === 1 && (await txt('.as-facts')).includes('Comparisons7'), 'algo: after pass 1 one bar fixed, 7 comparisons');
  await click('.as-back');
  check((await txt('.as-facts')).includes('Comparisons6'), 'algo: back goes one step');
  for (let i = 0; i < 30; i++) await page.$eval(R + '.as-step', (b) => b.click());
  check((await txt('.as-facts')).includes('Swaps18') && (await page.$$(R + '.as-fix')).length === 8 && await page.isDisabled(R + '.as-step'), 'algo: sorted with 18 swaps, all fixed');
  await click('.as-reset');
  check((await txt('.as-facts')).includes('0 of 28'), 'algo: reset');
  await page.fill(R + '.as-list', '1, 2, 3, 4, 5'); await page.waitForTimeout(100);
  check((await txt('.as-facts')).includes('0 of 4'), 'algo: sorted list stops after one pass');
  await click('.as-play'); await page.waitForTimeout(4500);
  check((await txt('.as-note')).includes('sorted') && (await txt('.as-play')) === 'Play', 'algo: play runs to the end');
  await page.fill(R + '.as-list', '3, x'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.as-err'), 'algo: bad list message');
  await click('.as-shuffle');
  check(await page.isHidden(R + '.as-err') && (await page.$$(R + '.as-fig .as-b')).length >= 6, 'algo: random list');
  // Binary search.
  await click('.as-mode button[data-m="search"]');
  check((await page.$$(R + '.as-box')).length === 16 && (await txt('.as-fig')).includes('needs 12 looks'), 'algo: search 57, linear 12');
  await click('.as-step');
  check((await txt('.as-note')).includes('Found it') && (await page.$$(R + '.as-out')).length === 8, 'algo: found in 2 looks, half thrown away');
  await page.fill(R + '.as-target', '60'); await page.waitForTimeout(100);
  for (let i = 0; i < 6; i++) await page.$eval(R + '.as-step', (b) => b.click());
  check((await txt('.as-note')).includes('not in the list'), 'algo: 60 not found');
  await click('.as-newlist');
  check((await page.$$(R + '.as-box')).length === 16, 'algo: new sorted list');
  // Euclid.
  await click('.as-mode button[data-m="hcf"]');
  for (let i = 0; i < 3; i++) await click('.as-step');
  check((await txt('.as-note')).includes('48 = 12 × 4 + 0') && (await txt('.as-facts')).includes('HCF12') && (await page.$$(R + '.as-sqh')).length === 4, 'algo: Euclid 168, 60 → 12 with four 12-squares');
  await page.fill(R + '.as-a', '89'); await page.fill(R + '.as-b', '55'); await page.waitForTimeout(100);
  check((await txt('.as-facts')).includes('0 of 9'), 'algo: Fibonacci pair takes 9 steps');
  await page.fill(R + '.as-a', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.as-err'), 'algo: HCF bad number');
  await page.fill(R + '.as-a', '99999'); await page.fill(R + '.as-b', '1'); await page.waitForTimeout(100); await click('.as-step');
  check(await page.isHidden(R + '.as-err') && (await txt('.as-facts')).includes('HCF1'), 'algo: 99999 and 1');
  check((await txt('.as-grow')).includes('499,999,500,000'), 'algo: growth table');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = /(\d+)(?: comparisons| looks)?\.?$/.exec(w.trim()) || /there are (\d+)/.exec(w);
    const a = i === 4 ? /there are (\d+)/.exec(w)[1] : i === 2 ? /answer is (\d+)/.exec(w)[1] : m[1];
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, a); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `algo: quiz ${i} (${w})`);
  }
};
