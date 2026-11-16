// #L342 Rate lab
export const path = '/learn/rate-of-reaction-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rate-of-reaction-lab/`); await page.waitForTimeout(300);
  const t = (s) => page.textContent('.rr ' + s);
  const set = (s, v) => page.$eval('.rr ' + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await t('.rr-out')).startsWith('90% of the gas forms after 46 s'), `rate: default 46 s (${await t('.rr-out')})`);
  await set('.rr-c', 2);
  check((await t('.rr-out')).startsWith('90% of the gas forms after 23 s'), `rate: doubling concentration halves the time (${await t('.rr-out')})`);
  await set('.rr-c', 1); await set('.rr-t', 35);
  const hot = +(/after ([\d.]+) s/.exec(await t('.rr-out'))[1]);
  check(hot > 22 && hot < 26, `rate: +10 °C roughly halves the time (${hot} s)`);
  await set('.rr-t', 25); await page.selectOption('.rr .rr-s', '4');
  check((await t('.rr-out')).startsWith('90% of the gas forms after 12 s'), `rate: powder 4× faster (${await t('.rr-out')})`);
  await page.selectOption('.rr .rr-s', '1'); await page.check('.rr .rr-cat'); await page.click('.rr [data-level=alevel]');
  check((await t('.rr-sub')).includes('35 kJ/mol') && /k = \d/.test(await t('.rr-sub')), `rate: catalyst and A-level k (${await t('.rr-sub')})`);
  { const a = await page.getAttribute('.rr .lq-item', 'data-ans'); await page.fill('.rr .lq-in', a); await page.click('.rr .lq-check');
    check((await page.textContent('.rr .lq-fb')) === 'Right.', 'rate: quiz accepts the right answer'); }
};
