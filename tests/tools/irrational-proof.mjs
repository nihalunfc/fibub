// #1318 Why √2 is irrational
export const path = '/learn/irrational-proof/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/irrational-proof/`); await page.waitForSelector('.ir .ir-ab');
  const R = '.ir ', txt = (s) => page.textContent(R + s);
  check((await txt('.ir-ab')) === 'a/b = 7/5' && (await txt('.ir-out')).includes('a² − 2b² = −1') && (await txt('.ir-fig')).includes('Off by 1'), 'irrational: n 2, b 5 gives 7/5, off by 1');
  check((await txt('.ir-dig')).includes('1.4142135623730950488016887242096980785696'), 'irrational: 40 digits of √2');
  await page.fill(R + '.ir-b', '29'); await page.waitForTimeout(80);
  check((await txt('.ir-ab')) === 'a/b = 41/29' && (await txt('.ir-out')).includes('1,681') && (await txt('.ir-out')).includes('1,682'), 'irrational: b 29 gives 41/29');
  await page.fill(R + '.ir-n', '9'); await page.waitForTimeout(80);
  check((await txt('.ir-fig')).includes('Equal!') && (await txt('.ir-out')).includes('perfect square') && (await txt('.ir-dnote')).includes('rational'), 'irrational: n 9 meets');
  // Proof stepper.
  check((await page.$$(R + '.ir-steps li')).length === 1, 'irrational: proof starts with one step');
  for (let i = 0; i < 6; i++) await page.click(R + '.ir-next');
  check((await page.$$(R + '.ir-steps li')).length === 7 && await page.isDisabled(R + '.ir-next') && (await txt('.ir-steps')).includes('b² = 2c²'), 'irrational: seven steps for √2');
  await page.selectOption(R + '.ir-p', '5'); await page.waitForTimeout(80);
  check((await txt('.ir-steps')).includes('b² = 5c²') && (await txt('.ir-mod')).includes('2² → 4') && (await txt('.ir-mod')).includes('4² → 1'), 'irrational: p = 5 steps and remainders');
  await page.click(R + '.ir-reset');
  check((await page.$$(R + '.ir-steps li')).length === 1, 'irrational: start again');
  await page.click(R + '.ir-which button[data-w="sum"]'); await page.click(R + '.ir-all'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ir-steps li')).length === 5 && (await txt('.ir-steps')).includes('5 + 2√5') && (await txt('.ir-steps')).includes('(x − 5) / 2'), 'irrational: 5 + 2√5 proof');
  await page.fill(R + '.ir-s', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.ir-err'), 'irrational: s = 0 message');
  await page.fill(R + '.ir-s', '-3'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.ir-err') && (await txt('.ir-steps')).includes('5 − 3√5'), 'irrational: s = −3');
  check((await page.$$(R + '.sm-q')).length === 4, 'irrational: four questions');
  const res = [/a = (\d+)\.$/, /k = (\d+)\.$/, /= (\d+\/\d+)\. Its/, /= ([−\d]+)\.$/];
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace('/', ', ') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `irrational: quiz ${i} (${w})`);
  }
};
