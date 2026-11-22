// 4.5 Stretched light. A wave leaves a galaxy and crosses expanding space to us. The grid lines are fixed
// marks in space; as they spread, the wave stretches with them, so the wavelength grows by exactly the factor
// space grew: 1 + z = (size of the universe now) ÷ (size when the light left). Slide how much the universe
// grows during the trip.
import { canvas, text, title, line, dot, row, slider, readout, loop, calm } from '../../kit.js';
import { waveCSS } from '../colour.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 340, min: 250, label: 'A light wave stretching as the space it crosses expands' });
  let grow = 3, t = 0;
  const ctl = row(host);
  const anim = loop(host, (dt) => { t = (t + dt / 6) % 1.15; cv.redraw(); });
  anim.button(ctl);
  slider(ctl, { label: 'Universe grows during the trip by', min: 1, max: 10, step: 0.1, value: grow, fmt: (v) => `${v.toFixed(1)}×`, oninput: (v) => { grow = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    const band = (l) => (l > 750 ? 'infrared' : l >= 380 ? 'visible' : 'ultraviolet');
    const b = 400 * grow, u = 121.6 * grow;
    out.innerHTML = `z = <b>${(grow - 1).toFixed(1)}</b>. Violet light sent at 400 nm arrives at <b>${b.toFixed(0)} nm</b> (${band(b)}); hydrogen's ultraviolet line at 121.6 nm arrives at <b>${u.toFixed(0)} nm</b> (${band(u)}). When the light left, the universe was <b>1/${grow.toFixed(1)}</b> of its size today.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const p = calm() && !anim.playing ? 1 : Math.min(1, t);
    const a = 1 + (grow - 1) * p; // the stretch so far
    const L = 30, R = w - 30, cy = h / 2 + 10;
    // grid marks spread out from the left galaxy
    const gap0 = (R - L) / grow / 6;
    for (let i = 0; i * gap0 * a <= R - L + 1; i++) line(ctx, [[L + i * gap0 * a, 44], [L + i * gap0 * a, h - 34]], col.line, 1);
    // the wave packet: front at x = L + p (R-L); wavelength grows with a
    const front = L + p * (R - L), lam0 = 14, lam = lam0 * a, len = Math.min(front - L, 5 * lam);
    const nm = 400 * a, c = nm <= 750 ? waveCSS(nm) : col.muted;
    const pts = [];
    for (let x = front - len; x <= front; x += 1) pts.push([x, cy - 22 * Math.sin((2 * Math.PI * (front - x)) / lam)]);
    line(ctx, pts, c, 2.2);
    dot(ctx, L, cy, 9, col.s[1]);
    text(ctx, 'galaxy', L, cy + 22, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
    dot(ctx, R, cy, 6, col.s[2]);
    text(ctx, 'us', R, cy + 22, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
    text(ctx, `wavelength now ${a.toFixed(2)}× the start${nm > 750 ? ' (infrared)' : ''}`, w / 2, h - 16, { color: col.ink, size: 12, weight: 600, align: 'center', halo: col.panel });
    title(ctx, 'Space stretches, and the light stretches with it', col);
  };
  show(); cv.redraw();
}
