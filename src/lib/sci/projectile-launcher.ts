// #1332 Projectile launcher: a ball thrown at speed v and angle θ from height h, in a vacuum (school formulas)
// or with air drag F = k m v² (stepped with RK4). Plain maths, no DOM. SI units, angles in degrees.
const RAD = Math.PI / 180;
export const G = 9.8;

export type Flight = { range: number; hmax: number; tTop: number; tFlight: number; vLand: number; landAngle: number; pts: [number, number][] };

/** Exact vacuum flight from height h ≥ 0. */
export function vacuum(v: number, deg: number, h = 0, g = G): Flight {
  const vx = v * Math.cos(deg * RAD), vy = v * Math.sin(deg * RAD);
  const tF = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g, tTop = Math.max(0, vy / g);
  const vyL = vy - g * tF, pts: [number, number][] = [];
  for (let i = 0; i <= 120; i++) { const t = (tF * i) / 120; pts.push([vx * t, h + vy * t - 0.5 * g * t * t]); }
  return { range: vx * tF, hmax: h + (vy > 0 ? (vy * vy) / (2 * g) : 0), tTop, tFlight: tF, vLand: Math.hypot(vx, vyL), landAngle: Math.atan2(-vyL, vx) / RAD, pts };
}

/** Flight with quadratic drag: a = −g ŷ − k |v| v, where k = ½ ρ Cd A / m (per metre). RK4 with a small step. */
export function withDrag(v: number, deg: number, h = 0, k = 0, g = G, dt = 0.0005): Flight {
  if (k <= 0) return vacuum(v, deg, h, g);
  let x = 0, y = h, vx = v * Math.cos(deg * RAD), vy = v * Math.sin(deg * RAD), t = 0, hmax = h, tTop = 0;
  const acc = (ux: number, uy: number) => { const s = Math.hypot(ux, uy); return [-k * s * ux, -g - k * s * uy]; };
  const pts: [number, number][] = [[0, h]];
  let step = 0;
  while (t < 1000) {
    const [a1x, a1y] = acc(vx, vy);
    const [a2x, a2y] = acc(vx + 0.5 * dt * a1x, vy + 0.5 * dt * a1y);
    const [a3x, a3y] = acc(vx + 0.5 * dt * a2x, vy + 0.5 * dt * a2y);
    const [a4x, a4y] = acc(vx + dt * a3x, vy + dt * a3y);
    const nx = x + dt * (vx + dt / 6 * (a1x + a2x + a3x)), ny = y + dt * (vy + dt / 6 * (a1y + a2y + a3y));
    const nvx = vx + dt / 6 * (a1x + 2 * a2x + 2 * a3x + a4x), nvy = vy + dt / 6 * (a1y + 2 * a2y + 2 * a3y + a4y);
    if (vy > 0 && nvy <= 0) { const fr = vy / (vy - nvy); tTop = t + fr * dt; }
    if (ny < 0 && t > 0) { // land between steps: interpolate
      const fr = y / (y - ny); x += fr * (nx - x); t += fr * dt; vx += fr * (nvx - vx); vy += fr * (nvy - vy); y = 0; pts.push([x, 0]); break;
    }
    x = nx; y = ny; vx = nvx; vy = nvy; t += dt; hmax = Math.max(hmax, y);
    if (++step % 40 === 0) pts.push([x, y]);
  }
  return { range: x, hmax, tTop, tFlight: t, vLand: Math.hypot(vx, vy), landAngle: Math.atan2(-vy, vx) / RAD, pts };
}

/** Drag constant k = ½ ρ Cd A / m for a ball of mass m (kg) and diameter d (m). */
export const dragK = (m: number, d: number, cd = 0.5, rho = 1.2) => (0.5 * rho * cd * Math.PI * (d / 2) ** 2) / m;

/** Angle giving the longest range (search, works with height and drag). */
export function bestAngle(v: number, h: number, k: number) {
  let best = 45, R = -1;
  for (let a = 1; a <= 89; a += 0.5) { const r = withDrag(v, a, h, k, G, 0.004).range; if (r > R) { R = r; best = a; } }
  return { angle: best, range: R };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const v = pick(rng, 10, 30), a = [15, 30, 45, 60, 75][pick(rng, 0, 4)], R = (v * v * Math.sin(2 * a * RAD)) / G;
    qs.push({ text: `A ball is kicked from the ground at ${v} m/s and ${a}° above the horizontal. Ignoring air, how far away does it land? (g = 9.8 m/s²)`, ans: R, unit: 'm', work: `R = v² sin 2θ ÷ g = ${v}² × sin ${2 * a}° ÷ 9.8 = ${n(R)} m.` }); }
  { const v = pick(rng, 10, 30), a = [30, 45, 60][pick(rng, 0, 2)], H = (v * Math.sin(a * RAD)) ** 2 / (2 * G);
    qs.push({ text: `A stone is thrown at ${v} m/s, ${a}° above the horizontal. How high does it rise above the launch point? (g = 9.8 m/s²)`, ans: H, unit: 'm', work: `H = (v sin θ)² ÷ 2g = (${v} × ${n(Math.sin(a * RAD))})² ÷ 19.6 = ${n(H)} m.` }); }
  { const v = pick(rng, 10, 30), a = [30, 45, 60][pick(rng, 0, 2)], T = (2 * v * Math.sin(a * RAD)) / G;
    qs.push({ text: `For how long is a ball in the air if it leaves the ground at ${v} m/s and ${a}°? (g = 9.8 m/s², no air)`, ans: T, unit: 's', work: `T = 2v sin θ ÷ g = 2 × ${v} × ${n(Math.sin(a * RAD))} ÷ 9.8 = ${n(T)} s.` }); }
  { const h = pick(rng, 5, 45), u = pick(rng, 2, 15), t = Math.sqrt((2 * h) / G), x = u * t;
    qs.push({ text: `A ball rolls off the edge of a ${h} m high cliff, flying out sideways at ${u} m/s. How far from the foot of the cliff does it land? (g = 9.8 m/s²)`, ans: x, unit: 'm', work: `Fall time t = √(2h ÷ g) = √(${2 * h} ÷ 9.8) = ${n(t)} s. Distance = ${u} × ${n(t)} = ${n(x)} m.` }); }
  return qs;
}
