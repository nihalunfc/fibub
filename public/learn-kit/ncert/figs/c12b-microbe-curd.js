// Class 12 Microbes in Human Welfare: milk to curd. Lactic acid bacteria (Lactobacillus and others) in a spoon of curd (the starter or inoculum) turn lactose into lactic acid; the pH falls and the milk protein
// casein coagulates near pH 4.6, making curd. The bacteria work fastest in warm milk (about 40 C): in cold milk they are slow, in hot milk they die. Illustrative rate model.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let T = 35, sp = 2;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'pH of milk falling over hours as lactic acid bacteria grow, with the pH at which curd sets' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Milk temperature', min: 5, max: 60, step: 1, value: T, fmt: (v) => v + ' °C', oninput: (v) => { T = v; go(); } });
  slider(ctl, { label: 'Curd added (spoons per litre)', min: 1, max: 5, step: 1, value: sp, fmt: (v) => String(v), oninput: (v) => { sp = v; go(); } });
  const f = () => { const th = Math.exp(-(((T - 40) / 10) ** 2)); const hot = T > 50 ? Math.max(0, 1 - (T - 50) / 6) : 1; return th * hot; };
  const k = () => 0.9 * f() * (0.5 + 0.25 * sp);
  const pH = (t) => 6.6 - 2.4 * (1 - Math.exp(-k() * t * t * 0.18 - k() * t * 0.4));
  const setTime = () => { for (let t = 0; t <= 24; t += 0.05) if (pH(t) <= 4.6) return t; return null; };
  const go = () => {
    const s = setTime();
    ro.textContent = s ? `At ${T} °C with ${sp} spoon${sp > 1 ? 's' : ''} the milk reaches pH 4.6 and sets after about ${s.toFixed(1)} hours. ` + (T < 20 ? 'Cold milk: the bacteria are slow.' : T > 45 ? 'Hot milk: the bacteria are stressed.' : 'Warm milk is just right.') : `At ${T} °C the bacteria are too slow or too stressed: the milk does not set in 24 hours. Heat above about 55 °C kills them.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Milk to curd: pH over time', col), s = setTime();
    const A = axes(ctx, w, h, col, { x: [0, 24], y: [3.5, 7], xlabel: 'hours', ylabel: 'pH of the milk', l: 48, t: t0 + 8, b: 40, xt: [0, 6, 12, 18, 24], yt: [4, 5, 6, 7] });
    line(ctx, [[A.L, A.Y(4.6)], [A.R, A.Y(4.6)]], col.s[3], 1.5, [5, 3]); text(ctx, 'curd sets at pH 4.6 (casein coagulates)', A.R - 4, A.Y(4.6) - 8, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    const pts = []; for (let t = 0; t <= 24; t += 0.2) pts.push([A.X(t), A.Y(pH(t))]);
    line(ctx, pts, col.s[0], 3);
    if (s) dot(ctx, A.X(s), A.Y(4.6), 6, col.s[2], col.bg);
    text(ctx, s ? 'curd after ' + s.toFixed(1) + ' h' : 'no curd', A.L + 8, A.B - 12, { color: s ? col.good : col.bad, size: 11.5, weight: 700 });
  };
  go();
}
