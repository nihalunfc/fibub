// #1951 Should I insure this?
export const path = '/money/should-i-insure/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/should-i-insure/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.si [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.si ${c}`);
  const digits = (s) => parseFloat(s.replace(/[^\d.]/g, ''));
  await set('wealth', '100000'); await set('loss', '50000'); await set('p', '1'); await set('prem', '600'); await set('ded', '0'); await set('gamma', '0'); await page.waitForTimeout(100);
  check(Math.round(digits(await txt('.si-s-max'))) === 500, 'should-i-insure: gamma 0 max worth paying 500 (' + (await txt('.si-s-max')) + ')');
  check((await txt('.si-s-load')).includes('20'), 'should-i-insure: loading 20% (' + (await txt('.si-s-load')) + ')');
  await set('gamma', '1'); await page.waitForTimeout(100);
  check(Math.abs(digits(await txt('.si-s-max')) - 691) <= 1, 'should-i-insure: gamma 1 max about 690.8 (' + (await txt('.si-s-max')) + ')');
  check((await txt('.si-one')).includes('1 in 100'), 'should-i-insure: 1 in 100 years helper');
  await set('loss', '150000'); await page.waitForTimeout(100);
  check(await page.isVisible('.si .si-ruin'), 'should-i-insure: loss above savings shows the ruin note');
  await page.click('.si [data-ex="phone"]'); await page.waitForTimeout(100);
  check((await txt('.si-eg')).includes('Example') && (await page.inputValue('.si [data-k="loss"]')) === '300', 'should-i-insure: example button fills and labels the numbers');
  await set('p', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.si .si-err'), 'should-i-insure: zero chance shows a message');
  await set('wealth', '100000'); await set('loss', '50000'); await set('p', '1'); await set('prem', '600'); await set('ded', '1000'); await page.waitForTimeout(100);
  const af = await txt('.si-afford');
  check(af.includes('50%') && af.includes('1,000'), 'should-i-insure: worst case takes 50% of savings, deductible 1,000 (' + af + ')');
  const fd = await txt('.si-fund');
  check(fd.includes('83.3 years') && fd.includes('57%'), 'should-i-insure: fund takes 83.3 years, 57% chance first (' + fd + ')');
  await set('loss', '150000'); await page.waitForTimeout(100);
  check((await txt('.si-afford')).includes('more than the savings'), 'should-i-insure: loss above savings says so');
};
