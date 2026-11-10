// #T934 Expiry reminders
import { readFileSync } from 'node:fs';
export const path = '/everyday/document-expiry/';
export default async ({ page, check, BASE, OUT }) => {
  await page.goto(`${BASE}/everyday/document-expiry/`); await page.waitForTimeout(300);
  const R = '.de ';
  const first = R + '.de-rows tr:first-child';
  const second = R + '.de-rows tr:nth-child(2)';
  check((await page.getAttribute(second, 'data-rem')) === '2026-09-01' && (await page.textContent(second + ' td:nth-child(4)')).includes('(past)'), 'expiry: passport 2027-03-01, 6 months -> remind 2026-09-01, shown as past');
  check((await page.getAttribute(first, 'data-rem')) === '2026-12-15', 'expiry: insurance 2027-01-15, 1 month -> 2026-12-15, sorted first');
  await page.click(R + '.de-add'); await page.waitForTimeout(50);
  await page.fill(R + '.de-item:nth-child(3) [data-f=exp]', '2026-12-01'); await page.selectOption(R + '.de-item:nth-child(3) [data-f=lead]', '0.25'); await page.waitForTimeout(100);
  check((await page.locator(R + '.de-rows tr').count()) === 3 && (await page.getAttribute(first, 'data-rem')) === '2026-11-24', 'expiry: added row sorts first, 1 week -> 2026-11-24');
  check((await page.evaluate(() => localStorage.getItem('fibub-expiry-v1'))) === null, 'expiry: nothing stored by default');
  if (OUT) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.de-ics')]); const f = OUT + 'expiry.ics'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    const n = (s) => t.split(s).length - 1;
    check(t.startsWith('BEGIN:VCALENDAR') && n('BEGIN:VEVENT') === 3 && n('BEGIN:VALARM') === 3 && t.includes('DTSTART;VALUE=DATE:20270301') && t.includes('TRIGGER:-P180DT15H'), `expiry: .ics has 3 events with alarms (${n('BEGIN:VEVENT')}, ${n('BEGIN:VALARM')})`);
  }
};
