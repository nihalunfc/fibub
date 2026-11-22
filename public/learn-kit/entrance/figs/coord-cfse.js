// Crystal field splitting: an octahedral or tetrahedral complex splits the five d orbitals into two sets. Choose
// the d count and a weak- or strong-field ligand to see how electrons fill, the unpaired count, the spin-only moment
// and the crystal field stabilisation energy (CFSE). Tetrahedral complexes are always high spin (Δt ≈ 4/9 Δo).
import { canvas, text, row, slider, choice, readout, line } from '../../kit.js';

function fill(d, L, U, strong) {
  const lo = Array(L).fill(0), hi = Array(U).fill(0);
  const order = strong
    ? [...Array(L).keys()].map((i) => [lo, i]).concat([...Array(L).keys()].map((i) => [lo, i]), [...Array(U).keys()].map((i) => [hi, i]), [...Array(U).keys()].map((i) => [hi, i]))
    : [...Array(L).keys()].map((i) => [lo, i]).concat([...Array(U).keys()].map((i) => [hi, i]), [...Array(L).keys()].map((i) => [lo, i]), [...Array(U).keys()].map((i) => [hi, i]));
  for (let e = 0; e < d; e++) { const [arr, i] = order[e]; arr[i]++; }
  return { lo, hi };
}
export default function (host) {
  let geo = 'oct', d = 6, field = 'weak';
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Crystal field splitting diagram with d electrons filled in' });
  const ctl = row(host);
  choice(ctl, 'Shape', [['oct', 'Octahedral'], ['tet', 'Tetrahedral']], geo, (v) => { geo = v; upd(); });
  choice(ctl, 'Ligand field', [['weak', 'Weak (high spin)'], ['strong', 'Strong (low spin)']], field, (v) => { field = v; upd(); });
  slider(ctl, { label: 'd electrons', min: 1, max: 10, step: 1, value: d, fmt: (v) => 'd' + (Math.round(v) === 10 ? '¹⁰' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.round(v)]), oninput: (v) => { d = Math.round(v); upd(); } });
  const out = readout(host);
  const calc = () => {
    const oct = geo === 'oct', strong = oct && field === 'strong';
    const L = oct ? 3 : 2, U = oct ? 2 : 3;
    const { lo, hi } = fill(d, L, U, strong);
    const nlo = lo.reduce((a, b) => a + b, 0), nhi = hi.reduce((a, b) => a + b, 0);
    const cf = oct ? -0.4 * nlo + 0.6 * nhi : -0.6 * nlo + 0.4 * nhi;
    const un = [...lo, ...hi].filter((k) => k === 1).length;
    const pairs = [...lo, ...hi].filter((k) => k === 2).length, freePairs = Math.max(0, d - 5);
    return { oct, strong, lo, hi, cf, un, extra: pairs - freePairs };
  };
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const c = calc(), D = c.oct ? 'Δo' : 'Δt', mu = Math.sqrt(c.un * (c.un + 2));
    const cfs = `${(+c.cf.toFixed(1)).toString().replace('-', '−')} ${D}${c.extra > 0 ? ` + ${c.extra}P` : ''}`;
    out.innerHTML = `d${d}, ${c.oct ? 'octahedral' : 'tetrahedral'}${c.oct ? `, ${c.strong ? 'strong field (Δo > P): electrons pair in t₂g first' : 'weak field (Δo < P): electrons spread out first'}` : ' (Δt is small, so always high spin)'}. ${c.oct ? `t₂g<sup>${c.lo.reduce((a, b) => a + b, 0)}</sup> e<sub>g</sub><sup>${c.hi.reduce((a, b) => a + b, 0)}</sup>` : `e<sup>${c.lo.reduce((a, b) => a + b, 0)}</sup> t₂<sup>${c.hi.reduce((a, b) => a + b, 0)}</sup>`}. Unpaired = ${c.un}, μ = ${mu.toFixed(2)} BM. CFSE = <b>${cfs}</b>${c.extra > 0 ? ' (P = energy to pair two electrons, paid once per extra pair)' : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const c = calc(), bw = 34, bh = 26;
    const yBar = h * 0.5, yHi = h * 0.24, yLo = h * 0.72;
    const xFree = w * 0.16, xSplit = w * 0.62;
    // free ion level
    for (let i = 0; i < 5; i++) { ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(xFree - bw * 2.5 + i * bw, yBar - bh / 2, bw, bh); }
    text(ctx, 'free ion: 5 d orbitals', xFree, yBar + bh / 2 + 14, { color: col.muted, size: 11, align: 'center' });
    const drawSet = (arr, y, label, colr) => {
      const x0 = xSplit - (arr.length * bw) / 2;
      arr.forEach((k, i) => {
        const x = x0 + i * bw;
        ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - bh / 2, bw, bh);
        const ar = (ax, up) => { const t = y - bh * 0.32, b = y + bh * 0.32; ctx.strokeStyle = up ? col.s[0] : col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); if (up) { ctx.moveTo(ax, b); ctx.lineTo(ax, t); ctx.moveTo(ax - 4, t + 5); ctx.lineTo(ax, t); ctx.lineTo(ax + 4, t + 5); } else { ctx.moveTo(ax, t); ctx.lineTo(ax, b); ctx.moveTo(ax - 4, b - 5); ctx.lineTo(ax, b); ctx.lineTo(ax + 4, b - 5); } ctx.stroke(); };
        if (k >= 1) ar(x + bw * (k === 2 ? 0.33 : 0.5), true);
        if (k === 2) ar(x + bw * 0.67, false);
      });
      text(ctx, label, x0 + arr.length * bw + 8, y, { color: colr, size: 12, weight: 600 });
    };
    line(ctx, [[xFree + bw * 2.5 + 4, yBar], [xSplit - bw * 1.6, yHi]], col.line, 1, [3, 3]);
    line(ctx, [[xFree + bw * 2.5 + 4, yBar], [xSplit - bw * 1.6, yLo]], col.line, 1, [3, 3]);
    drawSet(c.hi, yHi, c.oct ? 'e_g  +0.6Δo' : 't₂  +0.4Δt', col.s[2]);
    drawSet(c.lo, yLo, c.oct ? 't₂g  −0.4Δo' : 'e  −0.6Δt', col.s[3]);
    // the gap
    const gx = xSplit - bw * 2.1;
    line(ctx, [[gx, yHi], [gx, yLo]], col.muted, 1.2);
    text(ctx, c.oct ? 'Δo' : 'Δt', gx - 6, (yHi + yLo) / 2, { color: col.ink, size: 13, weight: 700, align: 'right' });
    text(ctx, `${c.oct ? 'Octahedral' : 'Tetrahedral'} field, d${d}`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
  };
  upd();
}
