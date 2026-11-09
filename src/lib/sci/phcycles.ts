// Ideal-gas (air-standard) heat engine cycles: Carnot, Otto, Diesel, Brayton and Stirling. States, heats, work,
// efficiency, mean effective pressure and the process paths for P-v and T-s diagrams. Per kilogram of gas. No DOM.

export type Gas = { R: number; gamma: number }; // R in J/(kg K)
export type Cycle = 'carnot' | 'otto' | 'diesel' | 'brayton' | 'stirling';
export const CYCLE_NAMES: Record<Cycle, string> = { carnot: 'Carnot', otto: 'Otto (petrol engine)', diesel: 'Diesel', brayton: 'Brayton (gas turbine)', stirling: 'Stirling' };
export type Kind = 'isentropic' | 'isothermal' | 'isochoric' | 'isobaric';

export type Inputs = {
  T1: number; // K, start of compression (the coldest point)
  P1: number; // Pa
  r?: number; // compression ratio v1/v2 (Otto, Diesel, Stirling)
  rc?: number; // cut-off ratio v3/v2 (Diesel)
  rp?: number; // pressure ratio P2/P1 (Brayton)
  Tmax?: number; // K, hottest point (Carnot, Otto, Brayton, Stirling)
  rT?: number; // isothermal expansion ratio v3/v2 (Carnot)
  regen?: number; // regenerator effectiveness 0..1 (Stirling)
};
export type StatePt = { P: number; v: number; T: number; s: number };
export type Proc = { from: number; to: number; kind: Kind; q: number; w: number; label: string };
export type Result = { states: StatePt[]; procs: Proc[]; qin: number; qout: number; wnet: number; eta: number; carnot: number; mep: number; bwr?: number; regenQ?: number; problem?: string };

const cvOf = (g: Gas) => g.R / (g.gamma - 1), cpOf = (g: Gas) => (g.gamma * g.R) / (g.gamma - 1);

