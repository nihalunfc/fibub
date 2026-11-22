// Day-by-day price suggestions for a business with limited capacity (rooms, tables, seats, appointments, tours).
// Forecast = bookings now + bookings still to come (last year's pick-up scaled by this year's pace).
// The forecast puts the day in a demand tier; the price starts from competitors' middle price, is moved by the tier,
// then held inside your limits, rounded and floored/capped.
import { clamp, dayDiff, validISO, parseDate, parseTable, toNum } from './common.ts';

export const TIERS = ['Low', 'Moderate', 'High', 'Compression'] as const;
export type Tier = (typeof TIERS)[number];
export type Row = { date: string; ev: boolean; evName: string; otb: number | ''; otbLy: number | ''; finLy: number | ''; bar: number | ''; c0: number | ''; c1: number | ''; c2: number | ''; c3: number | '' };
export type Settings = {
  capacity: number; floor: number; ceiling: number; maxChange: number; position: number; round: '1' | '5' | '0.5' | '9'; sens: 'low' | 'normal' | 'high';
  t1: number; t2: number; t3: number; eventBoost: number; adjLow: number; adjMod: number; adjHigh: number; adjComp: number;
};
const median = (a: number[]) => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };

export function roundPrice(v: number, mode: Settings["round"]) {
  if (mode === '5') return Math.round(v / 5) * 5;
  if (mode === '0.5') return Math.round(v * 2) / 2;
  if (mode === '9') { const r = Math.round(v), up = Math.ceil((r + 1) / 10) * 10 - 1, dn = up - 10; return r - dn < up - r ? dn : up; }
  return Math.round(v);
}

export function settingsProblems(s: Settings): string[] {
  const w: string[] = [], n = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  if (!n(s.capacity) || s.capacity < 1) w.push('Capacity must be at least 1.');
  if (!n(s.floor) || s.floor < 0) w.push('The price floor must be zero or more.');
  if (!n(s.ceiling) || s.ceiling <= 0) w.push('The price ceiling must be more than zero.');
  if (n(s.floor) && n(s.ceiling) && s.floor >= s.ceiling) w.push('The price floor must be lower than the ceiling.');
  if (!n(s.maxChange) || s.maxChange <= 0 || s.maxChange > 100) w.push('The biggest change in one go must be between 1% and 100%.');
  if (!(s.t1 < s.t2 && s.t2 < s.t3)) w.push('Tier thresholds must go up in order: Moderate below High below Compression.');
  (['position', 'eventBoost', 'adjLow', 'adjMod', 'adjHigh', 'adjComp', 't1', 't2', 't3'] as const).forEach((k) => { if (!n(s[k])) w.push('Fill in every number in the settings (one is blank).'); });
  return [...new Set(w)];
}

