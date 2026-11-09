// Water and steam properties from IAPWS-IF97 (the IAPWS Industrial Formulation 1997, revised release 2007):
// regions 1 (liquid), 2 (vapour), 3 (near the critical point, solved for density) and 4 (saturation),
// plus enthalpy and entropy inversions and a simple or reheat Rankine cycle.
// Units: p in MPa, T in K, h in kJ/kg, s in kJ/(kg K), v in m³/kg, w in m/s.
// The coefficients are those published in the IAPWS release (public international standard).

export const R = 0.461526, TC = 647.096, PC = 22.064, RHOC = 322;
export const TMIN = 273.15, TMAX = 1073.15, PMAX = 100;

const R1_Li = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 8, 8, 21, 23, 29, 30, 31, 32];
const R1_Lj = [-2, -1, 0, 1, 2, 3, 4, 5, -9, -7, -1, 0, 1, 3, -3, 0, 1, 3, 17, -4, 0, 6, -5, -2, 10, -8, -11, -6, -29, -31, -38, -39, -40, -41];
const R1_n = [0.14632971213167, -0.84548187169114, -3.756360367204, 3.3855169168385, -0.95791963387872, 0.15772038513228, -0.016616417199501, 0.00081214629983568, 0.00028319080123804, -0.00060706301565874, -0.018990068218419, -0.032529748770505, -0.021841717175414, -5.283835796993e-05, -0.00047184321073267, -0.00030001780793026, 4.7661393906987e-05, -4.4141845330846e-06, -7.2694996297594e-16, -3.1679644845054e-05, -2.8270797985312e-06, -8.5205128120103e-10, -2.2425281908e-06, -6.5171222895601e-07, -1.4341729937924e-13, -4.0516996860117e-07, -1.2734301741641e-09, -1.7424871230634e-10, -6.8762131295531e-19, 1.4478307828521e-20, 2.6335781662795e-23, -1.1947622640071e-23, 1.8228094581404e-24, -9.3537087292458e-26];
const R2_Li = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 10, 10, 10, 16, 16, 18, 20, 20, 20, 21, 22, 23, 24, 24, 24];
const R2_Lj = [0, 1, 2, 3, 6, 1, 2, 4, 7, 36, 0, 1, 3, 6, 35, 1, 2, 3, 7, 3, 16, 35, 0, 11, 25, 8, 36, 13, 4, 10, 14, 29, 50, 57, 20, 35, 48, 21, 53, 39, 26, 40, 58];
const R2_n = [-0.0017731742473213, -0.017834862292358, -0.045996013696365, -0.057581259083432, -0.05032527872793, -3.3032641670203e-05, -0.00018948987516315, -0.0039392777243355, -0.043797295650573, -2.6674547914087e-05, 2.0481737692309e-08, 4.3870667284435e-07, -3.227767723857e-05, -0.0015033924542148, -0.040668253562649, -7.8847309559367e-10, 1.2790717852285e-08, 4.8225372718507e-07, 2.2922076337661e-06, -1.6714766451061e-11, -0.0021171472321355, -23.895741934104, -5.905956432427e-18, -1.2621808899101e-06, -0.038946842435739, 1.1256211360459e-11, -8.2311340897998, 1.9809712802088e-08, 1.0406965210174e-19, -1.0234747095929e-13, -1.0018179379511e-09, -8.0882908646985e-11, 0.10693031879409, -0.33662250574171, 8.9185845355421e-25, 3.0629316876232e-13, -4.2002467698208e-06, -5.9056029685639e-26, 3.7826947613457e-06, -1.2768608934681e-15, 7.3087610595061e-29, 5.5414715350778e-17, -9.436970724121e-07];
const R2_Jo = [0, 1, -5, -4, -3, -2, -1, 2, 3];
const R2_no = [-9.6927686500217, 10.086655968018, -0.005608791128302, 0.071452738081455, -0.40710498223928, 1.4240819171444, -4.383951131945, -0.28408632460772, 0.021268463753307];
const R3_Li = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 8, 9, 9, 10, 10, 11];
const R3_Lj = [0, 1, 2, 7, 10, 12, 23, 2, 6, 15, 17, 0, 2, 6, 7, 22, 26, 0, 2, 4, 16, 26, 0, 2, 4, 26, 1, 3, 26, 0, 2, 26, 2, 26, 2, 26, 0, 1, 26];
const R3_n = [-15.732845290239, 20.944396974307, -7.6867707878716, 2.6185947787954, -2.808078114862, 1.2053369696517, -0.0084566812812502, -1.2654315477714, -1.1524407806681, 0.88521043984318, -0.64207765181607, 0.38493460186671, -0.85214708824206, 4.8972281541877, -3.0502617256965, 0.039420536879154, 0.12558408424308, -0.2799932969871, 1.389979956946, -2.018991502357, -0.0082147637173963, -0.47596035734923, 0.0439840744735, -0.44476435428739, 0.90572070719733, 0.70522450087967, 0.10770512626332, -0.32913623258954, -0.50871062041158, -0.022175400873096, 0.094260751665092, 0.16436278447961, -0.013503372241348, -0.014834345352472, 0.00057922953628084, 0.0032308904703711, 8.0964802996215e-05, -0.00016557679795037, -4.4923899061815e-05];

