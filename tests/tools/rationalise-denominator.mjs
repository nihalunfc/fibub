// #1277 Rationalise the denominator
export const path = '/learn/rationalise-denominator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rationalise-denominator/`); await page.waitForSelector('.rd .rd-fig rect');
  const R = '.rd ', txt = (s) => page.textContent(R + s);
  check((await txt('.rd-q')) === '5/(3 − √2)' && (await txt('.rd-ans')) === '5/(3 − √2) = (15 + 5√2)/7', 'rationalise: example answer');
  const st = await txt('.rd-steps');
  check(st.includes('(3 + √2)/(3 + √2)') && st.includes('(3 − √2)(3 + √2) = 3² − (√2)² = 9 − 2 = 7') && st.includes('5 × (3 + √2) = 15 + 5√2'), `rationalise: steps (${st})`);
  check((await txt('.rd-check')).includes('≈ 3.15301 and (15 + 5√2)/7 ≈ 3.15301'), 'rationalise: decimal check');
  check((await page.$$(R + '.rd-fig rect')).length === 4 && (await txt('.rd-figt')).includes('9 − 2 = 7'), 'rationalise: conjugate picture');
  await page.fill(R + '.rd-k', '1'); await page.fill(R + '.rd-a', '2'); await page.fill(R + '.rd-b', '1'); await page.fill(R + '.rd-n', '3');
  check((await txt('.rd-ans')) === '1/(2 + √3) = 2 − √3', 'rationalise: 1/(2 + √3)');
  await page.click(R + '.rd-kind button[data-k="root"]');
  check(await page.isHidden(R + '.rd-fa'), 'rationalise: a box hidden for k/√n');
  await page.fill(R + '.rd-k', '3'); await page.fill(R + '.rd-n', '12');
  check((await txt('.rd-ans')) === '3/√12 = √3/2' && (await txt('.rd-steps')).includes('after simplifying'), 'rationalise: 3/√12 simplifies');
  await page.click(R + '.rd-kind button[data-k="two"]');
  await page.fill(R + '.rd-k', '1'); await page.fill(R + '.rd-m', '5'); await page.fill(R + '.rd-n', '3');
  check((await txt('.rd-ans')) === '1/(√5 + √3) = (√5 − √3)/2', 'rationalise: 1/(√5 + √3)');
  await page.selectOption(R + '.rd-s', '-1'); check((await txt('.rd-ans')) === '1/(√5 − √3) = (√5 + √3)/2', 'rationalise: 1/(√5 − √3)');
  await page.fill(R + '.rd-m', '3'); check(!(await page.isHidden(R + '.rd-err')) && (await txt('.rd-err')).includes('different'), 'rationalise: m = n refused');
  await page.click(R + '.rd-kind button[data-k="binom"]'); await page.fill(R + '.rd-a', '2'); await page.fill(R + '.rd-b', '1'); await page.fill(R + '.rd-n', '4');
  check((await txt('.rd-err')).includes('a² − b²n = 0'), 'rationalise: zero bottom explained');
  await page.fill(R + '.rd-n', '0'); check((await txt('.rd-err')).includes('n from 1'), 'rationalise: n = 0 refused');
  await page.fill(R + '.rd-n', '3');
  check((await page.$$(R + '.sm-q')).length === 4, 'rationalise: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const ans = i === 1 ? /= (\d+)√\d+\.$/.exec(wk)[1] : i === 2 ? /p = (\d+), q = −1/.exec(wk)[1] + ', -1' : i === 3 ? /answer is √(\d+) − √(\d+)/.exec(wk).slice(1, 3).join(', ') : /≈ ([\d.]+)\.$/.exec(wk)[1];
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, ans); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `rationalise: quiz ${i} (${wk})`);
  }
};
