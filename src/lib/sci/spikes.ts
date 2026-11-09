// Spike trains: reading spike times, firing rate, inter-spike intervals (ISI), CV, Fano factor, PSTH and
// autocorrelogram. Plain maths, no DOM. Histograms follow numpy.histogram: bins [a, b), the last one [a, b].
import { num } from './num.ts';
import { rng } from './spectro.ts';

export type Train = { name: string; t: number[] };
export type Layout = 'lines' | 'pairs' | 'columns';

/**
 * Reads spike times (converted to seconds).
 * - lines: one train per line, times separated by spaces, commas, semicolons or tabs; an optional label before a colon.
 * - pairs: two columns, train label (or number) then spike time, one spike per row.
 * - columns: one train per column, the first row may hold names; blank cells are skipped.
 */
export function parseTrains(text: string, layout: Layout, unit: 's' | 'ms' = 's'): Train[] {
  const k = unit === 'ms' ? 1e-3 : 1, lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const bad = (where: string, cell: string) => new Error(`${where}: "${cell}" is not a number.`);
  let trains: Train[] = [];
  if (layout === 'lines') {
    lines.forEach((l, i) => {
      const m = l.match(/^([^:]*[^\d\s.,:;-][^:]*):(.*)$/);
      const name = m ? m[1].trim() : `Train ${trains.length + 1}`, body = m ? m[2] : l;
      const cells = body.split(/[\s,;]+/).filter(Boolean);
      const t = cells.map((c) => { const v = num(c); if (!Number.isFinite(v)) throw bad(`Line ${i + 1}`, c); return v * k; });
      trains.push({ name, t });
    });
  } else {
    const sep = text.includes('\t') ? /\t/ : /[,;]/.test(lines[0] ?? '') ? /\s*[,;]\s*/ : /\s+/;
    const rows = lines.map((l) => l.split(sep).map((c) => c.trim().replace(/^"(.*)"$/, '$1')));
    if (layout === 'pairs') {
      const map = new Map<string, number[]>();
      rows.forEach((r, i) => {
        if (i === 0 && !Number.isFinite(num(r[1] ?? ''))) return; // header
        if (r.length < 2) throw new Error(`Row ${i + 1}: give a train label and a spike time.`);
        const v = num(r[1]); if (!Number.isFinite(v)) throw bad(`Row ${i + 1}`, r[1]);
        const key = r[0] || '1'; if (!map.has(key)) map.set(key, []); map.get(key)!.push(v * k);
      });
      trains = [...map].map(([name, t]) => ({ name: /^\d+(\.0+)?$/.test(name) ? `Train ${Number(name)}` : name, t }));
    } else {
      const width = Math.max(...rows.map((r) => r.length));
      const head = rows.length && rows[0].some((c) => c !== '' && !Number.isFinite(num(c)));
      const body = head ? rows.slice(1) : rows;
      for (let j = 0; j < width; j++) {
        const t: number[] = [];
        body.forEach((r, i) => { const c = r[j] ?? ''; if (c === '') return; const v = num(c); if (!Number.isFinite(v)) throw bad(`Row ${i + 1 + (head ? 1 : 0)}, column ${j + 1}`, c); t.push(v * k); });
        trains.push({ name: head ? rows[0][j] || `Train ${j + 1}` : `Train ${j + 1}`, t });
      }
    }
  }
  for (const tr of trains) tr.t.sort((a, b) => a - b);
  return trains;
}

export const isis = (t: number[]) => t.slice(1).map((v, i) => v - t[i]);
const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
/** Variance with ddof (0 = population, 1 = sample). */
export const variance = (a: number[], ddof = 0) => { const m = mean(a); return a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - ddof); };

export type TrainStats = { name: string; n: number; rate: number; meanIsi: number; cv: number };
export type Summary = { trains: TrainStats[]; meanRate: number; sdRate: number; meanCount: number; varCount: number; fano: number; cvPooled: number; isiAll: number[]; refractoryViolations: number };
/**
 * Statistics in the window [t0, t1] (spikes outside are ignored).
 * Rate = spikes ÷ window length. CV = SD ÷ mean of the ISIs (SD with n in the denominator, as Dayan & Abbott).
 * Fano factor = sample variance (n − 1) ÷ mean of the spike counts across trains. The pooled CV uses all ISIs from all trains.
 */