export type State = {
  p: number; T: number; v: number; rho: number; h: number; s: number; u: number;
  cp: number; cv: number; w: number; x: number | null; region: 1 | 2 | 3 | 4; phase: string;
};
const done = (p: number, T: number, v: number, h: number, s: number, cp: number, cv: number, w: number, region: 1 | 2 | 3, phase: string): State =>
  ({ p, T, v, rho: 1 / v, h, s, u: h - p * 1000 * v, cp, cv, w, x: null, region, phase });

// ---------- Region 4: saturation line ----------
const N4 = [0.11670521452767e4, -0.72421316703206e6, -0.17073846940092e2, 0.12020824702470e5, -0.32325550322333e7, 0.14915108613530e2, -0.48232657361591e4, 0.40511340542057e6, -0.23855557567849, 0.65017534844798e3];
/** Saturation pressure (MPa) at T (K), 273.15 to 647.096 K. */
export function psat(T: number): number {
  const th = T + N4[8] / (T - N4[9]);
  const A = th * th + N4[0] * th + N4[1], B = N4[2] * th * th + N4[3] * th + N4[4], C = N4[5] * th * th + N4[6] * th + N4[7];
  return Math.pow((2 * C) / (-B + Math.sqrt(B * B - 4 * A * C)), 4);
}
/** Saturation temperature (K) at p (MPa), 611.213 Pa to 22.064 MPa. */
export function tsat(p: number): number {
  const b = Math.pow(p, 0.25);
  const E = b * b + N4[2] * b + N4[5], F = N4[0] * b * b + N4[3] * b + N4[6], G = N4[1] * b * b + N4[4] * b + N4[7];
  const D = (2 * G) / (-F - Math.sqrt(F * F - 4 * E * G));
  return (N4[9] + D - Math.sqrt((N4[9] + D) ** 2 - 4 * (N4[8] + N4[9] * D))) / 2;
}
// ---------- Boundary between regions 2 and 3 ----------
export const pB23 = (T: number) => 0.34805185628969e3 - 0.11671859879975e1 * T + 0.10192970039326e-2 * T * T;
export const tB23 = (p: number) => 0.57254459862746e3 + Math.sqrt((p - 0.1391883977870e2) / 0.10192970039326e-2);

// ---------- Region 1 ----------
export function region1(p: number, T: number): State {
  const pi = p / 16.53, tau = 1386 / T, a = 7.1 - pi, b = tau - 1.222;
  let g = 0, gp = 0, gpp = 0, gt = 0, gtt = 0, gpt = 0;
  for (let k = 0; k < R1_n.length; k++) {
    const I = R1_Li[k], J = R1_Lj[k], n = R1_n[k];
    const aI = Math.pow(a, I), bJ = Math.pow(b, J), aI1 = Math.pow(a, I - 1), bJ1 = Math.pow(b, J - 1);
    g += n * aI * bJ;
    gp -= n * I * aI1 * bJ;
    gpp += n * I * (I - 1) * Math.pow(a, I - 2) * bJ;
    gt += n * J * aI * bJ1;
    gtt += n * J * (J - 1) * aI * Math.pow(b, J - 2);
    gpt -= n * I * J * aI1 * bJ1;
  }
  const RT = R * T;
  const v = (pi * gp * RT) / p / 1000, h = tau * gt * RT, s = R * (tau * gt - g);
  const cp = -R * tau * tau * gtt, cv = R * (-tau * tau * gtt + (gp - tau * gpt) ** 2 / gpp);
  const w = Math.sqrt(RT * 1000 * gp * gp / ((gp - tau * gpt) ** 2 / (tau * tau * gtt) - gpp));
  return done(p, T, v, h, s, cp, cv, w, 1, 'liquid');
}

