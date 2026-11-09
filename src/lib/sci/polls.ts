// Polling averages: margin of error for a share and for a lead within one poll, a weighted average (by sample
// size and recency), and a smoothed trend (LOESS or a backward-looking exponential average) with a band for
// sampling error. Shares are fractions (0.42 for 42 %).

export type Poll = { day: number; date: string; pollster: string; n: number; shares: number[] };
export type PollSet = { parties: string[]; polls: Poll[]; notes: string[] };
export type Weighting = 'n' | 'sqrt' | 'equal';
const Z95 = 1.959963984540054;

/** Day number (days since 1970-01-01, UTC) of an ISO date "2026-03-05"; NaN if not a real date. */
export function dayOf(s: string): number {
  const m = s.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return NaN;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d), back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return NaN;
  return t / 86400000;
}
export const dateOf = (day: number) => new Date(Math.round(day) * 86400000).toISOString().slice(0, 10);

/**
 * A pasted table with a header row: a date column (YYYY-MM-DD), a sample-size column (n, sample or size),
 * an optional pollster column, and one column per party with its share (in % or as fractions).
 */
export function parsePolls(rows: string[][]): PollSet {
  if (rows.length < 2) throw new Error('Paste a header row and at least one poll.');
  const head = rows[0].map((h) => h.trim());
  const find = (re: RegExp) => head.findIndex((h) => re.test(h));
  let di = find(/^(date|end date|field ?date|fieldwork|day)$/i); if (di < 0) di = 0;
  const ni = find(/^(n|sample|sample size|size|respondents|base)$/i);
  if (ni < 0) throw new Error('Add a column for sample size, headed "n" or "Sample".');
  const pi = find(/^(pollster|poll|firm|house|source|company)$/i);
  const cols = head.map((_, i) => i).filter((i) => i !== di && i !== ni && i !== pi);
  if (!cols.length) throw new Error('Add at least one column of shares, headed with the party or option name.');
  const notes: string[] = [];
  const polls: Poll[] = [];
  rows.slice(1).forEach((r, k) => {
    const line = k + 2;
    if (r.every((c) => !c.trim())) return;
    const day = dayOf(r[di] ?? '');
    if (!Number.isFinite(day)) throw new Error(`Row ${line}: "${r[di] ?? ''}" is not a date like 2026-03-05.`);
    const n = Number(String(r[ni] ?? '').replace(/[, ]/g, ''));
    if (!(n >= 2) || !Number.isFinite(n)) throw new Error(`Row ${line}: the sample size must be a number of 2 or more.`);
    const shares = cols.map((i) => { const c = String(r[i] ?? '').trim().replace('%', ''); if (c === '') return NaN; const v = Number(c.replace(',', '.')); if (!Number.isFinite(v) || v < 0) throw new Error(`Row ${line}: "${r[i]}" under ${head[i]} is not a share.`); return v; });
    polls.push({ day, date: dateOf(day), pollster: pi >= 0 ? (r[pi] ?? '').trim() : '', n, shares });
  });
  if (!polls.length) throw new Error('Paste at least one poll under the header.');
  // Percent or fraction: decide from the largest row total.
  const maxSum = Math.max(...polls.map((p) => p.shares.filter(Number.isFinite).reduce((a, b) => a + b, 0)));
  if (maxSum > 1.5) { for (const p of polls) p.shares = p.shares.map((s) => s / 100); }
  else notes.push('Shares read as fractions (they add up to about 1 or less).');
  for (const p of polls) if (p.shares.some((s) => s > 1)) throw new Error(`The poll of ${p.date} has a share over 100 %.`);
  polls.sort((a, b) => a.day - b.day);
  return { parties: cols.map((i) => head[i]), polls, notes };
}

/** Margin of error for one share: z·√(deff·p(1−p)/n). */
export const moe = (p: number, n: number, z = Z95, deff = 1) => z * Math.sqrt((deff * p * (1 - p)) / n);
/** Margin of error for the lead p1 − p2 within one poll (both shares from the same sample): z·√(deff·(p1 + p2 − (p1 − p2)²)/n). */
export const leadMoe = (p1: number, p2: number, n: number, z = Z95, deff = 1) => z * Math.sqrt((deff * (p1 + p2 - (p1 - p2) ** 2)) / n);
/** Margin of error at p = 50 %, the figure most polls quote. */
export const headlineMoe = (n: number, z = Z95, deff = 1) => moe(0.5, n, z, deff);

const sizeW = (n: number, w: Weighting) => (w === 'n' ? n : w === 'sqrt' ? Math.sqrt(n) : 1);

