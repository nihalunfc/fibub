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
