// Upper-air sounding: parcel lifting, LCL, LFC, EL, CAPE, CIN, stability indices, precipitable water and shear. No DOM.
// Constants as in MetPy (Rd, cp, epsilon, Lv); saturation vapour pressure from Bolton (1980) over liquid water.

export const RD = 287.04749, CP = 1004.6662184, EPS = 0.6219569, LV = 2.50084e6, G = 9.80665, KAPPA = RD / CP, T0 = 273.15;

export type Level = { p: number; z?: number; t: number; td?: number; dir?: number; spd?: number };
export type ParcelKind = 'sb' | 'ml' | 'mu';

/** Saturation vapour pressure in hPa at t °C (Bolton 1980, eq. 10). */
export const es = (tC: number) => 6.112 * Math.exp((17.67 * tC) / (tC + 243.5));
/** Dew point in °C from the vapour pressure in hPa (inverse of es). */
export const tdFromE = (e: number) => { const l = Math.log(e / 6.112); return (243.5 * l) / (17.67 - l); };
/** Mixing ratio in kg/kg of air at p hPa holding vapour of dew point td °C (saturation mixing ratio when td is the temperature). */
export const mixr = (p: number, tdC: number) => { const e = es(tdC); return (EPS * e) / (p - e); };
/** Dew point (°C) of air at p hPa with mixing ratio w kg/kg. */
export const tdFromW = (p: number, w: number) => tdFromE((w * p) / (EPS + w));
/** Potential temperature in K from t °C at p hPa. */
export const theta = (p: number, tC: number) => (tC + T0) * (1000 / p) ** KAPPA;
/** Virtual temperature in K. */
export const tv = (tK: number, w: number) => (tK * (w + EPS)) / (EPS * (1 + w));
/** Equivalent potential temperature in K (Bolton 1980, eq. 39), from t and td in °C at p hPa. */
export function thetaE(p: number, tC: number, tdC: number) {
  const T = tC + T0, Td = tdC + T0, r = mixr(p, tdC) * 1000;
  const TL = 1 / (1 / (Td - 56) + Math.log(T / Td) / 800) + 56;
  return T * (1000 / p) ** (0.2854 * (1 - 0.00028 * r)) * Math.exp((3.376 / TL - 0.00254) * r * (1 + 0.00081 * r));
}

/** Lifting condensation level: lift dry air from (p, t, td) until the dew point it keeps meets its temperature. */
export function lcl(p: number, tC: number, tdC: number) {
  const T = tC + T0, w = mixr(p, tdC);
  let pl = p;
  for (let i = 0; i < 100; i++) {
    const td = tdFromW(pl, w) + T0, np = p * (td / T) ** (1 / KAPPA);
    if (Math.abs(np - pl) < 1e-6) { pl = np; break; }
    pl = np;
  }
  pl = Math.min(pl, p);
  return { p: pl, t: T * (pl / p) ** KAPPA - T0 };
}

function dTdp(p: number, T: number) {
  const rs = mixr(p, T - T0);
  return (RD * T + LV * rs) / (CP + (LV * LV * rs * EPS) / (RD * T * T)) / p;
}
/** Temperature (°C) along the saturated (pseudo-adiabatic) lapse from (p0, t0) to p, by Runge-Kutta in steps of at most 2 hPa. */
export function moist(p0: number, tC: number, p: number) {
  let T = tC + T0, q = p0;
  const n = Math.max(1, Math.ceil(Math.abs(p - p0) / 2)), h = (p - p0) / n;
  for (let i = 0; i < n; i++) {
    const k1 = dTdp(q, T), k2 = dTdp(q + h / 2, T + (h / 2) * k1), k3 = dTdp(q + h / 2, T + (h / 2) * k2), k4 = dTdp(q + h, T + h * k3);
    T += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4); q += h;
  }
  return T - T0;
}
/** Parcel temperature (°C) at p for a parcel starting at (p0, t0, td0): dry adiabat to the LCL, then the moist adiabat. */
export function parcelAt(p0: number, t0: number, td0: number, p: number, L = lcl(p0, t0, td0)) {
  return p >= L.p ? (t0 + T0) * (p / p0) ** KAPPA - T0 : moist(L.p, L.t, p);
}

