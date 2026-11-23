// Class 12 Chain rule: a composite function y = f(g(x)) is two machines in a row, x -> g -> u -> f -> y. A small nudge dx makes
// u move by g'(x) dx, and that makes y move by f'(u) times as much. So dy/dx = f'(u) * g'(x): the rates multiply like gear ratios.
// The figure shows each machine's rate and compares the product with a numerical derivative of the whole.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

const SET = {
  a: { name: '(2x+1)³', g: (x) => 2 * x + 1, gp: () => 2, f: (u) => u ** 3, fp: (u) => 3 * u * u, gn: '2x + 1', fn: 'u³', fpn: '3u²', gpn: '2' },
  b: { name: 'sin(x²)', g: (x) => x * x, gp: (x) => 2 * x, f: Math.sin, fp: Math.cos, gn: 'x²', fn: 'sin u', fpn: 'cos u', gpn: '2x' },
  c: { name: 'e^(3x)', g: (x) => 3 * x, gp: () => 3, f: Math.exp, fp: Math.exp, gn: '3x', fn: 'eᵘ', fpn: 'eᵘ', gpn: '3' },
};
export default function (host) {
  let key = 'a', x = 0.5;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Two machines in a row with their rates multiplying to give the derivative of the whole' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'y =', Object.entries(SET).map(([k, v]) => [k, v.name]), key, (v) => { key = v; say(); });
  slider(ctl, { label: 'x', min: -1, max: 1.5, step: 0.05, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; say(); } });
  const S = () => SET[key];
  const calc = () => { const s = S(), u = s.g(x), gp = s.gp(x), fp = s.fp(u), hh = 1e-6; return { u, y: s.f(u), gp, fp, tot: gp * fp, num: (s.f(s.g(x + hh)) - s.f(s.g(x - hh))) / (2 * hh) }; };
  function say() { const c = calc(); out.innerHTML = `du/dx = ${S().gpn} = <b>${c.gp.toFixed(3)}</b>, dy/du = ${S().fpn} = <b>${c.fp.toFixed(3)}</b>. Product = <b>${c.tot.toFixed(3)}</b>. Nudging the whole function numerically gives ${c.num.toFixed(3)}: the same.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const s = S(), c = calc(), top = title(ctx, `y = ${s.name}: g then f`, col) + 16, bw = Math.min(92, w * 0.26), y0 = top + 40, cx1 = w * 0.3, cx2 = w * 0.7;
    const box = (cx, label, c0) => { ctx.fillStyle = col.soft; ctx.fillRect(cx - bw / 2, y0 - 22, bw, 44); ctx.strokeStyle = c0; ctx.lineWidth = 2.5; ctx.strokeRect(cx - bw / 2, y0 - 22, bw, 44); text(ctx, label, cx, y0, { color: col.ink, size: 14, weight: 800, align: 'center' }); };
    box(cx1, 'g: ' + s.gn, col.s[0]); box(cx2, 'f: ' + s.fn, col.s[3]);
    arrow(ctx, 14, y0, cx1 - bw / 2 - 2, y0, col.ink, 2); arrow(ctx, cx1 + bw / 2, y0, cx2 - bw / 2 - 2, y0, col.ink, 2); arrow(ctx, cx2 + bw / 2, y0, w - 8, y0, col.ink, 2);
    text(ctx, `x = ${x.toFixed(2)}`, 14, y0 - 30, { color: col.ink, size: 12, weight: 700 });
    text(ctx, `u = ${c.u.toFixed(2)}`, w / 2, y0 - 30, { color: col.s[0], size: 12, weight: 700, align: 'center' });
    text(ctx, `y = ${c.y.toFixed(2)}`, w - 10, y0 - 30, { color: col.s[3], size: 12, weight: 700, align: 'right' });
    const y1 = y0 + 90;
    text(ctx, 'gear ratio of g', cx1, y1 - 14, { color: col.muted, size: 11, align: 'center' });
    text(ctx, `du/dx = ${c.gp.toFixed(2)}`, cx1, y1 + 4, { color: col.s[0], size: 15, weight: 800, align: 'center' });
    text(ctx, 'gear ratio of f', cx2, y1 - 14, { color: col.muted, size: 11, align: 'center' });
    text(ctx, `dy/du = ${c.fp.toFixed(2)}`, cx2, y1 + 4, { color: col.s[3], size: 15, weight: 800, align: 'center' });
    text(ctx, '×', w / 2, y1 + 4, { color: col.ink, size: 20, weight: 800, align: 'center' });
    line(ctx, [[cx1 - 50, y1 + 28], [cx2 + 50, y1 + 28]], col.line, 1.5);
    text(ctx, `dy/dx = ${c.gp.toFixed(2)} × ${c.fp.toFixed(2)} = ${c.tot.toFixed(3)}`, w / 2, y1 + 54, { color: col.s[1], size: 17, weight: 800, align: 'center' });
    text(ctx, 'nudge dx → u moves du/dx times as far → y moves dy/du times that', w / 2, y1 + 84, { color: col.muted, size: 11, align: 'center' });
  };
  say();
}
