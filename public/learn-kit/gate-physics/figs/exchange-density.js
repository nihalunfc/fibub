// 4.11 Identical particles. The joint density P(x1, x2) of two particles in an infinite well (0, a), one in
// level n1 and one in n2, as a heat map: distinguishable (product), bosons (symmetric) and spinless fermions
// (antisymmetric). Fermions leave the diagonal x1 = x2 empty; bosons crowd onto it. The readout gives
// <(x1 − x2)²> and the probability that both are in the left half.
import { canvas, line, text, row, choice, readout, fmt } from '../../kit.js';

const psi = (n, x) => Math.SQRT2 * Math.sin(n * Math.PI * x);
const G = 90;

function stats(n1, n2, s) {
  // s = 0 distinguishable, +1 symmetric, -1 antisymmetric; returns [<(x1-x2)²>, P(both in left half)]
  const M = 240; let N = 0, d2 = 0, LL = 0;
  for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) {
    const x = (i + 0.5) / M, y = (j + 0.5) / M;
    const a = psi(n1, x) * psi(n2, y), b = psi(n2, x) * psi(n1, y);
    const p = s === 0 ? a * a : (a + s * b) ** 2 / 2;
    N += p; d2 += p * (x - y) ** 2; if (x < 0.5 && y < 0.5) LL += p;
  }
  return [d2 / N, LL / N];
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 300, label: 'Joint probability density of two particles in a box for distinguishable particles, bosons and fermions' });
  let n1 = 1, n2 = 2, s = -1;
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Particles', [[0, 'distinguishable'], [1, 'bosons'], [-1, 'fermions']], s, (v) => { s = v; show(); });
  choice(ctl, 'Levels', [['1,2', '1 and 2'], ['1,3', '1 and 3'], ['2,3', '2 and 3'], ['1,1', 'both 1']], `${n1},${n2}`, (v) => { [n1, n2] = v.split(',').map(Number); show(); });
  const show = () => {
    if (n1 === n2 && s === -1) { out.innerHTML = 'Two identical fermions cannot share one state: the antisymmetric combination is zero everywhere (the Pauli principle).'; cv.redraw(); return; }
    const [d2, ll] = stats(n1, n2, s);
    out.innerHTML = `⟨(x₁ − x₂)²⟩ = <b>${fmt(d2, 3)} a²</b>; probability both in the left half = <b>${fmt(ll, 3)}</b> (distinguishable: ${fmt(stats(n1, n2, 0)[1], 3)}).`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const size = Math.min(w - 70, h - 60), L = (w - size) / 2 + 10, T = 16, cell = size / G;
    if (n1 === n2 && s === -1) { text(ctx, 'ψ = 0: not allowed', w / 2, h / 2, { color: col.bad || col.ink, size: 14, weight: 700, align: 'center' }); return; }
    const vals = []; let mx = 0;
    for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
      const x = (i + 0.5) / G, y = (j + 0.5) / G, a = psi(n1, x) * psi(n2, y), b = psi(n2, x) * psi(n1, y);
      const p = s === 0 ? a * a : (a + s * b) ** 2 / 2; vals.push(p); mx = Math.max(mx, p);
    }
    ctx.fillStyle = col.s[0];
    for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
      ctx.globalAlpha = Math.pow(vals[i * G + j] / mx, 0.8);
      ctx.fillRect(L + i * cell, T + (G - 1 - j) * cell, cell + 0.6, cell + 0.6);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.strokeRect(L, T, size, size);
    line(ctx, [[L, T + size], [L + size, T]], col.ink, 1, [4, 4]);
    line(ctx, [[L + size / 2, T], [L + size / 2, T + size]], col.line, 1, [2, 3]);
    line(ctx, [[L, T + size / 2], [L + size, T + size / 2]], col.line, 1, [2, 3]);
    text(ctx, 'x₁ / a →', L + size / 2, T + size + 16, { color: col.muted, size: 12, align: 'center' });
    text(ctx, '0', L, T + size + 12, { color: col.muted, size: 11, align: 'center' });
    text(ctx, '1', L + size, T + size + 12, { color: col.muted, size: 11, align: 'center' });
    ctx.save(); ctx.translate(L - 18, T + size / 2); ctx.rotate(-Math.PI / 2);
    ctx.font = '12px system-ui'; ctx.fillStyle = col.muted; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('x₂ / a →', 0, 0); ctx.restore();
    text(ctx, 'x₁ = x₂', L + size * 0.72, T + size * 0.22, { color: col.ink, size: 11 });
  };
  show();
}
