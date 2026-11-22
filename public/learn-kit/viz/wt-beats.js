// Beats: two notes of nearly the same frequency added together. The loudness swells and fades |f1 - f2| times a second
// (the envelope 2A cos(pi (f1 - f2) t)). Move the two frequency sliders closer and the beats slow down; at equal
// frequency they vanish. The frequencies here are slowed to a few hertz so you can see what a listener hears as throbbing.
import { canvas, axes, line, dot, text, title, row, slider, readout, loop } from '../kit.js';

export default function (host) {
  let f1 = 6, f2 = 7, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Two waves of close frequencies and their sum showing beats' });
  const ctl = row(host);
  slider(ctl, { label: 'Note 1', min: 4, max: 10, step: 0.1, value: f1, fmt: (v) => `${v.toFixed(1)} Hz`, oninput: (v) => { f1 = v; upd(); } });
  slider(ctl, { label: 'Note 2', min: 4, max: 10, step: 0.1, value: f2, fmt: (v) => `${v.toFixed(1)} Hz`, oninput: (v) => { f2 = v; upd(); } });
  const lp = loop(host, (dt) => { t += dt * 0.5; cv.redraw(); }); const c2 = row(host); lp.button(c2);
  const out = readout(host);
  function upd() {
    const fb = Math.abs(f1 - f2);
    out.innerHTML = `Beat frequency = |f₁ − f₂| = <b>${fb.toFixed(1)} Hz</b>${fb > 0.05 ? ` (one swell every ${(1 / fb).toFixed(2)} s)` : ' (equal notes: no beats, just a louder steady tone)'}. The sum oscillates at the average frequency ${((f1 + f2) / 2).toFixed(2)} Hz inside the envelope. Real notes: 440 Hz and 444 Hz beat 4 times a second, which is how a guitarist tunes by ear.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Beats: y = sin 2πf₁t + sin 2πf₂t', col);
    const T = 2; // seconds shown
    const panel = (y0, hh, fns, label, env) => {
      ctx.save(); ctx.translate(0, y0);
      const A = axes(ctx, w, hh, col, { x: [0, T], y: [-2.2, 2.2], xlabel: y0 > h * 0.6 ? 'time (s)' : '', ylabel: '', t: 2, b: y0 > h * 0.6 ? 30 : 4, l: 30, yt: [-2, 0, 2], xt: y0 > h * 0.6 ? [0, 0.5, 1, 1.5, 2] : [], fx: (v) => v.toFixed(1) });
      fns.forEach(([f, c, wd]) => { const pts = []; for (let i = 0; i <= 300; i++) { const q = (T * i) / 300; pts.push([A.X(q), A.Y(f(q + t))]); } line(ctx, pts, c, wd); });
      if (env) { const e = (s) => 2 * Math.cos(Math.PI * (f1 - f2) * (s + t)); [1, -1].forEach((sg) => { const pts = []; for (let i = 0; i <= 300; i++) { const q = (T * i) / 300; pts.push([A.X(q), A.Y(sg * Math.abs(e(q)))]); } line(ctx, pts, col.muted, 1.5, [5, 4]); }); }
      ctx.restore(); text(ctx, label, 38, y0 + 12, { color: col.muted, size: 11, weight: 600, halo: col.panel });
    };
    const hh = (h - 6) / 3;
    panel(0 + 24, hh - 20, [[(q) => Math.sin(2 * Math.PI * f1 * q), col.s[0], 2]], `note 1: ${f1.toFixed(1)} Hz`);
    panel(hh + 8, hh - 20, [[(q) => Math.sin(2 * Math.PI * f2 * q), col.s[2], 2]], `note 2: ${f2.toFixed(1)} Hz`);
    panel(2 * hh - 4, hh + 8, [[(q) => Math.sin(2 * Math.PI * f1 * q) + Math.sin(2 * Math.PI * f2 * q), col.s[3], 2.4]], 'sum, with its envelope (dashed)', true);
  };
  upd();
}