/** Works out a cycle from its inputs. Returns `problem` (a plain message) when the inputs cannot make that cycle. */
export function cycle(kind: Cycle, inp: Inputs, g: Gas): Result {
  const { T1, P1 } = inp, k = g.gamma, cv = cvOf(g), cp = cpOf(g), R = g.R;
  const v1 = (R * T1) / P1;
  const pts: { v: number; T: number }[] = [{ v: v1, T: T1 }];
  const kinds: Kind[] = [];
  const bad = (problem: string): Result => ({ states: [], procs: [], qin: NaN, qout: NaN, wnet: NaN, eta: NaN, carnot: NaN, mep: NaN, problem });
  let regenQ: number | undefined;
  if (kind === 'otto' || kind === 'diesel') {
    const r = inp.r!;
    if (!(r > 1)) return bad('The compression ratio must be greater than 1.');
    const v2 = v1 / r, T2 = T1 * r ** (k - 1);
    pts.push({ v: v2, T: T2 });
    if (kind === 'otto') {
      const T3 = inp.Tmax!;
      if (!(T3 > T2)) return bad(`The peak temperature must be above the end-of-compression temperature, ${T2.toFixed(0)} K.`);
      pts.push({ v: v2, T: T3 }, { v: v1, T: T3 * (1 / r) ** (k - 1) });
      kinds.push('isentropic', 'isochoric', 'isentropic', 'isochoric');
    } else {
      const rc = inp.rc!;
      if (!(rc > 1)) return bad('The cut-off ratio must be greater than 1.');
      if (!(rc < r)) return bad('The cut-off ratio must be less than the compression ratio.');
      const v3 = v2 * rc, T3 = T2 * rc;
      pts.push({ v: v3, T: T3 }, { v: v1, T: T3 * (v3 / v1) ** (k - 1) });
      kinds.push('isentropic', 'isobaric', 'isentropic', 'isochoric');
    }
  } else if (kind === 'brayton') {
    const rp = inp.rp!, T3 = inp.Tmax!;
    if (!(rp > 1)) return bad('The pressure ratio must be greater than 1.');
    const T2 = T1 * rp ** ((k - 1) / k), P2 = P1 * rp;
    if (!(T3 > T2)) return bad(`The turbine inlet temperature must be above the compressor outlet temperature, ${T2.toFixed(0)} K.`);
    const T4 = T3 / rp ** ((k - 1) / k);
    pts.push({ v: (R * T2) / P2, T: T2 }, { v: (R * T3) / P2, T: T3 }, { v: (R * T4) / P1, T: T4 });
    kinds.push('isentropic', 'isobaric', 'isentropic', 'isobaric');
  } else if (kind === 'carnot') {
    const TH = inp.Tmax!, rT = inp.rT!;
    if (!(TH > T1)) return bad('The hot temperature must be above the cold temperature T1.');
    if (!(rT > 1)) return bad('The isothermal expansion ratio must be greater than 1.');
    const v2 = v1 * (T1 / TH) ** (1 / (k - 1)), v3 = v2 * rT, v4 = v3 * (TH / T1) ** (1 / (k - 1));
    pts.push({ v: v2, T: TH }, { v: v3, T: TH }, { v: v4, T: T1 });
    kinds.push('isentropic', 'isothermal', 'isentropic', 'isothermal');
  } else {
    const TH = inp.Tmax!, r = inp.r!, e = inp.regen ?? 1;
    if (!(TH > T1)) return bad('The hot temperature must be above the cold temperature T1.');
    if (!(r > 1)) return bad('The compression ratio must be greater than 1.');
    if (!(e >= 0 && e <= 1)) return bad('The regenerator effectiveness must be between 0 and 1 (0 % to 100 %).');
    const v2 = v1 / r;
    pts.push({ v: v2, T: T1 }, { v: v2, T: TH }, { v: v1, T: TH });
    kinds.push('isothermal', 'isochoric', 'isothermal', 'isochoric');
    regenQ = e * cv * (TH - T1);
  }
  const states: StatePt[] = pts.map((p) => ({ v: p.v, T: p.T, P: (R * p.T) / p.v, s: cv * Math.log(p.T / T1) + R * Math.log(p.v / v1) }));
  const LBL: Record<Kind, string> = { isentropic: 'isentropic', isothermal: 'isothermal', isochoric: 'constant volume', isobaric: 'constant pressure' };
  const procs: Proc[] = kinds.map((kd, i) => {
    const a = states[i], b = states[(i + 1) % 4];
    let q = 0, w = 0;
    if (kd === 'isentropic') w = cv * (a.T - b.T);
    if (kd === 'isothermal') { w = R * a.T * Math.log(b.v / a.v); q = w; }
    if (kd === 'isochoric') q = cv * (b.T - a.T);
    if (kd === 'isobaric') { q = cp * (b.T - a.T); w = a.P * (b.v - a.v); }
    return { from: i + 1, to: ((i + 1) % 4) + 1, kind: kd, q, w, label: LBL[kd] };
  });
  let qin = procs.reduce((s, p) => s + Math.max(0, p.q), 0), qout = -procs.reduce((s, p) => s + Math.min(0, p.q), 0);
  if (regenQ !== undefined) { qin -= regenQ; qout -= regenQ; }
  const wnet = procs.reduce((s, p) => s + p.w, 0);
  const Tmax = Math.max(...states.map((s) => s.T)), Tmin = Math.min(...states.map((s) => s.T));
  const vmax = Math.max(...states.map((s) => s.v)), vmin = Math.min(...states.map((s) => s.v));
  const res: Result = { states, procs, qin, qout, wnet, eta: wnet / qin, carnot: 1 - Tmin / Tmax, mep: wnet / (vmax - vmin), regenQ };
  if (kind === 'brayton') res.bwr = -procs[0].w / procs[2].w;
  return res;
}

/** Points along one process for the diagrams: v, T, P and s at n + 1 points. */
export function path(a: StatePt, b: StatePt, kind: Kind, g: Gas, T1: number, v1: number, n = 60) {
  const cv = cvOf(g), out: StatePt[] = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    let v: number, T: number;
    if (kind === 'isochoric') { v = a.v; T = a.T + (b.T - a.T) * f; }
    else if (kind === 'isobaric') { T = a.T + (b.T - a.T) * f; v = (a.v * T) / a.T; }
    else { v = a.v * Math.pow(b.v / a.v, f); T = kind === 'isothermal' ? a.T : a.T * Math.pow(a.v / v, g.gamma - 1); }
    out.push({ v, T, P: (g.R * T) / v, s: cv * Math.log(T / T1) + g.R * Math.log(v / v1) });
  }
  return out;
}

/** Closed-form efficiencies from textbooks, for checking. */
export const formula = {
  otto: (r: number, k: number) => 1 - 1 / r ** (k - 1),
  diesel: (r: number, rc: number, k: number) => 1 - (rc ** k - 1) / (k * r ** (k - 1) * (rc - 1)),
  brayton: (rp: number, k: number) => 1 - 1 / rp ** ((k - 1) / k),
  carnot: (TC: number, TH: number) => 1 - TC / TH,
};
