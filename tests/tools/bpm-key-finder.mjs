// #T1023 Key finder
export const path = '/everyday/bpm-key-finder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/bpm-key-finder/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.bkf .bkf-out')).length > 0, 'bpm-key-finder: shows a result');
};
