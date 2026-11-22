// Bill calendar: .ics export
export const path = '/money/bill-calendar/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/bill-calendar/`); await page.waitForTimeout(300);
  await page.click('.bc .bc-sample'); await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelectorAll('.bc details').forEach((d) => (d.open = true)));
  check(await page.isVisible('.bc .s-ics'), 'bill-calendar: ics button is there');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.bc .s-ics')]);
  check(dl.suggestedFilename() === 'bills.ics', 'bill-calendar: downloads bills.ics');
  await page.click('.bc .bc-new'); await page.waitForTimeout(100);
  await page.fill('.bc-form [name=title]', 'Gym class'); await page.fill('.bc-form [name=amount]', '12'); await page.selectOption('.bc-form [name=repeat]', 'none'); await page.fill('.bc-form [name=time]', '18:30');
  await page.click('.bc-form button[value=save]'); await page.waitForTimeout(150);
  await page.click('.bc .bc-view [data-v=list]'); await page.waitForTimeout(100);
  check((await page.textContent('.bc .bc-list')).includes('6:30 pm'), 'bill-calendar: an optional time shows in the list');
};
