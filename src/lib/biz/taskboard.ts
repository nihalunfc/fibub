// Fair sharing of a day's tasks between the people on shift. Plain TypeScript, no DOM.
import { parseTable, toNum } from './common.ts';
export type Task = { id: string; name: string; zone: string; min: string; urgent: boolean; due: string };
export type Person = { name: string; start: string; end: string; zones: string };
export type Opts = { travel: number; breakMin: number; from: number | null };
export type Item = { id: string; who: string; seq: number; start: number; finish: number; wait: number; travel: number; late: boolean; overShift: boolean };

export const toMin = (s: string): number | null => { const m = /^(\d{1,2}):(\d{2})/.exec(String(s || '').trim()); if (!m) return null; const h = +m[1], mi = +m[2]; return h > 23 || mi > 59 ? null : h * 60 + mi; };
export const hm = (m: number) => (Number.isFinite(m) ? `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.round(m) % 60).padStart(2, '0')}` : '-');
const zoneSet = (s: string) => new Set(String(s || '').split(/[,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean));

export function problems(tasks: Task[], people: Person[]): string[] {
  const w: string[] = [];
  if (!tasks.length) w.push('Add at least one task.');
  if (!people.length) w.push('Add at least one person.');
  tasks.forEach((t, i) => { const m = toNum(t.min); if (m === '' || m < 1 || m > 600) w.push(`Task ${i + 1} (${t.name || 'no name'}): minutes must be between 1 and 600.`); if (t.due && toMin(t.due) == null) w.push(`Task ${i + 1} (${t.name || 'no name'}): "due by" is not a time like 14:30.`); });
  people.forEach((p, i) => { const a = toMin(p.start), b = toMin(p.end); if (a == null || b == null) w.push(`${p.name || 'Person ' + (i + 1)}: start or end time is missing, so they get no tasks.`); else if (b <= a) w.push(`${p.name || 'Person ' + (i + 1)}: the shift ends before it starts.`); });
  return w;
}

/** Hands out the tasks not yet done. Each step takes the person who is free first and gives them the task that suits best:
 *  due soon or urgent first, in a zone they know, in the zone they are already in, and finishing inside their shift. */
export function assign(tasks: Task[], people: Person[], o: Opts, done: Record<string, boolean> = {}, kept: Item[] = []) {
  const ppl = people.map((p, i) => ({ name: p.name.trim() || `Person ${i + 1}`, st: toMin(p.start), en: toMin(p.end), z: zoneSet(p.zones) })).filter((p) => p.st != null && p.en != null && p.en > p.st!) as { name: string; st: number; en: number; z: Set<string> }[];
  const seen = new Set<string>(); ppl.forEach((p) => { let n = p.name, k = 2; while (seen.has(n)) n = `${p.name} (${k++})`; p.name = n; seen.add(n); });
  const st = ppl.map((p) => ({ ...p, t: o.from == null ? p.st : Math.max(p.st, o.from), zone: '', seq: 0, load: 0, brkAt: p.st + (p.en - p.st) / 2, brk: o.breakMin <= 0 || (o.from != null && o.from >= p.st + (p.en - p.st) / 2) }));
  const by = Object.fromEntries(st.map((p) => [p.name, p]));
  const byTask = Object.fromEntries(tasks.map((t) => [t.id, t]));
  const items: Item[] = [];
  for (const k of kept) { const t = byTask[k.id]; if (!t || !done[k.id]) continue; items.push({ ...k }); const p = by[k.who]; if (p) { p.seq = Math.max(p.seq, k.seq); p.load += k.finish - k.start; p.zone = t.zone.trim().toLowerCase(); } }
  const todo = tasks.filter((t) => !done[t.id] && toNum(t.min) !== '' && +toNum(t.min) >= 1).map((t) => ({ ...t, m: +toNum(t.min), z: t.zone.trim().toLowerCase(), dueM: t.due ? toMin(t.due) : null }));
  const unassigned: string[] = [];
  if (!st.length) return { items, unassigned: todo.map((t) => t.id), people: [] as ReturnType<typeof summary> };
  while (todo.length) {
    const inside = st.filter((p) => p.t < p.en - 5), pool = inside.length ? inside : st;
    const a = pool.reduce((b, x) => (inside.length ? x.t < b.t : x.t - x.en < b.t - b.en) ? x : b);
    if (!a.brk && a.t >= a.brkAt) { a.t += o.breakMin; a.brk = true; }
    let best: { c: number; i: number; start: number; travel: number; wait: number } | null = null;
    todo.forEach((j, i) => {
      const change = a.zone !== '' && j.z !== '' && a.zone !== j.z, travel = change ? o.travel : 0, start = a.t + travel;
      const slack = j.dueM == null ? 480 : Math.max(-120, Math.min(480, j.dueM - (start + j.m)));
      const urg = slack < 120 ? slack * 0.5 : 60 + (slack - 120) * 0.1;
      let c = (change ? o.travel + 40 : 0) + (a.z.size && j.z && !a.z.has(j.z) ? 40 : 0) + urg;
      if (start + j.m > a.en) c += 200; if (j.urgent) c -= 45;
      if (!best || c < best.c || (c === best.c && j.name < todo[best.i].name)) best = { c, i, start, travel, wait: 0 };
    });
    const b = best!, j = todo.splice(b.i, 1)[0];
    let start = b.start;
    if (!a.brk && start + j.m > a.brkAt + 20) { a.t = Math.max(a.t, a.brkAt) + o.breakMin; a.brk = true; start = a.t + b.travel; }
    const finish = start + j.m; a.seq++; a.load += j.m;
    items.push({ id: j.id, who: a.name, seq: a.seq, start, finish, wait: 0, travel: b.travel, late: j.dueM != null && finish > j.dueM, overShift: finish > a.en });
    a.t = finish; a.zone = j.z;
  }
  return { items, unassigned, people: summary(st, items, o) };
}
function summary(st: { name: string; st: number; en: number }[], items: Item[], o: Opts) {
  return st.map((p) => { const mine = items.filter((x) => x.who === p.name), work = mine.reduce((a, x) => a + (x.finish - x.start), 0), avail = Math.max(1, p.en - p.st - (o.breakMin > 0 ? o.breakMin : 0));
    return { name: p.name, count: mine.length, work, avail, load: work / avail, finish: mine.length ? Math.max(...mine.map((x) => x.finish)) : p.st }; });
}
/** How even the work is: the gap between the busiest and the lightest person, in points of their available time. */
export const spread = (p: { load: number }[]) => (p.length ? Math.max(...p.map((x) => x.load)) - Math.min(...p.map((x) => x.load)) : 0);

export function importTasks(text: string): { tasks: Task[]; notes: string[]; error?: string } {
  const t = parseTable(text), notes: string[] = [];
  if (!t.length) return { tasks: [], notes, error: 'Paste some rows first.' };
  let start = 0; if (/name|task|job|room/i.test(t[0][0]) && toNum(t[0][2]) === '') start = 1;
  const out: Task[] = []; let bad = 0;
  t.slice(start).forEach((r, i) => { const m = toNum(r[2]); if (!String(r[0] ?? '').trim() || m === '' || m < 1) { bad++; return; } const u = /^(y|yes|urgent|true|1|x)$/i.test(String(r[3] ?? '').trim()), due = toMin(String(r[4] ?? '')); out.push({ id: 't' + (i + 1), name: String(r[0]).trim(), zone: String(r[1] ?? '').trim(), min: String(m), urgent: u, due: due != null ? hm(due) : '' }); });
  if (bad) notes.push(`${bad} row${bad > 1 ? 's' : ''} skipped: needs a name and minutes.`);
  if (!out.length) return { tasks: [], notes, error: 'No usable rows. Columns: task, area, minutes, urgent (yes or blank), due by (14:30).' };
  return { tasks: out, notes };
}
