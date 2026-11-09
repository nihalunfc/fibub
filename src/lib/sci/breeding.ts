// Breeding calendar: due date window, pregnancy check and expected returns to heat from a mating date, for a list
// of matings, with CSV and iCalendar (.ics, RFC 5545) output. Dates are whole days in UTC, so daylight saving
// never shifts them. Species lengths are rounded, typical husbandry figures and are editable. No DOM.

export type Species = { id: string; name: string; gestation: number; window: number; cycle: number; check: number; cycleNote?: string };
/** Rounded typical lengths in days (general husbandry facts). Breeds and individuals vary: edit them to suit. */
export const SPECIES: Species[] = [
  { id: 'cow', name: 'Cow', gestation: 283, window: 10, cycle: 21, check: 35 },
  { id: 'ewe', name: 'Ewe', gestation: 147, window: 5, cycle: 17, check: 45 },
  { id: 'doe-goat', name: 'Doe (goat)', gestation: 150, window: 5, cycle: 21, check: 45 },
  { id: 'sow', name: 'Sow', gestation: 114, window: 3, cycle: 21, check: 28 },
  { id: 'mare', name: 'Mare', gestation: 340, window: 15, cycle: 21, check: 14 },
  { id: 'bitch', name: 'Bitch (dog)', gestation: 63, window: 5, cycle: 180, check: 28, cycleNote: 'Dogs come into heat about every 6 months, not every few weeks.' },
  { id: 'queen', name: 'Queen (cat)', gestation: 65, window: 4, cycle: 21, check: 25, cycleNote: 'Cats cycle every 2 to 3 weeks in the breeding season.' },
  { id: 'rabbit', name: 'Doe (rabbit)', gestation: 31, window: 2, cycle: 0, check: 12, cycleNote: 'Rabbits ovulate when mated and have no regular cycle, so no heat dates are given.' },
];

