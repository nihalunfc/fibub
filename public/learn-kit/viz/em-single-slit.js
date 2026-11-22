// Diffraction by one slit, and by two slits of finite width. Narrow the slit and the central bright band spreads: the first
// dark point is at sinθ = λ/a. For two slits the narrow fringes (spacing λD/d) sit inside the single-slit envelope, so some
// fringes go missing where the envelope is zero. The screen picture and the graph show the same intensity, I ∝ sinc²β cos²α with
// β = πa sinθ/λ, α = πd sinθ/λ. Screen 1 m away.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../kit.js';

const bandOf = (l) => (l < 440 ? 3 : l < 480 ? 0 : l < 520 ? 4 : l < 565 ? 2 : l < 590 ? 6 : l < 625 ? 1 : 5);
export default function (host) {
  let kind = 'one', a = 40, lam = 550, d = 200;
  const cv = canvas(host, { aspect: 0.75, max: 360, min: 260, label: 'Single-slit and double-slit intensity patterns on a screen' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Slits', [['one', 'One slit'], ['two', 'Two slits (finite width)']], kind, (v) => { kind = v; upd(); });
  slider(c2, { label: 'Slit width a', min: 10, max: 150, value: a, step: 1, fmt: (x) => x + ' µm', oninput: (x) => { a = x; if (d < 2 * a) { d = 2 * a; sd.set(d); } upd(); } });
  slider(c2, { label: 'Wavelength λ', min: 400, max: 700, value: lam, step: 5, fmt: (x) => x + ' nm', oninput: (x) => { lam = x; upd(); } });
  const sd = slider(c2, { label: 'Slit separation d', min: 60, max: 600, value: d, step: 5, fmt: (x) => x + ' µm', oninput: (x) => { d = Math.max(x, 2 * a); upd(); } });
  const out = readout(host);
  const X = 8e-3; // half-width of the screen shown, metres
  const Iat = (x) => { const s = x / 1, be = Math.PI * a * 1e-6 * s / (lam * 1e-9), al = Math.PI * d * 1e-6 * s / (lam * 1e-9), sc = Math.abs(be) < 1e-9 ? 1 : (Math.sin(be) / be) ** 2; return kind === 'one' ? sc : sc * Math.cos(al) ** 2; };
  function upd() { const w0 = 2 * lam * 1e-9 / (a * 1e-6) * 1e3; out.innerHTML = `First dark point: sinθ = λ/a = ${(lam * 1e-9 / (a * 1e-6)).toFixed(4)}, so the central band is <b>${w0.toFixed(1)} mm</b> wide on a screen 1 m away (width = 2λD/a). ${kind === 'two' ? `Fringe spacing λD/d = <b>${(lam * 1e-9 / (d * 1e-6) * 1e3).toFixed(2)} mm</b>; d/a = ${(d / a).toFixed(2)}: ${Number.isInteger(+(d / a).toFixed(6)) ? 'every ' + (d / a).toFixed(0) + 'th order is missing (it falls on a zero of the envelope).' : 'about ' + (2 * d / a).toFixed(0) + ' fringes fit in the central band.'}` : 'Halve the slit width and the pattern doubles in width: narrower opening, more spreading.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const G = axes(ctx, w, h, col, { x: [-X * 1e3, X * 1e3], y: [0, 1.05], xlabel: 'position on screen (mm)', ylabel: 'intensity', l: 44, t: 70, b: 38, yt: [0, 1], fy: (v) => v, xt: [-8, -4, 0, 4, 8] });
    const pts = Array.from({ length: 321 }, (_, i) => { const x = -X + 2 * X * i / 320; return [G.X(x * 1e3), G.Y(Iat(x))]; });
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineTo(G.R, G.B); ctx.lineTo(G.L, G.B); ctx.closePath(); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[bandOf(lam)]; ctx.fill(); ctx.globalAlpha = 1; line(ctx, pts, col.s[bandOf(lam)], 2.2);
    if (kind === 'two') line(ctx, Array.from({ length: 161 }, (_, i) => { const x = -X + 2 * X * i / 160, be = Math.PI * a * 1e-6 * x / (lam * 1e-9); return [G.X(x * 1e3), G.Y(Math.abs(be) < 1e-9 ? 1 : (Math.sin(be) / be) ** 2)]; }), col.muted, 1.4, [4, 3]);
    // the screen strip
    const sy = 26, sh = 30; ctx.fillStyle = '#000'; ctx.fillRect(G.L, sy, G.R - G.L, sh);
    for (let px = G.L; px < G.R; px += 1) { const x = (-X + 2 * X * (px - G.L) / (G.R - G.L)); ctx.globalAlpha = Math.min(1, Iat(x)); ctx.fillStyle = col.s[bandOf(lam)]; ctx.fillRect(px, sy, 1.2, sh); } ctx.globalAlpha = 1;
    text(ctx, kind === 'two' ? 'dashed: single-slit envelope' : 'screen (bright = light)', G.L + 4, sy + sh + 10, { color: col.muted, size: 10 });
  };
  upd();
}
