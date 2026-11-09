// Queueing formulas for the queueing calculator: M/M/1, M/M/c (Erlang C), M/M/c/K, M/M/∞, Erlang B (M/M/c/c) and
// M/G/1 (Pollaczek-Khinchine), staffing for a target wait, and a small seeded discrete-event simulation to compare
// with. Rates are per time unit; all times come out in the same unit. Plain TypeScript, no DOM.

export type Kind = 'mm1' | 'mmc' | 'mmck' | 'mminf' | 'erlangb' | 'mg1';
export interface Input { kind: Kind; lambda: number; mu: number; c?: number; K?: number; sd?: number }
export interface Result {
  rho: number; a: number; stable: boolean;
  L: number; Lq: number; W: number; Wq: number;
  /** Probability an arriving customer (one who gets in) has to wait. */
  pWait: number;
  /** Probability an arriving customer is turned away (finite capacity). */
  pBlock: number;
  lambdaEff: number;
  /** Probability of n in the system, n = 0, 1, ... (where known exactly). */
  pn: number[] | null;
  /** P(wait in queue > t), where a closed form exists. */
  waitTail: ((t: number) => number) | null;
  servers: number;
}

/** Erlang B blocking probability for offered load a (erlangs) on c servers, by the stable recursion. */
export function erlangB(c: number, a: number): number {
  let b = 1;
  for (let k = 1; k <= c; k++) b = (a * b) / (k + a * b);
  return b;
}
/** Erlang C: probability of waiting in M/M/c, offered load a = λ/μ < c. */
export function erlangC(c: number, a: number): number {
  if (a >= c) return 1;
  const b = erlangB(c, a);
  return (c * b) / (c - a * (1 - b));
}

/** Poisson probabilities 0..n for mean a, computed in logs to avoid overflow. */
function poisson(a: number, n: number): number[] {
  const out: number[] = []; let lp = -a;
  for (let k = 0; k <= n; k++) { if (k > 0) lp += Math.log(a) - Math.log(k); out.push(Math.exp(lp)); }
  return out;
}

