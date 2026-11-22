// 6.6 Q-value calculator. Pick a reaction: the bars show the total atomic mass before and after (zoomed in on the
// tiny difference), the readout gives Q = (mass before - mass after) × 931.5 MeV/u, says whether it is exothermic or
// endothermic, gives the threshold for endothermic ones, and splits the energy between two products when the
// reactants start (almost) at rest.
import { canvas, row, choice, readout, fmt, title, text } from '../../kit.js';

const U = 931.494;
const M = { n: 1.008665, p: 1.007825, d: 2.014102, t: 3.016049, He3: 3.016029, a: 4.002603, Li6: 6.015123, Li7: 7.016003,
  Be7: 7.016929, Be9: 9.012183, B10: 10.012937, C12: 12, N14: 14.003074, O17: 16.999132 };
const NAME = { n: 'n', p: '¹H', d: '²H', t: '³H', He3: '³He', a: '⁴He', Li6: '⁶Li', Li7: '⁷Li', Be7: '⁷Be', Be9: '⁹Be', B10: '¹⁰B', C12: '¹²C', N14: '¹⁴N', O17: '¹⁷O' };
const RX = {
  dt: { label: 'D–T fusion', a: ['d', 't'], b: ['a', 'n'] },
  dd: { label: 'D–D → ³He + n', a: ['d', 'd'], b: ['He3', 'n'] },
  li7p: { label: '⁷Li(p,α)α', a: ['p', 'Li7'], b: ['a', 'a'] },
  li6n: { label: '⁶Li(n,α)t', a: ['Li6', 'n'], b: ['t', 'a'] },
  b10n: { label: '¹⁰B(n,α)⁷Li', a: ['B10', 'n'], b: ['Li7', 'a'] },
  be9a: { label: '⁹Be(α,n)¹²C', a: ['Be9', 'a'], b: ['C12', 'n'] },
  n14a: { label: '¹⁴N(α,p)¹⁷O', a: ['a', 'N14'], b: ['O17', 'p'] },
  li7pn: { label: '⁷Li(p,n)⁷Be', a: ['p', 'Li7'], b: ['Be7', 'n'] },
};
const sum = (l) => l.reduce((s, k) => s + M[k], 0);

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 320, min: 230, label: 'Bar chart of total mass before and after a nuclear reaction, zoomed to show the mass difference that becomes the Q-value' });
  let key = 'dt';
  const ctl = row(host);
  choice(ctl, 'Reaction', Object.entries(RX).map(([k2, r]) => [k2, r.label]), key, (v) => { key = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const r = RX[key], mi = sum(r.a), mf = sum(r.b), Q = (mi - mf) * U;
    const eq = `${r.a.map((x) => NAME[x]).join(' + ')} → ${r.b.map((x) => NAME[x]).join(' + ')}`;
    let s = `${eq}: mass before <b>${mi.toFixed(6)} u</b>, after <b>${mf.toFixed(6)} u</b>, so <b>Q = ${Q >= 0 ? '+' : ''}${fmt(Q, 4)} MeV</b>. `;
    if (Q > 0) {
      const [b1, b2] = r.b, K1 = Q * M[b2] / (M[b1] + M[b2]);
      s += `Exothermic. Starting from rest, momentum is shared equally, so the lighter product takes the bigger share: ${NAME[b1]} gets <b>${fmt(K1, 3)} MeV</b>, ${NAME[b2]} gets <b>${fmt(Q - K1, 3)} MeV</b>.`;
    } else {
      const [pa, tx] = r.a, Kth = -Q * (1 + M[pa] / M[tx]);
      s += `Endothermic: the ${NAME[pa]} must bring at least <b>${fmt(Kth, 4)} MeV</b> (threshold = |Q|(1 + m<sub>a</sub>/m<sub>X</sub>), target ${NAME[tx]} at rest), more than |Q| because the centre of mass keeps moving.`;
    }
    out.innerHTML = s;
  };
  cv.draw = (ctx, w, h, col) => {
    const r = RX[key], mi = sum(r.a), mf = sum(r.b), Q = (mi - mf) * U;
    title(ctx, 'Total rest mass before and after (zoomed)', col);
    const lo = Math.min(mi, mf) - Math.abs(mi - mf) * 1.5, hi = Math.max(mi, mf) + Math.abs(mi - mf) * 0.4;
    const L = 30, R = w - 30, T = 52, B = h - 40, bw = Math.min(140, (R - L) / 4);
    const Y = (m) => B - ((m - lo) / (hi - lo)) * (B - T);
    const bars = [[mi, 'before', col.s[0], L + (R - L) * 0.3], [mf, 'after', col.s[2], L + (R - L) * 0.7]];
    for (const [m, lab, c, x] of bars) {
      ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x - bw / 2, Y(m), bw, B - Y(m)); ctx.globalAlpha = 1;
      text(ctx, `${m.toFixed(6)} u`, x, Y(m) - 10, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      text(ctx, lab, x, B + 14, { color: col.ink, size: 12, align: 'center' });
    }
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, B + 0.5); ctx.lineTo(R, B + 0.5); ctx.stroke();
    text(ctx, `axis starts at ${lo.toFixed(4)} u (zoomed)`, L, h - 8, { color: col.muted, size: 10.5 });
    const xm = (bars[0][3] + bars[1][3]) / 2;
    ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[4];
    ctx.beginPath(); ctx.moveTo(bars[0][3] + bw / 2, Y(mi)); ctx.lineTo(bars[1][3] + bw / 2 + 6, Y(mi)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `Δm = ${(mi - mf).toFixed(6)} u → Q = ${fmt(Q, 4)} MeV`, xm, T - 12, { color: Q >= 0 ? col.s[4] : col.bad || col.s[5], size: 12.5, weight: 700, align: 'center', halo: col.panel });
  };
  cv.redraw(); show();
}
