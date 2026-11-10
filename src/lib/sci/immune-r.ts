// Primary and secondary immune response: a teaching model of antibody level against time after one or more
// exposures to the same germ (vaccine doses or infections). Each exposure starts a response that rises
// smoothly after a lag, peaks, and then halves every `half` days. The first exposure gives the slow, small
// primary response (mostly IgM); later ones meet memory cells and give the fast, large secondary response
// (mostly IgG). All numbers are round teaching values in arbitrary units, not measurements.

export type Kind = 'vaccine' | 'infection';
export type Exposure = { day: number; kind: Kind };
/** One antibody class's part of one response. */
export type Wave = { cls: 'IgM' | 'IgG'; start: number; peakDay: number; peak: number; half: number };
export type Response = { day: number; kind: Kind; secondary: boolean; lag: number; waves: Wave[]; memory: number };

export const PRIMARY = { lag: 6, igmRise: 5, igmPeak: 1, igmHalf: 5, iggRise: 10, iggPeak: 0.6, iggHalf: 20 };
export const SECONDARY = { lag: 2, igmRise: 4, igmPeak: 0.5, igmHalf: 5, iggRise: 5, iggHalf: 40 };
export const VACCINE_SCALE = 0.6; // a dose is a weaker trigger than a germ that multiplies

/** Level of one wave on day t: 0 before it starts, a smooth S-shaped rise to the peak, then halving every `half` days. */
export function wave(w: Wave, t: number): number {
  if (t <= w.start) return 0;
  if (t <= w.peakDay) { const s = (t - w.start) / (w.peakDay - w.start); return w.peak * s * s * (3 - 2 * s); }
  return w.peak * Math.pow(2, -(t - w.peakDay) / w.half);
}

/**
 * Turn the exposures into responses. `boost` is how many times bigger the IgG peak of the first secondary
 * response is than the primary IgG peak; each later exposure adds half as much again (memory builds up).
 */
export function responses(exps: Exposure[], boost = 10): Response[] {
  const list = [...exps].filter((e) => Number.isFinite(e.day)).sort((a, b) => a.day - b.day);
  let memory = 0;
  return list.map((e) => {
    const k = e.kind === 'vaccine' ? VACCINE_SCALE : 1;
    const secondary = memory > 0;
    let waves: Wave[];
    if (!secondary) {
      const P = PRIMARY, s = e.day + P.lag;
      waves = [
        { cls: 'IgM', start: s, peakDay: s + P.igmRise, peak: P.igmPeak * k, half: P.igmHalf },
        { cls: 'IgG', start: s, peakDay: s + P.iggRise, peak: P.iggPeak * k, half: P.iggHalf },
      ];
    } else {
      const S = SECONDARY, s = e.day + S.lag, g = PRIMARY.iggPeak * boost * (1 + 0.5 * (memory - 1));
      waves = [
        { cls: 'IgM', start: s, peakDay: s + S.igmRise, peak: S.igmPeak * k, half: S.igmHalf },
        { cls: 'IgG', start: s, peakDay: s + S.iggRise, peak: g * k, half: S.iggHalf },
      ];
    }
    memory += 1;
    return { day: e.day, kind: e.kind, secondary, lag: secondary ? SECONDARY.lag : PRIMARY.lag, waves, memory };
  });
}

/** Antibody level on day t, split into IgM and IgG. */
export function level(rs: Response[], t: number): { igm: number; igg: number; total: number } {
  let igm = 0, igg = 0;
  for (const r of rs) for (const w of r.waves) { const v = wave(w, t); if (w.cls === 'IgM') igm += v; else igg += v; }
  return { igm, igg, total: igm + igg };
}

/** Peak total level reached by a response (searched on a 0.1-day grid until the next exposure or `end`). */
export function peakOf(rs: Response[], i: number, end: number): { day: number; value: number } {
  const from = rs[i].day, to = i + 1 < rs.length ? rs[i + 1].day : end;
  let best = { day: from, value: level(rs, from).total };
  for (let t = from; t <= to + 1e-9; t += 0.1) { const v = level(rs, t).total; if (v > best.value) best = { day: Math.round(t * 10) / 10, value: v }; }
  return best;
}

/** Whole days from 0 to `end` on which the total level is at or above `protect`. */
export function daysProtected(rs: Response[], protect: number, end: number): number {
  let n = 0;
  for (let d = 0; d <= end; d++) if (level(rs, d).total >= protect) n++;
  return n;
}

/** For an infection: was the person already protected on the day the germ arrived? */
export const protectedAt = (rs: Response[], day: number, protect: number) => level(rs, day).total >= protect;
