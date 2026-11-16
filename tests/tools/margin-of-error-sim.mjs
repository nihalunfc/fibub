// #L333 Margin of error
export const path = '/learn/margin-of-error-sim/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/margin-of-error-sim/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.me .me-out', 'data-' + k).then(Number);
  check(Math.abs((await at('moe')) - 0.049) < 0.001, 'margin-of-error-sim: n = 400, 50% gives about 4.9 points');
  check((await at('polls')) === 100 && (await at('hit')) > 80, 'margin-of-error-sim: 100 polls, most reach the true share');
  await page.fill('.me .me-n', '1600'); await page.dispatchEvent('.me .me-n', 'input');
  check(Math.abs((await at('moe')) - 0.0245) < 0.001, 'margin-of-error-sim: four times the people halves the margin');
  { const a = await page.getAttribute('.me .lq-item', 'data-ans'); await page.fill('.me .lq-in', a); await page.click('.me .lq-check');
    check((await page.textContent('.me .lq-fb')) === 'Right.', 'margin-of-error-sim: quiz accepts the right answer'); }
};
