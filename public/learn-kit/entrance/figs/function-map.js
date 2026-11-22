// Sets, relations and functions: arrow diagrams from A to B. Pick the sizes and a kind of map; the drawing shows
// one example and the line under it counts all functions, one-one functions and onto functions from A to B.
import { canvas, text, arrow, dot, row, choice, slider, readout } from '../../kit.js';

const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
const C = (n, r) => (r < 0 || r > n ? 0 : fact(n) / (fact(r) * fact(n - r)));
export const onto = (m, n) => { let s = 0; for (let k = 0; k <= n; k++) s += (-1) ** k * C(n, k) * (n - k) ** m; return s; };
export default function (host) {
  let m = 3, n = 3, kind = 'bij';
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 230, label: 'Arrow diagram of a function from set A to set B' });
  const ctl = row(host);
  slider(ctl, { label: 'Elements in A', min: 1, max: 6, step: 1, value: m, fmt: (v) => `${v}`, oninput: (v) => { m = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Elements in B', min: 1, max: 6, step: 1, value: n, fmt: (v) => `${v}`, oninput: (v) => { n = v; cv.redraw(); show(); } });
  const ctl2 = row(host);
  choice(ctl2, 'Example', [['any', 'Any function'], ['inj', 'One-one'], ['sur', 'Onto'], ['bij', 'One-one and onto']], kind, (v) => { kind = v; cv.redraw(); show(); });
  const out = readout(host);
  const possible = () => ({ any: true, inj: m <= n, sur: m >= n, bij: m === n })[kind];
  const show = () => {
    const inj = m <= n ? fact(n) / fact(n - m) : 0;
    out.innerHTML = `From A (${m}) to B (${n}): <b>${n ** m}</b> functions (each element of A has ${n} choices), <b>${inj}</b> one-one, <b>${onto(m, n)}</b> onto${m === n ? `, <b>${fact(n)}</b> one-one and onto` : ''}. Relations from A to B: 2<sup>${m * n}</sup> = ${2 ** (m * n)}.${possible() ? '' : ' (No example of the chosen kind exists for these sizes.)'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ya = (i) => 40 + (i * (h - 70)) / Math.max(1, m - 1 || 1), yb = (j) => 40 + (j * (h - 70)) / Math.max(1, n - 1 || 1);
    const xa = w * 0.25, xb = w * 0.75;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(xa, h / 2 + 5, 40, h / 2 - 12, 0, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(xb, h / 2 + 5, 40, h / 2 - 12, 0, 0, 7); ctx.stroke();
    text(ctx, 'A', xa, 12, { color: col.ink, size: 13, weight: 600, align: 'center' });
    text(ctx, 'B', xb, 12, { color: col.ink, size: 13, weight: 600, align: 'center' });
    const Y = (i, k) => (k === 1 ? h / 2 + 5 : 40 + (i * (h - 70)) / (k - 1));
    let map = [];
    if (possible()) {
      if (kind === 'inj' || kind === 'bij') map = Array.from({ length: m }, (_, i) => i);
      else if (kind === 'sur') map = Array.from({ length: m }, (_, i) => Math.min(i, n - 1));
      else map = Array.from({ length: m }, (_, i) => (i * 2) % n);
    }
    map.forEach((j, i) => arrow(ctx, xa + 8, Y(i, m), xb - 8, Y(j, n), col.s[i % 8], 1.8, 7));
    for (let i = 0; i < m; i++) { dot(ctx, xa, Y(i, m), 4, col.ink); text(ctx, String(i + 1), xa - 16, Y(i, m), { color: col.muted, size: 11, align: 'center' }); }
    for (let j = 0; j < n; j++) { dot(ctx, xb, Y(j, n), 4, col.ink); text(ctx, String.fromCharCode(97 + j), xb + 16, Y(j, n), { color: col.muted, size: 11, align: 'center' }); }
    void ya; void yb;
  };
  cv.redraw(); show();
}
