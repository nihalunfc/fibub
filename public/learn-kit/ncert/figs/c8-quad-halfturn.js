// Class 8 Quadrilaterals: a parallelogram looks the same after a half-turn (180 degrees) about the point where its diagonals meet.
// Slide the turn from 0 to 180: at 180 the copy lands on the original, so opposite sides and opposite angles are equal.
import { canvas, text, title, row, slider, loop, readout } from '../../kit.js';
import { view, grid, shape } from './c8-lib.js';

export default function (host) {
  let a = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A parallelogram and a copy turned about its centre' });
  const out = readout(host); const ctl = row(host);
  const sl = slider(ctl, { label: 'Turn', min: 0, max: 180, step: 1, value: 0, fmt: (v) => Math.round(v) + '°', oninput: (v) => { a = v; anim.pause(); sync(); } });
  const anim = loop(host, (dt) => { a += dt * 40; if (a > 180) a = 0; sl.set(Math.round(a)); sync(); }, { autoplay: false }); anim.button(ctl);
  const P = [[1.5, 1.5], [7.5, 1.5], [9.5, 5.5], [3.5, 5.5]], O = [5.5, 3.5];
  function sync() { out.innerHTML = Math.round(a) >= 180 ? 'At 180° the copy sits exactly on the original: A went to C and B went to D. So <b>opposite sides and opposite angles are equal</b> and O is the mid-point of both diagonals.' : `Turned by ${Math.round(a)}° about O. Slide to 180° and watch.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Half-turn of a parallelogram', col), V = view(w, h, top, 11, 7.5, 8); grid(ctx, V, col);
    shape(ctx, V, P, col.s[0], col.s[0], 0.2, 3);
    const r = (a * Math.PI) / 180, R = P.map((p) => { const dx = p[0] - O[0], dy = p[1] - O[1]; return [O[0] + dx * Math.cos(r) - dy * Math.sin(r), O[1] + dx * Math.sin(r) + dy * Math.cos(r)]; });
    shape(ctx, V, R, col.s[3], col.s[3], 0.18, 2.5);
    P.forEach((p, i) => text(ctx, 'ABCD'[i], V.X(p[0]) + (p[0] < 5 ? -11 : 11), V.Y(p[1]) + (p[1] < 3 ? 12 : -12), { color: col.s[0], size: 13, weight: 700, align: 'center', halo: col.panel }));
    R.forEach((p, i) => text(ctx, "ABCD"[i] + "'", V.X(p[0]) + (p[0] < 5 ? 14 : -14) * 0, V.Y(p[1]) + (p[1] < 3 ? -2 : 2), { color: col.s[3], size: 10.5, weight: 700, align: 'center', halo: col.panel }));
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(V.X(O[0]), V.Y(O[1]), 5, 0, 7); ctx.fill(); text(ctx, 'O', V.X(O[0]) + 10, V.Y(O[1]) - 9, { color: col.ink, size: 12, weight: 700, halo: col.panel });
  };
  sync();
}