/**
 * Weighted average of one party's share at day `at`, using polls up to that day. Weight = size weight × 0.5^(age
 * ÷ half-life). Standard error from each poll's sampling variance only: √(Σ wᵢ²·deff·p(1−p)/nᵢ) ÷ Σ wᵢ, with p the average.
 */
export function average(polls: Poll[], k: number, at: number, halfLife: number, weighting: Weighting, deff = 1) {
  let sw = 0, swp = 0;
  const ws: number[] = [];
  const use: Poll[] = [];
  for (const p of polls) {
    const s = p.shares[k];
    if (p.day > at || !Number.isFinite(s)) { ws.push(0); continue; }
    const w = sizeW(p.n, weighting) * (halfLife > 0 ? 0.5 ** ((at - p.day) / halfLife) : 1);
    ws.push(w); sw += w; swp += w * s; use.push(p);
  }
  if (!(sw > 0)) return { mean: NaN, se: NaN, weights: ws, used: 0, neff: 0 };
  const mean = swp / sw;
  let v = 0, w2 = 0;
  polls.forEach((p, i) => { if (ws[i]) { v += ws[i] ** 2 * (deff * mean * (1 - mean)) / p.n; w2 += ws[i] ** 2; } });
  return { mean, se: Math.sqrt(v) / sw, weights: ws.map((w) => w / sw), used: use.length, neff: (sw * sw) / w2 };
}

export type Trend = { x: number[]; y: number[]; lo: number[]; hi: number[] };

/** Exponential trend: the weighted average evaluated on each day from the first poll to the last. */
export function ewmaTrend(polls: Poll[], k: number, halfLife: number, weighting: Weighting, z = Z95, deff = 1, step = 1): Trend {
  const x: number[] = [], y: number[] = [], lo: number[] = [], hi: number[] = [];
  const a = polls[0].day, b = polls[polls.length - 1].day;
  for (let t = a; t <= b + 1e-9; t += step) {
    const r = average(polls, k, t, halfLife, weighting, deff);
    if (!Number.isFinite(r.mean)) continue;
    x.push(t); y.push(r.mean); lo.push(r.mean - z * r.se); hi.push(r.mean + z * r.se);
  }
  return { x, y, lo, hi };
}

/**
 * LOESS: at each day, a straight line fitted by weighted least squares to the nearest `span` fraction of polls,
 * with tricube distance weights × size weights. The fit is a linear combination ŷ = Σ lᵢ yᵢ, so its sampling
 * standard error is √(Σ lᵢ²·deff·ŷ(1−ŷ)/nᵢ).
 */
export function loessTrend(polls: Poll[], k: number, span: number, weighting: Weighting, z = Z95, deff = 1, step = 1): Trend {
  const P = polls.filter((p) => Number.isFinite(p.shares[k]));
  const N = P.length;
  if (N < 3) throw new Error('A LOESS trend needs at least 3 polls.');
  const q = Math.min(N, Math.max(3, Math.ceil(span * N)));
  const x: number[] = [], y: number[] = [], lo: number[] = [], hi: number[] = [];
  const a = P[0].day, b = P[N - 1].day;
  for (let t = a; t <= b + 1e-9; t += step) {
    const d = P.map((p) => Math.abs(p.day - t));
    const h = [...d].sort((u, v) => u - v)[q - 1] * 1.000001 || 1;
    const w = P.map((p, i) => { const u = d[i] / h; return u < 1 ? (1 - u ** 3) ** 3 * sizeW(p.n, weighting) : 0; });
    // Weighted linear regression centred at t: l_i = w_i (S2 − (x_i − t) S1) / (S0 S2 − S1²).
    let S0 = 0, S1 = 0, S2 = 0;
    P.forEach((p, i) => { const dx = p.day - t; S0 += w[i]; S1 += w[i] * dx; S2 += w[i] * dx * dx; });
    const det = S0 * S2 - S1 * S1;
    const l = P.map((p, i) => (det > 1e-12 * S0 * S0 ? (w[i] * (S2 - (p.day - t) * S1)) / det : w[i] / S0));
    const yh = l.reduce((s, li, i) => s + li * P[i].shares[k], 0);
    const pv = Math.min(Math.max(yh, 0.001), 0.999);
    const se = Math.sqrt(l.reduce((s, li, i) => s + (li * li * deff * pv * (1 - pv)) / P[i].n, 0));
    x.push(t); y.push(yh); lo.push(yh - z * se); hi.push(yh + z * se);
  }
  return { x, y, lo, hi };
}

/** z for a two-sided confidence level (90, 95 or 99 %). */
export const zFor = (level: number) => (level === 90 ? 1.6448536269514722 : level === 99 ? 2.5758293035489004 : 1.959963984540054);
