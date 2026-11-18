// #T1024 Mix planner
export const path = '/everyday/harmonic-mixing/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/harmonic-mixing/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.hm .hm-out')).length > 0, 'harmonic-mixing: shows a result');
};