/** Linear interpolation of y against ln p (pressures descending); NaN outside the range or when a neighbour is NaN. */
export function atP(ps: number[], ys: (number | undefined)[], p: number) {
  for (let i = 0; i < ps.length - 1; i++) {
    const a = ps[i], b = ps[i + 1];
    if (p <= a && p >= b) {
      const ya = ys[i], yb = ys[i + 1];
      if (ya === undefined || yb === undefined || !Number.isFinite(ya) || !Number.isFinite(yb)) return NaN;
      if (a === b) return ya;
      const f = Math.log(a / p) / Math.log(a / b);
      return ya + f * (yb - ya);
    }
  }
  return ps.length === 1 && p === ps[0] ? ys[0] ?? NaN : NaN;
}

/** Sorts by pressure (high to low), drops levels without pressure or temperature and repeats of a pressure. */
export function tidy(levels: Level[]) {
  const ok = levels.filter((l) => Number.isFinite(l.p) && l.p > 0 && Number.isFinite(l.t)).sort((a, b) => b.p - a.p);
  return ok.filter((l, i) => i === 0 || l.p < ok[i - 1].p);
}

/** Heights (m): the z column where given, filled in by the hypsometric equation from the virtual temperature elsewhere. */
export function heights(lv: Level[], z0 = 0) {
  const z: number[] = [];
  const tvOf = (l: Level) => tv(l.t + T0, l.td !== undefined && Number.isFinite(l.td) ? mixr(l.p, l.td) : 0);
  lv.forEach((l, i) => {
    if (l.z !== undefined && Number.isFinite(l.z)) { z.push(l.z); return; }
    if (i === 0) { z.push(z0); return; }
    const a = lv[i - 1];
    z.push(z[i - 1] + ((RD * (tvOf(a) + tvOf(l))) / 2 / G) * Math.log(a.p / l.p));
  });
  return z;
}

/** The starting parcel: surface-based, mixed through the lowest `depth` hPa (mean θ and mixing ratio), or the most unstable (highest θe) in the lowest `depth` hPa. */
export function startParcel(lv: Level[], kind: ParcelKind, depth = kind === 'mu' ? 300 : 100) {
  const s = lv[0];
  if (kind === 'sb') return { p: s.p, t: s.t, td: s.td!, i: 0 };
  if (kind === 'mu') {
    let best = -1, bi = 0;
    lv.forEach((l, i) => { if (l.p >= s.p - depth && l.td !== undefined && Number.isFinite(l.td)) { const te = thetaE(l.p, l.t, l.td); if (te > best) { best = te; bi = i; } } });
    return { p: lv[bi].p, t: lv[bi].t, td: lv[bi].td!, i: bi };
  }
  // Mixed layer: pressure-weighted means by the trapezoid rule over the layer, with the top level interpolated.
  const top = s.p - depth, ps: number[] = [], th: number[] = [], ws: number[] = [];
  const P = lv.map((l) => l.p), TH = lv.map((l) => theta(l.p, l.t)), W = lv.map((l) => (l.td !== undefined && Number.isFinite(l.td) ? mixr(l.p, l.td) : NaN));
  lv.forEach((l, i) => { if (l.p > top) { ps.push(l.p); th.push(TH[i]); ws.push(W[i]); } });
  ps.push(top); th.push(atP(P, TH, top)); ws.push(atP(P, W, top));
  let a = 0, b = 0, d = 0;
  for (let i = 0; i < ps.length - 1; i++) { const dp = ps[i] - ps[i + 1]; a += ((th[i] + th[i + 1]) / 2) * dp; b += ((ws[i] + ws[i + 1]) / 2) * dp; d += dp; }
  const thm = a / d, wm = b / d;
  return { p: s.p, t: thm * (s.p / 1000) ** KAPPA - T0, td: tdFromW(s.p, wm), i: 0 };
}

export type Point = { p: number; t: number; z: number } | null;
export type Result = {
  start: { p: number; t: number; td: number; z: number };
  lcl: { p: number; t: number; z: number };
  lfc: Point; el: Point; elAboveTop: boolean;
  cape: number; cin: number;
  li: number; showalter: number; k: number; tt: number; pw: number; freezing: number;
  shear01: number; shear06: number;
  grid: { p: number[]; tp: number[]; buoy: number[] };
  z: number[];
};

