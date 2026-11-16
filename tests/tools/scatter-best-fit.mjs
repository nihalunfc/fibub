// #L331 Best-fit line
export const path = '/learn/scatter-best-fit/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/scatter-best-fit/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.sb .sb-out', 'data-' + k).then(Number);
  check((await at('r')) > 0.95, 'scatter-best-fit: study time and score are strongly linked');
  check((await at('mine')) >= (await at('sse')) - 1e-6, 'scatter-best-fit: your line is never better than the best fit');
  await page.click('.sb .sb-set [data-set="2"]');
  check(Math.abs(await at('r')) < 0.4, 'scatter-best-fit: shoe size and score are barely linked');
  { const a = await page.getAttribute('.sb .lq-item', 'data-ans'); await page.fill('.sb .lq-in', a); await page.click('.sb .lq-check');
    check((await page.textContent('.sb .lq-fb')) === 'Right.', 'scatter-best-fit: quiz accepts the right answer'); }
};
