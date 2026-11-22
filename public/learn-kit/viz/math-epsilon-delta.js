// The epsilon-delta game. You choose how close you want f(x) to be to the limit L (a band of half-width ε). Then
// find a δ: if x stays within δ of a, f(x) must stay inside the band. The grey strip shows the largest δ that works;
// try your own δ. For a jump there is no δ that works for a small ε, so the limit does not exist.
import { canvas, axes, row, slider, choice, readout, line, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const FN = {
  lin: ['2x + 1 at x → 1', (x) => 2 * x + 1, 1, 3], sq: ['x² at x → 2', (x) => x * x, 2, 4], inv: ['1/x at x → 1', (x) => 1 / x, 1, 1],
  jump: ['jump at x → 1', (x) => (x < 1 ? 1 : 3), 1, null],
};
export default function (host) {
  let k = 'lin', eps = 1, del = 0.3;
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 260, label: 'A graph with an epsilon band and a delta strip around a point' });
  const c = row(host), c2 = row(host);
  choice(c, 'Function', Object.entries(FN).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  slider(c2, { label: 'ε (band)', min: 0.05, max: 2, step: 0.05, value: eps, fmt: (v) => f2(v), oninput: (v) => { eps = v; re(); } });
  slider(c2, { label: 'your δ', min: 0.02, max: 1.5, step: 0.02, value: del, fmt: (v) => f2(v), oninput: (v) => { del = v; re(); } });
  const out = readout(host);
  const best = () => { const [, f, a, L] = FN[k]; if (L === null) return 0; let lo = 0; for (let d = 0.005; d <= 3; d += 0.005) { let ok = true; for (let i = -20; i <= 20; i++) { const x = a + (d * i) / 20; if (i && Math.abs(f(x) - L) >= eps) { ok = false; break; } } if (!ok) break; lo = d; } return lo; };
  const works = (d) => { const [, f, a, L] = FN[k]; if (L === null) return false; for (let i = -40; i <= 40; i++) { const x = a + (d * i) / 40; if (i && Math.abs(f(x) - L) >= eps) return false; } return true; };
  function re() { cv.redraw(); const [nm, , a, L] = FN[k], b = best();
    out.innerHTML = L === null ? `Left of ${a} the function is 1, right of it is 3. ${eps <= 1 ? `With ε = ${f2(eps)} the band around 2 cannot hold both sides, so <b>no δ works</b>: the limit does not exist.` : `With ε = ${f2(eps)} the band is wide enough to hide the jump. Make ε smaller than 1: then no δ works and the limit does not exist.`}` : `Limit L = ${L} as x → ${a}. For ε = ${f2(eps)}, the largest δ that works is about <b>${f2(b, 2)}</b>. Your δ = ${f2(del)} <b>${works(del) ? 'works ✓' : 'is too big ✗'}</b>: ${works(del) ? 'every x within δ of a has f(x) inside the band' : 'some x within δ of a has f(x) outside the band'}. Smaller ε needs smaller δ.`; }
  cv.draw = (ctx, w, h, col) => {
    const [nm, f, a, L] = FN[k], ymid = L ?? 2, A = axes(ctx, w, h, col, { x: [a - 2, a + 2], y: [ymid - 3, ymid + 3], l: 30, b: 22, t: 22, r: 10 });
    const b = best(), good = works(del);
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    if (L !== null) { ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[0]; ctx.fillRect(A.L, A.Y(L + eps), A.R - A.L, A.Y(L - eps) - A.Y(L + eps)); ctx.globalAlpha = 0.16; ctx.fillStyle = col.muted; ctx.fillRect(A.X(a - b), A.T, A.X(a + b) - A.X(a - b), A.B - A.T); ctx.fillStyle = good ? col.good : col.bad; ctx.globalAlpha = 0.2; ctx.fillRect(A.X(a - del), A.T, A.X(a + del) - A.X(a - del), A.B - A.T); ctx.globalAlpha = 1; }
    else { ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[0]; ctx.fillRect(A.L, A.Y(2 + eps), A.R - A.L, A.Y(2 - eps) - A.Y(2 + eps)); ctx.globalAlpha = 1; }
    ctx.restore();
    curve(ctx, A, f, a - 2, a + 2, col.s[0], 3, { n: 400, jump: 150 });
    if (L !== null) { line(ctx, [[A.X(a), A.T], [A.X(a), A.B]], col.muted, 1, [4, 4]); line(ctx, [[A.L, A.Y(L)], [A.R, A.Y(L)]], col.muted, 1, [4, 4]); }
    text(ctx, L === null ? 'blue band: ε around 2 (no good for both sides)' : 'blue band: L ± ε  ·  strip: x within δ of a', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