export function recommend(s: Settings, rows: Row[], today: string, money: (v: number) => string, accept: Record<string, boolean> = {}) {
  const cap = s.capacity, mc = s.maxChange / 100;
  const sensMult = { low: 0.7, normal: 1, high: 1.3 }[s.sens] || 1;
  const adj: Record<Tier, number> = { Low: s.adjLow / 100, Moderate: s.adjMod / 100, High: s.adjHigh / 100, Compression: s.adjComp / 100 };
  const elastic: Record<Tier, number> = { Low: 1.5, Moderate: 1.1, High: 0.7, Compression: 0.3 };
  const out: any[] = [], issues = { badDate: 0, noBar: 0, overCap: 0, lyOdd: 0, past: 0, dup: 0 };
  const seen = new Set<string>();
  rows.forEach((r, idx) => {
    if (!validISO(r.date)) { issues.badDate++; return; }
    if (seen.has(r.date)) { issues.dup++; return; }
    seen.add(r.date);
    const bar = +r.bar;
    if (!(bar > 0)) { issues.noBar++; return; }
    if (dayDiff(today, r.date) < 0) issues.past++;
    let otb = Math.max(0, +r.otb || 0); if (otb > cap) { issues.overCap++; otb = cap; }
    const otbLy = Math.max(0, +r.otbLy || 0), finLyRaw = Math.max(0, +r.finLy || 0);
    if (finLyRaw && finLyRaw < otbLy) issues.lyOdd++;
    const finLy = Math.max(finLyRaw, otbLy);
    const pace = otbLy > 0 ? clamp(otb / otbLy, 0.5, 2) : 1;
    const lyPick = finLy - otbLy;
    const pick = lyPick * pace * (r.ev ? 1 + s.eventBoost / 100 : 1);
    const unc = otb + pick, fc = Math.min(cap, unc), ratio = unc / cap;
    let t = ratio * 100 >= s.t3 ? 3 : ratio * 100 >= s.t2 ? 2 : ratio * 100 >= s.t1 ? 1 : 0;
    const baseTier = t;
    if (r.ev && t < 3) t++;
    const tier = TIERS[t];
    const comps = [r.c0, r.c1, r.c2, r.c3].map(Number).filter((v) => v > 0);
    const med = median(comps);
    const anchor = med ?? bar;
    const paceAdj = clamp((pace - 1) * 0.3, -0.06, 0.06);
    const target = anchor * (1 + s.position / 100) * (1 + adj[tier]) * (1 + paceAdj);
    const notes: string[] = [];
    let rec = target;
    if (rec > bar * (1 + mc)) { rec = bar * (1 + mc); notes.push(`held to your +${s.maxChange}% limit (target was ${money(target)})`); }
    else if (rec < bar * (1 - mc)) { rec = bar * (1 - mc); notes.push(`held to your -${s.maxChange}% limit (target was ${money(target)})`); }
    if (Math.abs(rec - bar) / bar < 0.02) rec = bar; else rec = roundPrice(rec, s.round);
    if (rec < s.floor) { rec = s.floor; notes.push('raised to your floor'); }
    if (rec > s.ceiling) { rec = s.ceiling; notes.push('capped at your ceiling'); }
    if (Math.abs(rec - bar) < 0.005) rec = bar;
    const action = rec > bar ? 'Raise' : rec < bar ? 'Lower' : 'Hold';
    const paceTxt = otbLy <= 0 ? 'no bookings at this point last year' : pace >= 1.03 ? `${Math.round((pace - 1) * 100)}% ahead of last year's pace` : pace <= 0.97 ? `${Math.round((1 - pace) * 100)}% behind last year's pace` : "on last year's pace";
    const evTxt = r.ev ? `, ${r.evName || 'event'}${baseTier < t ? ' (moved up a tier)' : ''}` : '';
    const mkTxt = med ? `competitors' middle price ${money(med)}` : 'no competitor prices, so priced from your current price';
    const reason = `${action}: forecast ${Math.round((fc / cap) * 100)}% full${unc > cap ? ' with more demand than capacity' : ''}, ${paceTxt}${evTxt}; ${mkTxt}${notes.length ? '; ' + notes.join(', ') : ''}.`;
    const acc = accept[r.date] !== false, plan = acc ? rec : bar;
    const e = elastic[tier] * sensMult;
    const pickPlan = pick * Math.pow(plan / bar, -e);
    const roomsCur = fc, roomsPlan = Math.min(cap, otb + pickPlan);
    out.push({ idx, date: r.date, ev: !!r.ev, evName: r.evName || '', otb, otbLy, finLy, pace, unc, fc, occ: fc / cap, tier, med, comps: comps.length, bar, rec, action, reason, acc, plan,
      lead: dayDiff(today, r.date), roomsCur, roomsPlan, revCur: roomsCur * bar, revPlan: Math.min(otb, roomsPlan) * bar + Math.max(0, roomsPlan - otb) * plan });
  });
  return { out, issues };
}

export const blankRow = (date: string): Row => ({ date, ev: false, evName: '', otb: '', otbLy: '', finLy: '', bar: '', c0: '', c1: '', c2: '', c3: '' });

