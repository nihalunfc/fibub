// A laser, atom by atom. Atoms in the tube (grey = ground, bright = excited) are pumped up; a photon passing an excited atom
// can make it emit a clone (stimulated emission), a photon passing a ground atom is absorbed. Mirrors send photons back and forth;
// the right mirror lets a little escape as the beam. Raise the pump: below threshold only sparks, above it the light avalanches.
import { canvas, text, title, row, slider, choice, button, readout, loop, rng, line } from '../kit.js';

const NA = 60;
export default function (host) {
  const R = rng(9);
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'A laser cavity with pumped atoms, photons bouncing between two mirrors and an output beam' });
  let pump = 1.0, refl = 0.9, atoms = [], ph = [], outc = [], tick = 0, hist = [];
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Pump power', min: 0, max: 10, step: 0.1, value: pump, fmt: (v) => v.toFixed(1), oninput: (v) => (pump = v) });
  slider(ctl, { label: 'Output mirror reflectivity', min: 0.5, max: 0.98, step: 0.01, value: refl, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => (refl = v) });
  button(ctl, 'Reset', () => init());
  function init() { atoms = Array.from({ length: NA }, () => ({ x: 0.08 + 0.84 * R(), y: 0.15 + 0.7 * R(), e: R() < 0.1 })); ph = []; outc = []; hist = []; }
  init();
  const anim = loop(host, (dt) => {
    const sub = 3, d = dt / sub;
    for (let s = 0; s < sub; s++) step(d);
    tick += dt; if (tick > 0.1) { tick = 0; hist.push(ph.length); if (hist.length > 60) hist.shift(); show(); }
    cv.redraw();
  });
  anim.button(ctl);
  function step(dt) {
    atoms.forEach((a) => { if (!a.e && R() < pump * 0.35 * dt) a.e = true; else if (a.e && R() < 0.3 * dt) { a.e = false; if (R() < 0.08 && ph.length < 400) ph.push({ x: a.x, y: a.y, d: R() < 0.5 ? 1 : -1 }); } });
    const next = [];
    ph.forEach((p) => {
      const ox = p.x; p.x += p.d * 0.9 * dt;
      let alive = true;
      for (const a of atoms) { if (Math.abs(a.y - p.y) < 0.09 && ((ox < a.x && p.x >= a.x) || (ox > a.x && p.x <= a.x))) { if (a.e && R() < 0.32) { a.e = false; if (ph.length + next.length < 500) next.push({ x: a.x, y: p.y, d: p.d }); } else if (!a.e && R() < 0.32) { a.e = true; alive = false; break; } } }
      if (p.x <= 0.03) { p.x = 0.03; p.d = 1; } if (p.x >= 0.97) { if (R() > refl) { outc.push({ x: 0.97, y: p.y }); alive = false; } else { p.x = 0.97; p.d = -1; } }
      if (alive && R() < 0.5 * dt) alive = false;
      if (alive) next.push(p);
    });
    ph = next; outc.forEach((o) => (o.x += dt * 0.9)); outc = outc.filter((o) => o.x < 1.4);
  }
  function show() {
    const ne = atoms.filter((a) => a.e).length, thr = ne / NA;
    out.innerHTML = `Excited atoms: <b>${Math.round(thr * 100)}%</b> (inversion needs well over half the working atoms up). Photons in the cavity: <b>${ph.length}</b>. ${ph.length > 20 ? 'Lasing: stimulated emission now beats absorption and the losses through the mirror.' : ph.length > 5 ? 'Close to threshold: gain just balances the loss.' : 'Below threshold: photons are lost as fast as they appear.'} A leakier output mirror (lower reflectivity) means higher threshold.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Laser cavity', col);
    const x0 = 22, x1 = w * 0.74, top = 40, bot = h - 70, X = (u) => x0 + u * (x1 - x0), Y = (v) => top + v * (bot - top);
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.1; ctx.fillRect(x0, top, x1 - x0, bot - top); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.line; ctx.strokeRect(x0, top, x1 - x0, bot - top);
    ctx.fillStyle = col.ink; ctx.fillRect(x0 - 6, top - 6, 6, bot - top + 12); ctx.globalAlpha = 0.45; ctx.fillRect(x1, top - 6, 6, bot - top + 12); ctx.globalAlpha = 1;
    text(ctx, '100% mirror', x0, bot + 18, { color: col.muted, size: 10 }); text(ctx, 'partial mirror', x1 + 4, bot + 18, { color: col.muted, size: 10, align: 'center' });
    atoms.forEach((a) => { ctx.beginPath(); ctx.arc(X(a.x), Y(a.y), a.e ? 4.2 : 3, 0, 7); ctx.fillStyle = a.e ? col.s[1] : col.muted; ctx.globalAlpha = a.e ? 1 : 0.5; ctx.fill(); ctx.globalAlpha = 1; });
    ph.forEach((p) => { line(ctx, [[X(p.x) - 5 * p.d, Y(p.y)], [X(p.x) + 5 * p.d, Y(p.y)]], col.s[0], 2.2); });
    outc.forEach((o) => { line(ctx, [[X(o.x), Y(o.y)], [X(o.x) + 9, Y(o.y)]], col.s[0], 2); });
    const bw = Math.min(outc.length, 30); text(ctx, 'beam', x1 + (w - x1) / 2 + 6, Y(0.5), { color: col.s[0], size: 11, weight: 600, align: 'center' });
    // history of photon number
    const hy0 = bot + 30, hh = h - hy0 - 6; ctx.strokeStyle = col.line; ctx.strokeRect(x0, hy0, w - 2 * x0, hh);
    const mx = Math.max(60, ...hist); line(ctx, hist.map((v, i) => [x0 + (i / 60) * (w - 2 * x0), hy0 + hh - (v / mx) * (hh - 4) - 2]), col.s[0], 1.8);
    text(ctx, 'photons in cavity over time', x0 + 4, hy0 + 8, { color: col.muted, size: 9.5 });
  };
  show();
}
