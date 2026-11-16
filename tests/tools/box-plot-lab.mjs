// #L332 Box plot lab
export const path = '/learn/box-plot-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/box-plot-lab/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.bpl .bpl-out')).length > 0, 'box-plot-lab: shows a result');
  { const a = await page.getAttribute('.bpl .lq-item', 'data-ans'); await page.fill('.bpl .lq-in', a); await page.click('.bpl .lq-check');
    check((await page.textContent('.bpl .lq-fb')) === 'Right.', 'box-plot-lab: quiz accepts the right answer'); }
};
