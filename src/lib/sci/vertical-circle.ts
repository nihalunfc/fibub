// #1338 Circular motion: a stone whirled on a string (centripetal acceleration v²/r) and a mass on a string in a
// vertical circle (speed and tension all the way round, the least speeds to loop). Plain maths, no DOM. SI units.
export const G = 9.8;

/** Horizontal circle: speed v on radius r with mass m. */
export function whirl(m: number, r: number, v: number) {
  const w = v / r, a = (v * v) / r;
  return { omega: w, a, F: m * a, T: (2 * Math.PI * r) / v, rpm: (w * 60) / (2 * Math.PI) };
}

/** Vertical circle, string of length r, speed u at the bottom. Angle θ measured from the bottom (0) to the top (180°).
 *  v² = u² − 2gr(1 − cos θ); tension T = m v²/r + m g cos θ. */
export function at(u: number, r: number, m: number, thetaDeg: number, g = G) {
  const c = Math.cos((thetaDeg * Math.PI) / 180), v2 = u * u - 2 * g * r * (1 - c);
  return { v2, v: Math.sqrt(Math.max(0, v2)), T: (m * v2) / r + m * g * c, h: r * (1 - c) };
}

/** What happens: loops all the way, the string goes slack (and where), or it swings back (never above the side). */
export function loop(u: number, r: number, m: number, g = G) {
  const uMin = Math.sqrt(5 * g * r), top = at(u, r, m, 180, g);
  if (u >= uMin - 1e-12) return { kind: 'loops' as const, uMin, slack: NaN, vTop: top.v, Ttop: top.T, Tbottom: at(u, r, m, 0, g).T };
  // Swings: rises to v = 0 while still below the side (θ ≤ 90°).
  if (u * u <= 2 * g * r) { const th = (Math.acos(1 - (u * u) / (2 * g * r)) * 180) / Math.PI; return { kind: 'swings' as const, uMin, slack: th, vTop: NaN, Ttop: NaN, Tbottom: at(u, r, m, 0, g).T }; }
  // Slack where T = 0: m v²/r + m g cos θ = 0 → u² − 2gr + 3gr cos θ = 0.
  const c = (2 * g * r - u * u) / (3 * g * r), th = (Math.acos(c) * 180) / Math.PI;
  return { kind: 'slack' as const, uMin, slack: th, vTop: NaN, Ttop: NaN, Tbottom: at(u, r, m, 0, g).T, vSlack: Math.sqrt(-g * r * c) };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string; tol?: number };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const v = pick(rng, 2, 12), r = pick(rng, 2, 20) / 10, a = (v * v) / r; qs.push({ text: `A stone on a string ${n(r)} m long goes round at ${v} m/s. What is its centripetal acceleration?`, ans: a, unit: 'm/s²', work: `a = v² ÷ r = ${v}² ÷ ${n(r)} = ${n(a)} m/s², towards the centre.` }); }
  { const m = pick(rng, 1, 10) / 10, v = pick(rng, 2, 10), r = pick(rng, 5, 20) / 10, F = (m * v * v) / r; qs.push({ text: `What tension does a horizontal string need to keep a ${n(m)} kg ball going round a ${n(r)} m circle at ${v} m/s? (Ignore gravity.)`, ans: F, unit: 'N', work: `F = m v² ÷ r = ${n(m)} × ${v * v} ÷ ${n(r)} = ${n(F)} N.` }); }
  { const r = pick(rng, 5, 30) / 10, u = Math.sqrt(5 * G * r); qs.push({ text: `A bucket of water is swung in a vertical circle of radius ${n(r)} m. What is the least speed at the bottom that takes it all the way round? (g = 9.8 m/s²)`, ans: u, unit: 'm/s', work: `At the top the string can just go slack: v_top² = gr. Energy from bottom to top: u² = v_top² + 4gr = 5gr, so u = √(5 × 9.8 × ${n(r)}) = ${n(u)} m/s.` }); }
  { const m = pick(rng, 1, 5) / 2, r = pick(rng, 5, 20) / 10, v = pick(rng, 3, 8), T = (m * v * v) / r + m * G; qs.push({ text: `A ${n(m)} kg mass on a ${n(r)} m string passes the lowest point of a vertical circle at ${v} m/s. What is the tension there? (g = 9.8 m/s²)`, ans: T, unit: 'N', work: `At the bottom the string must hold the weight and also give the centripetal force: T = mg + mv²/r = ${n(m * G)} + ${n((m * v * v) / r)} = ${n(T)} N.` }); }
  return qs;
}
