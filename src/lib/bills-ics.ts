// Calendar (.ics) export for the bill calendar: repeating bills become repeating events.
import type { Item } from './bills';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const d8 = (isoDate: string) => isoDate.replace(/-/g, '');
const nextDay = (isoDate: string) => { const [y, m, d] = isoDate.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, ''); };
const fold = (line: string) => { const out: string[] = []; let s = line; while (s.length > 74) { out.push(s.slice(0, 74)); s = ' ' + s.slice(74); } out.push(s); return out.join('\r\n'); };

const RULE: Record<string, string> = { weekly: 'FREQ=WEEKLY', biweekly: 'FREQ=WEEKLY;INTERVAL=2', monthly: 'FREQ=MONTHLY', quarterly: 'FREQ=MONTHLY;INTERVAL=3', yearly: 'FREQ=YEARLY' };

/** An iCalendar file with one all-day event per bill or income item (repeats as RRULE, skipped dates as EXDATE). */
export function itemsIcs(items: Item[], fmtAmount: (n: number) => string, stamp = '20260101T000000Z'): string {
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//fibub//bill calendar//EN', 'CALSCALE:GREGORIAN'];
  for (const it of items) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(it.date)) continue;
    L.push('BEGIN:VEVENT', `UID:${it.id}@fibub.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d8(it.date)}`, `DTEND;VALUE=DATE:${nextDay(it.date)}`);
    L.push(fold(`SUMMARY:${esc(`${it.kind === 'income' ? 'Income' : 'Due'}: ${it.title} ${fmtAmount(it.amount)}`)}`));
    if (it.note) L.push(fold(`DESCRIPTION:${esc(it.note)}`));
    if (it.repeat !== 'none' && RULE[it.repeat]) {
      L.push(`RRULE:${RULE[it.repeat]}${it.until ? `;UNTIL=${d8(it.until)}` : ''}`);
      const ex = Object.keys(it.skip || {}).filter((d) => d >= it.date).sort();
      if (ex.length) L.push(`EXDATE;VALUE=DATE:${ex.map(d8).join(',')}`);
    }
    L.push('BEGIN:VALARM', 'ACTION:DISPLAY', fold(`DESCRIPTION:${esc(it.title)} is due tomorrow`), 'TRIGGER:-P1D', 'END:VALARM', 'END:VEVENT');
  }
  L.push('END:VCALENDAR');
  return L.join('\r\n') + '\r\n';
}
