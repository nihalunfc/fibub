// Class 9 Numbers: the square-root spiral. Start with a right triangle with both legs 1 (hypotenuse sqrt 2). On the hypotenuse
// build another right triangle with a leg of 1 (hypotenuse sqrt 3), and so on: the n-th hypotenuse is sqrt(n+1), by Pythagoras each time.
import { canvas, text, title, row, slider, readout, button, line, dot } from '../../kit.js';
import { loop } from '../../kit.js';

export default function (host) {
  let N = 4, tt = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'The square root spiral made of right triangles with a short side of one, each hypotenuse being the next square root' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Triangles', min: 1, max: 16, step: 1, value: N, oninput: (v) => { N = v; upd(); } });
  const br = row(host);
  const an = loop(host, (dt) => { tt += dt; if (tt > 0.7) { tt = 0; N = N >= 16 ? 1 : N + 1; sl.set(N); upd(); } }, { autoplay: false });
  an.button(br);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Square-root spiral: ' + N + ' triangle' + (N > 1 ? 's' : ''), col), R = Math.sqrt(N + 1);
    const cx = w / 2, cy = t + (h - t) / 2 + 4, sc = Math.min(w - 40, h - t - 24) / (2 * Math.max(R, 1.6));
    const P = [[1, 0]]; let ang = 0;
    for (let k = 1; k <= 17; k++) { ang += Math.atan(1 / Math.sqrt(k)); P.push([Math.sqrt(k + 1) * Math.cos(ang), Math.sqrt(k + 1) * Math.sin(ang)]); }
    const X = (p) => cx + p[0] * sc, Y = (p) => cy - p[1] * sc;
    for (let k = 0; k < N; k++) {
      const a = k === 0 ? [1, 0] : P[k], b = P[k + 1], c = [0, 0];
      ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = col.s[k % 4]; ctx.beginPath(); ctx.moveTo(X(c), Y(c)); ctx.lineTo(X(a), Y(a)); ctx.lineTo(X(b), Y(b)); ctx.closePath(); ctx.fill(); ctx.restore();
      line(ctx, [[X(c), Y(c)], [X(a), Y(a)], [X(b), Y(b)], [X(c), Y(c)]], col.s[k % 4], 1.8);
    }
    for (let k = 0; k <= N; k++) { const p = P[k]; if (k === 0) continue; if (k <= 8 || k === N) text(ctx, '√' + (k + 1), X(p) + (Math.cos(Math.atan2(p[1], p[0])) * 14), Y(p) - (Math.sin(Math.atan2(p[1], p[0])) * 14), { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, '1', cx + sc * 0.5, cy + 12, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    dot(ctx, cx, cy, 4, col.ink); dot(ctx, X(P[N]), Y(P[N]), 5, col.s[3], col.ink);
  };
  function upd() { out.innerHTML = `Triangle ${N}: legs 1 and √${N}, so the hypotenuse is √(${N} + 1) = <b>√${N + 1}</b> ≈ ${Math.sqrt(N + 1).toFixed(3)}. ` + (Number.isInteger(Math.sqrt(N + 1)) ? 'This one is a whole number: a perfect square!' : 'The length is irrational, yet we have drawn it exactly.'); cv.redraw(); }
  upd();
}