/** Reads a pasted or opened table of days. Headings are matched by name (date, booked now, last year, current price, competitors, event). */
export function importDays(text: string, compNames: string[], max = 90): { rows: Row[]; notes: string[]; error?: string } {
  const t = parseTable(text);
  if (!t.length) return { rows: [], notes: [], error: 'That looks empty. Use the layout shown above the box.' };
  let map: Record<string, number> = {};
  const hasHead = !parseDate(t[0][0]) && t[0].some((c) => /[a-z]/i.test(c));
  if (hasHead) {
    let comp = 0;
    const names = compNames.map((n) => String(n || '').toLowerCase().trim()).filter(Boolean);
    t.shift()!.forEach((h0, i) => {
      const h = String(h0).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      let f: string | null = null;
      if (/event|flag|note|what s on|occasion/.test(h)) f = map.ev == null ? 'ev' : null;
      else if (/^(date|day|night|stay|arrival)/.test(h) || h === 'dt') f = 'date';
      else if (/comp|competitor|rival/.test(h) || names.some((n) => h.includes(n.replace(/[^a-z0-9]+/g, ' ')))) f = comp < 4 ? 'c' + comp++ : null;
      else if (/(ly|last|prior|stly|previous|py)\b/.test(h) && /(final|actual|sold|total)/.test(h)) f = 'finLy';
      else if (/(^ly|\bly\b|last|prior|stly|previous|same time|\bpy\b)/.test(h)) f = 'otbLy';
      else if (/final|actual/.test(h)) f = 'finLy';
      else if (/otb|on the books|booked|books|rooms|reserv|sold/.test(h)) f = 'otb';
      else if (/bar|rate|price|current|adr/.test(h)) f = 'bar';
      if (f && map[f] == null) map[f] = i;
    });
    if (map.date == null) return { rows: [], notes: [], error: 'No date column found. Name the first column "date".' };
  } else map = { date: 0, otb: 1, otbLy: 2, finLy: 3, bar: 4, c0: 5, c1: 6, c2: 7, c3: 8, ev: 9 };
  const dmy = t.some((r) => { const m = String(r[map.date] || '').trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.]\d{2,4}/); return m && +m[1] > 12; });
  const res: Row[] = []; let skipped = 0;
  t.forEach((r) => {
    const d = parseDate(r[map.date], dmy);
    if (!d) { skipped++; return; }
    const row = blankRow(d);
    for (const [f, ci] of Object.entries(map)) {
      if (f === 'date' || r[ci] == null) continue;
      if (f === 'ev') { const s = String(r[ci]).trim(); row.ev = !!s && !/^(0|no|n|false|-)$/i.test(s); if (row.ev && !/^(1|yes|y|x|true)$/i.test(s)) row.evName = s; }
      else (row as any)[f] = toNum(r[ci]);
    }
    res.push(row);
  });
  if (!res.length) return { rows: [], notes: [], error: 'None of the rows had a date we could read. Dates like 2026-10-19, 10/19/2026 or 19-Oct-2026 all work.' };
  res.sort((a, b) => (a.date < b.date ? -1 : 1));
  const uniq: Row[] = []; let dups = 0;
  res.forEach((r) => { if (uniq.length && uniq[uniq.length - 1].date === r.date) { uniq[uniq.length - 1] = r; dups++; } else uniq.push(r); });
  const notes: string[] = [];
  if (skipped) notes.push(`skipped ${skipped} row${skipped > 1 ? 's' : ''} without a readable date`);
  if (dups) notes.push(`${dups} repeated date${dups > 1 ? 's' : ''} (kept the last one)`);
  if (uniq.length > max) notes.push(`only the first ${max} days were kept`);
  const missing = (['otb', 'otbLy', 'finLy', 'bar'] as const).filter((f) => map[f] == null);
  if (missing.length) notes.push(`no column found for ${missing.map((f) => ({ otb: 'booked now', otbLy: 'booked last year', finLy: 'final last year', bar: 'current price' })[f]).join(', ')}, so fill those in`);
  return { rows: uniq.slice(0, max), notes };
}
