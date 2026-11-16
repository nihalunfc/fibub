// #L337 Calorimetry lab
export const path = '/learn/calorimetry-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/calorimetry-lab/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.cl .cl-out', 'data-' + k).then(Number);
  check(Math.abs((await at('tf')) - 33.24) < 0.05, 'calorimetry-lab: 100 g Al at 95 C into 100 g water at 20 C ends at 33.2 C');
  check(Math.abs((await at('c')) - 0.897) < 0.001, 'calorimetry-lab: working back gives the specific heat of aluminium');
  await page.selectOption('.cl .cl-metal', 'Lead');
  check((await at('tf')) < 33, 'calorimetry-lab: lead warms the water less than aluminium');
  { const a = await page.getAttribute('.cl .lq-item', 'data-ans'); await page.fill('.cl .lq-in', a); await page.click('.cl .lq-check');
    check((await page.textContent('.cl .lq-fb')) === 'Right.', 'calorimetry-lab: quiz accepts the right answer'); }
};
