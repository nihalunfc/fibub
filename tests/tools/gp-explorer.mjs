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
  check((await page.$$(R + '.sm-q')).length === 5, 'gp: five questions');
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= ([\d,./]+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/,/g, '') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `gp: quiz ${i} (${w})`);
  }
};
