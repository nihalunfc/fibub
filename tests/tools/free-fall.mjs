// #1485 Free fall
export const path = '/learn/free-fall/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/free-fall/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.ff .ff-out', 'data-' + k).then(Number);
  check((await at('ts')) === (await at('tf')), 'free-fall: no air, equal fall times');
  check(Math.abs((await at('s1')) - 4.9) < 0.001, 'free-fall: s after 1 s is 4.9 m');
  await page.click('.ff .ff-air [data-air="1"]');
  check((await at('tf')) > (await at('ts')) * 2, 'free-fall: with air the feather is much slower');
  check(Math.abs((await at('vtf')) - 2) < 0.01, 'free-fall: drag gives terminal speed (2 m/s feather)');
  { const a = await page.getAttribute('.ff .lq-item', 'data-ans'); await page.fill('.ff .lq-in', a); await page.click('.ff .lq-check');
    check((await page.textContent('.ff .lq-fb')) === 'Right.', 'free-fall: quiz accepts the right answer'); }
};