export function summarise(trains: Train[], t0: number, t1: number, refractory = 0.002): Summary {
  const T = t1 - t0;
  const inWin = trains.map((tr) => tr.t.filter((v) => v >= t0 && v <= t1));
  const st = trains.map((tr, i) => { const t = inWin[i], d = isis(t); return { name: tr.name, n: t.length, rate: t.length / T, meanIsi: d.length ? mean(d) : NaN, cv: d.length >= 2 ? Math.sqrt(variance(d)) / mean(d) : NaN }; });
  const counts = st.map((s) => s.n), rates = st.map((s) => s.rate), isiAll = inWin.flatMap(isis);
  const mc = mean(counts), vc = counts.length > 1 ? variance(counts, 1) : NaN;
  return {
    trains: st, meanRate: mean(rates), sdRate: rates.length > 1 ? Math.sqrt(variance(rates, 1)) : NaN, meanCount: mc, varCount: vc, fano: mc > 0 ? vc / mc : NaN,
    cvPooled: isiAll.length >= 2 ? Math.sqrt(variance(isiAll)) / mean(isiAll) : NaN, isiAll, refractoryViolations: isiAll.filter((d) => d < refractory).length,
  };
}

/** numpy.histogram(values, bins=round((hi − lo)/bw), range=(lo, hi)): counts and the bin edges. */
export function histogram(values: number[], lo: number, hi: number, bw: number): { edges: number[]; counts: number[] } {
  const nb = Math.max(1, Math.round((hi - lo) / bw)), w = (hi - lo) / nb;
  const edges = Array.from({ length: nb + 1 }, (_, i) => lo + i * w), counts = new Array(nb).fill(0);
  for (const v of values) {
    if (!(v >= lo && v <= hi)) continue;
    let i = Math.floor((v - lo) / w); if (i >= nb) i = nb - 1;
    // Guard against rounding at an edge (numpy compares with the edges themselves).
    if (i > 0 && v < edges[i]) i--; else if (i < nb - 1 && v >= edges[i + 1]) i++;
    counts[i]++;
  }
  return { edges, counts };
}

/** Peri-stimulus time histogram: spikes per bin ÷ (trains × bin width), in spikes per second. */
export function psth(trains: Train[], t0: number, t1: number, bw: number) {
  const h = histogram(trains.flatMap((t) => t.t), t0, t1, bw), w = h.edges[1] - h.edges[0];
  return { ...h, rate: h.counts.map((c) => c / (trains.length * w)) };
}

/**
 * Autocorrelogram: every difference t_j − t_i (i ≠ j, same train) with |difference| ≤ maxLag, in bins of bw from −maxLag
 * to maxLag. rate = counts ÷ (number of spikes × bin width): the rate of other spikes at each lag after a spike, in Hz.
 */
export function autocorrelogram(trains: Train[], maxLag: number, bw: number, t0 = -Infinity, t1 = Infinity) {
  const d: number[] = []; let n = 0;
  for (const tr of trains) {
    const t = tr.t.filter((v) => v >= t0 && v <= t1); n += t.length;
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length && t[j] - t[i] <= maxLag; j++) { d.push(t[j] - t[i]); d.push(t[i] - t[j]); }
  }
  const h = histogram(d, -maxLag, maxLag, bw), w = h.edges[1] - h.edges[0];
  return { ...h, rate: h.counts.map((c) => (n ? c / (n * w) : 0)), spikes: n };
}

/**
 * The made-up example: 20 trials of 2 s; 5 spikes/s at rest, 40 spikes/s from 0.5 to 1.0 s (a "stimulus"),
 * with a 3 ms dead time after each spike. Times rounded to 0.1 ms.
 */
export function exampleTrains(seed = 3, trials = 20): Train[] {
  const r = rng(seed), out: Train[] = [];
  for (let k = 0; k < trials; k++) {
    const t: number[] = []; let x = 0, last = -1;
    while (true) {
      x += -Math.log(1 - r()) / 40;
      if (x > 2) break;
      const rate = x >= 0.5 && x < 1 ? 40 : 5;
      if (r() < rate / 40 && x - last > 0.003) { t.push(Math.round(x * 1e4) / 1e4); last = x; }
    }
    out.push({ name: `Trial ${k + 1}`, t });
  }
  return out;
}
