// Multipole expansion at work. A few point charges sit on the z axis. At distance r from their centre the exact potential
// (thick line) is compared, around the circle, with the sum of the first few multipole terms V = Σ qᵢaᵢˡ Pₗ(cosθ)/r^{l+1}. Slide the
// highest l kept: monopole alone is a flat circle, adding the dipole tilts it (cosθ), the quadrupole adds ½(3cos²θ−1), and so on.
// Move closer (smaller r/a) and more terms are needed; far away one or two are enough.
import { canvas, axes, line, text, row, slider, choice, readout } from '../kit.js';

const CFG = { dip: ['Dipole  +q, −q', [[1, 1], [-1, -1]]], quad: ['Linear quadrupole  +, −2, +', [[1, 1], [0, -2], [-1, 1]]], off: ['Offset pair  +2q, −q', [[0.6, 2], [-0.8, -1]]], tri: ['Three charges  +3, −1, −1', [[0, 3], [1, -1], [-1.2, -1]]] };
const P = (l, x) => { if (l === 0) return 1; let a = 1, b = x; for (let n = 1; n < l; n++) { const c = ((2 * n + 1) * x * b - n * a) / (n + 1); a = b; b = c; } return b; };
export default function (host) {
  let key = 'quad', rr = 3, lmax = 2;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 330, label: 'Exact potential and truncated multipole series around a circle' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Charges', Object.entries(CFG).map(([k, v]) => [k, v[0].split('  ')[0]]), key, (v) => { key = v; upd(); });
  slider(c2, { label: 'Distance r / a', min: 1.3, max: 8, value: rr, step: 0.1, fmt: (x) => x.toFixed(1), oninput: (x) => { rr = x; upd(); } });
  slider(c2, { label: 'Keep terms up to l', min: 0, max: 5, value: lmax, step: 1, fmt: (x) => x, oninput: (x) => { lmax = x; upd(); } });
  const out = readout(host);
  const exact = (th) => CFG[key][1].reduce((s, [z, q]) => s + q / Math.sqrt(rr * rr + z * z - 2 * rr * z * Math.cos(th)), 0);
  const series = (th, L) => { let s = 0; for (let l = 0; l <= L; l++) s += CFG[key][1].reduce((a, [z, q]) => a + q * Math.pow(Math.abs(z), l) * Math.pow(Math.sign(z) || 1, l) * P(l, Math.cos(th)), 0) / Math.pow(rr, l + 1); return s; };
  const moment = (l) => CFG[key][1].reduce((a, [z, q]) => a + q * Math.pow(z, l), 0);
  function upd() { let m = 0, mx = 0; for (let k = 0; k <= 180; k++) { const th = k / 180 * Math.PI, d = Math.abs(exact(th) - series(th, lmax)), e = Math.abs(exact(th)); m = Math.max(m, d); mx = Math.max(mx, e); }
    out.innerHTML = `Moments q<sub>i</sub>a<sub>i</sub><sup>l</sup> summed: ${[0, 1, 2, 3].map((l) => `l=${l}: ${moment(l).toFixed(1)}`).join(', ')} (in units of q, a). Keeping terms up to l = ${lmax}, the worst error around the circle is <b>${mx ? (m / mx * 100).toFixed(1) : 0}%</b> of the peak potential. The first non-zero moment sets the leading fall-off 1/r<sup>l+1</sup> at large r: a dipole 1/r², quadrupole 1/r³.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    // charges
    const y0 = 30, sc = 16; line(ctx, [[w / 2, y0 - 16], [w / 2, y0 + 16]], col.line, 1); CFG[key][1].forEach(([z, q]) => { const x = w / 2 + z * sc * 3; ctx.beginPath(); ctx.arc(x, y0, 4 + Math.abs(q) * 2, 0, 7); ctx.fillStyle = q > 0 ? col.s[5] : col.s[0]; ctx.fill(); }); text(ctx, 'charges on the z axis (a = 1)', 10, 16, { color: col.ink, size: 11, weight: 700 });
    const ev = Array.from({ length: 181 }, (_, k) => exact(k / 180 * Math.PI)), ymax = Math.max(...ev), ymin = Math.min(...ev), pad = (ymax - ymin) * 0.25 + 1e-3;
    const G = axes(ctx, w, h, col, { x: [0, 180], y: [ymin - pad, ymax + pad], xlabel: 'angle θ from the z axis (degrees)', ylabel: 'potential V', l: 44, t: 56, b: 40, xt: [0, 45, 90, 135, 180], yt: [], fy: () => '' });
    if (ymin < 0 && ymax > 0) line(ctx, [[G.L, G.Y(0)], [G.R, G.Y(0)]], col.muted, 1);
    const cs = [col.s[1], col.s[2], col.s[3], col.s[4], col.s[6], col.s[7]];
    for (let L = 0; L < lmax; L++) line(ctx, Array.from({ length: 181 }, (_, k) => [G.X(k), G.Y(Math.max(ymin - pad * 3, Math.min(ymax + pad * 3, series(k / 180 * Math.PI, L))))]), cs[L], 1.2, [3, 3]);
    G.clip && (ctx.save(), G.clip()); line(ctx, Array.from({ length: 181 }, (_, k) => [G.X(k), G.Y(series(k / 180 * Math.PI, lmax))]), col.s[5], 2.6); ctx.restore();
    line(ctx, Array.from({ length: 181 }, (_, k) => [G.X(k), G.Y(exact(k / 180 * Math.PI))]), col.ink, 4, undefined);
    ctx.globalAlpha = 0.9; line(ctx, Array.from({ length: 181 }, (_, k) => [G.X(k), G.Y(series(k / 180 * Math.PI, lmax))]), col.s[5], 2); ctx.globalAlpha = 1;
    text(ctx, 'exact (black)', G.R - 4, G.T + 10, { color: col.ink, size: 10.5, weight: 700, align: 'right' }); text(ctx, `series, l ≤ ${lmax} (orange)`, G.R - 4, G.T + 26, { color: col.s[5], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'dashed: fewer terms', G.R - 4, G.T + 42, { color: col.muted, size: 10.5, align: 'right' });
  };
  upd();
}
