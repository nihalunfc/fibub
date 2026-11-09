// #398 Breeding calendar: dates checked against Python datetime + timedelta; the .ics file parsed with the
// Python icalendar 7.3 library in the cross-check (39 events, every date as expected).
import { SPECIES, dayOf, iso, nice, plan, readMatings, events, ics, fold, csvRows, EXAMPLE } from '../../src/lib/sci/breeding.ts';
export default async (check) => {
  const sp = (id) => SPECIES.find((s) => s.id === id);
  check('breeding: dates read', iso(dayOf('2026-01-12')) === '2026-01-12' && iso(dayOf('14 Mar 2026')) === '2026-03-14' && iso(dayOf('2026/3/4')) === '2026-03-04' && Number.isNaN(dayOf('2026-02-30')) && Number.isNaN(dayOf('12/01/2026')));
  { const p = plan('Daisy', dayOf('2026-01-12'), sp('cow'), 2);
    check('breeding: cow mated 2026-01-12 (Python datetime)', iso(p.due) === '2026-10-22' && iso(p.early) === '2026-10-12' && iso(p.late) === '2026-11-01' && iso(p.check) === '2026-02-16' && p.heats.map(iso).join() === '2026-02-02,2026-02-23');
    check('breeding: weekday of the due date', nice(p.due) === 'Thu 22 Oct 2026'); }
  { const p = plan('Ewe', dayOf('2026-09-20'), sp('ewe'), 2); check('breeding: ewe across a year end', iso(p.due) === '2027-02-14' && iso(p.late) === '2027-02-19' && p.heats.map(iso).join() === '2026-10-07,2026-10-24'); }
  { const p = plan('Sow', dayOf('2026-10-01'), sp('sow'), 1); check('breeding: sow 114 days', iso(p.due) === '2027-01-23' && iso(p.check) === '2026-10-29' && p.heats.length === 1); }
  { const p = plan('Bella', dayOf('2026-03-14'), sp('bitch'), 2); check('breeding: bitch heats about 6 months apart', iso(p.due) === '2026-05-16' && p.heats.map(iso).join() === '2026-09-10,2027-03-09'); }
  { const p = plan('Fluffy', dayOf('2024-02-29'), sp('rabbit'), 3); check('breeding: rabbit from a leap day, no heat dates', iso(p.due) === '2024-03-31' && iso(p.check) === '2024-03-12' && p.heats.length === 0); }
  { const r = readMatings(EXAMPLE + '\nBad, 2026-02-30\nX; 2026-05-01; llama\nSam\tMar 3 2026', sp('ewe'));
    check('breeding: example matings read, header skipped', r.plans.length === 5 && r.plans[0].species.id === 'cow' && r.plans[3].species.id === 'sow' && r.plans[4].species.id === 'ewe');
    check('breeding: bad lines reported', r.errors.length === 3 && r.errors[0].includes('"2026-02-30" is not a date') && r.errors[1].includes('unknown species "llama"'));
    const ev = events(r.plans);
    check('breeding: events in date order', ev.length === 5 * 5 && ev.every((e, k) => !k || ev[k - 1].day <= e.day) && ev[0].title === 'Watch for heat (1): Daisy 214');
    const t = ics(ev, new Date(Date.UTC(2026, 10, 9, 12)));
    const lines = t.split('\r\n');
    check('breeding: ics structure', t.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n') && t.endsWith('END:VCALENDAR\r\n') && (t.match(/BEGIN:VEVENT/g) || []).length === 25 && t.includes('DTSTAMP:20261109T120000Z') && t.includes('DTSTART;VALUE=DATE:20261012\r\nDTEND;VALUE=DATE:20261102'));
    check('breeding: ics lines at most 75 octets', lines.every((l) => new TextEncoder().encode(l).length <= 75));
    check('breeding: ics text escaped', ics([{ ...ev[0], title: 'A, b; c' }], new Date(0)).includes('SUMMARY:A\\, b\\; c'));
    const rows = csvRows(r.plans); check('breeding: CSV rows', rows.length === 6 && rows[1].join() === 'Daisy 214,Cow,2026-01-12,2026-02-16,2026-02-02,2026-02-23,,2026-10-12,2026-10-22,2026-11-01,283'); }
  check('breeding: folding keeps UTF-8 characters whole', fold('DESCRIPTION:' + 'é'.repeat(80)).split('\r\n').map((l) => new TextEncoder().encode(l).length).join() === '74,75,25');
};
