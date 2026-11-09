// Pathway models as ODEs: a small reaction language (mass action, reversible, Michaelis-Menten, Hill), an adaptive
// Dormand-Prince 5(4) integrator (the method behind scipy's RK45), and least-squares fitting of rate constants to
// measured time courses by Levenberg-Marquardt on log parameters. No DOM.

export type RateLaw = { kind: 'ma'; k: string } | { kind: 'rev'; kf: string; kr: string } | { kind: 'mm'; v: string; km: string } | { kind: 'hill'; v: string; k: string; n: string };
export type Reaction = { line: number; reactants: [string, number][]; products: [string, number][]; law: RateLaw; text: string };
export type Model = { species: string[]; params: Record<string, number>; init: Record<string, number>; reactions: Reaction[]; paramNames: string[] };

const NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

function side(s: string, line: number): [string, number][] {
  const t = s.trim();
  if (!t || t === '0' || t === '∅') return [];
  return t.split('+').map((term) => {
    const m = term.trim().match(/^(\d+(?:\.\d+)?)?\s*\*?\s*([A-Za-z_][A-Za-z0-9_]*)$/);
    if (!m) throw new Error(`Line ${line}: "${term.trim()}" is not a species name (letters, digits and _; a number in front is the stoichiometry).`);
    return [m[2], m[1] ? Number(m[1]) : 1] as [string, number];
  });
}