// ---------- Region 2 ----------
export function region2(p: number, T: number): State {
  const pi = p, tau = 540 / T, b = tau - 0.5;
  let g0 = Math.log(pi), g0t = 0, g0tt = 0;
  for (let k = 0; k < R2_no.length; k++) { const J = R2_Jo[k], n = R2_no[k]; g0 += n * Math.pow(tau, J); g0t += n * J * Math.pow(tau, J - 1); g0tt += n * J * (J - 1) * Math.pow(tau, J - 2); }
  const g0p = 1 / pi;
  let gr = 0, grp = 0, grpp = 0, grt = 0, grtt = 0, grpt = 0;
  for (let k = 0; k < R2_n.length; k++) {
    const I = R2_Li[k], J = R2_Lj[k], n = R2_n[k];
    const pI = Math.pow(pi, I), bJ = Math.pow(b, J), pI1 = Math.pow(pi, I - 1), bJ1 = Math.pow(b, J - 1);
    gr += n * pI * bJ; grp += n * I * pI1 * bJ; grpp += n * I * (I - 1) * Math.pow(pi, I - 2) * bJ;
    grt += n * pI * J * bJ1; grtt += n * pI * J * (J - 1) * Math.pow(b, J - 2); grpt += n * I * pI1 * J * bJ1;
  }
  const RT = R * T;
  const v = (pi * (g0p + grp) * RT) / p / 1000, h = tau * (g0t + grt) * RT, s = R * (tau * (g0t + grt) - (g0 + gr));
  const cp = -R * tau * tau * (g0tt + grtt);
  const cv = R * (-tau * tau * (g0tt + grtt) - (1 + pi * grp - tau * pi * grpt) ** 2 / (1 - pi * pi * grpp));
  const w = Math.sqrt(RT * 1000 * (1 + 2 * pi * grp + pi * pi * grp * grp) / (1 - pi * pi * grpp + (1 + pi * grp - tau * pi * grpt) ** 2 / (tau * tau * (g0tt + grtt))));
  return done(p, T, v, h, s, cp, cv, w, 2, T >= TC && p >= PC ? 'supercritical fluid' : 'superheated steam');
}

// ---------- Region 3 (Helmholtz energy in density and temperature) ----------
function phi3(rho: number, T: number) {
  const d = rho / RHOC, tau = TC / T, n1 = 1.0658070028513;
  let f = n1 * Math.log(d), fd = n1 / d, fdd = -n1 / (d * d), ft = 0, ftt = 0, fdt = 0;
  for (let k = 0; k < R3_n.length; k++) {
    const I = R3_Li[k], J = R3_Lj[k], n = R3_n[k];
    const dI = Math.pow(d, I), tJ = Math.pow(tau, J), dI1 = I ? Math.pow(d, I - 1) : 0, tJ1 = J ? Math.pow(tau, J - 1) : 0;
    f += n * dI * tJ; fd += n * I * dI1 * tJ; fdd += I > 1 ? n * I * (I - 1) * Math.pow(d, I - 2) * tJ : 0;
    ft += n * J * dI * tJ1; ftt += J > 1 || J < 0 ? n * J * (J - 1) * dI * Math.pow(tau, J - 2) : 0; fdt += n * I * J * dI1 * tJ1;
  }
  return { d, tau, f, fd, fdd, ft, ftt, fdt };
}
/** Pressure (MPa) from region 3's equation at density rho (kg/m³) and T (K). */
export const p3 = (rho: number, T: number) => { const z = phi3(rho, T); return z.d * z.fd * rho * R * T / 1000; };
export function region3(rho: number, T: number): State {
  const z = phi3(rho, T), RT = R * T, p = z.d * z.fd * rho * RT / 1000;
  const h = RT * (z.tau * z.ft + z.d * z.fd), s = R * (z.tau * z.ft - z.f);
  const cv = -R * z.tau * z.tau * z.ftt;
  const cp = R * (-z.tau * z.tau * z.ftt + (z.d * z.fd - z.d * z.tau * z.fdt) ** 2 / (2 * z.d * z.fd + z.d * z.d * z.fdd));
  const w = Math.sqrt(RT * 1000 * (2 * z.d * z.fd + z.d * z.d * z.fdd - (z.d * z.fd - z.d * z.tau * z.fdt) ** 2 / (z.tau * z.tau * z.ftt)));
  const phase = T >= TC ? (p >= PC ? 'supercritical fluid' : 'superheated steam') : p >= PC ? 'compressed liquid (above the critical pressure)' : rho > RHOC ? 'compressed liquid (near critical)' : 'superheated steam (near critical)';
  return done(p, T, 1 / rho, h, s, cp, cv, w, 3, phase);
}
/** All stable densities where region 3's pressure equals p at T, lowest first. */
function roots3(p: number, T: number, lo = 100, hi = 800, steps = 350): number[] {
  const out: number[] = [];
  const F = (r: number) => p3(r, T) - p;
  let r0 = lo, f0 = F(r0);
  for (let i = 1; i <= steps; i++) {
    const r1 = lo + ((hi - lo) * i) / steps, f1 = F(r1);
    if (f0 === 0 || f0 * f1 < 0) {
      let a = r0, b = r1, fa = f0;
      for (let k = 0; k < 80; k++) { const m = (a + b) / 2, fm = F(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } if (b - a < 1e-12 * b) break; }
      const r = (a + b) / 2;
      if (f1 > f0) out.push(r); // pressure rising with density: a mechanically stable root
    }
    r0 = r1; f0 = f1;
  }
  return out;
}
/** Region 3 state at (p, T): the stable root with the lowest Gibbs energy. */
export function region3pT(p: number, T: number): State {
  const rs = roots3(p, T);
  if (!rs.length) throw new Error('no region 3 density');
  const gibbs = (r: number) => { const z = phi3(r, T); return R * T * (z.f + z.d * z.fd); };
  let best = rs[0];
  for (const r of rs) if (gibbs(r) < gibbs(best)) best = r;
  return region3(best, T);
}

