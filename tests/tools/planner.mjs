// Planner: print button
export const path = '/everyday/planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/planner/`); await page.waitForTimeout(400);
  check(await page.isVisible('.pl .pl-print'), 'planner: print button is there');
};