/** Parses the model text. Reactions: "A + B -> C : k1", "A <-> B : kf, kr", "S -> P : MM(Vmax, Km)", "-> A : k0", "A -> : kd", "X -> Y : Hill(V, K, n)". Values: "k1 = 0.5", "A = 10". */
export function parseModel(text: string): Model {
  const reactions: Reaction[] = [], values: Record<string, number> = {}, order: string[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((raw, i) => {
    const line = i + 1, s = raw.replace(/#.*$/, '').trim();
    if (!s) return;
    const arrow = s.match(/<->|<=>|->|→|⇌/);
    if (arrow) {
      const [lhs, rest] = [s.slice(0, arrow.index), s.slice(arrow.index! + arrow[0].length)];
      const ci = rest.indexOf(':');
      if (ci < 0) throw new Error(`Line ${line}: add the rate after a colon, for example "A -> B : k1".`);
      const rhs = rest.slice(0, ci), rate = rest.slice(ci + 1).trim(), rev = arrow[0] === '<->' || arrow[0] === '<=>' || arrow[0] === '⇌';
      let law: RateLaw;
      const fn = rate.match(/^(mm|michaelis|hill)\s*\(([^)]*)\)$/i);
      const args = (fn ? fn[2] : rate).split(',').map((a) => a.trim()).filter(Boolean);
      if (fn && /^(mm|michaelis)$/i.test(fn[1])) { if (args.length !== 2) throw new Error(`Line ${line}: MM needs two values, MM(Vmax, Km).`); law = { kind: 'mm', v: args[0], km: args[1] }; }
      else if (fn) { if (args.length !== 3) throw new Error(`Line ${line}: Hill needs three values, Hill(Vmax, K, n).`); law = { kind: 'hill', v: args[0], k: args[1], n: args[2] }; }
      else if (rev) { if (args.length !== 2) throw new Error(`Line ${line}: a reversible reaction needs two rate constants, "kf, kr".`); law = { kind: 'rev', kf: args[0], kr: args[1] }; }
      else { if (args.length !== 1) throw new Error(`Line ${line}: give one rate constant, or MM(Vmax, Km) or Hill(Vmax, K, n).`); law = { kind: 'ma', k: args[0] }; }
      const r: Reaction = { line, reactants: side(lhs, line), products: side(rhs, line), law, text: s };
      if ((law.kind === 'mm' || law.kind === 'hill') && !r.reactants.length) throw new Error(`Line ${line}: ${law.kind === 'mm' ? 'MM' : 'Hill'} needs a substrate on the left.`);
      if (!r.reactants.length && !r.products.length) throw new Error(`Line ${line}: the reaction has nothing on either side.`);
      for (const a of Object.values(law)) if (a !== law.kind && !NAME.test(a) && !Number.isFinite(Number(a))) throw new Error(`Line ${line}: "${a}" is not a parameter name or a number.`);
      reactions.push(r);
      return;
    }
    const m = s.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
    if (m) { const v = Number(m[2].trim().replace(',', '.')); if (!Number.isFinite(v)) throw new Error(`Line ${line}: "${m[2].trim()}" is not a number.`); values[m[1]] = v; order.push(m[1]); return; }
    throw new Error(`Line ${line}: write a reaction such as "A -> B : k1" or a value such as "k1 = 0.5".`);
  });
  if (!reactions.length) throw new Error('Add at least one reaction, for example "A -> B : k1".');
  const species: string[] = [];
  for (const r of reactions) for (const [n] of [...r.reactants, ...r.products]) if (!species.includes(n)) species.push(n);
  const paramNames: string[] = [];
  for (const r of reactions) for (const [k, a] of Object.entries(r.law)) if (k !== 'kind' && NAME.test(a) && !paramNames.includes(a)) {
    if (species.includes(a)) throw new Error(`Line ${r.line}: "${a}" is used as both a species and a parameter.`);
    paramNames.push(a);
  }
  const params: Record<string, number> = {}, init: Record<string, number> = {};
  for (const p of paramNames) { if (!(p in values)) throw new Error(`Give a value for the parameter ${p}, for example "${p} = 0.1".`); if (!(values[p] >= 0)) throw new Error(`The parameter ${p} must be 0 or more.`); params[p] = values[p]; }
  for (const s of species) { init[s] = values[s] ?? 0; if (!(init[s] >= 0)) throw new Error(`The starting amount of ${s} must be 0 or more.`); }
  for (const k of order) if (!species.includes(k) && !paramNames.includes(k)) throw new Error(`"${k}" is given a value but is not used in any reaction.`);
  return { species, params, init, reactions, paramNames };
}

const val = (a: string, p: Record<string, number>) => (a in p ? p[a] : Number(a));

/** Rate of each reaction (net, forward minus reverse for reversible ones). */
export function rates(m: Model, y: number[], p: Record<string, number>) {
  const c = (n: string) => Math.max(0, y[m.species.indexOf(n)]);
  const prod = (side: [string, number][]) => side.reduce((s, [n, st]) => s * Math.pow(c(n), st), 1);
  return m.reactions.map((r) => {
    const L = r.law;
    if (L.kind === 'ma') return val(L.k, p) * prod(r.reactants);
    if (L.kind === 'rev') return val(L.kf, p) * prod(r.reactants) - val(L.kr, p) * prod(r.products);
    const S = c(r.reactants[0][0]);
    if (L.kind === 'mm') return (val(L.v, p) * S) / (val(L.km, p) + S);
    const n = val(L.n, p), Kn = Math.pow(val(L.k, p), n), Sn = Math.pow(S, n);
    return (val(L.v, p) * Sn) / (Kn + Sn);
  });
}

/** The right-hand side dy/dt. */
export function rhs(m: Model, p: Record<string, number>) {
  const idx = new Map(m.species.map((s, i) => [s, i]));
  return (_t: number, y: number[]) => {
    const v = rates(m, y, p), d = new Array(y.length).fill(0);
    m.reactions.forEach((r, j) => { for (const [n, s] of r.reactants) d[idx.get(n)!] -= s * v[j]; for (const [n, s] of r.products) d[idx.get(n)!] += s * v[j]; });
    return d;
  };
}

/** The ODEs as text, one per species. */
export function odeText(m: Model) {
  const lawText = (r: Reaction) => {
    const L = r.law, pr = (side: [string, number][]) => side.map(([n, s]) => (s === 1 ? `[${n}]` : `[${n}]^${s}`)).join('·');
    if (L.kind === 'ma') return [L.k, pr(r.reactants)].filter(Boolean).join('·');
    if (L.kind === 'rev') return `(${[L.kf, pr(r.reactants)].filter(Boolean).join('·')} − ${[L.kr, pr(r.products)].filter(Boolean).join('·')})`;
    const S = `[${r.reactants[0][0]}]`;
    return L.kind === 'mm' ? `${L.v}·${S}/(${L.km} + ${S})` : `${L.v}·${S}^${L.n}/(${L.k}^${L.n} + ${S}^${L.n})`;
  };
  return m.species.map((s) => {
    const terms: string[] = [];
    m.reactions.forEach((r) => {
      const out = r.reactants.find(([n]) => n === s)?.[1] ?? 0, inn = r.products.find(([n]) => n === s)?.[1] ?? 0, net = inn - out;
      if (net) terms.push(`${net > 0 ? '+' : '−'} ${Math.abs(net) === 1 ? '' : `${Math.abs(net)}·`}${lawText(r)}`);
    });
    return `d[${s}]/dt = ${terms.join(' ').replace(/^\+ /, '').replace(/^− /, '−') || '0'}`;
  });
}

// Dormand–Prince 5(4) coefficients.
const C = [0, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
const A = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729], [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]];
const B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];
const B4 = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40];

