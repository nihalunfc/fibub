// #1249 Number trick decoder
export const path = '/learn/algebra-tricks/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/algebra-tricks/`); await page.waitForSelector('.at .at-tab tbody tr');
  const R = '.at ', txt = (s) => page.textContent(R + s);
  const col = (i) => page.$$eval(R + `.at-tab tbody td:nth-child(${i})`, (t) => t.map((x) => x.textContent));
  check(JSON.stringify(await col(3)) === JSON.stringify(['n', '2n', '2n + 10', 'n + 5', '5']) && JSON.stringify(await col(2)) === JSON.stringify(['12', '24', '34', '17', '5']), 'tricks: always 5 with 12');
  check((await txt('.at-big')) === 'Always 5' && await page.isHidden(R + '.at-dec'), 'tricks: verdict always 5');
  await page.fill(R + '.at-n', '-7.5'); await page.waitForTimeout(80);
  check((await col(2)).at(-1) === '5' && (await col(2))[1] === '−15', 'tricks: negative decimal still gives 5');
  await page.click(R + '.at-tab tbody tr:nth-child(3)');
  check((await page.$$(R + '.at-fig .at-bag')).length === 2 && (await page.$$(R + '.at-fig .at-dot')).length === 10 && (await txt('.at-cap')).includes('2n + 10'), 'tricks: bags and counters for 2n + 10');
  await page.click(R + '.at-tricks [data-t=mind]');
  check((await txt('.at-big')) === 'Answer = 100n + 165' && await page.isVisible(R + '.at-dec'), 'tricks: mind reader');
  await page.fill(R + '.at-ans', '1365');
  check((await txt('.at-dec-out')).startsWith('Their number was 12.'), `tricks: decode 1365 → 12 (${await txt('.at-dec-out')})`);
  await page.click(R + '.at-tricks [data-t=back]');
  check((await txt('.at-big')) === 'You get your own number back', 'tricks: back to you');
  await page.click(R + '.at-tricks [data-t=own]');
  check((await txt('.at-big')) === 'Always 10', `tricks: own default always 10 (${await txt('.at-big')})`);
  await page.click(R + '.at-clear');
  check((await txt('.at-big')) === 'Add some steps', 'tricks: cleared');
  await page.selectOption(R + '.at-op', 'mul'); await page.fill(R + '.at-k', '4'); await page.click(R + '.at-add');
  await page.selectOption(R + '.at-op', 'add'); await page.fill(R + '.at-k', '6'); await page.click(R + '.at-add');
  check((await txt('.at-big')) === 'Answer = 4n + 6' && (await txt('.at-why')).includes('take away 6, then divide by 4'), 'tricks: own 4n + 6');
  await page.selectOption(R + '.at-op', 'div'); await page.fill(R + '.at-k', '0'); await page.click(R + '.at-add');
  check(await page.isVisible(R + '.at-err') && (await txt('.at-err')).includes('divide by 0'), 'tricks: divide by 0 refused');
  await page.fill(R + '.at-k', '3'); await page.click(R + '.at-add'); await page.click(R + '.at-undo');
  check((await txt('.at-big')) === 'Answer = 4n + 6', 'tricks: undo');
  for (let i = 1; i <= 4; i++) {
    const w = await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qwork`);
    const nums = w.match(/\d+/g) || [];
    // Every worked answer ends with the answer (n = …, always …, or the bracket's constant).
    const want = i === 3 ? (/\+ (\d+)\./.exec(w) || [])[1] : nums.at(-1);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, want ?? 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `tricks: quiz ${i} (${w})`);
  }
};
