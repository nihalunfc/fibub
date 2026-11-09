// Supply and demand: equilibrium, elasticities, consumer and producer surplus, per-unit taxes and
// subsidies, price ceilings and floors. Plain maths, no DOM.
//
// A curve gives quantity as a function of price, never below zero:
//   linear:               Q = a + b·P   (demand: b < 0; supply: b > 0)
//   constant elasticity:  Q = A·P^e     (demand: e < 0; supply: e > 0), for P > 0
// Surplus areas are integrals over price (∫ Q dP), which equal the usual areas under the inverse curves.

export type Curve = { kind: 'linear'; a: number; b: number } | { kind: 'ce'; A: number; e: number };

/** Quantity at price P (zero where the formula would go negative). */
export function qAt(c: Curve, P: number): number {
  if (c.kind === 'linear') return Math.max(0, c.a + c.b * P);
  return P > 0 ? c.A * P ** c.e : c.e > 0 ? 0 : Infinity;
}

/** Price at which the curve gives quantity Q (the inverse curve). */
export function pAt(c: Curve, Q: number): number {
  if (c.kind === 'linear') return (Q - c.a) / c.b;
  return (Q / c.A) ** (1 / c.e);
}

/** Point price elasticity (dQ/dP)·(P/Q) at price P. */
export function elasticity(c: Curve, P: number): number {
  if (c.kind === 'ce') return c.e;
  const Q = c.a + c.b * P;
  return Q > 0 ? (c.b * P) / Q : NaN;
}

/** ∫ Q dP from p1 to p2 (p1 ≤ p2), with Q clipped at zero. Infinity when the area is unbounded. */
export function area(c: Curve, p1: number, p2: number): number {
  if (p2 < p1) return -area(c, p2, p1);
  if (p1 === p2) return 0;
  if (c.kind === 'linear') {
    // Where a + bP ≥ 0.
    let lo = p1, hi = p2;
    if (c.b !== 0) { const z = -c.a / c.b; if (c.b > 0) lo = Math.max(lo, z); else hi = Math.min(hi, z); }
    else if (c.a <= 0) return 0;
    if (!(hi > lo)) return 0;
    if (!Number.isFinite(hi)) return Infinity;
    const F = (P: number) => c.a * P + (c.b * P * P) / 2;
    return F(hi) - F(lo);
  }
  const lo = Math.max(p1, 0), hi = p2;
  if (!(hi > lo)) return 0;
  if (c.e === -1) return lo === 0 || !Number.isFinite(hi) ? Infinity : c.A * Math.log(hi / lo);
  const F = (P: number) => (c.A * P ** (c.e + 1)) / (c.e + 1);
  if (!Number.isFinite(hi)) return c.e < -1 ? -F(lo) : Infinity;
  if (lo === 0 && c.e < -1) return Infinity;
  return F(hi) - F(lo);
}

/** Price where demand is zero (the choke price), or Infinity. */
export function chokePrice(d: Curve): number {
  if (d.kind === 'linear') return d.b < 0 ? -d.a / d.b : Infinity;
  return Infinity;
}
/** Lowest price at which anything is supplied. */
export function minSupplyPrice(s: Curve): number {
  if (s.kind === 'linear') return s.b > 0 ? Math.max(0, -s.a / s.b) : 0;
  return 0;
}

/** Root of f on [lo, hi] by bisection (f(lo) and f(hi) must differ in sign); in log space when lo > 0. */
function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let flo = f(lo);
  const geo = lo > 0;
  for (let i = 0; i < 300; i++) {
    const mid = geo ? Math.sqrt(lo * hi) : (lo + hi) / 2;
    if (mid === lo || mid === hi) break;
    const fm = f(mid);
    if (fm === 0) return mid;
    if ((fm > 0) === (flo > 0)) { lo = mid; flo = fm; } else hi = mid;
  }
  return geo ? Math.sqrt(lo * hi) : (lo + hi) / 2;
}

/**
 * Buyer price Pb where demand at Pb equals supply at Pb − t (t > 0 a per-unit tax, t < 0 a subsidy,
 * t = 0 the free-market equilibrium). Null if the curves do not cross at a positive quantity.
 */
export function solve(d: Curve, s: Curve, t = 0): { Pb: number; Ps: number; Q: number } | null {
  const ex = (Pb: number) => qAt(d, Pb) - qAt(s, Pb - t);
  // Search from the lowest price that makes sense up to where demand stops or supply overwhelms it.
  let lo = Math.max(t > 0 ? t : 0, 0) + 1e-12, hi = Math.max(1, lo * 2);
  if (d.kind === 'linear' && s.kind === 'linear') {
    // Closed form on the part where both are positive: a_d + b_d·P = a_s + b_s·(P − t).
    const P = (d.a - s.a + s.b * t) / (s.b - d.b), Q = d.a + d.b * P;
    if (s.b - d.b > 0 && Q > 0 && P - t >= 0 && s.a + s.b * (P - t) > 0) return { Pb: P, Ps: P - t, Q };
    return null;
  }
  if (!(ex(lo) > 0)) return null;
  for (let i = 0; i < 400 && ex(hi) > 0; i++) hi *= 2;
  if (ex(hi) > 0) return null;
  const Pb = bisect(ex, lo, hi), Q = qAt(d, Pb);
  if (!(Q > 0) || !Number.isFinite(Q)) return null;
  return { Pb, Ps: Pb - t, Q };
}