/** Integrates dy/dt = f(t, y) from times[0], returning y at every time in `times` (increasing). Adaptive step with rtol/atol. */
export function dopri(f: (t: number, y: number[]) => number[], y0: number[], times: number[], rtol = 1e-8, atol = 1e-10, maxSteps = 200000) {
  const n = y0.length, out: number[][] = [y0.slice()];
  let t = times[0], y = y0.slice(), h = Math.max(1e-6, (times[times.length - 1] - t) * 1e-3), steps = 0;
  for (let i = 1; i < times.length; i++) {
    const tEnd = times[i];
    while (t < tEnd - 1e-14 * Math.max(1, Math.abs(tEnd))) {
      if (++steps > maxSteps) throw new Error('The simulation needed too many steps; the model may be very stiff or blow up. Shorten the time or check the rates.');
      const hh = Math.min(h, tEnd - t), k: number[][] = [];
      for (let s = 0; s < 7; s++) {
        const ys = y.map((v, j) => v + hh * A[s].reduce((acc, a, m) => acc + a * k[m][j], 0));
        k.push(f(t + C[s] * hh, ys));
      }
      const y5 = y.map((v, j) => v + hh * B5.reduce((acc, b, s) => acc + b * k[s][j], 0));
      const y4 = y.map((v, j) => v + hh * B4.reduce((acc, b, s) => acc + b * k[s][j], 0));
      let err = 0;
      for (let j = 0; j < n; j++) { const sc = atol + rtol * Math.max(Math.abs(y[j]), Math.abs(y5[j])); err = Math.max(err, Math.abs(y5[j] - y4[j]) / sc); }
      if (!Number.isFinite(err)) throw new Error('The simulation produced numbers too large to handle; check the rates and starting amounts.');
      if (err <= 1) { t += hh; y = y5; }
      h = hh * Math.min(5, Math.max(0.2, 0.9 * Math.pow(err || 1e-10, -0.2)));
      if (h < 1e-14) throw new Error('The step size became too small; the model may be stiff.');
    }
    out.push(y.slice());
  }
  return out;
}

export function simulate(m: Model, p: Record<string, number>, times: number[], y0 = m.species.map((s) => m.init[s])) {
  return dopri(rhs(m, p), y0, times);
}

export type Data = { t: number[]; cols: { species: string; y: number[] }[] };

/**
 * Fits the chosen parameters (positive, in log space) to measured time courses by Levenberg–Marquardt with
 * finite-difference Jacobians. Returns estimates, approximate standard errors, the sum of squares and R².
 */