export function solveQueue(q: Input): Result {
  const { kind, lambda: l, mu } = q;
  if (!(l > 0) || !(mu > 0)) throw new Error('The arrival rate and the service rate must be above zero.');
  const a = l / mu;
  const NA: Result = { rho: NaN, a, stable: false, L: NaN, Lq: NaN, W: NaN, Wq: NaN, pWait: NaN, pBlock: 0, lambdaEff: l, pn: null, waitTail: null, servers: 1 };
  if (kind === 'mm1' || kind === 'mmc') {
    const c = kind === 'mm1' ? 1 : q.c!;
    if (!(Number.isInteger(c) && c >= 1)) throw new Error('The number of servers must be a whole number, 1 or more.');
    const rho = a / c;
    if (rho >= 1) return { ...NA, rho, servers: c };
    const C = erlangC(c, a);
    const Lq = (C * rho) / (1 - rho), Wq = Lq / l, W = Wq + 1 / mu, L = l * W;
    // p0 from the Erlang C relation: P(n >= c) = C, P(n) = p0 a^n/n! (n < c), p_c ρ^(n-c) (n >= c).
    const nmax = Math.max(c + 10, Math.ceil(c + Math.log(1e-6) / Math.log(rho)));
    const pn: number[] = [];
    const head = poisson(a, c); // e^-a a^n/n!, scaled below
    const sHead = head.slice(0, c).reduce((s, v) => s + v, 0), tailC = head[c] / (1 - rho);
    const p0scale = 1 / (sHead + tailC);
    for (let n = 0; n <= Math.min(nmax, 2000); n++) pn.push(n < c ? head[n] * p0scale : head[c] * p0scale * rho ** (n - c));
    return { rho, a, stable: true, L, Lq, W, Wq, pWait: C, pBlock: 0, lambdaEff: l, pn, waitTail: (t) => C * Math.exp(-(c * mu - l) * t), servers: c };
  }
  if (kind === 'mmck' || kind === 'erlangb') {
    const c = q.c!, K = kind === 'erlangb' ? c : q.K!;
    if (!(Number.isInteger(c) && c >= 1)) throw new Error('The number of servers must be a whole number, 1 or more.');
    if (!(Number.isInteger(K) && K >= c)) throw new Error('The system capacity K must be a whole number, at least the number of servers.');
    if (K > 100000) throw new Error('The capacity K is too large; use M/M/c for an unlimited queue.');
    // Unnormalised log weights: n <= c: n ln a - ln n!; n > c: c ln a - ln c! + (n - c) ln(a/c).
    const lw: number[] = []; let lf = 0;
    for (let n = 0; n <= K; n++) {
      if (n > 0 && n <= c) lf += Math.log(n);
      lw.push(n <= c ? n * Math.log(a) - lf : lw[c] + (n - c) * Math.log(a / c));
    }
    const mx = Math.max(...lw), w = lw.map((v) => Math.exp(v - mx)), s = w.reduce((x, y) => x + y, 0), pn = w.map((v) => v / s);
    const pK = pn[K], le = l * (1 - pK);
    let L = 0, Lq = 0, busy = 0;
    pn.forEach((p, n) => { L += n * p; Lq += Math.max(0, n - c) * p; busy += Math.min(n, c) * p; });
    const W = L / le, Wq = Lq / le;
    let pw = 0; for (let n = c; n < K; n++) pw += pn[n];
    return { rho: busy / c, a, stable: true, L, Lq, W, Wq, pWait: pK < 1 ? pw / (1 - pK) : 0, pBlock: pK, lambdaEff: le, pn, waitTail: null, servers: c };
  }
  if (kind === 'mminf') {
    const nmax = Math.ceil(a + 10 * Math.sqrt(a) + 10);
    return { rho: 0, a, stable: true, L: a, Lq: 0, W: 1 / mu, Wq: 0, pWait: 0, pBlock: 0, lambdaEff: l, pn: poisson(a, Math.min(nmax, 5000)), waitTail: () => 0, servers: Infinity };
  }
  // M/G/1, Pollaczek-Khinchine: Lq = λ² E[S²] / (2(1 - ρ)), E[S²] = σ² + 1/μ².
  const sd = q.sd ?? 0;
  if (!(sd >= 0)) throw new Error('The standard deviation of the service time must be 0 or more.');
  const rho = a;
  if (rho >= 1) return { ...NA, rho };
  const ES2 = sd * sd + 1 / (mu * mu);
  const Lq = (l * l * ES2) / (2 * (1 - rho)), Wq = Lq / l, W = Wq + 1 / mu, L = l * W;
  return { rho, a, stable: true, L, Lq, W, Wq, pWait: rho, pBlock: 0, lambdaEff: l, pn: null, waitTail: null, servers: 1 };
}

export interface StaffRow { c: number; rho: number; pWait: number; Wq: number; service: number }
/** M/M/c staffing: for c from the least stable number up, the wait figures; `best` is the smallest c meeting the target. */
export function staffing(lambda: number, mu: number, target: { kind: 'sl'; t: number; pct: number } | { kind: 'asa'; t: number }, extra = 4): { rows: StaffRow[]; best: number } {
  const a = lambda / mu, c0 = Math.floor(a) + 1;
  const rows: StaffRow[] = []; let best = -1;
  for (let c = c0; c < c0 + 10000; c++) {
    const C = erlangC(c, a), Wq = C / (c * mu - lambda), service = 1 - C * Math.exp(-(c * mu - lambda) * target.t);
    rows.push({ c, rho: a / c, pWait: C, Wq, service });
    const ok = target.kind === 'sl' ? service >= target.pct - 1e-12 : Wq <= target.t + 1e-12;
    if (ok && best < 0) best = c;
    if (best > 0 && c >= best + extra) break;
  }
  return { rows: rows.filter((r) => r.c >= Math.max(c0, best - 3)), best };
}

/** Smallest number of servers with Erlang B blocking at or below the target. */
export function erlangBServers(a: number, target: number): number {
  let b = 1;
  for (let c = 1; c < 1e6; c++) { b = (a * b) / (c + a * b); if (b <= target) return c; }
  return NaN;
}