const DAY = 86400000;
const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** Day number (days since 1970-01-01) from "2026-03-14", "2026/3/14" or "14 Mar 2026". NaN if not a real date. */
export function dayOf(s: string): number {
  const t = s.trim();
  let y: number, m: number, d: number;
  let r = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(t);
  if (r) { y = +r[1]; m = +r[2]; d = +r[3]; }
  else if ((r = /^(\d{1,2})\s+([a-z]{3})[a-z]*\.?,?\s+(\d{4})$/i.exec(t)) && MON.includes(r[2].toLowerCase())) { y = +r[3]; m = MON.indexOf(r[2].toLowerCase()) + 1; d = +r[1]; }
  else return NaN;
  const ms = Date.UTC(y, m - 1, d), dt = new Date(ms);
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return NaN;
  return ms / DAY;
}
/** "2026-03-14" from a day number. */
export const iso = (day: number) => new Date(day * DAY).toISOString().slice(0, 10);
/** "Sat 14 Mar 2026" from a day number. */
export const nice = (day: number) => { const d = new Date(day * DAY); return `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()]} ${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

export type Plan = { animal: string; species: Species; mated: number; check: number; heats: number[]; due: number; early: number; late: number };
/** Dates that follow from one mating: pregnancy check, the next `nHeats` heats if she does not hold, and the due date window. */
export function plan(animal: string, mated: number, sp: Species, nHeats = 2): Plan {
  const heats = sp.cycle > 0 ? Array.from({ length: nHeats }, (_, k) => mated + sp.cycle * (k + 1)) : [];
  return { animal, species: sp, mated, check: mated + sp.check, heats, due: mated + sp.gestation, early: mated + sp.gestation - sp.window, late: mated + sp.gestation + sp.window };
}

/** Matings typed one per line: "animal, date" or "animal, date, species" (species by id or name). */
export function readMatings(text: string, fallback: Species, table: Species[] = SPECIES, nHeats = 2): { plans: Plan[]; errors: string[] } {
  const plans: Plan[] = [], errors: string[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((line, k) => {
    const l = line.trim(); if (!l || l.startsWith('#')) return;
    const c = l.split(/[\t;,]/).map((x) => x.trim());
    // A header such as "animal, date".
    if (k === 0 && /^(animal|name|id|tag)$/i.test(c[0]) && Number.isNaN(dayOf(c[1] ?? ''))) return;
    if (c.length < 2) { errors.push(`Line ${k + 1}: give the animal and the mating date, separated by a comma.`); return; }
    const d = dayOf(c[1]);
    if (Number.isNaN(d)) { errors.push(`Line ${k + 1}: "${c[1]}" is not a date. Use 2026-03-14 or 14 Mar 2026.`); return; }
    let sp = fallback;
    if (c[2]) {
      const w = c[2].toLowerCase();
      const f = table.find((s) => s.id === w || s.name.toLowerCase() === w || s.name.toLowerCase().split(' ')[0] === w || s.name.toLowerCase().includes(`(${w})`));
      if (!f) { errors.push(`Line ${k + 1}: unknown species "${c[2]}"; using ${fallback.name}.`); } else sp = f;
    }
    plans.push(plan(c[0] || `Animal ${plans.length + 1}`, d, sp, nHeats));
  });
  return { plans, errors };
}

export type Event = { day: number; end?: number; kind: 'check' | 'heat' | 'window' | 'due'; animal: string; title: string; plan: Plan };
/** Every dated event of the plans, in date order. */
export function events(plans: Plan[]): Event[] {
  const out: Event[] = [];
  for (const p of plans) {
    out.push({ day: p.check, kind: 'check', animal: p.animal, title: `Pregnancy check: ${p.animal}`, plan: p });
    p.heats.forEach((h, k) => out.push({ day: h, kind: 'heat', animal: p.animal, title: `Watch for heat (${k + 1}): ${p.animal}`, plan: p }));
    out.push({ day: p.early, end: p.late, kind: 'window', animal: p.animal, title: `Due window: ${p.animal}`, plan: p });
    out.push({ day: p.due, kind: 'due', animal: p.animal, title: `Due: ${p.animal} (${p.species.name})`, plan: p });
  }
  return out.sort((a, b) => a.day - b.day || a.animal.localeCompare(b.animal));
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
/** Folds a content line to 75 octets (RFC 5545 section 3.1), never splitting a UTF-8 character. */
export function fold(line: string): string {
  const enc = new TextEncoder(); const parts: string[] = []; let cur = '', size = 0, limit = 75;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (size + n > limit) { parts.push(cur); cur = ''; size = 0; limit = 74; }
    cur += ch; size += n;
  }
  parts.push(cur);
  return parts.join('\r\n ');
}
const dt = (day: number) => iso(day).replace(/-/g, '');
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'animal';
/** An iCalendar file of all-day events. `stamp` is when it was made (DTSTAMP). */
export function ics(evs: Event[], stamp: Date): string {
  const st = stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//fibub.com//Breeding calendar//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Breeding calendar'];
  for (const e of evs) {
    const p = e.plan;
    const desc = `Mated ${iso(p.mated)}. ${p.species.name}: gestation about ${p.species.gestation} days. Expected due ${iso(p.due)} (window ${iso(p.early)} to ${iso(p.late)}). Typical figures only: check with your vet.`;
    L.push('BEGIN:VEVENT', `UID:${slug(e.animal)}-${dt(p.mated)}-${e.kind}-${dt(e.day)}@fibub.com`, `DTSTAMP:${st}`, `DTSTART;VALUE=DATE:${dt(e.day)}`, `DTEND;VALUE=DATE:${dt((e.end ?? e.day) + 1)}`, `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(desc)}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  L.push('END:VCALENDAR');
  return L.map(fold).join('\r\n') + '\r\n';
}

/** The plans as CSV rows. */
export const csvRows = (plans: Plan[]) => [
  ['animal', 'species', 'mated', 'pregnancy_check', 'heat_1', 'heat_2', 'heat_3', 'due_earliest', 'due', 'due_latest', 'gestation_days'],
  ...plans.map((p) => [p.animal, p.species.name, iso(p.mated), iso(p.check), ...[0, 1, 2].map((k) => (p.heats[k] !== undefined ? iso(p.heats[k]) : '')), iso(p.early), iso(p.due), iso(p.late), String(p.species.gestation)]),
];

/** Made-up example matings. */
export const EXAMPLE = `Animal, mating date, species
Daisy 214, 2026-01-12, cow
Bluebell 230, 2026-02-03, cow
Ewe 18, 2026-09-20, ewe
Sow 7, 2026-10-01, sow`;
