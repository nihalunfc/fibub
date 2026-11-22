// The planets in motion with true relative periods (inner solar system, or all eight on a square-root scale): each planet's
// period follows Kepler's third law T² = a³ (years, AU). Drag the speed to watch Mercury lap Earth four times a year; the readout
// ranks periods and shows a³ and T² match, and the speed each planet moves at (v ∝ 1/√a).
import { canvas, text, row, slider, choice, readout, loop, title, dot } from '../kit.js';

const PL = [['Mercury', 0.387, 0.2408], ['Venus', 0.723, 0.6152], ['Earth', 1, 1], ['Mars', 1.524, 1.8808], ['Jupiter', 5.203, 11.862], ['Saturn', 9.537, 29.457], ['Uranus', 19.19, 84.01], ['Neptune', 30.07, 164.8]];
export default function (host) {
  let t = 0, speed = 1, view = 'inner';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Planets orbiting the Sun with their orbital periods obeying Kepler third law' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Show', [['inner', 'Inner planets'], ['all', 'All eight (log scale)']], view, (v) => { view = v; show(); });
  slider(c2, { label: 'Speed', min: 0.1, max: 4, value: speed, log: true, fmt: (v) => `${v.toFixed(2)} years per second`, oninput: (v) => { speed = v; } });
  const anim = loop(host, (dt) => { t += dt * speed * (view === 'all' ? 8 : 1); show(); });
  anim.button(c2);
  const out = readout(host);
  const list = () => PL.filter((p) => view === 'all' || p[1] < 2);
  function show() {
    out.innerHTML = list().map((p) => `${p[0]}: a³ = ${(p[1] ** 3).toFixed(p[1] ** 3 < 100 ? 3 : 0)}, T² = ${(p[2] ** 2).toFixed(p[2] ** 2 < 100 ? 3 : 0)}, speed ${(29.78 / Math.sqrt(p[1])).toFixed(1)} km/s`).join('<br>') + '<br>The two columns match: <b>T² = a³</b> for every planet (T in years, a in AU).' + ` Time elapsed: ${t.toFixed(1)} years.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Orbits to scale (years)', col);
    const cx = w / 2, cy = h / 2 + 8, L = list(), maxA = L[L.length - 1][1], rad = (a) => (view === 'all' ? (Math.log10(a / 0.3) / Math.log10(30.07 / 0.3)) * (Math.min(w, h) * 0.44) + 10 : (a / maxA) * Math.min(w, h) * 0.44);
    dot(ctx, cx, cy, 6, col.s[1]);
    L.forEach((p, i) => { const r = rad(p[1]), th = (t / p[2]) * 2 * Math.PI; ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); const x = cx + r * Math.cos(th), y = cy - r * Math.sin(th); dot(ctx, x, y, p[0] === 'Earth' ? 5 : 4, col.s[i % 8]); text(ctx, p[0], x + 6, y - 6, { color: col.s[i % 8], size: 10, weight: 600 }); });
    text(ctx, view === 'all' ? 'distance drawn on a log scale' : '', 10, h - 10, { color: col.muted, size: 10 });
  };
  show();
}
