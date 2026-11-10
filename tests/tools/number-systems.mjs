// #1235 Number systems translator
export const path = '/learn/number-systems/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/number-systems/`); await page.waitForSelector('.ns .ns-blk rect');
  const R = '.ns ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.ns-ind')) === '2,026' && (await txt('.ns-iw')).includes('two thousand twenty-six'), 'numsys: Indian place value for 2026');
  check((await page.$$(R + '.ns-it tr')).length === 5, 'numsys: place table has 4 digits');
  check((await txt('.ns-rom')) === 'MMXXVI' && (await txt('.ns-rw')).endsWith('= 2026'), 'numsys: Roman MMXXVI');
  check((await page.$$(R + '.ns-egy > g')).length === 10 && (await txt('.ns-ew')).includes('10 signs'), 'numsys: 10 Egyptian signs');
  check((await txt('.ns-mw')) === '5 × 20² + 1 × 20¹ + 6 × 20⁰ = 2,026' && (await page.$$(R + '.ns-may .ns-bar')).length === 2 && (await page.$$(R + '.ns-may .ns-dot')).length === 2, 'numsys: Mayan 5.1.6');
  check((await txt('.ns-bw')) === '33 × 60 + 46 × 1 = 2,026', 'numsys: Babylonian 33.46');
  check((await txt('.ns-bt')) === '2,026 = 11111101010 in base 2' && (await page.inputValue(R + '.ns-bin')) === '11111101010', 'numsys: base 2');
  await page.click(R + '.ns-bs button[data-b="16"]'); await page.waitForTimeout(100);
  check((await txt('.ns-bt')).endsWith('7EA in base 16') && (await txt('.ns-bsum')) === '7 × 16² + 14 × 16¹ + 10 × 16⁰ = 2,026', 'numsys: base 16 7EA');
  await page.fill(R + '.ns-bin', 'FF'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ns-n')) === '255' && (await txt('.ns-rom')) === 'CCLV', 'numsys: typing FF in base 16 gives 255');
  await page.fill(R + '.ns-bin', 'FG'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ns-berr'), 'numsys: bad base digit message');
  await page.fill(R + '.ns-b', '7'); await page.waitForTimeout(100);
  check((await txt('.ns-bt')).endsWith('513 in base 7') && await page.isHidden(R + '.ns-berr'), 'numsys: typed base 7');
  await page.click(R + '.ns-pre[data-n="3661"]'); await page.waitForTimeout(100);
  check((await txt('.ns-bw')).startsWith('1 × 3,600 + 1 × 60 + 1 × 1') && (await txt('.ns-rom')) === 'MMMDCLXI', 'numsys: 3661');
  await page.click(R + '.ns-pre[data-n="400"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ns-may .ns-shell')).length === 4, 'numsys: 400 has two Mayan shells');
  await page.click(R + '.ns-pre[data-n="0"]'); await page.waitForTimeout(100);
  check((await txt('.ns-rw')).includes('no zero') && (await txt('.ns-egy')).includes('no Egyptian zero'), 'numsys: zero');
  await page.click(R + '.ns-pre[data-n="1234567"]'); await page.waitForTimeout(100);
  check((await txt('.ns-ind')) === '12,34,567' && (await txt('.ns-iw')).includes('twelve lakh') && (await txt('.ns-rom')) === '(too big)', 'numsys: 1234567 in lakh, too big for Roman');
  await page.fill(R + '.ns-n', '10000000'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ns-err'), 'numsys: too big message');
  await page.fill(R + '.ns-n', '12'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.ns-err'), 'numsys: message clears');
  check((await page.$$(R + '.sm-q')).length === 5, 'numsys: five questions');
  const res = [/= (\d+)\.$/, /so it is (\d+)\./, /Total (\d+)\./, /= (\d+)\.$/, /= (\d+)\.$/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `numsys: quiz question ${i} (${w})`);
  }
};
