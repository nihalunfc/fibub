// #T920 Ovulation calendar
import { readFileSync } from 'node:fs';
export const path = '/everyday/ovulation-calendar/';
export default async ({ page, check, BASE, OUT }) => {
  await page.goto(`${BASE}/everyday/ovulation-calendar/`); await page.waitForTimeout(300);
  const R = '.oc ';
  const a = (k) => page.getAttribute(R + '.oc-big', 'data-' + k);
  check((await a('ov')) === '2026-11-15', `ovulation: 1 Nov, 28 days -> 15 Nov (${await a('ov')})`);
  check((await a('f0')) === '2026-11-10' && (await a('f1')) === '2026-11-16' && (await a('next')) === '2026-11-29', 'ovulation: window 10-16 Nov, next period 29 Nov');
  check((await page.getAttribute(R + '[data-d="2026-11-15"]', 'data-k')) === 'ovu' && (await page.getAttribute(R + '[data-d="2026-11-03"]', 'data-k')) === 'per' && (await page.getAttribute(R + '[data-d="2026-11-29"]', 'data-k')) === 'per', 'ovulation: calendar marks O and P days');
  check((await page.locator(R + '.oc-rows tr').count()) === 6, 'ovulation: 6 cycles listed');
  check((await page.evaluate(() => localStorage.getItem('fibub-cycle-v1'))) === null, 'ovulation: nothing stored by default');
  if (OUT) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.oc-ics')]); const f = OUT + 'ovulation.ics'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('BEGIN:VCALENDAR') && t.includes('DTSTART;VALUE=DATE:20261115'), 'ovulation: .ics download'); }
  await page.fill(R + '.oc-cyc', '32'); await page.waitForTimeout(100);
  check((await a('ov')) === '2026-11-19', 'ovulation: 32-day cycle -> 19 Nov');
};
