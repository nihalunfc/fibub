// #1165 Sample space builder
export const path = '/learn/sample-space/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/sample-space/`); await page.waitForSelector('.ss .ss-grid span.in');
  const R = '.ss ';
  const txt = (s) => page.textContent(R + s);
  const cells = async () => (await page.$$(R + '.ss-grid span:not(.hd)')).length, shaded = async () => (await page.$$(R + '.ss-grid span.in')).length;
  check((await txt('.ss-p')).startsWith('P(the sum is 7) = 6/36 = 1/6 ≈ 0.1667') && (await cells()) === 36 && (await shaded()) === 6, 'sample: two dice, sum 7 is 6/36 = 1/6');
  check((await txt('.ss-why')).includes('1 − 1/6 = 30/36'), 'sample: complement shown');
  await page.fill(R + '.ss-k', '2'); await page.waitForTimeout(100);
  check((await txt('.ss-p')).startsWith('P(the sum is 2) = 1/36') && (await shaded()) === 1, 'sample: sum 2 is 1/36');
  await page.selectOption(R + '.ss-ev', 'prime'); await page.waitForTimeout(100);
  check((await txt('.ss-p')).includes('= 15/36 = 5/12') && (await shaded()) === 15 && await page.isHidden(R + '.ss-krow'), 'sample: prime sum 15/36 = 5/12');
  await page.selectOption(R + '.ss-ev', 'prodeven'); await page.waitForTimeout(100);
  check((await txt('.ss-p')).includes('= 27/36 = 3/4'), 'sample: product even 3/4');
  await page.click(R + '.ss-kind button[data-k="coins"]'); await page.waitForTimeout(100);
  await page.selectOption(R + '.ss-n', '3'); await page.waitForTimeout(100);
  check((await txt('.ss-p')).startsWith('P(exactly 1 head) = 3/8') && (await cells()) === 8 && (await shaded()) === 3 && (await txt('.ss-grid')).includes('HHH'), 'sample: 3 coins, exactly 1 head is 3/8');
  await page.selectOption(R + '.ss-ev', 'atleast'); await page.waitForTimeout(100);
  check((await txt('.ss-p')).includes('= 7/8'), 'sample: at least one head 7/8');
  await page.click(R + '.ss-kind button[data-k="cards"]'); await page.waitForTimeout(100);
  check((await cells()) === 52 && (await txt('.ss-p')).includes('= 26/52 = 1/2'), 'sample: cards, red 1/2');
  await page.selectOption(R + '.ss-ev', 'notheart'); await page.waitForTimeout(100);
  check((await txt('.ss-p')).includes('= 39/52 = 3/4') && (await shaded()) === 39, 'sample: not a heart 3/4');
  await page.selectOption(R + '.ss-ev', 'redface'); await page.waitForTimeout(100);
  check((await txt('.ss-p')).includes('= 6/52 = 3/26'), 'sample: red face card 3/26');
  // Probability from counts
  check((await txt('.ss-cans')) === 'P(E) = 2/5 ≈ 0.4 (40%).' && (await txt('.ss-clines')).includes('Odds in favour: 2 to 3 (about 1 in 2.5)'), `sample: counts 4 of 10 (${await txt('.ss-cans')})`);
  await page.fill(R + '[data-k="fav"]', '11'); check((await txt('.ss-cerr')).includes('more than the total'), 'sample: favourable above total message');
  await page.fill(R + '[data-k="total"]', '0'); check((await txt('.ss-cerr')).includes('1 or more'), 'sample: zero total message');
  await page.fill(R + '[data-k="fav"]', '0'); await page.fill(R + '[data-k="total"]', '8'); check((await txt('.ss-cans')) === 'P(E) = 0: the event is impossible.', 'sample: zero favourable');
  await page.fill(R + '[data-k="fav"]', '2.5'); check((await txt('.ss-cerr')).includes('whole numbers'), 'sample: fractional count message');
  // Two events (two dice, A = sum 7)
  await page.click(R + '.ss-kind button[data-k="dice"]'); await page.waitForTimeout(100);
  await page.evaluate(() => { document.querySelector('.ss .ss-two').open = true; }); await page.waitForTimeout(100);
  check((await txt('.ss-two-ans')) === 'P(A or B) = 12/36, P(A and B) = 0/36.' && (await txt('.ss-two-lines')).includes('mutually exclusive'), `sample: default two events (${await txt('.ss-two-ans')})`);
  await page.selectOption(R + '[data-k="event2"]', 'prodeven'); await page.waitForTimeout(100);
  check((await txt('.ss-two-ans')) === 'P(A or B) = 27/36, P(A and B) = 6/36.' && (await txt('.ss-two-lines')).includes('P(A given B) = P(both) / P(B) = 6/27 = 2/9 ≈ 0.2222.') && (await txt('.ss-two-lines')).includes('Not independent'), `sample: sum 7 vs even product (${await txt('.ss-two-lines')})`);
  check((await page.$$(R + '.ss-grid span.inb')).length === 27, 'sample: second event outlined on 27 cells');
  await page.click(R + '.ss-kind button[data-k="cards"]'); await page.waitForTimeout(100);
  check((await txt('.ss-two-lines')).includes('Independent') && (await txt('.ss-two-ans')) === 'P(A or B) = 32/52, P(A and B) = 6/52.', `sample: red and face are independent (${await txt('.ss-two-ans')})`);
  await page.evaluate(() => { document.querySelector('.ss .ss-two').open = false; }); await page.waitForTimeout(100);
  check((await page.$$(R + '.ss-grid span.inb')).length === 0, 'sample: closing the panel clears the outline');
  await page.click(R + '.ss-kind button[data-k="dice"]'); await page.waitForTimeout(100);
  // Simulation on two dice, sum 7.
  await page.click(R + '.ss-kind button[data-k="dice"]'); await page.waitForTimeout(100);
  await page.click(R + '.ss-run[data-n="10000"]'); await page.waitForTimeout(300);
  { const s = await txt('.ss-sim'), f = Number(/frequency of (\S+)\./.exec(s)?.[1]);
    check(s.includes('in 10,000 tries') && Math.abs(f - 1 / 6) < 0.02 && (await page.$$(R + '.ss-path')).length === 1, `sample: 10 000 rolls near 1/6 (${s.slice(0, 120)})`); }
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'sample: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= (\d+\/\d+|\d+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `sample: quiz ${i} (${w})`);
  }
};
