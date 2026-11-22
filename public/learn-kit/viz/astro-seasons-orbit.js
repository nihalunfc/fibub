// Earth goes round the Sun with its axis tilted 23.44° towards a fixed direction (drag to turn the 3D view). Move the date and
// watch the bright part of your chosen latitude circle (the daylight part) grow and shrink; the readout gives the Sun's
// declination, day length and noon height. Earth is drawn far too big so you can see the tilt.
import { canvas, text, row, slider, button, readout, loop, title, dot } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';

const D = Math.PI / 180, EPS = 23.44 * D;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ML = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const dateOf = (n) => { let d = Math.floor(n); for (let i = 0; i < 12; i++) { if (d < ML[i]) return `${d + 1} ${MON[i]}`; d -= ML[i]; } return '31 Dec'; };
export default function (host) {
  let n = 171, lat = 40;
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 300, label: 'Earth on its tilted axis at different points of its orbit around the Sun' });
  const cam = orbit(cv, { yaw: 0.2, pitch: 0.75 });
  const c1 = row(host), c2 = row(host);
  const sd = slider(c1, { label: 'Date', min: 0, max: 364, step: 1, value: n, fmt: dateOf, oninput: (v) => { n = v; show(); cv.redraw(); } });
  slider(c1, { label: 'Your latitude', min: -80, max: 80, step: 1, value: lat, fmt: (v) => `${Math.abs(v)}° ${v < 0 ? 'S' : 'N'}`, oninput: (v) => { lat = v; show(); cv.redraw(); } });
  [['Mar equinox', 79], ['Jun solstice', 171], ['Sep equinox', 265], ['Dec solstice', 354]].forEach(([s, d]) => button(c2, s, () => { n = d; sd.set(d); show(); cv.redraw(); }));
  const anim = loop(host, (dt) => { n = (n + dt * 25) % 365; sd.set(n); show(); cv.redraw(); }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  const geo = () => {
    const lam = ((n - 79) / 365.25) * 360 * D, dec = Math.asin(Math.sin(EPS) * Math.sin(lam)), f = lat * D;
    const x = -Math.tan(f) * Math.tan(dec), day = x >= 1 ? 0 : x <= -1 ? 24 : (2 * Math.acos(x) / D) / 15;
    return { lam, dec, day, noon: 90 - Math.abs(lat - dec / D) };
  };
  function show() {
    const g = geo(), dd = g.dec / D;
    out.innerHTML = `<b>${dateOf(n)}:</b> Sun's declination <b>${dd.toFixed(1)}°</b>. At ${Math.abs(lat)}° ${lat < 0 ? 'S' : 'N'}: day <b>${g.day >= 24 ? '24 h (midnight Sun)' : g.day <= 0 ? '0 h (polar night)' : g.day.toFixed(1) + ' h'}</b>, noon Sun <b>${g.noon.toFixed(1)}°</b> high, sunlight per square metre ∝ sin(height) = ${Math.max(0, Math.sin(g.noon * D)).toFixed(2)}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const P = cam.proj(w, h, Math.min(w, h) * 0.44, w / 2, h / 2 + 6);
    title(ctx, 'Earth’s orbit and tilt (not to scale)', col);
    const g = geo(), L = g.lam + Math.PI, E = [Math.cos(L), 0, Math.sin(L)];
    wire(ctx, P, shapes.ring(1), col.line, 1.5);
    const S = P([0, 0, 0]); dot(ctx, S[0], S[1], 12, col.s[1]); text(ctx, 'Sun', S[0], S[1] + 22, { color: col.muted, size: 11, align: 'center' });
    // Earth: axis a (fixed), sun direction s
    const a = [0, Math.cos(EPS), Math.sin(EPS)], s = E.map((v) => -v), re = 0.3;
    const u0 = Math.abs(a[0]) > 0.9 ? [0, 1, 0] : [1, 0, 0];
    let u = [a[1] * u0[2] - a[2] * u0[1], a[2] * u0[0] - a[0] * u0[2], a[0] * u0[1] - a[1] * u0[0]]; const ul = Math.hypot(...u); u = u.map((v) => v / ul);
    const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
    const pt = (la, t) => [0, 1, 2].map((k) => E[k] + re * (Math.sin(la) * a[k] + Math.cos(la) * (Math.cos(t) * u[k] + Math.sin(t) * v[k])));
    const C = P(E), R = (P([E[0] + re, E[1], E[2]])[0] - C[0]);
    ctx.beginPath(); ctx.arc(C[0], C[1], Math.abs(R), 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke();
    // equator and chosen latitude: bright where it is in daylight
    const circ = (la, c, lw) => { for (let i = 0; i < 72; i++) { const t0 = (i / 72) * 2 * Math.PI, t1 = ((i + 1) / 72) * 2 * Math.PI, p0 = pt(la, t0), p1 = pt(la, t1); const day = ((p0[0] - E[0]) * s[0] + (p0[1] - E[1]) * s[1] + (p0[2] - E[2]) * s[2]) > 0; const q0 = P(p0), q1 = P(p1); ctx.strokeStyle = day ? c : col.line; ctx.lineWidth = day ? lw : 1.2; ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke(); } };
    circ(0, col.muted, 1.5); circ(lat * D, col.s[1], 3.5);
    const n0 = P(pt(Math.PI / 2 * 1.9, 0)), n1 = P([E[0] + a[0] * re * 1.9, E[1] + a[1] * re * 1.9, E[2] + a[2] * re * 1.9]), s1 = P([E[0] - a[0] * re * 1.5, E[1] - a[1] * re * 1.5, E[2] - a[2] * re * 1.5]);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s1[0], s1[1]); ctx.lineTo(n1[0], n1[1]); ctx.stroke();
    text(ctx, 'N', n1[0] + 6, n1[1] - 4, { color: col.ink, size: 11, weight: 700 });
    // the fixed direction of the axis, at the edge
    const pl = P([0, 1.3 * Math.cos(EPS), 1.3 * Math.sin(EPS)]); text(ctx, 'axis always points here (Polaris)', pl[0], pl[1] - 6, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'bright circle = your latitude in daylight', 10, h - 12, { color: col.s[1], size: 10.5, weight: 600 });
  };
  show();
}
