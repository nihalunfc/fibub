// Projectile with quadratic air drag and a steady horizontal wind, integrated with fourth-order Runge-Kutta.
// Drag force F = ½ ρ Cd A |v − w| (v − w), opposite to the velocity relative to the air. No DOM.

export const G0 = 9.80665;

export type ProjIn = {
  v0: number; // launch speed, m/s
  angle: number; // launch angle above horizontal, degrees
  h0?: number; // launch height above the landing ground, m
  m: number; // mass, kg
  Cd: number; // drag coefficient (0 = no drag)
  A: number; // frontal area, m²
  rho?: number; // air density, kg/m³
  g?: number; // gravity, m/s²
  wind?: number; // horizontal wind, m/s (+ = blowing the same way as the throw, a tailwind)
};
export type ProjOut = {
  t: number[]; x: number[]; y: number[]; vx: number[]; vy: number[];
  range: number; tof: number; apex: number; xApex: number; tApex: number;
  impactSpeed: number; impactAngle: number; terminal: number; k: number; landed: boolean;
};

type S = [number, number, number, number];

function deriv(s: S, k: number, g: number, w: number): S {
  const rx = s[2] - w, ry = s[3], sp = Math.hypot(rx, ry);
  return [s[2], s[3], -k * sp * rx, -g - k * sp * ry];
}
function rk4(s: S, h: number, k: number, g: number, w: number): S {
  const a = deriv(s, k, g, w);
  const b = deriv([s[0] + (h / 2) * a[0], s[1] + (h / 2) * a[1], s[2] + (h / 2) * a[2], s[3] + (h / 2) * a[3]], k, g, w);
  const c = deriv([s[0] + (h / 2) * b[0], s[1] + (h / 2) * b[1], s[2] + (h / 2) * b[2], s[3] + (h / 2) * b[3]], k, g, w);
  const d = deriv([s[0] + h * c[0], s[1] + h * c[1], s[2] + h * c[2], s[3] + h * c[3]], k, g, w);
  return [0, 1, 2, 3].map((i) => s[i] + (h / 6) * (a[i] + 2 * b[i] + 2 * c[i] + d[i])) as S;
}
/** Step length from s at which component idx reaches zero (bisection on the RK4 step, so it is as accurate as the step). */
function rootStep(s: S, h: number, idx: number, k: number, g: number, w: number) {
  let lo = 0, hi = h;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (Math.sign(rk4(s, mid, k, g, w)[idx]) === Math.sign(s[idx]) && rk4(s, mid, k, g, w)[idx] !== 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

/** Drag constant k = ρ Cd A / (2 m), in 1/m. */
export const dragK = (p: ProjIn) => ((p.rho ?? 1.225) * p.Cd * p.A) / (2 * p.m);
/** Terminal speed in still air, √(2 m g / (ρ Cd A)). */
export const terminalSpeed = (p: ProjIn) => { const k = dragK(p); return k > 0 ? Math.sqrt((p.g ?? G0) / k) : Infinity; };

/** No-drag range on level ground or from a height (closed form). */
export function vacuum(v0: number, angleDeg: number, h0 = 0, g = G0) {
  const a = (angleDeg * Math.PI) / 180, vx = v0 * Math.cos(a), vy = v0 * Math.sin(a);
  const tof = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g;
  return { range: vx * tof, tof, apex: h0 + (vy * vy) / (2 * g), tApex: vy / g };
}

export function simulate(p: ProjIn, steps = 2000): ProjOut {
  const g = p.g ?? G0, w = p.wind ?? 0, k = dragK(p), h0 = p.h0 ?? 0;
  const a = (p.angle * Math.PI) / 180;
  const vac = vacuum(p.v0, p.angle, h0, g);
  const tGuess = Math.max(vac.tof, 1e-3);
  const h = tGuess / steps;
  let s: S = [0, h0, p.v0 * Math.cos(a), p.v0 * Math.sin(a)], t = 0;
  const T = [0], X = [s[0]], Y = [s[1]], VX = [s[2]], VY = [s[3]];
  let apex = h0, xApex = 0, tApex = 0, landed = false;
  if (s[3] <= 0) { apex = h0; }
  for (let i = 0; i < steps * 50; i++) {
    const n = rk4(s, h, k, g, w);
    if (s[3] > 0 && n[3] <= 0) { const dt = rootStep(s, h, 3, k, g, w), q = rk4(s, dt, k, g, w); apex = q[1]; xApex = q[0]; tApex = t + dt; }
    if (n[1] <= 0 && (s[1] > 0 || (i === 0 && h0 === 0))) {
      if (s[1] > 0) { const dt = rootStep(s, h, 1, k, g, w); s = rk4(s, dt, k, g, w); s[1] = 0; t += dt; }
      else { s = n; t += h; }
      T.push(t); X.push(s[0]); Y.push(s[1]); VX.push(s[2]); VY.push(s[3]); landed = true; break;
    }
    s = n; t += h; T.push(t); X.push(s[0]); Y.push(s[1]); VX.push(s[2]); VY.push(s[3]);
  }
  const last = T.length - 1;
  return {
    t: T, x: X, y: Y, vx: VX, vy: VY, range: X[last], tof: T[last], apex, xApex, tApex,
    impactSpeed: Math.hypot(VX[last], VY[last]), impactAngle: (Math.atan2(-VY[last], VX[last]) * 180) / Math.PI,
    terminal: k > 0 ? Math.sqrt(g / k) : Infinity, k, landed,
  };
}

/** Launch angle (degrees, 0 to 90) giving the longest range, by golden-section search. */
export function bestAngle(p: Omit<ProjIn, 'angle'>, steps = 800) {
  const f = (a: number) => simulate({ ...p, angle: a }, steps).range;
  let lo = 0.5, hi = 89.5; const r = (Math.sqrt(5) - 1) / 2;
  let c = hi - r * (hi - lo), d = lo + r * (hi - lo), fc = f(c), fd = f(d);
  for (let i = 0; i < 40; i++) {
    if (fc > fd) { hi = d; d = c; fd = fc; c = hi - r * (hi - lo); fc = f(c); }
    else { lo = c; c = d; fc = fd; d = lo + r * (hi - lo); fd = f(d); }
  }
  const angle = (lo + hi) / 2;
  return { angle, range: f(angle) };
}
