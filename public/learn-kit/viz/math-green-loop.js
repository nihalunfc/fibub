// Green's theorem and the divergence theorem, checked by numbers. A circular loop sits in a 2D field F = (P, Q).
// Add up F·(along the loop) all the way round: that is the circulation ∮F·dr. Add up curl F over the whole disc: the
// two agree. Switch to Flux and add F·(outward normal) round the loop; it equals the sum of div F inside. Move and
// resize the loop, change the field.
import { canvas, axes, row, slider, choice, readout, line, dot, text, arrow } from '../kit.js';
import { drag, f2 } from './_math.js';

const FLD = {
  vor: ['(−y, x)', (x, y) => [-y, x], 2, 0], shear: ['(y, 0)', (x, y) => [y, 0], -1, 0], src: ['(x, y)', (x, y) => [x, y], 0, 2], mix: ['(x² , xy)', (x, y) => [x * x, x * y], null, null], swirl: ['(−y³... use (x·y, x + y²)', (x, y) => [x * y, x + y * y], null, null],
};
FLD.swirl[0] = '(xy, x + y²)';
export default function (host) {
  let k = 'vor', mode = 'circ', c0 = [0.4, 0.2], rad = 1.4;
  const cv = canvas(host, { aspect: 0.82, max: 380, min: 270, label: 'A circular loop in a vector field' });
  const c = row(host), c2 = row(host);
  choice(c, 'Field F', Object.entries(FLD).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  choice(c, 'Check', [['circ', 'Circulation = ∬ curl'], ['flux', 'Flux = ∬ div']], mode, (v) => { mode = v; re(); });
  slider(c2, { label: 'radius', min: 0.4, max: 2.2, step: 0.05, value: rad, fmt: (v) => f2(v), oninput: (v) => { rad = v; re(); } });
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? [[A0.X(c0[0]), A0.Y(c0[1])]] : []), (i, x, y) => { c0 = [Math.max(-2, Math.min(2, -3 + ((x - A0.L) / (A0.R - A0.L)) * 6)), Math.max(-1.6, Math.min(1.6, 2.5 - ((y - A0.T) / (A0.B - A0.T)) * 5))]; re(); }, 22);
  const num = () => {
    const F = FLD[k][1], N = 360, e = 1e-4; let loop = 0;
    for (let i = 0; i < N; i++) { const t = ((i + 0.5) / N) * 2 * Math.PI, x = c0[0] + rad * Math.cos(t), y = c0[1] + rad * Math.sin(t), [u, v] = F(x, y); loop += mode === 'circ' ? (u * -Math.sin(t) + v * Math.cos(t)) * rad * (2 * Math.PI / N) : (u * Math.cos(t) + v * Math.sin(t)) * rad * (2 * Math.PI / N); }
    let area = 0; const M = 90, h = (2 * rad) / M;
    for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) { const x = c0[0] - rad + (i + 0.5) * h, y = c0[1] - rad + (j + 0.5) * h; if ((x - c0[0]) ** 2 + (y - c0[1]) ** 2 > rad * rad) continue; const Fx = (F(x + e, y)[0] - F(x - e, y)[0]) / (2 * e), Gy = (F(x, y + e)[1] - F(x, y - e)[1]) / (2 * e), Gx = (F(x + e, y)[1] - F(x - e, y)[1]) / (2 * e), Fy = (F(x, y + e)[0] - F(x, y - e)[0]) / (2 * e); area += (mode === 'circ' ? Gx - Fy : Fx + Gy) * h * h; }
    return [loop, area];
  };
  function re() { cv.redraw(); const [l, a] = num(); out.innerHTML = mode === 'circ' ? `Circulation ∮F·dr round the loop = <b>${f2(l, 3)}</b>. Surface sum ∬(∂Q/∂x − ∂P/∂y) dA over the disc = <b>${f2(a, 3)}</b>. Green's theorem: they are equal.` : `Outward flux ∮F·n ds = <b>${f2(l, 3)}</b>. ∬(∂P/∂x + ∂Q/∂y) dA = <b>${f2(a, 3)}</b>. Divergence theorem in the plane: equal.`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-3, 3], y: [-2.5, 2.5], l: 8, b: 8, t: 22, r: 8, xt: [], yt: [], grid: false }); A0 = A; const F = FLD[k][1];
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    for (let i = -2.5; i <= 2.5; i += 0.5) for (let j = -2; j <= 2; j += 0.5) { const [u, v] = F(i, j), m = Math.hypot(u, v); if (m < 1e-6) continue; const L2 = 0.22 * Math.min(1, Math.sqrt(m)) + 0.04; arrow(ctx, A.X(i), A.Y(j), A.X(i + (u / m) * L2), A.Y(j + (v / m) * L2), col.line, 1.4, 5); }
    ctx.beginPath(); ctx.arc(A.X(c0[0]), A.Y(c0[1]), rad * (A.X(1) - A.X(0)), 0, 7); ctx.globalAlpha = 0.12; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke();
    // little arrows on the loop: tangent (circulation) or outward normal (flux), length ∝ the component of F
    for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI, x = c0[0] + rad * Math.cos(t), y = c0[1] + rad * Math.sin(t), [u, v] = F(x, y), d = mode === 'circ' ? [-Math.sin(t), Math.cos(t)] : [Math.cos(t), Math.sin(t)], comp = u * d[0] + v * d[1], s = Math.max(-0.7, Math.min(0.7, comp * 0.3)); arrow(ctx, A.X(x), A.Y(y), A.X(x + d[0] * s), A.Y(y + d[1] * s), comp >= 0 ? col.s[2] : col.s[3], 2.5, 6); }
    dot(ctx, A.X(c0[0]), A.Y(c0[1]), 4, col.ink); ctx.restore();
    text(ctx, mode === 'circ' ? 'arrows on the loop: F along the path (green +, pink −)' : 'arrows on the loop: F out of the loop (green +, pink −)', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
