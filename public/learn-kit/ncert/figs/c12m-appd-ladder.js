// Class 12 Related rates: a 10 m ladder leans on a wall. The foot slides out at a steady speed dx/dt. Because x^2 + y^2 = 100, differentiating
// gives 2x dx/dt + 2y dy/dt = 0, so dy/dt = -(x/y) dx/dt: the top slides down slowly at first and then faster and faster. Drag the slider (or play).
import { canvas, text, title, line, dot, arrow, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let x = 3, v = 1;
  const L = 10;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A ladder sliding down a wall as its foot moves out, with the speed of its top' });
  const ctl = row(host), out = readout(host);
  const sx = slider(ctl, { label: 'foot distance x (m)', min: 1, max: 9.5, step: 0.1, value: x, fmt: (val) => val.toFixed(1), oninput: (val) => { x = val; say(); } });
  slider(ctl, { label: 'foot speed (m/s)', min: 0.5, max: 2, step: 0.5, value: v, fmt: (val) => String(val), oninput: (val) => { v = val; say(); } });
  const an = loop(host, (dt) => { x += dt * v; if (x > 9.5) x = 1; sx.set(x); say(); }, { autoplay: false }); an.button(ctl);
  const Y = () => Math.sqrt(L * L - x * x);
  function say() {
    const y = Y(), dy = -(x / y) * v;
    out.innerHTML = `Foot x = ${x.toFixed(1)} m, top y = √(100 − x²) = ${y.toFixed(2)} m. From x² + y² = 100: dy/dt = −(x/y)·dx/dt = <b>${dy.toFixed(2)} m/s</b>. The top moves ${Math.abs(dy) > v ? 'faster' : 'slower'} than the foot.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Ladder: x² + y² = 100', col);
    const S = Math.min((w - 70) / 10, (h - 90) / 10), ox = 30, oy = h - 34;
    const px = (a) => ox + a * S, py = (b) => oy - b * S;
    line(ctx, [[ox, py(10.5)], [ox, oy], [px(10.5), oy]], col.ink, 3);
    const y = Y(), dy = -(x / y) * v;
    line(ctx, [[px(0), py(y)], [px(x), py(0)]], col.s[0], 5);
    dot(ctx, px(x), py(0), 6, col.s[1], col.ink); dot(ctx, px(0), py(y), 6, col.s[3], col.ink);
    arrow(ctx, px(x), py(0) + 16, px(x) + Math.min(40, v * 22), py(0) + 16, col.s[1], 2.5);
    text(ctx, `${v} m/s`, px(x) + Math.min(40, v * 22) + 4, py(0) + 16, { color: col.s[1], size: 11.5, weight: 800 });
    arrow(ctx, px(0) + 16, py(y), px(0) + 16, py(y) + Math.min(60, Math.abs(dy) * 22), col.s[3], 2.5);
    text(ctx, `${Math.abs(dy).toFixed(2)} m/s down`, px(0) + 24, py(y) + 6, { color: col.s[3], size: 11.5, weight: 800, halo: col.panel });
    text(ctx, `x = ${x.toFixed(1)}`, (px(0) + px(x)) / 2, oy - 8, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, `y = ${y.toFixed(1)}`, ox + 8, (py(0) + py(y)) / 2 + 24, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
  };
  say();
}
