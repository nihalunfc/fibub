// Age pyramids built from two things: how many children a woman has and how long people live. The bars are 5-year age groups
// (males left, females right), coloured as pre-reproductive (0 to 14), reproductive (15 to 49) and post-reproductive (50 and over).
// A broad base means a growing population, a straight-sided tower a stable one, a narrow base a shrinking one.
import { canvas, row, slider, readout, text, title } from '../kit.js';

export default function (host) {
  let tfr = 2.1, life = 75;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'An age pyramid shaped by births per woman and life expectancy' });
  const c = row(host);
  slider(c, { label: 'Children per woman', min: 1.0, max: 6.0, step: 0.1, value: tfr, fmt: (v) => v.toFixed(1), oninput: (v) => { tfr = v; show(); } });
  slider(c, { label: 'Life expectancy', min: 45, max: 90, step: 1, value: life, fmt: (v) => `${v} y`, oninput: (v) => { life = v; show(); } });
  const out = readout(host);
  const bands = () => { const r = Math.log(Math.max(0.1, tfr) / 2.1) / 28, L = life * 1.12, v = Array.from({ length: 20 }, (_, i) => { const a = i * 5 + 2.5, S = 1 / (1 + Math.pow(a / L, 7 + life / 15)); return Math.exp(-r * a) * S; }); const T = v.reduce((a, b) => a + b, 0); return v.map((x) => x / T); };
  function show() { const b = bands(), pre = b.slice(0, 3).reduce((a, x) => a + x, 0), rep = b.slice(3, 10).reduce((a, x) => a + x, 0), post = b.slice(10).reduce((a, x) => a + x, 0); const kind = tfr > 2.5 ? 'expanding (wide base): fast growth' : tfr > 1.9 ? 'stable (nearly straight sides): replacement fertility is about 2.1' : 'declining (narrow base): ageing population'; out.innerHTML = `Pre-reproductive <b>${(pre * 100).toFixed(0)}%</b>, reproductive <b>${(rep * 100).toFixed(0)}%</b>, post-reproductive <b>${(post * 100).toFixed(0)}%</b>. Shape: <b>${kind}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Age pyramid', col);
    const b = bands(), mx = Math.max(...b), cx = w / 2, T = 42, B = h - 36, bh = (B - T) / 20, W = w / 2 - 36;
    b.forEach((v, i) => { const y = B - (i + 1) * bh, ww = (v / mx) * W, c = i < 3 ? col.s[2] : i < 10 ? col.s[0] : col.s[1]; ctx.fillStyle = c; ctx.fillRect(cx - ww, y + 1, ww, bh - 2); ctx.fillRect(cx, y + 1, ww, bh - 2); if (i % 4 === 0) text(ctx, String(i * 5), cx, y + bh / 2, { color: '#fff', size: 8.5, align: 'center', fit: false }); });
    text(ctx, 'Males', 10, B + 14, { color: col.muted, size: 10.5, weight: 700 }); text(ctx, 'Females', w - 10, B + 14, { color: col.muted, size: 10.5, weight: 700, align: 'right' }); text(ctx, 'age (years) in the middle', cx, B + 14, { color: col.muted, size: 9.5, align: 'center' });
    text(ctx, 'pre-reproductive', 10, T - 8, { color: col.s[2], size: 9.5, weight: 700, fit: false }); text(ctx, 'reproductive', cx - 20, T - 8, { color: col.s[0], size: 9.5, weight: 700, fit: false }); 
  };
  show();
}
