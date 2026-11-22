// Earth's axis wobbles like a spinning top: it sweeps a cone of half-angle 23.4° round the pole of the Sun's path, once in
// about 25,800 years. Drag the year (or press Play) and watch the celestial equator tilt round, the pole point at different
// stars (Thuban, Polaris, Vega) and the equinox slide back along the ecliptic by about 50 arcseconds a year.
import { canvas, text, row, slider, button, readout, loop, title, dot } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';

const D = Math.PI / 180, EPS = 23.44 * D, PERIOD = 25772;
const PH = (yr) => (-Math.PI / 2) - ((yr - 2000) / PERIOD) * 2 * Math.PI + 0.0; // azimuth of the pole round the ecliptic pole; Polaris near yr 2100
const STAR = [['Thuban', -2800], ['Polaris', 2100], ['Alderamin', 7500], ['Vega', 13700]];
export default function (host) {
  let yr = 2000;
  const cv = canvas(host, { aspect: 0.9, max: 450, min: 320, label: 'Earth axis tracing a cone round the pole of the ecliptic with the celestial equator and the equinox moving' });
  const cam = orbit(cv, { yaw: 0.6, pitch: 0.5 });
  const c1 = row(host);
  const sl = slider(c1, { label: 'Year', min: -12000, max: 16000, step: 50, value: yr, fmt: (v) => (v < 0 ? `${-v} BC` : `AD ${v}`), oninput: (v) => { yr = v; show(); } });
  const anim = loop(host, (dt) => { yr += dt * 700; if (yr > 16000) yr = -12000; sl.set(yr); show(); }, { autoplay: false });
  anim.button(c1);
  button(c1, 'Today', () => { yr = 2000; sl.set(yr); show(); });
  const out = readout(host);
  const axis = (y) => { const p = PH(y); return [Math.sin(EPS) * Math.cos(p), Math.cos(EPS), Math.sin(EPS) * Math.sin(p)]; };
  function show() {
    const a = axis(yr), pol = axis(2100), ang = Math.acos(Math.max(-1, Math.min(1, a[0] * pol[0] + a[1] * pol[1] + a[2] * pol[2]))) / D;
    let near = STAR.map(([n, y]) => { const s = axis(y), c = Math.acos(Math.max(-1, Math.min(1, a[0] * s[0] + a[1] * s[1] + a[2] * s[2]))) / D; return [n, c]; }).sort((x, y) => x[1] - y[1])[0];
    out.innerHTML = `<b>${yr < 0 ? -Math.round(yr) + " BC" : "AD " + Math.round(yr)}:</b> the north pole is <b>${near[1].toFixed(0)}°</b> from ${near[0]}${near[1] < 8 ? ', so that is the pole star' : ' (no bright pole star close by)'}. The pole is ${ang.toFixed(0)}° from where it is now. The equinox has slid <b>${(((yr - 2000) * 50.29) / 3600).toFixed(1)}°</b> westward along the ecliptic since 2000 (50.29 arcseconds a year).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Earth’s axis traces a cone (a spinning top)', col);
    const P = cam.proj(w, h, Math.min(w, h) * 0.42, w / 2, h / 2 + 12);
    wire(ctx, P, shapes.ring(1), col.s[1], 1.8);
    const a = axis(yr), up = [0, 1, 0];
    // pole path circle
    wire(ctx, P, [Array.from({ length: 73 }, (_, i) => { const p = (i / 72) * 2 * Math.PI; return [Math.sin(EPS) * Math.cos(p), Math.cos(EPS), Math.sin(EPS) * Math.sin(p)].map((v) => v * 1.0); })], col.muted, 1.2);
    // equator ring: points perpendicular to a
    const u0 = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 0, 1]; let u = [a[1] * u0[2] - a[2] * u0[1], a[2] * u0[0] - a[0] * u0[2], a[0] * u0[1] - a[1] * u0[0]]; const l = Math.hypot(...u); u = u.map((v) => v / l);
    const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
    wire(ctx, P, [Array.from({ length: 73 }, (_, i) => { const t = (i / 72) * 2 * Math.PI; return [0, 1, 2].map((k) => u[k] * Math.cos(t) + v[k] * Math.sin(t)); })], col.s[0], 2);
    // equinox: where the equator crosses the ecliptic: direction a × up
    let eqx = [a[1] * up[2] - a[2] * up[1], a[2] * up[0] - a[0] * up[2], a[0] * up[1] - a[1] * up[0]]; const el = Math.hypot(...eqx); eqx = eqx.map((q) => q / el);
    const E = P(eqx), E2 = P(eqx.map((q) => -q)); dot(ctx, E[0], E[1], 4.5, col.s[2]); text(ctx, 'equinox', E[0] + 7, E[1] - 6, { color: col.s[2], size: 10.5, weight: 700 }); dot(ctx, E2[0], E2[1], 3.5, col.s[2]);
    // Earth and axis
    const C = P([0, 0, 0]); dot(ctx, C[0], C[1], 9, col.soft, col.ink);
    const ax0 = P(a.map((q) => -q * 0.35)), ax1 = P(a.map((q) => q * 1.15)); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax0[0], ax0[1]); ctx.lineTo(ax1[0], ax1[1]); ctx.stroke();
    const e0 = P([0, 0.7, 0]), e1 = P([0, 1.1, 0]); ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.lineTo(e1[0], e1[1]); ctx.stroke(); ctx.restore();
    text(ctx, 'pole of the ecliptic', e1[0], e1[1] - 8, { color: col.muted, size: 10, align: 'center' });
    STAR.forEach(([n, y]) => { const q = P(axis(y).map((c) => c * 1.0)); dot(ctx, q[0], q[1], 3.5, col.s[5]); text(ctx, n, q[0] + 6, q[1] - 5, { color: col.s[5], size: 10 }); });
    text(ctx, 'blue: celestial equator   orange: ecliptic   orange dots: pole stars', 10, h - 10, { color: col.muted, size: 10 });
  };
  show();
}
