// Stormwater detention pond: inflow hydrograph (modified rational or a pasted one), a pond with sloping sides, a
// circular orifice and an overflow weir, and level-pool routing dS/dt = I − O(h) solved with RK4 on the water depth.
// SI units: m, s, m³/s; catchment in ha and rain in mm/h. No DOM.

export type Geom = { L: number; W: number; z: number; depth: number }; // bottom length and width, side slope z:1 (H:V)
export type Outlet = { d: number; cd: number; invert: number; crest: number; weirL: number; cw: number };
export const G = 9.81;

/** Plan area of the water surface at depth h. */
export const areaAt = (g: Geom, h: number) => (g.L + 2 * g.z * h) * (g.W + 2 * g.z * h);
/** Volume stored at depth h (exact for a rectangular pond with equal side slopes). */
export const storageAt = (g: Geom, h: number) => g.L * g.W * h + (g.L + g.W) * g.z * h * h + (4 / 3) * g.z * g.z * h * h * h;

/** Orifice flow: the smaller of a weir over the opening (low water) and the full orifice equation (submerged). */
export function orificeQ(o: Outlet, h: number) {
  const y = h - o.invert;
  if (y <= 0 || o.d <= 0) return 0;
  const weir = 1.84 * (o.cd / 0.62) * o.d * Math.pow(y, 1.5);
  const head = y - o.d / 2;
  const orif = head > 0 ? o.cd * (Math.PI * o.d * o.d / 4) * Math.sqrt(2 * G * head) : Infinity;
  return Math.min(weir, orif);
}
/** Overflow (spillway) weir flow above its crest. */
export const weirQ = (o: Outlet, h: number) => (h > o.crest && o.weirL > 0 ? o.cw * o.weirL * Math.pow(h - o.crest, 1.5) : 0);
export const outflow = (o: Outlet, h: number) => orificeQ(o, h) + weirQ(o, h);

/** Modified rational hydrograph: rise over min(td, tc), hold until max(td, tc), fall over min(td, tc). Times in minutes. */
export function rationalHydro(C: number, iMmH: number, Aha: number, tcMin: number, tdMin: number) {
  const qp = (C * iMmH * Aha) / 360 * Math.min(1, tdMin / tcMin), a = Math.min(tcMin, tdMin) * 60, b = Math.max(tcMin, tdMin) * 60, end = a + b;
  const Q = (t: number) => (t <= 0 || t >= end ? 0 : t < a ? (qp * t) / a : t <= b ? qp : (qp * (end - t)) / a);
  return { Q, peak: qp, end, volume: qp * b };
}

/** Linear interpolation of a pasted hydrograph (t in s, ascending), zero outside it. */
export function tableHydro(t: number[], q: number[]) {
  const end = t[t.length - 1];
  const Q = (x: number) => {
    if (x < t[0] || x > end) return 0;
    let lo = 0, hi = t.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (t[m] <= x) lo = m; else hi = m; }
    return t[hi] === t[lo] ? q[hi] : q[lo] + ((q[hi] - q[lo]) * (x - t[lo])) / (t[hi] - t[lo]);
  };
  let vol = 0; for (let i = 1; i < t.length; i++) vol += ((q[i] + q[i - 1]) / 2) * (t[i] - t[i - 1]);
  return { Q, peak: Math.max(...q), end, volume: vol };
}

export type Route = { t: number[]; I: number[]; O: number[]; h: number[]; peakI: number; peakO: number; tPeakI: number; tPeakO: number; hMax: number; sMax: number; spill: boolean; outVol: number; drain: number };

/** Level-pool routing from an empty pond. dt in s; runs to tEnd s. */
export function route(I: (t: number) => number, g: Geom, o: Outlet, tEnd: number, dt = 10, h0 = 0): Route {
  const f = (t: number, h: number) => (I(t) - outflow(o, Math.max(0, h))) / areaAt(g, Math.max(0, h));
  const n = Math.ceil(tEnd / dt), r: Route = { t: [], I: [], O: [], h: [], peakI: 0, peakO: 0, tPeakI: 0, tPeakO: 0, hMax: h0, sMax: storageAt(g, h0), spill: false, outVol: 0, drain: NaN };
  let h = h0;
  const sub = 4, ds = dt / sub;
  for (let k = 0; k <= n; k++) {
    const t = k * dt, q = outflow(o, h), i = I(t);
    r.t.push(t); r.I.push(i); r.O.push(q); r.h.push(h);
    if (i > r.peakI) { r.peakI = i; r.tPeakI = t; }
    if (q > r.peakO) { r.peakO = q; r.tPeakO = t; }
    if (h > r.hMax) r.hMax = h;
    if (weirQ(o, h) > 0) r.spill = true;
    if (k === n) break;
    for (let s = 0; s < sub; s++) {
      const tt = t + s * ds, k1 = f(tt, h), k2 = f(tt + ds / 2, h + (ds / 2) * k1), k3 = f(tt + ds / 2, h + (ds / 2) * k2), k4 = f(tt + ds, h + ds * k3);
      h = Math.max(0, h + (ds / 6) * (k1 + 2 * k2 + 2 * k3 + k4));
    }
  }
  r.sMax = storageAt(g, r.hMax);
  for (let k = 1; k < r.t.length; k++) r.outVol += ((r.O[k] + r.O[k - 1]) / 2) * (r.t[k] - r.t[k - 1]);
  // Drain time: first time after the peak level when the outflow falls below 1 % of its peak.
  const kp = r.h.indexOf(r.hMax);
  for (let k = kp; k < r.t.length; k++) if (r.O[k] < 0.01 * r.peakO) { r.drain = r.t[k]; break; }
  return r;
}

/** Orifice diameter (m) that keeps the routed peak outflow at a target, by bisection. NaN when out of range. */
export function sizeOrifice(I: (t: number) => number, g: Geom, o: Outlet, tEnd: number, target: number, dt = 10) {
  const peak = (d: number) => route(I, g, { ...o, d }, tEnd, dt).peakO;
  let lo = 0.01, hi = 3;
  if (peak(lo) > target || peak(hi) < target) return NaN;
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (peak(m) > target) hi = m; else lo = m; }
  return (lo + hi) / 2;
}
