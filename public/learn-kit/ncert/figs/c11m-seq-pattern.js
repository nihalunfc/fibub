// Class 11 Maths, Sequences and Series: a sequence is a function from the natural numbers: n = 1, 2, 3, ... gives
// the terms a1, a2, a3, ... Choose a rule and see its terms as dots. A series is the SUM of the terms of a sequence;
// the running sum S_n is drawn as the bar behind each dot.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title } from '../../kit.js';

const R = {
  ap: ['3, 7, 11, 15, ...  aₙ = 4n − 1', (n) => 4 * n - 1],
  gp: ['2, 4, 8, 16, ...  aₙ = 2ⁿ', (n) => 2 ** n],
  sq: ['1, 4, 9, 16, ...  aₙ = n²', (n) => n * n],
  inv: ['1, ½, ⅓, ¼, ...  aₙ = 1/n', (n) => 1 / n],
  alt: ['−1, 1, −1, 1, ...  aₙ = (−1)ⁿ', (n) => (-1) ** n],
};
export default function (host) {
  let k = 'ap', N = 8, show = 'terms';
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'The terms of a sequence plotted against n, with running sums as bars' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'rule', Object.entries(R).map(([a]) => [a, { ap: 'AP', gp: 'GP', sq: 'squares', inv: '1/n', alt: '(−1)ⁿ' }[a]]), k, (v) => { k = v; re(); });
  choice(c2, 'show', [['terms', 'terms aₙ'], ['sum', 'series Sₙ']], show, (v) => { show = v; re(); });
  slider(c2, { label: 'n up to', min: 3, max: 12, step: 1, value: N, fmt: String, oninput: (v) => { N = v; re(); } });
  const re = () => { cv.redraw(); const f = R[k][1]; let s = 0; for (let i = 1; i <= N; i++) s += f(i); out.innerHTML = `Terms: ${Array.from({ length: Math.min(N, 6) }, (_, i) => +f(i + 1).toFixed(3)).join(', ')}${N > 6 ? ', ...' : ''}. The series up to n = ${N}: S<sub>${N}</sub> = <b>${+s.toFixed(4)}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const f = R[k][1], top = title(ctx, R[k][0], col, 15); const val = (n) => { if (show === 'terms') return f(n); let s = 0; for (let i = 1; i <= n; i++) s += f(i); return s; };
    let lo = 0, hi = -1e9, mn = 1e9; for (let i = 1; i <= N; i++) { hi = Math.max(hi, val(i)); mn = Math.min(mn, val(i)); } lo = Math.min(0, mn); hi = Math.max(hi, 0.01); const pad = (hi - lo) * 0.12;
    const g = axes(ctx, w, h, col, { x: [0, N + 1], y: [lo - (lo < 0 ? pad : 0), hi + pad], l: 38, b: 42, t: top + 4, r: 12, xlabel: 'n', xt: Array.from({ length: N }, (_, i) => i + 1).filter((v) => N <= 8 || v % 2 === 1) });
    for (let n = 1; n <= N; n++) { const v = val(n); ctx.fillStyle = col.s[0]; ctx.globalAlpha = show === 'sum' ? 0.25 : 0.12; ctx.fillRect(g.X(n - 0.3), Math.min(g.Y(v), g.Y(0)), g.X(n + 0.3) - g.X(n - 0.3), Math.abs(g.Y(v) - g.Y(0))); ctx.globalAlpha = 1; dot(ctx, g.X(n), g.Y(v), 5, col.s[0], col.panel); }
  };
  re();
}