/** Which region (1, 2 or 3) holds (p, T); 0 when outside 273.15 to 1073.15 K or above 100 MPa. */
export function regionOf(p: number, T: number): 0 | 1 | 2 | 3 {
  if (!(T >= TMIN && T <= TMAX && p > 0 && p <= PMAX)) return 0;
  if (T <= 623.15) return p >= psat(T) ? 1 : 2;
  return p > pB23(T) ? 3 : 2;
}
/** Properties at pressure p (MPa) and temperature T (K), single phase. */
export function pT(p: number, T: number): State {
  const r = regionOf(p, T);
  if (r === 1) { const st = region1(p, T); if (p > PC) st.phase = 'compressed liquid (above the critical pressure)'; else st.phase = 'compressed liquid'; return st; }
  if (r === 2) return region2(p, T);
  if (r === 3) return region3pT(p, T);
  throw new Error('out of range');
}

/** Saturated liquid and vapour at temperature T (K). */
export function satT(T: number): { p: number; T: number; liq: State; vap: State } {
  if (!(T >= TMIN && T <= TC)) throw new Error('out of range');
  const p = psat(T);
  let liq: State, vap: State;
  if (T <= 623.15) { liq = region1(p, T); vap = region2(p, T); }
  else if (TC - T < 1e-6) { liq = region3(RHOC, TC); vap = region3(RHOC, TC); }
  else {
    const rs = roots3(p, T, 100, 800, 700);
    liq = region3(rs[rs.length - 1], T); vap = region3(rs[0], T);
  }
  liq.phase = 'saturated liquid'; vap.phase = 'saturated vapour'; liq.x = 0; vap.x = 1; liq.p = vap.p = p;
  return { p, T, liq, vap };
}
export const satP = (p: number) => { if (!(p >= psat(TMIN) && p <= PC)) throw new Error('out of range'); return satT(Math.min(TC, tsat(p))); };

/** Mixture of liquid and vapour with quality x. */
export function mix(sat: { p: number; T: number; liq: State; vap: State }, x: number): State {
  const L = sat.liq, V = sat.vap, m = (a: number, b: number) => a + x * (b - a);
  const v = m(L.v, V.v);
  return { p: sat.p, T: sat.T, v, rho: 1 / v, h: m(L.h, V.h), s: m(L.s, V.s), u: m(L.u, V.u), cp: NaN, cv: NaN, w: NaN, x, region: 4, phase: x <= 0 ? 'saturated liquid' : x >= 1 ? 'saturated vapour' : 'wet steam (liquid and vapour)' };
}

/** State at pressure p with a given enthalpy ('h') or entropy ('s'): wet steam if it falls between the saturated values. */
export function pX(p: number, key: 'h' | 's', val: number): State {
  if (!(p > 0 && p <= PMAX)) throw new Error('out of range');
  if (p < PC && p >= psat(TMIN)) {
    const sat = satP(p), a = sat.liq[key], b = sat.vap[key];
    if (val >= a && val <= b) return mix(sat, (val - a) / (b - a));
  }
  const at = (T: number) => pT(p, T)[key];
  let lo = TMIN, hi = TMAX;
  if (val < at(TMIN) - 1e-9 || val > at(TMAX) + 1e-9) throw new Error('out of range');
  const ts = p < PC && p >= psat(TMIN) ? tsat(p) : NaN;
  for (let k = 0; k < 200; k++) {
    let mid = (lo + hi) / 2;
    if (Number.isFinite(ts) && Math.abs(mid - ts) < 1e-9) mid = ts + (val > at(lo) ? 1e-8 : -1e-8);
    if (at(mid) < val) lo = mid; else hi = mid;
    if (hi - lo < 1e-10) break;
  }
  return pT(p, (lo + hi) / 2);
}

