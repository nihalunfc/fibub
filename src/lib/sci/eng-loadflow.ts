// AC load flow (power flow) for small networks in per unit: bus admittance matrix, Newton-Raphson
// (polar form, full Jacobian) and Gauss-Seidel, then bus voltages, line flows and losses.
// Plain TypeScript, no DOM. The example network is made up for fibub (not an IEEE or textbook case).
import { num, parseTable } from './num.ts';

export type BusType = 'slack' | 'PV' | 'PQ';
export type Bus = { id: string; type: BusType; Pd: number; Qd: number; Pg: number; V: number };
export type Line = { from: string; to: string; R: number; X: number; B: number };
export type Method = 'nr' | 'gs';
export type FlowOptions = { base: number; method: Method; tol?: number; maxIter?: number; accel?: number };
export type BusResult = { id: string; type: BusType; V: number; deg: number; P: number; Q: number; Pg: number; Qg: number; Pd: number; Qd: number };
export type LineResult = { from: string; to: string; Pij: number; Qij: number; Pji: number; Qji: number; Ploss: number; Qloss: number; I: number };
export type FlowResult = {
  converged: boolean; iterations: number; history: number[]; buses: BusResult[]; lines: LineResult[];
  lossP: number; lossQ: number; genP: number; genQ: number; loadP: number; loadQ: number;
  Vre: number[]; Vim: number[];
};

/** Bus admittance matrix as G (real) and B (imaginary) parts. Line charging B is the total, split half at each end. */
export function ybus(n: number, lines: { i: number; j: number; R: number; X: number; B: number }[]) {
  const G = Array.from({ length: n }, () => new Float64Array(n)), Bm = Array.from({ length: n }, () => new Float64Array(n));
  for (const l of lines) {
    const d = l.R * l.R + l.X * l.X, g = l.R / d, b = -l.X / d;
    G[l.i][l.i] += g; G[l.j][l.j] += g; Bm[l.i][l.i] += b + l.B / 2; Bm[l.j][l.j] += b + l.B / 2;
    G[l.i][l.j] -= g; G[l.j][l.i] -= g; Bm[l.i][l.j] -= b; Bm[l.j][l.i] -= b;
  }
  return { G, B: Bm };
}

/** Solve A x = b by Gaussian elimination with partial pivoting (A and b are copied). */
export function solve(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-14) throw new Error('singular');
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}

/** Check the network and turn ids into indices. Throws an Error with a plain message. */
export function prepare(buses: Bus[], lines: Line[]) {
  if (buses.length < 2) throw new Error('Give at least two buses.');
  const idx = new Map<string, number>();
  buses.forEach((b, i) => { if (idx.has(b.id)) throw new Error(`Bus ${b.id} is listed twice.`); idx.set(b.id, i); });
  const slack = buses.filter((b) => b.type === 'slack');
  if (slack.length !== 1) throw new Error(slack.length ? 'Only one bus can be the slack bus.' : 'One bus must be the slack bus (type slack).');
  for (const b of buses) if (b.type !== 'PQ' && !(b.V > 0.5 && b.V < 1.5)) throw new Error(`Give bus ${b.id} a set voltage between 0.5 and 1.5 per unit.`);
  if (!lines.length) throw new Error('Give at least one line.');
  const L = lines.map((l, k) => {
    const i = idx.get(l.from), j = idx.get(l.to);
    if (i == null || j == null) throw new Error(`Line ${k + 1} joins bus ${i == null ? l.from : l.to}, which is not in the bus table.`);
    if (i === j) throw new Error(`Line ${k + 1} starts and ends at bus ${l.from}.`);
    if (!(l.R >= 0) || !Number.isFinite(l.X) || l.R * l.R + l.X * l.X === 0) throw new Error(`Line ${k + 1} (${l.from}–${l.to}) needs R of 0 or more and an impedance that is not zero.`);
    if (!Number.isFinite(l.B)) throw new Error(`Line ${k + 1} has no charging B (use 0 if there is none).`);
    return { i, j, R: l.R, X: l.X, B: l.B };
  });
  // Every bus must connect to the slack bus.
  const s = buses.findIndex((b) => b.type === 'slack'), seen = new Set([s]), stack = [s];
  while (stack.length) { const a = stack.pop()!; for (const l of L) { const o = l.i === a ? l.j : l.j === a ? l.i : -1; if (o >= 0 && !seen.has(o)) { seen.add(o); stack.push(o); } } }
  const off = buses.filter((_, i) => !seen.has(i)).map((b) => b.id);
  if (off.length) throw new Error(`Bus ${off.join(', ')} is not connected to the slack bus.`);
  return { L, slack: s };
}