/**
 * Lifts the chosen parcel through the sounding. CAPE and CIN follow MetPy's cape_cin: buoyancy (parcel minus environment
 * virtual temperature when `virtual`) is integrated against ln p, CAPE from the LFC to the EL (or the top of the
 * sounding), CIN from the start to the LFC (set to 0 if positive). LFC: the lowest level at or above the LCL where the
 * parcel becomes warmer; EL: the highest level where it becomes cooler again.
 */
export function analyse(input: Level[], kind: ParcelKind = 'sb', opts: { virtual?: boolean; z0?: number; depth?: number } = {}): Result {
  const lv = tidy(input), virt = opts.virtual ?? true;
  if (lv.length < 3) throw new Error('Need at least three levels with pressure and temperature.');
  if (lv[0].td === undefined || !Number.isFinite(lv[0].td)) throw new Error('The lowest level needs a dew point.');
  const z = heights(lv, opts.z0 ?? 0), P = lv.map((l) => l.p);
  const zAt = (p: number) => atP(P, z, p);
  const st = startParcel(lv, kind, opts.depth);
  const L = lcl(st.p, st.t, st.td), w0 = mixr(st.p, st.td);
  // Grid: sounding levels from the start upward, with the LCL inserted.
  const gp = P.filter((p) => p <= st.p);
  if (gp[0] !== st.p) gp.unshift(st.p);
  if (L.p < st.p && !gp.some((p) => Math.abs(p - L.p) < 1e-9)) { gp.push(L.p); gp.sort((a, b) => b - a); }
  const envT = (p: number) => atP(P, lv.map((l) => l.t), p);
  const envW = (p: number) => { const td = atP(P, lv.map((l) => l.td), p); return Number.isFinite(td) ? mixr(p, td) : 0; };
  // Parcel temperature along the grid, stepping the moist adiabat level to level.
  const tp: number[] = [];
  let lastP = L.p, lastT = L.t;
  for (const p of gp) {
    if (p >= L.p) tp.push((st.t + T0) * (p / st.p) ** KAPPA - T0);
    else { lastT = moist(lastP, lastT, p); lastP = p; tp.push(lastT); }
  }
  let buoy = gp.map((p, i) => {
    const te = envT(p);
    if (!virt) return tp[i] - te;
    const wp = p >= L.p ? w0 : mixr(p, tp[i]);
    return tv(tp[i] + T0, wp) - tv(te + T0, envW(p));
  });
  // Insert the zero crossings (linear in ln p).
  const xs: number[] = [], ys: number[] = [], ts: number[] = [];
  gp.forEach((p, i) => {
    if (i > 0) {
      const a = buoy[i - 1], b = buoy[i];
      if (Number.isFinite(a) && Number.isFinite(b) && a * b < 0) {
        const f = a / (a - b), pc = Math.exp(Math.log(gp[i - 1]) + f * Math.log(p / gp[i - 1]));
        xs.push(pc); ys.push(0); ts.push(tp[i - 1] + f * (tp[i] - tp[i - 1]));
      }
    }
    xs.push(p); ys.push(buoy[i]); ts.push(tp[i]);
  });
  buoy = ys;
  const ok = (i: number) => Number.isFinite(ys[i]);
  // LFC: the LCL if the parcel is already warmer there, else the first crossing above it into positive buoyancy.
  let iL = xs.findIndex((p) => p <= L.p + 1e-9), lfcI = -1;
  if (iL < 0) iL = xs.length;
  for (let i = iL; i < xs.length && ok(i); i++) {
    if (i === iL && ys[i] > 0) { lfcI = i; break; }
    if (ys[i] === 0 && i + 1 < xs.length && ys[i + 1] > 0) { lfcI = i; break; }
  }
  // EL: the highest crossing back into negative buoyancy; if the parcel is still warmer at the top, the top is used.
  let elI = -1, elAboveTop = false;
  if (lfcI >= 0) {
    let lastOk = lfcI;
    for (let i = lfcI + 1; i < xs.length && ok(i); i++) lastOk = i;
    if (ys[lastOk] > 0) { elAboveTop = true; elI = lastOk; }
    else { for (let i = lastOk; i > lfcI; i--) if (ys[i] === 0 && ys[i - 1] > 0) { elI = i; break; } if (elI < 0) elI = lastOk; }
  }
  const trap = (i0: number, i1: number) => { let s = 0; for (let i = i0; i < i1; i++) if (ok(i) && ok(i + 1)) s += ((ys[i] + ys[i + 1]) / 2) * Math.log(xs[i] / xs[i + 1]); return RD * s; };
  let cape = 0, cin = 0;
  if (lfcI >= 0) { cape = Math.max(0, trap(lfcI, elI)); cin = Math.min(0, trap(0, lfcI)); }
  const pt = (i: number): Point => (i < 0 ? null : { p: xs[i], t: ts[i], z: zAt(xs[i]) });
  // Indices.
  const T = (p: number) => envT(p), Td = (p: number) => atP(P, lv.map((l) => l.td), p);
  const has = (p: number) => p <= lv[0].p && p >= lv[lv.length - 1].p;
  const li = has(500) && st.p > 500 ? T(500) - parcelAt(st.p, st.t, st.td, 500, L) : NaN;
  const showalter = has(850) && has(500) && Number.isFinite(Td(850)) ? T(500) - parcelAt(850, T(850), Td(850), 500) : NaN;
  const k = has(850) && has(500) ? T(850) - T(500) + Td(850) - (T(700) - Td(700)) : NaN;
  const tt = has(850) && has(500) ? T(850) + Td(850) - 2 * T(500) : NaN;
  // Precipitable water (mm = kg/m²) over the levels with a dew point.
  let pw = 0;
  for (let i = 0; i < lv.length - 1; i++) {
    const a = lv[i], b = lv[i + 1];
    if (a.td === undefined || b.td === undefined || !Number.isFinite(a.td) || !Number.isFinite(b.td)) continue;
    pw += ((mixr(a.p, a.td) + mixr(b.p, b.td)) / 2) * (a.p - b.p) * 100 / G;
  }
  // Freezing level (first 0 °C crossing from the bottom), height above the ground.
  let freezing = NaN;
  if (lv[0].t <= 0) freezing = 0;
  else for (let i = 1; i < lv.length; i++) if (lv[i].t <= 0) { freezing = z[i - 1] + ((lv[i - 1].t) / (lv[i - 1].t - lv[i].t)) * (z[i] - z[i - 1]) - z[0]; break; }
  // Bulk shear (kt) from the lowest wind to 1 and 6 km above the ground.
  const wl = lv.map((l, i) => ({ z: z[i] - z[0], l })).filter((o) => Number.isFinite(o.l.dir) && Number.isFinite(o.l.spd));
  const uv = (o: { l: Level }) => { const r = (o.l.dir! * Math.PI) / 180; return [-o.l.spd! * Math.sin(r), -o.l.spd! * Math.cos(r)]; };
  const windAt = (h: number) => {
    for (let i = 0; i < wl.length - 1; i++) if (h >= wl[i].z && h <= wl[i + 1].z) { const f = (h - wl[i].z) / (wl[i + 1].z - wl[i].z || 1), a = uv(wl[i]), b = uv(wl[i + 1]); return [a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1])]; }
    return null;
  };
  const shear = (h: number) => { if (wl.length < 2) return NaN; const a = uv(wl[0]), b = windAt(h); return b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : NaN; };
  return {
    start: { p: st.p, t: st.t, td: st.td, z: zAt(st.p) - z[0] },
    lcl: { p: L.p, t: L.t, z: zAt(L.p) - z[0] },
    lfc: pt(lfcI), el: elAboveTop ? null : pt(elI), elAboveTop,
    cape, cin, li, showalter, k, tt, pw, freezing, shear01: shear(1000), shear06: shear(6000),
    grid: { p: xs, tp: ts, buoy }, z,
  };
}

