// Drill hole assay intervals: checks, length-weighted composites and significant intercepts. Depths are down-hole. No DOM.

export type Interval = { hole: string; from: number; to: number; g: number; lith?: string };
export type Issue = { hole: string; kind: 'bad' | 'gap' | 'overlap'; from: number; to: number };

const EPS = 1e-9;

/** Groups intervals by hole (in first-seen order) and sorts each hole by depth. */
export function byHole(ints: Interval[]) {
  const m = new Map<string, Interval[]>();
  for (const i of ints) { if (!m.has(i.hole)) m.set(i.hole, []); m.get(i.hole)!.push(i); }
  for (const v of m.values()) v.sort((a, b) => a.from - b.from || a.to - b.to);
  return m;
}

/** Finds rows with from ≥ to, gaps between samples (unsampled core) and overlapping samples. */
export function validate(ints: Interval[]): Issue[] {
  const out: Issue[] = [];
  for (const [hole, v] of byHole(ints)) {
    let prev: Interval | null = null;
    for (const i of v) {
      if (!(i.to > i.from)) { out.push({ hole, kind: 'bad', from: i.from, to: i.to }); continue; }
      if (prev) {
        if (i.from > prev.to + EPS) out.push({ hole, kind: 'gap', from: prev.to, to: i.from });
        else if (i.from < prev.to - EPS) out.push({ hole, kind: 'overlap', from: i.from, to: Math.min(prev.to, i.to) });
      }
      if (!prev || i.to > prev.to) prev = i;
    }
  }
  return out;
}

/** Only the usable rows: from < to, and for overlaps the later sample is trimmed to start where the earlier one ends. */
export function clean(v: Interval[]) {
  const out: Interval[] = [];
  let end = -Infinity;
  for (const i of v) {
    if (!(i.to > i.from)) continue;
    const from = Math.max(i.from, end);
    if (i.to - from > EPS) { out.push({ ...i, from }); end = i.to; }
  }
  return out;
}

export type Composite = { hole: string; from: number; to: number; len: number; sampled: number; g: number; lith?: string };

/** Length-weighted grade of the sampled part of [a, b) in one hole's clean intervals. Unsampled core is left out. */
export function weighted(v: Interval[], a: number, b: number) {
  let s = 0, gl = 0;
  for (const i of v) { const o = Math.min(b, i.to) - Math.max(a, i.from); if (o > EPS) { s += o; gl += o * i.g; } }
  return { sampled: s, g: s > 0 ? gl / s : NaN };
}

/**
 * Fixed-length composites from the top of the first sample to the bottom of the last.
 * The short last piece: 'keep' as it is, 'drop' it, 'merge' it into the one above, 'half' keep it only if at least
 * half the length (else merge), or 'equal': share the hole into equal composites as close as possible to the length.
 */
export function composites(v: Interval[], len: number, rule: 'keep' | 'drop' | 'merge' | 'half' | 'equal' = 'half', minCover = 0.5): Composite[] {
  const c = clean(v);
  if (!c.length || !(len > 0)) return [];
  const top = c[0].from, bot = Math.max(...c.map((i) => i.to)), L = bot - top;
  let edges: number[] = [];
  if (rule === 'equal') { const n = Math.max(1, Math.round(L / len)); edges = Array.from({ length: n + 1 }, (_, k) => top + (L * k) / n); }
  else {
    const n = Math.floor(L / len + EPS);
    edges = Array.from({ length: n + 1 }, (_, k) => top + k * len);
    const rest = bot - edges[edges.length - 1];
    if (rest > EPS) {
      const keep = rule === 'keep' || (rule === 'half' && rest >= len / 2 - EPS) || n === 0;
      if (keep) edges.push(bot);
      else if (rule === 'merge' || rule === 'half') edges[edges.length - 1] = bot;
    }
  }
  const out: Composite[] = [];
  for (let k = 0; k + 1 < edges.length; k++) {
    const a = edges[k], b = edges[k + 1], w = weighted(c, a, b);
    if (w.sampled >= minCover * (b - a) - EPS && w.sampled > 0) out.push({ hole: c[0].hole, from: a, to: b, len: b - a, sampled: w.sampled, g: w.g });
  }
  return out;
}

/** One composite per run of the same lithology (unsampled gaps inside a run are left out of the grade). */
export function lithComposites(v: Interval[]): Composite[] {
  const c = clean(v), out: Composite[] = [];
  for (const i of c) {
    const last = out[out.length - 1], lith = i.lith ?? '';
    if (last && last.lith === lith && i.from - last.to < 1e-6) {
      const gl = last.g * last.sampled + i.g * (i.to - i.from);
      last.sampled += i.to - i.from; last.to = i.to; last.len = last.to - last.from; last.g = gl / last.sampled;
    } else out.push({ hole: i.hole, from: i.from, to: i.to, len: i.to - i.from, sampled: i.to - i.from, g: i.g, lith });
  }
  return out;
}

export type Intercept = { hole: string; from: number; to: number; len: number; g: number; gxm: number; dilution: number };

/**
 * Significant intercepts: start and end on samples at or above the cut-off grade; take in lower-grade samples only
 * while each run of them is no longer than maxDil metres and the whole intercept still averages at least the
 * cut-off. Unsampled gaps count as waste at zero grade (cautious). Keep intercepts at least minLen long.
 */
export function intercepts(v: Interval[], cut: number, maxDil: number, minLen: number): Intercept[] {
  const c = clean(v), segs: { from: number; to: number; g: number }[] = [];
  for (const i of c) {
    const last = segs[segs.length - 1];
    if (last && i.from > last.to + EPS) segs.push({ from: last.to, to: i.from, g: 0 });
    segs.push({ from: i.from, to: i.to, g: i.g });
  }
  const out: Intercept[] = [];
  let i = 0;
  while (i < segs.length) {
    if (segs[i].g < cut) { i++; continue; }
    let end = i, gl = segs[i].g * (segs[i].to - segs[i].from), len = segs[i].to - segs[i].from;
    let wl = 0, wgl = 0, run = 0, j = i + 1;
    while (j < segs.length) {
      const s = segs[j], l = s.to - s.from;
      if (s.g >= cut) {
        const nl = len + wl + l, ngl = gl + wgl + s.g * l;
        if (ngl / nl < cut - EPS) break;
        len = nl; gl = ngl; wl = 0; wgl = 0; run = 0; end = j;
      } else { run += l; if (run > maxDil + EPS) break; wl += l; wgl += s.g * l; }
      j++;
    }
    const from = segs[i].from, to = segs[end].to;
    if (to - from >= minLen - EPS) {
      let dil = 0; for (let k = i; k <= end; k++) if (segs[k].g < cut) dil += segs[k].to - segs[k].from;
      out.push({ hole: c[0].hole, from, to, len: to - from, g: gl / len, gxm: gl, dilution: dil });
    }
    i = end + 1;
  }
  return out;
}

/** "12.0 m @ 2.35 g/t from 45.0 m" */
export const fmtIntercept = (x: { len: number; g: number; from: number }, unit: string, dp = 2) =>
  `${x.len.toFixed(1)} m @ ${x.g.toFixed(dp)} ${unit} from ${x.from.toFixed(1)} m`;
