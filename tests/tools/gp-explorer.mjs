// #1377 GP explorer
export const path = '/learn/gp-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/gp-explorer/`); await page.waitForSelector('.gp .gp-bar');
  const R = '.gp ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.gp-s')).endsWith('= 15.9375') && (await txt('.gp-inf')).includes('= 16.') && (await txt('.gp-inf')).includes('0.0625 away'), 'gp: S8 = 15.9375, S∞ = 16');
  check((await page.$$(R + '.gp-fig .gp-bar')).length === 8 && (await page.$$(R + '.gp-fig .gp-inf')).length === 1, 'gp: 8 bars and the S∞ line');
  await page.fill(R + '.gp-a', '3'); await page.fill(R + '.gp-r', '-2'); await page.fill(R + '.gp-n', '5'); await page.waitForTimeout(100);
  check((await txt('.gp-s')).endsWith('= 33') && (await txt('.gp-inf')).includes('no sum to infinity') && (await page.$$(R + '.gp-fig .gp-inf')).length === 0, 'gp: 3, −6, … S5 = 33, no S∞');
  await page.fill(R + '.gp-r', '1'); await page.waitForTimeout(100);
  check((await txt('.gp-s')).includes('n a = 5 × 3 = 15'), 'gp: r = 1 sum');
  await page.fill(R + '.gp-r', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.gp-err'), 'gp: r = 0 message');
  // Means.
  check((await txt('.gp-am')).includes('= 6.5') && (await txt('.gp-gm')).includes('√36 = 6'), 'means: AM 6.5, GM 6');
  await page.check(R + '.gp-hm'); await page.waitForTimeout(100);
  check((await txt('.gp-hmt')).includes('5.5385') && (await page.$$(R + '.gp-hmL')).length === 1, 'means: HM 5.5385 drawn');
  await page.fill(R + '.gp-y', '4'); await page.waitForTimeout(100);
  check((await txt('.gp-cmp')).includes('AM = GM = 4'), 'means: equal numbers');
  await page.fill(R + '.gp-y', '-3'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.gp-merr'), 'means: negative number message');
  // Money.
  check((await txt('.gp-pv')).includes('21,589.25') && (await txt('.gp-pd')).includes('after 10 years') && (await page.$$(R + '.gp-yfig rect')).length === 11, 'money: 10,000 at 8 % for 10 years');
  await page.click(R + '.gp-way [data-w=shrink]'); await page.fill(R + '.gp-i', '15'); await page.waitForTimeout(100);
  check((await txt('.gp-pd')).includes('halves for the first time after 5 years') && (await txt('.gp-pr')).includes('0.85'), 'money: depreciation 15 % halves after 5 years');
  await page.fill(R + '.gp-yrs', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.gp-perr'), 'money: bad years message');
  // Solve my GP question.
  { const K = (k) => `${R}[data-k="${k}"]`, ans = () => txt('.gp-ans'), work = () => txt('.gp-work'), pre = (i) => page.selectOption(K('preset'), String(i));
    check((await ans()) === 'Term 10 is 1536 and the sum of the first 10 terms is 3069.' && (await work()).includes('3 × 2^9 = 1536') && (await work()).includes('no sum to infinity'), `gp solve: 3, 6, 12 … term 10 and S10 (${await ans()})`);
    await pre(1); check((await ans()) === 'Term 5 is 2/9 and the sum of the first 5 terms is 242/9; the sum to infinity is 27.' && (await work()).includes('= 27'), `gp solve: sum to infinity 27 (${await ans()})`);
    await pre(2); check((await ans()) === 'Yes, it is a GP with first term 5 and common ratio 3.' && (await work()).includes('135, 405, 1215') && (await work()).includes('Sₙ = 65'), `gp solve: list is a GP (${await ans()})`);
    await page.fill(K('list'), '2, 4, 7'); check((await ans()) === 'This is not a geometric progression.' && (await work()).includes('neither a GP nor an AP'), 'gp solve: neither');
    await page.fill(K('list'), '2, 4, 6'); check((await ans()).includes('It is an AP with common difference 2'), 'gp solve: AP spotted');
    await page.fill(K('list'), '1/2, 1/4, 1/8'); check((await ans()) === 'Yes, it is a GP with first term 1/2 and common ratio 1/2.', `gp solve: fractions in the list (${await ans()})`);
    await page.fill(K('list'), '5'); check((await txt('.gp-serr')).includes('at least two'), 'gp solve: one term message');
    await pre(3); check((await ans()) === 'The first term is a = 3 and the common ratio is r = 2.' && (await work()).includes('r^3 = 96/12 = 8'), `gp solve: two terms (${await ans()})`);
    await page.fill(K('p'), '1'); await page.fill(K('x'), '2'); await page.fill(K('q'), '3'); await page.fill(K('y'), '18');
    check((await ans()) === 'Two GPs fit: a = 2, r = 3; or a = 2, r = −3.', `gp solve: even gap gives two ratios (${await ans()})`);
    await page.fill(K('y'), '-18'); check((await txt('.gp-serr')).includes('No real ratio'), 'gp solve: no real ratio');
    await pre(4); check((await ans()) === '486 is term number 6.' && (await work()).includes('3^(n − 1) = 243'), `gp solve: which term (${await ans()})`);
    await page.fill(K('t'), '100'); check((await ans()) === '100 is not a term of this GP.', 'gp solve: not a term');
    await page.fill(K('a'), '3'); await page.fill(K('r'), '-2'); await page.fill(K('t'), '-96'); check((await ans()) === '−96 is term number 6.', `gp solve: negative ratio (${await ans()})`);
    await pre(5); check((await ans()) === '10 terms are needed: S10 = 1023.' && (await work()).includes('S9 = 511'), `gp solve: terms for a sum (${await ans()})`);
    await page.fill(K('r'), '1/2'); await page.fill(K('t'), '3'); check((await ans()) === 'The sum never reaches 3: it stays below 2.', `gp solve: sum cannot reach (${await ans()})`);
    await pre(6); check((await ans()).startsWith('Two answers: r = 2 gives 3, 6, 12, 24, 48;') && (await work()).includes('r = −2: the means are −6, 12, −24'), `gp solve: means (${await ans()})`);
    await page.fill(K('a'), '2'); await page.fill(K('b'), '54'); await page.fill(K('m'), '2'); check((await ans()) === 'The 2 means are 6, 18 (r = 3).', `gp solve: single ratio for odd gap (${await ans()})`);
    await pre(0); await page.fill(K('r'), '1'); await page.fill(K('a'), '5'); await page.fill(K('n'), '4');
    check((await ans()).startsWith('Term 4 is 5 and the sum of the first 4 terms is 20') && (await work()).includes('r = 1, so every term is 5'), `gp solve: r = 1 (${await ans()})`);
    await page.fill(K('n'), '0'); check((await txt('.gp-serr')).includes('whole number from 1'), 'gp solve: n = 0 message');
    await page.fill(K('n'), ''); check((await txt('.gp-serr')).includes('Type a number'), 'gp solve: blank n message');
    await page.fill(K('r'), '10'); await page.fill(K('a'), '2'); await page.fill(K('n'), '400'); check((await txt('.gp-serr')).includes('too large'), 'gp solve: huge result gives a message, not Infinity');
    await page.fill(K('n'), '10'); await page.fill(K('r'), '2'); await page.fill(K('a'), '3'); check(await page.isVisible(R + '.gp-show'), 'gp solve: draw button offered');
    await page.click(R + '.gp-show'); await page.waitForTimeout(100);
    check((await page.inputValue(R + '.gp-n')) === '10' && (await txt('.gp-s')).endsWith('= 3069'), `gp solve: draw on the graph (${await txt('.gp-s')})`);
  }
  check((await page.$$(R + '.sm-q')).length === 5, 'gp: five questions');
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= ([\d,./]+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/,/g, '') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `gp: quiz ${i} (${w})`);
  }
};
