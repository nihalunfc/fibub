// #L337 Calorimetry lab
export const path = '/learn/calorimetry-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/calorimetry-lab/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.cl .cl-out')).length > 0, 'calorimetry-lab: shows a result');
  { const a = await page.getAttribute('.cl .lq-item', 'data-ans'); await page.fill('.cl .lq-in', a); await page.click('.cl .lq-check');
    check((await page.textContent('.cl .lq-fb')) === 'Right.', 'calorimetry-lab: quiz accepts the right answer'); }
};