// ---------- Rankine cycle ----------
export type CycleIn = { pBoil: number; T3: number; pCond: number; etaT: number; etaP: number; reheat?: { p: number; T: number } };
export type CyclePoint = { name: string; st: State };
export function rankine(c: CycleIn) {
  const s1 = satP(c.pCond).liq; s1.phase = 'saturated liquid';
  const st1 = s1;
  const st2s = pX(c.pBoil, 's', st1.s), h2 = st1.h + (st2s.h - st1.h) / c.etaP, st2 = pX(c.pBoil, 'h', h2);
  const st3 = pT(c.pBoil, c.T3);
  const pts: CyclePoint[] = [{ name: '1 pump inlet', st: st1 }, { name: '2 boiler inlet', st: st2 }, { name: '3 turbine inlet', st: st3 }];
  let wT = 0, qIn = st3.h - st2.h, last = st3, ideal: State[] = [];
  if (c.reheat) {
    const a = pX(c.reheat.p, 's', st3.s), h4 = st3.h - c.etaT * (st3.h - a.h), st4 = pX(c.reheat.p, 'h', h4);
    const st5 = pT(c.reheat.p, c.reheat.T);
    wT += st3.h - st4.h; qIn += st5.h - st4.h; ideal.push(a);
    pts.push({ name: '4 to reheater', st: st4 }, { name: '5 reheated', st: st5 });
    last = st5;
  }
  const es = pX(c.pCond, 's', last.s), he = last.h - c.etaT * (last.h - es.h), ste = pX(c.pCond, 'h', he);
  wT += last.h - ste.h; ideal.push(es);
  pts.push({ name: `${pts.length + 1} turbine exit`, st: ste });
  const wP = st2.h - st1.h, wNet = wT - wP, eta = wNet / qIn;
  const Tmax = Math.max(c.T3, c.reheat?.T ?? 0);
  return { pts, ideal, wT, wP, wNet, qIn, qOut: ste.h - st1.h, eta, bwr: wP / wT, steamRate: 3600 / wNet, carnot: 1 - st1.T / Tmax, xExit: ste.x };
}

/** Saturation dome for a T-s diagram: [s, T] of the liquid line then back down the vapour line. */
export function dome(n = 60): { liq: [number, number][]; vap: [number, number][] } {
  const liq: [number, number][] = [], vap: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const T = TMIN + 0.01 + (TC - TMIN - 0.01) * (1 - Math.pow(1 - i / n, 1.6));
    const st = satT(Math.min(T, TC - 1e-3));
    liq.push([st.liq.s, T]); vap.push([st.vap.s, T]);
  }
  return { liq, vap };
}
/** Points along an isobar from state a to state b (s rising or falling), for drawing. */
export function isobar(p: number, a: State, b: State, n = 40): [number, number][] {
  const out: [number, number][] = [];
  const ts = p < PC ? tsat(p) : NaN, T0 = Math.min(a.T, b.T), T1 = Math.max(a.T, b.T);
  const sOf = (T: number) => pT(p, T).s;
  const pts: [number, number][] = [[a.s, a.T]];
  for (let i = 1; i < n; i++) {
    const T = T0 + ((T1 - T0) * i) / n;
    if (Number.isFinite(ts) && Math.abs(T - ts) < 1e-6) continue;
    const s = sOf(T);
    if (s > Math.min(a.s, b.s) && s < Math.max(a.s, b.s)) pts.push([s, T]);
  }
  if (Number.isFinite(ts) && ts > T0 && ts < T1) { const sat = satP(p); for (const s of [sat.liq.s, sat.vap.s]) if (s > Math.min(a.s, b.s) && s < Math.max(a.s, b.s)) pts.push([s, ts]); }
  if (Number.isFinite(ts) && (a.x !== null || b.x !== null)) { const sat = satP(p); for (const s of [sat.liq.s, sat.vap.s]) if (s > Math.min(a.s, b.s) && s < Math.max(a.s, b.s)) pts.push([s, ts]); }
  pts.push([b.s, b.T]);
  pts.sort((u, v) => (a.s <= b.s ? u[0] - v[0] : v[0] - u[0]));
  for (const q of pts) if (!out.length || Math.abs(out[out.length - 1][0] - q[0]) > 1e-9) out.push(q);
  return out;
}
