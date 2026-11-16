// Bill calendar: .ics export
export const path = '/money/bill-calendar/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/bill-calendar/`); await page.waitForTimeout(300);
  await page.click('.bc .bc-sample'); await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelectorAll('.bc details').forEach((d) => (d.open = true)));
  check(await page.isVisible('.bc .s-ics'), 'bill-calendar: ics button is there');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.bc .s-ics')]);
  check(dl.suggestedFilename() === 'bills.ics', 'bill-calendar: downloads bills.ics');
};
