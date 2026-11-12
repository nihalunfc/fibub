// #T891 E-way bill validity
export const path = '/vehicles/eway-bill-validity/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/eway-bill-validity/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.ew .ew-big'), rows = () => page.textContent('.ew .ew-rows');
  check((await big()).startsWith('3 days'), `eway-bill-validity: 450 km normal = 3 days (${await big()})`);
  check((await rows()).includes('end of 13 Nov 2026'), 'eway-bill-validity: entered 10 Nov, 3 days -> ends midnight 13 Nov');
  await page.fill('.ew [data-k="km"]', '45'); await page.selectOption('.ew [data-k="cargo"]', 'odc'); await page.waitForTimeout(80);
  check((await big()).startsWith('3 days'), `eway-bill-validity: 45 km ODC = 3 days (${await big()})`);
  await page.selectOption('.ew [data-k="cargo"]', 'normal'); await page.waitForTimeout(80);
  check((await big()).startsWith('1 day'), 'eway-bill-validity: 45 km normal = 1 day');
  await page.fill('.ew [data-k="value"]', '40000'); await page.waitForTimeout(80);
  check((await page.textContent('.ew .ew-need')).includes('usually not required'), 'eway-bill-validity: 40,000 consignment usually needs none');
};