// ---------- simulation ----------
/** Small fast seeded random number generator (mulberry32). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function normal(r: () => number) { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
/** Gamma(shape k, scale 1) by Marsaglia and Tsang. */
function gamma(k: number, r: () => number): number {
  if (k < 1) return gamma(k + 1, r) * r() ** (1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do { x = normal(r); v = 1 + c * x; } while (v <= 0);
    v = v * v * v; const u = r();
    if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}
class Heap { a: number[] = []; get size() { return this.a.length; } peek() { return this.a[0]; }
  push(v: number) { const a = this.a; a.push(v); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p] <= a[i]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop()!; if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l] < a[m]) m = l; if (r < a.length && a[r] < a[m]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; } }

export interface SimResult { customers: number; L: number; Lq: number; W: number; Wq: number; pWait: number; pBlock: number; rho: number; pn: number[]; WqCI: number; WCI: number; trace: { t: number; n: number }[] }
/** Simulate a first-come-first-served queue with Poisson arrivals. Service: exponential, or gamma with the given SD (M/G/1). */
export function simulate(q: Input, customers = 20000, seed = 1): SimResult {
  const r = rng(seed), l = q.lambda, mean = 1 / q.mu;
  const c = q.kind === 'mm1' || q.kind === 'mg1' ? 1 : q.kind === 'mminf' ? Infinity : q.c!;
  const K = q.kind === 'mmck' ? q.K! : q.kind === 'erlangb' ? c : Infinity;
  const sd = q.kind === 'mg1' ? q.sd ?? 0 : mean;
  const k = sd > 0 ? (mean / sd) ** 2 : Infinity;
  const service = () => (k === Infinity ? mean : k === 1 ? -Math.log(1 - r()) * mean : gamma(k, r) * (mean / k));
  const free = new Heap(), deps = new Heap();
  if (Number.isFinite(c)) for (let i = 0; i < c; i++) free.push(0);
  const warm = Math.floor(customers / 10), total = customers + warm;
  let t = 0, n = 0, last = 0, tStart = 0;
  const occ: number[] = [];
  const waits: number[] = [], soj: number[] = [];
  let waited = 0, blocked = 0, arrivals = 0, busyArea = 0;
  const trace: { t: number; n: number }[] = [];
  const advance = (to: number, rec: boolean) => {
    if (rec) { const d = to - last; occ[n] = (occ[n] ?? 0) + d; busyArea += Math.min(n, c) * d; }
    last = to;
  };
  for (let i = 0; i < total; i++) {
    t += -Math.log(1 - r()) / l;
    const rec = i > warm;
    while (deps.size && deps.peek() <= t) { const d = deps.pop(); advance(d, rec); n--; if (trace.length < 400 && rec) trace.push({ t: d - tStart, n }); }
    advance(t, rec);
    if (i === warm) tStart = t;
    if (i >= warm) arrivals++;
    if (n >= K) { if (i >= warm) blocked++; continue; }
    const s = service();
    let start = t;
    if (Number.isFinite(c)) { const f = free.pop(); start = Math.max(t, f); free.push(start + s); }
    deps.push(start + s); n++;
    if (trace.length < 400 && i >= warm) trace.push({ t: t - tStart, n });
    if (i >= warm) { waits.push(start - t); soj.push(start - t + s); if (start - t > 1e-12) waited++; }
  }
  const T = last - tStart;
  const pn = Array.from({ length: occ.length }, (_, j) => (occ[j] ?? 0) / T);
  let L = 0, Lq = 0; pn.forEach((p, j) => { L += j * p; Lq += Math.max(0, j - c) * p; });
  const mean_ = (x: number[]) => x.reduce((s, v) => s + v, 0) / x.length;
  // 95 % confidence half-width by 20 batch means.
  const ci = (x: number[]) => { const B = 20, m = Math.floor(x.length / B); if (m < 2) return NaN; const bm = Array.from({ length: B }, (_, b) => mean_(x.slice(b * m, (b + 1) * m))); const mu = mean_(bm), v = bm.reduce((s, y) => s + (y - mu) ** 2, 0) / (B - 1); return 2.093 * Math.sqrt(v / B); };
  return { customers: waits.length, L, Lq, W: mean_(soj), Wq: mean_(waits), pWait: waited / waits.length, pBlock: blocked / arrivals, rho: Number.isFinite(c) ? busyArea / (c * T) : 0, pn, WqCI: ci(waits), WCI: ci(soj), trace };
}
