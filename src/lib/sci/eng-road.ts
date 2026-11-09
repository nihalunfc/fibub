// Road geometry helpers: horizontal curve radius from speed, superelevation and side friction, simple
// circular curve elements and setting-out, stopping sight distance, crest and sag vertical curve lengths
// from sight distance, and the vertical curve profile with its high or low point. All design values (e, f,
// reaction time, eye and object heights, K) are the user's; nothing here is a code table. Units: km/h, m, %.

const G = 9.81;
const KMH = 1 / 3.6;
const rad = (d: number) => (d * Math.PI) / 180;

/** Smallest radius for speed V (km/h), superelevation e and side friction f (decimals): R = v² / (g (e + f)). */
export const minRadius = (V: number, e: number, f: number, g = G) => (V * KMH) ** 2 / (g * (e + f));
/** Side friction needed on a radius R at speed V with superelevation e. */
export const frictionNeeded = (V: number, R: number, e: number, g = G) => (V * KMH) ** 2 / (g * R) - e;

export type Curve = { T: number; L: number; E: number; M: number; C: number; pc: number; pt: number; Dc: number };
/** Circular curve of radius R with deflection angle Δ (degrees) at a PI chainage. Dc: degree of curve on a 20 m arc. */
export function circularCurve(R: number, delta: number, pi: number): Curve {
  const d = rad(delta), T = R * Math.tan(d / 2), L = R * d;
  return { T, L, E: R * (1 / Math.cos(d / 2) - 1), M: R * (1 - Math.cos(d / 2)), C: 2 * R * Math.sin(d / 2), pc: pi - T, pt: pi - T + L, Dc: (20 / R) * (180 / Math.PI) };
}

/** Setting-out by deflection angles from the PC: stakes at round chainages every `step` m, plus the PT. */
export function settingOut(R: number, c: Curve, step: number): { ch: number; arc: number; defl: number; chord: number; sub: number }[] {
  const out: { ch: number; arc: number; defl: number; chord: number; sub: number }[] = [];
  const first = Math.ceil(c.pc / step - 1e-9) * step;
  let prev = c.pc;
  const add = (ch: number) => { const arc = ch - c.pc, defl = arc / (2 * R); out.push({ ch, arc, defl: (defl * 180) / Math.PI, chord: 2 * R * Math.sin(defl), sub: 2 * R * Math.sin((ch - prev) / (2 * R)) }); prev = ch; };
  add(c.pc);
  for (let ch = first; ch < c.pt - 1e-9; ch += step) if (ch > c.pc + 1e-9) add(ch);
  add(c.pt);
  return out;
}

/** Clear distance needed from the inside lane centre to see a distance S round a curve of radius R (S within the curve). */
export const sightOffset = (R: number, S: number) => R * (1 - Math.cos(S / (2 * R)));

/** Stopping sight distance: reaction distance + braking distance, v t + v² / (2 g (f + G)), with grade G as a decimal (+ uphill). */
export function stoppingDistance(V: number, t: number, f: number, grade = 0, g = G): { react: number; brake: number; total: number } {
  const v = V * KMH, react = v * t, brake = (v * v) / (2 * g * (f + grade));
  return { react, brake, total: react + brake };
}

/** Crest curve length for sight distance S with eye height h1 and object height h2; A = |g2 − g1| in %. */
export function crestLength(A: number, S: number, h1: number, h2: number): number {
  const k = 200 * (Math.sqrt(h1) + Math.sqrt(h2)) ** 2;
  const L1 = (A * S * S) / k;
  return L1 >= S ? L1 : Math.max(0, 2 * S - k / A);
}
/** Sag curve length for headlight sight distance S, headlight height h and upward beam angle α (degrees). */
export function sagLength(A: number, S: number, h: number, alpha: number): number {
  const k = 200 * (h + S * Math.tan(rad(alpha)));
  const L1 = (A * S * S) / k;
  return L1 >= S ? L1 : Math.max(0, 2 * S - k / A);
}

export type Vertical = { L: number; A: number; K: number; crest: boolean; bvc: number; evc: number; zb: number; ze: number; turn: { ch: number; z: number } | null; at: (ch: number) => number };
/** Symmetric parabolic vertical curve: grades g1, g2 in %, length L, centred on the VPI (chainage, level). */
export function verticalCurve(g1: number, g2: number, L: number, vpi: number, zv: number): Vertical {
  const a = g1 / 100, b = g2 / 100, bvc = vpi - L / 2, zb = zv - (a * L) / 2;
  const at = (ch: number) => {
    if (ch <= bvc) return zv + a * (ch - vpi);
    if (ch >= bvc + L) return zv + b * (ch - vpi);
    const x = ch - bvc; return zb + a * x + ((b - a) / (2 * L)) * x * x;
  };
  const xt = b !== a ? (-a * L) / (b - a) : NaN;
  const turn = xt > 0 && xt < L ? { ch: bvc + xt, z: at(bvc + xt) } : null;
  const A = Math.abs(g2 - g1);
  return { L, A, K: L / A, crest: g2 < g1, bvc, evc: bvc + L, zb, ze: at(bvc + L), turn, at };
}

/** Gradient between two points: % grade, angle and "1 in N". */
export function gradient(ch1: number, z1: number, ch2: number, z2: number) {
  const run = ch2 - ch1, rise = z2 - z1, g = rise / run;
  return { percent: g * 100, angle: (Math.atan(g) * 180) / Math.PI, oneIn: rise ? Math.abs(run / rise) : Infinity, slope: Math.hypot(run, rise) };
}
