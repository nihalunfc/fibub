// Plasma oscillation. Shift a slab of electrons a little to the right against the fixed ions: surplus charge appears at the two
// ends, the field E = nex/ε₀ pulls the electrons back, they overshoot, and the slab oscillates at the plasma frequency
// ω_p = √(ne²/ε₀m), set only by the electron density. A wave of lower frequency cannot get through (the electrons move to cancel
// it, so it is reflected); a higher one passes. Slide n from the ionosphere to a metal.
import { canvas, text, row, slider, readout, loop, arrow, dot } from '../kit.js';

export default function (host) {
  let ln = 12, lw = 6.5, t = 0;
  const cv = canvas(host, { aspect: 0.75, max: 360, min: 270, label: 'A slab of electrons oscillating against fixed ions at the plasma frequency' });
  const ctl = row(host), c2 = row(host);
  slider(ctl, { label: 'Electron density n', min: 6, max: 29, value: ln, step: 0.1, fmt: (x) => '10^' + x.toFixed(1) + ' m⁻³', oninput: (x) => { ln = x; upd(); } });
  slider(ctl, { label: 'Test wave frequency', min: 3, max: 16, value: lw, step: 0.1, fmt: (x) => { const f = Math.pow(10, x); return f >= 1e9 ? (f / 1e9).toPrecision(3) + ' GHz' : f >= 1e6 ? (f / 1e6).toPrecision(3) + ' MHz' : (f / 1e3).toPrecision(3) + ' kHz'; }, oninput: (x) => { lw = x; upd(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(c2);
  const out = readout(host);
  const fp = () => 8.98 * Math.sqrt(Math.pow(10, ln)); // Hz, ω_p/2π = 8.98 √n
  function upd() { const f = fp(), fw = Math.pow(10, lw), nm = ln > 26 ? 'a metal: cutoff in the ultraviolet' : ln > 20 ? 'a very dense plasma' : ln >= 10.5 && ln <= 13 ? 'the ionosphere (about 10¹¹ to 10¹²)' : ln > 13 ? 'a laboratory or discharge plasma' : 'a tenuous space plasma';
    out.innerHTML = `f<sub>p</sub> = ω<sub>p</sub>/2π = 8.98√n = <b>${f >= 1e12 ? (f / 1e12).toFixed(1) + ' THz' : f >= 1e9 ? (f / 1e9).toFixed(2) + ' GHz' : f >= 1e6 ? (f / 1e6).toFixed(2) + ' MHz' : (f / 1e3).toFixed(1) + ' kHz'}</b> (${nm}). A wave of ${fw >= 1e12 ? (fw / 1e12).toFixed(2) + ' THz' : fw >= 1e9 ? (fw / 1e9).toFixed(2) + ' GHz' : fw >= 1e6 ? (fw / 1e6).toFixed(2) + ' MHz' : (fw / 1e3).toFixed(1) + ' kHz'} is <b>${fw < f ? 'below f<sub>p</sub>: reflected' : 'above f<sub>p</sub>: transmitted'}</b>. That is why AM radio bounces off the ionosphere (n ~ 10¹²) and FM passes through, and why metals shine.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const L = 40, Rr = w - 40, top = 40, hgt = 80, x = Math.sin(t * 3) * 18;
    ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.25; ctx.fillRect(L, top, Rr - L, hgt); ctx.globalAlpha = 1;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) { const px = L + 16 + i * (Rr - L - 32) / 8, py = top + 14 + j * 26; dot(ctx, px, py, 4, col.s[5]); }
    for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) { const px = L + 16 + i * (Rr - L - 32) / 8 + x, py = top + 14 + j * 26 + 6; dot(ctx, px, py, 3, col.s[0]); }
    // end charges
    const q = Math.abs(x) / 18; ctx.globalAlpha = Math.min(1, q + 0.05); text(ctx, x > 0 ? '−' : '+', Rr + 4, top + 40, { color: x > 0 ? col.s[0] : col.s[5], size: 16, weight: 700 }); text(ctx, x > 0 ? '+' : '−', L - 14, top + 40, { color: x > 0 ? col.s[5] : col.s[0], size: 16, weight: 700 }); ctx.globalAlpha = 1;
    arrow(ctx, w / 2 - 0, top + hgt + 26, w / 2 - x * 3.2, top + hgt + 26, col.s[2], 2.6, 8); text(ctx, 'restoring field E = nex/ε₀', w / 2, top + hgt + 44, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    text(ctx, 'blue: electrons (move), red: fixed ions', 10, 16, { color: col.ink, size: 11.5, weight: 700 });
    // frequency ruler
    const f = Math.log10(fp()), fw = lw, X = (lg) => 30 + (lg - 3) / 26 * (w - 60), y = h - 50;
    ctx.fillStyle = col.line; ctx.fillRect(30, y, w - 60, 4); ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.45; ctx.fillRect(30, y, Math.max(0, X(f) - 30), 4); ctx.globalAlpha = 1; ctx.fillStyle = col.s[2]; ctx.fillRect(X(f) - 1, y - 8, 3, 20); text(ctx, 'f_p', X(f), y - 14, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    dot(ctx, X(fw), y + 2, 6, fw < f ? col.s[1] : col.s[0], col.panel); text(ctx, fw < f ? 'wave: reflected' : 'wave: transmitted', X(fw), y + 20, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'frequency (log scale, 1 kHz → 10¹⁶ Hz)', 10, h - 8, { color: col.muted, size: 10 });
  };
  upd();
}