export function fitModel(m: Model, data: Data, fitNames: string[], maxIter = 100) {
  const times = [...new Set([0, ...data.t])].sort((a, b) => a - b);
  const tIndex = data.t.map((t) => times.indexOf(t));
  const obs: { r: number; si: number; y: number }[] = [];
  data.cols.forEach((c) => { const si = m.species.indexOf(c.species); c.y.forEach((y, r) => { if (Number.isFinite(y)) obs.push({ r, si, y }); }); });
  const resid = (lp: number[]) => {
    const p = { ...m.params }; fitNames.forEach((n, i) => { p[n] = Math.exp(lp[i]); });
    const sim = simulate(m, p, times);
    return obs.map((o) => sim[tIndex[o.r]][o.si] - o.y);
  };
  let lp = fitNames.map((n) => Math.log(Math.max(m.params[n], 1e-12)));
  let r = resid(lp), sse = r.reduce((s, v) => s + v * v, 0), lambda = 1e-3, iter = 0, converged = false;
  const jac = (lp0: number[], r0: number[]) => fitNames.map((_, j) => { const d = 1e-6 * Math.max(1, Math.abs(lp0[j])), l2 = lp0.slice(); l2[j] += d; const r2 = resid(l2); return r2.map((v, i) => (v - r0[i]) / d); });
  for (; iter < maxIter; iter++) {
    const J = jac(lp, r), k = fitNames.length;
    const JTJ = Array.from({ length: k }, (_, a) => Array.from({ length: k }, (_, b) => J[a].reduce((s, v, i) => s + v * J[b][i], 0)));
    const g = J.map((col) => col.reduce((s, v, i) => s + v * r[i], 0));
    let improved = false;
    for (let tries = 0; tries < 20; tries++) {
      const M = JTJ.map((row, a) => row.map((v, b) => v + (a === b ? lambda * (v || 1) : 0)));
      const step = solve(M, g.map((v) => -v));
      if (!step) { lambda *= 10; continue; }
      const lp2 = lp.map((v, j) => v + step[j]);
      let r2: number[]; try { r2 = resid(lp2); } catch { lambda *= 10; continue; }
      const s2 = r2.reduce((s, v) => s + v * v, 0);
      if (Number.isFinite(s2) && s2 < sse) {
        const rel = (sse - s2) / Math.max(sse, 1e-300);
        lp = lp2; r = r2; sse = s2; lambda = Math.max(lambda / 10, 1e-12); improved = true;
        if (rel < 1e-12 || Math.max(...step.map(Math.abs)) < 1e-10) converged = true;
        break;
      }
      lambda *= 10;
    }
    if (!improved || converged) { converged = true; break; }
  }
  // Standard errors from the Jacobian with respect to the parameters themselves (not their logs).
  const J = jac(lp, r), k = fitNames.length, pv = lp.map(Math.exp), dof = Math.max(1, obs.length - k), s2 = sse / dof;
  const Jp = J.map((col, j) => col.map((v) => v / pv[j]));
  const JTJ = Array.from({ length: k }, (_, a) => Array.from({ length: k }, (_, b) => Jp[a].reduce((s, v, i) => s + v * Jp[b][i], 0)));
  const inv = invert(JTJ), se = pv.map((_, j) => (inv ? Math.sqrt(Math.max(0, inv[j][j] * s2)) : NaN));
  const ybar = obs.reduce((s, o) => s + o.y, 0) / obs.length, sst = obs.reduce((s, o) => s + (o.y - ybar) ** 2, 0);
  const params = { ...m.params }; fitNames.forEach((n, i) => { params[n] = pv[i]; });
  return { params, values: pv, se, sse, r2: 1 - sse / sst, n: obs.length, iterations: iter, converged };
}

function solve(M: number[][], b: number[]): number[] | null {
  const n = b.length, a = M.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[piv][c])) piv = r;
    if (Math.abs(a[piv][c]) < 1e-300) return null;
    [a[c], a[piv]] = [a[piv], a[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = a[r][c] / a[c][c]; for (let k = c; k <= n; k++) a[r][k] -= f * a[c][k]; }
  }
  return a.map((r, i) => r[n] / a[i][i]);
}
function invert(M: number[][]): number[][] | null {
  const n = M.length, cols: number[][] = [];
  for (let j = 0; j < n; j++) { const e = Array.from({ length: n }, (_, i) => (i === j ? 1 : 0)), x = solve(M, e); if (!x) return null; cols.push(x); }
  return Array.from({ length: n }, (_, i) => cols.map((c) => c[i]));
}
