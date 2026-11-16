// #L330 Normal curve lab
export const path = '/learn/normal-curve-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/normal-curve-lab/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.nc .nc-out', 'data-' + k).then(Number);
  check(Math.abs((await at('z')) - 1.5) < 1e-3, 'normal-curve-lab: x = 85 with mean 70, SD 10 gives z = 1.5');
  check(Math.abs((await at('below')) - 0.93319) < 1e-3, 'normal-curve-lab: 93.3% are below z = 1.5');
  await page.click('.nc .nc-bands [data-k="2"]');
  check(Math.abs((await at('within')) - 0.9545) < 1e-3, 'normal-curve-lab: within 2 SD is 95.4%');
  { const a = await page.getAttribute('.nc .lq-item', 'data-ans'); await page.fill('.nc .lq-in', a); await page.click('.nc .lq-check');
    check((await page.textContent('.nc .lq-fb')) === 'Right.', 'normal-curve-lab: quiz accepts the right answer'); }
};
