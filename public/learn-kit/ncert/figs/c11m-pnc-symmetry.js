// Class 11 Maths, Combinations: choosing r things to take is the same as choosing n − r things to leave behind,
// so nCr = nC(n−r). Slide r: the chosen group is blue, the left-out group is grey, and the bar chart of nCr over all r
// shows the symmetric hump with its peak in the middle.
import { canvas, row, slider, readout, text, title, dot } from '../../kit.js';

const C = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); };
export default function (host) {
  let n = 8, r = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Chosen and left out people with a bar chart of nCr for every r' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'n people', min: 3, max: 12, step: 1, value: n, fmt: String, oninput: (v) => { n = v; if (r > n) { r = n; sr.set(r); } re(); } });
  const sr = slider(c1, { label: 'r chosen', min: 0, max: 12, step: 1, value: r, fmt: String, oninput: (v) => { r = Math.min(v, n); re(); } });
  const re = () => { cv.redraw(); out.innerHTML = `Choose ${r} of ${n}: ${n}C${r} = <b>${C(n, r)}</b>. Leaving out ${n - r} gives the same groups: ${n}C${n - r} = <b>${C(n, n - r)}</b>. Order inside the group does not matter.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${n} people: choose ${r}, leave ${n - r}`, col), cell = Math.min(30, (w - 20) / n);
    for (let i = 0; i < n; i++) { const x = (w - n * cell) / 2 + i * cell + cell / 2, y = top + 24; dot(ctx, x, y, cell * 0.36, i < r ? col.s[0] : col.line, i < r ? col.panel : col.muted); }
    const y0 = top + 58, bh = h - y0 - 26, bw = (w - 40) / (n + 1), mx = Math.max(...Array.from({ length: n + 1 }, (_, k) => C(n, k)));
    for (let k = 0; k <= n; k++) { const hh = (C(n, k) / mx) * bh, x = 20 + k * bw; ctx.fillStyle = k === r ? col.s[0] : k === n - r ? col.s[2] : col.line; ctx.fillRect(x + 2, y0 + bh - hh, bw - 4, hh); text(ctx, String(k), x + bw / 2, y0 + bh + 10, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, `bar r = ${r} and r = ${n - r} are the same height`, w / 2, y0 - 2, { color: col.muted, size: 11, align: 'center' });
  };
  re();
}
