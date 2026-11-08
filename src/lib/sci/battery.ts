// Battery cycling: coulombic efficiency, capacity retention and fade, cycles to a retention limit, and incremental
// capacity (dQ/dV) with its peaks from a voltage curve.

const fit = (x: number[], y: number[]) => {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0; x.forEach((xi, i) => { sxy += (xi - mx) * (y[i] - my); sxx += (xi - mx) ** 2; });
  const m = sxx ? sxy / sxx : 0; return { m, c: my - m * mx };
};

/** Per-cycle summary. ceMode 'dc': CE = discharge ÷ charge (cathode or full cell); 'cd': charge ÷ discharge (anode vs Li).
 *  Retention is discharge capacity (or the delivered capacity in 'cd' mode) relative to the reference cycle. */
export function cycling(cyc: number[], qch: number[], qdis: number[], ceMode: 'dc' | 'cd', ref = 1) {
  const rows = cyc.map((c, i) => ({ c, qin: ceMode === 'dc' ? qch[i] : qdis[i], qout: ceMode === 'dc' ? qdis[i] : qch[i] }));
  const ri = Math.max(0, rows.findIndex((r) => r.c >= ref)), q0 = rows[ri].qout;
  const out = rows.map((r) => ({ c: r.c, qin: r.qin, qout: r.qout, ce: r.qout / r.qin, ret: r.qout / q0 }));
  const after = out.slice(ri + 1);
  const avgCE = after.length ? after.reduce((s, r) => s + r.ce, 0) / after.length : NaN;
  const irrev = out.reduce((s, r) => s + (r.qin - r.qout), 0);
  const fr = after.length >= 2 ? fit(after.map((r) => r.c), after.map((r) => r.ret)) : null;
  return { rows: out, ref: rows[ri].c, q0, first: out[0], avgCE, irrev, fadePerCycle: fr ? -fr.m : NaN, last: out[out.length - 1] };
}

/** Cycle at which retention first falls to thr (interpolated), else extrapolated from a straight line through the last
 *  fifth of the cycles (at least 5). */
export function cyclesTo(rows: { c: number; ret: number }[], thr: number) {
  for (let i = 1; i < rows.length; i++) if (rows[i].ret <= thr) { const a = rows[i - 1], b = rows[i]; return { n: a.c + ((a.ret - thr) / (a.ret - b.ret || 1)) * (b.c - a.c), extrapolated: false }; }
  const k = Math.max(5, Math.round(rows.length / 5)), tail = rows.slice(-k);
  if (tail.length < 5) return null;
  const f = fit(tail.map((r) => r.c), tail.map((r) => r.ret));
  if (!(f.m < 0)) return null;
  return { n: (thr - f.c) / f.m, extrapolated: true };
}

/** dQ/dV on an even voltage grid: Q interpolated against V, then a local straight-line slope within ±h volts. */
export function dqdv(Q: number[], V: number[], step = 0.002, h = 0.006) {
  const p = V.map((v, i) => ({ v, q: Q[i] })).filter((x) => Number.isFinite(x.v) && Number.isFinite(x.q)).sort((a, b) => a.v - b.v);
  const v0 = p[0].v, v1 = p[p.length - 1].v, n = Math.floor((v1 - v0) / step) + 1, g: { v: number; q: number }[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) { const v = v0 + i * step; while (j + 1 < p.length - 1 && p[j + 1].v < v) j++; const a = p[j], b = p[Math.min(j + 1, p.length - 1)]; const f = b.v > a.v ? (v - a.v) / (b.v - a.v) : 0; g.push({ v, q: a.q + f * (b.q - a.q) }); }
  const k = Math.max(1, Math.round(h / step)), d = g.map((_, i) => { const lo = Math.max(0, i - k), hi = Math.min(g.length - 1, i + k); let sv = 0, sq = 0, svv = 0, svq = 0, m = 0; for (let t = lo; t <= hi; t++) { m++; sv += g[t].v; sq += g[t].q; svv += g[t].v ** 2; svq += g[t].v * g[t].q; } const den = m * svv - sv * sv; return den > 0 ? (m * svq - sv * sq) / den : 0; });
  return g.map((x, i) => ({ V: x.v, Q: x.q, d: d[i] }));
}
/** Peaks of |dQ/dV| above frac × the largest, at least minSep volts apart. */
export function peaks(curve: { V: number; d: number }[], frac = 0.1, minSep = 0.02) {
  const a = curve.map((c) => Math.abs(c.d)), mx = Math.max(...a), out: { V: number; d: number }[] = [];
  for (let i = 1; i < a.length - 1; i++) if (a[i] >= frac * mx && a[i] >= a[i - 1] && a[i] > a[i + 1]) {
    // parabolic refinement of the peak position
    const den = a[i - 1] - 2 * a[i] + a[i + 1], off = den ? (0.5 * (a[i - 1] - a[i + 1])) / den : 0, V = curve[i].V + off * (curve[i + 1].V - curve[i].V);
    if (out.length && V - out[out.length - 1].V < minSep) { if (a[i] > Math.abs(out[out.length - 1].d)) out[out.length - 1] = { V, d: curve[i].d }; } else out.push({ V, d: curve[i].d });
  }
  return out;
}

/** Simulated 200-cycle test: 200 mAh/g first charge, 88 % first-cycle efficiency, then slow fade. */
export function exampleCycles() {
  const rows: [number, number, number][] = [];
  for (let n = 1; n <= 200; n++) {
    const qd = 176 - 0.08 * (n - 1) - 1.5 * Math.sqrt(n - 1) + 0.15 * Math.sin(n * 1.7);
    const ce = n === 1 ? 0.88 : 0.9992 - 0.004 * Math.exp(-(n - 2) / 3);
    rows.push([n, +(qd / ce).toFixed(2), +qd.toFixed(2)]);
  }
  return rows;
}
/** Simulated LiMn₂O₄ charge curve (mAh/g, V) with its two plateaus near 4.00 and 4.14 V. */
export function exampleCurve() {
  const S = (x: number) => 1 / (1 + Math.exp(-x)), rows: [number, number][] = [];
  const Q = (V: number) => 55 * S((V - 4.0) / 0.012) + 55 * S((V - 4.14) / 0.012) + 8 * (V - 3.5);
  for (let V = 3.5; V <= 4.3 + 1e-9; V += 0.001) rows.push([+Q(V).toFixed(3), +V.toFixed(4)]);
  return rows;
}
