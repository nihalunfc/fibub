// #T1050 Chiral amplification lab
export const path = '/science/chiral-amplification/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/chiral-amplification/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.ca .ca-big');
  // Worked example: the example pairs fit K ≈ 32, g ≈ 0.18 and read 44 % at 20 % ligand ee.
  check(/→ product 44\.\d+ % ee/.test(await big()) && /positive/.test(await big()), 'chiral-amplification: example fit reads 44 % at 20 %');
  check(/32\.\d/.test(await page.textContent('.ca .ca-facts')), 'chiral-amplification: example fit gives K ≈ 32');
  // No data, K = 4 and g = 1: no effect at all.
  await page.fill('.ca .ca-data', ''); await page.fill('.ca .ca-K', '4'); await page.fill('.ca .ca-g', '1'); await page.waitForTimeout(400);
  check(/about linear/.test(await big()), 'chiral-amplification: K = 4, g = 1 is linear');
  // Autocatalysis defaults: three batches pass 99 %.
  await page.click('.ca .ca-mode [data-m=auto]'); await page.waitForTimeout(400);
  check(/Batches to reach 99 %\s*3/.test(await page.textContent('.ca .ca-facts')), 'chiral-amplification: Soai climb in three batches');
  await page.fill('.ca .ca-e0', '0'); await page.waitForTimeout(400);
  check(!(await page.isHidden('.ca .ca-err')), 'chiral-amplification: zero starting ee is refused');
};
