// Class 11 Maths, Permutations and Combinations: the fundamental principle of counting (multiplication rule).
// If a job has stages with m, n, p ways, the whole job can be done in m × n × p ways: every way of stage 1 is
// followed by every way of stage 2, and so on. The tree shows each complete choice as one leaf (one path).
import { canvas, row, slider, readout, line, dot, text, title, loop } from '../../kit.js';

export default function (host) {
  let m = 2, n = 3, p = 2, hl = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A tree diagram of the choices for shirt, trouser and shoes with the total count' });
  const c1 = row(host), out = readout(host);
  const re = () => { cv.redraw(); out.innerHTML = `${m} shirts × ${n} trousers × ${p} pairs of shoes = <b>${m * n * p}</b> different outfits. The highlighted path is outfit number ${hl % (m * n * p) + 1}.`; };
  slider(c1, { label: 'shirts', min: 1, max: 4, step: 1, value: m, fmt: (v) => String(v), oninput: (v) => { m = v; re(); } });
  slider(c1, { label: 'trousers', min: 1, max: 4, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; re(); } });
  slider(c1, { label: 'shoes', min: 1, max: 3, step: 1, value: p, fmt: (v) => String(v), oninput: (v) => { p = v; re(); } });
  const anim = loop(host, (dt, t) => { const k = Math.floor(t * 1.2); if (k !== hl) { hl = k; re(); } });
  anim.button(c1);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'One outfit = shirt, then trousers, then shoes', col), total = m * n * p, x0 = 30, x1 = w * 0.36, x2 = w * 0.64, x3 = w - 26, y0 = top + 16, H = h - y0 - 14;
    const Y = (i, k) => y0 + ((i + 0.5) / k) * H;
    const root = [x0, y0 + H / 2];
    let leaf = 0; const cur = hl % total;
    for (let a = 0; a < m; a++) {
      const ya = Y(a, m), ia = a * n * p;
      for (let b = 0; b < n; b++) {
        const yb = Y(a * n + b, m * n);
        for (let c = 0; c < p; c++) {
          const yc = Y((a * n + b) * p + c, total), on = (a * n + b) * p + c === cur;
          line(ctx, [[x2, yb], [x3, yc]], on ? col.s[1] : col.line, on ? 2.4 : 1);
          dot(ctx, x3, yc, on ? 5 : 3, on ? col.s[1] : col.muted); leaf++;
        }
        const onb = Math.floor(cur / p) === a * n + b; line(ctx, [[x1, ya], [x2, yb]], onb ? col.s[1] : col.line, onb ? 2.4 : 1); dot(ctx, x2, yb, onb ? 5 : 3.5, onb ? col.s[1] : col.s[0]);
      }
      const ona = Math.floor(cur / (n * p)) === a; line(ctx, [[x0, root[1]], [x1, ya]], ona ? col.s[1] : col.line, ona ? 2.4 : 1); dot(ctx, x1, ya, ona ? 6 : 4.5, ona ? col.s[1] : col.s[2]);
    }
    dot(ctx, x0, root[1], 6, col.ink);
    text(ctx, `${m} shirt${m > 1 ? "s" : ""}`, x1, y0 - 2, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); text(ctx, `${n} each`, x2, y0 - 2, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); text(ctx, `${p} each`, x3 - 6, y0 - 2, { color: col.muted, size: 10.5, weight: 700, align: 'center' });
  };
  re();
}
