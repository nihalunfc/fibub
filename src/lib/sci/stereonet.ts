// Stereonet geometry for structural geology: planes (strike and dip, right-hand rule, or dip
// direction and dip) and lines (plunge and trend) on a lower-hemisphere equal-area (Schmidt) or
// equal-angle (Wulff) net. Angles in degrees, azimuths clockwise from north.

export type Net = 'equal-area' | 'equal-angle';
export type Line = { trend: number; plunge: number };
export type Plane = { strike: number; dip: number }; // right-hand rule: dips to strike + 90
const R = Math.PI / 180;
const norm360 = (a: number) => ((a % 360) + 360) % 360;

/** A unit vector (north, east, down) for a line. */
export const vec = (l: Line): [number, number, number] => [Math.cos(l.plunge * R) * Math.cos(l.trend * R), Math.cos(l.plunge * R) * Math.sin(l.trend * R), Math.sin(l.plunge * R)];
/** The line of a unit vector, flipped to point downward (lower hemisphere). */
export function line(v: [number, number, number]): Line {
  let [n, e, d] = v;
  if (d < 0) { n = -n; e = -e; d = -d; }
  const len = Math.hypot(n, e, d);
  return { trend: norm360(Math.atan2(e, n) / R), plunge: Math.asin(Math.min(1, d / len)) / R };
}
/** The pole (normal) of a plane. */
export const pole = (p: Plane): Line => ({ trend: norm360(p.strike + 90 + 180), plunge: 90 - p.dip });
export const planeFromPole = (l: Line): Plane => ({ strike: norm360(l.trend + 90), dip: 90 - l.plunge });

/** Map a line to the unit disc: x east, y north (y up on the page), radius 1 at the primitive circle. */
export function project(l: Line, net: Net): [number, number] {
  const a = (90 - l.plunge) * R / 2;
  const r = net === 'equal-area' ? Math.SQRT2 * Math.sin(a) : Math.tan(a);
  return [r * Math.sin(l.trend * R), r * Math.cos(l.trend * R)];
}
/** Points along a plane's great circle, from one end of its strike line to the other. */
export function greatCircle(p: Plane, net: Net, steps = 90): [number, number][] {
  const s = vec({ trend: p.strike, plunge: 0 }), dd = vec({ trend: p.strike + 90, plunge: p.dip });
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI, c = Math.cos(t), sn = Math.sin(t);
    out.push(project(line([s[0] * c + dd[0] * sn, s[1] * c + dd[1] * sn, s[2] * c + dd[2] * sn + 1e-12]), net));
  }
  return out;
}

/** Fisher statistics of lines (poles): mean direction, R̄ (0 to 1), concentration k and the 95 % cone of confidence. */
export function fisher(lines: Line[]) {
  const n = lines.length;
  if (!n) return null;
  // Axial data: point every vector into the hemisphere of the first, so opposite ends add up.
  const ref = vec(lines[0]); let sx = 0, sy = 0, sz = 0;
  for (const l of lines) { let v = vec(l); if (v[0] * ref[0] + v[1] * ref[1] + v[2] * ref[2] < 0) v = [-v[0], -v[1], -v[2]]; sx += v[0]; sy += v[1]; sz += v[2]; }
  const Rlen = Math.hypot(sx, sy, sz), rbar = Rlen / n;
  const k = n > Rlen ? (n - 1) / (n - Rlen) : Infinity;
  const a95 = n > 1 && n > Rlen ? Math.acos(Math.max(-1, 1 - ((n - Rlen) / Rlen) * (20 ** (1 / (n - 1)) - 1))) / R : 0;
  return { mean: line([sx, sy, sz]), rbar, k, a95, n };
}

/** Counts of azimuths in bins of `width` degrees. Axial (strikes): each value also counts at +180. */
export function roseBins(az: number[], width = 10, axial = true): number[] {
  const bins = new Array(Math.round(360 / width)).fill(0);
  for (const a of az) {
    bins[Math.floor(norm360(a) / width) % bins.length]++;
    if (axial) bins[Math.floor(norm360(a + 180) / width) % bins.length]++;
  }
  return bins;
}

/** Read "strike dip" or "dip direction / dip" (or "plunge trend") lines; letters such as quadrant notation are rejected with the line number. */
export function readPairs(text: string): { pairs: [number, number][]; bad: number[] } {
  const pairs: [number, number][] = [], bad: number[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const l = raw.replace(/#.*/, '').trim();
    if (!l) return;
    const m = l.split(/[\s,;/\t]+/).filter(Boolean).map(Number);
    if (m.length >= 2 && m.slice(0, 2).every(Number.isFinite)) pairs.push([m[0], m[1]]); else bad.push(i + 1);
  });
  return { pairs, bad };
}