/** Power injections P + jQ at every bus for voltages V (rectangular). */
export function injections(G: Float64Array[], B: Float64Array[], Vr: number[], Vi: number[]) {
  const n = Vr.length, P = new Array(n).fill(0), Q = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let Ir = 0, Ii = 0; // I = Y V
    for (let k = 0; k < n; k++) { Ir += G[i][k] * Vr[k] - B[i][k] * Vi[k]; Ii += G[i][k] * Vi[k] + B[i][k] * Vr[k]; }
    P[i] = Vr[i] * Ir + Vi[i] * Ii; Q[i] = Vi[i] * Ir - Vr[i] * Ii; // S = V conj(I)
  }
  return { P, Q };
}

export function loadFlow(buses: Bus[], lines: Line[], o: FlowOptions): FlowResult {
  const { L } = prepare(buses, lines);
  if (!(o.base > 0)) throw new Error('Give the base power in MVA.');
  const n = buses.length, { G, B } = ybus(n, L), tol = o.tol ?? 1e-8, base = o.base;
  const maxIter = o.maxIter ?? (o.method === 'nr' ? 20 : 1000), acc = o.accel ?? 1.6;
  const Psp = buses.map((b) => (b.Pg - b.Pd) / base), Qsp = buses.map((b) => -b.Qd / base);
  const Vm = buses.map((b) => (b.type === 'PQ' ? 1 : b.V)), Va = buses.map(() => 0);
  const pv = buses.map((b) => b.type === 'PV'), pq = buses.map((b) => b.type === 'PQ'), sl = buses.map((b) => b.type === 'slack');
  const rect = () => ({ r: Vm.map((m, i) => m * Math.cos(Va[i])), im: Vm.map((m, i) => m * Math.sin(Va[i])) });
  const mismatch = () => {
    const { r, im } = rect(), s = injections(G, B, r, im);
    let m = 0;
    for (let i = 0; i < n; i++) { if (!sl[i]) m = Math.max(m, Math.abs(Psp[i] - s.P[i])); if (pq[i]) m = Math.max(m, Math.abs(Qsp[i] - s.Q[i])); }
    return { m, s };
  };
  const history: number[] = [];
  let it = 0, converged = false;
  let mm = mismatch(); history.push(mm.m);
  if (mm.m < tol) converged = true;
  if (o.method === 'nr') {
    const ang = buses.map((_, i) => i).filter((i) => !sl[i]), mag = buses.map((_, i) => i).filter((i) => pq[i]);
    while (!converged && it < maxIter) {
      it++;
      const { P, Q } = mm.s, na = ang.length, N = na + mag.length;
      const J = Array.from({ length: N }, () => new Array(N).fill(0)), f: number[] = [];
      for (const i of ang) f.push(Psp[i] - P[i]);
      for (const i of mag) f.push(Qsp[i] - Q[i]);
      // Polar Jacobian: dP/dθ, dP/d|V|, dQ/dθ, dQ/d|V|.
      const dP = (i: number, k: number, wrtV: boolean) => {
        if (i === k) return wrtV ? P[i] / Vm[i] + G[i][i] * Vm[i] : -Q[i] - B[i][i] * Vm[i] * Vm[i];
        const t = Va[i] - Va[k], c = Math.cos(t), s = Math.sin(t);
        return wrtV ? Vm[i] * (G[i][k] * c + B[i][k] * s) : Vm[i] * Vm[k] * (G[i][k] * s - B[i][k] * c);
      };
      const dQ = (i: number, k: number, wrtV: boolean) => {
        if (i === k) return wrtV ? Q[i] / Vm[i] - B[i][i] * Vm[i] : P[i] - G[i][i] * Vm[i] * Vm[i];
        const t = Va[i] - Va[k], c = Math.cos(t), s = Math.sin(t);
        return wrtV ? Vm[i] * (G[i][k] * s - B[i][k] * c) : -Vm[i] * Vm[k] * (G[i][k] * c + B[i][k] * s);
      };
      ang.forEach((i, r) => { ang.forEach((k, c) => { J[r][c] = dP(i, k, false); }); mag.forEach((k, c) => { J[r][na + c] = dP(i, k, true); }); });
      mag.forEach((i, r) => { ang.forEach((k, c) => { J[na + r][c] = dQ(i, k, false); }); mag.forEach((k, c) => { J[na + r][na + c] = dQ(i, k, true); }); });
      let dx: number[];
      try { dx = solve(J, f); } catch { break; }
      ang.forEach((i, r) => { Va[i] += dx[r]; });
      mag.forEach((i, r) => { Vm[i] += dx[na + r]; });
      mm = mismatch(); history.push(mm.m);
      if (!Number.isFinite(mm.m) || mm.m > 1e6) break;
      if (mm.m < tol) converged = true;
    }
  } else {
    // Gauss-Seidel on complex voltages, updated in place.
    const Vr = Vm.map((m, i) => m * Math.cos(Va[i])), Vi = Vm.map((m, i) => m * Math.sin(Va[i]));
    while (!converged && it < maxIter) {
      it++;
      for (let i = 0; i < n; i++) {
        if (sl[i]) continue;
        let Sr = 0, Si = 0; // sum over k != i of Y_ik V_k
        for (let k = 0; k < n; k++) if (k !== i) { Sr += G[i][k] * Vr[k] - B[i][k] * Vi[k]; Si += G[i][k] * Vi[k] + B[i][k] * Vr[k]; }
        let Qi = Qsp[i];
        if (pv[i]) { const Ir = Sr + G[i][i] * Vr[i] - B[i][i] * Vi[i], Ii = Si + G[i][i] * Vi[i] + B[i][i] * Vr[i]; Qi = Vi[i] * Ir - Vr[i] * Ii; }
        // (P - jQ) / conj(V) = (P - jQ) V / |V|²
        const m2 = Vr[i] * Vr[i] + Vi[i] * Vi[i];
        const ar = (Psp[i] * Vr[i] + Qi * Vi[i]) / m2 - Sr, ai = (Psp[i] * Vi[i] - Qi * Vr[i]) / m2 - Si;
        const d = G[i][i] * G[i][i] + B[i][i] * B[i][i];
        let nr = (ar * G[i][i] + ai * B[i][i]) / d, ni = (ai * G[i][i] - ar * B[i][i]) / d;
        if (pv[i]) { const s = buses[i].V / Math.hypot(nr, ni); nr *= s; ni *= s; }
        else { nr = Vr[i] + acc * (nr - Vr[i]); ni = Vi[i] + acc * (ni - Vi[i]); }
        Vr[i] = nr; Vi[i] = ni;
      }
      for (let i = 0; i < n; i++) { Vm[i] = Math.hypot(Vr[i], Vi[i]); Va[i] = Math.atan2(Vi[i], Vr[i]); }
      mm = mismatch(); history.push(mm.m);
      if (!Number.isFinite(mm.m) || mm.m > 1e6) break;
      if (mm.m < tol) converged = true;
    }
  }
  const { r: Vre, im: Vim } = rect(), { P, Q } = injections(G, B, Vre, Vim);
  const busRes: BusResult[] = buses.map((b, i) => ({
    id: b.id, type: b.type, V: Vm[i], deg: (Va[i] * 180) / Math.PI, P: P[i] * base, Q: Q[i] * base,
    Pg: P[i] * base + b.Pd, Qg: Q[i] * base + b.Qd, Pd: b.Pd, Qd: b.Qd,
  }));
  const lineRes: LineResult[] = L.map((l, k) => {
    const d = l.R * l.R + l.X * l.X, g = l.R / d, bs = -l.X / d, h = l.B / 2;
    const end = (a: number, z: number) => {
      const dr = Vre[a] - Vre[z], di = Vim[a] - Vim[z];
      const Ir = g * dr - bs * di - h * Vim[a], Ii = g * di + bs * dr + h * Vre[a];
      return { P: (Vre[a] * Ir + Vim[a] * Ii) * base, Q: (Vim[a] * Ir - Vre[a] * Ii) * base, I: Math.hypot(Ir, Ii) };
    };
    const a = end(l.i, l.j), z = end(l.j, l.i);
    return { from: lines[k].from, to: lines[k].to, Pij: a.P, Qij: a.Q, Pji: z.P, Qji: z.Q, Ploss: a.P + z.P, Qloss: a.Q + z.Q, I: Math.max(a.I, z.I) };
  });
  const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
  return {
    converged, iterations: it, history, buses: busRes, lines: lineRes,
    lossP: sum(lineRes.map((l) => l.Ploss)), lossQ: sum(lineRes.map((l) => l.Qloss)),
    genP: sum(busRes.map((b) => b.Pg)), genQ: sum(busRes.map((b) => b.Qg)), loadP: sum(buses.map((b) => b.Pd)), loadQ: sum(buses.map((b) => b.Qd)),
    Vre, Vim,
  };
}

