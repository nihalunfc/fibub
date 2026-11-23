// A star and its planet both orbit their common centre of mass, so the star wobbles and its light is Doppler shifted: blue
// when it moves towards us, red when away. Choose planet mass, period and orbit shape; the curve is the radial velocity we
// would measure from the side. The star's wobble is drawn much bigger than it really is. Jupiter makes the Sun wobble 12.5 m/s.
import { canvas, text, row, slider, readout, loop, axes, line, dot, title, button } from '../kit.js';

const D = Math.PI / 180;
export default function (host) {
  let mp = 1, per = 365, e = 0, M = 0;
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'A planet and star orbiting their centre of mass, with the star velocity curve below' });
  const c1 = row(host), c2 = row(host);
  slider(c1, { label: 'Planet mass', min: 0.1, max: 15, step: 0.1, value: mp, fmt: (v) => `${v.toFixed(1)} Jupiters`, oninput: (v) => { mp = v; show(); } });
  slider(c1, { label: 'Period', min: 3, max: 1500, value: per, log: true, fmt: (v) => `${v < 100 ? v.toFixed(0) : Math.round(v)} days`, oninput: (v) => { per = v; show(); } });
  slider(c1, { label: 'Orbit shape (eccentricity)', min: 0, max: 0.8, step: 0.01, value: e, fmt: (v) => v.toFixed(2), oninput: (v) => { e = v; show(); } });
  [['Jupiter (Sun)', 1, 4333], ['Hot Jupiter', 1, 3.5], ['Earth', 0.00315, 365]].forEach(([n, m, p]) => button(c2, n, () => { mp = m; per = p; show(); }));
  const anim = loop(host, (dt) => { M += dt * 2 * Math.PI / 5; show(); });
  anim.button(c2);
  const out = readout(host);
  const K = () => 28.4 * mp * Math.pow(per / 365.25, -1 / 3) / Math.sqrt(1 - e * e);
  const kep = (Mm) => { let E = Mm; for (let i = 0; i < 12; i++) E -= (E - e * Math.sin(E) - Mm) / (1 - e * Math.cos(E)); return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2)); };
  const OM = 0.8, rv = (Mm) => { const nu = kep(Mm); return K() * (Math.cos(nu + OM) + e * Math.cos(OM)); };
  function show() {
    out.innerHTML = `The star's speed changes by <b>K = ${K() < 1 ? K().toFixed(2) : K().toFixed(1)} m/s</b>${K() < 1 ? ' (far too small for today\'s best spectrographs, about 0.3 m/s)' : K() < 3 ? ' (at the limit of the best instruments)' : ''}. The curve repeats every ${per < 100 ? per.toFixed(0) : Math.round(per)} days. A bigger planet or a shorter period gives a bigger K; an elliptical orbit makes the curve lopsided. Seen face-on there is no wobble towards us at all, so this gives only a minimum mass.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Star and planet around their centre of mass', col);
    const cx = w / 2, cy = 30 + h * 0.2, R = Math.min(h * 0.17, w * 0.3), ra = 0.18 + 0.1 * Math.min(1, mp / 10);
    const nu = kep(M), r = (1 - e * e) / (1 + e * Math.cos(nu)), px = cx + R * r * Math.cos(nu + OM), py = cy - R * r * Math.sin(nu + OM);
    ctx.strokeStyle = col.line; ctx.beginPath(); for (let i = 0; i <= 90; i++) { const t = (i / 90) * 2 * Math.PI, rr = (1 - e * e) / (1 + e * Math.cos(t)); ctx[i ? 'lineTo' : 'moveTo'](cx + R * rr * Math.cos(t + OM), cy - R * rr * Math.sin(t + OM)); } ctx.stroke();
    // star wobble: opposite the planet from the centre of mass, enlarged
    const sx = cx - (px - cx) * ra, sy = cy - (py - cy) * ra, v = rv(M), mag = Math.max(-1, Math.min(1, v / (K() || 1)));
    const sc = mag > 0 ? `rgb(${200 + Math.round(40 * mag)},${90 - 40 * mag},60)` : `rgb(70,${130 - Math.round(40 * mag)},${200 - Math.round(40 * mag)})`;
    dot(ctx, cx, cy, 2.5, col.ink); dot(ctx, sx, sy, 10, sc); dot(ctx, px, py, 4.5, col.s[2]);
    text(ctx, 'star', sx + 12, sy - 6, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'planet', px + 8, py - 6, { color: col.s[2], size: 11, weight: 700 });
    text(ctx, 'centre of mass', cx + 5, cy + 12, { color: col.muted, size: 9.5 });
    text(ctx, mag > 0.15 ? 'star moving away: light shifted RED' : mag < -0.15 ? 'star moving towards us: light shifted BLUE' : 'star moving across the line of sight', 10, cy + R * 1.4 + 6, { color: mag > 0.15 ? col.bad : mag < -0.15 ? col.s[0] : col.muted, size: 11, weight: 700 });
    const A = axes(ctx, w, h, col, { x: [0, 2], y: [-1.2, 1.2], t: cy + R * 1.4 + 22, l: 48, b: 34, xlabel: 'time (orbits)', ylabel: 'star velocity ÷ K', xt: [0, 1, 2], yt: [-1, 0, 1], fx: (q) => q, fy: (q) => q });
    const pts = []; for (let i = 0; i <= 160; i++) { const t = (i / 160) * 2; pts.push([A.X(t), A.Y(rv(2 * Math.PI * t) / (K() || 1))]); }
    line(ctx, pts, col.s[0], 2.2);
    const tt = ((M / (2 * Math.PI)) % 2 + 2) % 2; dot(ctx, A.X(tt), A.Y(v / (K() || 1)), 5.5, col.s[5], col.panel);
  };
  show();
}
