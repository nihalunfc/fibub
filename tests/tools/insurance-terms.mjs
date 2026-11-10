// #1950 Insurance terms explained
export const path = '/money/insurance-terms/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/insurance-terms/`); await page.waitForTimeout(300);
  const cards = async () => (await page.$$('.it .it-card')).length;
  const all = await cards();
  check(all >= 40, 'insurance-terms: about 40 terms listed (' + all + ')');
  await page.fill('.it .it-q', 'deductible'); await page.waitForTimeout(100);
  const n = await cards();
  check(n >= 1 && n < all / 2, 'insurance-terms: "deductible" hides most cards (' + n + ')');
  check((await page.textContent('.it .it-list')).includes('Deductible'), 'insurance-terms: the deductible card shows');
  await page.fill('.it .it-q', ''); await page.selectOption('.it .it-region', 'IN'); await page.waitForTimeout(100);
  check((await page.textContent('.it .it-list')).includes('IDV'), 'insurance-terms: region IN shows the IDV card');
  await page.selectOption('.it .it-region', 'US'); await page.waitForTimeout(100);
  check(!(await page.textContent('.it .it-list')).includes('IDV'), 'insurance-terms: region US hides the IDV card');
  await page.selectOption('.it .it-region', ''); await page.fill('.it .it-q', 'zzzxq'); await page.waitForTimeout(100);
  check(await page.isVisible('.it .it-none') && (await page.textContent('.it .it-none')).includes('No term matches'), 'insurance-terms: nonsense word shows "No term matches"');
};