export type Policy = { kind: 'none' } | { kind: 'tax' | 'subsidy'; amount: number } | { kind: 'ceiling' | 'floor'; price: number };

export type Market = {
  P: number; Q: number;
  /** Point elasticities at equilibrium. */
  ed: number; es: number;
  /** Consumer and producer surplus (Infinity when unbounded, as for demand with elasticity between −1 and 0). */
  cs: number; ps: number;
};

export type PolicyResult = {
  binding: boolean;
  /** Price buyers pay, price sellers receive, quantity traded. */
  Pb: number; Ps: number; Q: number;
  /** Change in consumer and producer surplus, government budget (+ revenue, − cost), deadweight loss. */
  dCS: number; dPS: number; gov: number; dwl: number;
  /** Shortage (ceiling) or unsold surplus (floor), in quantity. */
  gap: number;
  /** Share of a tax or subsidy that falls on (or goes to) buyers, 0..1. */
  buyerShare: number;
};

export function market(d: Curve, s: Curve): Market | null {
  const e = solve(d, s, 0);
  if (!e) return null;
  const { Pb: P, Q } = e;
  return { P, Q, ed: elasticity(d, P), es: elasticity(s, P), cs: area(d, P, chokePrice(d)), ps: area(s, minSupplyPrice(s), P) };
}

/**
 * Effect of a policy against the free market. Price ceilings assume the goods go to the buyers who value
 * them most (efficient rationing); price floors assume only the lowest-cost sellers sell and nobody buys
 * the unsold surplus.
 */
export function policy(d: Curve, s: Curve, pol: Policy): PolicyResult | null {
  const m = solve(d, s, 0);
  if (!m) return null;
  const P0 = m.Pb, Q0 = m.Q;
  const none: PolicyResult = { binding: false, Pb: P0, Ps: P0, Q: Q0, dCS: 0, dPS: 0, gov: 0, dwl: 0, gap: 0, buyerShare: NaN };
  if (pol.kind === 'none') return none;
  if (pol.kind === 'tax' || pol.kind === 'subsidy') {
    const t = pol.kind === 'tax' ? pol.amount : -pol.amount;
    if (t === 0) return none;
    const r = solve(d, s, t);
    if (!r) return null;
    const dCS = -area(d, P0, r.Pb), dPS = -area(s, r.Ps, P0), gov = t * r.Q;
    return { binding: true, Pb: r.Pb, Ps: r.Ps, Q: r.Q, dCS, dPS, gov, dwl: -(dCS + dPS + gov), gap: 0, buyerShare: (r.Pb - P0) / t };
  }
  const Pc = pol.price;
  if (pol.kind === 'ceiling') {
    if (Pc >= P0) return none;
    const Qt = qAt(s, Pc), Qd = qAt(d, Pc), Pd = Qt > 0 ? pAt(d, Qt) : chokePrice(d);
    // Buyers who get the good value it at Pd or more; they pay Pc.
    const dCS = -area(d, P0, Pd) + (Pd - Pc) * Qt, dPS = -area(s, Pc, P0);
    return { binding: true, Pb: Pc, Ps: Pc, Q: Qt, dCS, dPS, gov: 0, dwl: -(dCS + dPS), gap: Qd - Qt, buyerShare: NaN };
  }
  if (Pc <= P0) return none;
  const Qt = qAt(d, Pc), Qs = qAt(s, Pc), Psup = Qt > 0 ? pAt(s, Qt) : minSupplyPrice(s);
  const dCS = -area(d, P0, Pc), dPS = (Pc - Psup) * Qt - area(s, Psup, P0);
  return { binding: true, Pb: Pc, Ps: Pc, Q: Qt, dCS, dPS, gov: 0, dwl: -(dCS + dPS), gap: Qs - Qt, buyerShare: NaN };
}

/** Arc (midpoint) elasticity between (P1, Q1) and (P2, Q2), and the plain percentage-change version from point 1. */
export function arcElasticity(P1: number, Q1: number, P2: number, Q2: number): { arc: number; simple: number; pctQ: number; pctP: number } {
  const pctQ = (Q2 - Q1) / ((Q1 + Q2) / 2), pctP = (P2 - P1) / ((P1 + P2) / 2);
  return { arc: pctQ / pctP, simple: ((Q2 - Q1) / Q1) / ((P2 - P1) / P1), pctQ, pctP };
}

/** Reading of an elasticity's size. */
export function elasticityWord(e: number): string {
  const a = Math.abs(e);
  if (!Number.isFinite(a)) return '';
  if (a < 1e-9) return 'perfectly inelastic';
  if (Math.abs(a - 1) < 1e-9) return 'unit elastic';
  return a < 1 ? 'inelastic' : 'elastic';
}