const NAMES: Record<string, keyof Level> = { pres: 'p', pressure: 'p', p: 'p', prs: 'p', hght: 'z', height: 'z', hgt: 'z', z: 'z', gph: 'z', geopotential: 'z', temp: 't', temperature: 't', t: 't', tmp: 't', dwpt: 'td', dewpoint: 'td', td: 'td', dwp: 'td', drct: 'dir', dir: 'dir', direction: 'dir', wdir: 'dir', sknt: 'spd', speed: 'spd', spd: 'spd', wspd: 'spd', knots: 'spd' };
/**
 * Reads a sounding: the University of Wyoming text list (fixed 7-character columns, PRES HGHT TEMP DWPT ... DRCT SKNT),
 * or a table with a header naming the columns, or a table without a header (p, T, Td [, dir, speed] or p, z, T, Td [, dir, speed]).
 * Temperatures in °C; speeds in knots unless the header says m/s.
 */
export function parseSounding(text: string): { levels: Level[]; format: string; note: string } {
  const lines = text.replace(/\r/g, '').split('\n');
  const hi = lines.findIndex((l) => /\bPRES\b/.test(l) && /\bTEMP\b/.test(l));
  if (hi >= 0 && /^\s{0,4}PRES/.test(lines[hi])) {
    const cols = lines[hi].trim().split(/\s+/), levels: Level[] = [];
    const idx = (n: string) => cols.indexOf(n);
    for (let j = hi + 1; j < lines.length; j++) {
      const l = lines[j];
      if (/^\s*$/.test(l) || /^-+/.test(l.trim()) || /hPa/.test(l)) { if (levels.length && /^\s*$/.test(l)) break; continue; }
      if (/[A-Za-z]/.test(l)) { if (levels.length) break; continue; }
      const cell = (n: string) => { const k = idx(n); if (k < 0) return undefined; const s = l.slice(k * 7, k * 7 + 7).trim(); return s === '' ? undefined : +s; };
      const lev: Level = { p: cell('PRES')!, z: cell('HGHT'), t: cell('TEMP')!, td: cell('DWPT'), dir: cell('DRCT'), spd: cell('SKNT') };
      if (lev.p !== undefined && lev.t !== undefined) levels.push(lev);
    }
    return { levels: tidy(levels), format: 'University of Wyoming text', note: '' };
  }
  const rows = lines.map((l) => l.trim()).filter(Boolean).map((l) => l.split(l.includes('\t') ? /\t/ : l.includes(',') ? /\s*,\s*/ : /\s+/));
  if (!rows.length) return { levels: [], format: 'table', note: '' };
  let map: (keyof Level | null)[] = [], start = 0, ms = false;
  if (rows[0].some((c) => /[A-Za-z]/.test(c) && !/^nan$/i.test(c))) {
    map = rows[0].map((c) => {
      const k = c.toLowerCase().replace(/\(.*?\)|\[.*?\]|[^a-z]/g, '');
      const name = NAMES[k] ?? (/^dew/.test(k) ? 'td' : /^temp/.test(k) ? 't' : /^press/.test(k) ? 'p' : /^(height|geopot|hgt)/.test(k) ? 'z' : /^(wind)?dir/.test(k) ? 'dir' : /^(wind)?(speed|spd)/.test(k) ? 'spd' : null);
      if (name === 'spd' && /m\s*\/\s*s|\bms\b|mps/i.test(c)) ms = true;
      return name;
    });
    start = 1;
  } else {
    const n = Math.max(...rows.map((r) => r.length));
    map = n === 3 || n === 5 ? ['p', 't', 'td', 'dir', 'spd'] : ['p', 'z', 't', 'td', 'dir', 'spd'];
  }
  const levels: Level[] = [];
  for (const r of rows.slice(start)) {
    const lev: Partial<Level> = {};
    map.forEach((k, i) => { if (!k || lev[k] !== undefined) return; const v = r[i] === undefined || r[i] === '' ? NaN : +r[i]; if (Number.isFinite(v)) (lev as Record<string, number>)[k] = v; });
    if (lev.p !== undefined && lev.t !== undefined) { if (ms && lev.spd !== undefined) lev.spd = lev.spd / 0.514444; levels.push(lev as Level); }
  }
  let note = '';
  const t = tidy(levels);
  if (t.length && t.filter((l) => l.t > 150).length > t.length / 2) { t.forEach((l) => { l.t -= T0; if (l.td !== undefined) l.td -= T0; }); note = 'Temperatures looked like kelvin and were converted to °C.'; }
  if (map.indexOf('p') < 0 || map.indexOf('t') < 0) note = 'Could not find pressure and temperature columns.';
  return { levels: t, format: start ? 'table with a header' : 'table without a header', note };
}