const TYPES: Record<string, BusType> = { slack: 'slack', swing: 'slack', ref: 'slack', reference: 'slack', '3': 'slack', pv: 'PV', gen: 'PV', generator: 'PV', '2': 'PV', pq: 'PQ', load: 'PQ', '1': 'PQ' };

/** Bus table: bus, type, Pd (MW), Qd (Mvar), Pg (MW), V (pu). A first row of headers is skipped. */
export function parseBuses(text: string): Bus[] {
  const rows = parseTable(text).filter((r) => r.some((c) => c));
  const out: Bus[] = [];
  rows.forEach((r, k) => {
    const t = TYPES[(r[1] ?? '').toLowerCase()];
    if (!t) { if (k === 0 && Number.isNaN(num(r[2]))) return; throw new Error(`Bus row ${k + 1}: the type must be slack, PV or PQ (got "${r[1] ?? ''}").`); }
    const v = (c: string | undefined, d = 0) => (c == null || c === '' ? d : num(c));
    const b: Bus = { id: r[0], type: t, Pd: v(r[2]), Qd: v(r[3]), Pg: v(r[4]), V: v(r[5], 1) };
    if (!b.id) throw new Error(`Bus row ${k + 1} has no bus name.`);
    for (const [name, x] of [['Pd', b.Pd], ['Qd', b.Qd], ['Pg', b.Pg], ['V', b.V]] as const) if (!Number.isFinite(x)) throw new Error(`Bus ${b.id}: ${name} is not a number.`);
    out.push(b);
  });
  return out;
}
/** Line table: from, to, R, X, B (per unit on the system base). A first row of headers is skipped. */
export function parseLines(text: string): Line[] {
  const rows = parseTable(text).filter((r) => r.some((c) => c));
  const out: Line[] = [];
  rows.forEach((r, k) => {
    const R = num(r[2]), X = num(r[3]), B = r[4] == null || r[4] === '' ? 0 : num(r[4]);
    if (k === 0 && Number.isNaN(R) && Number.isNaN(X)) return;
    if (r.length < 4 || Number.isNaN(R) || Number.isNaN(X) || Number.isNaN(B)) throw new Error(`Line row ${k + 1}: give from, to, R, X and B (B may be left out).`);
    out.push({ from: r[0], to: r[1], R, X, B });
  });
  return out;
}

export const EXAMPLE_BUSES = `bus, type, Pd_MW, Qd_Mvar, Pg_MW, V_pu
1, slack, 0, 0, 0, 1.03
2, PV, 30, 12, 80, 1.01
3, PQ, 55, 18, 0, 1
4, PQ, 40, 14, 0, 1
5, PQ, 65, 22, 0, 1`;
export const EXAMPLE_LINES = `from, to, R_pu, X_pu, B_pu
1, 2, 0.015, 0.08, 0.04
1, 4, 0.03, 0.12, 0.03
2, 3, 0.025, 0.10, 0.02
2, 4, 0.04, 0.15, 0.025
3, 5, 0.02, 0.09, 0.02
4, 5, 0.035, 0.14, 0.03`;
