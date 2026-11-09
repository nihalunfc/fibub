// Insect trap counts to a population index (plain maths, no DOM): catch per trap per day (or night or week),
// centred moving averages, flight peaks, per-site and per-week summaries, and threshold flags.

export type TrapRow = { date: string; site: string; traps: number; count: number; days?: number };
export type IndexRow = TrapRow & { days: number; trapDays: number; index: number; smooth: number; flagged: boolean; peak: boolean };

const DAY = 864e5;
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / DAY);

/** ISO 8601 week of a date, as "2026-W21". */
export function isoWeek(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z'), wd = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - wd + 3); // Thursday of this week decides the year
  const y = d.getUTCFullYear(), w = Math.ceil(((d.getTime() - Date.UTC(y, 0, 1)) / DAY + 1) / 7);
  return `${y}-W${String(w).padStart(2, '0')}`;
}

export type Options = {
  /** Days the traps were out before the first check of each site, when no days column is given. */
  firstDays: number;
  /** Centred moving average over this many checks (odd: 1 = none, 3, 5). */
  window: number;
  /** Index unit: per trap per day (1) or per trap per week (7). */
  per: number;
  /** Flag checks whose index is at or above this (NaN = no flags). */
  threshold: number;
  /** A peak must reach this share of the site's highest smoothed value (0 to 1). */
  peakShare: number;
};

/**
 * Index for every check: count ÷ (traps × days) × per. Days come from the row, else from the gap since
 * the site's previous check, else `firstDays`. Rows are sorted by site then date.
 */
export function trapIndex(rows: TrapRow[], o: Options): IndexRow[] {
  const sites = [...new Set(rows.map((r) => r.site))];
  const out: IndexRow[] = [];
  for (const s of sites) {
    const rs = rows.filter((r) => r.site === s).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    const part: IndexRow[] = rs.map((r, i) => {
      const days = r.days != null && Number.isFinite(r.days) ? r.days : i ? daysBetween(rs[i - 1].date, r.date) : o.firstDays;
      const trapDays = r.traps * days, index = trapDays > 0 ? (r.count / trapDays) * o.per : NaN;
      return { ...r, days, trapDays, index, smooth: NaN, flagged: false, peak: false };
    });
    const k = Math.max(1, Math.round(o.window));
    part.forEach((r, i) => {
      // Centred mean of the index over k checks (fewer at the start and end of the season).
      const half = Math.floor((k - 1) / 2), w = part.slice(Math.max(0, i - half), i + (k - 1 - half) + 1).map((x) => x.index).filter(Number.isFinite);
      r.smooth = w.length ? w.reduce((a, b) => a + b, 0) / w.length : NaN;
      r.flagged = Number.isFinite(o.threshold) && r.index >= o.threshold;
    });
    const top = Math.max(...part.map((r) => r.smooth).filter(Number.isFinite));
    part.forEach((r, i) => {
      const prev = i ? part[i - 1].smooth : -Infinity, next = i + 1 < part.length ? part[i + 1].smooth : -Infinity;
      r.peak = r.smooth > 0 && r.smooth > prev && r.smooth >= next && r.smooth >= o.peakShare * top;
    });
    out.push(...part);
  }
  return out;
}

export type SiteSummary = { site: string; checks: number; catch: number; trapDays: number; index: number; meanIndex: number; maxIndex: number; maxDate: string; peaks: string[]; firstFlag: string; flagged: number };
/** Per-site totals: the season index is total catch ÷ total trap-days (× per), so long or busy checks weigh more. */
export function summarise(rows: IndexRow[], per: number): SiteSummary[] {
  return [...new Set(rows.map((r) => r.site))].map((site) => {
    const rs = rows.filter((r) => r.site === site), ok = rs.filter((r) => Number.isFinite(r.index));
    const c = rs.reduce((s, r) => s + r.count, 0), td = rs.reduce((s, r) => s + r.trapDays, 0);
    const mx = ok.reduce((m, r) => (r.index > m.index ? r : m), ok[0] ?? rs[0]);
    return { site, checks: rs.length, catch: c, trapDays: td, index: td > 0 ? (c / td) * per : NaN, meanIndex: ok.length ? ok.reduce((s, r) => s + r.index, 0) / ok.length : NaN,
      maxIndex: mx?.index ?? NaN, maxDate: mx?.date ?? '', peaks: rs.filter((r) => r.peak).map((r) => r.date), firstFlag: rs.find((r) => r.flagged)?.date ?? '', flagged: rs.filter((r) => r.flagged).length };
  });
}

/** Week × site table of pooled indices: catch ÷ trap-days of the checks dated in that ISO week (× per). */
export function byWeek(rows: IndexRow[], per: number): { weeks: string[]; sites: string[]; cell: (number | null)[][] } {
  const sites = [...new Set(rows.map((r) => r.site))], weeks = [...new Set(rows.map((r) => isoWeek(r.date)))].sort();
  const cell = weeks.map((w) => sites.map((s) => {
    const rs = rows.filter((r) => r.site === s && isoWeek(r.date) === w), td = rs.reduce((a, r) => a + r.trapDays, 0);
    return rs.length && td > 0 ? (rs.reduce((a, r) => a + r.count, 0) / td) * per : null;
  }));
  return { weeks, sites, cell };
}
