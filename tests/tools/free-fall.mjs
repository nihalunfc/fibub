// #1485 Free fall
export const path = '/learn/free-fall/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/free-fall/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.ff .ff-out')).length > 0, 'free-fall: shows a result');
  { const a = await page.getAttribute('.ff .lq-item', 'data-ans'); await page.fill('.ff .lq-in', a); await page.click('.ff .lq-check');
    check((await page.textContent('.ff .lq-fb')) === 'Right.', 'free-fall: quiz accepts the right answer'); }
};
