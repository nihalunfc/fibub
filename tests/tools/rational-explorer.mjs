// #L326 Rational explorer
export const path = '/learn/rational-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rational-explorer/`); await page.waitForTimeout(300);
  const facts = async () => (await page.textContent('.rxp .rxp-facts')).replace(/\s+/g, ' ');
  const f0 = await facts();
  check(f0.includes('x = -1, x = 2') && f0.includes('y = 1') && f0.includes('y-intercept3'), 'rational-explorer: worked example ' + f0);
  await page.fill('.rxp [data-k="z1"]', '-1');
  const f1 = await facts();
  check(f1.includes('Holes(-1,') && f1.includes('Vertical asymptotesx = 2'), 'rational-explorer: cancelled factor gives a hole ' + f1);
  await page.check('.rxp .rxp-lin');
  check((await facts()).includes('Horizontal asymptotey = 0'), 'rational-explorer: lower degree on top gives y = 0');
  { const a = await page.getAttribute('.rxp .lq-item', 'data-ans'); await page.fill('.rxp .lq-in', a); await page.click('.rxp .lq-check');
    check((await page.textContent('.rxp .lq-fb')) === 'Right.', 'rational-explorer: quiz accepts the right answer'); }
};
